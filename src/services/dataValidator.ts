import { DrawRecord, MarketType } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a single DrawRecord according to strict lottery market rules.
 */
export function validateDrawRecord(draw: Partial<DrawRecord> | null | undefined): ValidationResult {
  const errors: string[] = [];

  if (!draw || typeof draw !== 'object') {
    return { isValid: false, errors: ['Draw record must be an object.'] };
  }

  if (!draw.id || typeof draw.id !== 'string') {
    errors.push('Draw ID is missing or invalid.');
  }

  if (!draw.market || !['THAI', 'LAO', 'HANOI', 'HANOI_VIP'].includes(draw.market)) {
    errors.push(`Invalid market type: ${draw.market}`);
  }

  // Date format: YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!draw.date || !dateRegex.test(draw.date)) {
    errors.push(`Invalid date format: "${draw.date}". Expected YYYY-MM-DD.`);
  } else {
    const parsedDate = new Date(draw.date);
    if (isNaN(parsedDate.getTime())) {
      errors.push(`Date "${draw.date}" is not a valid calendar date.`);
    }
  }

  // Check top prize format according to market
  if (!draw.topPrize || typeof draw.topPrize !== 'string') {
    errors.push('Top prize is missing.');
  } else {
    if (!/^\d+$/.test(draw.topPrize)) {
      errors.push(`Top prize "${draw.topPrize}" must contain only numeric digits.`);
    }
    if (draw.market === 'THAI' && draw.topPrize.length !== 6) {
      errors.push(`Thai lottery top prize must be exactly 6 digits (got ${draw.topPrize.length}: "${draw.topPrize}").`);
    } else if (draw.market === 'LAO' && draw.topPrize.length !== 4 && draw.topPrize.length !== 6) {
      errors.push(`Lao lottery top prize must be 4 or 6 digits (got ${draw.topPrize.length}).`);
    } else if ((draw.market === 'HANOI' || draw.market === 'HANOI_VIP') && draw.topPrize.length !== 5) {
      errors.push(`Hanoi lottery top prize must be 5 digits (got ${draw.topPrize.length}).`);
    }
  }

  // 2-digit top & bottom must be exactly 2 numeric digits
  if (!draw.twoDigitTop || !/^\d{2}$/.test(draw.twoDigitTop)) {
    errors.push(`Invalid 2-digit top: "${draw.twoDigitTop}". Must be exactly 2 numeric digits.`);
  }

  if (!draw.twoDigitBottom || !/^\d{2}$/.test(draw.twoDigitBottom)) {
    errors.push(`Invalid 2-digit bottom: "${draw.twoDigitBottom}". Must be exactly 2 numeric digits.`);
  }

  // 3-digit top must be exactly 3 numeric digits
  if (draw.threeDigitTop && !/^\d{3}$/.test(draw.threeDigitTop)) {
    errors.push(`Invalid 3-digit top: "${draw.threeDigitTop}". Must be exactly 3 numeric digits.`);
  }

  // Thai 3-digit front & back
  if (draw.market === 'THAI') {
    if (draw.threeDigitFront && Array.isArray(draw.threeDigitFront)) {
      draw.threeDigitFront.forEach((front, idx) => {
        if (!/^\d{3}$/.test(front)) {
          errors.push(`Invalid front 3D #${idx + 1}: "${front}". Must be 3 numeric digits.`);
        }
      });
    }
    if (draw.threeDigitBack && Array.isArray(draw.threeDigitBack)) {
      draw.threeDigitBack.forEach((back, idx) => {
        if (!/^\d{3}$/.test(back)) {
          errors.push(`Invalid back 3D #${idx + 1}: "${back}". Must be 3 numeric digits.`);
        }
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitizes and deduplicates an array of draw records, sorting them newest to oldest.
 */
export function sanitizeDrawDataset(draws: unknown[]): {
  cleanDataset: DrawRecord[];
  rejectedCount: number;
  rejectionReasons: { id: string; errors: string[] }[];
} {
  const seenIds = new Set<string>();
  const seenDates = new Set<string>();
  const cleanDataset: DrawRecord[] = [];
  const rejectionReasons: { id: string; errors: string[] }[] = [];

  for (const candidate of draws) {
    const draw = candidate as Partial<DrawRecord>;
    const validation = validateDrawRecord(draw);
    if (!validation.isValid) {
      rejectionReasons.push({ id: draw.id || 'UNKNOWN', errors: validation.errors });
      continue;
    }

    const validDraw = draw as DrawRecord;

    // Deduplicate by ID and Date within the same market
    const uniqueKey = `${validDraw.market}-${validDraw.date}`;
    if (seenIds.has(validDraw.id) || seenDates.has(uniqueKey)) {
      rejectionReasons.push({
        id: validDraw.id,
        errors: [`Duplicate draw detected for market ${validDraw.market} on date ${validDraw.date}`]
      });
      continue;
    }

    seenIds.add(validDraw.id);
    seenDates.add(uniqueKey);
    cleanDataset.push(validDraw);
  }

  // Sort chronologically descending (newest first)
  cleanDataset.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    cleanDataset,
    rejectedCount: rejectionReasons.length,
    rejectionReasons
  };
}
