import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Star, CheckCircle2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setCurrentView, setSelectedCategoryFilter, setSelectedProductId } = useStore();

  const handleShopNow = () => {
    setSelectedCategoryFilter('All');
    setSelectedProductId(null);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToCategories = () => {
    const el = document.getElementById('categories-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden hero-pattern pt-8 pb-16 lg:py-20 border-b border-warm-border/60">
      
      {/* Decorative blurred background aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-accent-200/25 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-900 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-accent-600 animate-spin-slow" />
              <span>100% Pure Desi Cow Ghee • Authentic Heirloom Recipes</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-stone-900 leading-[1.15] tracking-tight">
              Traditional Taste, <br className="hidden sm:inline" />
              <span className="gold-gradient-text">Made with Love.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Discover delicious Indian snacks crafted with authentic flavors, time-honored family recipes, and the finest natural ingredients. Handcrafted to bring the nostalgic joy of home directly to your doorstep.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={handleShopNow}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 hover:from-brand-700 hover:to-accent-600 text-white font-bold text-sm rounded-2xl shadow-soft hover:shadow-premium flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleScrollToCategories}
                className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm rounded-2xl border border-warm-border shadow-xs hover:border-brand-300 transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Our Snacks</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-warm-border/80 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-left">
                <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-brand-700 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Zero Palm Oil</h4>
                  <p className="text-[10px] text-stone-500">100% Desi Ghee</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-left">
                <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-brand-700 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Fresh Batches</h4>
                  <p className="text-[10px] text-stone-500">Made Every 48h</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-left">
                <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-brand-700 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">4.9 / 5.0</h4>
                  <p className="text-[10px] text-stone-500">1,200+ Reviews</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Visual Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Featured Showcase Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-elevated border-4 border-white bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=900&auto=format&fit=crop"
                  alt="Authentic Indian Traditional Thekua & Snacks"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/90 text-white text-[11px] font-bold backdrop-blur-sm self-start mb-2">
                    <Sparkles className="w-3 h-3 text-brand-100" />
                    <span>Signature Special</span>
                  </div>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                    Traditional Desi Ghee Thekua
                  </h3>
                  <p className="text-xs text-stone-200 mt-1">
                    Pressed with wooden molds, organic jaggery, and crushed cardamom.
                  </p>
                </div>
              </div>

              {/* Floating Pill Badge 1: Makhana Crunch */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-premium border border-warm-border flex items-center gap-3 animate-float-slow hidden sm:flex">
                <img
                  src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=150&auto=format&fit=crop"
                  alt="Makhana"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Roasted Fresh</span>
                  <h4 className="text-xs font-bold text-stone-900">Himalayan Salt Makhana</h4>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span>4.9 (140+ reviews)</span>
                  </div>
                </div>
              </div>

              {/* Floating Pill Badge 2: Pure Ingredients */}
              <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-premium border border-warm-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Vacuum Seal Pack</h4>
                  <p className="text-[10px] text-stone-500">100% Crunch Guaranteed</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
