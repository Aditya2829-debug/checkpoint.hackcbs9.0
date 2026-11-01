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
import { useLanguageStore } from '../../store/useLanguageStore';
import { ProductIllustration } from '../../components/ui/ProductIllustration';
import type { Product } from '../../types';

export const GeminiExplainerScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguageStore();

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
    const finalPrompt = language === 'hi' && !promptText.includes('हिन्दी')
      ? `${promptText} (कृपया सरल हिन्दी में समझाएं)`
      : promptText;

    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsAsking(true);

    try {
      const answer = await aiService.askQuestion(product.id, finalPrompt);
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
          content: language === 'hi' ? 'AI सर्वर से जुड़ने में समस्या हुई। कृपया पुनः प्रयास करें।' : 'Unable to connect to AI gateway. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  if (!product) {
    return (
      <div className="py-20 text-center text-xs font-mono font-bold text-[#111F15] dark:text-[#E4F5E5]">
        {language === 'hi' ? 'स्वास्थ्य विश्लेषण लोड हो रहा है...' : 'Loading Health Intelligence...'}
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pt-3 pb-8 animate-fade-in text-[#111F15] dark:text-[#E4F5E5]">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#111F15]/10 dark:border-[#2D3E33]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full border-2 border-[#111F15] dark:border-white/40 flex items-center justify-center hover:bg-[#C5F82A] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div>
            <span className="font-['Plus_Jakarta_Sans'] font-black text-sm tracking-tight block">
              {t('appName')}
            </span>
            <span className="text-[9px] font-mono text-[#69766D] dark:text-[#9BAA9E] uppercase block -mt-0.5">
              {language === 'hi' ? 'खाद्य विज्ञान सत्यापित' : 'FOOD SCI VERIFIED'}
            </span>
          </div>
        </div>

        <button
          onClick={toggleLanguage}
          className="px-2.5 py-0.5 rounded-full border border-[#111F15] text-[10px] font-black bg-[#C5F82A] text-[#111F15] cursor-pointer"
        >
          {language === 'en' ? 'EN / HI' : 'हिन्दी'}
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
              {language === 'hi' ? 'स्वास्थ्य विश्लेषण एवं मार्गदर्शन' : 'Health & Nutrition Insights'}
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-[#C5F82A] text-[#111F15] text-[9px] font-black border border-[#111F15] uppercase">
            {language === 'hi' ? 'स्वास्थ्य सहायक' : 'HEALTH AI'}
          </span>
        </div>
        <p className="text-[11px] text-[#404940] dark:text-[#9BAA9E] leading-snug">
          {language === 'hi'
            ? 'भारतीय खान-पान और ICMR-NIN पोषण मानकों पर आधारित रीयल-टाइम जैव रासायनिक विश्लेषण'
            : 'Real-time biochemical evaluation calibrated to Indian dietary patterns'}
        </p>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#005128] dark:text-[#C5F82A] pt-1">
          <span className="w-2 h-2 rounded-full bg-[#C5F82A] animate-ping" />
          {language === 'hi' ? 'सक्रिय सत्र' : 'ACTIVE SESSION'}
        </span>
      </div>

      {/* Product Strip */}
      <div className="p-3 rounded-2xl bg-[#EDF6EA] dark:bg-[#15271B] border-2 border-[#111F15] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <ProductIllustration product={product} size="xs" className="shrink-0" />
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-[#005128] font-bold block uppercase">
              {product.categoryLabel} • {product.barcode}
            </span>
            <h3 className="text-xs font-black truncate font-['Plus_Jakarta_Sans']">
              {product.name}
            </h3>
            <span className="text-[10px] text-[#69766D] font-mono block">
              {product.packSize}
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
              {language === 'hi' ? 'त्वरित AI विश्लेषण' : 'AI SYNTHESIS IN-SITU'}
            </span>
            <span className="text-[8px] bg-white/20 px-1 py-0.2 rounded text-white font-mono">
              FSSAI / ICMR
            </span>
          </div>
          <p className="text-xs font-bold font-['Plus_Jakarta_Sans'] text-white/90">
            {language === 'hi'
              ? 'ICMR-NIN पोषण दिशानिर्देशों और आणविक सुरक्षा डेटा का विश्लेषण...'
              : 'Synthesizing ICMR-NIN Guidelines & Molecular Safety Data...'}
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
              {language === 'hi' ? 'मुख्य विश्लेषण एवं निष्कर्ष' : 'THE BIG PICTURE'}
            </h2>
          </div>
          <span className="text-[9px] font-mono text-[#69766D] uppercase">
            {language === 'hi' ? 'लैब फैसला' : 'CORE VERDICT'}
          </span>
        </div>

        <p className="text-xs text-[#404940] dark:text-[#9BAA9E] leading-relaxed">
          {language === 'hi'
            ? 'विज्ञापनों में स्वस्थ होने का दावा किए जाने के बावजूद, अत्यधिक प्रसंस्करण और औद्योगिक तेल मिश्रण प्राकृतिक पोषक तत्वों के अवशोषण को प्रभावित करते हैं। उत्पाद में पोषक तत्वों का आधार तो है लेकिन अतिरिक्त वसा और सोडियम पर सतर्कता बरतने की आवश्यकता है।'
            : 'While marketed under wholesome banners, industrial processing fractures native seed structures into fast-digesting starch matrices. In typical Indian retail snacks, this processing method yields an elevated glycemic index despite a superior micronutrient base.'}
        </p>
      </section>

      {/* Suggested Prompt Buttons */}
      <section className="space-y-2 pt-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#69766D] dark:text-[#9BAA9E] flex items-center gap-1 font-mono">
          <span>◎</span> {language === 'hi' ? 'गहराई से जानने के लिए टैप करें' : 'TAP TO EXPLORE DEEPER'}
        </span>

        <div className="space-y-1.5">
          <button
            onClick={() => handleSendPrompt(language === 'hi' ? 'इस उत्पाद में पाम ऑयल क्यों इस्तेमाल किया जाता है?' : 'Why is palm oil used here?')}
            className="w-full py-2 px-3.5 rounded-2xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] text-left text-xs font-bold flex items-center justify-between shadow-[2px_2px_0px_#111F15] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <span>{language === 'hi' ? 'इस उत्पाद में पाम ऑयल क्यों है?' : 'Why is palm oil used here?'}</span>
            <span>→</span>
          </button>

          <button
            onClick={() => handleSendPrompt(language === 'hi' ? 'क्या यह डायबिटीज / मधुमेह के रोगियों के लिए सुरक्षित है?' : 'Is this safe for diabetics?')}
            className="w-full py-2 px-3.5 rounded-2xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] text-left text-xs font-bold flex items-center justify-between shadow-[2px_2px_0px_#111F15] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <span>{language === 'hi' ? 'क्या यह डायबिटीज के लिए सुरक्षित है?' : 'Is this safe for diabetics?'}</span>
            <span>→</span>
          </button>

          <button
            onClick={() => handleSendPrompt(language === 'hi' ? 'इस स्नैक के स्थान पर ग्रेड A स्वस्थ विकल्प सुझाएं' : 'Suggest Grade A clean alternatives for this snack')}
            className="w-full py-2 px-3.5 rounded-2xl bg-[#5EEAD4] text-[#111F15] border-2 border-[#111F15] text-left text-xs font-black flex items-center justify-between shadow-[2px_2px_0px_#111F15] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <span>{language === 'hi' ? 'स्वस्थ ग्रेड A विकल्प सुझाएं' : 'Suggest Grade A alternatives'}</span>
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
              {language === 'hi' ? 'ICMR और FSSAI वैज्ञानिक साहित्य से परामर्श लिया जा रहा है...' : 'Consulting ICMR nutritional literature...'}
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
          placeholder={language === 'hi' ? 'इस उत्पाद के बारे में कोई सवाल पूछें...' : 'Ask any question about this product...'}
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          className="flex-1 bg-transparent px-2 text-xs font-semibold focus:outline-none"
        />
        <button
          type="submit"
          className="w-8 h-8 rounded-xl bg-[#C5F82A] border border-[#111F15] flex items-center justify-center text-[#111F15] font-bold cursor-pointer"
        >
          ↑
        </button>
      </form>
    </div>
  );
};
