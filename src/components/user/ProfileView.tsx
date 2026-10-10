import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  LogOut, 
  ArrowRight, 
  ShoppingBag, 
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Phone,
  Plus,
  CreditCard,
  Building,
  Save
} from 'lucide-react';
import { ProductCard } from '../shop/ProductCard';
import { ShippingAddress } from '../../types';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    logout,
    orders,
    wishlist,
    products,
    addToCart,
    setCurrentView,
    setIsAuthModalOpen,
    saveAddress
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');
  
  // Address form modal/drawer
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<ShippingAddress>>({
    fullName: currentUser?.name || '',
    primaryPhone: currentUser?.phone || '',
    altPhone: '',
    email: currentUser?.email || '',
    houseFlat: '',
    streetLocality: '',
    landmark: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050'
  });

  if (!currentUser) {
    return (
      <div className="py-20 bg-[#FAFAF7] min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center p-8 bg-white rounded-3xl border border-warm-border shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-brand-600 flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-stone-900">Sign in to your account</h2>
          <p className="text-xs text-stone-500">
            Sign in with your phone number and 6-digit OTP to track previous snack orders and manage your account.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-soft transition-colors"
          >
            Sign In with OTP
          </button>
        </div>
      </div>
    );
  }

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach((it) => {
      addToCart(it.product, it.selectedWeight, it.quantity);
    });
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.houseFlat || !newAddress.streetLocality || !newAddress.city || !newAddress.pincode) return;
    
    await saveAddress({
      ...newAddress,
      fullName: newAddress.fullName || currentUser.name,
      primaryPhone: newAddress.primaryPhone || currentUser.phone
    });
    setShowAddressForm(false);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FAFAF7] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Profile Banner */}
        <div className="bg-white rounded-3xl border border-warm-border p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-400 text-white flex items-center justify-center font-serif font-black text-2xl shadow-md">
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif font-bold text-2xl text-stone-900">{currentUser.name || 'Valued Customer'}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 bg-brand-100 px-2.5 py-0.5 rounded-full">
                  {currentUser.role}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>OTP Verified</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                <span>📞 {currentUser.phone}</span>
                {currentUser.email && <span>• ✉️ {currentUser.email}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </button>
            )}

            <button
              onClick={logout}
              className="px-4 py-2.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-warm-border pb-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-warm-border'
            }`}
          >
            <Package className="w-4 h-4 text-brand-400" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'addresses'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-warm-border'
            }`}
          >
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>Saved Addresses ({currentUser.addresses?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'wishlist'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-warm-border'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>My Wishlist ({wishlist.length})</span>
          </button>
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-warm-border p-12 text-center space-y-3">
                <Package className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="font-serif font-bold text-base text-stone-800">No past snack orders found</h3>
                <p className="text-xs text-stone-500">Order your favorite traditional snacks to track them here.</p>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="px-5 py-2.5 bg-brand-500 text-white text-xs font-bold rounded-xl shadow-soft"
                >
                  Shop Fresh Snacks
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl border border-warm-border p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-warm-border">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base text-stone-900">{order.id}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'Cancelled' || order.status === 'Payment Failed'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-brand-100 text-brand-800'
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-[10px] text-stone-500 font-semibold bg-stone-100 px-2 py-0.5 rounded-md">
                          {order.paymentMethod} • {order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1">
                        Placed on {new Date(order.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} • Waybill: <span className="font-mono">{order.trackingNumber}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-stone-900">Total: ₹{order.total}</span>
                      <button
                        onClick={() => handleReorder(order)}
                        className="px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>

                  {/* Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items.map((it) => (
                      <div key={it.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50 border border-warm-border/60">
                        <img
                          src={it.product.images[0]}
                          alt={it.product.name}
                          className="w-12 h-12 object-cover rounded-xl border border-warm-border flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-stone-900 truncate">{it.product.name}</p>
                          <p className="text-[10px] text-stone-500">
                            {it.selectedWeight} × {it.quantity} (₹{it.price * it.quantity})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer with Tracking CTA */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-stone-500 pt-3 border-t border-warm-border gap-2">
                    <div>
                      <span>Delivering to: <strong>{order.shippingAddress.city}, {order.shippingAddress.state}</strong></span>
                      <span className="ml-2 text-stone-400">({order.estimatedDelivery})</span>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentView('track-order');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-brand-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Shipment Status →</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-stone-900">Delivery Addresses</h3>
              <button
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-soft flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddressForm ? 'Cancel' : 'Add New Address'}</span>
              </button>
            </div>

            {/* Address Creation Form */}
            {showAddressForm && (
              <form onSubmit={handleSaveNewAddress} className="bg-white rounded-3xl border border-warm-border p-6 shadow-xs space-y-4">
                <h4 className="font-bold text-sm text-stone-900 pb-2 border-b border-warm-border">New Delivery Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.fullName || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Primary Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={newAddress.primaryPhone || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, primaryPhone: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Alternate Mobile</label>
                    <input
                      type="tel"
                      value={newAddress.altPhone || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, altPhone: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={newAddress.email || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-stone-700 mb-1">House / Flat / Building *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.houseFlat || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, houseFlat: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Street / Locality *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.streetLocality || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, streetLocality: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Landmark</label>
                    <input
                      type="text"
                      value={newAddress.landmark || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.state || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newAddress.pincode || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Delivery Address</span>
                </button>
              </form>
            )}

            {/* List of Addresses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {currentUser.addresses && currentUser.addresses.length > 0 ? (
                currentUser.addresses.map((addr, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-warm-border p-6 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                        {idx === 0 ? 'Primary Delivery Address' : `Address #${idx + 1}`}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-stone-900">{addr.fullName}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {addr.houseFlat || addr.addressLine1}
                      {addr.streetLocality ? `, ${addr.streetLocality}` : ''}
                      {addr.landmark ? ` (Near ${addr.landmark})` : ''}
                      <br />
                      {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                    </p>
                    <p className="text-xs text-stone-500 pt-1">
                      📞 {addr.primaryPhone || addr.phone} {addr.altPhone && `• Alt: ${addr.altPhone}`}
                    </p>
                  </div>
                ))
              ) : (
                <div className="sm:col-span-2 bg-white rounded-3xl border border-warm-border p-8 text-center text-xs text-stone-500">
                  No saved delivery addresses yet. Add one above to save time during checkout.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-warm-border p-12 text-center space-y-3">
                <Heart className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="font-serif font-bold text-base text-stone-800">Your wishlist is empty</h3>
                <p className="text-xs text-stone-500">Click the heart icon on any snack card to save it for later.</p>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="px-5 py-2 bg-brand-500 text-white text-xs font-bold rounded-xl"
                >
                  Browse Snacks
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
