import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Heart,
  Instagram, 
  Facebook, 
  Youtube,
  ArrowUp
} from 'lucide-react';
import { ProductCategory } from '../../types';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategoryFilter, setSelectedProductId, setActivePolicyModal } = useStore();

  const handleCategoryClick = (cat: ProductCategory) => {
    setSelectedCategoryFilter(cat);
    setSelectedProductId(null);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (view: 'home' | 'shop' | 'about' | 'contact' | 'track-order') => {
    setSelectedProductId(null);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C1917] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1 & 2: Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-400 flex items-center justify-center shadow-md">
                <span className="font-serif font-black text-xl text-white">AS</span>
              </div>
              <div>
                <h3 className="font-serif font-extrabold text-2xl text-white tracking-tight">Aayusha Swad</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-brand-400">Traditional Indian Snacks</p>
              </div>
            </div>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Crafting India's cherished traditional tastes with uncompromising purity. Made in small artisanal batches with 100% pure desi cow ghee, whole grains, and heirloom recipes passed down through generations.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-brand-500 hover:text-white flex items-center justify-center text-stone-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-brand-500 hover:text-white flex items-center justify-center text-stone-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-brand-500 hover:text-white flex items-center justify-center text-stone-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-white">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-brand-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop')} className="hover:text-brand-400 transition-colors">
                  All Snacks
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-brand-400 transition-colors">
                  Our Story & Heritage
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-brand-400 transition-colors">
                  Contact & Bulk Orders
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('track-order')} className="hover:text-brand-400 transition-colors">
                  Track Your Shipment
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Categories */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-white">Categories</h4>
            <ul className="space-y-2 text-xs">
              {(['Makhana', 'Thekua', 'Cookies', 'Namak Paare'] as const).map((cat) => (
                <li key={cat}>
                  <button onClick={() => handleCategoryClick(cat)} className="hover:text-brand-400 transition-colors">
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-white">Direct Connect</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>Bakers Kitchen, Patna & Mumbai Hub, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>namaste@aayushaswad.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© 2026 Aayusha Swad. All rights reserved.</span>
            <button
              onClick={() => setActivePolicyModal('privacy')}
              className="hover:text-stone-300 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActivePolicyModal('terms')}
              className="hover:text-stone-300 transition-colors"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setActivePolicyModal('shipping')}
              className="hover:text-stone-300 transition-colors"
            >
              Shipping Policy
            </button>
            <button
              onClick={() => setActivePolicyModal('refund')}
              className="hover:text-stone-300 transition-colors"
            >
              Refund & Returns
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Pure Desi Ghee Certified</span>
            </div>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
};
