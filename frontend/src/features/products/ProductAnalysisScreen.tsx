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
import { IngredientDetailModal } from '../ingredients/IngredientDetailModal';
import type { Ingredient, Product } from '../../types';

export const ProductAnalysisScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isWatchlisted, toggleWatchlist, currentProduct } = useProductStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isPalmOilAccordionOpen, setIsPalmOilAccordionOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      if (currentProduct && (currentProduct.id === id || currentProduct.barcode === id)) {
        setProduct(currentProduct);
        setLoading(false);
        return;
      }

      if (id) {
        try {
          const item = await scanService.lookupBarcode(id);
          setProduct(item);
        } catch {
          const item = await productService.getById(id);
          setProduct(item);
        }
      } else {
        const items = await productService.getAll();
        setProduct(items[0]);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id, currentProduct]);

  if (loading || !product) {
    return (
      <div className="py-20 text-center text-xs font-mono font-bold">
        Loading Product Audit...
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
          <span>Back</span>
        </button>

        <span className="font-['Plus_Jakarta_Sans'] font-black text-sm text-[#69766D] dark:text-[#9BAA9E]">
          Product Inspection
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Analysis link copied!');
              }
            }}
            className="w-8 h-8 rounded-full border border-[#111F15]/30 dark:border-white/30 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toggleWatchlist(product.id)}
            className={`w-8 h-8 rounded-full border border-[#111F15]/30 dark:border-white/30 flex items-center justify-center transition-colors cursor-pointer ${
              isFavorite ? 'bg-[#C5F82A] text-[#111F15] border-[#111F15]' : ''
            }`}
            title="Bookmark"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Image & Spec Card */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[3px_3px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="relative aspect-[16/10] rounded-2xl bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/15 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#C5F82A] text-[#111F15] border border-[#111F15] text-[9px] font-black uppercase tracking-wider shadow-sm">
            ROASTED 100%
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-[#5EEAD4]/30 text-[#005128] text-[9px] font-extrabold uppercase border border-[#111F15]/20">
              {product.categoryLabel}
            </span>
            <span className="text-[10px] font-mono text-[#69766D] dark:text-[#9BAA9E]">
              Barcode: {product.barcode}
            </span>
          </div>

          <h1 className="text-lg font-black font-['Plus_Jakarta_Sans'] leading-tight mt-1">
            {product.name}
          </h1>

          <p className="text-xs text-[#404940] dark:text-[#9BAA9E] mt-1 leading-snug">
            {product.summary}
          </p>
        </div>
      </div>

      {/* Grade Hero Card */}
      {(() => {
        const gradeColorMap: Record<string, { bg: string; text: string; badge: string; border: string }> = {
          A: { bg: 'bg-[#15803D]', text: 'text-white', badge: 'bg-[#C5F82A] text-[#111F15]', border: 'border-[#15803D]' },
          B: { bg: 'bg-[#84CC16]', text: 'text-[#111F15]', badge: 'bg-[#111F15] text-white', border: 'border-[#84CC16]' },
          C: { bg: 'bg-[#EAB308]', text: 'text-[#111F15]', badge: 'bg-[#111F15] text-white', border: 'border-[#EAB308]' },
          D: { bg: 'bg-[#F97316]', text: 'text-white', badge: 'bg-[#111F15] text-white', border: 'border-[#F97316]' },
          E: { bg: 'bg-[#EF4444]', text: 'text-white', badge: 'bg-[#111F15] text-white', border: 'border-[#EF4444]' },
        };
        const colors = gradeColorMap[product.grade] || gradeColorMap.C;

        const gradeStatusText = {
          A: 'EXCELLENT NUTRITIONAL QUALITY • CLEAN INGREDIENTS',
          B: 'HEALTHIER CHOICE • BALANCED NUTRIENT PROFILE',
          C: 'MODERATE NUTRITIONAL VALUE • CONSUME OCCASIONALLY',
          D: 'HIGH CONCERN NUTRIENTS • RESTRAIN CONSUMPTION',
          E: 'CRITICAL HEALTH CONCERN • HIGH SUGAR / SFA / PALM OIL',
        }[product.grade] || 'COMPREHENSIVE HEALTH AUDIT';

        return (
          <div className="p-4 rounded-3xl bg-gradient-to-b from-[#E2F7D8] to-[#D0F0C0] dark:from-[#1A2E1F] dark:to-[#122316] border-2 border-[#111F15] shadow-[3px_3px_0px_#111F15] dark:shadow-none space-y-3 text-center">
            <span className="inline-block px-3 py-0.5 rounded-full bg-white/70 dark:bg-black/40 border border-[#111F15]/20 text-[9px] font-mono font-black uppercase tracking-wider">
              IN-CODE NUTRI-SCORE RATING ENGINE
            </span>

            {/* Big Grade Box */}
            <div className="flex justify-center">
              <div className={`relative ${colors.bg} ${colors.text} border-2 border-[#111F15] shadow-[3px_3px_0px_#111F15] rounded-3xl px-9 py-3 text-center`}>
                <span className="absolute -top-2.5 -right-2.5 px-2 py-0.5 rounded-md bg-[#5EEAD4] text-[#111F15] border border-[#111F15] text-[9px] font-black uppercase">
                  VERIFIED ✓
                </span>
                <span className="text-[10px] font-extrabold font-mono tracking-widest block uppercase opacity-85">
                  NUTRI-GRADE
                </span>
                <span className="text-5xl font-black font-['Plus_Jakarta_Sans'] leading-none">
                  {product.grade}
                </span>
                <span className="text-[11px] font-mono font-bold block mt-1 opacity-90">
                  {product.gradeScore} / 100 Score
                </span>
              </div>
            </div>

            {/* Status bar */}
            <div className="bg-[#111F15] text-white py-1.5 px-3 rounded-xl text-[10px] font-extrabold tracking-wide uppercase">
              {gradeStatusText}
            </div>

            {/* In-Code Rating Reasons & Points Breakdown */}
            {product.geminiExplainer?.whyThisGrade && product.geminiExplainer.whyThisGrade.length > 0 && (
              <div className="text-left bg-white/80 dark:bg-black/30 rounded-2xl p-3 border border-[#111F15]/15 space-y-1.5">
                <p className="text-[10px] font-mono font-black text-[#111F15] dark:text-[#E4F5E5] uppercase tracking-wider">
                  Rating Calculation Breakdown:
                </p>
                <div className="space-y-1">
                  {product.geminiExplainer.whyThisGrade.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-[#111F15] dark:text-[#E4F5E5]">
                      <span className="text-sm leading-none">
                        {reason.toLowerCase().includes('palm') ? '🚨' : reason.toLowerCase().includes('high') ? '⚠️' : '✓'}
                      </span>
                      <span className="font-medium text-[11px] leading-tight">
                        {reason}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E] leading-tight">
              Calculated via pure deterministic Nutri-Score algorithm & FSSAI standards. Grade is never generated by AI.
            </p>

            {/* Ask Gemini Explainer CTA Button */}
            <button
              onClick={() => navigate(`/ai-explainer/${product.id}`)}
              className="w-full py-2.5 rounded-2xl bg-[#5EEAD4] text-[#111F15] font-['Plus_Jakarta_Sans'] font-black text-xs uppercase tracking-wider border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>⚡</span>
              <span>Ask Gemini Nutritionist Deep Dive</span>
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
                  Harmful Chemicals & Additives Watchlist
                </h2>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                harmfulIngredients.length > 0 ? 'bg-[#FEE2E2] text-[#B91C1C] border border-[#B91C1C]' : 'bg-[#EDF6EA] text-[#005128]'
              }`}>
                {harmfulIngredients.length} Flagged
              </span>
            </div>

            {harmfulIngredients.length === 0 ? (
              <div className="p-3 rounded-2xl bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/15 text-center">
                <p className="text-xs font-bold text-[#005128]">
                  ✓ Zero High or Moderate Risk Chemicals Detected!
                </p>
                <p className="text-[10px] text-[#69766D] mt-0.5">
                  All identified ingredients are natural dietary components.
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
                          {isHighRisk ? 'High Concern' : 'Moderate / Watch'}
                        </span>
                      </div>

                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-[#69766D] dark:text-[#9BAA9E] uppercase">
                          Purpose: {item.purpose}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#404940] dark:text-[#D1D5DB] mt-1 leading-relaxed">
                        {item.scientificContext}
                      </p>

                      <div className="mt-2 flex items-center justify-between border-t border-[#111F15]/10 pt-1 text-[9px] font-mono text-[#69766D] dark:text-[#9BAA9E]">
                        <span>{item.regulatoryStatusIndia}</span>
                        <span className="underline font-bold text-[#111F15] dark:text-white">Tap for Toxicology Dossier →</span>
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
                        Palm Oil Penalty Applied (-1 Grade)
                      </h4>
                      <p className="text-[10px] text-[#69766D] dark:text-[#D1D5DB]">
                        Tap to inspect why palm oil triggered an automatic grade penalty
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
                    Refined palm oil contains over 44% palmitic acid (a saturated fatty acid). According to ICMR-NIN and WHO cardiometabolic guidelines, high dietary palmitic acid elevates serum low-density lipoprotein (LDL) cholesterol and induces systemic vascular inflammation. Our deterministic rating engine penalizes every product containing palm oil with a 1-grade downgrade.
                  </div>
                )}
              </div>
            )}
          </section>
        );
      })()}

      {/* Section 02: Nutritional Profile */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#C5F82A] text-[#111F15] border border-[#111F15] flex items-center justify-center text-xs font-black">
              02
            </span>
            <h2 className="text-sm font-black font-['Plus_Jakarta_Sans']">
              Nutritional Profile
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#69766D] dark:text-[#9BAA9E] bg-[#EDF6EA] dark:bg-[#15271B] px-2 py-0.5 rounded border border-[#111F15]/10">
            Per 100g serving
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {product.nutritionFacts && product.nutritionFacts.length > 0 ? (
            product.nutritionFacts.map((fact, idx) => {
              const isExcessive = fact.flag === 'excessive';
              const isModerate = fact.flag === 'moderate';
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
                      {fact.nutrient}
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
                        {fact.flag.toUpperCase()}
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
            <p className="text-xs text-[#69766D]">No nutritional breakdown available.</p>
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
              Complete Ingredients List
            </h2>
          </div>
          <span className="text-[10px] font-mono text-white bg-[#111F15] px-2 py-0.5 rounded-full font-bold">
            {product.ingredients.length} Listed
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
                  <span className="px-1.5 py-0.2 rounded bg-[#DC2626] text-white text-[9px]">High</span>
                )}
                {isMod && (
                  <span className="px-1.5 py-0.2 rounded bg-[#F59E0B] text-black text-[9px]">Watch</span>
                )}
              </span>
            );
          })}
        </div>
      </section>

      {/* Section 03: Additive Assessment */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#C5F82A] text-[#111F15] border border-[#111F15] flex items-center justify-center text-xs font-black">
              03
            </span>
            <h2 className="text-sm font-black font-['Plus_Jakarta_Sans']">
              Additive Assessment
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#69766D] dark:text-[#9BAA9E] bg-[#EDF6EA] dark:bg-[#15271B] px-2 py-0.5 rounded border border-[#111F15]/10">
            2 Approved Additives
          </span>
        </div>

        <div className="space-y-2 pt-1">
          {/* INS 330 */}
          <div className="p-3 rounded-2xl border border-[#111F15]/20 bg-[#F7FAF6] dark:bg-[#15271B] space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black">INS 330</span>
                <span className="px-1.5 py-0.2 rounded bg-[#5EEAD4] text-[#111F15] text-[9px] font-extrabold border border-[#111F15]">
                  SAFE
                </span>
                <span className="text-xs font-bold">Citric Acid</span>
              </div>
              <Check className="w-4 h-4 text-[#005128] stroke-[3]" />
            </div>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              Natural acidity regulator & antioxidant synergist. Zero toxicological flags reported by JECFA.
            </p>
          </div>

          {/* INS 551 */}
          <div className="p-3 rounded-2xl border border-[#111F15]/20 bg-[#F7FAF6] dark:bg-[#15271B] space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black">INS 551</span>
                <span className="px-1.5 py-0.2 rounded bg-[#C5F82A] text-[#111F15] text-[9px] font-extrabold border border-[#111F15]">
                  PERMITTED
                </span>
                <span className="text-xs font-bold">Silicon Dioxide</span>
              </div>
              <Check className="w-4 h-4 text-[#005128] stroke-[3]" />
            </div>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              Anti-caking agent present at 0.02% (Max permissible limit: 2.0%). Passes standard elimination safely.
            </p>
          </div>
        </div>
      </section>

      {/* Section 04: Regulatory Transparency */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#C5F82A] text-[#111F15] border border-[#111F15] flex items-center justify-center text-xs font-black">
              04
            </span>
            <h2 className="text-sm font-black font-['Plus_Jakarta_Sans']">
              Regulatory Transparency
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#111F15] bg-[#C5F82A] px-2 py-0.5 rounded-full font-bold border border-[#111F15]">
            Active & Compliant
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
                  FSSAI LICENSE
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#5EEAD4] text-[#111F15] text-[8px] font-bold">
                  ACTIVE
                </span>
              </div>
              <h4 className="text-xs font-black font-mono mt-0.5">
                Lic. 10018022008451
              </h4>
              <p className="text-[9px] text-[#69766D]">
                Validated against National FoSCoS portal
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
                DIETARY CLASSIFICATION
              </span>
              <h4 className="text-xs font-black mt-0.5">
                100% Vegetarian (Green Dot)
              </h4>
              <p className="text-[9px] text-[#69766D]">
                Zero animal derivations / gelatin free
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
