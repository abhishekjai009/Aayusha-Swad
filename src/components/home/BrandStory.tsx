import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, Sparkles, Check, ArrowRight } from 'lucide-react';

export const BrandStory: React.FC = () => {
  const { setCurrentView, setSelectedProductId } = useStore();

  const handleLearnMore = () => {
    setSelectedProductId(null);
    setCurrentView('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FFFDF8] border-b border-warm-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Story Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Image */}
              <div className="rounded-3xl overflow-hidden shadow-elevated border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop"
                  alt="Traditional Indian snacks preparation"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>

              {/* Secondary Floating Card */}
              <div className="absolute -bottom-8 -right-4 sm:-right-8 bg-white p-5 rounded-3xl shadow-premium border border-warm-border max-w-xs hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
                    <Heart className="w-5 h-5 fill-brand-500 text-brand-500" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-stone-900">Grandmother's Legacy</h4>
                    <p className="text-[11px] text-stone-500">Heirloom artisanal taste preserved</p>
                  </div>
                </div>
              </div>

              {/* Heritage Stamp Badge */}
              <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-brand-500 text-white flex flex-col items-center justify-center shadow-lg border-2 border-white rotate-12">
                <span className="text-[9px] font-bold uppercase tracking-widest">Est.</span>
                <span className="font-serif font-black text-sm">TRADITION</span>
                <span className="text-[9px] font-bold">100% PURE</span>
              </div>

            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100/80 text-brand-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-accent-600" />
              <span>Our Story & Mission</span>
            </div>

            <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight leading-snug">
              Preserving India's Culinary Heritage for the Modern Table
            </h2>

            <div className="space-y-4 text-stone-600 text-xs sm:text-sm leading-relaxed">
              <p>
                <strong>Aayusha Swad</strong> was born from a simple yearning: to revive the unforgettable aroma of our grandmother’s kitchen during Indian festive afternoons. The authentic crackle of freshly pressed Thekua in pure cow ghee, the crunch of stone-salted foxnuts, and the subtle warmth of ajwain-scented namkeen.
              </p>
              <p>
                In an era dominated by hyper-processed snacks fried in cheap palm oils and loaded with synthetic flavor enhancers, we chose a different path — the path of uncompromising integrity. We handpick whole grains, churn pure cow ghee, source mineral rock salts, and honor century-old baking traditions.
              </p>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Heirloom traditional recipes',
                'Zero palm oil & zero trans-fats',
                'Pure desi cow ghee only',
                'Modern hygienic vacuum packaging',
                'No chemical preservatives',
                'Delivered fresh across India'
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-semibold text-stone-700">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4">
              <button
                onClick={handleLearnMore}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>Read Our Full Heritage Journey</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
