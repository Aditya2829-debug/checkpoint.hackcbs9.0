import React from 'react';
import {
  ScanBarcode,
  Camera,
  ChevronRight,
  Apple,
  Shield,
  Sparkle,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScanStore } from '../../store/useScanStore';
import { useProductStore } from '../../store/useProductStore';
import { useLanguageStore } from '../../store/useLanguageStore';

export const HomeScreen: React.FC = () => {
  const { openScanner } = useScanStore();
  const { products, setCurrentProduct } = useProductStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  const handleProductClick = (product: (typeof products)[0]) => {
    setCurrentProduct(product);
    if (product.category === 'women-hygiene') {
      navigate(`/women-hygiene/${product.id}`);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in text-[#111F15] dark:text-[#E4F5E5] max-w-6xl mx-auto">
      {/* Badges Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5F82A] text-[#111F15] border-2 border-[#111F15] dark:border-[#C5F82A] text-[11px] font-extrabold uppercase tracking-wide shadow-[1px_1px_0px_#111F15]">
          <span>⚡</span> {t('labBadge')}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#111F15]/20 dark:border-white/20 bg-white/60 dark:bg-white/5 text-[11px] font-bold text-[#69766D] dark:text-[#9BAA9E]">
          <span className="w-2 h-2 rounded-full bg-[#C5F82A] animate-pulse" />
          {t('liveBadge')}
        </span>
      </div>

      {/* Hero Headline */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Plus_Jakarta_Sans'] leading-[1.1] tracking-tight">
          {t('heroHeadline1')} <br className="hidden sm:inline" />
          <span className="inline-block mt-1 sm:mt-0 sm:ml-2 px-3 py-1 rounded-2xl bg-[#C5F82A] text-[#111F15] border-2 border-[#111F15] dark:border-[#C5F82A] shadow-[3px_3px_0px_#111F15] dark:shadow-none">
            {t('heroHeadline2')}
          </span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[#404940] dark:text-[#9BAA9E] leading-relaxed max-w-3xl">
          {t('heroSubtitle')}
        </p>
      </div>

      {/* Ticker Bar */}
      <div className="bg-[#005128] text-[#C5F82A] rounded-2xl px-4 py-3 text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center justify-between overflow-x-auto whitespace-nowrap shadow-sm border-2 border-[#111F15] dark:border-[#2D3E33]">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {t('foodAndSnacks')}
        </span>
        <span className="text-white/40 mx-2">•</span>
        <span>{t('cosmetics')}</span>
        <span className="text-white/40 mx-2">•</span>
        <span>{t('hygiene')}</span>
        <span className="text-white/40 mx-2">•</span>
        <span>{t('additives')}</span>
      </div>

      {/* Section: Instant Verification Engine (Responsive 2-column on desktop) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black font-['Plus_Jakarta_Sans'] tracking-tight">
            {t('verificationEngine')}
          </h2>
          <span className="px-2.5 py-1 rounded-lg bg-[#EDF6EA] dark:bg-[#1A2A1F] text-xs font-extrabold border border-[#111F15]/20 dark:border-white/10 uppercase">
            {t('twoModes')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Card 1: Scan Barcode */}
          <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] dark:border-[#2D3E33] shadow-[3px_3px_0px_#111F15] dark:shadow-none hover:translate-y-[-2px] transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#C5F82A] text-[#111F15] border-2 border-[#111F15] flex items-center justify-center font-bold shadow-[2px_2px_0px_#111F15]">
                  <ScanBarcode className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-[#C5F82A]/20 dark:bg-[#C5F82A]/10 text-[#005128] dark:text-[#C5F82A] border border-[#111F15]/20 dark:border-[#C5F82A]/30">
                  {t('instant')}
                </span>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-black font-['Plus_Jakarta_Sans']">
                  {t('scanBarcode')}
                </h3>
                <p className="text-xs sm:text-sm text-[#404940] dark:text-[#9BAA9E] mt-1 leading-normal">
                  {t('scanBarcodeDesc')}
                </p>
                <p className="text-xs font-semibold text-[#69766D] dark:text-[#9BAA9E] mt-2 flex items-center gap-1.5 font-mono">
                  <span>🖹</span> {t('instantLookup')}
                </p>
              </div>
            </div>

            <button
              onClick={() => openScanner('barcode')}
              className="w-full py-3 rounded-2xl bg-[#C5F82A] text-[#111F15] font-['Plus_Jakarta_Sans'] font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] hover:bg-[#d4ff4f] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('scanBarcode')}</span>
              <span>⚡</span>
            </button>
          </div>

          {/* Card 2: Scan Label */}
          <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] dark:border-[#2D3E33] shadow-[3px_3px_0px_#111F15] dark:shadow-none hover:translate-y-[-2px] transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#5EEAD4] text-[#111F15] border-2 border-[#111F15] flex items-center justify-center font-bold shadow-[2px_2px_0px_#111F15]">
                  <Camera className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-[#5EEAD4]/30 text-[#005128] dark:text-[#5EEAD4] border border-[#111F15]/20 dark:border-[#5EEAD4]/30">
                  {t('aiOcr')}
                </span>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-black font-['Plus_Jakarta_Sans']">
                  {t('scanLabel')}
                </h3>
                <p className="text-xs sm:text-sm text-[#404940] dark:text-[#9BAA9E] mt-1 leading-normal">
                  {t('scanLabelDesc')}
                </p>
                <p className="text-xs font-semibold text-[#69766D] dark:text-[#9BAA9E] mt-2 flex items-center gap-1.5 font-mono">
                  <span>◎</span> {t('aiOcrVision')}
                </p>
              </div>
            </div>

            <button
              onClick={() => openScanner('ocr')}
              className="w-full py-3 rounded-2xl bg-[#5EEAD4] text-[#111F15] font-['Plus_Jakarta_Sans'] font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] hover:bg-[#48d8c2] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('scanLabel')}</span>
              <span>📷</span>
            </button>
          </div>
        </div>
      </section>

      {/* Browse Benchmark Sectors */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black font-['Plus_Jakarta_Sans'] tracking-tight">
            {t('benchmarkSectors')}
          </h2>
          <span className="text-xs font-bold text-[#005128] dark:text-[#C5F82A] flex items-center gap-1 cursor-pointer hover:underline">
            {t('viewAll')} <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {/* Sector 1: Food & Drinks */}
          <div
            onClick={() => handleProductClick(products[0])}
            className="p-4 rounded-2xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] dark:border-[#2D3E33] shadow-[2px_2px_0px_#111F15] dark:shadow-none flex flex-col justify-between cursor-pointer hover:bg-[#F7FAF6] dark:hover:bg-[#223628] transition-all"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#C5F82A] border-2 border-[#111F15] flex items-center justify-center text-[#111F15] mb-2.5 shadow-[1px_1px_0px_#111F15]">
                <Apple className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black font-['Plus_Jakarta_Sans'] leading-tight">
                {t('foodAndDrinks')}
              </h4>
              <p className="text-xs text-[#69766D] dark:text-[#9BAA9E] mt-0.5">
                8,420 items
              </p>
            </div>
            <span className="mt-4 px-2 py-1 rounded-md text-[10px] font-extrabold bg-[#C5F82A] text-[#111F15] border border-[#111F15] text-center uppercase tracking-wide">
              FSSAI SAFE
            </span>
          </div>

          {/* Sector 2: Women's Hygiene */}
          <div
            onClick={() => {
              const hygiene = products.find((p) => p.category === 'women-hygiene');
              if (hygiene) handleProductClick(hygiene);
            }}
            className="p-4 rounded-2xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] dark:border-[#2D3E33] shadow-[2px_2px_0px_#111F15] dark:shadow-none flex flex-col justify-between cursor-pointer hover:bg-[#EEE7FA] dark:hover:bg-[#2b1e3b] transition-all"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EEE7FA] border-2 border-[#111F15] flex items-center justify-center text-[#7050A8] mb-2.5 shadow-[1px_1px_0px_#111F15]">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black font-['Plus_Jakarta_Sans'] leading-tight">
                {t('womensHygiene')}
              </h4>
              <p className="text-xs text-[#69766D] dark:text-[#9BAA9E] mt-0.5">
                1,940 items
              </p>
            </div>
            <span className="mt-4 px-2 py-1 rounded-md text-[10px] font-extrabold bg-[#EEE7FA] text-[#7050A8] border border-[#7050A8] text-center uppercase tracking-wide">
              BIS IS:5405
            </span>
          </div>

          {/* Sector 3: Personal Care */}
          <div
            onClick={() => handleProductClick(products[1] || products[0])}
            className="p-4 rounded-2xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] dark:border-[#2D3E33] shadow-[2px_2px_0px_#111F15] dark:shadow-none flex flex-col justify-between cursor-pointer hover:bg-[#F7FAF6] dark:hover:bg-[#223628] transition-all"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#5EEAD4] border-2 border-[#111F15] flex items-center justify-center text-[#111F15] mb-2.5 shadow-[1px_1px_0px_#111F15]">
                <Sparkle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black font-['Plus_Jakarta_Sans'] leading-tight">
                {t('personalCare')}
              </h4>
              <p className="text-xs text-[#69766D] dark:text-[#9BAA9E] mt-0.5">
                3,890 items
              </p>
            </div>
            <span className="mt-4 px-2 py-1 rounded-md text-[10px] font-extrabold bg-[#5EEAD4] text-[#111F15] border border-[#111F15] text-center uppercase tracking-wide">
              TOXIN-FREE
            </span>
          </div>
        </div>
      </section>

      {/* Recent Community Scans (Responsive 2-column on desktop) */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base sm:text-lg font-black font-['Plus_Jakarta_Sans'] tracking-tight">
            {t('communityScans')}
          </h2>
          <p className="text-xs text-[#69766D] dark:text-[#9BAA9E]">
            {t('communityScansDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] dark:border-[#2D3E33] shadow-[2px_2px_0px_#111F15] dark:shadow-none cursor-pointer hover:bg-[#F7FAF6] dark:hover:bg-[#223628] hover:translate-y-[-1px] transition-all relative overflow-hidden"
            >
              {/* Top Grade Pill */}
              <div className="absolute top-3.5 right-3.5 z-10">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black border-2 border-[#111F15] shadow-[1px_1px_0px_#111F15] ${
                    product.grade === 'A'
                      ? 'bg-[#005128] text-[#C5F82A]'
                      : product.grade === 'B'
                      ? 'bg-[#C5F82A] text-[#111F15]'
                      : 'bg-[#D96E61] text-white'
                  }`}
                >
                  GRADE {product.grade} ★
                </span>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-18 h-18 rounded-2xl bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/20 overflow-hidden shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 pr-20">
                  <span className="text-[10px] font-mono font-bold text-[#69766D] dark:text-[#9BAA9E] uppercase block">
                    • {product.brand}
                  </span>
                  <h4 className="text-sm font-black font-['Plus_Jakarta_Sans'] truncate mt-0.5">
                    {product.name}
                  </h4>
                  <p className="text-xs text-[#404940] dark:text-[#9BAA9E] line-clamp-2 mt-1 leading-normal">
                    {product.summary}
                  </p>
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-[#111F15]/10 dark:border-[#2D3E33] flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EDF6EA] dark:bg-[#15271B] text-[#005128] dark:text-[#AAF470] font-bold border border-[#111F15]/15 flex items-center gap-1">
                  ✓ {product.gradeScore}/100 Clean
                </span>
                <span className="text-[#69766D] dark:text-[#9BAA9E] font-mono text-[11px]">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Crowdsource Callout Box (Full-width banner with responsive flex on desktop) */}
      <div className="p-5 md:p-6 rounded-3xl bg-[#0F2E1B] dark:bg-[#132A1C] text-white border-2 border-[#111F15] dark:border-[#2D3E33] shadow-[3px_3px_0px_#111F15] dark:shadow-none flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#C5F82A] text-[#111F15] border border-[#111F15] flex items-center justify-center font-bold text-sm">
              🔬
            </div>
            <span className="text-[10px] font-mono font-bold text-[#C5F82A] tracking-wider uppercase">
              {t('crowdsourcedAccountability')}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black font-['Plus_Jakarta_Sans']">
            {t('unlistedTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            {t('unlistedDesc')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            onClick={() => openScanner('ocr')}
            className="px-5 py-2.5 rounded-xl bg-[#C5F82A] text-[#111F15] font-['Plus_Jakarta_Sans'] font-black text-xs sm:text-sm border border-[#111F15] shadow-[2px_2px_0px_#111F15] hover:bg-[#d8ff4f] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t('submitProduct')}</span>
            <span>↗</span>
          </button>
          <span className="text-[11px] text-white/60 font-mono text-center sm:text-left">
            {t('freeAnonymous')}
          </span>
        </div>
      </div>
    </div>
  );
};
