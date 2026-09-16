# Production Runbook

## Required services

- Supabase project using `supabase/migrations/001_production_schema.sql`
- A server-side ingestion worker with provider credentials
- A public read API matching `docs/data-api-contract.md`
- GitHub Pages for the static frontend

## Release gates

1. Every published draw has a source, fetch time, content hash, and verification status.
2. Only `VERIFIED` draws are returned by the public API.
3. Provider conflicts create a `CONFLICT` observation and do not overwrite a verified draw automatically.
4. No service-role key or provider credential is present in the frontend bundle.
5. The API returns a non-empty, schema-valid dataset for every enabled market.
6. The ingestion run and audit log show a successful run after the last provider update.

## GitHub configuration

Set the repository variable:

```text
VITE_DATA_API_BASE_URL=https://your-read-api.example.com
VITE_SUPABASE_URL=https://tbcusnsezimacqbmglcb.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key
```

The frontend can use Supabase REST directly when `VITE_DATA_API_BASE_URL` is empty. Keep the publishable key protected by RLS; never set a service-role key in a `VITE_*` variable.

Set provider credentials only in the ingestion worker or Supabase Edge Function secrets. Never put them in `VITE_*` variables.

For the Thai GLO ingestion workflow, add this GitHub Actions secret:

```text
SUPABASE_SERVICE_ROLE_KEY=<Supabase service-role key>
```

The worker uses it only inside GitHub Actions to write verified draws, observations, and ingestion-run status. It must never be exposed as a `VITE_*` variable.

## Backfilling historical Thai draws

`npm run backfill:glo` fetches each historical draw directly from the live GLO API (never from the bundled `src/data/lotteryData.ts` snapshot, which is unverified sample data) and upserts it into Supabase the same way the scheduled ingestion workflow does.

```text
SUPABASE_URL=<project ref>
SUPABASE_SERVICE_ROLE_KEY=<service-role key>
BACKFILL_START_DATE=YYYY-MM-DD   # earliest draw date to backfill
BACKFILL_END_DATE=YYYY-MM-DD     # optional, defaults to today
BACKFILL_DELAY_MS=2000           # optional, delay between GLO requests
```

Draws that are already `VERIFIED` in Supabase are skipped automatically, so the command is safe to re-run. GLO draws publish on the 1st and 16th of each month; the script derives candidate dates from that schedule and reports a pass/fail count per date at the end.

## Current limitation

The repository contains the schema and frontend contract, but no provider credentials or verified Lao/Hanoi VIP source. Those markets must remain unavailable or explicitly marked unverified until a source is configured.
