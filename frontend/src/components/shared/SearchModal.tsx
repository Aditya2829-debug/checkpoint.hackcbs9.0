import React, { useState, useEffect } from 'react';
import { Search, X, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/api/productService';
import { useLanguageStore } from '../../store/useLanguageStore';
import { GradeBadge } from '../ui/GradeBadge';
import { Badge } from '../ui/Badge';
import type { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const fetchResults = async () => {
      setLoading(true);
      const items = await productService.search(query, category);
      setResults(items);
      setLoading(false);
    };
    const timer = setTimeout(fetchResults, 150);
    return () => clearTimeout(timer);
  }, [query, category, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-start items-center p-4 sm:pt-16 animate-fade-in text-[#111F15] dark:text-[#E4F5E5]">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#1A2A1F] rounded-2xl shadow-2xl border border-[#E3EAE1] dark:border-[#2D3E33] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="p-4 border-b border-[#E3EAE1] dark:border-[#2D3E33] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#69766D] dark:text-[#9BAA9E]" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm font-medium placeholder-[#69766D] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[#69766D] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#EDF6EA] dark:bg-[#253429] text-[#005128] dark:text-[#98E9AB] cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 bg-[#F7FAF6] dark:bg-[#15271B] border-b border-[#E3EAE1] dark:border-[#2D3E33] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: t('allItems') },
            { id: 'food', label: t('foodNutrition') },
            { id: 'women-hygiene', label: t('womensHygiene') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                category === tab.id
                  ? 'bg-[#005128] text-white shadow-sm'
                  : 'bg-white dark:bg-[#1A2A1F] text-[#404940] dark:text-[#9BAA9E] border border-[#E3EAE1] dark:border-[#2D3E33]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading ? (
            <div className="py-12 text-center text-sm text-[#69766D] dark:text-[#9BAA9E]">
              {t('searchingDb')}
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center">
              <Sparkles className="w-8 h-8 text-[#83C94B] mx-auto mb-2 opacity-60" />
              <p className="text-sm font-semibold">
                {t('noMatchingProducts')}
              </p>
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onClose();
                  navigate(`/product/${product.id}`);
                }}
                className="p-3 rounded-xl border border-transparent hover:border-[#E3EAE1] dark:hover:border-[#2D3E33] hover:bg-[#F7FAF6] dark:hover:bg-[#15271B] transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover bg-white"
                  />
                  <div>
                    <h4 className="text-xs font-bold font-['Plus_Jakarta_Sans'] line-clamp-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[#69766D] dark:text-[#9BAA9E]">
                        {product.brand}
                      </span>
                      <span className="text-[10px] text-[#69766D] dark:text-[#9BAA9E]">
                        • {product.barcode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <GradeBadge grade={product.grade} size="sm" />
                  <ChevronRight className="w-4 h-4 text-[#69766D]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
