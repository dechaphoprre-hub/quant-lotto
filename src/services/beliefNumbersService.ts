import { MarketType } from '../types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseConfig';
import { AdminSession } from './authService';

export interface BeliefNumberView {
  id: string;
  market: MarketType | null;
  headline: string;
  numbers: string[];
  sourceNote: string;
  createdAt: string;
}

const REQUEST_TIMEOUT_MS = 10000;

/**
 * Reads real, admin-submitted "numbers from the news/folklore" entries.
 * Empty when the backend isn't configured or nobody has posted one yet —
 * this never falls back to fabricated example content.
 */
export const fetchBeliefNumbers = async (market: MarketType): Promise<BeliefNumberView[]> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const endpoint = `${SUPABASE_URL}/rest/v1/belief_numbers?select=id,market_code,headline,numbers,source_note,created_at&or=(market_code.eq.${market},market_code.is.null)&order=created_at.desc&limit=20`;
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json', apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      signal: controller.signal
    });
    if (!response.ok) return [];

    const rows = await response.json() as Array<Record<string, unknown>>;
    return rows.map(row => ({
      id: String(row.id),
      market: (row.market_code as MarketType | null) ?? null,
      headline: String(row.headline),
      numbers: Array.isArray(row.numbers) ? row.numbers.map(String) : [],
      sourceNote: String(row.source_note),
      createdAt: String(row.created_at)
    }));
  } catch {
    return [];
  } finally {
    window.clearTimeout(timeout);
  }
};

export interface BeliefNumberInput {
  marketCode: MarketType | null;
  headline: string;
  numbers: string[];
  sourceNote: string;
}

export const submitBeliefNumber = async (
  session: AdminSession,
  input: BeliefNumberInput
): Promise<{ success: true } | { success: false; error: string }> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return { success: false, error: 'Backend not configured.' };

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/belief_numbers`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({
        market_code: input.marketCode,
        headline: input.headline,
        numbers: input.numbers,
        source_note: input.sourceNote
      })
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return { success: false, error: body.message || `Submission rejected (HTTP ${response.status}).` };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error.' };
  }
};
