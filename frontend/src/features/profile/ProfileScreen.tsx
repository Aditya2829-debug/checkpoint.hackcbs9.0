import React, { useState } from 'react';
import { ArrowLeft, User, Edit3, Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useUserStore } from '../../store/useUserStore';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguageStore();
  const { profile, updateName } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.name || '');

  const displayName =
    profile.name ||
    (typeof localStorage !== 'undefined' ? localStorage.getItem('checkpoint_user_name') : '') ||
    (language === 'hi' ? 'अतिथि उपयोगकर्ता' : 'User');

  const handleSave = () => {
    if (editedName.trim()) {
      updateName(editedName.trim());
    }
    setIsEditing(false);
  };

  const initial = (displayName.trim()[0] || 'U').toUpperCase();

  return (
    <div className="space-y-6 px-4 pt-3 pb-8 animate-fade-in text-[#111F15] dark:text-[#E4F5E5] max-w-lg mx-auto">
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

      {/* Profile Card: Solely showing the User's Name */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1A2A1F] border-2 border-[#111F15] dark:border-[#2D3E33] shadow-[4px_4px_0px_#111F15] dark:shadow-none text-center space-y-6">
        {/* Avatar Circle with First Initial */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#C5F82A] to-[#15803D] text-[#111F15] border-3 border-[#111F15] flex items-center justify-center shadow-[3px_3px_0px_#111F15]">
          <span className="text-4xl sm:text-5xl font-black font-['Plus_Jakarta_Sans'] select-none">
            {initial}
          </span>
          <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#16A34A] border-2 border-white shadow-sm" />
        </div>

        {/* User Name Section */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF6EA] dark:bg-[#15271B] border border-[#111F15]/15 text-[11px] font-black uppercase tracking-wider text-[#005128] dark:text-[#C5F82A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'उपयोगकर्ता प्रोफ़ाइल' : 'User Profile'}</span>
          </span>

          {isEditing ? (
            <div className="flex items-center justify-center gap-2 pt-2 max-w-xs mx-auto">
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
            <div className="flex items-center justify-center gap-2 pt-1">
              <h2 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans'] tracking-tight">
                {displayName}
              </h2>
              <button
                onClick={() => {
                  setEditedName(displayName);
                  setIsEditing(true);
                }}
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#69766D] dark:text-[#9BAA9E] cursor-pointer transition-colors"
                title={language === 'hi' ? 'नाम बदलें' : 'Edit name'}
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
