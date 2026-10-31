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
import { useLanguageStore } from '../../store/useLanguageStore';
import type { Product } from '../../types';

export const WomenHygieneScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguageStore();
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
      <div className="py-20 text-center text-xs font-mono font-bold text-[#111F15] dark:text-[#E4F5E5]">
        {language === 'hi' ? 'स्वच्छता परीक्षण ऑडिट लोड हो रहा है...' : 'Loading Sanitary Integrity Audit...'}
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
            <span>{t('back')}</span>
          </button>
          <span className="text-xs font-mono text-[#7050A8] dark:text-[#BCA5FF] uppercase font-bold hidden sm:inline">
            {t('hygieneIntegrityLabs')}
          </span>
        </div>

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
        </div>
      </div>

      {/* Top Banner Pill */}
      <div className="space-y-1">
        <div className="bg-[#7050A8] text-white py-1.5 px-3 rounded-full text-[10px] font-black tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-sm border border-[#111F15]">
          <span>◎</span>
          <span>{language === 'hi' ? 'लेबल विश्लेषण • IS 5405 YM-10411B' : 'LABEL-BASED ANALYSIS • IS 5405 YM-10411B'}</span>
        </div>
        <p className="text-[9px] font-mono text-[#69766D] text-center">
          {language === 'hi' ? 'बैच: APK-2024-09 • एक्सपायरी: 2027' : 'Batch: APK-2024-09 • Exp: 2027'}
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
            {language === 'hi' ? '12 का पैक' : 'PACK OF 12'}
          </span>
          <div className="absolute bottom-2 left-2 right-2 bg-white/90 dark:bg-black/80 px-2 py-1 rounded-lg text-[9px] font-mono font-bold flex justify-between">
            <span>{language === 'hi' ? 'प्रकार' : 'Form Factor'}</span>
            <span>{language === 'hi' ? 'विंग्स के साथ अल्ट्रा थिन' : 'Ultra Thin with Wings'}</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-[#7050A8] dark:text-[#DAD4E6] uppercase tracking-wider block">
            {language === 'hi' ? '🌸 अंतरंग स्वच्छता एवं मासिक धर्म स्वास्थ्य' : '🌸 Intimate Hygiene & Menstrual Health'}
          </span>
          <h1 className="text-base font-black font-['Plus_Jakarta_Sans'] leading-tight mt-0.5">
            {product.name}
          </h1>
          <p className="text-xs text-[#404940] dark:text-[#9BAA9E] mt-1 leading-snug">
            {product.summary}
          </p>
        </div>
      </div>

      {/* Grade Hero Card */}
      <div className="p-4 rounded-3xl bg-[#EEE7FA] dark:bg-[#251D33] border-2 border-[#111F15] shadow-[3px_3px_0px_#111F15] dark:shadow-none space-y-3 text-center">
        <div className="flex items-center justify-between">
          <div className="w-14 h-14 rounded-2xl bg-[#5EEAD4] text-[#111F15] border-2 border-[#111F15] flex flex-col items-center justify-center font-black shadow-sm">
            <span className="text-[8px] uppercase tracking-widest leading-none">{t('nutriGrade')}</span>
            <span className="text-2xl leading-none font-['Plus_Jakarta_Sans']">A</span>
          </div>

          <div className="flex-1 text-left pl-3">
            <span className="px-2 py-0.5 rounded-full bg-[#C5F82A] text-[#111F15] text-[9px] font-black border border-[#111F15] uppercase">
              {language === 'hi' ? 'शून्य जलन पैदा करने वाले तत्व' : 'ZERO IRRITANTS'}
            </span>
            <h3 className="text-sm font-black font-['Plus_Jakarta_Sans'] mt-0.5">
              {language === 'hi' ? 'अल्ट्रा-क्लीन और सुरक्षित' : 'Ultra-Clean Profile'}
            </h3>
            <p className="text-[10px] text-[#69766D] dark:text-[#9BAA9E]">
              {language === 'hi' ? 'म्यूकोसल सुरक्षा में शीर्ष 0.5% बेंचमार्क' : 'Top 0.5% benchmark in mucosal safety'}
            </p>
          </div>
        </div>

        {/* Purity Bar */}
        <div className="bg-[#C5F82A] text-[#111F15] py-2 px-3 rounded-2xl border-2 border-[#111F15] text-xs font-black tracking-wider uppercase font-mono shadow-[2px_2px_0px_#111F15]">
          {language === 'hi' ? 'शुद्धता रेटिंग 98/100' : 'PURITY RATING 98/100'}
        </div>

        {/* Pills */}
        <div className="flex flex-wrap gap-1 justify-center pt-1">
          <span className="px-2 py-0.5 rounded-full bg-white dark:bg-[#1A2A1F] border border-[#111F15]/20 text-[9px] font-bold">
            {language === 'hi' ? 'उच्च जैव-अनुकूलता' : 'High Material Biocompatibility'}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white dark:bg-[#1A2A1F] border border-[#111F15]/20 text-[9px] font-bold">
            {language === 'hi' ? 'क्लोरीन मुक्त (TCF)' : 'Elemental Chlorine Free'}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white dark:bg-[#1A2A1F] border border-[#111F15]/20 text-[9px] font-bold">
            {language === 'hi' ? 'डाइऑक्सिन मुक्त (<0.01ppt)' : 'Dioxin Undetected'}
          </span>
        </div>
      </div>

      {/* 5-Layer Anatomical Breakdown */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black font-['Plus_Jakarta_Sans']">
            {t('anatomicalBreakdown')}
          </h2>
          <span className="text-[9px] font-mono text-[#7050A8] bg-[#EEE7FA] px-2 py-0.5 rounded-full font-bold border border-[#7050A8]/30">
            {language === 'hi' ? '100% खुलासे के साथ' : '100% DISCLOSED'}
          </span>
        </div>

        <p className="text-[10px] text-[#69766D] dark:text-[#9BAA9E] leading-tight">
          {language === 'hi'
            ? 'अंतरंग त्वचा के संपर्क से लेकर सुरक्षात्मक अवरोध तक पूरी सामग्री पारदर्शिता।'
            : 'Comprehensive transparency from intimate contact plane to protective barrier.'}
        </p>

        <div className="space-y-2.5 pt-1">
          {/* L1 */}
          <div className="p-3 rounded-2xl border-2 border-[#111F15] bg-[#F7FAF6] dark:bg-[#15271B] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-[#111F15] text-white text-[9px] font-black flex items-center justify-center font-mono">
                  L1
                </span>
                <span className="text-xs font-black font-['Plus_Jakarta_Sans']">
                  {language === 'hi' ? 'शीर्ष परत (Top Sheet)' : 'Top Sheet'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#C5F82A] text-[8px] font-black border border-[#111F15]">
                  {language === 'hi' ? 'लाभकारी' : 'BENEFICIAL'}
                </span>
              </div>
              <span className="text-[8px] font-mono uppercase bg-white px-1.5 py-0.5 rounded border border-[#111F15]/20">
                {language === 'hi' ? 'हाइपोएलर्जेनिक' : 'Hypoallergenic'}
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#111F15] dark:text-[#E4F5E5]">
              {language === 'hi' ? '100% GOTS प्रमाणित जैविक कपास' : '100% GOTS Certified Organic Cotton'}
            </h4>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              {language === 'hi'
                ? 'प्राकृतिक रूप से मुलायम, क्लोरीन-मुक्त कपास जो नमी और घर्षण को रोकता है।'
                : 'Naturally soft, elemental chlorine-free (TCF) cotton weave minimizes moisture trapping and chafing.'}
            </p>
            <div className="pt-1 flex items-center justify-between text-[9px] font-mono border-t border-[#111F15]/10">
              <span className="text-[#69766D]">{language === 'hi' ? 'त्वचा प्रतिक्रिया' : 'SKIN REACTION'}</span>
              <span className="font-bold text-[#005128] flex items-center gap-0.5">
                {language === 'hi' ? 'शून्य जलन' : 'Non-Reactive'} <Check className="w-3 h-3 stroke-[3]" />
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
                <span className="text-xs font-black font-['Plus_Jakarta_Sans']">
                  {language === 'hi' ? 'अवशोषक कोर (Absorbent Core)' : 'Absorbent Core'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#EEE7FA] text-[#7050A8] text-[8px] font-black border border-[#7050A8]">
                  {language === 'hi' ? 'अल्ट्रा-अवशोषण' : 'ULTRA-ABSORBENCY'}
                </span>
              </div>
            </div>
            <h4 className="text-xs font-bold text-[#111F15] dark:text-[#E4F5E5]">
              {language === 'hi' ? 'ECF वुड पल्प और गैर-विषैले SAP बीड्स' : 'ECF Wood Pulp & Non-toxic SAP'}
            </h4>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              {language === 'hi'
                ? 'FSC प्रमाणित सेलूलोज़ फाइबर और सुरक्षित पॉलीएक्रिलेट मोती।'
                : 'FSC certified cellulose fiber fluff coupled with encapsulated non-sensitizing sodium polyacrylate beads.'}
            </p>
            <div className="pt-1 flex items-center justify-between text-[9px] font-mono border-t border-[#111F15]/10">
              <span className="text-[#69766D]">{language === 'hi' ? 'रिसाव रोकथाम' : 'LOCK-IN RETENTION'}</span>
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
                <span className="text-xs font-black font-['Plus_Jakarta_Sans']">
                  {language === 'hi' ? 'बैकशीट सुरक्षा' : 'Backsheet Guard'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#C5F82A] text-[8px] font-black border border-[#111F15]">
                  {language === 'hi' ? 'बायोडिग्रेडेबल' : 'COMPOSTABLE'}
                </span>
              </div>
            </div>
            <h4 className="text-xs font-bold text-[#111F15] dark:text-[#E4F5E5]">
              {language === 'hi' ? 'कॉर्नस्टार्च-आधारित PLA फिल्म' : 'Cornstarch-based PLA Film'}
            </h4>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              {language === 'hi'
                ? '100% बायोडिग्रेडेबल और हवादार छिद्रित परत जो लीकेज रोकती है।'
                : '100% biodegradable & micro-perforated breathable barrier preventing leak-through while circulating air.'}
            </p>
          </div>

          {/* L5 */}
          <div className="p-3 rounded-2xl border-2 border-[#111F15] bg-[#F7FAF6] dark:bg-[#15271B] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-[#111F15] text-white text-[9px] font-black flex items-center justify-center font-mono">
                  L5
                </span>
                <span className="text-xs font-black font-['Plus_Jakarta_Sans']">
                  {language === 'hi' ? 'सुगंध / इत्र' : 'Fragrance / Deodorant'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#C5F82A] text-[8px] font-black border border-[#111F15]">
                  {language === 'hi' ? '100% सुगंध-मुक्त' : 'IDEAL SCORE'}
                </span>
              </div>
            </div>
            <h4 className="text-xs font-bold text-[#111F15] dark:text-[#E4F5E5]">
              {language === 'hi' ? 'कोई रासायनिक इत्र नहीं (100% सुरक्षित)' : 'None Disclosed (100% Fragrance-Free)'}
            </h4>
            <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E]">
              {language === 'hi'
                ? 'शून्य सिंथेटिक खुशबू; अंतरंग त्वचा पर एलर्जी और जलन के मुख्य कारण को समाप्त करता है।'
                : 'Zero synthetic masking agents or essential oils; eliminates major cause of contact vulvitis and irritation.'}
            </p>
          </div>
        </div>
      </section>

      {/* BIS Section */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-md bg-[#EEE7FA] text-[#7050A8] text-[9px] font-black border border-[#7050A8] uppercase">
            {t('bisStandards')}
          </span>
          <span className="text-[9px] font-mono text-[#69766D] uppercase">
            {language === 'hi' ? 'राष्ट्रीय मानक मान्य' : 'NATIONAL COMPL.'}
          </span>
        </div>

        <div>
          <h3 className="text-sm font-black font-['Plus_Jakarta_Sans']">
            IS 5405:2019 Certified
          </h3>
          <p className="text-[10px] text-[#69766D] dark:text-[#9BAA9E]">
            {language === 'hi'
              ? 'डिस्पोजेबल सैनिटरी सुरक्षा उत्पादों के लिए वैधानिक प्रदर्शन मानकों का अनुपालन।'
              : 'Complies with statutory performance benchmarks for disposable sanitary protection products.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 rounded-2xl bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/20">
            <span className="text-[9px] font-mono text-[#69766D] uppercase block">
              pH {language === 'hi' ? 'मान' : 'VALUE'}
            </span>
            <span className="text-base font-black font-mono">6.8 pH</span>
            <span className="text-[9px] text-[#005128] font-bold block mt-0.5">
              {language === 'hi' ? 'लक्ष्य 6.0 - 8.5 (उत्तीर्ण)' : 'Target 6.0 - 8.5 (Passed)'}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/20">
            <span className="text-[9px] font-mono text-[#69766D] uppercase block">
              {language === 'hi' ? 'अवशोषण समय' : 'ABSORBENCY TIME'}
            </span>
            <span className="text-base font-black font-mono">&lt; 3.2s</span>
            <span className="text-[9px] text-[#005128] font-bold block mt-0.5">
              {language === 'hi' ? 'IS अधिकतम: 10s (उत्तीर्ण)' : 'IS Max: 10s (Passed)'}
            </span>
          </div>
        </div>
      </section>

      {/* Gemini Sanitary Intelligence Box */}
      <div className="p-4 rounded-3xl bg-[#EEE7FA] dark:bg-[#251D33] border-2 border-[#111F15] space-y-2">
        <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-[#7050A8]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('geminiSanitaryIntel')}</span>
        </div>

        <h3 className="text-xs font-black font-['Plus_Jakarta_Sans']">
          {language === 'hi' ? 'क्लोरीन-मुक्त (TCF) कॉटन क्यों आवश्यक है?' : 'Why TCF Matters For Vulvar Skin'}
        </h3>
        <p className="text-[10px] text-[#474452] dark:text-[#DAD4E6] leading-relaxed">
          {language === 'hi'
            ? 'पूरी तरह से क्लोरीन-मुक्त (TCF) कपास डाइऑक्सिन और फ्यूरान जैसे जहरीले क्लोरीनेटेड यौगिकों के निर्माण को रोकता है। संवेदनशील त्वचा अत्यधिक पारगम्य होती है, इसलिए शुद्ध TCF एलर्जी और जलन के जोखिम को पूरी तरह समाप्त करता है।'
            : 'Totally Chlorine-Free (TCF) cotton avoids the formation of chlorinated organic compounds such as dioxins and furans. Because vaginal mucous membranes possess high vascularity and cellular permeability, pure TCF reduces chronic contact dermatitis and micro-tear vulnerability during prolonged use.'}
        </p>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => navigate(`/ai-explainer/${product.id}`)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A2A1F] border border-[#111F15] text-[10px] font-black flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <span>{language === 'hi' ? '⚡ AI से सवाल पूछें' : '文A Explain with Gemini'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
