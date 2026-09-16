import { DrawRecord, MarketType } from '../types';
import { sanitizeDrawDataset } from './dataValidator';

const STORAGE_PREFIX = 'quantlotto_dataset_';
const STORAGE_VERSION = 'v4_';

/**
 * Storage Service: Manages client-side persistence and zero-latency caching
 * of authentic lottery datasets with automatic fallback to bundled master records.
 */
export class LotteryStorageService {
  /**
   * Load dataset for a specific market from localStorage or fallback to defaults.
   */
  static loadMarketData(market: MarketType, fallbackDataset: DrawRecord[]): DrawRecord[] {
    try {
      const key = `${STORAGE_PREFIX}${STORAGE_VERSION}${market}`;
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsed: DrawRecord[] = JSON.parse(cached);
        const { cleanDataset, rejectedCount } = sanitizeDrawDataset(parsed);
        if (cleanDataset.length > 0 && rejectedCount === 0) {
          return cleanDataset;
        }
      }
    } catch (e) {
      console.warn(`[StorageService] Failed to load cached data for ${market}, using fallback.`, e);
    }
    return fallbackDataset;
  }

}
