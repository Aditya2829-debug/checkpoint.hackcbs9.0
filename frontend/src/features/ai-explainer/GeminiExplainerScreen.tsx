import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Send,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { productService } from '../../services/api/productService';
import { aiService, type AiChatMessage } from '../../services/api/aiService';
import type { Product } from '../../types';

export const GeminiExplainerScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const item = await productService.getById(id);
        setProduct(item);
      } else {
        const items = await productService.getAll();
        setProduct(items[0]);
      }
    };
    loadData();
  }, [id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendPrompt = async (promptText: string) => {
    if (!product || isAsking) return;
    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsAsking(true);

    try {
      const answer = await aiService.askQuestion(product.id, promptText);
      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: 'Unable to connect to AI gateway. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  if (!product) {
    return (
      <div className="py-20 text-center text-xs font-mono font-bold">
        Loading Gemini Intelligence...
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pt-3 pb-8 animate-fade-in text-[#111F15] dark:text-[#E4F5E5]">
      {/* Top Header Bar matching Stitch Screen 4 */}
      <div className="flex items-center justify-between pb-2 border-b border-[#111F15]/10 dark:border-[#2D3E33]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full border-2 border-[#111F15] dark:border-white/40 flex items-center justify-center hover:bg-[#C5F82A]"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div>
            <span className="font-['Plus_Jakarta_Sans'] font-black text-sm tracking-tight block">
              CheckPoint!!
            </span>
            <span className="text-[9px] font-mono text-[#69766D] dark:text-[#9BAA9E] uppercase block -mt-0.5">
              FOOD SCI VERIFIED
            </span>
          </div>
        </div>

        <button className="px-2.5 py-0.5 rounded-full border border-[#111F15] text-[10px] font-black bg-[#C5F82A] text-[#111F15]">
          EN/HI
        </button>
      </div>

      {/* CheckPoint Intelligence Top Banner */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[3px_3px_0px_#111F15] dark:shadow-none space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#5EEAD4] border border-[#111F15] flex items-center justify-center text-[#111F15]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-black font-['Plus_Jakarta_Sans']">
              CheckPoint Intelligence
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-[#C5F82A] text-[#111F15] text-[9px] font-black border border-[#111F15] uppercase">
            RUN FLASH
          </span>
        </div>
        <p className="text-[11px] text-[#404940] dark:text-[#9BAA9E] leading-snug">
          Real-time biochemical evaluation calibrated to Indian dietary patterns
        </p>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#005128] dark:text-[#C5F82A] pt-1">
          <span className="w-2 h-2 rounded-full bg-[#C5F82A] animate-ping" />
          ACTIVE SESSION
        </span>
      </div>

      {/* Product Strip */}
      <div className="p-3 rounded-2xl bg-[#EDF6EA] dark:bg-[#15271B] border-2 border-[#111F15] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-11 h-11 rounded-xl object-cover border border-[#111F15]/20 shrink-0 bg-white"
          />
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-[#005128] font-bold block uppercase">
              {product.categoryLabel} • {product.barcode}
            </span>
            <h3 className="text-xs font-black truncate font-['Plus_Jakarta_Sans']">
              {product.name}
            </h3>
            <span className="text-[10px] text-[#69766D] font-mono block">
              {product.packSize} • Extruded Multi-Millet Puffs
            </span>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-[#C5F82A] text-[#111F15] border-2 border-[#111F15] flex items-center justify-center font-black text-sm shrink-0 shadow-sm ml-2">
          {product.grade}
        </div>
      </div>

      {/* Dark Animated Status Bar */}
      <div className="bg-[#0F2E1B] text-white p-3 rounded-2xl border-2 border-[#111F15] flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#005128] border border-[#C5F82A] flex items-center justify-center shrink-0">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-[#C5F82A] border-t-transparent animate-spin" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-[#C5F82A] font-extrabold uppercase">
              AI SYNTHESIS IN-SITU
            </span>
            <span className="text-[8px] bg-white/20 px-1 py-0.2 rounded text-white font-mono">
              ZERO LATENCY
            </span>
          </div>
          <p className="text-xs font-bold font-['Plus_Jakarta_Sans'] text-white/90">
            Synthesizing ICMR-NIN Guidelines & Molecular Safety Data...
          </p>
        </div>
      </div>

      {/* Section 01: THE BIG PICTURE */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#C5F82A] text-[#111F15] border border-[#111F15] flex items-center justify-center text-xs font-black">
              01
            </span>
            <h2 className="text-sm font-black font-['Plus_Jakarta_Sans'] uppercase tracking-tight">
              THE BIG PICTURE
            </h2>
          </div>
          <span className="text-[9px] font-mono text-[#69766D] uppercase">
            CORE VERDICT
          </span>
        </div>

        <p className="text-xs text-[#404940] dark:text-[#9BAA9E] leading-relaxed">
          While marketed under the wholesome banner of <span className="font-bold text-[#111F15] dark:text-white">seven ancient millets</span> (ragi, jowar, bajra, foxtail, barnyard, kodo, proso), <span className="font-bold text-[#111F15] dark:text-white">industrial high-heat puffing fractures native seed structures into fast-digesting starch matrices</span>. In typical Indian retail snacks, this processing method yields an elevated glycemic index comparable to white rice, despite the <span className="font-bold text-[#111F15] dark:text-white">superior micronutrient base</span>.
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="px-2.5 py-1 rounded-full bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/30 text-[10px] font-bold text-[#005128] dark:text-[#C5F82A]">
            ⚡ 90% Ancient Grains Blend
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/30 text-[10px] font-bold text-[#005128] dark:text-[#C5F82A]">
            ⚡ Ultra-Extruded Puffs
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/30 text-[10px] font-bold text-[#005128] dark:text-[#C5F82A]">
            ⚡ Moderate Satiety Index
          </span>
        </div>
      </section>

      {/* Section 02: WHY THIS GRADE? */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#C5F82A] text-[#111F15] border border-[#111F15] flex items-center justify-center text-xs font-black">
              02
            </span>
            <h2 className="text-sm font-black font-['Plus_Jakarta_Sans'] uppercase tracking-tight">
              WHY THIS GRADE? (BACKEND TRANSPARENCY)
            </h2>
          </div>
          <span className="text-[9px] font-mono text-[#111F15] bg-[#C5F82A] px-1.5 py-0.5 rounded border border-[#111F15]">
            A → B ADJUSTMENT
          </span>
        </div>

        <p className="text-xs text-[#404940] dark:text-[#9BAA9E] leading-relaxed">
          NutriBite entered the matrix with a potential <span className="font-bold">Grade A</span> profile due to zero artificial colorants, no high-fructose corn syrup, and 8.2g of dietary fiber per 100g. However, <span className="font-bold text-[#B91C1C]">two deterministic thresholds</span> lowered its benchmark to <span className="font-bold">Grade B</span>:
        </p>

        <div className="space-y-2 pt-1">
          {/* Sodium card */}
          <div className="p-3 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#111F15]/20 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-[10px] text-[#69766D]">SODIUM IMPACT</span>
              <span className="font-mono font-bold text-[#B91C1C] text-xs">280mg / 100g</span>
            </div>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              Exceeds ICMR daily safe allocation benchmark for convenience dry snacks by 15%.
            </p>
          </div>

          {/* Oil formulation card */}
          <div className="p-3 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#111F15]/20 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-[10px] text-[#69766D]">OIL FORMULATION</span>
              <span className="font-mono font-bold text-xs">Refined Fractionated</span>
            </div>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              Absence of cold-pressed lipids shifts fatty-acid balance toward 41% saturated profile.
            </p>
          </div>
        </div>
      </section>

      {/* Section 03: WHY IS PALM OIL USED HERE? */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#C5F82A] text-[#111F15] border border-[#111F15] flex items-center justify-center text-xs font-black">
              03
            </span>
            <h2 className="text-sm font-black font-['Plus_Jakarta_Sans'] uppercase tracking-tight">
              WHY IS PALM OIL USED HERE?
            </h2>
          </div>
          <span className="text-[9px] font-mono text-[#69766D] uppercase">
            NEUTRAL DEEP DIVE
          </span>
        </div>

        <p className="text-xs text-[#404940] dark:text-[#9BAA9E] leading-relaxed">
          Industrial seasoning sprays require a carrier fat with a high smoke point (235°C) and robust resistance to oxidative rancidity in tropical shelf environments. Palm olein acts as a shelf-stable binder preventing seasoning dropout during monsoon humidity. While industrially superior for preventing staleness without artificial preservatives (BHA/BHT), its high palmitic acid load (44%) warrants portion discretion for cardiovascular wellness.
        </p>

        <div className="p-2.5 rounded-xl bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/15 text-[10px] text-[#005128] dark:text-[#C5F82A] font-medium flex items-center gap-2">
          <span>🏭</span>
          <span>Engineering Trade-Off: Prevents chemical antioxidants from entering the pack, but delivers elevated saturated fatty acid density.</span>
        </div>
      </section>

      {/* Section 04: SCIENTIFIC SOURCES & REGULATIONS */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#C5F82A] text-[#111F15] border border-[#111F15] flex items-center justify-center text-xs font-black">
              04
            </span>
            <h2 className="text-sm font-black font-['Plus_Jakarta_Sans'] uppercase tracking-tight">
              SCIENTIFIC SOURCES & REGULATIONS
            </h2>
          </div>
          <span className="text-[9px] font-mono text-[#69766D] uppercase">
            STATUTORY AUDIT
          </span>
        </div>

        <div className="space-y-2 pt-1">
          <div className="p-3 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#111F15]/20 flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-[#005128] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black">FSSAI Packaging & Labelling Regs</h4>
              <p className="text-[10px] text-[#69766D] mt-0.5">
                Compliant on trans-fat declarations (&lt;0.2% per serving meets "zero trans fat" regulatory ceiling).
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#111F15]/20 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#005128] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black">ICMR-NIN 2024 Dietary Guidelines</h4>
              <p className="text-[10px] text-[#69766D] mt-0.5">
                Flags ultra-extrusion processing. Suggests restricting total added sodium to &lt;2000mg/day across all daily meal intake.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Prompt Buttons (Stitch Screen 4) */}
      <section className="space-y-2 pt-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#69766D] dark:text-[#9BAA9E] flex items-center gap-1 font-mono">
          <span>◎</span> TAP TO EXPLORE DEEPER
        </span>

        <div className="space-y-1.5">
          <button
            onClick={() => handleSendPrompt('Why is palm oil used here?')}
            className="w-full py-2 px-3.5 rounded-2xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] text-left text-xs font-bold flex items-center justify-between shadow-[2px_2px_0px_#111F15] active:translate-y-[1px] active:shadow-none transition-all"
          >
            <span>Why is palm oil used here?</span>
            <span>→</span>
          </button>

          <button
            onClick={() => handleSendPrompt('Is this safe for diabetics?')}
            className="w-full py-2 px-3.5 rounded-2xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] text-left text-xs font-bold flex items-center justify-between shadow-[2px_2px_0px_#111F15] active:translate-y-[1px] active:shadow-none transition-all"
          >
            <span>Is this safe for diabetics?</span>
            <span>→</span>
          </button>

          <button
            onClick={() => handleSendPrompt('Explain this product in simple Hindi')}
            className="w-full py-2 px-3.5 rounded-2xl bg-[#C5F82A] text-[#111F15] border-2 border-[#111F15] text-left text-xs font-black flex items-center justify-between shadow-[2px_2px_0px_#111F15] active:translate-y-[1px] active:shadow-none transition-all"
          >
            <span>Explain in हिन्दी (सरल भाषा)</span>
            <span>文A</span>
          </button>

          <button
            onClick={() => handleSendPrompt('Suggest Grade A clean alternatives for this snack')}
            className="w-full py-2 px-3.5 rounded-2xl bg-[#5EEAD4] text-[#111F15] border-2 border-[#111F15] text-left text-xs font-black flex items-center justify-between shadow-[2px_2px_0px_#111F15] active:translate-y-[1px] active:shadow-none transition-all"
          >
            <span>Suggest Grade A alternatives</span>
            <span>🌟</span>
          </button>
        </div>
      </section>

      {/* Interactive Chat Output */}
      {messages.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#111F15]/15">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-3 rounded-2xl border-2 border-[#111F15] text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#C5F82A] text-[#111F15] font-bold ml-6'
                  : 'bg-white dark:bg-[#1A2A1F] text-[#111F15] dark:text-[#E4F5E5] mr-6'
              }`}
            >
              {m.content}
            </div>
          ))}
          {isAsking && (
            <div className="p-3 rounded-2xl bg-white dark:bg-[#1A2A1F] border border-[#111F15]/20 text-xs italic text-[#69766D]">
              Consulting ICMR nutritional literature...
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>
      )}

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (inputQuestion.trim()) {
            handleSendPrompt(inputQuestion.trim());
            setInputQuestion('');
          }
        }}
        className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15]"
      >
        <span className="text-[#69766D] pl-2 text-xs">‹</span>
        <input
          type="text"
          placeholder="Ask Gemini about this product..."
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          className="flex-1 bg-transparent px-2 text-xs font-semibold focus:outline-none"
        />
        <button
          type="submit"
          className="w-8 h-8 rounded-xl bg-[#C5F82A] border border-[#111F15] flex items-center justify-center text-[#111F15] font-bold"
        >
          ↑
        </button>
      </form>
    </div>
  );
};
