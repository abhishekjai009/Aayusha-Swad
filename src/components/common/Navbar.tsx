import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronDown,
  Truck,
  Sparkles,
  LogOut
} from 'lucide-react';
import { ProductCategory } from '../../types';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { 
    currentView, 
    setCurrentView, 
    cartCount, 
    setIsCartOpen, 
    wishlist, 
    setIsSearchOpen, 
    setIsAuthModalOpen, 
    currentUser, 
    logout,
    setSelectedCategoryFilter,
    setSelectedProductId
  } = useStore();

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const categories: ProductCategory[] = ['Makhana', 'Thekua', 'Cookies', 'Namak Paare'];

  const handleNavClick = (view: typeof currentView) => {
    setSelectedProductId(null);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (cat: ProductCategory) => {
    setSelectedCategoryFilter(cat);
    setSelectedProductId(null);
    setCurrentView('shop');
    setIsCategoryDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-warm-border/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 text-stone-700 hover:text-brand-600 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <div 
              onClick={() => handleNavClick('home')}
              className="cursor-pointer flex items-center gap-3 group select-none"
            >
              {/* Logo Emblem */}
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-400 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
                <span className="font-serif font-black text-xl text-white tracking-wider">AS</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-extrabold text-2xl tracking-tight text-stone-900 group-hover:text-brand-600 transition-colors">
                  Aayusha Swad
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-brand-700 -mt-1 flex items-center gap-1">
                  <span>Traditional Indian Snacks</span>
                  <Sparkles className="w-2.5 h-2.5 text-accent-500" />
                </span>
              </div>
            </div>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-700">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-brand-600 transition-colors py-1 relative ${
                currentView === 'home' ? 'text-brand-600 font-semibold' : ''
              }`}
            >
              Home
              {currentView === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                setSelectedCategoryFilter('All');
                handleNavClick('shop');
              }}
              className={`hover:text-brand-600 transition-colors py-1 relative ${
                currentView === 'shop' ? 'text-brand-600 font-semibold' : ''
              }`}
            >
              Shop All
              {currentView === 'shop' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>

            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsCategoryDropdownOpen(true)}
              onMouseLeave={() => setIsCategoryDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1 py-1 hover:text-brand-600 transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-brand-600" />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 w-56 pt-2 z-50">
                  <div className="bg-white rounded-2xl shadow-elevated border border-warm-border p-2 space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl text-stone-700 hover:text-brand-700 hover:bg-brand-50 transition-colors font-medium flex items-center justify-between text-sm"
                      >
                        <span>{cat}</span>
                        <span className="text-xs text-brand-600 font-semibold">Explore →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('about')}
              className={`hover:text-brand-600 transition-colors py-1 relative ${
                currentView === 'about' ? 'text-brand-600 font-semibold' : ''
              }`}
            >
              About Us
              {currentView === 'about' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`hover:text-brand-600 transition-colors py-1 relative ${
                currentView === 'contact' ? 'text-brand-600 font-semibold' : ''
              }`}
            >
              Contact
              {currentView === 'contact' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('track-order')}
              className={`inline-flex items-center gap-1.5 hover:text-brand-600 transition-colors py-1 relative ${
                currentView === 'track-order' ? 'text-brand-600 font-semibold' : ''
              }`}
            >
              <Truck className="w-4 h-4 text-brand-600" />
              <span>Track Order</span>
            </button>
          </nav>

          {/* Right: Actions (Search, Wishlist, Cart, Profile/Admin) */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-stone-700 hover:text-brand-600 hover:bg-brand-50/80 rounded-full transition-colors relative"
              aria-label="Search Snacks"
              title="Search Snacks (Cmd+K)"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => {
                if (currentUser) {
                  setCurrentView('profile');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="p-2.5 text-stone-700 hover:text-rose-600 hover:bg-rose-50/80 rounded-full transition-colors relative hidden sm:flex"
              aria-label="View Wishlist"
              title="Your Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon with Counter */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 text-stone-700 hover:text-brand-600 hover:bg-brand-50/80 rounded-full transition-colors relative"
              aria-label="Open Cart Drawer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-brand-500 text-white rounded-full text-xs font-bold flex items-center justify-center ring-2 ring-white shadow-sm animate-pulse-subtle">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Admin Action */}
            <div className="relative">
              {currentUser ? (
                <div 
                  className="relative"
                  onMouseEnter={() => setIsUserDropdownOpen(true)}
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      if (currentUser.role === 'admin') {
                        setCurrentView(currentView === 'admin' ? 'home' : 'admin');
                      } else {
                        setCurrentView('profile');
                      }
                    }}
                    className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border transition-all ${
                      currentUser.role === 'admin'
                        ? 'border-brand-400 bg-brand-50 text-brand-800'
                        : 'border-warm-border bg-white text-stone-800 hover:border-brand-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold max-w-[85px] sm:max-w-[110px] truncate hidden sm:inline">
                      {currentUser.role === 'admin' ? 'Admin Panel' : currentUser.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  </button>

                  {/* Profile Menu Dropdown */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 top-full pt-2 w-48 z-50">
                      <div className="bg-white rounded-2xl shadow-elevated border border-warm-border p-2 space-y-1">
                        <div className="px-3 py-2 border-b border-warm-border mb-1">
                          <p className="text-xs font-semibold text-stone-900">{currentUser.name}</p>
                          <p className="text-[10px] text-stone-500 truncate">{currentUser.email}</p>
                        </div>

                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => {
                              setCurrentView('admin');
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-brand-700 hover:bg-brand-50 flex items-center gap-2"
                          >
                            <ShieldCheck className="w-4 h-4 text-brand-600" />
                            Admin Dashboard
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setCurrentView('profile');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                        >
                          <User className="w-4 h-4 text-stone-500" />
                          My Account & Orders
                        </button>

                        <button
                          onClick={() => {
                            setCurrentView('track-order');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                        >
                          <Truck className="w-4 h-4 text-stone-500" />
                          Track My Order
                        </button>

                        <button
                          onClick={() => {
                            logout();
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-warm-border mt-1"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all shadow-sm hover:shadow"
                >
                  <User className="w-3.5 h-3.5 text-brand-400" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
