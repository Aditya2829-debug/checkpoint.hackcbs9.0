import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit3,
  Check,
  Sparkles,
  Globe,
  Heart,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguageStore, type Language } from '../../store/useLanguageStore';
import { useUserStore, type StartupPreferences } from '../../store/useUserStore';
import { OnboardingModal } from '../../components/shared/OnboardingModal';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguageStore();
  const { profile, startupPreferences, updateName, toggleStartupPreference } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.name || '');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  const displayName =
    profile.name ||
    (typeof localStorage !== 'undefined' ? localStorage.getItem('checkpoint_user_name') : '') ||
    (language === 'hi' ? 'उपयोगकर्ता' : 'User');

  const handleSave = () => {
    if (editedName.trim()) {
      updateName(editedName.trim());
    }
    setIsEditing(false);
  };

  const initial = (displayName.trim()[0] || 'U').toUpperCase();

  // Startup choices metadata
  const preferenceItems: Array<{
    key: keyof StartupPreferences;
    icon: string;
    title: { en: string; hi: string };
    desc: { en: string; hi: string };
    activeColor: string;
  }> = [
    {
      key: 'veg',
      icon: '🥬',
      title: { en: 'Strict Vegetarian', hi: 'शुद्ध शाकाहारी' },
      desc: {
        en: 'Strict vegetarian food only, no animal derivatives',
        hi: 'केवल शुद्ध शाकाहारी उत्पाद, कोई मांसाहारी अंश नहीं',
      },
      activeColor: 'border-[#16A34A] bg-[#EDF6EA] dark:bg-[#152D1A] text-[#16A34A]',
    },
    {
      key: 'palmOil',
      icon: '🌴',
      title: { en: 'Avoid Palm Oil', hi: 'पाम ऑयल से परहेज' },
      desc: {
        en: 'Flag palm oil, palmolein and fractionated vegetable fats',
        hi: 'पाम ऑयल और पामोलिन युक्त उत्पादों पर तुरंत चेतावनी',
      },
      activeColor: 'border-[#DC2626] bg-[#FEF2F2] dark:bg-[#2D1616] text-[#DC2626]',
    },
    {
      key: 'lowSugar',
      icon: '🍬',
      title: { en: 'Low Sugar Preference', hi: 'कम चीनी प्राथमिकता' },
      desc: {
        en: 'Penalize free and added sugars exceeding 10g/100g',
        hi: '10g/100g से अधिक अतिरिक्त चीनी पर चेतावनी',
      },
      activeColor: 'border-[#F59E0B] bg-[#FFFBEB] dark:bg-[#2D2416] text-[#B45309] dark:text-[#FBBF24]',
    },
    {
      key: 'lowSodium',
      icon: '🧂',
      title: { en: 'Low Sodium (<1500mg)', hi: 'कम सोडियम / नमक' },
      desc: {
        en: 'Maintain healthy sodium intake for blood pressure',
        hi: 'रक्तचाप और हृदय स्वास्थ्य के लिए कम नमक',
      },
      activeColor: 'border-[#16A34A] bg-[#EDF6EA] dark:bg-[#152D1A] text-[#16A34A]',
    },
    {
      key: 'glutenFree',
      icon: '🌾',
      title: { en: 'Gluten-Free Diet', hi: 'ग्लूटेन मुक्त आहार' },
      desc: {
        en: 'Alert on wheat, maida, barley and gluten traces',
        hi: 'गेहूं, मैदा और ग्लूटेन युक्त तत्वों पर अलर्ट',
      },
      activeColor: 'border-[#3B82F6] bg-[#EFF6FF] dark:bg-[#17253D] text-[#2563EB]',
    },
    {
      key: 'chemicalFreePad',
      icon: '🌸',
      title: { en: 'Chemical-Free Pads', hi: 'केमिकल-मुक्त पैड्स' },
      desc: {
        en: 'Total Chlorine Free (TCF) & zero synthetic fragrances',
        hi: 'क्लोरीन-मुक्त एवं सुगंध-रहित सुरक्षित सैनिटरी पैड्स',
      },
      activeColor: 'border-[#9333EA] bg-[#FAF5FF] dark:bg-[#2A173D] text-[#9333EA]',
    },
  ];

  return (
    <div className="space-y-6 px-4 pt-3 pb-12 animate-fade-in text-[#111F15] dark:text-[#E4F5E5] max-w-lg mx-auto">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#111F15]/10 dark:border-[#2D3E33]">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-[#111F15] dark:border-white/30 text-xs font-bold hover:bg-[#C5F82A] hover:text-[#111F15] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>{t('back')}</span>
        </button>

        <h1 className="font-['Plus_Jakarta_Sans'] font-black text-base tracking-tight">
          {t('profile')}
        </h1>

        <div className="w-16" />
      </div>

      {/* Profile Card: Showing Avatar, User's Name, and Language Preference */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] dark:border-[#2D3E33] shadow-[4px_4px_0px_#111F15] dark:shadow-none text-center space-y-5">
        {/* Avatar Circle with First Initial */}
        <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#C5F82A] to-[#15803D] text-[#111F15] border-3 border-[#111F15] flex items-center justify-center shadow-[3px_3px_0px_#111F15]">
          <span className="text-3xl sm:text-4xl font-black font-['Plus_Jakarta_Sans'] select-none">
            {initial}
          </span>
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#16A34A] border-2 border-white shadow-sm" />
        </div>

        {/* User Name Section */}
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/15 text-[10px] font-black uppercase tracking-wider text-[#005128] dark:text-[#C5F82A]">
            <Sparkles className="w-3 h-3" />
            <span>{language === 'hi' ? 'उपयोगकर्ता प्रोफ़ाइल' : 'User Profile'}</span>
          </span>

          {isEditing ? (
            <div className="flex items-center justify-center gap-2 pt-1 max-w-xs mx-auto">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                autoFocus
                placeholder={t('yourNamePlaceholder')}
                className="w-full px-3.5 py-2 rounded-xl border-2 border-[#111F15] dark:border-white/30 text-sm font-bold bg-[#F7FAF6] dark:bg-[#15271B] focus:outline-none focus:ring-2 focus:ring-[#C5F82A]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                }}
              />
              <button
                onClick={handleSave}
                className="px-3 py-2 rounded-xl bg-[#C5F82A] text-[#111F15] border-2 border-[#111F15] font-black text-xs shadow-[2px_2px_0px_#111F15] cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 pt-0.5">
              <h2 className="text-xl sm:text-2xl font-black font-['Plus_Jakarta_Sans'] tracking-tight">
                {displayName}
              </h2>
              <button
                onClick={() => {
                  setEditedName(displayName);
                  setIsEditing(true);
                }}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#69766D] dark:text-[#9BAA9E] cursor-pointer transition-colors"
                title={language === 'hi' ? 'नाम बदलें' : 'Edit name'}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Language Preference Section */}
        <div className="pt-2 border-t border-[#111F15]/10 dark:border-[#2D3E33] flex items-center justify-between">
          <span className="text-xs font-bold text-[#69766D] dark:text-[#9BAA9E] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'भाषा (Language)' : 'App Language'}</span>
          </span>
          <div className="flex items-center gap-1.5 bg-[#F7FAF6] dark:bg-[#121F17] p-1 rounded-xl border border-[#111F15]/15">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-[#C5F82A] text-[#111F15] font-black shadow-sm'
                  : 'text-[#69766D] hover:text-[#111F15]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'hi'
                  ? 'bg-[#C5F82A] text-[#111F15] font-black shadow-sm'
                  : 'text-[#69766D] hover:text-[#111F15]'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Section: User's Initial Startup Selections */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-black font-['Plus_Jakarta_Sans'] tracking-tight flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#DC2626]" />
              <span>{language === 'hi' ? 'आपकी स्वास्थ्य एवं सुरक्षा प्राथमिकताएं' : 'Your Health & Safety Choices'}</span>
            </h3>
            <p className="text-[11px] text-[#69766D] dark:text-[#9BAA9E] mt-0.5">
              {language === 'hi'
                ? 'शुरुआत में चुनी गई प्राथमिकताएं। उत्पाद इन्हीं प्राथमिकताओं के अनुसार जाँचे जाते हैं।'
                : 'Selections chosen at startup. Products are evaluated against these priorities.'}
            </p>
          </div>

          <button
            onClick={() => setShowOnboardingModal(true)}
            className="text-[11px] font-bold text-[#005128] dark:text-[#C5F82A] flex items-center gap-1 hover:underline cursor-pointer"
            title={language === 'hi' ? 'सेटअप दोबारा करें' : 'Redo Setup'}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{language === 'hi' ? 'रीसेट' : 'Redo'}</span>
          </button>
        </div>

        {/* 6 Core Preferences List */}
        <div className="grid grid-cols-1 gap-2.5">
          {preferenceItems.map((item) => {
            const isEnabled = !!startupPreferences[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleStartupPreference(item.key)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isEnabled
                    ? item.activeColor + ' shadow-[2px_2px_0px_#111F15] dark:shadow-none'
                    : 'bg-white dark:bg-[#1A2A1F] border-[#111F15]/20 text-[#69766D] dark:text-[#9BAA9E]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl sm:text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black font-['Plus_Jakarta_Sans'] text-[#111F15] dark:text-[#E4F5E5] leading-tight">
                      {item.title[language]}
                    </h4>
                    <p className="text-[11px] text-[#69766D] dark:text-[#9BAA9E] mt-0.5 leading-snug">
                      {item.desc[language]}
                    </p>
                  </div>
                </div>

                {/* Status Toggle Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      isEnabled
                        ? 'bg-[#16A34A] text-white'
                        : 'bg-black/10 dark:bg-white/10 text-[#69766D] dark:text-[#9BAA9E]'
                    }`}
                  >
                    {isEnabled
                      ? language === 'hi' ? 'सक्रिय' : 'ACTIVE'
                      : language === 'hi' ? 'बंद' : 'OFF'}
                  </span>
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    readOnly
                    className="w-4 h-4 accent-[#16A34A] cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Compliance Certification Box */}
      <div className="p-4 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#111F15]/15 text-xs text-[#69766D] dark:text-[#9BAA9E] flex items-center gap-3">
        <Shield className="w-5 h-5 text-[#005128] dark:text-[#C5F82A] shrink-0" />
        <p className="leading-relaxed text-[11px]">
          {language === 'hi'
            ? 'आपकी व्यक्तिगत प्राथमिकताएं सीधे आपके डिवाइस पर सुरक्षित रहती हैं और प्रत्येक बारकोड और लेबल फोटो विश्लेषण में स्वतः लागू होती हैं।'
            : 'Your personal choices stay secure on your device and are automatically applied during every barcode and photo scan.'}
        </p>
      </div>

      {/* Onboarding Modal for Redoing Setup if Requested */}
      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />
    </div>
  );
};
