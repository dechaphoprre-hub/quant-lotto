import { createHash } from 'node:crypto';
import { MarketType } from '../src/types/index.ts';

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dateInput = process.env.DRAW_DATE || new Date().toISOString().slice(0, 10);

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
}

const market: MarketType = 'THAI';
const gloUrl = 'https://www.glo.or.th/api/lottery/getLotteryAward';
const sourceUrl = 'https://www.glo.or.th/mission/awarding/orderby-time';

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

const api = async (path: string, init: RequestInit = {}) => {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation,resolution=merge-duplicates',
      ...(init.headers || {})
    }
  });
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
  return response.status === 204 ? null : response.json();
};

const getValue = (values: GloNumber[] | undefined, index = 0) => values?.[index]?.value || '';
const [year, month, day] = dateInput.split('-');
if (!year || !month || !day) throw new Error(`Invalid DRAW_DATE: ${dateInput}`);

const run = await api(`ingestion_runs`, {
  method: 'POST',
  body: JSON.stringify({ market_code: market, status: 'RUNNING', records_seen: 0 })
}) as Array<{ id: string }>;
const runId = run?.[0]?.id;

try {
  const gloResponse = await fetch(gloUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ date: day, month, year })
  });
  if (!gloResponse.ok) throw new Error(`GLO HTTP ${gloResponse.status}`);
  const payload = await gloResponse.json() as GloPayload;
  const data = payload.response?.data;
  if (!payload.status || !data) throw new Error('GLO returned no published result for this date.');

  const topPrize = getValue(data.first?.number);
  const bottomTwo = getValue(data.last2?.number);
  const frontThree = data.last3f?.number?.map(item => item.value) || [];
  const backThree = data.last3b?.number?.map(item => item.value) || [];
  const threeTop = getValue(data.n3?.straight3?.number);
  const required = [topPrize, bottomTwo, ...frontThree, ...backThree, threeTop];
  if (!/^\d{6}$/.test(topPrize) || !/^\d{2}$/.test(bottomTwo) || frontThree.length !== 2 || backThree.length !== 2 || !/^\d{3}$/.test(threeTop) || required.some(value => !/^\d+$/.test(value))) {
    throw new Error('GLO response failed Thai result shape validation.');
  }

  const raw = JSON.stringify({ provider: 'GLO', endpoint: gloUrl, requestedDate: dateInput, payload });
  const hash = createHash('sha256').update(raw).digest('hex');
  const sourceRows = await api(`data_sources?market_code=eq.${market}&url=eq.${encodeURIComponent(sourceUrl)}&select=id`);
  const sourceId = sourceRows?.[0]?.id;
  if (!sourceId) throw new Error('Verified GLO data source is missing in Supabase.');

  await api('data_sources?id=eq.' + sourceId, { method: 'PATCH', body: JSON.stringify({ trust_status: 'VERIFIED' }) });
  await api('draws?on_conflict=id', {
    method: 'POST',
    body: JSON.stringify({
      id: `th-${dateInput}`, market_code: market, draw_date: dateInput,
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
  console.log(`[PASS] GLO ${dateInput}: ${topPrize}, bottom ${bottomTwo}`);
} catch (error) {
  if (runId) await api(`ingestion_runs?id=eq.${runId}`, { method: 'PATCH', body: JSON.stringify({ finished_at: new Date().toISOString(), status: 'FAILED', error_message: error instanceof Error ? error.message : String(error) }) });
  throw error;
}
