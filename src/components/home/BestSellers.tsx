import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../shop/ProductCard';
import { ProductQuickView } from '../shop/ProductQuickView';
import { Product } from '../../types';
import { Flame, ArrowRight } from 'lucide-react';

export const BestSellers: React.FC = () => {
  const { products, setCurrentView, setSelectedCategoryFilter, setSelectedProductId } = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const bestSellers = products.filter((p) => p.isBestSeller || p.badge?.includes('Bestseller') || p.rating >= 4.9);

  const handleExploreAll = () => {
    setSelectedCategoryFilter('All');
    setSelectedProductId(null);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-20 bg-warm-cream/40 border-b border-warm-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
              <Flame className="w-3.5 h-3.5 text-accent-600 fill-accent-600" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
              Best Selling Traditional Snacks
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              The snacks our customers re-order time and time again.
            </p>
          </div>

          <button
            onClick={handleExploreAll}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 transition-colors self-start sm:self-auto"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

      </div>

      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
};
