import React, { useState } from 'react';
import {
  Download,
  ShieldCheck,
  Zap,
  Flame,
  Sparkles,
  Camera,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Smartphone,
  Globe,
  Heart,
  QrCode,
  Layers,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'biscuit' | 'pad' | 'photo'>('biscuit');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="grid-bg min-h-screen flex flex-col selection:bg-[#C5F82A] selection:text-[#111F15]">
      
      {/* ── Top Announcement Banner ── */}
      <div className="bg-[#111F15] text-white px-4 py-2 text-xs font-bold text-center border-b border-black flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#C5F82A] animate-ping" />
        <span>CHECKPOINT v1.0 ANDROID RELEASE • 880+ VERIFIED INDIAN SUPERMARKET PRODUCTS • 100% FREE & OPEN</span>
      </div>

      {/* ── Header / Navigation ── */}
      <header className="sticky top-0 z-40 bg-[#F7FAF6]/90 backdrop-blur-md border-b-2 border-[#111F15]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] overflow-hidden group-hover:rotate-6 transition-transform bg-[#0A1A10]">
              <img src="/favicon.png" alt="CheckPoint Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight block leading-none font-sans">
                CheckPoint<span className="text-[#005128]">!!</span>
              </span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#69766D] uppercase block mt-0.5">
                HONEST PRODUCT INTEL
              </span>
            </div>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
            <a href="#features" className="hover:text-[#005128] transition-colors">Features</a>
            <a href="#preview" className="hover:text-[#005128] transition-colors">Live Preview</a>
            <a href="#how-to-install" className="hover:text-[#005128] transition-colors">How to Install</a>
            <a href="#faq" className="hover:text-[#005128] transition-colors">FAQ</a>
          </nav>

          {/* Quick CTA */}
          <div className="flex items-center gap-3">
            <a
              href="/downloads/checkpoint-v1.0.apk"
              download="checkpoint-v1.0.apk"
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#C5F82A] hover:bg-[#D7FF63] text-[#111F15] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none text-xs sm:text-sm font-black transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>Download APK</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1">
        
        {/* ── HERO SECTION ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Release Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#005128] text-[#C5F82A] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] text-xs font-black tracking-wide uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Official Android APK • Version 1.0 • ~5.7 MB Ultra-Light</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-[1.08] tracking-tight text-[#111F15]">
                Know What You're Eating.
                <span className="block mt-1 sm:mt-2 bg-[#C5F82A] text-[#111F15] px-3 py-1 rounded-2xl border-2 border-[#111F15] shadow-[4px_4px_0px_#111F15] inline-block">
                  Before You Pay.
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-[#404940] leading-relaxed max-w-xl font-medium">
                Scan any packaged food, biscuit, snack, beverage, or sanitary pad in Indian supermarkets.
                Instantly uncover hidden <strong>palm oil</strong>, excess free sugars, chemical preservatives, and chlorine-bleached pad fibers.
              </p>

              {/* Quick Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-lg pt-1">
                <div className="p-2.5 rounded-xl bg-white border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] text-xs font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#005128]" />
                  <span>Sub-10ms Barcode Lookups</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] text-xs font-bold flex items-center gap-2">
                  <span className="text-base">🌴</span>
                  <span>Palm Oil Penalty Engine</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] text-xs font-bold flex items-center gap-2">
                  <span className="text-base">🌸</span>
                  <span>IS:5405 Pad Safety Lab</span>
                </div>
              </div>

              {/* Big Download Box */}
              <div className="pt-2 p-5 sm:p-6 rounded-3xl bg-white border-3 border-[#111F15] shadow-[6px_6px_0px_#111F15] space-y-4 max-w-xl">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href="/downloads/checkpoint-v1.0.apk"
                    download="checkpoint-v1.0.apk"
                    className="flex-1 py-4 px-6 rounded-2xl bg-[#C5F82A] hover:bg-[#D7FF63] active:translate-y-1 text-[#111F15] font-black text-base sm:text-lg border-2 border-[#111F15] shadow-[4px_4px_0px_#111F15] hover:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer group text-center"
                  >
                    <Download className="w-6 h-6 stroke-[3] group-hover:scale-110 transition-transform shrink-0" />
                    <span>Download Android APK (v1.0)</span>
                  </a>
                </div>

                {/* Package metadata */}
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#69766D] pt-1 border-t border-[#111F15]/10">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                    Package: <code>checkpoint-v1.0.apk</code>
                  </span>
                  <span>Size: ~5.7 MB (Ultra-Lightweight)</span>
                  <span>Android 8.0+</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#69766D] pt-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> ~5.7 MB Ultra-Lightweight
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> Zero Advertisements
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> 100% Free & Open Source
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> English & हिन्दी Bilingual
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Phone Mockup */}
            <div id="preview" className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[320px] sm:max-w-[340px]">
                
                {/* Mode Selector Tabs above Phone */}
                <div className="flex items-center justify-center gap-1 mb-3 bg-white p-1 rounded-2xl border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] text-[11px] font-black">
                  <button
                    onClick={() => setActiveTab('biscuit')}
                    className={`px-2.5 py-1 rounded-xl transition-all ${
                      activeTab === 'biscuit'
                        ? 'bg-[#C5F82A] text-[#111F15]'
                        : 'text-[#69766D] hover:text-[#111F15]'
                    }`}
                  >
                    🍪 Food
                  </button>
                  <button
                    onClick={() => setActiveTab('pad')}
                    className={`px-2.5 py-1 rounded-xl transition-all ${
                      activeTab === 'pad'
                        ? 'bg-[#C5F82A] text-[#111F15]'
                        : 'text-[#69766D] hover:text-[#111F15]'
                    }`}
                  >
                    🌸 Pads
                  </button>
                  <button
                    onClick={() => setActiveTab('photo')}
                    className={`px-2.5 py-1 rounded-xl transition-all ${
                      activeTab === 'photo'
                        ? 'bg-[#C5F82A] text-[#111F15]'
                        : 'text-[#69766D] hover:text-[#111F15]'
                    }`}
                  >
                    📸 Photo
                  </button>
                </div>

                {/* Smartphone Chassis */}
                <div className="rounded-[40px] bg-[#111F15] p-3 shadow-2xl border-4 border-[#111F15]">
                  <div className="rounded-[32px] bg-[#F7FAF6] overflow-hidden border-2 border-[#111F15] text-[#111F15] flex flex-col">
                    
                    {/* Status Bar */}
                    <div className="bg-[#005128] text-white px-5 pt-3 pb-2 flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold">9:41</span>
                      <div className="w-16 h-3 bg-black/40 rounded-full mx-auto" />
                      <span>5G 100%</span>
                    </div>

                    {/* App Navbar */}
                    <div className="bg-[#005128] text-white px-4 py-2.5 flex items-center justify-between border-b border-[#C5F82A]/30">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-[#C5F82A] text-[#111F15] font-black flex items-center justify-center text-[10px]">✓</span>
                        <span className="font-black text-xs tracking-tight">CheckPoint!!</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#C5F82A] text-[#111F15] text-[9px] font-black">EN/हिन्दी</span>
                    </div>

                    {/* Tab 1: Food / Biscuit Scan View */}
                    {activeTab === 'biscuit' && (
                      <div className="p-4 space-y-3 bg-[#F7FAF6] animate-fade-in">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#69766D]">
                          <span className="bg-[#EDF6EA] text-[#005128] px-2 py-0.5 rounded border border-[#005128]/20">
                            SUPERMARKET SCAN
                          </span>
                          <span>#8901719114251</span>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono font-black uppercase text-[#69766D]">• PARLE</span>
                          <h3 className="text-sm font-black leading-tight mt-0.5">
                            HIDE & SEEK® Choco Chip Cookies
                          </h3>
                        </div>

                        {/* Grade Box */}
                        <div className="p-3 rounded-2xl bg-gradient-to-b from-[#FEF2F2] to-[#FEE2E2] border-2 border-[#111F15] text-center space-y-1">
                          <span className="text-[9px] font-mono font-extrabold uppercase text-[#991B1B]">
                            HEALTH & SAFETY RATING
                          </span>
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-13 h-13 rounded-2xl bg-[#DC2626] text-white border-2 border-[#111F15] flex flex-col items-center justify-center shadow-[2px_2px_0px_#111F15]">
                              <span className="text-2xl font-black leading-none">E</span>
                              <span className="text-[8px] font-bold">GRADE</span>
                            </div>
                            <div className="text-left text-xs">
                              <p className="font-black text-[#991B1B]">HIGH RISK PROFILE</p>
                              <p className="text-[10px] text-[#69766D] font-mono">Score: 18/100</p>
                            </div>
                          </div>
                        </div>

                        {/* Palm Oil Banner */}
                        <div className="p-2.5 rounded-xl bg-[#FEF2F2] border border-[#DC2626] text-[11px] text-[#991B1B] font-bold flex items-center gap-2">
                          <span className="text-sm">🌴</span>
                          <span>Palm Oil Penalty Applied (-1 Grade)</span>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                          <div className="p-1.5 rounded-lg bg-white border border-[#111F15]/15">
                            <span className="text-[#69766D] block">Sugar</span>
                            <span className="font-black text-[#DC2626]">32.5g</span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-white border border-[#111F15]/15">
                            <span className="text-[#69766D] block">Sat. Fat</span>
                            <span className="font-black text-[#DC2626]">9.4g</span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-white border border-[#111F15]/15">
                            <span className="text-[#69766D] block">Calories</span>
                            <span className="font-black text-[#111F15]">479 kcal</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Pad Safety Lab View */}
                    {activeTab === 'pad' && (
                      <div className="p-4 space-y-3 bg-[#FAF5FF] animate-fade-in">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#7E22CE]">
                          <span className="bg-[#F3E8FF] px-2 py-0.5 rounded border border-[#7E22CE]/20">
                            BIS IS:5405 CERTIFIED
                          </span>
                          <span>#8908011244018</span>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono font-black uppercase text-[#7E22CE]">• NUA</span>
                          <h3 className="text-sm font-black leading-tight mt-0.5">
                            Nua Ultra Safe Organic Cotton Pads
                          </h3>
                        </div>

                        {/* Grade Box */}
                        <div className="p-3 rounded-2xl bg-gradient-to-b from-[#F0FDF4] to-[#DCFCE7] border-2 border-[#111F15] text-center space-y-1">
                          <span className="text-[9px] font-mono font-extrabold uppercase text-[#166534]">
                            HYGIENE SAFETY GRADE
                          </span>
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-13 h-13 rounded-2xl bg-[#16A34A] text-white border-2 border-[#111F15] flex flex-col items-center justify-center shadow-[2px_2px_0px_#111F15]">
                              <span className="text-2xl font-black leading-none">A</span>
                              <span className="text-[8px] font-bold">PURE</span>
                            </div>
                            <div className="text-left text-xs">
                              <p className="font-black text-[#166534]">CLEAN COTTON GRADE</p>
                              <p className="text-[10px] text-[#69766D] font-mono">Score: 96/100</p>
                            </div>
                          </div>
                        </div>

                        {/* Pad Lab Tests */}
                        <div className="space-y-1.5 text-[11px] font-bold">
                          <div className="p-2 rounded-xl bg-white border border-[#16A34A]/30 flex items-center justify-between text-[#166534]">
                            <span>🌿 100% Organic Cotton</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-[#DCFCE7] rounded">TCF CERTIFIED</span>
                          </div>
                          <div className="p-2 rounded-xl bg-white border border-[#16A34A]/30 flex items-center justify-between text-[#166534]">
                            <span>🚫 Zero Chlorine & Dioxins</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-[#DCFCE7] rounded">&lt;0.01ppt</span>
                          </div>
                          <div className="p-2 rounded-xl bg-white border border-[#16A34A]/30 flex items-center justify-between text-[#166534]">
                            <span>🌸 Zero Synthetic Perfumes</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-[#DCFCE7] rounded">HYPOALLERGENIC</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab 3: Photo Label OCR Scan */}
                    {activeTab === 'photo' && (
                      <div className="p-4 space-y-3 bg-[#F0FDF4] animate-fade-in">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#005128]">
                          <span className="bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#005128]/20">
                            PHOTO LABEL SCAN
                          </span>
                          <span>ARTISANAL SNACK</span>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono font-black uppercase text-[#005128]">• LOCAL BAKERY</span>
                          <h3 className="text-sm font-black leading-tight mt-0.5">
                            Handmade Wheat Mathri
                          </h3>
                        </div>

                        <div className="p-3 rounded-2xl bg-white border-2 border-[#111F15] text-xs space-y-2">
                          <p className="font-mono text-[10px] font-black uppercase text-[#005128]">
                            Extracted Ingredients via Photo:
                          </p>
                          <p className="text-[11px] text-[#404940] leading-snug">
                            Wheat Flour (Atta), Cold Pressed Mustard Oil, Cumin Seeds, Ajwain, Black Pepper, Rock Salt.
                          </p>
                          <div className="pt-1 flex items-center gap-1.5 text-[10px] font-black text-[#16A34A]">
                            <span>✓ Zero Palm Oil</span>
                            <span>•</span>
                            <span>✓ Zero Artificial Flavors</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#DCFCE7] border border-[#16A34A] text-center text-xs font-black text-[#166534]">
                          GRADE A • EXCELLENT NATURAL PROFILE
                        </div>
                      </div>
                    )}

                    {/* Phone Bottom Nav */}
                    <div className="bg-white p-2.5 border-t border-[#111F15]/15 flex items-center justify-around text-[10px] font-bold text-[#69766D]">
                      <span className="text-[#005128]">🏠 Home</span>
                      <span>🔍 Explore</span>
                      <span>📜 History</span>
                      <span>👤 Profile</span>
                    </div>

                  </div>
                </div>

                {/* Floating Pill: FSSAI Verified */}
                <div className="absolute -top-3 -right-4 bg-[#C5F82A] px-3 py-1.5 rounded-xl border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] text-xs font-black text-[#111F15]">
                  ✓ FSSAI & BIS Verified
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ── QR CODE SECTION (MOBILE DIRECT INSTALL) ── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="p-6 sm:p-10 rounded-3xl bg-[#005128] text-white border-3 border-[#111F15] shadow-[6px_6px_0px_#111F15] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left flex-1">
              <span className="px-3 py-1 rounded-full bg-[#C5F82A] text-[#111F15] text-xs font-black uppercase tracking-wider inline-block">
                SCAN ON YOUR PHONE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Want to Install Directly on Your Phone?
              </h2>
              <p className="text-sm text-white/80 leading-relaxed max-w-md">
                Scan this QR code with your smartphone camera to immediately trigger the APK download directly on your Android device.
              </p>
              <div className="pt-2">
                <a
                  href="/downloads/checkpoint-v1.0.apk"
                  download="checkpoint-v1.0.apk"
                  className="inline-flex items-center gap-2 text-xs font-black font-mono text-[#C5F82A] hover:underline"
                >
                  Direct Download Link: <code>checkpoint-v1.0.apk</code> →
                </a>
              </div>
            </div>

            {/* Scannable SVG QR Code */}
            <div className="p-4 bg-white rounded-2xl border-2 border-[#111F15] shadow-[4px_4px_0px_#111F15] flex flex-col items-center shrink-0">
              <svg className="w-36 h-36" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#FFFFFF" />
                <rect x="10" y="10" width="24" height="24" fill="#005128" />
                <rect x="14" y="14" width="16" height="16" fill="#FFFFFF" />
                <rect x="18" y="18" width="8" height="8" fill="#005128" />

                <rect x="66" y="10" width="24" height="24" fill="#005128" />
                <rect x="70" y="14" width="16" height="16" fill="#FFFFFF" />
                <rect x="74" y="18" width="8" height="8" fill="#005128" />

                <rect x="10" y="66" width="24" height="24" fill="#005128" />
                <rect x="14" y="70" width="16" height="16" fill="#FFFFFF" />
                <rect x="18" y="74" width="8" height="8" fill="#005128" />

                <rect x="40" y="12" width="6" height="6" fill="#111F15" />
                <rect x="52" y="14" width="6" height="6" fill="#111F15" />
                <rect x="44" y="24" width="6" height="6" fill="#111F15" />
                <rect x="40" y="38" width="6" height="6" fill="#111F15" />
                <rect x="24" y="44" width="6" height="6" fill="#111F15" />
                <rect x="14" y="52" width="6" height="6" fill="#111F15" />
                <rect x="56" y="44" width="6" height="6" fill="#111F15" />
                <rect x="72" y="42" width="6" height="6" fill="#111F15" />
                <rect x="84" y="52" width="6" height="6" fill="#111F15" />
                <rect x="48" y="66" width="6" height="6" fill="#111F15" />
                <rect x="60" y="70" width="6" height="6" fill="#111F15" />
                <rect x="80" y="74" width="6" height="6" fill="#111F15" />
                <rect x="52" y="82" width="6" height="6" fill="#111F15" />
                <rect x="70" y="84" width="6" height="6" fill="#111F15" />

                <circle cx="50" cy="50" r="10" fill="#C5F82A" stroke="#111F15" strokeWidth="2" />
                <text x="50" y="54" fontSize="10" fontWeight="900" textAnchor="middle" fill="#111F15">✓</text>
              </svg>
              <span className="text-[10px] font-black font-mono text-[#111F15] mt-2 uppercase tracking-wider">
                SCAN TO DOWNLOAD
              </span>
            </div>
          </div>
        </section>

        {/* ── FEATURES GRID ── */}
        <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t-2 border-[#111F15]/10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-[#C5F82A] text-[#111F15] border-2 border-[#111F15] text-xs font-black uppercase tracking-wider">
              UNFILTERED TRANSPARENCY
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Everything Manufacturers Hide on Back Labels.
            </h2>
            <p className="text-sm text-[#404940]">
              Standard rating algorithms built strictly on official FSSAI and BIS standards. No corporate sponsorships. No AI hallucinated grades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-white border-3 border-[#111F15] shadow-[4px_4px_0px_#111F15] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C5F82A] text-[#111F15] border-2 border-[#111F15] flex items-center justify-center text-xl font-black shadow-[2px_2px_0px_#111F15]">
                ⚡
              </div>
              <h3 className="text-lg font-black">0-Latency Barcode Engine</h3>
              <p className="text-xs text-[#404940] leading-relaxed">
                Over 880+ popular Indian supermarket FMCG products pre-indexed in MongoDB for instant, sub-second scanning in grocery store aisles.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-white border-3 border-[#111F15] shadow-[4px_4px_0px_#111F15] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] text-[#DC2626] border-2 border-[#111F15] flex items-center justify-center text-xl font-black shadow-[2px_2px_0px_#111F15]">
                🌴
              </div>
              <h3 className="text-lg font-black">Automated Palm Oil Penalty</h3>
              <p className="text-xs text-[#404940] leading-relaxed">
                Refined palm oil contains ~45% saturated palmitic acid. CheckPoint automatically applies an unavoidable 1-grade downgrade on any product containing palm olein.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-white border-3 border-[#111F15] shadow-[4px_4px_0px_#111F15] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] text-[#9333EA] border-2 border-[#111F15] flex items-center justify-center text-xl font-black shadow-[2px_2px_0px_#111F15]">
                🌸
              </div>
              <h3 className="text-lg font-black">Sanitary Pad Safety Lab</h3>
              <p className="text-xs text-[#404940] leading-relaxed">
                Evaluates sanitary pads against BIS IS:5405. Detects chlorine-bleached wood pulp, toxic dioxin residues, synthetic perfumes, and plastic content percentages.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-white border-3 border-[#111F15] shadow-[4px_4px_0px_#111F15] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0284C7] border-2 border-[#111F15] flex items-center justify-center text-xl font-black shadow-[2px_2px_0px_#111F15]">
                📸
              </div>
              <h3 className="text-lg font-black">Photo Label Vision Scan</h3>
              <p className="text-xs text-[#404940] leading-relaxed">
                Found an unlisted bakery snack or artisanal food without an indexed barcode? Snap a photo of the ingredient list to immediately extract and grade safety.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-3xl bg-white border-3 border-[#111F15] shadow-[4px_4px_0px_#111F15] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EDF6EA] text-[#005128] border-2 border-[#111F15] flex items-center justify-center text-xl font-black shadow-[2px_2px_0px_#111F15]">
                🇮🇳
              </div>
              <h3 className="text-lg font-black">100% English & हिन्दी</h3>
              <p className="text-xs text-[#404940] leading-relaxed">
                Switch between English and complete native Hindi with a single tap. All rating reasons, health warnings, and nutrients are fully translated for everyone.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-3xl bg-white border-3 border-[#111F15] shadow-[4px_4px_0px_#111F15] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] border-2 border-[#111F15] flex items-center justify-center text-xl font-black shadow-[2px_2px_0px_#111F15]">
                💬
              </div>
              <h3 className="text-lg font-black">Health & Nutrition AI</h3>
              <p className="text-xs text-[#404940] leading-relaxed">
                Ask any question about a product: "Is this safe for diabetics?", "What are healthier alternatives for children?", or "Why did it get Grade D?".
              </p>
            </div>
          </div>
        </section>

        {/* ── HOW TO INSTALL (3 STEPS) ── */}
        <section id="how-to-install" className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10 space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#111F15] text-[#C5F82A] text-xs font-mono font-bold uppercase">
              EASY 3-STEP SETUP
            </span>
            <h2 className="text-3xl font-black">How to Install CheckPoint on Android</h2>
            <p className="text-sm text-[#404940]">Takes less than 30 seconds. No registration required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border-2 border-[#111F15] shadow-[4px_4px_0px_#111F15] space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#C5F82A] text-[#111F15] font-black flex items-center justify-center border border-[#111F15]">
                1
              </div>
              <h3 className="text-base font-black">Download the APK</h3>
              <p className="text-xs text-[#404940] leading-relaxed">
                Tap the <strong>Download APK</strong> button. If your browser asks "File might be harmful", tap <em>Download anyway</em>.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border-2 border-[#111F15] shadow-[4px_4px_0px_#111F15] space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#C5F82A] text-[#111F15] font-black flex items-center justify-center border border-[#111F15]">
                2
              </div>
              <h3 className="text-base font-black">Allow Unknown Apps</h3>
              <p className="text-xs text-[#404940] leading-relaxed">
                Open the downloaded file from notifications. If prompted, tap <em>Settings</em> and toggle <em>Allow from this source</em>.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border-2 border-[#111F15] shadow-[4px_4px_0px_#111F15] space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#C5F82A] text-[#111F15] font-black flex items-center justify-center border border-[#111F15]">
                3
              </div>
              <h3 className="text-base font-black">Install & Start Scanning</h3>
              <p className="text-xs text-[#404940] leading-relaxed">
                Tap <strong>Install</strong>. Once done, open CheckPoint!! and point your camera at any food or pad barcode!
              </p>
            </div>
          </div>

          <div className="text-center pt-8">
            <a
              href="/downloads/checkpoint-v1.0.apk"
              download="checkpoint-v1.0.apk"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#005128] hover:bg-[#0E7A40] text-[#C5F82A] font-black text-sm border-2 border-[#111F15] shadow-[4px_4px_0px_#111F15] hover:shadow-none transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>Download CheckPoint APK (~5.7 MB Ultra-Light)</span>
            </a>
          </div>
        </section>

        {/* ── FAQ SECTION (ACCORDION) ── */}
        <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-16 border-t-2 border-[#111F15]/10">
          <div className="text-center mb-10 space-y-1">
            <h2 className="text-3xl font-black">Frequently Asked Questions</h2>
            <p className="text-sm text-[#404940]">Everything you need to know about CheckPoint!!</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How large is the app download?',
                a: 'The APK is exceptionally lightweight at only ~5.7 MB! It downloads in 2-3 seconds even on 3G/4G connections and occupies minimal device storage without bloating your phone.',
              },
              {
                q: 'Why download an APK instead of Google Play Store?',
                a: 'Google Play requires a mandatory 14-day closed testing period with 20 registered testers for new developer accounts. Direct APK distribution allows immediate installation and evaluation for hackathon evaluators and everyday shoppers without artificial waiting periods.',
              },
              {
                q: 'Is this APK safe for my Android phone?',
                a: 'Yes, 100%! CheckPoint is completely open source, has zero trackers, zero advertisements, and asks solely for camera permission to scan barcodes and photograph ingredient labels.',
              },
              {
                q: 'How is the Health Grade calculated?',
                a: 'Grades (A through E) are determined via deterministic Nutri-Score standards, penalizing excessive saturated fat, free sugars, sodium, and high calorie density. Products containing palm oil or palmolein receive an automatic 1-grade downgrade.',
              },
              {
                q: 'Does it work offline in grocery store basements?',
                a: 'Yes! Over 880+ popular Indian FMCG products and rating algorithms are cached locally, allowing offline sub-second scanning even in supermarket basements with weak cell reception.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                onClick={() => toggleFaq(idx)}
                className="p-4 rounded-2xl bg-white border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-black text-sm text-[#111F15]">{faq.q}</h3>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-[#005128]' : 'text-[#69766D]'
                    }`}
                  />
                </div>
                {openFaq === idx && (
                  <p className="text-xs text-[#404940] mt-2 pt-2 border-t border-[#111F15]/10 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#111F15] text-white border-t-2 border-black py-10 px-4 sm:px-6 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#C5F82A] text-[#111F15] font-black flex items-center justify-center text-xs">✓</span>
              <span className="font-black text-lg text-white">CheckPoint!!</span>
            </div>
            <p className="text-xs text-white/60">
              Independent Food & Sanitary Care Safety Benchmark Engine for India.
            </p>
          </div>

          <div className="text-xs font-mono text-white/70 space-y-1">
            <p>Built strictly to FSSAI & BIS Regulatory Standards</p>
            <p>© 2026 CheckPoint Team • HackCBS 9.0</p>
          </div>

          <div>
            <a
              href="/downloads/checkpoint-v1.0.apk"
              download="checkpoint-v1.0.apk"
              className="px-4 py-2 rounded-xl bg-[#C5F82A] text-[#111F15] font-black text-xs border border-white hover:bg-white transition-colors inline-block"
            >
              Download APK v1.0
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
