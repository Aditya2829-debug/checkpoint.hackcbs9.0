import { AdditivesResult } from './rating.types';

// Matches E-numbers: E100 through E1525 with optional letter suffixes like a, b, i, ii, etc.
const E_NUMBER_REGEX = /\bE[-\s]?([1-9]\d{2,3}[a-z]*(?:\([a-z0-9]+\))?)/gi;

// Matches INS codes: INS 100 through INS 1525, e.g., INS 330, INS 500(ii), INS-503(ii)
const INS_NUMBER_REGEX =
  /\bINS[-\s]?([1-9]\d{2,3}[a-z]*(?:\s*\([a-z0-9]+\))?)/gi;

// Matches common functional classes followed directly by INS-style numbers e.g. "Raising Agents 500(ii)" or "ACIDITY REGULATOR (338)"
const FUNCTIONAL_CLASS_CODE_REGEX =
  /\b(?:Raising Agent[s]?|Emulsifier[s]?|Stabiliser[s]?|Stabilizer[s]?|Acidity Regulator[s]?|Preservative[s]?|Antioxidant[s]?|Colour[s]?|Color[s]?|Flavo[u]?r Enhancer[s]?|Thickener[s]?|Humectant[s]?|Sweetener[s]?|Anti-caking Agent[s]?)\s*\(?\s*([1-9]\d{2,3}[a-z]*(?:\s*\([a-z0-9]+\))?)\)?/gi;

// Matches bracketed additive groups e.g. "Raising Agents [503(ii), 500(ii)]" or "[322, 471, 472e]"
const BRACKETED_ADDITIVES_REGEX =
  /(?:(?:Raising Agent[s]?|Emulsifier[s]?|Stabiliser[s]?|Stabilizer[s]?|Acidity Regulator[s]?|Preservative[s]?|Antioxidant[s]?|Colour[s]?|Color[s]?|Flavo[u]?r Enhancer[s]?|Thickener[s]?|Humectant[s]?|Sweetener[s]?|Anti-caking Agent[s]?)\s*)?\[\s*([0-9a-z,\s\(\)]+)\s*\]/gi;

export function detectAdditives(ingredients: string[]): AdditivesResult {
  const codeSet = new Set<string>();

  for (const item of ingredients) {
    if (!item || typeof item !== 'string') continue;

    // Check INS patterns
    const insMatches = item.matchAll(INS_NUMBER_REGEX);
    for (const m of insMatches) {
      const codeNumber = m[1].replace(/\s+/g, '');
      const num = parseInt(codeNumber, 10);
      if (num >= 100 && num <= 1525) {
        codeSet.add(`INS ${codeNumber}`);
      }
    }

    // Check Functional class + code number patterns e.g. "Raising Agents 500(ii)"
    const funcMatches = item.matchAll(FUNCTIONAL_CLASS_CODE_REGEX);
    for (const m of funcMatches) {
      const codeNumber = m[1].replace(/\s+/g, '');
      const num = parseInt(codeNumber, 10);
      if (num >= 100 && num <= 1525) {
        codeSet.add(`INS ${codeNumber}`);
      }
    }

    // Check bracketed groups e.g. "Raising Agents [503(ii), 500(ii)]" or "[322, 471, 472e]"
    const bracketMatches = item.matchAll(BRACKETED_ADDITIVES_REGEX);
    for (const bm of bracketMatches) {
      const groupContent = bm[1];
      const tokens = groupContent.split(/[,;/]+/);
      for (const token of tokens) {
        const cleanToken = token.trim().replace(/^INS[-\s]?/i, '').replace(/^E[-\s]?/i, '');
        const match = cleanToken.match(/^([1-9]\d{2,3}[a-z]*(?:\s*\([a-z0-9]+\))?)/i);
        if (match) {
          const codeNumber = match[1].replace(/\s+/g, '');
          const num = parseInt(codeNumber, 10);
          if (num >= 100 && num <= 1525) {
            codeSet.add(`INS ${codeNumber}`);
          }
        }
      }
    }

    // Check E patterns
    const eMatches = item.matchAll(E_NUMBER_REGEX);
    for (const m of eMatches) {
      const codeNumber = m[1].replace(/\s+/g, '');
      const num = parseInt(codeNumber, 10);
      if (num >= 100 && num <= 1525) {
        codeSet.add(`E${codeNumber}`);
      }
    }
  }

  const codes = Array.from(codeSet);
  return {
    count: codes.length,
    codes,
  };
}
