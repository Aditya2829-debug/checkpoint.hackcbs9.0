import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  ShieldCheck,
  Globe,
  User,
  ArrowRight,
  Heart,
  Leaf,
  Flame,
} from 'lucide-react';
import { useLanguageStore, type Language } from '../../store/useLanguageStore';
import { useUserStore } from '../../store/useUserStore';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useLanguageStore();
  const { profile, updateName, toggleAllergy, toggleAdditiveToAvoid, toggleHygieneStandard } = useUserStore();

  const [name, setName] = useState(profile.name || '');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);

  // Preference selections state
  const [preferences, setPreferences] = useState({
    veg: true,
    palmOil: true,
    lowSugar: true,
    glutenFree: false,
    lowSodium: true,
    chemicalFreePad: true,
  });

  if (!isOpen) return null;

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
  };

  const togglePref = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleComplete = () => {
    if (name.trim()) {
      updateName(name.trim());
    }
    setLanguage(selectedLanguage);

    // Save guardrails to user store
    if (preferences.glutenFree && !profile.preferences.allergies.includes('Gluten')) {
      toggleAllergy('Gluten');
    }
    if (preferences.palmOil && !profile.preferences.avoidAdditives.includes('Palm Oil')) {
      toggleAdditiveToAvoid('Palm Oil');
    }
    if (preferences.chemicalFreePad && !profile.preferences.preferredHygieneStandards.includes('Total Chlorine Free (TCF)')) {
      toggleHygieneStandard('Total Chlorine Free (TCF)');
    }

    localStorage.setItem('checkpoint_onboarded', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#121F17] rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-[#111F15] dark:border-[#2D3E33] my-auto space-y-4 text-[#111F15] dark:text-[#E4F5E5] max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Welcome Header */}
        <div className="text-center space-y-1.5 pb-2 border-b border-[#111F15]/10 dark:border-[#2D3E33]">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C5F82A] text-[#111F15] border-2 border-[#111F15] shadow-[2px_2px_0px_#111F15] mb-1">
            <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-['Plus_Jakarta_Sans'] tracking-tight">
            {t('welcomeToCheckpoint')}
          </h2>
          <p className="text-xs text-[#69766D] dark:text-[#9BAA9E] max-w-xs mx-auto">
            {t('onboardingSub')}
          </p>
        </div>

        {/* 1. Language Preference */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-[#69766D] dark:text-[#9BAA9E] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#005128] dark:text-[#C5F82A]" />
            <span>{t('selectLanguage')}</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`p-3 rounded-2xl border-2 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedLanguage === 'en'
                  ? 'bg-[#C5F82A] text-[#111F15] border-[#111F15] shadow-[2px_2px_0px_#111F15]'
                  : 'bg-[#F7FAF6] dark:bg-[#1A2A1F] border-[#111F15]/20 text-[#69766D] hover:border-[#111F15]/40'
              }`}
            >
              <span className="text-base">🇬🇧</span>
              <span>English</span>
              {selectedLanguage === 'en' && <Check className="w-4 h-4 stroke-[3]" />}
            </button>

            <button
              type="button"
              onClick={() => handleLanguageChange('hi')}
              className={`p-3 rounded-2xl border-2 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedLanguage === 'hi'
                  ? 'bg-[#C5F82A] text-[#111F15] border-[#111F15] shadow-[2px_2px_0px_#111F15]'
                  : 'bg-[#F7FAF6] dark:bg-[#1A2A1F] border-[#111F15]/20 text-[#69766D] hover:border-[#111F15]/40'
              }`}
            >
              <span className="text-base">🇮🇳</span>
              <span>हिन्दी (Hindi)</span>
              {selectedLanguage === 'hi' && <Check className="w-4 h-4 stroke-[3]" />}
            </button>
          </div>
        </div>

        {/* 2. Profile Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-[#69766D] dark:text-[#9BAA9E] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#005128] dark:text-[#C5F82A]" />
            <span>{t('yourNameLabel')}</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('yourNamePlaceholder')}
            className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#111F15] dark:border-white/20 bg-[#F7FAF6] dark:bg-[#1A2A1F] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#C5F82A]"
          />
        </div>

        {/* 3. Health & Dietary Preferences */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-[#69766D] dark:text-[#9BAA9E] flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>{t('dietaryHealthPreferences')}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Vegetarian */}
            <div
              onClick={() => togglePref('veg')}
              className={`p-2.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                preferences.veg
                  ? 'bg-[#EDF6EA] dark:bg-[#172D1D] border-[#16A34A] text-[#005128] dark:text-[#C5F82A]'
                  : 'bg-[#F7FAF6] dark:bg-[#1A2A1F] border-[#111F15]/15 text-[#69766D]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-sm border-2 border-[#16A34A] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                </span>
                <span className="font-bold text-[11px]">{t('strictVeg')}</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.veg}
                readOnly
                className="w-4 h-4 accent-[#16A34A] cursor-pointer"
              />
            </div>

            {/* Avoid Palm Oil */}
            <div
              onClick={() => togglePref('palmOil')}
              className={`p-2.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                preferences.palmOil
                  ? 'bg-[#FEF2F2] dark:bg-[#2D1616] border-[#DC2626] text-[#DC2626]'
                  : 'bg-[#F7FAF6] dark:bg-[#1A2A1F] border-[#111F15]/15 text-[#69766D]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🌴</span>
                <span className="font-bold text-[11px]">{t('flagPalmOil')}</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.palmOil}
                readOnly
                className="w-4 h-4 accent-[#DC2626] cursor-pointer"
              />
            </div>

            {/* Low Sugar */}
            <div
              onClick={() => togglePref('lowSugar')}
              className={`p-2.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                preferences.lowSugar
                  ? 'bg-[#FFFBEB] dark:bg-[#2D2416] border-[#F59E0B] text-[#B45309]'
                  : 'bg-[#F7FAF6] dark:bg-[#1A2A1F] border-[#111F15]/15 text-[#69766D]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🍬</span>
                <span className="font-bold text-[11px]">{t('excessSugar')}</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.lowSugar}
                readOnly
                className="w-4 h-4 accent-[#F59E0B] cursor-pointer"
              />
            </div>

            {/* Low Sodium */}
            <div
              onClick={() => togglePref('lowSodium')}
              className={`p-2.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                preferences.lowSodium
                  ? 'bg-[#EDF6EA] dark:bg-[#172D1D] border-[#16A34A] text-[#005128] dark:text-[#C5F82A]'
                  : 'bg-[#F7FAF6] dark:bg-[#1A2A1F] border-[#111F15]/15 text-[#69766D]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🧂</span>
                <span className="font-bold text-[11px]">
                  {selectedLanguage === 'hi' ? 'कम सोडियम / नमक' : 'Low Sodium (<1500mg)'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={preferences.lowSodium}
                readOnly
                className="w-4 h-4 accent-[#16A34A] cursor-pointer"
              />
            </div>

            {/* Gluten Free */}
            <div
              onClick={() => togglePref('glutenFree')}
              className={`p-2.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                preferences.glutenFree
                  ? 'bg-[#EDF6EA] dark:bg-[#172D1D] border-[#16A34A] text-[#005128] dark:text-[#C5F82A]'
                  : 'bg-[#F7FAF6] dark:bg-[#1A2A1F] border-[#111F15]/15 text-[#69766D]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🌾</span>
                <span className="font-bold text-[11px]">{t('glutenFree')}</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.glutenFree}
                readOnly
                className="w-4 h-4 accent-[#16A34A] cursor-pointer"
              />
            </div>

            {/* Chemical-Free Pads */}
            <div
              onClick={() => togglePref('chemicalFreePad')}
              className={`p-2.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                preferences.chemicalFreePad
                  ? 'bg-[#EEE7FA] dark:bg-[#251D33] border-[#7050A8] text-[#7050A8] dark:text-[#DAD4E6]'
                  : 'bg-[#F7FAF6] dark:bg-[#1A2A1F] border-[#111F15]/15 text-[#69766D]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🌸</span>
                <span className="font-bold text-[11px]">{t('chlorineFree')}</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.chemicalFreePad}
                readOnly
                className="w-4 h-4 accent-[#7050A8] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleComplete}
            className="w-full py-3.5 rounded-2xl bg-[#C5F82A] text-[#111F15] font-['Plus_Jakarta_Sans'] font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[#111F15] shadow-[3px_3px_0px_#111F15] hover:bg-[#d5ff4f] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t('saveAndStart')}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
