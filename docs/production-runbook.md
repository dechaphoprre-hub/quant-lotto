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

## Proof-of-algorithm ledger (integrity requirement)

The "Proof of Algorithm" tab must only ever show real, pre-committed predictions reconciled against real verified draws. It reads `public.proof_records` directly from Supabase and shows an honest empty state when there is no scored history yet — it must never fall back to bundled or fabricated sample data.

- `npm run generate:proof` computes a Top-5 prediction from only the verified draws known so far, hashes it, and inserts it into `proof_records` before the next draw happens. It is chained after `npm run ingest:glo` in `.github/workflows/ingest-glo.yml`, so a fresh prediction is committed right after each draw is ingested, for the draw after that.
- Scoring against the real result happens automatically inside the GLO ingestion (`scripts/lib/glo.ts`) the moment that draw's result is verified; a proof record is never edited to change its prediction after it was committed.

## Laos / Hanoi / Hanoi VIP: no official API exists

Unlike Thailand's GLO, there is no official government API for Lao or Vietnamese (Hanoi) lottery results. Wiring an automated scraper against an unverified third-party site and marking it `VERIFIED` would misrepresent it as government-confirmed, which this project treats as a hard no (see "no fabricated data" throughout this file).

Instead, `draws.verification_status` now has a real third tier the frontend renders honestly:

- `VERIFIED` — automated, government-sourced (GLO today), or an admin attested `is_officially_confirmed = true` on a correction.
- `PENDING` — published, but only backed by a manual correction citing a third-party reference (`is_officially_confirmed = false`, the default). The site shows an amber "reference data, not officially confirmed" banner on it.
- `DEMO` (frontend-only, not a database value) — the bundled sample dataset, shown with a red "sample data, not a real result" banner whenever no live Supabase row exists yet for that market. This is the honest state Laos/Hanoi/Hanoi VIP are in today, and Thai will fall back to it too until `backfill:glo` actually runs.

To get Laos/Hanoi/Hanoi VIP results onto the site today: an operator checks whatever third-party source they trust, submits it via the admin console (leaving "officially confirmed" unchecked) citing that source in the reason field, and a different admin approves it — publishing as `PENDING` with the disclaimer, never silently as `VERIFIED`. If a genuine official/primary source for one of these markets is identified later, build an automated ingestion script the same shape as `scripts/lib/glo.ts` and use `is_officially_confirmed = true` (or automate it directly with `verification_status = 'VERIFIED'`) instead.

## Admin backend (real auth, approval, and audit trail)

The operator console (`Ctrl/Cmd+Shift+A`, gated by `VITE_ADMIN_CONSOLE_ENABLED`) no longer has a client-side PIN or any ability to write to the browser's local storage as if it were production data. It signs in against real Supabase Auth, and every write is enforced by Postgres row-level security, not by frontend logic:

1. Create a real user in Supabase Auth (dashboard → Authentication → Users, or invite by email).
2. Grant them a role with the service-role key: `insert into admin_roles (user_id, role) values ('<uuid>', 'EDITOR');` (or `'ADMIN'`). There is no self-service way to grant a role — this is intentional.
3. An `EDITOR` or `ADMIN` can submit a manual draw correction (with a reason) from the console. It lands in `draw_corrections` with `status = 'PENDING'` and is not public yet.
4. A *different* `ADMIN` (never the submitter — RLS blocks self-approval) approves or rejects it from the same console. Approval triggers a Postgres function that writes the real `draws` row and an `audit_logs` entry in the same transaction.
5. Before the first correction for a market can be approved, `data_sources` needs a row with `source_type = 'MANUAL'` for that market (migration `004_admin_backend.sql` seeds one per market as `UNVERIFIED`); flip it to `VERIFIED` once you trust who holds `ADMIN`/`EDITOR`.

## Sponsor banners (real revenue, no fabricated traffic)

`public.ad_campaigns` already has an RLS policy exposing only rows that are `active` and inside `[starts_at, ends_at]`. `src/components/BannerAd.tsx` renders whatever is currently active for a slot, or nothing at all — there is no placeholder "estimated revenue" banner in production. To sell and run a real sponsor slot: insert a row into `ad_campaigns` with the service-role key once a sponsor is signed, and let it expire naturally via `ends_at`.

Do not attempt to inflate traffic, view counts, or analytics shown to prospective sponsors or ad networks — grow real traffic (shareable results, SEO, a real LINE OA) instead; most ad networks ban gambling-adjacent content that overclaims prediction accuracy or falsifies traffic, and will suspend the account permanently if they detect either.

## Current limitation

The repository contains the schema and frontend contract, but no provider credentials or verified Lao/Hanoi VIP source. Those markets must remain unavailable or explicitly marked unverified until a source is configured.
