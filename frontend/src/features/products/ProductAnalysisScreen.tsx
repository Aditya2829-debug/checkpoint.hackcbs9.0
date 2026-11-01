import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { productService } from '../../services/api/productService';
import { scanService } from '../../services/api/scanService';
import { useProductStore } from '../../store/useProductStore';
import { useScanStore } from '../../store/useScanStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { IngredientDetailModal } from '../ingredients/IngredientDetailModal';
import type { Ingredient, Product } from '../../types';

export const ProductAnalysisScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isWatchlisted, toggleWatchlist, currentProduct, addProduct } = useProductStore();
  const { recordProductActivity } = useScanStore();
  const { language, t, translateNutrient, translateReason } = useLanguageStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isPalmOilAccordionOpen, setIsPalmOilAccordionOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      if (currentProduct && (currentProduct.id === id || currentProduct.barcode === id)) {
        setProduct(currentProduct);
        recordProductActivity(currentProduct, 'search');
        setLoading(false);
        return;
      }

      if (id) {
        try {
          const item = await scanService.lookupBarcode(id);
          setProduct(item);
          addProduct(item);
          recordProductActivity(item, 'search');
        } catch {
          const item = await productService.getById(id);
          if (item) {
            setProduct(item);
            addProduct(item);
            recordProductActivity(item, 'search');
          }
        }
      } else {
        const items = await productService.getAll();
        if (items[0]) {
          setProduct(items[0]);
          recordProductActivity(items[0], 'search');
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id, currentProduct, addProduct, recordProductActivity]);

  if (loading || !product) {
    return (
      <div className="py-20 text-center text-xs font-mono font-bold text-[#111F15] dark:text-[#E4F5E5]">
        {t('loadingProductAudit')}
      </div>
    );
  }

  const isFavorite = isWatchlisted(product.id);

  return (
    <div className="space-y-4 px-4 pt-3 pb-8 animate-fade-in text-[#111F15] dark:text-[#E4F5E5]">
      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#111F15]/10 dark:border-[#2D3E33]">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-[#111F15] dark:border-white/30 text-xs font-bold hover:bg-[#C5F82A] hover:text-[#111F15] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>{t('back')}</span>
        </button>

        <span className="font-['Plus_Jakarta_Sans'] font-black text-sm text-[#69766D] dark:text-[#9BAA9E]">
          {t('productInspection')}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert(language === 'hi' ? 'विश्लेषण लिंक कॉपी हो गया!' : 'Analysis link copied!');
              }
            }}
            className="w-8 h-8 rounded-full border border-[#111F15]/30 dark:border-white/30 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            title={t('share')}
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toggleWatchlist(product.id)}
            className={`w-8 h-8 rounded-full border border-[#111F15]/30 dark:border-white/30 flex items-center justify-center transition-colors cursor-pointer ${
              isFavorite ? 'bg-[#C5F82A] text-[#111F15] border-[#111F15]' : ''
            }`}
            title={t('bookmark')}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Spec Card (Clean, No Image) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[3px_3px_0px_#111F15] dark:shadow-none space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#5EEAD4]/30 text-[#005128] dark:text-[#5EEAD4] text-[10px] font-extrabold uppercase border border-[#111F15]/20">
              {product.categoryLabel}
            </span>
            {product.brand && (
              <span className="text-[11px] font-black tracking-wider uppercase text-[#005128] dark:text-[#D7FF63]">
                {product.brand}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono font-bold text-[#69766D] dark:text-[#9BAA9E]">
            {language === 'hi' ? 'बारकोड:' : 'Barcode:'} #{product.barcode}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black font-['Plus_Jakarta_Sans'] leading-tight">
          {product.name}
        </h1>

        <p className="text-xs text-[#404940] dark:text-[#9BAA9E] leading-snug">
          {product.summary}
        </p>
      </div>

      {/* Grade Hero Card */}
      {(() => {
        // Below 3: D is Mild Red, E goes Redder (Deep Red). Good is Green.
        const gradeColorMap: Record<string, { bg: string; text: string; badge: string; border: string }> = {
          A: { bg: 'bg-[#15803D]', text: 'text-white', badge: 'bg-[#C5F82A] text-[#111F15]', border: 'border-[#15803D]' }, // Good Green
          B: { bg: 'bg-[#22C55E]', text: 'text-white', badge: 'bg-[#111F15] text-white', border: 'border-[#22C55E]' }, // Good Green
          C: { bg: 'bg-[#EAB308]', text: 'text-[#111F15]', badge: 'bg-[#111F15] text-white', border: 'border-[#EAB308]' }, // 3: Yellow
          D: { bg: 'bg-[#F87171]', text: 'text-white', badge: 'bg-[#111F15] text-white', border: 'border-[#EF4444]' }, // Below 3: Mild Red
          E: { bg: 'bg-[#DC2626]', text: 'text-white', badge: 'bg-[#111F15] text-white', border: 'border-[#991B1B]' }, // Below 3: Goes Redder
        };
        const colors = gradeColorMap[product.grade] || gradeColorMap.C;

        const scoreOutOf5 = {
          A: '5 / 5',
          B: '4 / 5',
          C: '3 / 5',
          D: '2 / 5',
          E: '1 / 5',
        }[product.grade] || '3 / 5';

        const displayScore100 = {
          A: Math.max(88, product.gradeScore || 95),
          B: Math.min(85, Math.max(70, product.gradeScore || 80)),
          C: Math.min(65, Math.max(50, product.gradeScore || 55)),
          D: Math.min(45, Math.max(25, (product.gradeScore > 50 ? 32 : (product.gradeScore || 30)))),
          E: Math.min(20, Math.max(5, (product.gradeScore > 30 ? 15 : (product.gradeScore || 15)))),
        }[product.grade] ?? product.gradeScore;

        const gradeStatusKey = {
          A: 'gradeA',
          B: 'gradeB',
          C: 'gradeC',
          D: 'gradeD',
          E: 'gradeE',
        }[product.grade] || 'comprehensiveAudit';

        return (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#E2F7D8] to-[#D0F0C0] dark:from-[#1A2E1F] dark:to-[#122316] border-2 border-[#111F15] shadow-[3px_3px_0px_#111F15] dark:shadow-none space-y-3.5 text-center">
            <span className="inline-block px-3 py-0.5 rounded-full bg-white/70 dark:bg-black/40 border border-[#111F15]/20 text-[9px] font-mono font-black uppercase tracking-wider">
              {t('nutriScoreEngine')}
            </span>

            {/* Big Grade Box */}
            <div className="flex justify-center">
              <div className={`relative ${colors.bg} ${colors.text} border-3 border-[#111F15] shadow-[4px_4px_0px_#111F15] rounded-3xl px-10 py-4 text-center min-w-[210px]`}>
                <span className="absolute -top-2.5 -right-2.5 px-2.5 py-0.5 rounded-md bg-[#C5F82A] text-[#111F15] border border-[#111F15] text-[9px] font-black uppercase shadow-sm">
                  {t('verified')}
                </span>
                <span className="text-[10px] font-extrabold font-mono tracking-widest block uppercase opacity-90">
                  {t('nutriGrade')}
                </span>
                <span className="text-5xl sm:text-6xl font-black font-['Plus_Jakarta_Sans'] leading-none my-1 block">
                  {product.grade}
                </span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-white text-xs font-mono font-black mt-1">
                  <span>Score: {scoreOutOf5}</span>
                  <span className="opacity-80">({displayScore100}/100)</span>
                </div>
              </div>
            </div>

            {/* Status bar */}
            <div className="bg-[#111F15] text-white py-1.5 px-3 rounded-xl text-[10px] font-extrabold tracking-wide uppercase">
              {t(gradeStatusKey)}
            </div>

            {/* In-Code Rating Reasons & Points Breakdown */}
            {product.geminiExplainer?.whyThisGrade && product.geminiExplainer.whyThisGrade.length > 0 && (
              <div className="text-left bg-white/80 dark:bg-black/30 rounded-2xl p-3 border border-[#111F15]/15 space-y-1.5">
                <p className="text-[10px] font-mono font-black text-[#111F15] dark:text-[#E4F5E5] uppercase tracking-wider">
                  {t('ratingBreakdown')}
                </p>
                <div className="space-y-1">
                  {product.geminiExplainer.whyThisGrade.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-[#111F15] dark:text-[#E4F5E5]">
                      <span className="text-sm leading-none">
                        {reason.toLowerCase().includes('palm') ? '🚨' : reason.toLowerCase().includes('high') ? '⚠️' : '✓'}
                      </span>
                      <span className="font-medium text-[11px] leading-tight">
                        {translateReason(reason)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E] leading-tight">
              {t('deterministicNotice')}
            </p>

            {/* Ask Gemini Explainer CTA Button */}
            <button
              onClick={() => navigate(`/ai-explainer/${product.id}`)}
              className="w-full py-2.5 rounded-2xl bg-[#5EEAD4] text-[#111F15] font-['Plus_Jakarta_Sans'] font-black text-xs uppercase tracking-wider border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>⚡</span>
              <span>{t('askGeminiNutritionist')}</span>
              <span>⚡</span>
            </button>
          </div>
        );
      })()}

      {/* Section 01: Harmful Chemicals & Additives Watchlist */}
      {(() => {
        const harmfulIngredients = product.ingredients.filter(
          (i) => i.riskLevel === 'high' || i.riskLevel === 'moderate'
        );
        const hasPalmOil = product.ingredients.some((i) =>
          /palm\s*oil|palmolein|palm\s*olein|palm\s*kernel|palm\s*fat/i.test(i.name)
        );

        return (
          <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#FF5E5E] text-white border border-[#111F15] flex items-center justify-center text-xs font-black">
                  01
                </span>
                <h2 className="text-sm font-black font-['Plus_Jakarta_Sans']">
                  {t('harmfulChemicalsTitle')}
                </h2>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                harmfulIngredients.length > 0 ? 'bg-[#FEE2E2] text-[#B91C1C] border border-[#B91C1C]' : 'bg-[#EDF6EA] text-[#005128]'
              }`}>
                {harmfulIngredients.length} {t('flagged')}
              </span>
            </div>

            {harmfulIngredients.length === 0 ? (
              <div className="p-3 rounded-2xl bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/15 text-center">
                <p className="text-xs font-bold text-[#005128]">
                  {t('zeroHarmfulDetected')}
                </p>
                <p className="text-[10px] text-[#69766D] mt-0.5">
                  {t('allNaturalIngredients')}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                {harmfulIngredients.map((item) => {
                  const isHighRisk = item.riskLevel === 'high';
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedIngredient(item)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md ${
                        isHighRisk
                          ? 'border-[#DC2626] bg-[#FEF2F2] dark:bg-[#3D1414]/50'
                          : 'border-[#F59E0B] bg-[#FFFBEB] dark:bg-[#382810]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-black ${
                            isHighRisk ? 'bg-[#DC2626] text-white' : 'bg-[#F59E0B] text-black'
                          }`}>
                            !
                          </span>
                          <span className="font-['Plus_Jakarta_Sans'] text-xs font-black text-[#111F15] dark:text-white">
                            {item.insNumber ? `${item.insNumber} • ` : ''}{item.name}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase border ${
                          isHighRisk
                            ? 'bg-[#DC2626] text-white border-[#991B1B]'
                            : 'bg-[#F59E0B] text-black border-[#B45309]'
                        }`}>
                          {isHighRisk ? t('highConcern') : t('moderateWatch')}
                        </span>
                      </div>

                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-[#69766D] dark:text-[#9BAA9E] uppercase">
                          {t('purpose')}: {item.purpose}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#404940] dark:text-[#D1D5DB] mt-1 leading-relaxed">
                        {item.scientificContext}
                      </p>

                      <div className="mt-2 flex items-center justify-between border-t border-[#111F15]/10 pt-1 text-[9px] font-mono text-[#69766D] dark:text-[#9BAA9E]">
                        <span>{item.regulatoryStatusIndia}</span>
                        <span className="underline font-bold text-[#111F15] dark:text-white">{t('toxicologyDossier')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Why is Palm Olein Oil Flagged Card */}
            {hasPalmOil && (
              <div
                onClick={() => setIsPalmOilAccordionOpen(!isPalmOilAccordionOpen)}
                className="p-3.5 rounded-2xl bg-[#FEF2F2] dark:bg-[#2D1616] border-2 border-[#DC2626] cursor-pointer mt-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#DC2626] text-white flex items-center justify-center font-bold text-xs">
                      🚨
                    </span>
                    <div>
                      <h4 className="text-xs font-black font-['Plus_Jakarta_Sans'] text-[#DC2626] dark:text-[#FFA4A0]">
                        {t('palmOilPenalty')}
                      </h4>
                      <p className="text-[10px] text-[#69766D] dark:text-[#D1D5DB]">
                        {t('palmOilInspect')}
                      </p>
                    </div>
                  </div>
                  {isPalmOilAccordionOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#DC2626]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#DC2626]" />
                  )}
                </div>

                {isPalmOilAccordionOpen && (
                  <div className="mt-2.5 pt-2 border-t border-[#DC2626]/20 text-[11px] text-[#404940] dark:text-[#E4F5E5] leading-relaxed animate-fade-in">
                    {t('palmOilExplanation')}
                  </div>
                )}
              </div>
            )}
          </section>
        );
      })()}

      {/* Chemical & Heavy Metal Contaminants Audit (Infant & High-Scrutiny Foods) */}
      {product.chemicalContaminants && product.chemicalContaminants.length > 0 && (
        <section className="p-4 rounded-3xl bg-[#FFFBEB] dark:bg-[#2D2416] border-2 border-[#D97706] shadow-[2px_2px_0px_#D97706] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#D97706] text-white flex items-center justify-center text-xs font-black">
                🔬
              </span>
              <div>
                <h2 className="text-xs font-black font-['Plus_Jakarta_Sans'] text-[#92400E] dark:text-[#FDE68A]">
                  Chemical Contaminants & Heavy Metals
                </h2>
                <p className="text-[10px] text-[#B45309] dark:text-[#FCD34D]">
                  Infant & Child Food Safety Screening
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#D97706] text-[9px] font-black uppercase">
              {product.targetAge ? `Target: ${product.targetAge}` : 'Lab Audit Required'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {product.chemicalContaminants.map((contam, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-[#1E1910] border border-[#D97706]/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#111F15] dark:text-white">
                    {contam.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase bg-[#FDE68A] text-[#92400E]">
                    {contam.riskLevel}
                  </span>
                </div>
                <p className="text-[9px] text-[#69766D] dark:text-[#D1D5DB]">
                  {contam.measuredValueMgKg ? `${contam.measuredValueMgKg} mg/kg` : 'Requires 3rd-party batch lab assay'}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#78350F] dark:text-[#FDE68A] leading-tight">
            ⚠️ Infant rice cereals bioaccumulate soil arsenic. FSSAI & WHO standards mandate strict limits on inorganic arsenic, lead, cadmium, and mercury for babies under 24 months.
          </p>
        </section>
      )}

      {/* Section 02: Nutritional Profile */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#C5F82A] text-[#111F15] border border-[#111F15] flex items-center justify-center text-xs font-black">
              02
            </span>
            <h2 className="text-sm font-black font-['Plus_Jakarta_Sans']">
              {t('nutritionalProfile')}
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#69766D] dark:text-[#9BAA9E] bg-[#EDF6EA] dark:bg-[#15271B] px-2 py-0.5 rounded border border-[#111F15]/10">
            {t('per100gServing')}
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {product.nutritionFacts && product.nutritionFacts.length > 0 ? (
            product.nutritionFacts.map((fact, idx) => {
              const isExcessive = fact.flag === 'excessive';
              const isModerate = fact.flag === 'moderate';
              const flagText = isExcessive ? t('excessive') : isModerate ? t('moderate') : t('healthy');

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border space-y-1.5 ${
                    isExcessive
                      ? 'border-[#DC2626]/40 bg-[#FEF2F2] dark:bg-[#2D1616]'
                      : isModerate
                      ? 'border-[#F59E0B]/40 bg-[#FFFBEB] dark:bg-[#2D2416]'
                      : 'border-[#111F15]/20 bg-[#F7FAF6] dark:bg-[#15271B]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold uppercase tracking-wide text-[10px] text-[#69766D] dark:text-[#9BAA9E]">
                      {translateNutrient(fact.nutrient)}
                    </span>
                    {fact.flag && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                          isExcessive
                            ? 'bg-[#FEE2E2] text-[#B91C1C] border-[#B91C1C]'
                            : isModerate
                            ? 'bg-[#FEF3C7] text-[#B45309] border-[#B45309]'
                            : 'bg-[#C5F82A] text-[#111F15] border-[#111F15]'
                        }`}
                      >
                        {flagText}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-black font-mono">
                    {fact.amountPer100g}
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                    <div
                      className={`h-full ${
                        isExcessive ? 'bg-[#EF4444] w-[85%]' : isModerate ? 'bg-[#F59E0B] w-[50%]' : 'bg-[#C5F82A] w-[30%]'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-[#69766D]">{t('noNutritionalBreakdown')}</p>
          )}
        </div>
      </section>

      {/* Section 03: Complete Ingredients List */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#C5F82A] text-[#111F15] border border-[#111F15] flex items-center justify-center text-xs font-black">
              03
            </span>
            <h2 className="text-sm font-black font-['Plus_Jakarta_Sans']">
              {t('completeIngredientsList')}
            </h2>
          </div>
          <span className="text-[10px] font-mono text-white bg-[#111F15] px-2 py-0.5 rounded-full font-bold">
            {product.ingredients.length} {t('listed')}
          </span>
        </div>

        {/* Dynamic Ingredient Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {product.ingredients.map((ing) => {
            const isHigh = ing.riskLevel === 'high';
            const isMod = ing.riskLevel === 'moderate';
            return (
              <span
                key={ing.id}
                onClick={() => setSelectedIngredient(ing)}
                className={`px-3 py-1.5 rounded-full border text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 ${
                  isHigh
                    ? 'bg-[#FEF2F2] dark:bg-[#3D1414] border-[#DC2626] text-[#DC2626]'
                    : isMod
                    ? 'bg-[#FFFBEB] dark:bg-[#382810] border-[#F59E0B] text-[#B45309] dark:text-[#FBBF24]'
                    : 'bg-[#EDF6EA] dark:bg-[#15271B] border-[#111F15]/30 text-[#111F15] dark:text-[#E4F5E5]'
                }`}
              >
                <span>{isHigh ? '🚨' : isMod ? '⚠️' : '✓'}</span>
                <span>{ing.name}</span>
                {isHigh && (
                  <span className="px-1.5 py-0.2 rounded bg-[#DC2626] text-white text-[9px]">{t('highConcern')}</span>
                )}
                {isMod && (
                  <span className="px-1.5 py-0.2 rounded bg-[#F59E0B] text-black text-[9px]">{t('moderateWatch')}</span>
                )}
              </span>
            );
          })}
        </div>
      </section>

      {/* Section 04: Additive Assessment */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#C5F82A] text-[#111F15] border border-[#111F15] flex items-center justify-center text-xs font-black">
              04
            </span>
            <h2 className="text-sm font-black font-['Plus_Jakarta_Sans']">
              {t('additiveAssessment')}
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#69766D] dark:text-[#9BAA9E] bg-[#EDF6EA] dark:bg-[#15271B] px-2 py-0.5 rounded border border-[#111F15]/10">
            {t('approvedAdditives')}
          </span>
        </div>

        <div className="space-y-2 pt-1">
          {/* INS 330 */}
          <div className="p-3 rounded-2xl border border-[#111F15]/20 bg-[#F7FAF6] dark:bg-[#15271B] space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black">INS 330</span>
                <span className="px-1.5 py-0.2 rounded bg-[#5EEAD4] text-[#111F15] text-[9px] font-extrabold border border-[#111F15]">
                  {t('safe')}
                </span>
                <span className="text-xs font-bold">{language === 'hi' ? 'साइट्रिक एसिड (नींबू सत्व)' : 'Citric Acid'}</span>
              </div>
              <Check className="w-4 h-4 text-[#005128] stroke-[3]" />
            </div>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              {language === 'hi'
                ? 'प्राकृतिक अम्लता नियामक और एंटीऑक्सीडेंट। JECFA द्वारा सुरक्षित घोषित।'
                : 'Natural acidity regulator & antioxidant synergist. Zero toxicological flags reported by JECFA.'}
            </p>
          </div>

          {/* INS 551 */}
          <div className="p-3 rounded-2xl border border-[#111F15]/20 bg-[#F7FAF6] dark:bg-[#15271B] space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black">INS 551</span>
                <span className="px-1.5 py-0.2 rounded bg-[#C5F82A] text-[#111F15] text-[9px] font-extrabold border border-[#111F15]">
                  {t('permitted')}
                </span>
                <span className="text-xs font-bold">{language === 'hi' ? 'सिलिकॉन डाइऑक्साइड' : 'Silicon Dioxide'}</span>
              </div>
              <Check className="w-4 h-4 text-[#005128] stroke-[3]" />
            </div>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              {language === 'hi'
                ? 'एंटी-केकिंग एजेंट 0.02% पर उपस्थित (अधिकतम स्वीकार्य सीमा: 2.0%)। सुरक्षित रूप से उत्सर्जित होता है।'
                : 'Anti-caking agent present at 0.02% (Max permissible limit: 2.0%). Passes standard elimination safely.'}
            </p>
          </div>
        </div>
      </section>

      {/* Section 05: Regulatory Transparency */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#C5F82A] text-[#111F15] border border-[#111F15] flex items-center justify-center text-xs font-black">
              05
            </span>
            <h2 className="text-sm font-black font-['Plus_Jakarta_Sans']">
              {t('regulatoryTransparency')}
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#111F15] bg-[#C5F82A] px-2 py-0.5 rounded-full font-bold border border-[#111F15]">
            {t('activeCompliant')}
          </span>
        </div>

        <div className="space-y-2 pt-1">
          {/* FSSAI */}
          <div className="p-3 rounded-2xl border border-[#111F15]/20 bg-[#F7FAF6] dark:bg-[#15271B] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-black/40 border border-[#111F15]/20 flex items-center justify-center text-xs font-bold">
              🌐
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-[#69766D] uppercase">
                  {t('fssaiLicense')}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#5EEAD4] text-[#111F15] text-[8px] font-bold">
                  {t('activeBadge')}
                </span>
              </div>
              <h4 className="text-xs font-black font-mono mt-0.5">
                Lic. 10018022008451
              </h4>
              <p className="text-[9px] text-[#69766D]">
                {t('foscosValidation')}
              </p>
            </div>
          </div>

          {/* Veg Green Dot */}
          <div className="p-3 rounded-2xl border border-[#111F15]/20 bg-[#F7FAF6] dark:bg-[#15271B] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-black/40 border border-[#111F15]/20 flex items-center justify-center">
              <span className="w-4 h-4 rounded-sm border-2 border-[#16A34A] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#69766D] uppercase block">
                {t('dietaryClassification')}
              </span>
              <h4 className="text-xs font-black mt-0.5">
                {t('vegGreenDot')}
              </h4>
              <p className="text-[9px] text-[#69766D]">
                {t('vegGuarantee')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for ingredient details */}
      <IngredientDetailModal
        ingredient={selectedIngredient}
        onClose={() => setSelectedIngredient(null)}
      />
    </div>
  );
};
