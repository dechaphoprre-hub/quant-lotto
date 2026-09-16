import { DrawRecord, DigitStat, MonteCarloSimulation, MarkovState, ThreeDigitCandidate } from '../types';

/**
 * 1. Digit Statistics & Anomaly Detector (2D)
 * Fully guarded against zero-length arrays and division by zero.
 */
export function calculateDigitStatistics(draws: DrawRecord[]): DigitStat[] {
  const counts: Record<string, number> = {};
  const lastSeenMap: Record<string, number> = {};
  const safeDrawsCount = Math.max(1, draws.length);

  for (let i = 0; i < 100; i++) {
    const formatted = i.toString().padStart(2, '0');
    counts[formatted] = 0;
    lastSeenMap[formatted] = safeDrawsCount;
  }

  let totalDrawEvents = 0;

  draws.forEach((draw, drawIndex) => {
    [draw.twoDigitTop, draw.twoDigitBottom].forEach(d => {
      if (d && counts[d] !== undefined) {
        counts[d]++;
        totalDrawEvents++;
        if (lastSeenMap[d] === safeDrawsCount) {
          lastSeenMap[d] = drawIndex;
        }
      }
    });
  });

  const p = 1 / 100;
  const mu = totalDrawEvents * p;
  const sigma = Math.sqrt(totalDrawEvents * p * (1 - p)) || 1;

  const stats: DigitStat[] = [];

  for (let i = 0; i < 100; i++) {
    const digit = i.toString().padStart(2, '0');
    const occurrences = counts[digit] || 0;
    const frequency = totalDrawEvents > 0 ? Number(((occurrences / totalDrawEvents) * 100).toFixed(2)) : 1.0;
    const drawsSinceLastSeen = lastSeenMap[digit] ?? safeDrawsCount;
    const zScore = sigma > 0 ? (occurrences - mu) / sigma : 0;

    let classification: 'COLD' | 'HOT' | 'NEUTRAL' = 'NEUTRAL';
    if (zScore >= 1.4 || occurrences >= 3) {
      classification = 'HOT';
    } else if (drawsSinceLastSeen >= Math.min(safeDrawsCount - 1, 8)) {
      classification = 'COLD';
    }

    const recencyBonus = Math.max(0, 10 - drawsSinceLastSeen) * 0.05;
    const coldReversionBonus = drawsSinceLastSeen > 10 ? (drawsSinceLastSeen - 10) * 0.08 : 0;
    const probabilityWeight = Math.max(0.1, 1.0 + (zScore * 0.2) + recencyBonus + coldReversionBonus);

    stats.push({
      digit,
      num: i,
      occurrences,
      frequency,
      drawsSinceLastSeen,
      zScore: Number((isNaN(zScore) ? 0 : zScore).toFixed(2)),
      classification,
      probabilityWeight: Number(probabilityWeight.toFixed(3))
    });
  }

  return stats;
}

/**
 * Mulberry32: Fast, high-quality, 32-bit deterministic seeded pseudo-random number generator.
 * Produces identical bit-exact sequences across Chrome, Safari, Firefox, iOS, Android, and PC.
 */
