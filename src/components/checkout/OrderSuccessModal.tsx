import React from 'react';
import { Order } from '../../types';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, Truck, Download, ArrowRight, Package } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const { setCurrentView } = useStore();
  const { addToast } = useToast();

  if (!order) return null;

  const handleTrackOrder = () => {
    onClose();
    setCurrentView('track-order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadInvoice = () => {
    addToast({
      type: 'info',
      title: 'Invoice Downloaded',
      message: `Tax invoice for order ${order.id} downloaded successfully.`
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm" />

      <div className="relative max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-warm-border overflow-hidden">
        
        {/* Top Celebration Banner */}
        <div className="p-8 text-center bg-gradient-to-b from-brand-50 to-white border-b border-warm-border relative">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-700">
            Order Placed with Love
          </span>

          <h2 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 tracking-tight mt-1">
            Thank You, {order.shippingAddress.fullName.split(' ')[0]}!
          </h2>

          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto mt-2 leading-relaxed">
            Your snacks are being freshly prepared and packed. An order confirmation has been dispatched to {order.shippingAddress.email}.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-warm-border shadow-xs text-xs font-mono font-bold text-stone-800">
            <span>Order ID:</span>
            <span className="text-brand-700">{order.id}</span>
          </div>
        </div>

        {/* Order Details Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[50vh] overflow-y-auto">
          
          {/* Tracking & Delivery Estimate */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-warm-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Estimated Delivery</p>
                <p className="text-[11px] text-stone-500">{order.estimatedDelivery}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              {order.status}
            </span>
          </div>

          {/* Items summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Items Ordered:</h4>
            <div className="divide-y divide-warm-border/60">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded-lg border border-warm-border"
                    />
                    <div>
                      <p className="font-semibold text-stone-900">{item.product.name}</p>
                      <p className="text-[10px] text-stone-500">
                        {item.selectedWeight} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-amber-200/80 text-xs space-y-1">
            <p className="font-bold text-stone-900">Delivering to:</p>
            <p className="text-stone-600 leading-relaxed">
              {order.shippingAddress.fullName} • {order.shippingAddress.primaryPhone || order.shippingAddress.phone}
              {order.shippingAddress.altPhone ? ` (Alt: ${order.shippingAddress.altPhone})` : ''}
              <br />
              {order.shippingAddress.houseFlat || order.shippingAddress.addressLine1}
              {order.shippingAddress.streetLocality ? `, ${order.shippingAddress.streetLocality}` : (order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : '')}
              {order.shippingAddress.landmark ? ` (Near ${order.shippingAddress.landmark})` : ''}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
          </div>

          {/* Amount Paid */}
          <div className="flex justify-between items-center text-sm font-bold text-stone-900 pt-2 border-t border-warm-border">
            <span>Total Amount Paid ({order.paymentMethod}):</span>
            <span className="text-brand-700 text-lg">₹{order.total}</span>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-6 bg-stone-50 border-t border-warm-border flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleDownloadInvoice}
            className="w-full sm:w-auto flex-1 py-3 px-4 bg-white hover:bg-stone-100 border border-warm-border text-stone-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Invoice</span>
          </button>

          <button
            onClick={handleTrackOrder}
            className="w-full sm:w-auto flex-1 py-3 px-4 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-soft flex items-center justify-center gap-2 transition-colors"
          >
            <span>Track Live Shipment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
