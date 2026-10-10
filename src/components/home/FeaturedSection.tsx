import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../shop/ProductCard';
import { ProductQuickView } from '../shop/ProductQuickView';
import { Product, ProductCategory } from '../../types';
import { Sparkles, ArrowRight, SlidersHorizontal } from 'lucide-react';

export const FeaturedSection: React.FC = () => {
  const { products, setCurrentView, setSelectedCategoryFilter, setSelectedProductId } = useStore();
  
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('popularity');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const categories: (ProductCategory | 'All')[] = ['All', 'Makhana', 'Thekua', 'Cookies', 'Namak Paare'];

  const filteredAndSortedProducts = useMemo(() => {
    let list = products.filter((p) => {
      if (activeCategory === 'All') return true;
      return p.category === activeCategory;
    });

    switch (sortBy) {
      case 'popularity':
        return list.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      default:
        return list;
    }
  }, [products, activeCategory, sortBy]);

  const handleViewAll = () => {
    setSelectedCategoryFilter(activeCategory);
    setSelectedProductId(null);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100/80 text-brand-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-accent-600" />
              <span>Handcrafted Small Batches</span>
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
              Our Signature Snack Collection
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Select from freshly prepared foxnuts, traditional sweet thekua, and savory nimki.
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-xs font-semibold text-stone-700 bg-white border border-warm-border rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 shadow-xs cursor-pointer"
            >
              <option value="popularity">Sort by: Popularity</option>
              <option value="rating">Sort by: Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Sort by: New Arrivals</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'bg-white hover:bg-stone-100 text-stone-600 border border-warm-border'
              }`}
            >
              {cat === 'All' ? 'All Traditional Snacks' : cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={handleViewAll}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white hover:bg-brand-50 border border-warm-border hover:border-brand-300 text-stone-800 hover:text-brand-800 text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all"
          >
            <span>Explore Full Catalog ({products.length} Snacks)</span>
            <ArrowRight className="w-4 h-4 text-brand-600" />
          </button>
        </div>

      </div>

      {/* Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
};
