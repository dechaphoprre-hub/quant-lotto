-- Verifiable pre-commitment ledger for the prediction engine.
-- A row is written with its prediction and commitment hash BEFORE the
-- draw it targets happens, and is only ever scored (match_type/scored_at)
-- after a VERIFIED draw exists for that date. Rows are never edited to
-- change a prediction after the fact; the (market_code, draw_date)
-- uniqueness makes a second commitment for the same draw impossible.
create table if not exists public.proof_records (
  id uuid primary key default gen_random_uuid(),
  market_code text not null references public.markets(code),
  draw_date date not null,
  predicted_top5 text[] not null,
  commitment_hash text not null,
  generated_at timestamptz not null default now(),
  draw_id text references public.draws(id),
  match_type text check (match_type in ('DIRECT_HIT', 'REVERSE_HIT', 'CLOSE_CALL', 'MISS')),
  scored_at timestamptz,
  created_at timestamptz not null default now(),
  unique (market_code, draw_date)
);

create index if not exists proof_records_market_date_idx on public.proof_records (market_code, draw_date desc);

alter table public.proof_records enable row level security;

-- The prediction and its hash are public from the moment they are generated
-- (that is what makes the pre-commitment verifiable); only server-side
-- writes with the service-role key can ever insert or score a row.
create policy "public can read proof records" on public.proof_records for select using (true);
