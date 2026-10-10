import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Copy, Check, ArrowRight, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PromoBanner: React.FC = () => {
  const { setCurrentView, setSelectedCategoryFilter, setSelectedProductId } = useStore();
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const couponCode = 'SWAD100';

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    addToast({
      type: 'success',
      title: 'Coupon Copied!',
      message: `Coupon code "${couponCode}" copied to clipboard.`
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShop = () => {
    setSelectedCategoryFilter('All');
    setSelectedProductId(null);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="special-offer" className="py-12 sm:py-16 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Promotional Box */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FEF3C7] via-[#FFFBEB] to-[#FED7AA] border border-amber-200/80 p-8 sm:p-12 shadow-premium">
          
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent-300/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-brand-300/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-brand-800 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                <span>Special Festive Launch Offer</span>
              </div>

              <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight leading-tight">
                Taste More, Save More!
              </h2>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Enjoy flat <strong className="text-stone-900">₹100 OFF</strong> on all snack orders above ₹499 plus free express shipping across India. Handcrafted fresh with pure cow ghee.
              </p>

              {/* Coupon Code Pill */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-amber-300/80 shadow-xs">
                  <span className="text-xs text-stone-500 font-medium">Use Code:</span>
                  <span className="font-mono font-bold text-sm sm:text-base text-brand-700 tracking-wider">
                    {couponCode}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 hover:text-stone-900 transition-colors"
                    title="Copy code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs text-stone-500">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Limited Time Launch Special</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleShop}
                className="px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-2xl shadow-soft hover:shadow-premium flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <span>Shop Now & Save ₹100</span>
                <ArrowRight className="w-4 h-4 text-brand-400" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
