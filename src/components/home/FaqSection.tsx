import React, { useState } from 'react';
import { FAQS } from '../../data/initialData';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // first item open by default

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-warm-border/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-accent-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-stone-500">
            Everything you need to know about our ingredients, small-batch preparation, and delivery.
          </p>
        </div>

        {/* Accordion Items */}
        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-warm-border overflow-hidden transition-all duration-200 bg-stone-50/50 hover:border-brand-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-stone-900 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <div
                    className={`w-7 h-7 rounded-full bg-white border border-warm-border flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-brand-50 text-brand-600 border-brand-300' : 'text-stone-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-warm-border/40">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Note */}
        <div className="mt-8 text-center text-xs text-stone-500">
          Have more questions? Reach out to us anytime at{' '}
          <a href="mailto:namaste@aayushaswad.com" className="text-brand-700 font-semibold underline">
            namaste@aayushaswad.com
          </a>{' '}
          or WhatsApp us at{' '}
          <span className="text-brand-700 font-semibold">+91 98765 43210</span>.
        </div>

      </div>
    </section>
  );
};