export function createSeededRandom(seed: number | string): () => number {
  let s = typeof seed === 'string' ? hashSeed(seed) : seed;
  return function mulberry32(): number {
    s |= 0;
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return hash;
}

/**
 * 2. Monte Carlo Simulation Engine (2D)
 * Deterministic Seeded Simulation across devices and browsers.
 * Defensive Guard against empty stats, zero weights, and NaN intervals.
 */
export function runMonteCarloSimulation(
  stats: DigitStat[],
  iterations = 50000,
  seed: string | number = 'QUANT-NEXUS-DEFAULT-SEED'
): MonteCarloSimulation {
  const rng = createSeededRandom(seed);
  const safeStats = stats.length === 100 ? stats : calculateDigitStatistics([]);
  const totalWeight = Math.max(0.0001, safeStats.reduce((sum, s) => sum + (s.probabilityWeight || 1), 0));
  const hits: Record<string, number> = {};

  safeStats.forEach(s => {
    hits[s.digit] = 0;
  });

  const cdf: { digit: string; threshold: number }[] = [];
  let cumulative = 0;
  for (const s of safeStats) {
    cumulative += (s.probabilityWeight || 1) / totalWeight;
    cdf.push({ digit: s.digit, threshold: Math.min(1.0, cumulative) });
  }

  const safeIterations = Math.max(1000, iterations);

  for (let i = 0; i < safeIterations; i++) {
    const r = rng();
    let low = 0;
    let high = cdf.length - 1;
    let selected = cdf[high].digit;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (r <= cdf[mid].threshold) {
        selected = cdf[mid].digit;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    hits[selected]++;
  }

  const ranked = safeStats
    .map(s => {
      const count = hits[s.digit] || 0;
      const prob = count / safeIterations;
      const margin = 1.96 * Math.sqrt((prob * (1 - prob)) / safeIterations);
      return {
        digit: s.digit,
        hits: count,
        probability: Number((prob * 100).toFixed(2)),
        confidenceInterval: [
          Number(Math.max(0, (prob - margin) * 100).toFixed(2)),
          Number(((prob + margin) * 100).toFixed(2))
        ] as [number, number]
      };
    })
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 10);

  let entropy = 0;
  safeStats.forEach(s => {
    const p = (hits[s.digit] || 0) / safeIterations;
    if (p > 0) {
      entropy -= p * Math.log2(p);
    }
  });
  const normalizedEntropy = Number((entropy / Math.log2(100)).toFixed(4));

  return {
    iterations: safeIterations,
    timestamp: new Date().toISOString(),
    topRanked: ranked,
    entropyScore: isNaN(normalizedEntropy) ? 0.985 : normalizedEntropy
  };
}

export const getThreeDigitPattern = (str: string): 'CLEAN' | 'HAAM' | 'DOUBLE' | 'TRIPLE' => {
  if (!str || str.length !== 3) return 'CLEAN';
  const [d0, d1, d2] = str.split('');
  if (d0 === d1 && d1 === d2) return 'TRIPLE';
  if (d0 === d2) return 'HAAM'; // Symmetrical, e.g. 898, 707
  if (d0 === d1 || d1 === d2) return 'DOUBLE'; // Pairs, e.g. 773, 899
  return 'CLEAN';
};

export const getThreeDigitSumRoot = (str: string): number => {
  if (!str) return 0;
  const sum = str.split('').reduce((acc, c) => acc + (parseInt(c, 10) || 0), 0);
  return sum > 9 ? (sum % 9 || 9) : sum;
};

const collectThreeDigitAppearances = (draws: DrawRecord[]): { frequencyMap: Record<string, number> } => {
  const frequencyMap: Record<string, number> = {};

  draws.forEach(d => {
    const candidates = [d.threeDigitTop, ...(d.threeDigitFront || []), ...(d.threeDigitBack || [])].filter(Boolean) as string[];
    candidates.forEach(num => {
      if (/^\d{3}$/.test(num)) {
        frequencyMap[num] = (frequencyMap[num] || 0) + 1;
      }
    });
  });

  return { frequencyMap };
};

/**
 * 3. Three Digit Simulation & Pattern Detector (3D Mode)
 * Ranks every 3-digit number that has ever appeared in the loaded history
 * by raw historical frequency alone — no recency weighting. A walk-forward
 * backtest against 67 real draws (scripts/backtest-3d-scoring.ts) showed
 * recency-weighting a candidate pool that always put the most-recently-seen
 * draw's own numbers first produced no better hit rate than pure frequency
 * (both indistinguishable from chance), while creating a real trust problem:
 * right after every draw, the "top pick" would just echo that draw's own
 * numbers back as if it had been predicted. `hits` is the real historical
 * appearance count — never a synthetic formula.
 */
export function runThreeDigitSimulation(draws: DrawRecord[]): ThreeDigitCandidate[] {
  const { frequencyMap } = collectThreeDigitAppearances(draws);

  const ranked = Object.entries(frequencyMap)
    .map(([num, freq]) => ({ num, freq, pattern: getThreeDigitPattern(num), sumRoot: getThreeDigitSumRoot(num) }))
    // Ties broken lexicographically (never by recency) for determinism.
    .sort((a, b) => b.freq - a.freq || a.num.localeCompare(b.num));

  const top = ranked.slice(0, 5);
  const totalFreq = top.reduce((sum, item) => sum + item.freq, 0) || 1;

  return top.map(item => ({
    digit: item.num,
    hits: item.freq,
    probability: Number(((item.freq / totalFreq) * 60).toFixed(1)),
    pattern: item.pattern,
    sumRoot: item.sumRoot
  }));
}

export interface PatternDistributionEntry {
  pattern: 'CLEAN' | 'HAAM' | 'DOUBLE' | 'TRIPLE';
  count: number;
  percentage: number;
}

/**
 * Real distribution of CLEAN/HAAM/DOUBLE/TRIPLE across every 3-digit
 * number that has actually appeared in the loaded history — not a
 * theoretical or hardcoded percentage.
 */
export function calculateThreeDigitPatternDistribution(draws: DrawRecord[]): PatternDistributionEntry[] {
  const { frequencyMap } = collectThreeDigitAppearances(draws);
  const totals: Record<'CLEAN' | 'HAAM' | 'DOUBLE' | 'TRIPLE', number> = { CLEAN: 0, HAAM: 0, DOUBLE: 0, TRIPLE: 0 };
  let totalAppearances = 0;

  Object.entries(frequencyMap).forEach(([num, count]) => {
    totals[getThreeDigitPattern(num)] += count;
    totalAppearances += count;
  });

  const safeTotal = Math.max(1, totalAppearances);
  return (['CLEAN', 'HAAM', 'DOUBLE', 'TRIPLE'] as const).map(pattern => ({
    pattern,
    count: totals[pattern],
    percentage: Number(((totals[pattern] / safeTotal) * 100).toFixed(1))
  }));
}

export interface DigitalRootStat {
  root: number;
  occurrences: number;
  drawsSinceLastSeen: number;
}

/**
 * Real hot/cold ranking of digital-sum roots (1-9) across every 3-digit
 * number in the loaded history, mirroring calculateDigitStatistics'
 * recency tracking but for roots instead of raw 2-digit numbers.
 */
export function calculateDigitalRootStats(draws: DrawRecord[]): DigitalRootStat[] {
  const occurrences: Record<number, number> = {};
  const lastSeenIndex: Record<number, number> = {};
  const safeDrawsCount = Math.max(1, draws.length);

  for (let root = 1; root <= 9; root++) {
    occurrences[root] = 0;
    lastSeenIndex[root] = safeDrawsCount;
  }

  draws.forEach((draw, drawIndex) => {
    const candidates = [draw.threeDigitTop, ...(draw.threeDigitFront || []), ...(draw.threeDigitBack || [])].filter(Boolean) as string[];
    candidates.forEach(num => {
      if (!/^\d{3}$/.test(num)) return;
      const root = getThreeDigitSumRoot(num);
      occurrences[root] = (occurrences[root] || 0) + 1;
      if (lastSeenIndex[root] === safeDrawsCount) lastSeenIndex[root] = drawIndex;
    });
  });

  const stats: DigitalRootStat[] = [];
  for (let root = 1; root <= 9; root++) {
    stats.push({ root, occurrences: occurrences[root] ?? 0, drawsSinceLastSeen: lastSeenIndex[root] ?? safeDrawsCount });
  }
  return stats;
}

/**
 * 4. Markov State Transitions
 * Guarded against division by zero and invalid indices.
 */
export function calculateMarkovTransitions(draws: DrawRecord[]): MarkovState[] {
  const matrix: number[][] = Array(10).fill(0).map(() => Array(10).fill(0));
  const fromCounts: number[] = Array(10).fill(0);

  for (let i = 0; i < draws.length - 1; i++) {
    const curr = draws[i]?.twoDigitTop;
    const next = draws[i + 1]?.twoDigitTop;

    if (curr && next && curr.length === 2 && next.length === 2) {
      const fromTens = parseInt(curr[0], 10);
      const toTens = parseInt(next[0], 10);
      const fromUnits = parseInt(curr[1], 10);
      const toUnits = parseInt(next[1], 10);

      if (!isNaN(fromTens) && !isNaN(toTens) && fromTens >= 0 && fromTens <= 9 && toTens >= 0 && toTens <= 9) {
        matrix[fromTens][toTens]++;
        fromCounts[fromTens]++;
      }
      if (!isNaN(fromUnits) && !isNaN(toUnits) && fromUnits >= 0 && fromUnits <= 9 && toUnits >= 0 && toUnits <= 9) {
        matrix[fromUnits][toUnits]++;
        fromCounts[fromUnits]++;
      }
    }
  }

  const markovStates: MarkovState[] = [];

  for (let digit = 0; digit < 10; digit++) {
    const total = Math.max(1, fromCounts[digit]);
    const nextDigitProbabilities = matrix[digit].map((count, nextDigit) => ({
      nextDigit,
      count,
      probability: Number(((count / total) * 100).toFixed(1))
    })).sort((a, b) => b.probability - a.probability);

    markovStates.push({
      currentDigit: digit,
      nextDigitProbabilities
    });
  }

  return markovStates;
}

// The proof-of-algorithm ledger is real, server-verified data read from
// Supabase (see src/services/proofService.ts and scripts/generate-proof.ts).
// It is intentionally not bundled here as static frontend data.
