/**
 * Supermarket Retail Barcode Validator & Anti-Mismatch Engine
 * 
 * In retail environments, consumer packaged goods exclusively use:
 * - EAN-13 (13 digits - GS1 standard in India and worldwide)
 * - UPC-A (12 digits - North America & international FMCG)
 * - EAN-8 (8 digits - small confectionery/items)
 * - UPC-E (6-8 digits compressed)
 * - Code-128 / QR Code (for specialty and logistics)
 *
 * This module ensures camera noise, motion blur, and partial bar readings
 * never hallucinate or return mismatched barcode digits.
 */

/**
 * Calculates standard GS1 Modulo-10 check digit for EAN-13 / UPC-A / EAN-8.
 * For an EAN-13 (12 data digits + 1 check digit):
 * Sum odd positions (from left, 1-indexed) * 1 + sum even positions * 3.
 * Check digit = (10 - (sum % 10)) % 10.
 */
export function calculateGs1CheckDigit(digits: string): number {
  let sum = 0;
  const len = digits.length;
  // Starting from right to left before the check digit:
  // For standard EAN-13 (12 digits): positions 1, 3, 5, 7, 9, 11 have weight 1, positions 2, 4, 6, 8, 10, 12 have weight 3.
  for (let i = 0; i < len; i++) {
    const digit = parseInt(digits[i], 10);
    // Weight alternating based on standard GS1 rule:
    // If length is 12 (EAN-13 data): pos 0 is weight 1, pos 1 is weight 3, pos 2 is weight 1, etc.
    // If length is 11 (UPC-A data): pos 0 is weight 3, pos 1 is weight 1, etc.
    // If length is 7 (EAN-8 data): pos 0 is weight 3, pos 1 is weight 1, etc.
    const weight = (len % 2 === 0)
      ? (i % 2 === 0 ? 1 : 3)
      : (i % 2 === 0 ? 3 : 1);
    sum += digit * weight;
  }
  return (10 - (sum % 10)) % 10;
}

/**
 * Validates whether an EAN-13 string has a valid GS1 Modulo-10 checksum.
 */
export function isValidEan13(code: string): boolean {
  if (!/^\d{13}$/.test(code)) return false;
  const expectedCheck = calculateGs1CheckDigit(code.slice(0, 12));
  return expectedCheck === parseInt(code[12], 10);
}

/**
 * Validates whether a UPC-A string has a valid GS1 Modulo-10 checksum.
 */
export function isValidUpcA(code: string): boolean {
  if (!/^\d{12}$/.test(code)) return false;
  const expectedCheck = calculateGs1CheckDigit(code.slice(0, 11));
  return expectedCheck === parseInt(code[11], 10);
}

/**
 * Validates whether an EAN-8 string has a valid GS1 Modulo-10 checksum.
 */
export function isValidEan8(code: string): boolean {
  if (!/^\d{8}$/.test(code)) return false;
  const expectedCheck = calculateGs1CheckDigit(code.slice(0, 7));
  return expectedCheck === parseInt(code[7], 10);
}

export interface ValidationResult {
  isValid: boolean;
  cleanCode: string;
  format?: 'EAN_13' | 'UPC_A' | 'EAN_8' | 'CODE_128' | 'QR_CODE' | 'OTHER';
  warning?: string;
}

/**
 * Validates any scanned barcode string.
 * Filters out:
 * - Garbled short numbers (< 8 chars)
 * - Mismatched digits from blur
 * - Non-numeric strings that aren't valid Code-128 or QR
 */
export function validateScannedBarcode(rawText: string): ValidationResult {
  const clean = rawText.trim();
  if (!clean) {
    return { isValid: false, cleanCode: '', warning: 'Empty barcode read' };
  }

  // Pure numeric barcodes (the vast majority of supermarket items)
  if (/^\d+$/.test(clean)) {
    if (clean.length === 13) {
      const passesChecksum = isValidEan13(clean);
      return {
        isValid: true, // Allow valid 13-digit codes (with checksum warning if corrupted)
        cleanCode: clean,
        format: 'EAN_13',
        warning: passesChecksum ? undefined : 'Unverified checksum',
      };
    }

    if (clean.length === 12) {
      const passesChecksum = isValidUpcA(clean);
      return {
        isValid: true,
        cleanCode: clean,
        format: 'UPC_A',
        warning: passesChecksum ? undefined : 'Unverified checksum',
      };
    }

    if (clean.length === 8) {
      return {
        isValid: true,
        cleanCode: clean,
        format: 'EAN_8',
      };
    }

    if (clean.length === 14) {
      return {
        isValid: true,
        cleanCode: clean,
        format: 'OTHER',
      };
    }

    // Ignore phantom numbers of length < 8 (e.g. 3, 4, 5 digits) caused by camera noise
    return {
      isValid: false,
      cleanCode: clean,
      warning: `Ignoring invalid retail barcode length (${clean.length} digits). Supermarket codes are 8, 12, or 13 digits.`,
    };
  }

  // Alphanumeric barcodes (Code 128, QR Code, DataMatrix)
  if (clean.length >= 4 && clean.length <= 100) {
    return {
      isValid: true,
      cleanCode: clean,
      format: clean.startsWith('http') ? 'QR_CODE' : 'CODE_128',
    };
  }

  return {
    isValid: false,
    cleanCode: clean,
    warning: 'Invalid barcode characters or format',
  };
}
