import { calculateDigitStatistics, runMonteCarloSimulation } from '../../src/math/quantEngine.ts';
import { DrawRecord, ProofItemRecord } from '../../src/types/index.ts';

/**
 * Deterministic Top-5 prediction from draws known BEFORE drawDate only.
 * Never given draws from drawDate or later, so a proof record committed
 * with this output cannot be produced with knowledge of the real result.
 */
export const predictTop5 = (priorDraws: DrawRecord[], seed: string): string[] => {
  const stats = calculateDigitStatistics(priorDraws);
  const simulation = runMonteCarloSimulation(stats, 50000, seed);
  return simulation.topRanked.slice(0, 5).map(entry => entry.digit);
};

const reverseDigits = (value: string) => value.split('').reverse().join('');

export const scoreProof = (
  predictedTop5: string[],
  actual: { twoDigitTop: string; twoDigitBottom: string }
): ProofItemRecord['matchType'] => {
  if (predictedTop5.includes(actual.twoDigitTop)) return 'DIRECT_HIT';
  if (predictedTop5.some(digit => reverseDigits(digit) === actual.twoDigitTop)) return 'REVERSE_HIT';
  if (predictedTop5.includes(actual.twoDigitBottom)) return 'CLOSE_CALL';
  return 'MISS';
};
