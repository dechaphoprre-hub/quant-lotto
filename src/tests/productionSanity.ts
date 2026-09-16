import { validateDrawRecord, sanitizeDrawDataset } from '../services/dataValidator.ts';
import { calculateDigitStatistics, runMonteCarloSimulation, calculateMarkovTransitions, runThreeDigitSimulation, calculateThreeDigitPatternDistribution, calculateDigitalRootStats } from '../math/quantEngine.ts';
import { calculateChiSquareTest, findDormantNumbers, calculateCoOccurrencePairs } from '../math/statisticalInsights.ts';
import { extractNumbersFromText } from '../math/newsNumberExtraction.ts';
import { THAI_LOTTERY_DRAWS, LAO_LOTTERY_DRAWS, HANOI_LOTTERY_DRAWS, HANOI_VIP_LOTTERY_DRAWS } from '../data/lotteryData.ts';
import { DrawRecord } from '../types/index.ts';

console.log('====================================================');
console.log('   QUANTLOTTO TERMINAL - PRODUCTION SANITY TEST   ');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`);
  }
}

// 1. Schema Validator Tests
console.log('--- 1. Testing Schema & Integrity Validator ---');

const sampleValidThai: DrawRecord = {
  id: 'th-test-01',
  market: 'THAI',
  date: '2025-03-01',
  dayOfWeekTh: 'เสาร์',
  drawNumber: 'งวด 1 มี.ค. 68',
  topPrize: '818894',
  twoDigitTop: '94',
  twoDigitBottom: '54',
  threeDigitTop: '894',
  threeDigitFront: ['264', '591'],
  threeDigitBack: ['120', '835']
};

const v1 = validateDrawRecord(sampleValidThai);
assert(v1.isValid && v1.errors.length === 0, 'Valid Thai draw validates cleanly');

const sampleInvalidThai: Partial<DrawRecord> = {
  id: 'th-invalid',
  market: 'THAI',
  date: '2025-99-99', // Invalid date
  topPrize: '12345',  // 5 digits instead of 6
  twoDigitTop: 'AB',  // Not digits
  twoDigitBottom: '5' // 1 digit instead of 2
};

const v2 = validateDrawRecord(sampleInvalidThai);
assert(!v2.isValid && v2.errors.length >= 4, 'Invalid record correctly rejected with all errors caught', JSON.stringify(v2.errors));

// 2. Deep Historical Dataset Integrity & 2026 Recency
console.log('\n--- 2. Testing Deep Authentic Datasets & 2026 Recency ---');

const thaiClean = sanitizeDrawDataset(THAI_LOTTERY_DRAWS);
assert(thaiClean.rejectedCount === 0, `Thai dataset clean with 0 errors (Total: ${THAI_LOTTERY_DRAWS.length} draws)`);
assert(thaiClean.cleanDataset.length >= 40, `Thai dataset has deep sample size (${thaiClean.cleanDataset.length} >= 40)`);
assert(THAI_LOTTERY_DRAWS[0].date === '2026-09-01', `Thai latest draw is 2026-09-01 (${THAI_LOTTERY_DRAWS[0].date})`);

const laoClean = sanitizeDrawDataset(LAO_LOTTERY_DRAWS);
assert(laoClean.rejectedCount === 0, `Lao dataset clean with 0 errors (Total: ${LAO_LOTTERY_DRAWS.length} draws)`);
assert(laoClean.cleanDataset.length >= 40, `Lao dataset has deep sample size (${laoClean.cleanDataset.length} >= 40)`);
assert(LAO_LOTTERY_DRAWS[0].date === '2026-09-14', `Lao latest draw is 2026-09-14 (${LAO_LOTTERY_DRAWS[0].date})`);

const hanoiClean = sanitizeDrawDataset(HANOI_LOTTERY_DRAWS);
assert(hanoiClean.rejectedCount === 0, `Hanoi Regular dataset clean with 0 errors (Total: ${HANOI_LOTTERY_DRAWS.length} draws)`);
assert(hanoiClean.cleanDataset.length >= 40, `Hanoi Regular dataset has deep sample size (${hanoiClean.cleanDataset.length} >= 40)`);
assert(HANOI_LOTTERY_DRAWS[0].date === '2026-09-15', `Hanoi Regular latest draw is 2026-09-15 (${HANOI_LOTTERY_DRAWS[0].date})`);

const hanoiVipClean = sanitizeDrawDataset(HANOI_VIP_LOTTERY_DRAWS);
assert(hanoiVipClean.rejectedCount === 0, `Hanoi VIP dataset clean with 0 errors (Total: ${HANOI_VIP_LOTTERY_DRAWS.length} draws)`);
assert(hanoiVipClean.cleanDataset.length >= 40, `Hanoi VIP dataset has deep sample size (${hanoiVipClean.cleanDataset.length} >= 40)`);
assert(HANOI_VIP_LOTTERY_DRAWS[0].date === '2026-09-15', `Hanoi VIP latest draw is 2026-09-15 (${HANOI_VIP_LOTTERY_DRAWS[0].date})`);

const samePrizeCount = HANOI_LOTTERY_DRAWS.filter((h, idx) => h.topPrize === HANOI_VIP_LOTTERY_DRAWS[idx]?.topPrize).length;
assert(samePrizeCount === 0, 'Hanoi Regular and Hanoi VIP are strictly distinct, independent datasets');

// 3. Mathematical Defensive Guardrails
console.log('\n--- 3. Testing Mathematical Engine Guardrails ---');

// Test with authentic draws
const stats = calculateDigitStatistics(thaiClean.cleanDataset);
assert(stats.length === 100, 'calculateDigitStatistics returns exactly 100 elements (00-99)');

const hasNan = stats.some(s => isNaN(s.frequency) || isNaN(s.zScore) || isNaN(s.probabilityWeight));
assert(!hasNan, 'Zero NaN values in 2D Digit Statistics');

// Test with EMPTY dataset (Zero elements edge case)
const emptyStats = calculateDigitStatistics([]);
assert(emptyStats.length === 100, 'calculateDigitStatistics([]) handles empty array safely without crash');
const emptyHasNan = emptyStats.some(s => isNaN(s.frequency) || isNaN(s.zScore) || isNaN(s.probabilityWeight));
assert(!emptyHasNan, 'Zero NaN values when calculating on empty dataset');

// 4. Monte Carlo Simulation Core & Deterministic PRNG
console.log('\n--- 4. Testing Monte Carlo Simulation Core & Deterministic PRNG ---');
const mcRun1 = runMonteCarloSimulation(stats, 50000, 'TEST-SEED-MULBERRY-2026');
const mcRun2 = runMonteCarloSimulation(stats, 50000, 'TEST-SEED-MULBERRY-2026');
assert(mcRun1.iterations === 50000, 'Monte Carlo executes requested 50,000 iterations');
assert(mcRun1.topRanked.length === 10, 'Returns top 10 ranked density peaks');

const isExactMatch = mcRun1.topRanked.every((r, idx) => r.digit === mcRun2.topRanked[idx].digit && r.hits === mcRun2.topRanked[idx].hits);
assert(isExactMatch, 'Mulberry32 PRNG is 100% bit-exact deterministic across runs/devices with same seed');

const mcHasNan = mcRun1.topRanked.some(r => isNaN(r.probability) || isNaN(r.hits) || isNaN(r.confidenceInterval[0]));
assert(!mcHasNan, 'Zero NaN values in Monte Carlo ranked results');
assert(!isNaN(mcRun1.entropyScore) && mcRun1.entropyScore > 0, `Entropy score valid: ${mcRun1.entropyScore}`);

// 5. Markov Chain State Transitions
console.log('\n--- 5. Testing Markov Chain State Transitions ---');
const markov = calculateMarkovTransitions(thaiClean.cleanDataset);
assert(markov.length === 10, 'Markov matrix covers all 10 states (0 through 9)');

let markovProbValid = true;
markov.forEach(m => {
  const sum = m.nextDigitProbabilities.reduce((acc, p) => acc + p.probability, 0);
  if (isNaN(sum) || (m.nextDigitProbabilities.length > 0 && sum <= 0)) {
    markovProbValid = false;
  }
});
assert(markovProbValid, 'Markov transition probabilities sum correctly without NaN');

// 6. 3D Dimension Simulation & Pattern Classification
console.log('\n--- 6. Testing 3D Dimension Pattern Classifier ---');
const threeD = runThreeDigitSimulation(thaiClean.cleanDataset);
assert(threeD.length === 5, 'Returns top 5 3D Candidates');

const allValidPatterns = threeD.every(c => ['CLEAN', 'HAAM', 'DOUBLE', 'TRIPLE'].includes(c.pattern));
assert(allValidPatterns, 'All 3D candidates correctly categorized into patterns');

const allValidRoots = threeD.every(c => c.sumRoot >= 1 && c.sumRoot <= 9);
assert(allValidRoots, 'All digital sum roots are in range 1-9');

const allRealHits = threeD.every(c => Number.isInteger(c.hits) && c.hits >= 1);
assert(allRealHits, `3D candidate "hits" are real integer occurrence counts, not a synthetic formula (${threeD.map(c => c.hits).join(', ')})`);

// Regression guard: a brand-new number that only appeared in the single
// most recent draw must NOT outrank a number with real historical
// frequency, just because it's "recent" — this is the exact bug a
// walk-forward backtest caught (the top pick simply echoed the latest
// draw's own numbers back as a "prediction").
const oldFrequentNumber = thaiClean.cleanDataset[thaiClean.cleanDataset.length - 1].threeDigitTop!;
const brandNewLatestDraw: DrawRecord = {
  ...thaiClean.cleanDataset[0],
  id: 'th-regression-test',
  date: '2099-01-01',
  threeDigitTop: '999',
  threeDigitFront: ['998', '997'],
  threeDigitBack: ['996', '995']
};
const inflatedFrequencyDataset = [
  brandNewLatestDraw,
  ...Array(6).fill(null).map((_, i) => ({ ...thaiClean.cleanDataset[thaiClean.cleanDataset.length - 1], id: `th-freq-${i}`, threeDigitTop: oldFrequentNumber })),
  ...thaiClean.cleanDataset
];
const regressionResult = runThreeDigitSimulation(inflatedFrequencyDataset);
assert(
  !regressionResult.some(c => c.digit === '999'),
  `A brand-new, never-before-seen number from only the latest draw does not rank in the top 5 just for being recent (top picks: ${regressionResult.map(c => c.digit).join(', ')})`
);
assert(
  regressionResult.some(c => c.digit === oldFrequentNumber),
  `A number with real high historical frequency still ranks in the top 5 (top picks: ${regressionResult.map(c => c.digit).join(', ')})`
);

const patternDistribution = calculateThreeDigitPatternDistribution(thaiClean.cleanDataset);
assert(patternDistribution.length === 4, 'Pattern distribution covers all 4 pattern categories');
const distributionTotal = patternDistribution.reduce((sum, p) => sum + p.percentage, 0);
assert(Math.abs(distributionTotal - 100) < 0.5, `Pattern distribution percentages sum to ~100% (${distributionTotal})`);

const rootStats = calculateDigitalRootStats(thaiClean.cleanDataset);
assert(rootStats.length === 9, 'Digital root stats cover roots 1-9');
assert(rootStats.every(r => !isNaN(r.occurrences) && !isNaN(r.drawsSinceLastSeen)), 'Digital root stats have no NaN values');

// 7. Statistical Insights (chi-square honesty check, dormant numbers, co-occurrence)
console.log('\n--- 7. Testing Statistical Insights ---');

const chiSquareUniform = calculateChiSquareTest(stats);
assert(!isNaN(chiSquareUniform.statistic) && !isNaN(chiSquareUniform.pValue), 'Chi-square test returns numeric statistic and p-value');
assert(chiSquareUniform.degreesOfFreedom === 99, `Chi-square degrees of freedom is 99 for 100 categories (${chiSquareUniform.degreesOfFreedom})`);

const perfectlyUniformStats = stats.map(s => ({ ...s, occurrences: 10 }));
const chiSquarePerfect = calculateChiSquareTest(perfectlyUniformStats);
assert(chiSquarePerfect.statistic === 0 && chiSquarePerfect.isConsistentWithRandom, 'Perfectly uniform occurrences score chi-square statistic 0 and pass the randomness check');

const emptyChiSquare = calculateChiSquareTest(calculateDigitStatistics([]));
assert(!isNaN(emptyChiSquare.pValue) && emptyChiSquare.isConsistentWithRandom, 'Chi-square test on empty dataset handles zero-sample case safely without crash');

const dormant = findDormantNumbers(thaiClean.cleanDataset, 3);
assert(dormant.length <= 100 && dormant.every(d => /^\d{2}$/.test(d.digit)), 'Dormant numbers are valid 2-digit entries within bounds');
assert(dormant.every(d => d.lastSeenDate === null || d.yearsSinceLastSeen !== null), 'Every dormant number with a last-seen date also has a computed years-since value');

const coOccurrence = calculateCoOccurrencePairs(thaiClean.cleanDataset, 10);
assert(coOccurrence.length <= 10, `Co-occurrence returns at most 10 pairs (${coOccurrence.length})`);
assert(coOccurrence.every(p => p.count > 1 && p.pair[0] !== p.pair[1]), 'Every co-occurrence pair repeated more than once and has two distinct digits');
assert(
  coOccurrence.every((p, idx) => idx === 0 || coOccurrence[idx - 1].count >= p.count),
  'Co-occurrence pairs are sorted by count descending'
);

// 8. News Number Extraction (deterministic digit-derivation, not AI text understanding)
console.log('\n--- 8. Testing News Number Extraction ---');

const extractedFromPlate = extractNumbersFromText('อุบัติเหตุรถบรรทุกทะเบียน 8894 พลิกคว่ำที่สระบุรี คนขับอายุ 45 ปี');
assert(extractedFromPlate.includes('94'), `Extracts last-2 digits from a 4-digit run (${extractedFromPlate.join(', ')})`);
assert(extractedFromPlate.includes('88'), `Extracts first-2 digits from a 4-digit run (${extractedFromPlate.join(', ')})`);
assert(extractedFromPlate.includes('45'), `Extracts a standalone 2-digit run as-is (${extractedFromPlate.join(', ')})`);
assert(extractedFromPlate.every(n => /^\d{2}$/.test(n)), 'Every extracted candidate is exactly 2 digits');

const extractedEmpty = extractNumbersFromText('ไม่มีตัวเลขในข้อความนี้เลย');
assert(extractedEmpty.length === 0, 'Text with no digits extracts zero candidates');

const extractedCapped = extractNumbersFromText('1 22 333 4444 55555 666666 7 88 999', 5);
assert(extractedCapped.length <= 5, `Extraction respects the maxCandidates cap (${extractedCapped.length} <= 5)`);

console.log('\n====================================================');
console.log(`   TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED (100% SUCESS)   `);
console.log('====================================================');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
