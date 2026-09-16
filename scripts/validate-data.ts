import { MarketType } from '../src/types/index.ts';
import { sanitizeDrawDataset } from '../src/services/dataValidator.ts';

const baseUrl = process.env.DATA_API_BASE_URL?.replace(/\/$/, '');
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const markets = (process.env.VALIDATE_MARKETS || 'THAI').split(',') as MarketType[];
const maxAgeHours = Number(process.env.MAX_DATA_AGE_HOURS || 48);

if (!baseUrl && !(supabaseUrl && supabaseAnonKey)) {
  throw new Error('Configure DATA_API_BASE_URL or SUPABASE_URL plus SUPABASE_ANON_KEY.');
}

const controllerFor = () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  return { controller, timeout };
};

const validateMarket = async (market: MarketType) => {
  const { controller, timeout } = controllerFor();
  try {
    const directSupabase = !baseUrl;
    const endpoint = directSupabase
      ? `${supabaseUrl}/rest/v1/draws?market_code=eq.${market}&verification_status=eq.VERIFIED&select=id,market_code,draw_date,draw_number,top_prize,two_digit_top,two_digit_bottom,three_digit_top,three_digit_front,three_digit_back,fetched_at&order=draw_date.desc`
      : `${baseUrl}/markets/${market}/draws`;
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
        ...(directSupabase ? { apikey: supabaseAnonKey as string, Authorization: `Bearer ${supabaseAnonKey}` } : {})
      },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const rawPayload = await response.json() as {
      market?: MarketType;
      fetchedAt?: string;
      draws?: unknown[];
    } | Record<string, unknown>[];
    const rows = Array.isArray(rawPayload) ? rawPayload : rawPayload.draws || [];
    const normalizedRows = directSupabase ? rows.map(row => {
      const value = row as Record<string, unknown>;
      return {
        id: value.id,
        market: value.market_code,
        date: value.draw_date,
        drawNumber: value.draw_number,
        dayOfWeekTh: '',
        topPrize: value.top_prize,
        twoDigitTop: value.two_digit_top,
        twoDigitBottom: value.two_digit_bottom,
        threeDigitTop: value.three_digit_top,
        threeDigitFront: value.three_digit_front,
        threeDigitBack: value.three_digit_back
      };
    }) : rows;
    const latestFetchedAt = Array.isArray(rawPayload)
      ? rawPayload.map(row => row.fetched_at).find(Boolean)
      : rawPayload.fetchedAt;
    const payload = directSupabase
      ? { market, fetchedAt: latestFetchedAt, draws: normalizedRows }
      : rawPayload;

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
