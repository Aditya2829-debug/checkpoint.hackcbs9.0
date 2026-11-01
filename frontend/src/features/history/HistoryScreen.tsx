import React, { useState } from 'react';
import {
  History,
  Trash2,
  ChevronRight,
  ScanLine,
  Search,
  Camera,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScanStore, type HistoryItem } from '../../store/useScanStore';
import { useProductStore } from '../../store/useProductStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { GradeBadge } from '../../components/ui/GradeBadge';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProductIllustration } from '../../components/ui/ProductIllustration';

// Format relative time helper
const formatRelativeTime = (timestamp: number, lang: 'en' | 'hi'): string => {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) {
    return lang === 'hi' ? 'अभी-अभी' : 'Just now';
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return lang === 'hi' ? `${diffMin} मिनट पहले` : `${diffMin}m ago`;
  }
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return lang === 'hi' ? `${diffHours} घंटे पहले` : `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return lang === 'hi' ? `${diffDays} दिन पहले` : `${diffDays}d ago`;
};

export const HistoryScreen: React.FC = () => {
  const { historyItems, clearHistory, removeFromHistory, openScanner } = useScanStore();
  const { setCurrentProduct, products } = useProductStore();
  const { language, t } = useLanguageStore();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<'all' | 'search' | 'barcode' | 'ocr' | 'food' | 'women-hygiene'>('all');

  const lastItem: HistoryItem | undefined = historyItems[0];

  const handleOpenProduct = (item: HistoryItem) => {
    // Check if this item is in the global products list, or construct product from history cache
    const existing = products.find((p) => p.id === item.id || p.barcode === item.barcode);
    if (existing) {
      setCurrentProduct(existing);
      navigate(`/product/${existing.id}`);
    } else {
      // Navigate by barcode/id directly so scanService / productAnalysis loads it from cache
      navigate(`/product/${item.barcode || item.id}`);
    }
  };

  const handleClearAll = () => {
    if (window.confirm(t('clearHistoryConfirm'))) {
      clearHistory();
    }
  };

  // Filter items
  const filteredItems = historyItems.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'search') return item.source === 'search';
    if (activeFilter === 'barcode') return item.source === 'barcode';
    if (activeFilter === 'ocr') return item.source === 'ocr';
    if (activeFilter === 'food') return item.category === 'food';
    if (activeFilter === 'women-hygiene') return item.category === 'women-hygiene';
    return true;
  });

  const getSourceIcon = (source: HistoryItem['source']) => {
    switch (source) {
      case 'search':
        return <Search className="w-3.5 h-3.5 text-blue-500" />;
      case 'ocr':
        return <Camera className="w-3.5 h-3.5 text-purple-500" />;
      case 'barcode':
      default:
        return <ScanLine className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  const getSourceLabel = (source: HistoryItem['source']) => {
    switch (source) {
      case 'search':
        return t('searchSource');
      case 'ocr':
        return t('ocrSource');
      case 'barcode':
      default:
        return t('barcodeSource');
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-4xl mx-auto text-[#111F15] dark:text-[#E4F5E5]">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans'] tracking-tight">
              {t('scanHistory')}
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/50">
              {historyItems.length} {language === 'hi' ? 'कैश्ड' : 'Cached'}
            </span>
          </div>
          <p className="text-xs text-[#69766D] dark:text-[#9BAA9E] mt-1">
            {language === 'hi'
              ? 'आपके द्वारा खोजे और स्कैन किए गए सभी उत्पादों का सुरक्षित लोकल कैश।'
              : 'Persistent local cache of all your recent barcode scans, text searches, and label checks.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {historyItems.length > 0 && (
            <Button
              onClick={handleClearAll}
              variant="outline"
              size="sm"
              className="gap-1.5 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('clearAllHistory')}</span>
            </Button>
          )}

          <Button
            onClick={() => openScanner('barcode')}
            variant="primary"
            size="sm"
            className="gap-1.5 shadow-sm"
          >
            <ScanLine className="w-4 h-4" />
            <span>{t('newScan')}</span>
          </Button>
        </div>
      </div>

      {/* Prominent Hero: Last Activity / Search / Scan Cached Item */}
      {lastItem && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F3822] via-[#0A2617] to-[#04130B] text-white p-5 sm:p-6 shadow-xl border-2 border-[#D7FF63]/30">
          {/* Subtle Glow Backdrop */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#D7FF63]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Banner Tag */}
          <div className="flex items-center justify-between gap-2 mb-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-[#D7FF63]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{t('lastActivity')}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/70">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatRelativeTime(lastItem.scannedAt, language)}</span>
            </div>
          </div>

          {/* Main Card Content */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <ProductIllustration
                product={lastItem}
                size="md"
                className="shrink-0 shadow-md"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-black tracking-wider text-[#D7FF63] uppercase">
                    {lastItem.brand}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/15 text-white/90">
                    {getSourceIcon(lastItem.source)}
                    <span>{getSourceLabel(lastItem.source)}</span>
                  </span>
                  {lastItem.barcode && (
                    <span className="text-[10px] font-mono text-white/60">
                      #{lastItem.barcode}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-black text-white truncate font-['Plus_Jakarta_Sans']">
                  {lastItem.name}
                </h3>

                <p className="text-xs text-white/80 line-clamp-2 mt-1">
                  {lastItem.summary}
                </p>
              </div>
            </div>

            {/* Grade & Action */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white/70 hidden sm:inline">
                  {t('compareGrade')}:
                </span>
                <GradeBadge grade={lastItem.grade} size="lg" />
              </div>

              <button
                onClick={() => handleOpenProduct(lastItem)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D7FF63] text-[#0F3822] text-xs font-black hover:bg-[#c6f147] transition-all shadow-md cursor-pointer"
              >
                <span>{t('inspectDetails')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-2 overflow-x-auto no-scrollbar border-b border-[#E3EAE1] dark:border-[#2D3E33]">
        <Filter className="w-3.5 h-3.5 text-[#69766D] shrink-0" />
        {[
          { id: 'all', label: `${t('allItems')} (${historyItems.length})` },
          { id: 'search', label: `🔍 ${t('searchSource')} (${historyItems.filter((i) => i.source === 'search').length})` },
          { id: 'barcode', label: `📷 ${t('barcodeSource')} (${historyItems.filter((i) => i.source === 'barcode').length})` },
          { id: 'ocr', label: `📄 ${t('ocrSource')} (${historyItems.filter((i) => i.source === 'ocr').length})` },
          { id: 'food', label: `🥗 ${t('foodNutrition')} (${historyItems.filter((i) => i.category === 'food').length})` },
          { id: 'women-hygiene', label: `🌸 ${t('womensHygiene')} (${historyItems.filter((i) => i.category === 'women-hygiene').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-[#005128] text-white shadow-sm'
                : 'bg-white/60 dark:bg-white/5 text-[#69766D] dark:text-[#9BAA9E] hover:text-[#111F15] dark:hover:text-white border border-[#E3EAE1] dark:border-[#2D3E33]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* History Items List */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center bg-white/40 dark:bg-white/5 rounded-3xl border border-[#E3EAE1] dark:border-[#2D3E33] p-8">
          <History className="w-12 h-12 text-[#69766D] mx-auto mb-3 opacity-30" />
          <h3 className="text-base font-bold text-[#111F15] dark:text-[#E4F5E5]">
            {t('noScansRecorded')}
          </h3>
          <p className="text-xs text-[#69766D] dark:text-[#9BAA9E] mt-1 mb-5 max-w-sm mx-auto">
            {t('startScanningPrompt')}
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => openScanner('barcode')} variant="primary">
              {t('startScanning')}
            </Button>
            <Button onClick={() => navigate('/explore')} variant="outline">
              {t('exploreProducts')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#69766D] dark:text-[#9BAA9E] px-1">
            <span>{t('recentlyInspected')}</span>
            <span>{filteredItems.length} {language === 'hi' ? 'आइटम' : 'items'}</span>
          </div>

          {filteredItems.map((item, idx) => (
            <Card
              key={`${item.id}-${idx}`}
              className="p-3.5 sm:p-4 flex items-center justify-between gap-3 group hover:border-[#005128]/40 transition-all cursor-pointer relative"
              onClick={() => handleOpenProduct(item)}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <ProductIllustration
                  product={item}
                  size="sm"
                  className="shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-black tracking-wider text-[#005128] dark:text-[#D7FF63] uppercase">
                      {item.brand}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[#404940] dark:text-[#9BAA9E]">
                      {getSourceIcon(item.source)}
                      <span>{getSourceLabel(item.source)}</span>
                    </span>
                    <span className="text-[10px] text-[#69766D] dark:text-[#9BAA9E] flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formatRelativeTime(item.scannedAt, language)}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold truncate font-['Plus_Jakarta_Sans'] text-[#111F15] dark:text-[#E4F5E5]">
                    {item.name}
                  </h3>

                  <p className="text-xs text-[#69766D] dark:text-[#9BAA9E] line-clamp-1 mt-0.5">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Actions & Grade */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <GradeBadge grade={item.grade} size="sm" />

                {/* Individual remove button */}
                <button
                  type="button"
                  title="Remove from history"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromHistory(item.id);
                  }}
                  className="p-1.5 rounded-lg text-[#69766D] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <ChevronRight className="w-4 h-4 text-[#69766D] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
