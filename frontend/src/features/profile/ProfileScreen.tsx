import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  AlertTriangle,
  Lock,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/useThemeStore';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();

  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [guardrails, setGuardrails] = useState({
    veg: true,
    palmOil: true,
    sugar: true,
    fragrance: true,
    gluten: false,
  });

  const toggleGuardrail = (key: keyof typeof guardrails) => {
    setGuardrails((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4 px-4 pt-3 pb-8 animate-fade-in text-[#111F15] dark:text-[#E4F5E5]">
      {/* Top Header Bar matching Stitch Screen 5 */}
      <div className="flex items-center justify-between pb-2 border-b border-[#111F15]/10 dark:border-[#2D3E33]">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full border-2 border-[#111F15] dark:border-white/40 flex items-center justify-center hover:bg-[#C5F82A]"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <span className="font-['Plus_Jakarta_Sans'] font-black text-sm tracking-tight block">
            CheckPoint!!
          </span>
          <span className="text-[9px] font-mono text-[#69766D] dark:text-[#9BAA9E] uppercase block -mt-0.5">
            PROFILE & PREFERENCES
          </span>
        </div>

        <button
          onClick={() => alert('Profile ID Copied to Clipboard!')}
          className="px-2.5 py-1 rounded-full border border-[#111F15] text-[10px] font-black bg-white dark:bg-[#1A2A1F] flex items-center gap-1 shadow-sm"
        >
          <span>Share ID</span>
        </button>
      </div>

      {/* User Info & Stats Card (Stitch Screen 5) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[3px_3px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#111F15] bg-[#EDF6EA]">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
              alt="Ananya Sharma"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#16A34A] border-2 border-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black font-['Plus_Jakarta_Sans']">
                Ananya Sharma
              </h2>
              <span className="px-1.5 py-0.2 rounded bg-[#C5F82A] text-[#111F15] text-[8px] font-black border border-[#111F15]">
                PRO LAB
              </span>
            </div>
            <p className="text-[10px] text-[#69766D] font-mono">
              ananya.s@consumer-intel.in
            </p>
            <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/15 text-[9px] font-bold text-[#005128] dark:text-[#C5F82A]">
              <span>🛡 CheckPoint!! Pioneer • Active Member</span>
            </div>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#111F15]/10">
          <div className="p-2.5 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#111F15]/15">
            <span className="text-xl font-black font-mono block">42</span>
            <span className="text-[9px] font-bold text-[#69766D] uppercase block">
              Products Scanned
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/15">
            <span className="text-xl font-black font-mono text-[#005128] dark:text-[#C5F82A] block">28</span>
            <span className="text-[9px] font-bold text-[#005128] dark:text-[#C5F82A] uppercase block">
              Safe (Grade A/B) Choices
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FEF2F2] dark:bg-[#3D1414] border border-[#DC2626]/20">
            <span className="text-xl font-black font-mono text-[#DC2626] block">14</span>
            <span className="text-[9px] font-bold text-[#DC2626] uppercase block">
              Additives Flagged
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#EEE7FA] dark:bg-[#251D33] border border-[#7050A8]/20">
            <span className="text-xl font-black font-mono text-[#7050A8] dark:text-[#DAD4E6] block">3</span>
            <span className="text-[9px] font-bold text-[#7050A8] dark:text-[#DAD4E6] uppercase block">
              Community Reports
            </span>
          </div>
        </div>
      </div>

      {/* Language & Dialect (Stitch Screen 5) */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black font-['Plus_Jakarta_Sans']">
              Language & Dialect
            </h3>
            <p className="text-[10px] text-[#69766D]">
              अपनी भाषा का निर्णय अनुसार
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-[#C5F82A] text-[#111F15] text-[9px] font-black border border-[#111F15]">
            FSSAI Bilingual
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setLanguage('en')}
            className={`py-2 px-3 rounded-2xl border-2 text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              language === 'en'
                ? 'bg-[#C5F82A] text-[#111F15] border-[#111F15] shadow-[2px_2px_0px_#111F15]'
                : 'bg-white dark:bg-[#15271B] border-[#111F15]/20 text-[#69766D]'
            }`}
          >
            <span>⦿</span>
            <span>English (Default)</span>
          </button>

          <button
            onClick={() => setLanguage('hi')}
            className={`py-2 px-3 rounded-2xl border-2 text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              language === 'hi'
                ? 'bg-[#C5F82A] text-[#111F15] border-[#111F15] shadow-[2px_2px_0px_#111F15]'
                : 'bg-white dark:bg-[#15271B] border-[#111F15]/20 text-[#69766D]'
            }`}
          >
            <span>○</span>
            <span>हिन्दी (Hindi)</span>
          </button>
        </div>

        <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E] leading-snug pt-1">
          Gemini AI explanations, E-number breakdown, and packaging warnings will be dynamically translated in your selected language.
        </p>
      </section>

      {/* Appearance & Theme (Stitch Screen 5) */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-2.5">
        <div>
          <h3 className="text-xs font-black font-['Plus_Jakarta_Sans']">
            Appearance & Theme
          </h3>
          <p className="text-[10px] text-[#69766D]">
            Visual mode display preference
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => setTheme('light')}
            className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
              theme === 'light'
                ? 'bg-white border-[#111F15] shadow-[2px_2px_0px_#111F15] text-[#111F15]'
                : 'border-[#111F15]/20 text-[#69766D]'
            }`}
          >
            <span className="text-sm block">☀️</span>
            <span className="text-[10px] font-black block mt-0.5">Light Mode</span>
            <span className="text-[8px] text-[#69766D] block font-mono">Fresh Leaf</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
              theme === 'dark'
                ? 'bg-[#111F15] border-[#C5F82A] shadow-[2px_2px_0px_#C5F82A] text-white'
                : 'border-[#111F15]/20 text-[#69766D]'
            }`}
          >
            <span className="text-sm block">🌙</span>
            <span className="text-[10px] font-black block mt-0.5">Dark Mode</span>
            <span className="text-[8px] text-[#9BAA9E] block font-mono">Neo Charcoal</span>
          </button>

          <button
            onClick={() => setTheme('light')}
            className="p-2.5 rounded-2xl border border-[#111F15]/20 text-center text-[#69766D]"
          >
            <span className="text-sm block">💻</span>
            <span className="text-[10px] font-black block mt-0.5">System</span>
            <span className="text-[8px] font-mono block">OS Default</span>
          </button>
        </div>
      </section>

      {/* Scanning Guardrails (Stitch Screen 5 Toggle List) */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black font-['Plus_Jakarta_Sans']">
              Scanning Guardrails
            </h3>
            <p className="text-[10px] text-[#69766D]">
              Customized alert triggers during scan
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#005128] dark:text-[#C5F82A]">
            4 Active
          </span>
        </div>

        <div className="space-y-2 pt-1">
          {/* Strict Vegetarian */}
          <div
            onClick={() => toggleGuardrail('veg')}
            className="p-3 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#111F15]/20 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-sm border-2 border-[#16A34A] flex items-center justify-center shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
              </span>
              <div>
                <h4 className="text-xs font-black">Strict Vegetarian (Green Dot)</h4>
                <p className="text-[9px] text-[#69766D]">Flags gelatin, carmine (E120), bone char</p>
              </div>
            </div>
            <div
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                guardrails.veg ? 'bg-[#005128]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  guardrails.veg ? 'translate-x-5' : ''
                }`}
              />
            </div>
          </div>

          {/* Palm Oil */}
          <div
            onClick={() => toggleGuardrail('palmOil')}
            className="p-3 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#111F15]/20 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base shrink-0">🌴</span>
              <div>
                <h4 className="text-xs font-black">Flag Palm Oil & Refined Olein</h4>
                <p className="text-[9px] text-[#69766D]">Alerts on disguised vegetable fat derivatives</p>
              </div>
            </div>
            <div
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                guardrails.palmOil ? 'bg-[#005128]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  guardrails.palmOil ? 'translate-x-5' : ''
                }`}
              />
            </div>
          </div>

          {/* Excess Sugar */}
          <div
            onClick={() => toggleGuardrail('sugar')}
            className="p-3 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#111F15]/20 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base shrink-0">🍬</span>
              <div>
                <h4 className="text-xs font-black">Excess Sugar (&gt;10g / 100g)</h4>
                <p className="text-[9px] text-[#69766D]">ICMR-NIN recommended ceiling limits</p>
              </div>
            </div>
            <div
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                guardrails.sugar ? 'bg-[#005128]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  guardrails.sugar ? 'translate-x-5' : ''
                }`}
              />
            </div>
          </div>

          {/* No Fragrance */}
          <div
            onClick={() => toggleGuardrail('fragrance')}
            className="p-3 rounded-2xl bg-[#EEE7FA] dark:bg-[#251D33] border border-[#7050A8]/30 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base shrink-0">🌸</span>
              <div>
                <h4 className="text-xs font-black text-[#7050A8] dark:text-[#DAD4E6]">
                  No Fragrance (Sanitary & Hygiene)
                </h4>
                <p className="text-[9px] text-[#69766D]">Detects synthetic perfumes in sanitary pads</p>
              </div>
            </div>
            <div
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                guardrails.fragrance ? 'bg-[#7050A8]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  guardrails.fragrance ? 'translate-x-5' : ''
                }`}
              />
            </div>
          </div>

          {/* Gluten Sensitivity */}
          <div
            onClick={() => toggleGuardrail('gluten')}
            className="p-3 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#111F15]/20 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base shrink-0">🌾</span>
              <div>
                <h4 className="text-xs font-black">Gluten Sensitivity Alert</h4>
                <p className="text-[9px] text-[#69766D]">Wheat, malt extract & barley flags</p>
              </div>
            </div>
            <div
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                guardrails.gluten ? 'bg-[#005128]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  guardrails.gluten ? 'translate-x-5' : ''
                }`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statutory Guidelines Applied (Stitch Screen 5) */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black font-['Plus_Jakarta_Sans']">
            Statutory Guidelines Applied
          </h3>
          <span className="text-[9px] font-mono text-[#005128] dark:text-[#C5F82A] font-bold">
            Live Sync
          </span>
        </div>

        <div className="space-y-2 pt-1">
          <div className="p-2.5 rounded-2xl bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/15 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono font-bold uppercase text-[#005128]">
                FSSAI
              </span>
              <h4 className="text-xs font-black">Food Safety & Standards Authority</h4>
              <p className="text-[9px] text-[#69766D]">Nutritional Labelling & Claims Reg, 2020</p>
            </div>
            <CheckCircle2 className="w-4 h-4 text-[#005128]" />
          </div>

          <div className="p-2.5 rounded-2xl bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/15 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono font-bold uppercase text-[#005128]">
                ICMR
              </span>
              <h4 className="text-xs font-black">ICMR - NIN Dietary Guidelines 2024</h4>
              <p className="text-[9px] text-[#69766D]">Threshold benchmarks for Ultra-processed foods</p>
            </div>
            <CheckCircle2 className="w-4 h-4 text-[#005128]" />
          </div>

          <div className="p-2.5 rounded-2xl bg-[#EEE7FA] dark:bg-[#251D33] border border-[#7050A8]/20 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono font-bold uppercase text-[#7050A8]">
                BIS
              </span>
              <h4 className="text-xs font-black text-[#7050A8] dark:text-[#DAD4E6]">
                BIS IS:5405:2019 Certified
              </h4>
              <p className="text-[9px] text-[#69766D]">Sanitary Napkins Safety & Absorbency Test</p>
            </div>
            <CheckCircle2 className="w-4 h-4 text-[#7050A8]" />
          </div>
        </div>
      </section>

      {/* Data Privacy & Diagnostics (Stitch Screen 5) */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-2.5">
        <h3 className="text-xs font-black font-['Plus_Jakarta_Sans']">
          Data Privacy & Diagnostics
        </h3>

        <div className="space-y-2 pt-1">
          <div className="p-2.5 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#111F15]/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#005128]" />
              <div>
                <h4 className="text-xs font-black">On-Device OCR Privacy</h4>
                <p className="text-[9px] text-[#69766D]">Packaging text processed locally without cloud retention</p>
              </div>
            </div>
            <span className="px-1.5 py-0.2 rounded bg-[#C5F82A] text-[#111F15] text-[8px] font-black border border-[#111F15]">
              ENABLED
            </span>
          </div>

          <button
            onClick={() => alert('Report submitted to research team.')}
            className="w-full p-2.5 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#111F15]/15 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#E6AD45]" />
              <div>
                <h4 className="text-xs font-black">Report Incorrect Additive / Product</h4>
                <p className="text-[9px] text-[#69766D]">Submit barcode photo corrections to research team</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#69766D]" />
          </button>

          <button
            onClick={() => alert('Exporting scan history CSV...')}
            className="w-full p-2.5 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#111F15]/15 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-[#005128]" />
              <div>
                <h4 className="text-xs font-black">Export My Scan History (CSV/JSON)</h4>
                <p className="text-[9px] text-[#69766D]">Download all 42 ingredient grade logs</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#69766D]" />
          </button>

          <button
            onClick={() => alert('Signed out of CheckPoint!!')}
            className="w-full py-2.5 rounded-2xl border-2 border-[#DC2626] text-[#DC2626] font-['Plus_Jakarta_Sans'] font-black text-xs flex items-center justify-center gap-1.5 hover:bg-[#FEF2F2] transition-colors mt-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of CheckPoint!!</span>
          </button>
        </div>

        <p className="text-[9px] text-center text-[#69766D] font-mono pt-2">
          CheckPoint!! v2.4 (Build 2026 • Bharat Consumer Lab)
        </p>
      </section>
    </div>
  );
};
