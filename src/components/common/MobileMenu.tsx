import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Home, 
  ShoppingBag, 
  Info, 
  Phone, 
  Truck, 
  ShieldCheck, 
  Heart, 
  LogOut, 
  ChevronRight,
  Sparkles 
} from 'lucide-react';
import { ProductCategory } from '../../types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const {
    currentView,
    setCurrentView,
    setSelectedCategoryFilter,
    setSelectedProductId,
    currentUser,
    logout,
    setIsAuthModalOpen,
    wishlist
  } = useStore();

  if (!isOpen) return null;

  const categories: ProductCategory[] = ['Makhana', 'Thekua', 'Cookies', 'Namak Paare'];

  const handleNavigate = (view: typeof currentView) => {
    setSelectedProductId(null);
    setCurrentView(view);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (cat: ProductCategory) => {
    setSelectedCategoryFilter(cat);
    setSelectedProductId(null);
    setCurrentView('shop');
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col overflow-y-auto">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-warm-border flex items-center justify-between bg-[#FFFDF5]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-400 flex items-center justify-center shadow-sm">
              <span className="font-serif font-black text-white text-base">AS</span>
            </div>
            <div>
              <h2 className="font-serif font-extrabold text-stone-900 text-lg leading-tight">Aayusha Swad</h2>
              <p className="text-[10px] font-semibold text-brand-700 tracking-wider uppercase">Authentic Taste</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Status Bar */}
        <div className="p-4 bg-brand-50/50 border-b border-warm-border flex items-center justify-between">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-stone-800">{currentUser.name}</p>
                <p className="text-[10px] text-brand-700 font-medium">
                  {currentUser.role === 'admin' ? 'Store Administrator' : 'Customer Account'}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                setIsAuthModalOpen(true);
              }}
              className="w-full py-2 px-3 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Sign In / Demo Login</span>
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-1 flex-1">
          <button
            onClick={() => handleNavigate('home')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-colors ${
              currentView === 'home' ? 'bg-brand-50 text-brand-700' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Home className="w-4 h-4 text-brand-600" />
              <span>Home</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => {
              setSelectedCategoryFilter('All');
              handleNavigate('shop');
            }}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-colors ${
              currentView === 'shop' ? 'bg-brand-50 text-brand-700' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-brand-600" />
              <span>Shop All Snacks</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          {/* Category Accordion / List */}
          <div className="py-2 pl-3">
            <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase">
              Snack Categories
            </span>
            <div className="mt-2 space-y-1 pl-2 border-l-2 border-brand-200">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="w-full text-left py-2 px-2.5 rounded-lg text-xs font-medium text-stone-600 hover:text-brand-600 hover:bg-brand-50/50 flex items-center justify-between"
                >
                  <span>{cat}</span>
                  <span className="text-[10px] text-brand-600 font-semibold">View</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleNavigate('about')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-colors ${
              currentView === 'about' ? 'bg-brand-50 text-brand-700' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-brand-600" />
              <span>About Aayusha Swad</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => handleNavigate('contact')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-colors ${
              currentView === 'contact' ? 'bg-brand-50 text-brand-700' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-brand-600" />
              <span>Contact Us</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => handleNavigate('track-order')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-colors ${
              currentView === 'track-order' ? 'bg-brand-50 text-brand-700' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-brand-600" />
              <span>Track Your Order</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          {currentUser && (
            <button
              onClick={() => handleNavigate('profile')}
              className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>My Wishlist ({wishlist.length})</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNavigate('admin')}
              className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold bg-amber-50 text-amber-900 border border-amber-200 mt-2"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Admin Dashboard</span>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-600" />
            </button>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-warm-border bg-stone-50 space-y-2">
          {currentUser && (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center justify-center gap-2 border border-rose-100"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign Out</span>
            </button>
          )}

          <div className="pt-2 text-center text-[11px] text-stone-400">
            © 2026 Aayusha Swad. Made with Love.
          </div>
        </div>

      </div>
    </div>
  );
};
