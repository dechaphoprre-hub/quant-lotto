-- "Numbers from the news/folklore" (accident plates, a celebrity's
-- birthdate, a viral event) is a real, high-traffic genre for Thai lottery
-- sites, but it is social belief, not statistics. Rather than hardcode
-- fabricated examples into the frontend (the same mistake the old proof
-- ledger made), this is real admin-submitted content with a real source
-- note, rendered in its own clearly-labelled section, separate from the
-- Quant Engine.
--
-- Lower stakes than an official draw result, so unlike draw_corrections
-- this does not require a second admin's approval — any signed-in
-- EDITOR/ADMIN can post one directly, and it is publicly readable
-- immediately with its source note attached.
create table if not exists public.belief_numbers (
  id uuid primary key default gen_random_uuid(),
  market_code text references public.markets(code),
  headline text not null,
  numbers text[] not null,
  source_note text not null,
  submitted_by uuid not null references auth.users(id) default auth.uid(),
  created_at timestamptz not null default now()
);

create index if not exists belief_numbers_market_idx on public.belief_numbers (market_code, created_at desc);

alter table public.belief_numbers enable row level security;

create policy "public can read belief numbers" on public.belief_numbers for select using (true);

create policy "editors and admins can post belief numbers" on public.belief_numbers
  for insert with check (public.is_editor_or_admin() and submitted_by = auth.uid());
