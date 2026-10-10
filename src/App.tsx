import React, { useState } from 'react';
import { useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { MobileMenu } from './components/common/MobileMenu';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { SearchModal } from './components/common/SearchModal';
import { CartDrawer } from './components/common/CartDrawer';
import { AuthModal } from './components/common/AuthModal';
import { PolicyModal } from './components/common/PolicyModal';

// Home components
import { HeroSection } from './components/home/HeroSection';
import { CategorySection } from './components/home/CategorySection';
import { FeaturedSection } from './components/home/FeaturedSection';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { BrandStory } from './components/home/BrandStory';
import { BestSellers } from './components/home/BestSellers';
import { Testimonials } from './components/home/Testimonials';
import { PromoBanner } from './components/home/PromoBanner';
import { FaqSection } from './components/home/FaqSection';
import { Newsletter } from './components/home/Newsletter';

// Dedicated views
import { ShopView } from './components/shop/ShopView';
import { ProductDetailView } from './components/product/ProductDetailView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { OrderTrackingView } from './components/tracking/OrderTrackingView';
import { ProfileView } from './components/user/ProfileView';
import { AboutView } from './components/home/AboutView';
import { ContactView } from './components/home/ContactView';
import { AdminDashboard } from './components/admin/AdminDashboard';

export const App: React.FC = () => {
  const { currentView } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#292524] selection:bg-brand-200 selection:text-brand-900">
      
      {/* Toast Notification Layer */}
      <ToastContainer />

      {/* Top Promotional Bar */}
      <AnnouncementBar />

      {/* Sticky Main Navigation */}
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection />
            <CategorySection />
            <FeaturedSection />
            <WhyChooseUs />
            <BrandStory />
            <BestSellers />
            <Testimonials />
            <PromoBanner />
            <FaqSection />
            <Newsletter />
          </>
        )}

        {currentView === 'shop' && <ShopView />}
        {currentView === 'product-detail' && <ProductDetailView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'track-order' && <OrderTrackingView />}
        {currentView === 'profile' && <ProfileView />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <SearchModal />
      <CartDrawer />
      <AuthModal />
      <PolicyModal />

    </div>
  );
};

export default App;
