import React from 'react';

export type IllustrationType =
  | 'pad'
  | 'cosmetic'
  | 'biscuit'
  | 'snack'
  | 'beverage'
  | 'water'
  | 'noodle'
  | 'chocolate'
  | 'food';

export function getIllustrationType(product?: {
  name?: string;
  category?: string;
  categoryLabel?: string;
}): IllustrationType {
  if (!product) return 'food';
  const name = (product.name || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();
  const label = (product.categoryLabel || '').toLowerCase();

  // 1. Sanitary Pads / Women's Hygiene
  if (
    cat === 'women-hygiene' ||
    cat === 'period' ||
    /pad|sanitary|napkin|whisper|stayfree|sofy|carmesi|plush|nua|absorbent/i.test(name) ||
    /hygiene|pad|menstrual/i.test(label)
  ) {
    return 'pad';
  }

  // 2. Cosmetics & Personal Care
  if (
    cat === 'personal-care' ||
    /cosmetic|lotion|cream|serum|shampoo|soap|moisturizer|sunscreen|facewash|skincare|lipstick|perfume/i.test(name) ||
    /cosmetic|personal care|skincare|beauty/i.test(label)
  ) {
    return 'cosmetic';
  }

  // 3. Water
  if (/water|bisleri|kinley|aquafina|himalayan|mineral water/i.test(name) || /water/i.test(label)) {
    return 'water';
  }

  // 4. Soft Drinks & Juices
  if (
    /pepsi|coke|coca|sprite|thums up|dew|7up|frooti|maaza|juice|beverage|aamras|drink|soda|coconut water/i.test(name) ||
    /beverage|juice|soft drink|cold drink/i.test(label)
  ) {
    return 'beverage';
  }

  // 5. Noodles & Instant Food
  if (/noodle|ramen|maggi|yippee|pasta|macaroni/i.test(name) || /noodle|instant food/i.test(label)) {
    return 'noodle';
  }

  // 6. Chocolates & Confectionery
  if (/choc|cadbury|silk|kitkat|amul dark|ferrero|5 star|bourbon/i.test(name) || /chocolate|confectionery/i.test(label)) {
    return 'chocolate';
  }

  // 7. Biscuits & Cookies
  if (
    /biscuit|cookie|cracker|parle-g|good day|marie|monaco|krackjack|oreo|hide & seek|nutrichoice|dark fantasy/i.test(name) ||
    /biscuit|cookie|bakery/i.test(label)
  ) {
    return 'biscuit';
  }

  // 8. Savory Snacks & Chips
  if (
    /kurkure|lays|lay's|chips|crisps|bhujia|sev|namkeen|makhana|angles|aloo bhujia/i.test(name) ||
    /snack|chips|namkeen/i.test(label)
  ) {
    return 'snack';
  }

  return 'food';
}

interface ProductIllustrationProps {
  product?: {
    name?: string;
    category?: string;
    categoryLabel?: string;
    imageUrl?: string;
  };
  type?: IllustrationType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ProductIllustration: React.FC<ProductIllustrationProps> = ({
  product,
  type,
  size = 'md',
  className = '',
}) => {
  // If the product has a live user photo captured from camera/gallery (data:image or blob:), display it!
  const hasUserLivePhoto =
    product?.imageUrl &&
    (product.imageUrl.startsWith('data:image/') || product.imageUrl.startsWith('blob:'));

  if (hasUserLivePhoto) {
    return (
      <img
        src={product.imageUrl}
        alt={product?.name || 'Product'}
        className={`object-cover rounded-2xl border border-black/10 dark:border-white/10 shrink-0 ${
          size === 'xs'
            ? 'w-10 h-10'
            : size === 'sm'
            ? 'w-14 h-14'
            : size === 'lg'
            ? 'w-24 h-24'
            : size === 'xl'
            ? 'w-28 h-28'
            : 'w-18 h-18 sm:w-20 sm:h-20'
        } ${className}`}
      />
    );
  }

  const illustrationType = type || getIllustrationType(product);

  const sizeClasses = {
    xs: 'w-10 h-10',
    sm: 'w-14 h-14',
    md: 'w-18 h-18 sm:w-20 sm:h-20',
    lg: 'w-24 h-24',
    xl: 'w-28 h-28',
  }[size];

  // Render Category Specific SVG Illustration
  switch (illustrationType) {
    // ── 1. SANITARY PAD / WOMEN'S HYGIENE ILLUSTRATION ─────────────────────────
    case 'pad':
      return (
        <div
          className={`${sizeClasses} rounded-2xl bg-gradient-to-br from-[#F5EEFF] via-[#EDE0FC] to-[#DFCCFA] dark:from-[#2A1838] dark:via-[#20102E] dark:to-[#160B20] border-2 border-[#D8B4FE] dark:border-[#7E22CE] p-1.5 flex flex-col items-center justify-between shadow-sm shrink-0 select-none ${className}`}
          title="Sanitary Pad Illustration"
        >
          <div className="w-full flex-1 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[82%] drop-shadow-sm">
              <defs>
                <linearGradient id="padBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#FAF5FF" />
                  <stop offset="100%" stopColor="#F3E8FF" />
                </linearGradient>
                <linearGradient id="padWingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E9D5FF" />
                  <stop offset="100%" stopColor="#D8B4FE" />
                </linearGradient>
              </defs>

              {/* Wings (Left & Right) */}
              <path
                d="M 32 40 C 14 36, 12 64, 32 60 Z"
                fill="url(#padWingGrad)"
                stroke="#C084FC"
                strokeWidth="1.5"
                opacity="0.9"
              />
              <path
                d="M 68 40 C 86 36, 88 64, 68 60 Z"
                fill="url(#padWingGrad)"
                stroke="#C084FC"
                strokeWidth="1.5"
                opacity="0.9"
              />

              {/* Pad Outer Body (Hourglass contour) */}
              <path
                d="M 50 10 C 66 10, 72 26, 65 42 C 60 50, 60 50, 65 58 C 72 74, 66 90, 50 90 C 34 90, 28 74, 35 58 C 40 50, 40 50, 35 42 C 28 26, 34 10, 50 10 Z"
                fill="url(#padBodyGrad)"
                stroke="#A855F7"
                strokeWidth="2.5"
              />

              {/* Embossed Absorbent Core Line */}
              <path
                d="M 50 20 C 58 20, 60 32, 56 44 C 54 48, 54 52, 56 56 C 60 68, 58 80, 50 80 C 42 80, 40 68, 44 56 C 46 52, 46 48, 44 44 C 40 32, 42 20, 50 20 Z"
                fill="none"
                stroke="#C084FC"
                strokeWidth="1.5"
                strokeDasharray="2.5 1.5"
              />

              {/* Center Channel Flow Curves */}
              <path d="M 50 30 Q 53 50 50 70" fill="none" stroke="#D8B4FE" strokeWidth="1.5" />
              <path d="M 46 36 Q 44 50 46 64" fill="none" stroke="#E9D5FF" strokeWidth="1" />
              <path d="M 54 36 Q 56 50 54 64" fill="none" stroke="#E9D5FF" strokeWidth="1" />

              {/* Small Cotton Flower Blossom Icon at top */}
              <circle cx="50" cy="24" r="3" fill="#A855F7" opacity="0.8" />
              <circle cx="47" cy="22" r="2" fill="#C084FC" opacity="0.7" />
              <circle cx="53" cy="22" r="2" fill="#C084FC" opacity="0.7" />
            </svg>
          </div>
          <span className="text-[9px] font-black tracking-widest text-[#7E22CE] dark:text-[#D8B4FE] uppercase">
            PAD
          </span>
        </div>
      );

    // ── 2. COSMETICS & PERSONAL CARE ILLUSTRATION ────────────────────────────────
    case 'cosmetic':
      return (
        <div
          className={`${sizeClasses} rounded-2xl bg-gradient-to-br from-[#E6FFFA] via-[#CCFBF1] to-[#99F6E4] dark:from-[#0E2F2B] dark:via-[#09221F] dark:to-[#051715] border-2 border-[#5EEAD4] dark:border-[#0D9488] p-1.5 flex flex-col items-center justify-between shadow-sm shrink-0 select-none ${className}`}
          title="Cosmetic Illustration"
        >
          <div className="w-full flex-1 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[82%] drop-shadow-sm">
              <defs>
                <linearGradient id="cosmeticBottleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#CCFBF1" />
                </linearGradient>
                <linearGradient id="creamJarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#5EEAD4" />
                  <stop offset="100%" stopColor="#2DD4BF" />
                </linearGradient>
              </defs>

              {/* Lotion Pump Bottle */}
              <rect x="25" y="34" width="28" height="52" rx="7" fill="url(#cosmeticBottleGrad)" stroke="#0D9488" strokeWidth="2.5" />
              {/* Bottle Neck & Pump */}
              <rect x="34" y="24" width="10" height="10" fill="#2DD4BF" stroke="#0D9488" strokeWidth="2" />
              <path d="M 39 24 L 39 15 L 26 15 C 24 15, 23 17, 25 19 L 29 20" fill="none" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Bottle Label with Leaf */}
              <rect x="29" y="46" width="20" height="26" rx="3" fill="#FFFFFF" stroke="#5EEAD4" strokeWidth="1" />
              <circle cx="39" cy="57" r="4" fill="#0D9488" opacity="0.3" />
              <line x1="33" y1="65" x2="45" y2="65" stroke="#0D9488" strokeWidth="1" strokeLinecap="round" />

              {/* Cosmetic Cream Jar (Next to bottle) */}
              <rect x="56" y="52" width="30" height="34" rx="6" fill="#FFFFFF" stroke="#0D9488" strokeWidth="2" />
              {/* Jar Cap */}
              <rect x="54" y="44" width="34" height="10" rx="3" fill="url(#creamJarGrad)" stroke="#0D9488" strokeWidth="2" />
              {/* Jar Label */}
              <line x1="62" y1="66" x2="80" y2="66" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="64" y1="72" x2="78" y2="72" stroke="#2DD4BF" strokeWidth="1" strokeLinecap="round" />

              {/* Sparkle Star */}
              <path d="M 75 22 Q 75 28 81 28 Q 75 28 75 34 Q 75 28 69 28 Q 75 28 75 22 Z" fill="#0D9488" />
              <circle cx="20" cy="30" r="1.5" fill="#14B8A6" />
            </svg>
          </div>
          <span className="text-[9px] font-black tracking-widest text-[#0F766E] dark:text-[#5EEAD4] uppercase">
            CARE
          </span>
        </div>
      );

    // ── 3. BISCUITS & COOKIES ILLUSTRATION ───────────────────────────────────────
    case 'biscuit':
      return (
        <div
          className={`${sizeClasses} rounded-2xl bg-gradient-to-br from-[#FEF3C7] via-[#FDE68A] to-[#FCD34D] dark:from-[#332208] dark:via-[#261904] dark:to-[#170E02] border-2 border-[#F59E0B] dark:border-[#B45309] p-1.5 flex flex-col items-center justify-between shadow-sm shrink-0 select-none ${className}`}
          title="Biscuit & Cookie Illustration"
        >
          <div className="w-full flex-1 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[82%] drop-shadow-sm">
              <defs>
                <linearGradient id="cookieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <radialGradient id="chocChipGrad" cx="30%" cy="30%">
                  <stop offset="0%" stopColor="#5C3413" />
                  <stop offset="100%" stopColor="#2E1503" />
                </radialGradient>
              </defs>

              {/* Main Golden Baked Cookie */}
              <circle cx="50" cy="50" r="38" fill="url(#cookieGrad)" stroke="#92400E" strokeWidth="3" strokeDasharray="18 1.5" />
              <circle cx="50" cy="50" r="32" fill="none" stroke="#FDE68A" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

              {/* Chocolate Chips / Perforations */}
              <circle cx="38" cy="36" r="4.5" fill="url(#chocChipGrad)" />
              <circle cx="62" cy="38" r="4" fill="url(#chocChipGrad)" />
              <circle cx="48" cy="52" r="5" fill="url(#chocChipGrad)" />
              <circle cx="34" cy="62" r="3.5" fill="url(#chocChipGrad)" />
              <circle cx="64" cy="64" r="4.5" fill="url(#chocChipGrad)" />
              <circle cx="50" cy="70" r="3" fill="url(#chocChipGrad)" />

              {/* Biscuit texture dimples */}
              <circle cx="35" cy="48" r="1.5" fill="#78350F" opacity="0.6" />
              <circle cx="62" cy="50" r="1.5" fill="#78350F" opacity="0.6" />
              <circle cx="48" cy="36" r="1.5" fill="#78350F" opacity="0.6" />
            </svg>
          </div>
          <span className="text-[9px] font-black tracking-widest text-[#92400E] dark:text-[#FCD34D] uppercase">
            COOKIE
          </span>
        </div>
      );

    // ── 4. SAVORY SNACKS & CHIPS ILLUSTRATION ────────────────────────────────────
    case 'snack':
      return (
        <div
          className={`${sizeClasses} rounded-2xl bg-gradient-to-br from-[#FFEDD5] via-[#FED7AA] to-[#FDBA74] dark:from-[#381B09] dark:via-[#2A1305] dark:to-[#170902] border-2 border-[#EA580C] dark:border-[#9A3412] p-1.5 flex flex-col items-center justify-between shadow-sm shrink-0 select-none ${className}`}
          title="Chips & Snacks Illustration"
        >
          <div className="w-full flex-1 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[82%] drop-shadow-sm">
              <defs>
                <linearGradient id="chipGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FED7AA" />
                  <stop offset="50%" stopColor="#FB923C" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>
                <linearGradient id="chipGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>

              {/* Back Chip */}
              <path
                d="M 28 35 Q 40 22 62 28 Q 74 38 68 55 Q 52 64 36 54 Q 22 46 28 35 Z"
                fill="url(#chipGrad2)"
                stroke="#C2410C"
                strokeWidth="2"
                opacity="0.85"
              />

              {/* Front Wavy Ridged Chip */}
              <path
                d="M 35 48 C 45 32, 75 35, 78 52 C 80 68, 55 82, 38 74 C 25 66, 26 58, 35 48 Z"
                fill="url(#chipGrad1)"
                stroke="#9A3412"
                strokeWidth="2.5"
              />

              {/* Ridges on Potato Chip */}
              <path d="M 40 46 Q 52 52 65 52" fill="none" stroke="#FFF7ED" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <path d="M 37 55 Q 50 62 68 62" fill="none" stroke="#FFF7ED" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <path d="M 38 65 Q 48 70 60 70" fill="none" stroke="#FFF7ED" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

              {/* Seasoning / Spice dots */}
              <circle cx="48" cy="48" r="1.5" fill="#7C2D12" />
              <circle cx="56" cy="58" r="1.5" fill="#7C2D12" />
              <circle cx="44" cy="62" r="1.5" fill="#7C2D12" />
              <circle cx="62" cy="68" r="1.5" fill="#7C2D12" />
            </svg>
          </div>
          <span className="text-[9px] font-black tracking-widest text-[#C2410C] dark:text-[#FED7AA] uppercase">
            CHIPS
          </span>
        </div>
      );

    // ── 5. BEVERAGES & DRINKS ILLUSTRATION ──────────────────────────────────────
    case 'beverage':
      return (
        <div
          className={`${sizeClasses} rounded-2xl bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#7DD3FC] dark:from-[#08283B] dark:via-[#051E2E] dark:to-[#03131D] border-2 border-[#0284C7] dark:border-[#0369A1] p-1.5 flex flex-col items-center justify-between shadow-sm shrink-0 select-none ${className}`}
          title="Beverage & Drink Illustration"
        >
          <div className="w-full flex-1 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[82%] drop-shadow-sm">
              <defs>
                <linearGradient id="canBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284C7" />
                  <stop offset="35%" stopColor="#38BDF8" />
                  <stop offset="70%" stopColor="#0EA5E9" />
                  <stop offset="100%" stopColor="#0369A1" />
                </linearGradient>
              </defs>

              {/* Slanted Soda Can */}
              <rect x="32" y="24" width="36" height="62" rx="7" fill="url(#canBodyGrad)" stroke="#075985" strokeWidth="2.5" />
              {/* Can Top Rim */}
              <ellipse cx="50" cy="24" rx="18" ry="4.5" fill="#E2E8F0" stroke="#075985" strokeWidth="2" />
              <ellipse cx="50" cy="85" rx="16" ry="3" fill="#0369A1" opacity="0.4" />

              {/* Graphic Wave on Can */}
              <path d="M 32 46 Q 50 38 68 50 L 68 66 Q 50 54 32 62 Z" fill="#FFFFFF" opacity="0.3" />

              {/* Fizzy Bubbles Floating Up */}
              <circle cx="68" cy="20" r="3.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
              <circle cx="76" cy="14" r="2.5" fill="#7DD3FC" />
              <circle cx="28" cy="18" r="2" fill="#38BDF8" />

              {/* Droplets on Can */}
              <circle cx="40" cy="38" r="1.5" fill="#FFFFFF" opacity="0.8" />
              <circle cx="58" cy="68" r="1.5" fill="#FFFFFF" opacity="0.8" />
            </svg>
          </div>
          <span className="text-[9px] font-black tracking-widest text-[#0369A1] dark:text-[#7DD3FC] uppercase">
            DRINK
          </span>
        </div>
      );

    // ── 6. MINERAL / PACKAGED WATER ILLUSTRATION ────────────────────────────────
    case 'water':
      return (
        <div
          className={`${sizeClasses} rounded-2xl bg-gradient-to-br from-[#E0F7FA] via-[#B2EBF2] to-[#80DEEA] dark:from-[#06292E] dark:via-[#041F23] dark:to-[#021316] border-2 border-[#00ACC1] dark:border-[#00838F] p-1.5 flex flex-col items-center justify-between shadow-sm shrink-0 select-none ${className}`}
          title="Packaged Water Illustration"
        >
          <div className="w-full flex-1 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[82%] drop-shadow-sm">
              <defs>
                <linearGradient id="waterBottleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E0F7FA" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#B2EBF2" />
                </linearGradient>
              </defs>

              {/* Water Bottle Body */}
              <rect x="36" y="32" width="28" height="54" rx="6" fill="url(#waterBottleGrad)" stroke="#00838F" strokeWidth="2.5" />
              {/* Bottle Neck & Cap */}
              <rect x="42" y="20" width="16" height="12" fill="#E0F7FA" stroke="#00838F" strokeWidth="2" />
              <rect x="40" y="14" width="20" height="7" rx="2" fill="#00ACC1" stroke="#00838F" strokeWidth="1.5" />

              {/* Ribbed Ergonomic Grips */}
              <line x1="36" y1="42" x2="64" y2="42" stroke="#80DEEA" strokeWidth="1.5" />
              <line x1="36" y1="52" x2="64" y2="52" stroke="#80DEEA" strokeWidth="1.5" />
              <line x1="36" y1="74" x2="64" y2="74" stroke="#80DEEA" strokeWidth="1.5" />

              {/* Water Wave Inside */}
              <path d="M 37 62 Q 50 56 63 62 L 63 85 L 37 85 Z" fill="#26C6DA" opacity="0.35" />

              {/* Water Droplet */}
              <path d="M 50 60 C 47 64, 47 68, 50 68 C 53 68, 53 64, 50 60 Z" fill="#00ACC1" />
            </svg>
          </div>
          <span className="text-[9px] font-black tracking-widest text-[#00838F] dark:text-[#80DEEA] uppercase">
            WATER
          </span>
        </div>
      );

    // ── 7. NOODLES & INSTANT FOOD ILLUSTRATION ──────────────────────────────────
    case 'noodle':
      return (
        <div
          className={`${sizeClasses} rounded-2xl bg-gradient-to-br from-[#FEF2F2] via-[#FEE2E2] to-[#FECACA] dark:from-[#3B1414] dark:via-[#290C0C] dark:to-[#170505] border-2 border-[#EF4444] dark:border-[#B91C1C] p-1.5 flex flex-col items-center justify-between shadow-sm shrink-0 select-none ${className}`}
          title="Noodles Illustration"
        >
          <div className="w-full flex-1 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[82%] drop-shadow-sm">
              {/* Steaming Noodle Bowl */}
              <path d="M 22 52 C 22 78, 78 78, 78 52 Z" fill="#FEE2E2" stroke="#B91C1C" strokeWidth="3" />
              <ellipse cx="50" cy="52" rx="28" ry="8" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />

              {/* Curly Golden Noodles */}
              <path d="M 30 50 Q 36 38 42 50 Q 48 38 54 50 Q 60 38 66 50" fill="none" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
              <path d="M 36 53 Q 42 43 48 53 Q 54 43 60 53 Q 66 43 70 53" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

              {/* Lifted Noodles via Chopsticks */}
              <line x1="28" y1="20" x2="72" y2="34" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="26" y1="26" x2="70" y2="40" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
              <path d="M 48 34 Q 44 42 48 50" fill="none" stroke="#FBBF24" strokeWidth="2" />

              {/* Steam waves */}
              <path d="M 44 26 Q 42 18 45 12" fill="none" stroke="#FCA5A5" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 52 24 Q 50 16 53 10" fill="none" stroke="#FCA5A5" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[9px] font-black tracking-widest text-[#B91C1C] dark:text-[#FCA5A5] uppercase">
            NOODLE
          </span>
        </div>
      );

    // ── 8. CHOCOLATES & CONFECTIONERY ILLUSTRATION ───────────────────────────────
    case 'chocolate':
      return (
        <div
          className={`${sizeClasses} rounded-2xl bg-gradient-to-br from-[#F5EBE6] via-[#E8D7CE] to-[#D7C2B6] dark:from-[#291710] dark:via-[#1E0F0A] dark:to-[#120704] border-2 border-[#78350F] dark:border-[#92400E] p-1.5 flex flex-col items-center justify-between shadow-sm shrink-0 select-none ${className}`}
          title="Chocolate Illustration"
        >
          <div className="w-full flex-1 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[82%] drop-shadow-sm">
              <defs>
                <linearGradient id="chocBlockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#693B1F" />
                  <stop offset="50%" stopColor="#4A2611" />
                  <stop offset="100%" stopColor="#2E1503" />
                </linearGradient>
              </defs>

              {/* Chocolate Bar Body */}
              <rect x="25" y="22" width="50" height="60" rx="5" fill="url(#chocBlockGrad)" stroke="#260F02" strokeWidth="2.5" />

              {/* Chocolate Segments / Blocks */}
              <rect x="29" y="26" width="19" height="15" rx="2" fill="#783F20" stroke="#3D1D09" strokeWidth="1" />
              <rect x="52" y="26" width="19" height="15" rx="2" fill="#783F20" stroke="#3D1D09" strokeWidth="1" />
              <rect x="29" y="44" width="19" height="15" rx="2" fill="#783F20" stroke="#3D1D09" strokeWidth="1" />
              <rect x="52" y="44" width="19" height="15" rx="2" fill="#783F20" stroke="#3D1D09" strokeWidth="1" />
              <rect x="29" y="62" width="19" height="15" rx="2" fill="#783F20" stroke="#3D1D09" strokeWidth="1" />
              <rect x="52" y="62" width="19" height="15" rx="2" fill="#783F20" stroke="#3D1D09" strokeWidth="1" />

              {/* Highlights on segments */}
              <line x1="31" y1="28" x2="46" y2="28" stroke="#9A552C" strokeWidth="1" strokeLinecap="round" />
              <line x1="54" y1="28" x2="69" y2="28" stroke="#9A552C" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[9px] font-black tracking-widest text-[#451A03] dark:text-[#D7C2B6] uppercase">
            CHOCO
          </span>
        </div>
      );

    // ── 9. GENERAL FOOD ILLUSTRATION ───────────────────────────────────────────
    default:
      return (
        <div
          className={`${sizeClasses} rounded-2xl bg-gradient-to-br from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0] dark:from-[#06281B] dark:via-[#041D13] dark:to-[#02120C] border-2 border-[#10B981] dark:border-[#059669] p-1.5 flex flex-col items-center justify-between shadow-sm shrink-0 select-none ${className}`}
          title="Food Illustration"
        >
          <div className="w-full flex-1 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[82%] drop-shadow-sm">
              <defs>
                <linearGradient id="appleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              {/* Fresh Wholesome Apple / Produce */}
              <path
                d="M 50 32 C 40 20, 24 28, 25 48 C 26 68, 44 82, 50 82 C 56 82, 74 68, 75 48 C 76 28, 60 20, 50 32 Z"
                fill="url(#appleGrad)"
                stroke="#047857"
                strokeWidth="2.5"
              />

              {/* Stem and Green Leaf */}
              <path d="M 50 32 Q 53 22 56 16" fill="none" stroke="#065F46" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 53 24 Q 65 18 64 26 Q 58 30 53 24 Z" fill="#6EE7B7" stroke="#047857" strokeWidth="1.5" />

              {/* Highlight curve */}
              <path d="M 34 40 Q 32 50 36 60" fill="none" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            </svg>
          </div>
          <span className="text-[9px] font-black tracking-widest text-[#065F46] dark:text-[#A7F3D0] uppercase">
            FOOD
          </span>
        </div>
      );
  }
};
