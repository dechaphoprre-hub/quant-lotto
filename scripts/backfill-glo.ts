import { createSupabaseApi, ingestThaiGloDraw } from './lib/glo.ts';

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const startDate = process.env.BACKFILL_START_DATE;
const endDate = process.env.BACKFILL_END_DATE || new Date().toISOString().slice(0, 10);
const delayMs = Number(process.env.BACKFILL_DELAY_MS || 2000);

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
}
if (!startDate) {
  throw new Error('Set BACKFILL_START_DATE (YYYY-MM-DD) to the earliest draw date to backfill.');
}

const api = createSupabaseApi({ supabaseUrl, serviceRoleKey });

// Thai GLO draws are published on the 1st and 16th of every month.
const candidateDrawDates = (start: string, end: string): string[] => {
  const startDay = new Date(`${start}T00:00:00Z`);
  const endDay = new Date(`${end}T00:00:00Z`);
  const dates: string[] = [];
  const monthCursor = new Date(Date.UTC(startDay.getUTCFullYear(), startDay.getUTCMonth(), 1));
  while (monthCursor <= endDay) {
    for (const day of [1, 16]) {
      const candidate = new Date(Date.UTC(monthCursor.getUTCFullYear(), monthCursor.getUTCMonth(), day));
      if (candidate >= startDay && candidate <= endDay) {
        dates.push(candidate.toISOString().slice(0, 10));
      }
    }
    monthCursor.setUTCMonth(monthCursor.getUTCMonth() + 1);
  }
  return dates;
};

const existingVerified = await api(
  'draws?market_code=eq.THAI&verification_status=eq.VERIFIED&select=draw_date'
) as Array<{ draw_date: string }>;
const alreadyVerified = new Set(existingVerified.map(row => row.draw_date));

const pendingDates = candidateDrawDates(startDate, endDate).filter(date => !alreadyVerified.has(date));

console.log(`Backfilling ${pendingDates.length} Thai GLO draw(s) between ${startDate} and ${endDate} (${alreadyVerified.size} already verified, skipped). Fetching live from GLO — the bundled local snapshot is never used as a source.`);

let succeeded = 0;
let failed = 0;
for (const date of pendingDates) {
  const result = await ingestThaiGloDraw(date, api);
  if (result.status === 'SUCCEEDED') {
    succeeded += 1;
  } else {
    failed += 1;
  }
  console.log(`[${result.status}] ${date}: ${result.message}`);
  await new Promise(resolve => setTimeout(resolve, delayMs));
}

console.log(`\nBackfill complete: ${succeeded} succeeded, ${failed} failed, ${alreadyVerified.size} already verified.`);

if (pendingDates.length > 0 && succeeded === 0) {
  throw new Error('Backfill made no progress — every GLO request failed.');
}
