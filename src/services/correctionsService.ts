import { MarketType } from '../types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseConfig';
import { AdminSession } from './authService';

export interface DrawCorrectionInput {
  marketCode: MarketType;
  drawDate: string;
  drawNumber: string;
  topPrize: string;
  twoDigitTop: string;
  twoDigitBottom: string;
  threeDigitTop?: string;
  threeDigitFront?: string[];
  threeDigitBack?: string[];
  reason: string;
  isOfficiallyConfirmed: boolean;
}

export interface DrawCorrectionView {
  id: string;
  marketCode: MarketType;
  drawDate: string;
  topPrize: string;
  twoDigitTop: string;
  twoDigitBottom: string;
  reason: string;
  isOfficiallyConfirmed: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedBy: string;
  createdAt: string;
}

const authHeaders = (session: AdminSession) => ({
  apikey: SUPABASE_ANON_KEY as string,
  Authorization: `Bearer ${session.accessToken}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation'
});

export const submitCorrection = async (
  session: AdminSession,
  input: DrawCorrectionInput
): Promise<{ success: true } | { success: false; error: string }> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return { success: false, error: 'Backend not configured.' };

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/draw_corrections`, {
      method: 'POST',
      headers: authHeaders(session),
      body: JSON.stringify({
        market_code: input.marketCode,
        draw_date: input.drawDate,
        draw_number: input.drawNumber,
        top_prize: input.topPrize,
        two_digit_top: input.twoDigitTop,
        two_digit_bottom: input.twoDigitBottom,
        three_digit_top: input.threeDigitTop,
        three_digit_front: input.threeDigitFront || [],
        three_digit_back: input.threeDigitBack || [],
        reason: input.reason,
        is_officially_confirmed: input.isOfficiallyConfirmed
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

/** Rows this signer is allowed to see under RLS: their own, plus every PENDING one if they're an admin. */
export const fetchPendingCorrections = async (session: AdminSession): Promise<DrawCorrectionView[]> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/draw_corrections?status=eq.PENDING&order=created_at.asc&select=id,market_code,draw_date,top_prize,two_digit_top,two_digit_bottom,reason,is_officially_confirmed,status,submitted_by,created_at`,
      { headers: authHeaders(session) }
    );
    if (!response.ok) return [];
    const rows = await response.json() as Array<Record<string, unknown>>;
    return rows.map(row => ({
      id: String(row.id),
      marketCode: row.market_code as MarketType,
      drawDate: String(row.draw_date),
      topPrize: String(row.top_prize),
      twoDigitTop: String(row.two_digit_top),
      twoDigitBottom: String(row.two_digit_bottom),
      reason: String(row.reason),
      isOfficiallyConfirmed: Boolean(row.is_officially_confirmed),
      status: row.status as DrawCorrectionView['status'],
      submittedBy: String(row.submitted_by),
      createdAt: String(row.created_at)
    }));
  } catch {
    return [];
  }
};

export const reviewCorrection = async (
  session: AdminSession,
  id: string,
  decision: 'APPROVED' | 'REJECTED'
): Promise<{ success: true } | { success: false; error: string }> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return { success: false, error: 'Backend not configured.' };

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/draw_corrections?id=eq.${id}`, {
      method: 'PATCH',
      headers: authHeaders(session),
      body: JSON.stringify({ status: decision })
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return { success: false, error: body.message || `Review rejected (HTTP ${response.status}). Note: an admin cannot review their own submission.` };
    }
    const rows = await response.json();
    if (Array.isArray(rows) && rows.length === 0) {
      return { success: false, error: 'No row updated — you may be trying to review your own submission, which RLS blocks.' };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error.' };
  }
};
