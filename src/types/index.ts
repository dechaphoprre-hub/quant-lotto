export type MarketType = 'THAI' | 'LAO' | 'HANOI' | 'HANOI_VIP';
export type DimensionMode = '2D' | '3D';

export interface DrawRecord {
  id: string;
  market: MarketType;
  date: string; // YYYY-MM-DD
  dayOfWeekTh: string;
  drawNumber: string;
  topPrize: string;
  twoDigitTop: string;
  twoDigitBottom: string;
  threeDigitTop?: string; // 3 ตัวบน / Ba Càng
  threeDigitFront?: string[]; // 3 ตัวหน้า (เฉพาะไทย)
  threeDigitBack?: string[]; // 3 ตัวท้าย (เฉพาะไทย)
}

export interface DigitStat {
  digit: string;
  num: number;
  occurrences: number;
  frequency: number;
  drawsSinceLastSeen: number;
  zScore: number;
  classification: 'COLD' | 'HOT' | 'NEUTRAL';
  probabilityWeight: number;
}

export interface ThreeDigitCandidate {
  digit: string; // "894"
  hits: number;
  probability: number;
  pattern: 'CLEAN' | 'HAAM' | 'DOUBLE' | 'TRIPLE';
  sumRoot: number; // ผลรวมเลข เช่น 8+9+4 = 21 -> 3
}

export interface MonteCarloSimulation {
  iterations: number;
  timestamp: string;
  topRanked: {
    digit: string;
    hits: number;
    probability: number;
    confidenceInterval: [number, number];
  }[];
  entropyScore: number;
}

export interface MarkovState {
  currentDigit: number;
  nextDigitProbabilities: {
    nextDigit: number;
    count: number;
    probability: number;
  }[];
}

export interface ProofItemRecord {
  id: string;
  market: MarketType;
  drawDate: string;
  timestampGenerated: string;
  sha256Hash: string;
  predictedTop5: string[];
  topTwoDigit: string;
  bottomTwoDigit: string;
  threeDigitTop?: string;
  matched: boolean;
  matchType: 'DIRECT_HIT' | 'REVERSE_HIT' | 'CLOSE_CALL' | 'MISS';
}
