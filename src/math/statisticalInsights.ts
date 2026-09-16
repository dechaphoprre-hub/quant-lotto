import { DrawRecord, DigitStat } from '../types';

/**
 * Honesty tools: these describe how random the historical draws actually
 * look, or surface plain descriptive facts (dormant numbers, pairs that
 * happened to land together). None of this predicts a future draw — a
 * fair lottery has no memory, so nothing here should ever be read as a tip.
 */

export interface ChiSquareResult {
  statistic: number;
  degreesOfFreedom: number;
  pValue: number;
  sampleSize: number;
  isConsistentWithRandom: boolean;
}

/**
 * Chi-square goodness-of-fit test of the 100 two-digit outcomes (00-99)
 * against a uniform distribution. A high p-value (>= 0.05) means the
 * observed frequencies are statistically indistinguishable from fair,
 * uniform randomness — which is the honest, expected result for a real
 * government lottery draw, not evidence that any digit is "due."
 */
export function calculateChiSquareTest(stats: DigitStat[]): ChiSquareResult {
  const totalEvents = stats.reduce((sum, s) => sum + s.occurrences, 0);
  const df = Math.max(0, stats.length - 1);

  if (totalEvents === 0 || df === 0) {
    return { statistic: 0, degreesOfFreedom: df, pValue: 1, sampleSize: 0, isConsistentWithRandom: true };
  }

  const expected = totalEvents / stats.length;
  const statistic = stats.reduce((sum, s) => sum + (s.occurrences - expected) ** 2 / expected, 0);
  const pValue = chiSquareUpperTailPValue(statistic, df);

  return {
    statistic: Number(statistic.toFixed(2)),
    degreesOfFreedom: df,
    pValue: Number(pValue.toFixed(4)),
    sampleSize: totalEvents,
    isConsistentWithRandom: pValue >= 0.05
  };
}

/** Wilson-Hilferty approximation of the chi-square upper-tail p-value. Accurate enough for df as large as 99. */
function chiSquareUpperTailPValue(x: number, df: number): number {
  if (df <= 0) return 1;
  const h = 2 / (9 * df);
  const z = ((x / df) ** (1 / 3) - (1 - h)) / Math.sqrt(h);
  return 1 - standardNormalCdf(z);
}

function standardNormalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

/** Abramowitz-Stegun 7.1.26 approximation of erf, max error ~1.5e-7. */
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}

export interface DormantNumber {
  digit: string;
  lastSeenDate: string | null;
  yearsSinceLastSeen: number | null;
}

/**
 * Two-digit numbers with zero appearances (as either top or bottom) within
 * the last `cutoffYears` years of the loaded dataset. This is a plain
 * historical fact, not a signal that a number is "overdue" — a fair draw
 * has no memory of how long it has been since a number last appeared.
 */
export function findDormantNumbers(
  draws: DrawRecord[],
  cutoffYears: number,
  referenceDate: Date = new Date()
): DormantNumber[] {
  const cutoffIso = new Date(
    Date.UTC(referenceDate.getUTCFullYear() - cutoffYears, referenceDate.getUTCMonth(), referenceDate.getUTCDate())
  ).toISOString().slice(0, 10);

  const lastSeen: Record<string, string> = {};
  const seenSinceCutoff = new Set<string>();

  draws.forEach(draw => {
    [draw.twoDigitTop, draw.twoDigitBottom].forEach(digit => {
      if (!digit) return;
      if (!lastSeen[digit] || draw.date > lastSeen[digit]) lastSeen[digit] = draw.date;
      if (draw.date >= cutoffIso) seenSinceCutoff.add(digit);
    });
  });

  const dormant: DormantNumber[] = [];
  for (let i = 0; i < 100; i++) {
    const digit = i.toString().padStart(2, '0');
    if (seenSinceCutoff.has(digit)) continue;
    const last = lastSeen[digit] ?? null;
    const yearsSince = last
      ? Number(((referenceDate.getTime() - new Date(`${last}T00:00:00Z`).getTime()) / (365.25 * 24 * 3600 * 1000)).toFixed(1))
      : null;
    dormant.push({ digit, lastSeenDate: last, yearsSinceLastSeen: yearsSince });
  }

  return dormant.sort((a, b) => {
    if (a.lastSeenDate === null) return b.lastSeenDate === null ? 0 : -1;
    if (b.lastSeenDate === null) return 1;
    return a.lastSeenDate < b.lastSeenDate ? -1 : 1;
  });
}

export interface CoOccurrencePair {
  pair: [string, string];
  count: number;
}

/**
 * Two-digit top/bottom pairs that landed together in the same draw more
 * than once in the loaded history, ranked by how often that exact pair
 * repeated. Purely descriptive — the two numbers in a draw are independent
 * of each other, so a pair repeating is coincidence, not a pattern to bet on.
 */
export function calculateCoOccurrencePairs(draws: DrawRecord[], topN = 10): CoOccurrencePair[] {
  const counts = new Map<string, number>();

  draws.forEach(draw => {
    const top = draw.twoDigitTop;
    const bottom = draw.twoDigitBottom;
    if (!top || !bottom || top === bottom) return;
    const pair = [top, bottom].sort();
    const key = pair.join('-');
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([key, count]) => ({ pair: key.split('-') as [string, string], count }))
    .filter(entry => entry.count > 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}
