import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Check,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { productService } from '../../services/api/productService';
import type { Product } from '../../types';

export const WomenHygieneScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      const items = await productService.getAll();
      const hygieneItem = items.find((p) => p.category === 'women-hygiene');
      setProduct(hygieneItem || items[1]);
      setLoading(false);
    };
    fetchItem();
  }, [id]);

  if (loading || !product) {
    return (
      <div className="py-20 text-center text-xs font-mono font-bold">
        Loading Sanitary Integrity Audit...
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pt-3 pb-8 animate-fade-in text-[#111F15] dark:text-[#E4F5E5]">
      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#111F15]/10 dark:border-[#2D3E33]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-[#111F15] dark:border-white/30 text-xs font-bold hover:bg-[#EEE7FA] dark:hover:bg-[#34244a] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back</span>
          </button>
          <span className="text-xs font-mono text-[#7050A8] dark:text-[#BCA5FF] uppercase font-bold hidden sm:inline">
            HYGIENE INTEGRITY LABS
          </span>
        </div>

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
        </div>
      </div>

      {/* Top Banner Pill */}
      <div className="space-y-1">
        <div className="bg-[#7050A8] text-white py-1.5 px-3 rounded-full text-[10px] font-black tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-sm border border-[#111F15]">
          <span>◎</span>
          <span>LABEL-BASED ANALYSIS • IS 5405 YM-10411B</span>
        </div>
        <p className="text-[9px] font-mono text-[#69766D] text-center">
          Batch: APK-2024-09 • Exp: 2027
        </p>
      </div>

      {/* Product Spec Card */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[3px_3px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="relative aspect-[16/10] rounded-2xl bg-[#EEE7FA] dark:bg-[#251D33] border border-[#111F15]/15 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#C5F82A] text-[#111F15] border border-[#111F15] text-[9px] font-black uppercase tracking-wider shadow-sm">
            PACK OF 12
          </span>
          <div className="absolute bottom-2 left-2 right-2 bg-white/90 dark:bg-black/80 px-2 py-1 rounded-lg text-[9px] font-mono font-bold flex justify-between">
            <span>Form Factor</span>
            <span>Ultra Thin with Wings</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-[#7050A8] dark:text-[#DAD4E6] uppercase tracking-wider block">
            🌸 Intimate Hygiene & Menstrual Health
          </span>
          <h1 className="text-base font-black font-['Plus_Jakarta_Sans'] leading-tight mt-0.5">
            {product.name}
          </h1>
          <p className="text-xs text-[#404940] dark:text-[#9BAA9E] mt-1 leading-snug">
            {product.summary}
          </p>
        </div>
      </div>

      {/* Grade Hero Card (Lavender Spectrum - Stitch Screen 6) */}
      <div className="p-4 rounded-3xl bg-[#EEE7FA] dark:bg-[#251D33] border-2 border-[#111F15] shadow-[3px_3px_0px_#111F15] dark:shadow-none space-y-3 text-center">
        <div className="flex items-center justify-between">
          <div className="w-14 h-14 rounded-2xl bg-[#5EEAD4] text-[#111F15] border-2 border-[#111F15] flex flex-col items-center justify-center font-black shadow-sm">
            <span className="text-[8px] uppercase tracking-widest leading-none">GRADE</span>
            <span className="text-2xl leading-none font-['Plus_Jakarta_Sans']">A</span>
          </div>

          <div className="flex-1 text-left pl-3">
            <span className="px-2 py-0.5 rounded-full bg-[#C5F82A] text-[#111F15] text-[9px] font-black border border-[#111F15] uppercase">
              ZERO IRRITANTS
            </span>
            <h3 className="text-sm font-black font-['Plus_Jakarta_Sans'] mt-0.5">
              Ultra-Clean Profile
            </h3>
            <p className="text-[10px] text-[#69766D] dark:text-[#9BAA9E]">
              Top 0.5% benchmark in mucosal safety
            </p>
          </div>
        </div>

        {/* Purity Bar */}
        <div className="bg-[#C5F82A] text-[#111F15] py-2 px-3 rounded-2xl border-2 border-[#111F15] text-xs font-black tracking-wider uppercase font-mono shadow-[2px_2px_0px_#111F15]">
          PURITY RATING 98/100
        </div>

        {/* Pills */}
        <div className="flex flex-wrap gap-1 justify-center pt-1">
          <span className="px-2 py-0.5 rounded-full bg-white dark:bg-[#1A2A1F] border border-[#111F15]/20 text-[9px] font-bold">
            High Material Biocompatibility
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white dark:bg-[#1A2A1F] border border-[#111F15]/20 text-[9px] font-bold">
            Elemental Chlorine Free
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white dark:bg-[#1A2A1F] border border-[#111F15]/20 text-[9px] font-bold">
            Dioxin Undetected
          </span>
        </div>
      </div>

      {/* 5-Layer Anatomical Breakdown (Stitch Screen 6) */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black font-['Plus_Jakarta_Sans']">
            5-Layer Anatomical Breakdown
          </h2>
          <span className="text-[9px] font-mono text-[#7050A8] bg-[#EEE7FA] px-2 py-0.5 rounded-full font-bold border border-[#7050A8]/30">
            100% DISCLOSED
          </span>
        </div>

        <p className="text-[10px] text-[#69766D] dark:text-[#9BAA9E] leading-tight">
          Comprehensive transparency from intimate contact plane to protective barrier.
        </p>

        <div className="space-y-2.5 pt-1">
          {/* L1 */}
          <div className="p-3 rounded-2xl border-2 border-[#111F15] bg-[#F7FAF6] dark:bg-[#15271B] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-[#111F15] text-white text-[9px] font-black flex items-center justify-center font-mono">
                  L1
                </span>
                <span className="text-xs font-black font-['Plus_Jakarta_Sans']">Top Sheet</span>
                <span className="px-1.5 py-0.2 rounded bg-[#C5F82A] text-[8px] font-black border border-[#111F15]">
                  BENEFICIAL
                </span>
              </div>
              <span className="text-[8px] font-mono uppercase bg-white px-1.5 py-0.5 rounded border border-[#111F15]/20">
                Hypoallergenic
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#111F15] dark:text-[#E4F5E5]">
              100% GOTS Certified Organic Cotton
            </h4>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              Naturally soft, elemental chlorine-free (TCF) cotton weave minimizes moisture trapping and chafing.
            </p>
            <div className="pt-1 flex items-center justify-between text-[9px] font-mono border-t border-[#111F15]/10">
              <span className="text-[#69766D]">SKIN REACTION</span>
              <span className="font-bold text-[#005128] flex items-center gap-0.5">
                Non-Reactive <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
          </div>

          {/* L2 */}
          <div className="p-3 rounded-2xl border-2 border-[#111F15] bg-[#F7FAF6] dark:bg-[#15271B] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-[#111F15] text-white text-[9px] font-black flex items-center justify-center font-mono">
                  L2
                </span>
                <span className="text-xs font-black font-['Plus_Jakarta_Sans']">Absorbent Core</span>
                <span className="px-1.5 py-0.2 rounded bg-[#EEE7FA] text-[#7050A8] text-[8px] font-black border border-[#7050A8]">
                  ULTRA-ABSORBENCY
                </span>
              </div>
            </div>
            <h4 className="text-xs font-bold text-[#111F15] dark:text-[#E4F5E5]">
              ECF Wood Pulp & Non-toxic SAP
            </h4>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              FSC certified cellulose fiber fluff coupled with encapsulated non-sensitizing sodium polyacrylate beads.
            </p>
            <div className="pt-1 flex items-center justify-between text-[9px] font-mono border-t border-[#111F15]/10">
              <span className="text-[#69766D]">LOCK-IN RETENTION</span>
              <span className="font-bold text-[#005128] flex items-center gap-0.5">
                99.4% Flow <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
          </div>

          {/* L3 */}
          <div className="p-3 rounded-2xl border-2 border-[#111F15] bg-[#F7FAF6] dark:bg-[#15271B] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-[#111F15] text-white text-[9px] font-black flex items-center justify-center font-mono">
                  L3
                </span>
                <span className="text-xs font-black font-['Plus_Jakarta_Sans']">Backsheet Guard</span>
                <span className="px-1.5 py-0.2 rounded bg-[#C5F82A] text-[8px] font-black border border-[#111F15]">
                  COMPOSTABLE
                </span>
              </div>
            </div>
            <h4 className="text-xs font-bold text-[#111F15] dark:text-[#E4F5E5]">
              Cornstarch-based PLA Film
            </h4>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              100% biodegradable & micro-perforated breathable barrier preventing leak-through while circulating air.
            </p>
            <div className="pt-1 flex items-center justify-between text-[9px] font-mono border-t border-[#111F15]/10">
              <span className="text-[#69766D]">AIRFLOW INDEX</span>
              <span className="font-bold text-[#005128] flex items-center gap-0.5">
                High Breathability <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
          </div>

          {/* L4 */}
          <div className="p-3 rounded-2xl border-2 border-[#111F15] bg-[#F7FAF6] dark:bg-[#15271B] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-[#111F15] text-white text-[9px] font-black flex items-center justify-center font-mono">
                  L4
                </span>
                <span className="text-xs font-black font-['Plus_Jakarta_Sans']">Adhesives & Wing Tabs</span>
              </div>
              <span className="text-[8px] font-mono uppercase bg-white px-1.5 py-0.5 rounded border border-[#111F15]/20">
                Medical Grade
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#111F15] dark:text-[#E4F5E5]">
              Non-Toxic Hot Melt Adhesive
            </h4>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              Formulated without solvent residue, formaldehyde, or heavy metals; holds pad firm without fabric shear.
            </p>
            <div className="pt-1 flex items-center justify-between text-[9px] font-mono border-t border-[#111F15]/10">
              <span className="text-[#69766D]">SOLVENT RISK</span>
              <span className="font-bold text-[#005128] flex items-center gap-0.5">
                0% Extracted <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
          </div>

          {/* L5 */}
          <div className="p-3 rounded-2xl border-2 border-[#111F15] bg-[#F7FAF6] dark:bg-[#15271B] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-[#111F15] text-white text-[9px] font-black flex items-center justify-center font-mono">
                  L5
                </span>
                <span className="text-xs font-black font-['Plus_Jakarta_Sans']">Fragrance / Deodorant</span>
                <span className="px-1.5 py-0.2 rounded bg-[#C5F82A] text-[8px] font-black border border-[#111F15]">
                  IDEAL SCORE
                </span>
              </div>
            </div>
            <h4 className="text-xs font-bold text-[#111F15] dark:text-[#E4F5E5]">
              None Disclosed (100% Fragrance-Free)
            </h4>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              Zero synthetic masking agents or essential oils; eliminates major cause of contact vulvitis and irritation.
            </p>
            <div className="pt-1 flex items-center justify-between text-[9px] font-mono border-t border-[#111F15]/10">
              <span className="text-[#69766D]">SENSITISER COUNT</span>
              <span className="font-bold text-[#005128] flex items-center gap-0.5">
                0 Allergens <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bureau of Indian Standards Section (Stitch Screen 6) */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-md bg-[#EEE7FA] text-[#7050A8] text-[9px] font-black border border-[#7050A8] uppercase">
            BUREAU OF INDIAN STANDARDS
          </span>
          <span className="text-[9px] font-mono text-[#69766D] uppercase">
            NATIONAL COMPL.
          </span>
        </div>

        <div>
          <h3 className="text-sm font-black font-['Plus_Jakarta_Sans']">
            IS 5405:2019 Certified
          </h3>
          <p className="text-[10px] text-[#69766D] dark:text-[#9BAA9E]">
            Complies with statutory performance benchmarks for disposable sanitary protection products.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 rounded-2xl bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/20">
            <span className="text-[9px] font-mono text-[#69766D] uppercase block">
              pH VALUE
            </span>
            <span className="text-base font-black font-mono">6.8 pH</span>
            <span className="text-[9px] text-[#005128] font-bold block mt-0.5">
              Target 6.0 - 8.5 (Passed)
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/20">
            <span className="text-[9px] font-mono text-[#69766D] uppercase block">
              ABSORBENCY TIME
            </span>
            <span className="text-base font-black font-mono">&lt; 3.2s</span>
            <span className="text-[9px] text-[#005128] font-bold block mt-0.5">
              IS Max: 10s (Passed)
            </span>
          </div>
        </div>
      </section>

      {/* Gemini Sanitary Intelligence Box */}
      <div className="p-4 rounded-3xl bg-[#EEE7FA] dark:bg-[#251D33] border-2 border-[#111F15] space-y-2">
        <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-[#7050A8]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GEMINI SANITARY INTELLIGENCE</span>
        </div>

        <h3 className="text-xs font-black font-['Plus_Jakarta_Sans']">
          Why TCF Matters For Vulvar Skin
        </h3>
        <p className="text-[10px] text-[#474452] dark:text-[#DAD4E6] leading-relaxed">
          Totally Chlorine-Free (TCF) cotton avoids the formation of chlorinated organic compounds such as dioxins and furans. Because vaginal mucous membranes possess high vascularity and cellular permeability, pure TCF reduces chronic contact dermatitis and micro-tear vulnerability during prolonged use.
        </p>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => navigate(`/ai-explainer/${product.id}`)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A2A1F] border border-[#111F15] text-[10px] font-black flex items-center gap-1 shadow-sm"
          >
            <span>文A Explain in हिन्दी</span>
          </button>
          <button
            onClick={() => navigate(`/ai-explainer/${product.id}`)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A2A1F] border border-[#111F15] text-[10px] font-black flex items-center gap-1 shadow-sm"
          >
            <span>Are more pads compostable?</span>
          </button>
        </div>
      </div>
    </div>
  );
};
