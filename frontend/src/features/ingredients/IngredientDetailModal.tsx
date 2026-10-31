import React from 'react';
import { X, ShieldAlert, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';
import type { Ingredient } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { useLanguageStore } from '../../store/useLanguageStore';

interface IngredientDetailModalProps {
  ingredient: Ingredient | null;
  onClose: () => void;
}

export const IngredientDetailModal: React.FC<IngredientDetailModalProps> = ({
  ingredient,
  onClose,
}) => {
  const { language, t } = useLanguageStore();
  if (!ingredient) return null;

  const riskDetails = {
    safe: {
      label: language === 'hi' ? 'सुरक्षित एवं सत्यापित' : 'Safe & Verified',
      badge: 'success' as const,
      icon: CheckCircle,
      textColor: 'text-[#005128] dark:text-[#AAF470]',
      desc: language === 'hi'
        ? 'वैज्ञानिक रूप से सुरक्षित और एफएसएसएआई तथा वैश्विक मानकों के तहत स्वीकृत। किसी जहरीले संचय का कोई प्रमाण नहीं है।'
        : 'Extensively studied and permitted under standard Good Manufacturing Practices (GMP). No evidence of systemic toxic accumulation.',
    },
    moderate: {
      label: language === 'hi' ? 'मध्यम जोखिम / ध्यान दें' : 'Moderate Risk / Caution',
      badge: 'warning' as const,
      icon: AlertTriangle,
      textColor: 'text-[#9A6405] dark:text-[#F3CE85]',
      desc: language === 'hi'
        ? 'सख्त सीमा के साथ विनियमित। संवेदनशील व्यक्तियों में सूजन या एलर्जी की प्रतिक्रिया पैदा कर सकता है।'
        : 'Regulated with strict upper threshold caps. May trigger sensitivity or inflammation in predisposed individuals.',
    },
    high: {
      label: language === 'hi' ? 'उच्च जोखिम / हानिकारक' : 'High Concern',
      badge: 'danger' as const,
      icon: ShieldAlert,
      textColor: 'text-[#BA1A1A] dark:text-[#FFA4A0]',
      desc: language === 'hi'
        ? 'हृदय, चयापचय या हार्मोनल असंतुलन से जुड़ा हुआ। नियमित सेवन से बचने की सलाह दी जाती है।'
        : 'Associated with elevated cardiovascular, metabolic, or endocrine disruption risks in clinical trials.',
    },
    prohibited: {
      label: language === 'hi' ? 'प्रतिबंधित / अमान्य' : 'Restricted / Prohibited',
      badge: 'danger' as const,
      icon: ShieldAlert,
      textColor: 'text-[#BA1A1A] dark:text-[#FFA4A0]',
      desc: language === 'hi'
        ? 'कई देशों में प्रतिबंधित। तत्काल सतर्कता आवश्यक है।'
        : 'Banned or restricted in major global jurisdictions. Requires urgent consumer caution.',
    },
  }[ingredient.riskLevel];

  const Icon = riskDetails.icon;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-[#111F15] dark:text-[#E4F5E5]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#1A2A1F] rounded-3xl p-6 shadow-2xl border-2 border-[#111F15] dark:border-[#2D3E33] relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#69766D] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          {ingredient.insNumber && (
            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EDF6EA] dark:bg-[#253429] text-[#005128] dark:text-[#98E9AB]">
              {ingredient.insNumber}
            </span>
          )}
          <Badge variant={riskDetails.badge}>{riskDetails.label}</Badge>
          {ingredient.isAllergen && (
            <Badge variant="warning">
              {language === 'hi' ? 'एलर्जी चेतावनी' : 'Allergen Alert'}
            </Badge>
          )}
        </div>

        <h3 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">
          {ingredient.name}
        </h3>

        <p className="text-xs text-[#69766D] dark:text-[#9BAA9E] mt-1 font-medium">
          {language === 'hi' ? 'उद्देश्य:' : 'Purpose:'} {ingredient.purpose}
        </p>

        {/* Risk summary callout */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#F7FAF6] dark:bg-[#15271B] border border-[#E3EAE1] dark:border-[#2D3E33] flex items-start gap-3">
          <Icon className={`w-5 h-5 ${riskDetails.textColor} shrink-0 mt-0.5`} />
          <p className="text-xs text-[#404940] dark:text-[#9BAA9E] leading-relaxed">
            {riskDetails.desc}
          </p>
        </div>

        {/* Regulatory Status India */}
        <div className="mt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
            <BookOpen className="w-4 h-4 text-[#005128] dark:text-[#83C94B]" />
            {language === 'hi' ? 'नियामक स्थिति (भारत - FSSAI)' : 'Regulatory Standing (India)'}
          </h4>
          <p className="text-xs bg-[#EDF6EA] dark:bg-[#15271B] p-3 rounded-xl text-[#005128] dark:text-[#98E9AB] font-medium border border-[#176B3A]/15">
            {ingredient.regulatoryStatusIndia}
          </p>
        </div>

        {/* Scientific Context */}
        <div className="mt-3">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-1 font-['Plus_Jakarta_Sans']">
            {language === 'hi' ? 'वैज्ञानिक अध्ययन एवं तथ्य' : 'Clinical & Toxicological Context'}
          </h4>
          <p className="text-xs text-[#404940] dark:text-[#9BAA9E] leading-relaxed bg-[#F7FAF6] dark:bg-[#15271B] p-3 rounded-xl border border-[#111F15]/10">
            {ingredient.scientificContext}
          </p>
        </div>
      </div>
    </div>
  );
};
