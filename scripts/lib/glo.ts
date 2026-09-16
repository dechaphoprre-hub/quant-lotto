import { createHash } from 'node:crypto';
import { MarketType } from '../../src/types/index.ts';

const MARKET: MarketType = 'THAI';
const GLO_URL = 'https://www.glo.or.th/api/lottery/getLotteryAward';
const SOURCE_URL = 'https://www.glo.or.th/mission/awarding/orderby-time';

interface GloNumber { value: string; }
interface GloPayload {
  status?: boolean;
  response?: {
    date?: string;
    data?: {
      first?: { number?: GloNumber[] };
      last2?: { number?: GloNumber[] };
      last3f?: { number?: GloNumber[] };
      last3b?: { number?: GloNumber[] };
      n3?: { straight3?: { number?: GloNumber[] } };
    };
  };
}

export interface SupabaseApiConfig {
  supabaseUrl: string;
  serviceRoleKey: string;
}

export type SupabaseApi = (path: string, init?: RequestInit) => Promise<unknown>;

export const createSupabaseApi = (config: SupabaseApiConfig): SupabaseApi => {
  return async (path: string, init: RequestInit = {}) => {
    const response = await fetch(`${config.supabaseUrl}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation,resolution=merge-duplicates',
        ...(init.headers || {})
      }
    });
    if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
    return response.status === 204 ? null : response.json();
  };
};

const getValue = (values: GloNumber[] | undefined, index = 0) => values?.[index]?.value || '';

export interface GloIngestResult {
  status: 'SUCCEEDED' | 'FAILED';
  dateInput: string;
  message: string;
}

/**
 * Fetches the official GLO result for a single draw date directly from the
 * provider (never from the bundled local snapshot) and upserts it into
 * Supabase as a VERIFIED draw. Never throws; failures are reported in the
 * returned result so a caller can backfill many dates without one bad date
 * aborting the run.
 */
export const ingestThaiGloDraw = async (dateInput: string, api: SupabaseApi): Promise<GloIngestResult> => {
  const [year, month, day] = dateInput.split('-');
  if (!year || !month || !day) {
    return { status: 'FAILED', dateInput, message: `Invalid draw date: ${dateInput}` };
  }

  const run = await api('ingestion_runs', {
    method: 'POST',
    body: JSON.stringify({ market_code: MARKET, status: 'RUNNING', records_seen: 0 })
  }) as Array<{ id: string }>;
  const runId = run?.[0]?.id;

  try {
    let payload: GloPayload | undefined;
    let lastError = 'unknown provider error';
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const gloResponse = await fetch(GLO_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'User-Agent': 'quant-lotto-ingestion/1.0'
          },
          body: JSON.stringify({ date: day, month, year }),
          signal: controller.signal
        });
        clearTimeout(timeout);
        if (!gloResponse.ok) throw new Error(`GLO HTTP ${gloResponse.status}`);
        payload = await gloResponse.json() as GloPayload;
        if (payload.status && payload.response?.data) break;
        lastError = 'GLO returned no published result for this date.';
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
      }
      await new Promise(resolve => setTimeout(resolve, attempt * 3000));
    }

    if (!payload) throw new Error(`GLO unavailable after retries: ${lastError}`);
    const data = payload.response?.data;
    if (!payload.status || !data) throw new Error(lastError);

    const topPrize = getValue(data.first?.number);
    const bottomTwo = getValue(data.last2?.number);
    const frontThree = data.last3f?.number?.map(item => item.value) || [];
    const backThree = data.last3b?.number?.map(item => item.value) || [];
    const threeTop = getValue(data.n3?.straight3?.number);
    const required = [topPrize, bottomTwo, ...frontThree, ...backThree, threeTop];
    if (!/^\d{6}$/.test(topPrize) || !/^\d{2}$/.test(bottomTwo) || frontThree.length !== 2 || backThree.length !== 2 || !/^\d{3}$/.test(threeTop) || required.some(value => !/^\d+$/.test(value))) {
      throw new Error('GLO response failed Thai result shape validation.');
    }

    const raw = JSON.stringify({ provider: 'GLO', endpoint: GLO_URL, requestedDate: dateInput, payload });
    const hash = createHash('sha256').update(raw).digest('hex');
    const sourceRows = await api(`data_sources?market_code=eq.${MARKET}&url=eq.${encodeURIComponent(SOURCE_URL)}&select=id`) as Array<{ id: string }>;
    const sourceId = sourceRows?.[0]?.id;
    if (!sourceId) throw new Error('Verified GLO data source is missing in Supabase.');

    await api('data_sources?id=eq.' + sourceId, { method: 'PATCH', body: JSON.stringify({ trust_status: 'VERIFIED' }) });
    await api('draws?on_conflict=id', {
      method: 'POST',
      body: JSON.stringify({
        id: `th-${dateInput}`, market_code: MARKET, draw_date: dateInput,
        draw_number: `GLO ${dateInput}`, top_prize: topPrize,
        two_digit_top: topPrize.slice(-2), two_digit_bottom: bottomTwo,
        three_digit_top: threeTop, three_digit_front: frontThree, three_digit_back: backThree,
        verification_status: 'VERIFIED', source_id: sourceId, content_hash: hash,
        fetched_at: new Date().toISOString(), verified_at: new Date().toISOString()
      })
    });
    await api('draw_observations?on_conflict=source_id,payload_hash', {
      method: 'POST',
      body: JSON.stringify({ draw_id: `th-${dateInput}`, source_id: sourceId, raw_payload: JSON.parse(raw), payload_hash: hash, reconciliation_status: 'MATCHED' })
    });
    if (runId) await api(`ingestion_runs?id=eq.${runId}`, { method: 'PATCH', body: JSON.stringify({ finished_at: new Date().toISOString(), status: 'SUCCEEDED', records_seen: 1, records_accepted: 1 }) });
    return { status: 'SUCCEEDED', dateInput, message: `${topPrize}, bottom ${bottomTwo}` };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (runId) await api(`ingestion_runs?id=eq.${runId}`, { method: 'PATCH', body: JSON.stringify({ finished_at: new Date().toISOString(), status: 'FAILED', error_message: message }) });
    return { status: 'FAILED', dateInput, message };
  }
};
