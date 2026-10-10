import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCategory } from '../../types';

interface CategoryItem {
  name: ProductCategory;
  hindi: string;
  tagline: string;
  image: string;
  count: number;
}

export const CategorySection: React.FC = () => {
  const { setSelectedCategoryFilter, setSelectedProductId, setCurrentView, products } = useStore();

  const categories: CategoryItem[] = [
    {
      name: 'Makhana',
      hindi: 'मखाना',
      tagline: 'Healthy, crunchy and delicious.',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=600&auto=format&fit=crop',
      count: products.filter((p) => p.category === 'Makhana').length
    },
    {
      name: 'Thekua',
      hindi: 'ठेकुआ',
      tagline: 'Traditional Indian homemade-style sweet snack.',
      image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=600&auto=format&fit=crop',
      count: products.filter((p) => p.category === 'Thekua').length
    },
    {
      name: 'Cookies',
      hindi: 'कुकीज व नानखटाई',
      tagline: 'Fresh, delicious and perfect for every occasion.',
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=600&auto=format&fit=crop',
      count: products.filter((p) => p.category === 'Cookies').length
    },
    {
      name: 'Namak Paare',
      hindi: 'नमक पारे',
      tagline: 'Crispy, savory and full of authentic Indian flavor.',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop',
      count: products.filter((p) => p.category === 'Namak Paare').length
    }
  ];

  const handleSelectCategory = (cat: ProductCategory) => {
    setSelectedCategoryFilter(cat);
    setSelectedProductId(null);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="categories-section" className="py-16 sm:py-20 bg-white border-b border-warm-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100/70 text-brand-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-accent-600" />
            <span>Curated Snack Categories</span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Handcrafted with Authentic Indian Flavors
          </h2>
          <p className="text-sm sm:text-base text-stone-500">
            From royal sweet Thekua to lightly roasted nutritious foxnuts, discover authentic treats prepared with pure cow ghee.
          </p>
        </div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleSelectCategory(cat.name)}
              className="group relative rounded-3xl overflow-hidden bg-warm-cream border border-warm-border shadow-xs hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Container with Zoom effect */}
              <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Badge with count */}
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-stone-800 shadow-sm">
                    {cat.hindi}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 text-white">
                  <span className="text-[11px] font-medium text-stone-200">
                    {cat.count} varieties available
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-brand-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                    {cat.tagline}
                  </p>
                </div>

                {/* Button */}
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 group-hover:text-brand-800 group-hover:gap-3 transition-all">
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Bottom decorative warm accent border */}
              <div className="h-1 w-full bg-transparent group-hover:bg-gradient-to-r group-hover:from-brand-500 group-hover:to-accent-500 transition-all" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
