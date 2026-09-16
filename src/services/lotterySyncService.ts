import { MarketType, DrawRecord } from '../types';
import { sanitizeDrawDataset } from './dataValidator';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseConfig';

export interface SyncStatus {
  lastChecked: string;
  isSyncing: boolean;
  success: boolean;
  message: string;
}

interface DataApiResponse {
  market: MarketType;
  draws: unknown[];
  fetchedAt?: string;
  source?: string;
}

const DATA_API_BASE_URL = (import.meta.env.VITE_DATA_API_BASE_URL as string | undefined)?.replace(/\/$/, '');
const REQUEST_TIMEOUT_MS = 10000;

const getThaiDayName = (date: string): string => {
  const names = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  return names[new Date(`${date}T00:00:00Z`).getUTCDay()] || '';
};

const mapSupabaseDraw = (row: Record<string, unknown>): DrawRecord => ({
  id: String(row.id),
  market: row.market_code as MarketType,
  date: String(row.draw_date),
  dayOfWeekTh: getThaiDayName(String(row.draw_date)),
  drawNumber: String(row.draw_number),
  topPrize: String(row.top_prize),
  twoDigitTop: String(row.two_digit_top),
  twoDigitBottom: String(row.two_digit_bottom),
  threeDigitTop: row.three_digit_top ? String(row.three_digit_top) : undefined,
  threeDigitFront: Array.isArray(row.three_digit_front) ? row.three_digit_front.map(String) : undefined,
  threeDigitBack: Array.isArray(row.three_digit_back) ? row.three_digit_back.map(String) : undefined,
  verificationStatus: row.verification_status === 'PENDING' ? 'PENDING' : 'VERIFIED'
});

/** Bundled sample data was never fetched live — always label it DEMO, even if the record already claims otherwise. */
const asDemo = (draws: DrawRecord[]): DrawRecord[] => draws.map(d => ({ ...d, verificationStatus: 'DEMO' }));

/**
 * Lottery Cloud Sync Service:
 * Manages automated synchronization with remote cloud feeds/APIs,
 * with fallback handling, caching, and rate limiting.
 */
export class LotterySyncService {
  private static status: SyncStatus = {
    lastChecked: new Date().toISOString(),
    isSyncing: false,
    success: true,
    message: 'System connected & operational.'
  };

  /**
   * Get current sync status.
   */
  static getStatus(): SyncStatus {
    return { ...this.status };
  }

  /**
   * Check if a market is currently near its live draw window.
   */
  static isNearDrawWindow(market: MarketType): boolean {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const hour = now.getHours();
    const date = now.getDate();

    if (market === 'THAI') {
      // 1st or 16th between 14:00 and 16:00
      return (date === 1 || date === 16) && hour >= 14 && hour <= 16;
    } else if (market === 'LAO') {
      // Mon, Wed, Fri between 19:30 and 21:00
      return (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) && hour >= 19 && hour <= 21;
    } else if (market === 'HANOI' || market === 'HANOI_VIP') {
      // Daily between 18:00 and 20:00
      return hour >= 18 && hour <= 20;
    }

    return false;
  }

  /**
  * Fetch and validate a market dataset from the configured production API.
  * The bundled snapshot is used only when no API is configured or the request fails.
   */
  static async checkAndUpdate(
    market: MarketType,
    currentDataset: DrawRecord[]
  ): Promise<{ updated: boolean; dataset: DrawRecord[]; message: string }> {
    this.status.isSyncing = true;

    try {
      if (!DATA_API_BASE_URL && !(SUPABASE_URL && SUPABASE_ANON_KEY)) {
        const { cleanDataset } = sanitizeDrawDataset(currentDataset);
        this.status = {
          lastChecked: new Date().toISOString(),
          isSyncing: false,
          success: false,
          message: `Remote data API is not configured; using bundled snapshot for ${market}.`
        };
        return { updated: false, dataset: asDemo(cleanDataset), message: this.status.message };
      }

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      const isCustomApi = Boolean(DATA_API_BASE_URL);
      const endpoint = isCustomApi
        ? `${DATA_API_BASE_URL}/markets/${market}/draws`
        : `${SUPABASE_URL}/rest/v1/draws?market_code=eq.${market}&verification_status=in.(VERIFIED,PENDING)&select=id,market_code,draw_date,draw_number,top_prize,two_digit_top,two_digit_bottom,three_digit_top,three_digit_front,three_digit_back,verification_status&order=draw_date.desc`;
      const response = await fetch(endpoint, {
        headers: {
          Accept: 'application/json',
          ...(isCustomApi ? {} : {
            apikey: SUPABASE_ANON_KEY as string,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`
          })
        },
        signal: controller.signal
      });
      window.clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Data API returned HTTP ${response.status}.`);
      }

      const rawPayload = await response.json() as Partial<DataApiResponse> | Record<string, unknown>[];
      const payload: Partial<DataApiResponse> = isCustomApi
        ? rawPayload as Partial<DataApiResponse>
        : {
          market,
          draws: Array.isArray(rawPayload) ? rawPayload.map(mapSupabaseDraw) : [],
          fetchedAt: new Date().toISOString(),
          source: 'Supabase verified draws'
        };
      if (payload.market !== market || !Array.isArray(payload.draws)) {
        throw new Error('Data API response does not match the required schema.');
      }

      const { cleanDataset, rejectedCount } = sanitizeDrawDataset(payload.draws);
      if (cleanDataset.length === 0 || rejectedCount > 0) {
        throw new Error(`Data API returned ${rejectedCount} invalid records.`);
      }

      this.status = {
        lastChecked: new Date().toISOString(),
        isSyncing: false,
        success: true,
        message: `Loaded ${cleanDataset.length} validated draws for ${market}${payload.source ? ` from ${payload.source}` : ''}.`
      };

      return {
        updated: true,
        dataset: cleanDataset,
        message: this.status.message
      };
    } catch (e) {
      this.status = {
        lastChecked: new Date().toISOString(),
        isSyncing: false,
        success: false,
        message: `Remote data unavailable for ${market}; using bundled snapshot.`
      };

      return {
        updated: false,
        dataset: asDemo(currentDataset),
        message: this.status.message
      };
    }
  }
}
