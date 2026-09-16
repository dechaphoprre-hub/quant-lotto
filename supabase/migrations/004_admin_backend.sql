-- Admin roles, granted only by an operator holding the service-role key
-- (there is deliberately no insert/update/delete policy below, so no
-- authenticated user can grant themselves or anyone else a role).
create table if not exists public.admin_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('ADMIN', 'EDITOR')),
  created_at timestamptz not null default now()
);

alter table public.admin_roles enable row level security;
create policy "users can read their own role" on public.admin_roles for select using (auth.uid() = user_id);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admin_roles where user_id = auth.uid() and role = 'ADMIN');
$$;

create or replace function public.is_editor_or_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admin_roles where user_id = auth.uid() and role in ('ADMIN', 'EDITOR'));
$$;

-- Proposed manual draw corrections. A signed-in EDITOR/ADMIN can submit
-- one; it never touches public.draws until a *different* ADMIN approves
-- it (see policies and triggers below). This is the only path for a
-- human to publish a result outside the automated GLO ingestion.
create table if not exists public.draw_corrections (
  id uuid primary key default gen_random_uuid(),
  market_code text not null references public.markets(code),
  draw_date date not null,
  draw_number text not null,
  top_prize text not null,
  two_digit_top text not null,
  two_digit_bottom text not null,
  three_digit_top text,
  three_digit_front text[] not null default '{}',
  three_digit_back text[] not null default '{}',
  reason text not null,
  status text not null check (status in ('PENDING', 'APPROVED', 'REJECTED')) default 'PENDING',
  submitted_by uuid not null references auth.users(id) default auth.uid(),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists draw_corrections_status_idx on public.draw_corrections (status);

alter table public.draw_corrections enable row level security;

create policy "editors and admins can submit corrections" on public.draw_corrections
  for insert with check (public.is_editor_or_admin() and submitted_by = auth.uid());

create policy "submitters see their own, admins see all" on public.draw_corrections
  for select using (submitted_by = auth.uid() or public.is_admin());

-- An admin can approve or reject any PENDING correction except their own —
-- the submitter of a correction can never be the one who approves it.
create policy "admins review pending corrections from others" on public.draw_corrections
  for update using (public.is_admin() and status = 'PENDING' and submitted_by <> auth.uid())
  with check (status in ('APPROVED', 'REJECTED'));

-- Stamp who reviewed a correction and when, from the server-trusted
-- auth.uid() rather than trusting whatever the client sends.
create or replace function public.stamp_draw_correction_review()
returns trigger
language plpgsql
as $$
begin
  if new.status in ('APPROVED', 'REJECTED') and old.status = 'PENDING' then
    new.reviewed_by := auth.uid();
    new.reviewed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists draw_corrections_stamp_review on public.draw_corrections;
create trigger draw_corrections_stamp_review
  before update on public.draw_corrections
  for each row execute function public.stamp_draw_correction_review();

-- Apply an approved correction to the real draws table and record it in
-- audit_logs. security definer lets this run despite public.draws having
-- no insert/update policy for authenticated users — the only way a draw
-- can be written outside the service-role ingestion worker is through
-- this exact approve step, which is itself gated by the policies above.
create or replace function public.apply_draw_correction()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  manual_source_id uuid;
  target_id text;
  before_row jsonb;
begin
  if new.status <> 'APPROVED' or old.status = 'APPROVED' then
    return new;
  end if;

  select id into manual_source_id from public.data_sources
    where market_code = new.market_code and source_type = 'MANUAL'
    limit 1;
  if manual_source_id is null then
    raise exception 'No MANUAL data_sources row configured for market %; add one before approving corrections.', new.market_code;
  end if;

  target_id := public.draw_id_for(new.market_code, new.draw_date);
  select to_jsonb(d) into before_row from public.draws d where d.id = target_id;

  insert into public.draws (
    id, market_code, draw_date, draw_number, top_prize, two_digit_top, two_digit_bottom,
    three_digit_top, three_digit_front, three_digit_back,
    verification_status, source_id, fetched_at, verified_at
  ) values (
    target_id, new.market_code, new.draw_date, new.draw_number, new.top_prize,
    new.two_digit_top, new.two_digit_bottom, new.three_digit_top, new.three_digit_front, new.three_digit_back,
    'VERIFIED', manual_source_id, now(), now()
  )
  on conflict (id) do update set
    draw_number = excluded.draw_number,
    top_prize = excluded.top_prize,
    two_digit_top = excluded.two_digit_top,
    two_digit_bottom = excluded.two_digit_bottom,
    three_digit_top = excluded.three_digit_top,
    three_digit_front = excluded.three_digit_front,
    three_digit_back = excluded.three_digit_back,
    verification_status = 'VERIFIED',
    source_id = manual_source_id,
    verified_at = now(),
    updated_at = now();

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, before_value, after_value)
  values (new.reviewed_by, 'MANUAL_DRAW_CORRECTION_APPLIED', 'draws', target_id, before_row, to_jsonb(new));

  return new;
end;
$$;

drop trigger if exists draw_corrections_apply_on_approve on public.draw_corrections;
create trigger draw_corrections_apply_on_approve
  after update on public.draw_corrections
  for each row execute function public.apply_draw_correction();

-- One MANUAL data source per market so an approved correction has
-- somewhere to attribute provenance to. Starts UNVERIFIED; an operator
-- should only flip it to VERIFIED once they trust who holds ADMIN/EDITOR.
insert into public.data_sources (market_code, name, source_type, trust_status, url)
select code, 'Manual operator correction', 'MANUAL', 'UNVERIFIED', 'internal://manual-correction/' || lower(code)
from public.markets
on conflict (market_code, url) do nothing;
