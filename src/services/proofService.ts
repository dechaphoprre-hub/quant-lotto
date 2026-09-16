import { MarketType } from '../types';

export interface ProofRecordView {
  id: string;
  market: MarketType;
  drawDate: string;
  predictedTop5: string[];
  commitmentHash: string;
  generatedAt: string;
  matchType: 'DIRECT_HIT' | 'REVERSE_HIT' | 'CLOSE_CALL' | 'MISS' | null;
  scoredAt: string | null;
  actualTwoDigitTop: string | null;
  actualTwoDigitBottom: string | null;
}

export interface ProofFetchResult {
  records: ProofRecordView[];
  available: boolean;
  message: string;
}

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const REQUEST_TIMEOUT_MS = 10000;

interface ProofRow {
  id: string;
  market_code: MarketType;
  draw_date: string;
  predicted_top5: string[];
  commitment_hash: string;
  generated_at: string;
  match_type: ProofRecordView['matchType'];
  scored_at: string | null;
  draws: { two_digit_top: string; two_digit_bottom: string } | null;
}

/**
 * Reads the real, pre-committed prediction ledger from Supabase.
 * Returns an empty, honestly-labelled result when the backend isn't
 * configured or has no track record yet — this view never falls back
 * to fabricated sample data.
 */
export const fetchProofRecords = async (market: MarketType): Promise<ProofFetchResult> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { records: [], available: false, message: 'Backend not configured.' };
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const endpoint = `${SUPABASE_URL}/rest/v1/proof_records?market_code=eq.${market}&select=id,market_code,draw_date,predicted_top5,commitment_hash,generated_at,match_type,scored_at,draws(two_digit_top,two_digit_bottom)&order=draw_date.desc`;
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Supabase returned HTTP ${response.status}`);

    const rows = await response.json() as ProofRow[];
    const records: ProofRecordView[] = rows.map(row => ({
      id: row.id,
      market: row.market_code,
      drawDate: row.draw_date,
      predictedTop5: row.predicted_top5,
      commitmentHash: row.commitment_hash,
      generatedAt: row.generated_at,
      matchType: row.match_type,
      scoredAt: row.scored_at,
      actualTwoDigitTop: row.draws?.two_digit_top ?? null,
      actualTwoDigitBottom: row.draws?.two_digit_bottom ?? null
    }));

    return { records, available: true, message: `Loaded ${records.length} committed prediction(s).` };
  } catch (error) {
    return {
      records: [],
      available: false,
      message: error instanceof Error ? error.message : 'Unable to reach the proof ledger.'
    };
  } finally {
    window.clearTimeout(timeout);
  }
};
