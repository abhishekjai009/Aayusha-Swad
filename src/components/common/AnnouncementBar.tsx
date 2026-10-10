import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Copy, Check, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AnnouncementBar: React.FC = () => {
  const { banner, currentUser, currentView, setCurrentView } = useStore();
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!banner.isActive) return null;

  const handleCopyCode = () => {
    if (banner.couponCode) {
      navigator.clipboard.writeText(banner.couponCode);
      setCopied(true);
      addToast({
        type: 'success',
        title: 'Code Copied!',
        message: `Coupon code "${banner.couponCode}" copied to clipboard.`
      });
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 text-white text-xs sm:text-sm py-2 px-4 shadow-sm relative z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 mx-auto sm:mx-0 font-medium tracking-wide">
          <Sparkles className="w-4 h-4 text-brand-200 animate-spin-slow flex-shrink-0" />
          <span>{banner.text}</span>
          {banner.couponCode && (
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm transition-all border border-white/30"
              title="Click to copy code"
            >
              <span>{banner.couponCode}</span>
              {copied ? <Check className="w-3 h-3 text-emerald-200" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
        </div>

        {currentUser?.role === 'admin' && (
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
              className="inline-flex items-center gap-1 bg-warm-dark/80 hover:bg-warm-dark text-brand-300 text-xs px-2.5 py-1 rounded-md transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>{currentView === 'admin' ? 'Exit Admin Mode' : 'Admin Control Center'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
