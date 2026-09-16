import { MarketType } from '../src/types/index.ts';
import { sanitizeDrawDataset } from '../src/services/dataValidator.ts';

const baseUrl = process.env.DATA_API_BASE_URL?.replace(/\/$/, '');
const markets: MarketType[] = ['THAI', 'LAO', 'HANOI', 'HANOI_VIP'];
const maxAgeHours = Number(process.env.MAX_DATA_AGE_HOURS || 48);

if (!baseUrl) {
  throw new Error('DATA_API_BASE_URL is required. Refusing to validate bundled snapshots as live data.');
}

const controllerFor = () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  return { controller, timeout };
};

const validateMarket = async (market: MarketType) => {
  const { controller, timeout } = controllerFor();
  try {
    const response = await fetch(`${baseUrl}/markets/${market}/draws`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const payload = await response.json() as {
      market?: MarketType;
      fetchedAt?: string;
      draws?: unknown[];
    };

    if (payload.market !== market || !Array.isArray(payload.draws)) {
      throw new Error('response does not match the data API contract');
    }

    const { cleanDataset, rejectedCount } = sanitizeDrawDataset(payload.draws);
    if (cleanDataset.length === 0 || rejectedCount > 0) {
      throw new Error(`${rejectedCount} invalid records; ${cleanDataset.length} accepted`);
    }

    if (!payload.fetchedAt || Number.isNaN(Date.parse(payload.fetchedAt))) {
      throw new Error('fetchedAt is missing or invalid');
    }

    const ageHours = (Date.now() - Date.parse(payload.fetchedAt)) / 3_600_000;
    if (ageHours > maxAgeHours) {
      throw new Error(`data is ${ageHours.toFixed(1)} hours old (limit ${maxAgeHours})`);
    }

    console.log(`[PASS] ${market}: ${cleanDataset.length} records, ${ageHours.toFixed(1)} hours old`);
  } finally {
    clearTimeout(timeout);
  }
};

const failures: string[] = [];
for (const market of markets) {
  try {
    await validateMarket(market);
  } catch (error) {
    failures.push(`${market}: ${error instanceof Error ? error.message : String(error)}`);
    console.error(`[FAIL] ${market}: ${failures.at(-1)}`);
  }
}

if (failures.length > 0) {
  throw new Error(`${failures.length} market validation(s) failed.`);
}
