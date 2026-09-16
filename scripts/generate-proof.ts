import { createHash } from 'node:crypto';
import { createSupabaseApi } from './lib/glo.ts';
import { predictTop5 } from './lib/prediction.ts';
import { DrawRecord, MarketType } from '../src/types/index.ts';

const MARKET: MarketType = 'THAI';
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const overrideDrawDate = process.env.NEXT_DRAW_DATE;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
}

const api = createSupabaseApi({ supabaseUrl, serviceRoleKey });

const toDrawRecord = (row: Record<string, unknown>): DrawRecord => ({
  id: String(row.id),
  market: MARKET,
  date: String(row.draw_date),
  dayOfWeekTh: '',
  drawNumber: String(row.draw_number),
  topPrize: String(row.top_prize),
  twoDigitTop: String(row.two_digit_top),
  twoDigitBottom: String(row.two_digit_bottom),
  threeDigitTop: row.three_digit_top ? String(row.three_digit_top) : undefined,
  threeDigitFront: Array.isArray(row.three_digit_front) ? row.three_digit_front.map(String) : undefined,
  threeDigitBack: Array.isArray(row.three_digit_back) ? row.three_digit_back.map(String) : undefined
});

// GLO publishes results on the 1st and 16th of every month.
const nextGloDrawDateAfter = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-').map(Number);
  const candidateDay = day < 16 ? 16 : 1;
  const candidateMonth = day < 16 ? month : month + 1;
  const candidate = new Date(Date.UTC(year, candidateMonth - 1, candidateDay));
  return candidate.toISOString().slice(0, 10);
};

const rows = await api(
  `draws?market_code=eq.${MARKET}&verification_status=eq.VERIFIED&select=id,draw_date,draw_number,top_prize,two_digit_top,two_digit_bottom,three_digit_top,three_digit_front,three_digit_back&order=draw_date.asc`
) as Array<Record<string, unknown>>;
const priorDraws = rows.map(toDrawRecord);

const nextDrawDate = overrideDrawDate || (priorDraws.length > 0
  ? nextGloDrawDateAfter(priorDraws[priorDraws.length - 1].date)
  : undefined);

if (!nextDrawDate) {
  throw new Error('No verified draws exist yet; set NEXT_DRAW_DATE explicitly to generate the first proof record.');
}

const existing = await api(
  `proof_records?market_code=eq.${MARKET}&draw_date=eq.${nextDrawDate}&select=id`
) as Array<{ id: string }>;
if (existing.length > 0) {
  console.log(`[SKIP] Proof record already committed for ${MARKET} ${nextDrawDate}.`);
  process.exit(0);
}

const generatedAt = new Date().toISOString();
const predictedTop5 = predictTop5(priorDraws, `${MARKET}-${nextDrawDate}`);
const commitmentHash = createHash('sha256')
  .update(JSON.stringify({ market: MARKET, drawDate: nextDrawDate, predictedTop5, generatedAt }))
  .digest('hex');

await api('proof_records', {
  method: 'POST',
  body: JSON.stringify({
    market_code: MARKET,
    draw_date: nextDrawDate,
    predicted_top5: predictedTop5,
    commitment_hash: commitmentHash,
    generated_at: generatedAt
  })
});

console.log(`[PASS] Committed proof record for ${MARKET} ${nextDrawDate}: predicted ${predictedTop5.join(', ')} (from ${priorDraws.length} prior verified draws), hash ${commitmentHash}`);
