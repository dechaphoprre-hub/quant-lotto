create extension if not exists pgcrypto;

create table if not exists public.markets (
  code text primary key check (code in ('THAI', 'LAO', 'HANOI', 'HANOI_VIP')),
  name text not null,
  timezone text not null,
  schedule text not null,
  created_at timestamptz not null default now()
);

insert into public.markets (code, name, timezone, schedule) values
  ('THAI', 'Thai Government Lottery', 'Asia/Bangkok', '1st and 16th of month'),
  ('LAO', 'Lao Lottery', 'Asia/Vientiane', 'Provider-configured schedule'),
  ('HANOI', 'Hanoi Regular Lottery', 'Asia/Ho_Chi_Minh', 'Daily'),
  ('HANOI_VIP', 'Hanoi VIP Lottery', 'Asia/Ho_Chi_Minh', 'Provider-configured schedule')
on conflict (code) do nothing;

create table if not exists public.data_sources (
  id uuid primary key default gen_random_uuid(),
  market_code text not null references public.markets(code),
  name text not null,
  source_type text not null check (source_type in ('PRIMARY', 'SECONDARY', 'MANUAL')),
  trust_status text not null check (trust_status in ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REVOKED')) default 'PENDING',
  url text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (market_code, url)
);

create table if not exists public.draws (
  id text primary key,
  market_code text not null references public.markets(code),
  draw_date date not null,
  draw_number text not null,
  top_prize text not null,
  two_digit_top text not null,
  two_digit_bottom text not null,
  three_digit_top text,
  three_digit_front text[] not null default '{}',
  three_digit_back text[] not null default '{}',
  verification_status text not null check (verification_status in ('PENDING', 'VERIFIED', 'REJECTED')) default 'PENDING',
  source_id uuid references public.data_sources(id),
  content_hash text,
  fetched_at timestamptz,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (market_code, draw_date)
);

create index if not exists draws_market_date_idx on public.draws (market_code, draw_date desc);
create index if not exists draws_status_idx on public.draws (verification_status);

create table if not exists public.draw_observations (
  id uuid primary key default gen_random_uuid(),
  draw_id text references public.draws(id) on delete cascade,
  source_id uuid not null references public.data_sources(id),
  raw_payload jsonb not null,
  payload_hash text not null,
  observed_at timestamptz not null default now(),
  reconciliation_status text not null check (reconciliation_status in ('PENDING', 'MATCHED', 'CONFLICT', 'REJECTED')) default 'PENDING',
  unique (source_id, payload_hash)
);

create table if not exists public.ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  market_code text not null references public.markets(code),
  source_id uuid references public.data_sources(id),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null check (status in ('RUNNING', 'SUCCEEDED', 'PARTIAL', 'FAILED')),
  records_seen integer not null default 0,
  records_accepted integer not null default 0,
  records_rejected integer not null default 0,
  error_message text
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id text not null,
  before_value jsonb,
  after_value jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  market_code text references public.markets(code),
  slot text not null check (slot in ('TOP_BANNER', 'INLINE', 'SIDEBAR', 'FOOTER')),
  label text not null default 'SPONSORED',
  image_url text not null,
  target_url text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

alter table public.markets enable row level security;
alter table public.data_sources enable row level security;
alter table public.draws enable row level security;
alter table public.ad_campaigns enable row level security;
alter table public.draw_observations enable row level security;
alter table public.ingestion_runs enable row level security;
alter table public.audit_logs enable row level security;

create policy "public can read markets" on public.markets for select using (true);
create policy "public can read verified draws" on public.draws for select using (verification_status = 'VERIFIED');
create policy "public can read active ads" on public.ad_campaigns for select using (
  active = true and now() between starts_at and ends_at
);

-- All writes and access to raw observations, ingestion runs, and audit logs use the server-side service role.
-- Do not expose the service-role key to GitHub Pages or the browser.
