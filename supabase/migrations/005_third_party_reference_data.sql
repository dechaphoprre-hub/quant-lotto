-- There is no official government API for Lao or Vietnamese (Hanoi)
-- lottery results the way GLO is for Thailand. To publish those markets
-- honestly, a correction can now be filed as a third-party reference
-- (not officially confirmed) rather than forcing everything through the
-- same 'VERIFIED' tier as an automated, government-sourced draw.
alter table public.draw_corrections
  add column if not exists is_officially_confirmed boolean not null default false;

-- Publish PENDING draws too (previously only VERIFIED was public), so a
-- third-party-referenced result can actually reach the site. REJECTED
-- stays hidden. The frontend is responsible for rendering PENDING
-- distinctly with a "not officially verified" disclaimer — this policy
-- change alone does not claim anything about accuracy.
drop policy if exists "public can read verified draws" on public.draws;
create policy "public can read published draws" on public.draws
  for select using (verification_status in ('VERIFIED', 'PENDING'));

-- Approving a correction now sets VERIFIED only when the submitter
-- attested it as an officially confirmed result; otherwise it publishes
-- as PENDING (third-party reference, not officially verified).
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
  resolved_status text;
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

  resolved_status := case when new.is_officially_confirmed then 'VERIFIED' else 'PENDING' end;
  target_id := public.draw_id_for(new.market_code, new.draw_date);
  select to_jsonb(d) into before_row from public.draws d where d.id = target_id;

  insert into public.draws (
    id, market_code, draw_date, draw_number, top_prize, two_digit_top, two_digit_bottom,
    three_digit_top, three_digit_front, three_digit_back,
    verification_status, source_id, fetched_at, verified_at
  ) values (
    target_id, new.market_code, new.draw_date, new.draw_number, new.top_prize,
    new.two_digit_top, new.two_digit_bottom, new.three_digit_top, new.three_digit_front, new.three_digit_back,
    resolved_status, manual_source_id, now(), case when resolved_status = 'VERIFIED' then now() else null end
  )
  on conflict (id) do update set
    draw_number = excluded.draw_number,
    top_prize = excluded.top_prize,
    two_digit_top = excluded.two_digit_top,
    two_digit_bottom = excluded.two_digit_bottom,
    three_digit_top = excluded.three_digit_top,
    three_digit_front = excluded.three_digit_front,
    three_digit_back = excluded.three_digit_back,
    verification_status = resolved_status,
    source_id = manual_source_id,
    verified_at = case when resolved_status = 'VERIFIED' then now() else public.draws.verified_at end,
    updated_at = now();

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, before_value, after_value)
  values (new.reviewed_by, 'MANUAL_DRAW_CORRECTION_APPLIED', 'draws', target_id, before_row, to_jsonb(new));

  return new;
end;
$$;
