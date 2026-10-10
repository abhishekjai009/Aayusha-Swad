import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { addToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setIsSubscribed(true);
    addToast({
      type: 'success',
      title: 'Welcome to Aayusha Swad Family!',
      message: 'Thank you for subscribing. We will send you exclusive offers and new snack drop alerts.'
    });
  };

  return (
    <section className="py-16 sm:py-20 bg-warm-cream/60 border-b border-warm-border/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-accent-600" />
          <span>Stay in the Loop</span>
        </div>

        <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
          Get the latest from Aayusha Swad
        </h2>

        <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto mt-2 leading-relaxed">
          Be the first to hear about our fresh seasonal batches, festive snack boxes, secret family recipes, and exclusive discount codes.
        </p>

        {/* Form Container */}
        <div className="mt-8 max-w-md mx-auto">
          {isSubscribed ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>You're subscribed! Check your inbox for a special welcome treat.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-warm-border rounded-xl text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-soft hover:shadow-premium transition-all flex items-center justify-center gap-2 flex-shrink-0"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-stone-400 mt-3">
            No spam, ever. Unsubscribe with one click at any time.
          </p>
        </div>

      </div>
    </section>
  );
};
