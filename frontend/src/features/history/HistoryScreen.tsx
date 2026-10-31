import React, { useState } from 'react';
import { History, Trash2, ChevronRight, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScanStore } from '../../store/useScanStore';
import { useProductStore } from '../../store/useProductStore';
import { GradeBadge } from '../../components/ui/GradeBadge';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const HistoryScreen: React.FC = () => {
  const { scanHistoryIds, openScanner } = useScanStore();
  const { products, setCurrentProduct } = useProductStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'food' | 'women-hygiene'>('all');

  const historyProducts = scanHistoryIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[0] => p !== undefined);

  const filteredItems =
    filter === 'all'
      ? historyProducts
      : historyProducts.filter((p) => p.category === filter);

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#111F15] dark:text-[#E4F5E5] font-['Plus_Jakarta_Sans']">
            Scan History
          </h1>
          <p className="text-xs text-[#69766D] dark:text-[#9BAA9E] mt-0.5">
            {historyProducts.length} verified products inspected
          </p>
        </div>

        <Button
          onClick={() => openScanner('barcode')}
          variant="secondary"
          size="sm"
          className="gap-1.5"
        >
          <ScanLine className="w-4 h-4" />
          <span>New Scan</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#E3EAE1] dark:border-[#2D3E33] pb-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'food', label: 'Food & Nutrition' },
          { id: 'women-hygiene', label: "Women's Hygiene" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === tab.id
                ? 'bg-[#005128] text-white'
                : 'bg-transparent text-[#69766D] dark:text-[#9BAA9E] hover:text-[#111F15]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center">
          <History className="w-12 h-12 text-[#69766D] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-[#111F15] dark:text-[#E4F5E5]">
            No scans recorded yet
          </h3>
          <p className="text-xs text-[#69766D] dark:text-[#9BAA9E] mt-1 mb-4">
            Scan your first packaged food or sanitary product to see its clinical analysis here.
          </p>
          <Button onClick={() => openScanner('barcode')} variant="primary">
            Start Scanning
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((product) => (
            <Card
              key={product.id}
              interactive
              onClick={() => {
                setCurrentProduct(product);
                navigate(`/product/${product.id}`);
              }}
              className="p-3.5 flex items-center gap-3.5"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-16 h-16 rounded-xl object-cover bg-white shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold text-[#69766D] dark:text-[#9BAA9E] uppercase">
                    {product.brand}
                  </span>
                  <Badge
                    variant={product.category === 'women-hygiene' ? 'lavender' : 'default'}
                    size="sm"
                  >
                    {product.categoryLabel}
                  </Badge>
                </div>
                <h3 className="text-sm font-bold text-[#111F15] dark:text-[#E4F5E5] font-['Plus_Jakarta_Sans'] truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-[#404940] dark:text-[#9BAA9E] line-clamp-1 mt-0.5">
                  {product.summary}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <GradeBadge grade={product.grade} size="md" />
                <ChevronRight className="w-4 h-4 text-[#69766D]" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
