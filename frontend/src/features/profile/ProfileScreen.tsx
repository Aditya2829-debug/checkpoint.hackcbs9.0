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
  Sliders,
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useThemeStore } from '../../store/useThemeStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useUserStore } from '../../store/useUserStore';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const outletCtx = useOutletContext<{ onOpenOnboarding?: () => void }>();
  const { theme, setTheme } = useThemeStore();
  const { language, setLanguage, t } = useLanguageStore();
  const { profile, updateName } = useUserStore();

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
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#111F15]/10 dark:border-[#2D3E33]">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full border-2 border-[#111F15] dark:border-white/40 flex items-center justify-center hover:bg-[#C5F82A] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <span className="font-['Plus_Jakarta_Sans'] font-black text-sm tracking-tight block">
            {t('appName')}
          </span>
          <span className="text-[9px] font-mono text-[#69766D] dark:text-[#9BAA9E] uppercase block -mt-0.5">
            {t('profilePreferences')}
          </span>
        </div>

        <button
          onClick={() => alert(language === 'hi' ? 'प्रोफ़ाइल ID कॉपी हो गई!' : 'Profile ID Copied to Clipboard!')}
          className="px-2.5 py-1 rounded-full border border-[#111F15] text-[10px] font-black bg-white dark:bg-[#1A2A1F] flex items-center gap-1 shadow-sm cursor-pointer"
        >
          <span>{t('shareId')}</span>
        </button>
      </div>

      {/* User Info & Stats Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[3px_3px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#111F15] bg-[#EDF6EA]">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
              alt={profile.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#16A34A] border-2 border-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black font-['Plus_Jakarta_Sans']">
                {profile.name}
              </h2>
              <span className="px-1.5 py-0.2 rounded bg-[#C5F82A] text-[#111F15] text-[8px] font-black border border-[#111F15]">
                {t('proLabBadge')}
              </span>
            </div>
            <p className="text-[10px] text-[#69766D] font-mono">
              {profile.email}
            </p>
            <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/15 text-[9px] font-bold text-[#005128] dark:text-[#C5F82A]">
              <span>{t('checkpointPioneer')}</span>
            </div>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#111F15]/10">
          <div className="p-2.5 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#111F15]/15">
            <span className="text-xl font-black font-mono block">42</span>
            <span className="text-[9px] font-bold text-[#69766D] uppercase block">
              {t('productsScanned')}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/15">
            <span className="text-xl font-black font-mono text-[#005128] dark:text-[#C5F82A] block">28</span>
            <span className="text-[9px] font-bold text-[#005128] dark:text-[#C5F82A] uppercase block">
              {t('safeChoices')}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FEF2F2] dark:bg-[#3D1414] border border-[#DC2626]/20">
            <span className="text-xl font-black font-mono text-[#DC2626] block">14</span>
            <span className="text-[9px] font-bold text-[#DC2626] uppercase block">
              {t('additivesFlagged')}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#EEE7FA] dark:bg-[#251D33] border border-[#7050A8]/20">
            <span className="text-xl font-black font-mono text-[#7050A8] dark:text-[#DAD4E6] block">3</span>
            <span className="text-[9px] font-bold text-[#7050A8] dark:text-[#DAD4E6] uppercase block">
              {t('communityReports')}
            </span>
          </div>
        </div>

        {/* Re-open Onboarding Setup button */}
        {outletCtx?.onOpenOnboarding && (
          <button
            type="button"
            onClick={outletCtx.onOpenOnboarding}
            className="w-full mt-2 py-2.5 px-3 rounded-2xl border-2 border-[#111F15] bg-[#F7FAF6] dark:bg-[#1A2A1F] text-xs font-black flex items-center justify-center gap-2 hover:bg-[#C5F82A] hover:text-[#111F15] transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4 stroke-[2.5]" />
            <span>{t('editPreferences')}</span>
          </button>
        )}
      </div>

      {/* Language & Dialect */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black font-['Plus_Jakarta_Sans']">
              {t('languageDialect')}
            </h3>
            <p className="text-[10px] text-[#69766D]">
              {t('languageSub')}
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-[#C5F82A] text-[#111F15] text-[9px] font-black border border-[#111F15]">
            {t('fssaiBilingual')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setLanguage('en')}
            className={`py-2 px-3 rounded-2xl border-2 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-[#C5F82A] text-[#111F15] border-[#111F15] shadow-[2px_2px_0px_#111F15]'
                : 'bg-white dark:bg-[#15271B] border-[#111F15]/20 text-[#69766D]'
            }`}
          >
            <span>{language === 'en' ? '⦿' : '○'}</span>
            <span>{t('englishDefault')}</span>
          </button>

          <button
            onClick={() => setLanguage('hi')}
            className={`py-2 px-3 rounded-2xl border-2 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              language === 'hi'
                ? 'bg-[#C5F82A] text-[#111F15] border-[#111F15] shadow-[2px_2px_0px_#111F15]'
                : 'bg-white dark:bg-[#15271B] border-[#111F15]/20 text-[#69766D]'
            }`}
          >
            <span>{language === 'hi' ? '⦿' : '○'}</span>
            <span>{t('hindiLanguage')}</span>
          </button>
        </div>

        <p className="text-[10px] text-[#404940] dark:text-[#9BAA9E] leading-snug pt-1">
          {language === 'hi'
            ? 'Gemini AI विश्लेषण, हानिकारक रसायन और पैकेजिंग चेतावनियां आपकी चुनी हुई भाषा में प्रदर्शित होंगी।'
            : 'Gemini AI explanations, chemical watchlists, and packaging warnings will be translated into your selected language.'}
        </p>
      </section>

      {/* Appearance & Theme */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-2.5">
        <div>
          <h3 className="text-xs font-black font-['Plus_Jakarta_Sans']">
            {t('appearanceTheme')}
          </h3>
          <p className="text-[10px] text-[#69766D]">
            {t('visualModePreference')}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => setTheme('light')}
            className={`p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-white border-[#111F15] shadow-[2px_2px_0px_#111F15] text-[#111F15]'
                : 'border-[#111F15]/20 text-[#69766D]'
            }`}
          >
            <span className="text-sm block">☀️</span>
            <span className="text-[10px] font-black block mt-0.5">{t('lightMode')}</span>
            <span className="text-[8px] text-[#69766D] block font-mono">Fresh Leaf</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#111F15] border-[#C5F82A] shadow-[2px_2px_0px_#C5F82A] text-white'
                : 'border-[#111F15]/20 text-[#69766D]'
            }`}
          >
            <span className="text-sm block">🌙</span>
            <span className="text-[10px] font-black block mt-0.5">{t('darkMode')}</span>
            <span className="text-[8px] text-[#9BAA9E] block font-mono">Neo Charcoal</span>
          </button>

          <button
            onClick={() => setTheme('light')}
            className="p-2.5 rounded-2xl border border-[#111F15]/20 text-center text-[#69766D] cursor-pointer"
          >
            <span className="text-sm block">💻</span>
            <span className="text-[10px] font-black block mt-0.5">{t('systemDefault')}</span>
            <span className="text-[8px] font-mono block">OS Default</span>
          </button>
        </div>
      </section>

      {/* Scanning Guardrails */}
      <section className="p-4 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] dark:shadow-none space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black font-['Plus_Jakarta_Sans']">
              {t('scanningGuardrails')}
            </h3>
            <p className="text-[10px] text-[#69766D]">
              {t('customizedAlertTriggers')}
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#005128] dark:text-[#C5F82A]">
            {Object.values(guardrails).filter(Boolean).length} {language === 'hi' ? 'सक्रिय' : 'Active'}
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
                <h4 className="text-xs font-black">{t('strictVeg')}</h4>
                <p className="text-[9px] text-[#69766D]">{t('strictVegDesc')}</p>
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
                <h4 className="text-xs font-black">{t('flagPalmOil')}</h4>
                <p className="text-[9px] text-[#69766D]">{t('flagPalmOilDesc')}</p>
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
                <h4 className="text-xs font-black">{t('excessSugar')}</h4>
                <p className="text-[9px] text-[#69766D]">{t('excessSugarDesc')}</p>
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

          {/* Gluten Free */}
          <div
            onClick={() => toggleGuardrail('gluten')}
            className="p-3 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#111F15]/20 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base shrink-0">🌾</span>
              <div>
                <h4 className="text-xs font-black">{t('glutenFree')}</h4>
                <p className="text-[9px] text-[#69766D]">{t('glutenFreeDesc')}</p>
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

          {/* Fragrance Free */}
          <div
            onClick={() => toggleGuardrail('fragrance')}
            className="p-3 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#111F15]/20 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base shrink-0">🌸</span>
              <div>
                <h4 className="text-xs font-black">{t('fragranceFree')}</h4>
                <p className="text-[9px] text-[#69766D]">{t('fragranceFreeDesc')}</p>
              </div>
            </div>
            <div
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                guardrails.fragrance ? 'bg-[#005128]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  guardrails.fragrance ? 'translate-x-5' : ''
                }`}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
