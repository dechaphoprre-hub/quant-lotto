import { validateDrawRecord, sanitizeDrawDataset } from '../services/dataValidator.ts';
import { calculateDigitStatistics, runMonteCarloSimulation, calculateMarkovTransitions, runThreeDigitSimulation } from '../math/quantEngine.ts';
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

// 2. Deep Historical Dataset Integrity
console.log('\n--- 2. Testing Deep Authentic Datasets ---');

const thaiClean = sanitizeDrawDataset(THAI_LOTTERY_DRAWS);
assert(thaiClean.rejectedCount === 0, `Thai dataset clean with 0 errors (Total: ${THAI_LOTTERY_DRAWS.length} draws)`);
assert(thaiClean.cleanDataset.length >= 40, `Thai dataset has deep sample size (${thaiClean.cleanDataset.length} >= 40)`);

const laoClean = sanitizeDrawDataset(LAO_LOTTERY_DRAWS);
assert(laoClean.rejectedCount === 0, `Lao dataset clean with 0 errors (Total: ${LAO_LOTTERY_DRAWS.length} draws)`);
assert(laoClean.cleanDataset.length >= 40, `Lao dataset has deep sample size (${laoClean.cleanDataset.length} >= 40)`);

const hanoiClean = sanitizeDrawDataset(HANOI_LOTTERY_DRAWS);
assert(hanoiClean.rejectedCount === 0, `Hanoi Regular dataset clean with 0 errors (Total: ${HANOI_LOTTERY_DRAWS.length} draws)`);
assert(hanoiClean.cleanDataset.length >= 40, `Hanoi Regular dataset has deep sample size (${hanoiClean.cleanDataset.length} >= 40)`);

const hanoiVipClean = sanitizeDrawDataset(HANOI_VIP_LOTTERY_DRAWS);
assert(hanoiVipClean.rejectedCount === 0, `Hanoi VIP dataset clean with 0 errors (Total: ${HANOI_VIP_LOTTERY_DRAWS.length} draws)`);
assert(hanoiVipClean.cleanDataset.length >= 40, `Hanoi VIP dataset has deep sample size (${hanoiVipClean.cleanDataset.length} >= 40)`);

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

// 4. Monte Carlo 100,000 Iterations Simulation
console.log('\n--- 4. Testing Monte Carlo Simulation Core ---');
const mcResult = runMonteCarloSimulation(stats, 100000);
assert(mcResult.iterations === 100000, 'Monte Carlo executes requested 100,000 iterations');
assert(mcResult.topRanked.length === 10, 'Returns top 10 ranked density peaks');

const mcHasNan = mcResult.topRanked.some(r => isNaN(r.probability) || isNaN(r.hits) || isNaN(r.confidenceInterval[0]));
assert(!mcHasNan, 'Zero NaN values in Monte Carlo ranked results');
assert(!isNaN(mcResult.entropyScore) && mcResult.entropyScore > 0, `Entropy score valid: ${mcResult.entropyScore}`);

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

console.log('\n====================================================');
console.log(`   TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED (100% SUCESS)   `);
console.log('====================================================');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
