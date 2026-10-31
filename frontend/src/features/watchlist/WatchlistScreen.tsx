import React from 'react';
import { Bookmark, ChevronRight, BookmarkX, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/useProductStore';
import { useScanStore } from '../../store/useScanStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { GradeBadge } from '../../components/ui/GradeBadge';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const WatchlistScreen: React.FC = () => {
  const { watchlistIds, products, setCurrentProduct, toggleWatchlist } = useProductStore();
  const { openScanner } = useScanStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  const savedProducts = watchlistIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[0] => p !== undefined);

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-3xl mx-auto text-[#111F15] dark:text-[#E4F5E5]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-['Plus_Jakarta_Sans']">
            {t('savedWatchlist')}
          </h1>
          <p className="text-xs text-[#69766D] dark:text-[#9BAA9E] mt-0.5">
            {savedProducts.length} {t('monitoredEssentials')}
          </p>
        </div>

        <Button
          onClick={() => openScanner('barcode')}
          variant="secondary"
          size="sm"
          className="gap-1.5"
        >
          <ScanLine className="w-4 h-4" />
          <span>{t('addMore')}</span>
        </Button>
      </div>

      {/* List */}
      {savedProducts.length === 0 ? (
        <div className="py-20 text-center">
          <Bookmark className="w-12 h-12 text-[#69766D] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold">
            {t('noItemsWatchlist')}
          </h3>
          <p className="text-xs text-[#69766D] dark:text-[#9BAA9E] mt-1 mb-4 max-w-sm mx-auto">
            {t('startScanningPrompt')}
          </p>
          <Button onClick={() => navigate('/')} variant="primary">
            {t('exploreProducts')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {savedProducts.map((product) => (
            <Card
              key={product.id}
              interactive
              onClick={() => {
                setCurrentProduct(product);
                navigate(`/product/${product.id}`);
              }}
              className="p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover bg-white shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-[#69766D] dark:text-[#9BAA9E] uppercase">
                        {product.brand}
                      </span>
                      <h3 className="text-xs font-bold font-['Plus_Jakarta_Sans'] line-clamp-1">
                        {product.name}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(product.id);
                    }}
                    className="p-1 text-[#69766D] hover:text-[#BA1A1A] transition-colors cursor-pointer"
                    title="Remove from Watchlist"
                  >
                    <BookmarkX className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-[#404940] dark:text-[#9BAA9E] line-clamp-2">
                  {product.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E3EAE1] dark:border-[#2D3E33]">
                <Badge variant="outline" size="sm">
                  {product.categoryLabel}
                </Badge>
                <div className="flex items-center gap-2">
                  <GradeBadge grade={product.grade} size="sm" />
                  <ChevronRight className="w-4 h-4 text-[#69766D]" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
