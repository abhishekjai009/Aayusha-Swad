import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductManager } from './ProductManager';
import { OrderManager } from './OrderManager';
import { CouponManager } from './CouponManager';
import { ReviewModerator } from './ReviewModerator';
import { MessageInbox } from './MessageInbox';
import { InventoryManager } from './InventoryManager';
import { PaymentLogViewer } from './PaymentLogViewer';
import { 
  ShieldCheck, 
  ShoppingBag, 
  Package, 
  Tag, 
  Star, 
  Mail, 
  IndianRupee, 
  TrendingUp, 
  RotateCcw, 
  ArrowLeft,
  Sparkles,
  Megaphone,
  Layers,
  CreditCard
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    coupons,
    messages,
    banner,
    updateBanner,
    resetToDemoData,
    setCurrentView
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'inventory' | 'payments' | 'coupons' | 'reviews' | 'messages' | 'banner'>('products');
  const [bannerText, setBannerText] = useState(banner.text);
  const [bannerCoupon, setBannerCoupon] = useState(banner.couponCode || '');

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    updateBanner({
      ...banner,
      text: bannerText,
      couponCode: bannerCoupon
    });
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FAFAF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-warm-border shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-brand-400 flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 tracking-tight">
                  Admin Control Center
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage products, live customer orders, coupons, customer reviews, and homepage announcements.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('Reset all catalog products, coupons, and orders to fresh seed data?')) {
                  resetToDemoData();
                }
              }}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              title="Reset products to initial demo set"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>Reset Demo Data</span>
            </button>

            <button
              onClick={() => setCurrentView('home')}
              className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-soft flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </button>
          </div>
        </div>

        {/* Analytics KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-warm-border shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-400 text-xs font-bold uppercase tracking-wider">
              <span>Total Revenue</span>
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-stone-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>From {totalOrdersCount} customer orders</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-warm-border shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-400 text-xs font-bold uppercase tracking-wider">
              <span>Customer Orders</span>
              <Package className="w-4 h-4 text-brand-600" />
            </div>
            <p className="text-2xl font-black text-stone-900">{totalOrdersCount}</p>
            <p className="text-[11px] text-stone-500">Live order fulfillment queue</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-warm-border shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-400 text-xs font-bold uppercase tracking-wider">
              <span>Average Order Value</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-stone-900">₹{averageOrderValue}</p>
            <p className="text-[11px] text-stone-500">Average spend per basket</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-warm-border shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-400 text-xs font-bold uppercase tracking-wider">
              <span>Active Products</span>
              <ShoppingBag className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-stone-900">{products.length}</p>
            <p className="text-[11px] text-stone-500">Across 4 core categories</p>
          </div>
        </div>

        {/* Dashboard Tabs Header */}
        <div className="flex border-b border-warm-border overflow-x-auto scrollbar-none gap-2 pb-2">
          {[
            { id: 'products', label: 'Snack Products', icon: <ShoppingBag className="w-4 h-4" />, count: products.length },
            { id: 'orders', label: 'Orders & Dispatch', icon: <Package className="w-4 h-4" />, count: orders.length },
            { id: 'inventory', label: 'Inventory & Stock', icon: <Layers className="w-4 h-4" /> },
            { id: 'payments', label: 'Payment Logs', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'coupons', label: 'Coupons & Promos', icon: <Tag className="w-4 h-4" />, count: coupons.length },
            { id: 'reviews', label: 'Customer Reviews', icon: <Star className="w-4 h-4" /> },
            { id: 'messages', label: 'Inquiries Inbox', icon: <Mail className="w-4 h-4" />, count: unreadMessagesCount || undefined },
            { id: 'banner', label: 'Banner & Announcements', icon: <Megaphone className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white hover:bg-stone-50 text-stone-600 border border-warm-border'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div>
          {activeTab === 'products' && <ProductManager />}
          {activeTab === 'orders' && <OrderManager />}
          {activeTab === 'inventory' && <InventoryManager />}
          {activeTab === 'payments' && <PaymentLogViewer />}
          {activeTab === 'coupons' && <CouponManager />}
          {activeTab === 'reviews' && <ReviewModerator />}
          {activeTab === 'messages' && <MessageInbox />}

          {activeTab === 'banner' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-border shadow-xs max-w-2xl space-y-6">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Header Announcement Bar Editor
                </h3>
                <p className="text-xs text-stone-500">
                  Changes made here update the top promotional ribbon instantly.
                </p>
              </div>

              <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Announcement Banner Text
                  </label>
                  <textarea
                    rows={2}
                    value={bannerText}
                    onChange={(e) => setBannerText(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Promoted Coupon Code
                  </label>
                  <input
                    type="text"
                    value={bannerCoupon}
                    onChange={(e) => setBannerCoupon(e.target.value.toUpperCase())}
                    placeholder="e.g. SWAD100"
                    className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl uppercase font-mono font-bold tracking-wider focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-soft transition-colors"
                  >
                    Save Banner
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
