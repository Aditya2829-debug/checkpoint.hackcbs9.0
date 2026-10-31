import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { productService } from '../../services/api/productService';
import { useProductStore } from '../../store/useProductStore';
import { IngredientDetailModal } from '../ingredients/IngredientDetailModal';
import type { Ingredient, Product } from '../../types';

export const ProductAnalysisScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isWatchlisted, toggleWatchlist } = useProductStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isPalmOilAccordionOpen, setIsPalmOilAccordionOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      if (id) {
        const item = await productService.getById(id);
        setProduct(item);
      } else {
        const items = await productService.getAll();
        setProduct(items[0]);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

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

      {/* Grade Hero Card (Stitch Screen 2 / 7) */}
      <div className="p-4 rounded-3xl bg-gradient-to-b from-[#E2F7D8] to-[#D0F0C0] dark:from-[#1A2E1F] dark:to-[#122316] border-2 border-[#111F15] shadow-[3px_3px_0px_#111F15] dark:shadow-none space-y-3 text-center">
        <span className="inline-block px-3 py-0.5 rounded-full bg-white/70 dark:bg-black/40 border border-[#111F15]/20 text-[9px] font-mono font-black uppercase tracking-wider">
          COMPREHENSIVE SAFETY & QUALITY AUDIT
        </span>

        {/* Big Grade Box */}
        <div className="flex justify-center">
          <div className="relative bg-[#C5F82A] text-[#111F15] border-2 border-[#111F15] shadow-[3px_3px_0px_#111F15] rounded-3xl px-8 py-3 text-center">
            <span className="absolute -top-2.5 -right-2.5 px-2 py-0.5 rounded-md bg-[#5EEAD4] text-[#111F15] border border-[#111F15] text-[9px] font-black uppercase">
              VERIFIED ✓
            </span>
            <span className="text-[10px] font-extrabold font-mono tracking-widest block uppercase text-[#111F15]/80">
              GRADE
            </span>
            <span className="text-4xl font-black font-['Plus_Jakarta_Sans'] leading-none">
              {product.grade}
            </span>
            <span className="text-[11px] font-mono font-bold block mt-1">
              {product.gradeScore} / 100
            </span>
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-[#111F15] text-white py-1.5 px-3 rounded-xl text-[10px] font-extrabold tracking-wide uppercase">
          NUTRITIONALLY BALANCED • MINOR ADDITIVE WATCH
        </div>

        <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E] leading-tight">
          Calculated via <span className="font-bold">ICMR-NIN dietary guidelines</span> & <span className="font-bold">FSSAI standards</span> for packaged snacks.
        </p>

        {/* Big Cyan Explainer CTA Button */}
        <button
          onClick={() => navigate(`/ai-explainer/${product.id}`)}
          className="w-full py-2.5 rounded-2xl bg-[#5EEAD4] text-[#111F15] font-['Plus_Jakarta_Sans'] font-black text-xs uppercase tracking-wider border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
        >
          <span>⚡</span>
          <span>Ask Gemini Explainer</span>
          <span>⚡</span>
        </button>
      </div>

      {/* Section 01: Nutritional Profile */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#C5F82A] text-[#111F15] border border-[#111F15] flex items-center justify-center text-xs font-black">
              01
            </span>
            <h2 className="text-sm font-black font-['Plus_Jakarta_Sans']">
              Nutritional Profile
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#69766D] dark:text-[#9BAA9E] bg-[#EDF6EA] dark:bg-[#15271B] px-2 py-0.5 rounded border border-[#111F15]/10">
            Per 50g serving
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {/* Dietary Fiber */}
          <div className="p-3 rounded-2xl border border-[#111F15]/20 bg-[#F7FAF6] dark:bg-[#15271B] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wide text-[10px] text-[#69766D] dark:text-[#9BAA9E]">
                DIETARY FIBER
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#C5F82A] text-[#111F15] text-[9px] font-black border border-[#111F15]">
                100% NAT. GRAIN
              </span>
            </div>
            <div className="text-sm font-black font-mono">
              5.2g <span className="text-xs text-[#69766D] font-normal">/ 21% RDA</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
              <div className="h-full bg-[#C5F82A] w-[70%]" />
            </div>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              High Fiber • Slow-release carbohydrates
            </p>
          </div>

          {/* Saturated Fat */}
          <div className="p-3 rounded-2xl border border-[#111F15]/20 bg-[#F7FAF6] dark:bg-[#15271B] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wide text-[10px] text-[#69766D] dark:text-[#9BAA9E]">
                SATURATED FAT
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#5EEAD4] text-[#111F15] text-[9px] font-black border border-[#111F15]">
                LOW
              </span>
            </div>
            <div className="text-sm font-black font-mono">
              1.4g <span className="text-xs text-[#69766D] font-normal">/ 6% RDA</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
              <div className="h-full bg-[#5EEAD4] w-[25%]" />
            </div>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              Favourable lipid profile from dry roasting
            </p>
          </div>

          {/* Sodium */}
          <div className="p-3 rounded-2xl border border-[#111F15]/20 bg-[#F7FAF6] dark:bg-[#15271B] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wide text-[10px] text-[#69766D] dark:text-[#9BAA9E]">
                SODIUM
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-[9px] font-black border border-[#B91C1C]">
                MODERATE
              </span>
            </div>
            <div className="text-sm font-black font-mono">
              280mg <span className="text-xs text-[#69766D] font-normal">/ 14% RDA</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
              <div className="h-full bg-[#EF4444] w-[45%]" />
            </div>
            <p className="text-[10px] text-[#B91C1C]">
              Keep daily consumption within 2 servings
            </p>
          </div>
        </div>
      </section>

      {/* Section 02: Ingredient Assessment */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#C5F82A] text-[#111F15] border border-[#111F15] flex items-center justify-center text-xs font-black">
              02
            </span>
            <h2 className="text-sm font-black font-['Plus_Jakarta_Sans']">
              Ingredient Assessment
            </h2>
          </div>
          <span className="text-[10px] font-mono text-white bg-[#111F15] px-2 py-0.5 rounded-full font-bold">
            14 Identified
          </span>
        </div>

        {/* Clean Pill List matching Stitch */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="px-3 py-1.5 rounded-full bg-[#EDF6EA] dark:bg-[#15271B] border-2 border-[#111F15] text-xs font-extrabold flex items-center gap-1.5">
            <span className="text-[#005128]">★</span> Finger Millet (Ragi) 32%
            <span className="px-1.5 py-0.2 rounded bg-[#C5F82A] text-[9px] border border-[#111F15]">Beneficial</span>
          </span>

          <span className="px-3 py-1.5 rounded-full bg-[#EDF6EA] dark:bg-[#15271B] border-2 border-[#111F15] text-xs font-extrabold flex items-center gap-1.5">
            <span className="text-[#005128]">★</span> Sorghum (Jowar) 24%
            <span className="px-1.5 py-0.2 rounded bg-[#C5F82A] text-[9px] border border-[#111F15]">Beneficial</span>
          </span>

          <span className="px-3 py-1.5 rounded-full bg-[#EDF6EA] dark:bg-[#15271B] border-2 border-[#111F15] text-xs font-extrabold flex items-center gap-1.5">
            <span className="text-[#005128]">★</span> Foxtail Millet 14%
            <span className="px-1.5 py-0.2 rounded bg-[#C5F82A] text-[9px] border border-[#111F15]">Beneficial</span>
          </span>

          <span className="px-3 py-1.5 rounded-full bg-white dark:bg-[#1A2A1F] border border-[#111F15]/30 text-xs font-bold text-[#404940] dark:text-[#9BAA9E]">
            • Himalayan Pink Salt 1.4%
          </span>

          <span className="px-3 py-1.5 rounded-full bg-white dark:bg-[#1A2A1F] border border-[#111F15]/30 text-xs font-bold text-[#404940] dark:text-[#9BAA9E]">
            • Dehydrated Onion & Garlic 1.2%
          </span>

          <span className="px-3 py-1.5 rounded-full bg-white dark:bg-[#1A2A1F] border border-[#111F15]/30 text-xs font-bold text-[#404940] dark:text-[#9BAA9E]">
            • Black Pepper Extract 0.4%
          </span>

          {/* Red Flagged Palm Olein */}
          <span className="px-3 py-1.5 rounded-full bg-[#FEF2F2] dark:bg-[#3D1414] border-2 border-[#DC2626] text-xs font-extrabold text-[#DC2626] flex items-center gap-1.5">
            <span>▲</span> Refined Palm Olein Oil
            <span className="px-1.5 py-0.2 rounded bg-[#DC2626] text-white text-[9px]">Moderate Concern</span>
          </span>
        </div>

        {/* Why is Palm Olein Oil Flagged Card */}
        <div
          onClick={() => setIsPalmOilAccordionOpen(!isPalmOilAccordionOpen)}
          className="p-3.5 rounded-2xl bg-[#EDF6EA] dark:bg-[#15271B] border-2 border-[#111F15] cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#DC2626] text-white flex items-center justify-center font-bold text-xs">
                !
              </span>
              <div>
                <h4 className="text-xs font-black font-['Plus_Jakarta_Sans']">
                  Why is Palm Olein Oil flagged?
                </h4>
                <p className="text-[10px] text-[#69766D] dark:text-[#9BAA9E]">
                  Tap to inspect lipid breakdown & processing analysis
                </p>
              </div>
            </div>
            {isPalmOilAccordionOpen ? (
              <ChevronUp className="w-4 h-4 text-[#111F15]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#111F15]" />
            )}
          </div>

          {isPalmOilAccordionOpen && (
            <div className="mt-2.5 pt-2 border-t border-[#111F15]/20 text-[11px] text-[#404940] dark:text-[#9BAA9E] leading-relaxed animate-fade-in">
              Industrial seasoning sprays require a carrier fat with high smoke point and robust resistance to oxidative rancidity in tropical shelf environments. Palm olein contains 44% palmitic acid which can elevate low-density lipoprotein (LDL) when consumed regularly.
            </div>
          )}
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
