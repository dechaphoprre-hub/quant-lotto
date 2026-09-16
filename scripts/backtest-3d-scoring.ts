import { getThreeDigitPattern } from '../src/math/quantEngine.ts';

/**
 * Walk-forward backtest: does recency-weighting the 3D candidate pool
 * (the app's old behavior) actually predict better than ranking by pure
 * historical frequency? Each prediction here uses ONLY draws strictly
 * before the target draw — no leakage — unlike the live bug this caught,
 * where the app's "next draw" picks were computed from data that already
 * included the most recent draw's own result.
 *
 * Run with: npm run backtest:3d
 */

const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL)?.replace(/\/$/, '');
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  throw new Error('Set SUPABASE_URL and SUPABASE_ANON_KEY (the public anon key is enough — this only reads VERIFIED draws).');
}

interface DrawRow {
  draw_date: string;
  three_digit_top: string | null;
  three_digit_front: string[] | null;
  three_digit_back: string[] | null;
}

const response = await fetch(
  `${supabaseUrl}/rest/v1/draws?market_code=eq.THAI&verification_status=eq.VERIFIED&select=draw_date,three_digit_top,three_digit_front,three_digit_back&order=draw_date.asc`,
  { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
);
if (!response.ok) throw new Error(`Supabase returned HTTP ${response.status}`);
const rows = await response.json() as DrawRow[];

if (rows.length < 15) {
  throw new Error(`Only ${rows.length} verified draws available; need at least ~15 for a meaningful backtest.`);
}

console.log(`Loaded ${rows.length} real VERIFIED Thai draws (${rows[0].draw_date} to ${rows[rows.length - 1].draw_date})\n`);

const buildFrequencyMap = (priorRows: DrawRow[]): Record<string, number> => {
  const frequencyMap: Record<string, number> = {};
  priorRows.forEach(row => {
    const candidates = [row.three_digit_top, ...(row.three_digit_front || []), ...(row.three_digit_back || [])].filter(Boolean) as string[];
    candidates.forEach(num => {
      if (/^\d{3}$/.test(num)) frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });
  });
  return frequencyMap;
};

// The OLD (recency-weighted) method: pool = first 15 distinct numbers
// discovered scanning newest-first, scored by position + frequency.
const pickWithRecency = (priorRowsAscending: DrawRow[]): string[] => {
  const newestFirst = [...priorRowsAscending].reverse();
  const frequencyMap = buildFrequencyMap(priorRowsAscending);
  const recent3D: string[] = [];
  newestFirst.forEach(row => {
    const candidates = [row.three_digit_top, ...(row.three_digit_front || []), ...(row.three_digit_back || [])].filter(Boolean) as string[];
    candidates.forEach(num => {
      if (/^\d{3}$/.test(num) && !recent3D.includes(num)) recent3D.push(num);
    });
  });
  return recent3D.slice(0, 15)
    .map((num, idx) => ({ num, score: Math.max(1, 15 - idx) * 1.5 + (frequencyMap[num] || 1) * 2 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.num);
};

// The CURRENT (post-fix) method: pure historical frequency, no recency.
const pickByFrequency = (priorRowsAscending: DrawRow[]): string[] => {
  const frequencyMap = buildFrequencyMap(priorRowsAscending);
  return Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5)
    .map(([num]) => num);
};

const MIN_HISTORY = 10;
let tested = 0;
let hitsRecencyTop = 0, hitsFrequencyTop = 0;
let hitsRecencyAny = 0, hitsFrequencyAny = 0;

for (let i = MIN_HISTORY; i < rows.length; i++) {
  const prior = rows.slice(0, i);
  const target = rows[i];
  if (Object.keys(buildFrequencyMap(prior)).length < 5) continue;

  const recencyPicks = pickWithRecency(prior);
  const frequencyPicks = pickByFrequency(prior);
  const actualNumbers = [target.three_digit_top, ...(target.three_digit_front || []), ...(target.three_digit_back || [])].filter(Boolean) as string[];

  tested++;
  if (target.three_digit_top && recencyPicks.includes(target.three_digit_top)) hitsRecencyTop++;
  if (target.three_digit_top && frequencyPicks.includes(target.three_digit_top)) hitsFrequencyTop++;
  if (actualNumbers.some(n => recencyPicks.includes(n))) hitsRecencyAny++;
  if (actualNumbers.some(n => frequencyPicks.includes(n))) hitsFrequencyAny++;
}

const pct = (hits: number) => `${(hits / tested * 100).toFixed(2)}% (${hits}/${tested})`;

console.log(`Walk-forward backtest over ${tested} draws (each prediction used only prior draws):\n`);
console.log(`3-digit-top exact hit rate          | recency-weighted: ${pct(hitsRecencyTop)} | pure frequency: ${pct(hitsFrequencyTop)}`);
console.log(`Any of the day's 5 real numbers hit | recency-weighted: ${pct(hitsRecencyAny)} | pure frequency: ${pct(hitsFrequencyAny)}`);
console.log(`\nPure-chance baseline for reference: ~0.50% per metric (5 guesses out of 1000 possible 3-digit numbers).`);
console.log(`getThreeDigitPattern sanity check: 707 -> ${getThreeDigitPattern('707')}, 899 -> ${getThreeDigitPattern('899')}, 555 -> ${getThreeDigitPattern('555')}`);
