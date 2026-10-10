import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Phone,
  RotateCcw
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { ordersApi } from '../../services/api';

export const OrderTrackingView: React.FC = () => {
  const { orders, getOrderById } = useStore();

  const [searchId, setSearchId] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('orderId') || (orders[0]?.id || 'AS-84920');
  });

  const [currentOrder, setCurrentOrder] = useState<Order | undefined>(() => getOrderById(searchId) || orders[0]);
  const [hasSearched, setHasSearched] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const fetchOrder = async (id: string) => {
    if (!id.trim()) return;
    setIsSearching(true);
    setHasSearched(true);

    // 1. Try local cache
    const local = getOrderById(id.trim());
    if (local) {
      setCurrentOrder(local);
    }

    // 2. Fetch authoritative status from backend API
    try {
      const res = await ordersApi.trackOrder(id.trim());
      if (res.success && res.order) {
        const o = res.order;
        const mapped: Order = {
          id: o.id,
          trackingNumber: o.tracking_number,
          date: o.created_at,
          items: (o.items || []).map((it: any) => ({
            id: it.id,
            productId: it.product_id,
            product: {
              id: it.product_id,
              name: it.product_name,
              images: [it.image_url || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800'],
              price: it.price
            } as any,
            selectedWeight: it.selected_weight,
            price: it.price,
            quantity: it.quantity
          })),
          shippingAddress: {
            fullName: o.customer_name,
            primaryPhone: o.primary_phone,
            phone: o.primary_phone,
            altPhone: o.alt_phone,
            email: o.email,
            houseFlat: o.house_flat,
            streetLocality: o.street_locality,
            addressLine1: `${o.house_flat}, ${o.street_locality}`,
            landmark: o.landmark,
            city: o.city,
            state: o.state,
            pincode: o.pincode
          },
          subtotal: o.subtotal,
          discount: o.discount,
          deliveryCharge: o.delivery_charge,
          total: o.total,
          appliedCoupon: o.applied_coupon,
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          status: o.order_status as OrderStatus,
          statusHistory: (o.statusHistory || []).map((h: any) => ({
            status: h.status as OrderStatus,
            timestamp: h.created_at,
            message: h.message
          })),
          courierPartner: o.courier_partner,
          estimatedDelivery: o.estimated_delivery
        };
        setCurrentOrder(mapped);
      } else if (!local) {
        setCurrentOrder(undefined);
      }
    } catch (err) {
      if (!local) {
        setCurrentOrder(undefined);
      }
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchId) {
      fetchOrder(searchId);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchId);
  };

  const steps: { status: OrderStatus; title: string; desc: string }[] = [
    { status: 'Confirmed', title: 'Order Confirmed', desc: 'Online payment verified & order booked' },
    { status: 'Processing', title: 'Fresh Preparation', desc: 'Handcrafted in 100% pure desi cow ghee' },
    { status: 'Packed', title: 'Nitrogen Vacuum Packed', desc: 'Sealed for peak freshness and hygiene' },
    { status: 'Shipped', title: 'In Transit with Courier', desc: 'Handed over to express logistics' },
    { status: 'Out for Delivery', title: 'Out for Delivery', desc: 'Delivery agent arriving at your address' },
    { status: 'Delivered', title: 'Delivered Safely', desc: 'Delivered with traditional love' }
  ];

  const getStepStatus = (stepStatus: OrderStatus) => {
    if (!currentOrder) return 'upcoming';

    if (currentOrder.status === 'Cancelled' || currentOrder.status === 'Payment Failed') {
      return 'cancelled';
    }

    const orderStatusOrder = ['Pending Payment', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIdx = orderStatusOrder.indexOf(currentOrder.status);
    const stepIdx = orderStatusOrder.indexOf(stepStatus);

    if (currentIdx === -1) return 'upcoming';
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'upcoming';
  };

  return (
    <div className="py-8 sm:py-16 bg-[#FAFAF7] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold">
            <Truck className="w-3.5 h-3.5 text-accent-600" />
            <span>Live Express Dispatch & Waybill Tracking</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Track Your Fresh Snack Shipment
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Enter your Aayusha Swad Order ID (e.g. AS-84920) or Waybill / Courier tracking number.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter Order ID (e.g. AS-84920)..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-warm-border rounded-2xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:border-brand-500 shadow-xs uppercase tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-soft transition-colors flex-shrink-0 flex items-center gap-2"
            >
              {isSearching ? 'Tracking...' : 'Track Order'}
            </button>
          </div>

          {/* Quick sample chips */}
          {orders.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-stone-500 flex-wrap">
              <span>Recent orders:</span>
              {orders.slice(0, 3).map((o) => (
                <button
                  type="button"
                  key={o.id}
                  onClick={() => {
                    setSearchId(o.id);
                    fetchOrder(o.id);
                  }}
                  className="font-mono text-brand-700 hover:underline font-bold"
                >
                  {o.id}
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Not Found Screen */}
        {hasSearched && !isSearching && !currentOrder && (
          <div className="bg-white rounded-3xl border border-warm-border p-12 text-center space-y-3 shadow-xs">
            <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-stone-900">Order Not Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We couldn't locate an order with ID or tracking number "{searchId}". Please check the details in your SMS or email confirmation.
            </p>
          </div>
        )}

        {/* Tracking Details Card */}
        {currentOrder && (
          <div className="space-y-6">
            
            {/* Status Overview Card */}
            <div className="bg-white rounded-3xl border border-warm-border p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-warm-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xl text-stone-900">{currentOrder.id}</span>
                    <span className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                      currentOrder.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : currentOrder.status === 'Cancelled' || currentOrder.status === 'Payment Failed'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-brand-100 text-brand-800'
                    }`}>
                      {currentOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Courier: <strong className="text-stone-700">{currentOrder.courierPartner || 'Delhivery Express'}</strong> • Waybill / Docket: <span className="font-mono font-semibold text-stone-800">{currentOrder.trackingNumber}</span>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-stone-400 uppercase font-bold tracking-wider">Estimated Delivery</span>
                  <p className="text-sm font-bold text-emerald-700 mt-0.5">{currentOrder.estimatedDelivery}</p>
                </div>
              </div>

              {/* Special alert if Payment Failed or Cancelled */}
              {(currentOrder.status === 'Payment Failed' || currentOrder.status === 'Cancelled') && (
                <div className="my-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Order Status: {currentOrder.status}</strong>
                    <span>
                      {currentOrder.status === 'Payment Failed' 
                        ? 'Payment was not confirmed. Please retry payment or contact support.' 
                        : 'This order has been cancelled.'}
                    </span>
                  </div>
                </div>
              )}

              {/* Multi-step Visual Timeline */}
              {currentOrder.status !== 'Cancelled' && currentOrder.status !== 'Payment Failed' && (
                <div className="py-8">
                  <div className="relative">
                    {/* Horizontal Progress Line for desktop */}
                    <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-stone-200 -z-0" />

                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 sm:gap-2 relative z-10">
                      {steps.map((step, idx) => {
                        const state = getStepStatus(step.status);

                        return (
                          <div key={step.status} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2.5">
                            {/* Dot / Icon */}
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-all ${
                                state === 'completed'
                                  ? 'bg-emerald-600 text-white'
                                  : state === 'active'
                                  ? 'bg-brand-500 text-white ring-4 ring-brand-200 animate-pulse'
                                  : 'bg-white border-2 border-stone-200 text-stone-400'
                              }`}
                            >
                              {state === 'completed' ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : (
                                <span>{idx + 1}</span>
                              )}
                            </div>

                            {/* Text info */}
                            <div>
                              <h4
                                className={`text-xs font-bold ${
                                  state === 'active' || state === 'completed'
                                    ? 'text-stone-900'
                                    : 'text-stone-400'
                                }`}
                              >
                                {step.title}
                              </h4>
                              <p className="text-[10px] text-stone-500 mt-0.5 max-w-[120px] sm:mx-auto hidden sm:block">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Status Activity Log */}
              {currentOrder.statusHistory && currentOrder.statusHistory.length > 0 && (
                <div className="pt-6 border-t border-warm-border">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                    Shipment Activity & Event Log:
                  </h4>
                  <div className="space-y-2.5">
                    {currentOrder.statusHistory.map((hist, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs bg-stone-50 p-2.5 rounded-xl border border-warm-border/60">
                        <Clock className="w-3.5 h-3.5 text-brand-600 mt-0.5 flex-shrink-0" />
                        <span className="font-semibold text-stone-800">{hist.message}</span>
                        <span className="text-[10px] text-stone-400 ml-auto flex-shrink-0">
                          {new Date(hist.timestamp).toLocaleString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Recipient & Ordered Items Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Delivery Address */}
              <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-xs space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-stone-900 pb-2 border-b border-warm-border">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  <span>Delivery Address</span>
                </div>
                <p className="text-stone-800 font-bold">{currentOrder.shippingAddress.fullName}</p>
                <p className="text-stone-600 leading-relaxed">
                  {currentOrder.shippingAddress.houseFlat || currentOrder.shippingAddress.addressLine1}
                  {currentOrder.shippingAddress.streetLocality ? `, ${currentOrder.shippingAddress.streetLocality}` : ''}
                  {currentOrder.shippingAddress.landmark ? ` (Near ${currentOrder.shippingAddress.landmark})` : ''}
                  <br />
                  {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - <strong>{currentOrder.shippingAddress.pincode}</strong>
                </p>
                <p className="text-stone-500 pt-1">
                  📞 Primary: <strong>{currentOrder.shippingAddress.primaryPhone || currentOrder.shippingAddress.phone}</strong>
                  {currentOrder.shippingAddress.altPhone && ` • Alt: ${currentOrder.shippingAddress.altPhone}`}
                </p>
              </div>

              {/* Items Summary & Payment */}
              <div className="bg-white p-6 rounded-3xl border border-warm-border shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between font-bold text-stone-900 pb-2 border-b border-warm-border">
                  <span>Ordered Snacks ({currentOrder.items.length})</span>
                  <span className="text-brand-700 font-extrabold text-sm">₹{currentOrder.total} ({currentOrder.paymentStatus})</span>
                </div>
                <div className="space-y-2 max-h-36 overflow-y-auto divide-y divide-warm-border/50">
                  {currentOrder.items.map((it) => (
                    <div key={it.id} className="pt-1.5 flex justify-between items-center">
                      <span className="truncate pr-2 font-medium text-stone-800">
                        {it.product.name} ({it.selectedWeight}) × {it.quantity}
                      </span>
                      <span className="font-bold flex-shrink-0 text-stone-900">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-warm-border flex items-center justify-between text-stone-500 text-[11px]">
                  <span>Payment Mode: <strong>{currentOrder.paymentMethod}</strong></span>
                  <span className="text-emerald-700 font-bold">{currentOrder.paymentStatus}</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
