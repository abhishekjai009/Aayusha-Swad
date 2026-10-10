import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, X, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';

export const SearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    products, 
    setSelectedProductId, 
    setCurrentView,
    addToCart 
  } = useStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const quickPicks = [
    'Desi Ghee Thekua',
    'Himalayan Salt Makhana',
    'Peri Peri',
    'Ajwain Namak Paare',
    'Royal Nankhatai'
  ];

  const filteredProducts = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.ingredients.some((i) => i.toLowerCase().includes(q))
        );
      })
    : [];

  const handleProductSelect = (product: Product) => {
    setSelectedProductId(product.id);
    setCurrentView('product-detail');
    setIsSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-warm-border overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="relative border-b border-warm-border p-4 flex items-center gap-3 bg-[#FFFDF7]">
          <Search className="w-5 h-5 text-brand-600 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Makhana, Thekua, Cookies, Namak Paare, Desi Ghee..."
            className="w-full bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-600 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Quick Picks */}
        {!query && (
          <div className="p-5 space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-400 uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Popular Indian Snack Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickPicks.map((pick) => (
                  <button
                    key={pick}
                    onClick={() => setQuery(pick)}
                    className="px-3 py-1.5 rounded-full bg-warm-cream border border-warm-border text-xs font-medium text-stone-700 hover:border-brand-400 hover:text-brand-700 transition-colors"
                  >
                    {pick}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-warm-border">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Browse by Category</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                {(['Makhana', 'Thekua', 'Cookies', 'Namak Paare'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setQuery(cat);
                    }}
                    className="p-3 text-left rounded-xl bg-stone-50 hover:bg-brand-50 border border-warm-border/60 hover:border-brand-200 transition-all text-xs font-semibold text-stone-800"
                  >
                    <span>{cat}</span>
                    <span className="block text-[10px] text-stone-400 font-normal mt-0.5">Explore snacks</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {query && (
          <div className="max-h-96 overflow-y-auto p-4 divide-y divide-warm-border/50">
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-stone-500">
                <p className="text-sm font-semibold text-stone-700">No snacks found for "{query}"</p>
                <p className="text-xs text-stone-400 mt-1">Try searching for Thekua, Makhana, Namak Paare, or Cookies.</p>
              </div>
            ) : (
              filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="py-3 flex items-center justify-between gap-4 group hover:bg-amber-50/40 -mx-4 px-4 rounded-xl transition-colors cursor-pointer"
                  onClick={() => handleProductSelect(p)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded-xl border border-warm-border flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-brand-700 tracking-wider bg-brand-100 px-2 py-0.5 rounded-full">
                          {p.category}
                        </span>
                        {p.hindiName && (
                          <span className="text-xs text-stone-400 hidden sm:inline">{p.hindiName}</span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-stone-900 group-hover:text-brand-700 transition-colors truncate">
                        {p.name}
                      </h4>
                      <p className="text-xs text-stone-500 truncate">{p.shortDescription}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-bold text-stone-900">₹{p.price}</span>
                      <span className="block text-[10px] text-stone-400">{p.weight}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p);
                      }}
                      className="p-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-sm transition-colors"
                      title="Quick Add to Basket"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};
