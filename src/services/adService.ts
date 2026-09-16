import { MarketType } from '../types';

export interface AdCampaignView {
  id: string;
  name: string;
  label: string;
  imageUrl: string;
  targetUrl: string;
}

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const REQUEST_TIMEOUT_MS = 8000;

interface AdCampaignRow {
  id: string;
  name: string;
  label: string;
  image_url: string;
  target_url: string;
}

/**
 * Reads the current active sponsor banner for a slot from Supabase.
 * Row Level Security on ad_campaigns already restricts results to rows
 * where active = true and now() is within [starts_at, ends_at], so an
 * empty result here always means there is genuinely no live sponsor —
 * this never falls back to a placeholder or an estimated-revenue banner.
 */
export const fetchActiveBanner = async (
  market: MarketType,
  slot: 'TOP_BANNER' | 'INLINE' | 'SIDEBAR' | 'FOOTER'
): Promise<AdCampaignView | null> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const endpoint = `${SUPABASE_URL}/rest/v1/ad_campaigns?select=id,name,label,image_url,target_url&slot=eq.${slot}&or=(market_code.eq.${market},market_code.is.null)&order=created_at.desc&limit=1`;
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      },
      signal: controller.signal
    });
    if (!response.ok) return null;

    const rows = await response.json() as AdCampaignRow[];
    const row = rows[0];
    if (!row) return null;

    return { id: row.id, name: row.name, label: row.label, imageUrl: row.image_url, targetUrl: row.target_url };
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
};
