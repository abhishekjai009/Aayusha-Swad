import React, { useState, useEffect } from 'react';
import { TESTIMONIALS } from '../../data/initialData';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  // Auto rotate every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const active = TESTIMONIALS[currentIndex];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-warm-border/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Over 1,200+ Verified 5-Star Reviews</span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Loved by Snack Lovers Across India
          </h2>
          <p className="text-sm text-stone-500">
            Read what our food lovers have to say about the crispness, purity, and nostalgic flavors of Aayusha Swad.
          </p>
        </div>

        {/* Carousel Card Container */}
        <div className="max-w-4xl mx-auto relative">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFDF7] border border-warm-border shadow-elevated relative overflow-hidden">
            
            {/* Background Quote watermark */}
            <Quote className="w-32 h-32 text-amber-500/10 absolute -top-4 -right-4 pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 relative z-10">
              
              {/* Customer Avatar & Location */}
              <div className="flex flex-col items-center text-center flex-shrink-0">
                <img
                  src={active.avatar}
                  alt={active.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-brand-200"
                />
                <h4 className="font-serif font-bold text-base text-stone-900 mt-3">{active.name}</h4>
                <span className="text-xs text-stone-500 font-medium">{active.location}</span>
                <div className="inline-flex items-center gap-1 mt-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified Buyer</span>
                </div>
              </div>

              {/* Review Content */}
              <div className="flex-1 text-center sm:text-left space-y-4">
                {/* Stars */}
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  {[...Array(active.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-stone-700 text-base sm:text-lg leading-relaxed italic font-serif">
                  "{active.quote}"
                </p>

                {/* Product Purchased Tag */}
                <div className="pt-2">
                  <span className="inline-block text-xs font-semibold text-brand-800 bg-brand-100/70 px-3 py-1 rounded-lg">
                    Snack Purchased: {active.product}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white hover:bg-stone-50 border border-warm-border text-stone-700 hover:text-brand-600 shadow-xs transition-colors"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === idx ? 'w-6 bg-brand-500' : 'w-2 bg-stone-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white hover:bg-stone-50 border border-warm-border text-stone-700 hover:text-brand-600 shadow-xs transition-colors"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
