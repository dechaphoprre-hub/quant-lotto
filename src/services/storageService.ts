import { DrawRecord, MarketType } from '../types';
import { validateDrawRecord, sanitizeDrawDataset } from './dataValidator';

const STORAGE_PREFIX = 'quantlotto_dataset_';
const STORAGE_VERSION = 'v3_';

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

  /**
   * Save a verified dataset for a specific market to localStorage.
   */
  static saveMarketData(market: MarketType, dataset: DrawRecord[]): boolean {
    try {
      const { cleanDataset } = sanitizeDrawDataset(dataset);
      const key = `${STORAGE_PREFIX}${STORAGE_VERSION}${market}`;
      localStorage.setItem(key, JSON.stringify(cleanDataset));
      return true;
    } catch (e) {
      console.error(`[StorageService] Failed to save dataset for ${market}`, e);
      return false;
    }
  }

  /**
   * Quick Add a new official draw record to the top of the dataset.
   */
  static addNewDraw(market: MarketType, newDraw: DrawRecord, currentDataset: DrawRecord[]): {
    success: boolean;
    updatedDataset: DrawRecord[];
    errors?: string[];
  } {
    const validation = validateDrawRecord(newDraw);
    if (!validation.isValid) {
      return {
        success: false,
        updatedDataset: currentDataset,
        errors: validation.errors
      };
    }

    // Check if ID or Date already exists
    const duplicate = currentDataset.some(d => d.id === newDraw.id || d.date === newDraw.date);
    if (duplicate) {
      return {
        success: false,
        updatedDataset: currentDataset,
        errors: [`A draw record for date ${newDraw.date} already exists in ${market}.`]
      };
    }

    const updated = [newDraw, ...currentDataset];
    const { cleanDataset } = sanitizeDrawDataset(updated);
    this.saveMarketData(market, cleanDataset);

    return {
      success: true,
      updatedDataset: cleanDataset
    };
  }

  /**
   * Reset market dataset back to master factory defaults.
   */
  static resetMarketData(market: MarketType, factoryDefault: DrawRecord[]): DrawRecord[] {
    try {
      const key = `${STORAGE_PREFIX}${STORAGE_VERSION}${market}`;
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`[StorageService] Reset failed for ${market}`, e);
    }
    return factoryDefault;
  }

  /**
   * Export all datasets as a JSON backup string.
   */
  static exportBackup(): string {
    const backup: Record<string, DrawRecord[]> = {};
    const markets: MarketType[] = ['THAI', 'LAO', 'HANOI', 'HANOI_VIP'];

    markets.forEach(m => {
      const key = `${STORAGE_PREFIX}${STORAGE_VERSION}${m}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          backup[m] = JSON.parse(raw);
        } catch {}
      }
    });

    return JSON.stringify({
      version: STORAGE_VERSION,
      exportedAt: new Date().toISOString(),
      data: backup
    }, null, 2);
  }

  /**
   * Import all datasets from a JSON backup string.
   */
  static importBackup(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data || typeof parsed.data !== 'object') {
        return { success: false, message: 'Invalid backup structure: missing data field.' };
      }

      Object.entries(parsed.data).forEach(([market, draws]) => {
        if (Array.isArray(draws)) {
          const { cleanDataset } = sanitizeDrawDataset(draws as DrawRecord[]);
          this.saveMarketData(market as MarketType, cleanDataset);
        }
      });

      return { success: true, message: 'Backup restored successfully.' };
    } catch (e) {
      return { success: false, message: (e as Error).message || 'Corrupted JSON file.' };
    }
  }
}
