import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductQuickView } from './ProductQuickView';
import { Product, ProductCategory } from '../../types';
import { 
  SlidersHorizontal, 
  Search, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Filter 
} from 'lucide-react';

export const ShopView: React.FC = () => {
  const { products, selectedCategoryFilter, setSelectedCategoryFilter } = useStore();

  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('popularity');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const categories: (ProductCategory | 'All')[] = ['All', 'Makhana', 'Thekua', 'Cookies', 'Namak Paare'];

  const allTags = ['All', 'Pure Ghee', 'Gluten-Free', 'Roasted', 'No Palm Oil', 'Traditional', 'Spicy'];

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategoryFilter('All');
    setSearch('');
    setMaxPrice(1000);
    setSelectedTag('All');
    setInStockOnly(false);
    setSortBy('popularity');
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      // Category filter
      if (selectedCategoryFilter !== 'All' && p.category !== selectedCategoryFilter) {
        return false;
      }
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q));
        if (!match) return false;
      }
      // Price filter
      if (p.price > maxPrice) return false;

      // Tag filter
      if (selectedTag !== 'All' && !p.tags.includes(selectedTag)) return false;

      // In stock
      if (inStockOnly && !p.inStock) return false;

      return true;
    });

    // Sorting
    switch (sortBy) {
      case 'popularity':
        return result.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'price-asc':
        return result.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return result.sort((a, b) => b.price - a.price);
      case 'rating':
        return result.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      default:
        return result;
    }
  }, [products, selectedCategoryFilter, search, maxPrice, selectedTag, inStockOnly, sortBy]);

  return (
    <div className="py-8 sm:py-12 bg-[#FAFAF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-brand-700 font-semibold">Shop All Snacks</span>
            {selectedCategoryFilter !== 'All' && (
              <>
                <span>/</span>
                <span className="text-stone-900 font-bold">{selectedCategoryFilter}</span>
              </>
            )}
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Authentic Indian Snacks Store
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Handcrafted with pure cow ghee, whole grains, and authentic spices. Vacuum-packed fresh.
          </p>
        </div>

        {/* Mobile Filter Toggle & Search Bar */}
        <div className="lg:hidden flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search snacks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-warm-border rounded-xl focus:outline-none focus:border-brand-500 shadow-xs"
            />
          </div>
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="px-4 py-2 bg-white border border-warm-border rounded-xl text-xs font-bold text-stone-700 flex items-center gap-1.5 shadow-xs"
          >
            <Filter className="w-3.5 h-3.5 text-brand-600" />
            <span>Filters</span>
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Filter Sidebar (Desktop + Mobile Dropdown) */}
          <aside
            className={`lg:col-span-1 space-y-6 ${
              isMobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-xs space-y-6">
              
              {/* Header with Reset */}
              <div className="flex items-center justify-between pb-3 border-b border-warm-border">
                <span className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                  <span>Filter Snacks</span>
                </span>
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-stone-400 hover:text-brand-600 flex items-center gap-1 font-semibold transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Search Inside Sidebar (Desktop) */}
              <div className="hidden lg:block">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Keyword Search
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search makhana, thekua..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        selectedCategoryFilter === cat
                          ? 'bg-brand-50 text-brand-800 font-bold'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span>{cat === 'All' ? 'All Snacks' : cat}</span>
                      <span className="text-[10px] text-stone-400">
                        {cat === 'All'
                          ? products.length
                          : products.filter((p) => p.category === cat).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  <span>Max Price</span>
                  <span className="text-brand-700 font-extrabold text-sm">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="1000"
                  step="25"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-medium mt-1">
                  <span>₹150</span>
                  <span>₹1,000</span>
                </div>
              </div>

              {/* Diet / Preference Tags */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Diet & Taste
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        selectedTag === tag
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-warm-cream border-warm-border text-stone-600 hover:border-brand-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Only Checkbox */}
              <div className="pt-2 border-t border-warm-border">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-stone-300 cursor-pointer"
                  />
                  <span>In-Stock Only</span>
                </label>
              </div>

            </div>
          </aside>

          {/* Right Column: Catalog Grid */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Top Toolbar: Count & Sort */}
            <div className="bg-white p-4 rounded-2xl border border-warm-border shadow-xs flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-semibold text-stone-600">
                Showing <strong className="text-stone-900">{filteredProducts.length}</strong> delicious snack items
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-medium hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="text-xs font-semibold text-stone-800 bg-stone-50 border border-warm-border rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">New Arrivals</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-warm-border p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-brand-600 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-800">
                  No snacks match your selected filters
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try adjusting your price range, clearing tags, or searching for other items.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl shadow-soft transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
