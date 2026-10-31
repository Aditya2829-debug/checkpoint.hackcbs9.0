import { PalmOilResult } from './rating.types';

const PALM_YES_REGEX =
  /palm\s*oil|palmolein|palm\s*olein|palm\s*kernel|palm\s*fat/i;
const VEGETABLE_OIL_REGEX = /vegetable\s*(?:fat|oil)|edible\s*vegetable/gi;

// Known non-palm specific vegetable oils
const SPECIFIC_NON_PALM_OILS = [
  'sunflower',
  'soybean',
  'soya',
  'mustard',
  'olive',
  'coconut',
  'groundnut',
  'peanut',
  'sesame',
  'rice\\s*bran',
  'corn',
  'canola',
  'cotton\\s*seed',
  'cottonseed',
  'rapeseed',
  'flaxseed',
  'safflower',
];

const SPECIFIC_OIL_FOLLOWING_REGEX = new RegExp(
  `^[\\s:(]*(?:refined\\s+)?(?:hydrogenated\\s+)?(?:${SPECIFIC_NON_PALM_OILS.join('|')})`,
  'i',
);

export function detectPalmOil(
  ingredientsText = '',
  tags?: string[],
): PalmOilResult {
  const normalizedText = ingredientsText || '';

  // 1. Check exact 'yes' tag
  if (tags && tags.some((t) => t === 'en:palm-oil')) {
    return 'yes';
  }

  // 2. Check 'yes' regex in ingredients text
  if (PALM_YES_REGEX.test(normalizedText)) {
    return 'yes';
  }

  // 3. Check exact 'possible' tag
  if (tags && tags.some((t) => t === 'en:may-contain-palm-oil')) {
    return 'possible';
  }

  // 4. Check 'possible' regex: generic vegetable fat/oil without a specific named non-palm oil
  const matches = Array.from(normalizedText.matchAll(VEGETABLE_OIL_REGEX));
  if (matches.length > 0) {
    for (const match of matches) {
      const matchIndex = match.index ?? 0;
      const followingSlice = normalizedText.slice(
        matchIndex + match[0].length,
        matchIndex + match[0].length + 40,
      );

      // If the following text does not specify a known non-palm oil, it's possible palm oil
      if (!SPECIFIC_OIL_FOLLOWING_REGEX.test(followingSlice)) {
        return 'possible';
      }
    }
  }

  return 'no';
}
