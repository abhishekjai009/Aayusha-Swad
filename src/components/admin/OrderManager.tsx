import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { 
  Search, 
  Eye, 
  Truck, 
  Check, 
  Clock, 
  X, 
  AlertCircle, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Save, 
  ShieldCheck 
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const OrderManager: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Edit details inside modal
  const [editCourier, setEditCourier] = useState('');
  const [editTracking, setEditTracking] = useState('');
  const [editEstimatedDelivery, setEditEstimatedDelivery] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses: OrderStatus[] = [
    'Pending Payment',
    'Payment Failed',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Refund Initiated',
    'Refunded'
  ];

  const courierOptions = [
    'Delhivery Express',
    'Blue Dart Express',
    'DTDC Courier',
    'Xpressbees',
    'Shadowfax'
  ];

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    if (paymentFilter !== 'All' && o.paymentStatus !== paymentFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const addr = o.shippingAddress;
      return (
        o.id.toLowerCase().includes(q) ||
        addr.fullName.toLowerCase().includes(q) ||
        (addr.primaryPhone || addr.phone || '').includes(q) ||
        (addr.altPhone || '').includes(q) ||
        addr.city.toLowerCase().includes(q) ||
        o.trackingNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setEditCourier(order.courierPartner || 'Delhivery Express');
    setEditTracking(order.trackingNumber);
    setEditEstimatedDelivery(order.estimatedDelivery);
    setStatusNote('');
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(true);
    await updateOrderStatus(orderId, newStatus, statusNote || `Status updated to ${newStatus}`);
    setIsUpdating(false);

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus
      });
    }
  };

  const handleSaveFulfillmentDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    try {
      await adminApi.updateOrderStatus(selectedOrder.id, {
        courierPartner: editCourier,
        trackingNumber: editTracking,
        estimatedDelivery: editEstimatedDelivery,
        note: `Courier updated to ${editCourier} (${editTracking})`
      });

      addToast({
        type: 'success',
        title: 'Dispatch Details Saved',
        message: `Waybill ${editTracking} saved for order ${selectedOrder.id}.`
      });

      setSelectedOrder({
        ...selectedOrder,
        courierPartner: editCourier,
        trackingNumber: editTracking,
        estimatedDelivery: editEstimatedDelivery
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update dispatch details.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-warm-border shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order ID, name, phone, city, or waybill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold text-stone-700 bg-stone-50 border border-warm-border rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="All">All Order Statuses ({orders.length})</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s} ({orders.filter((o) => o.status === s).length})
              </option>
            ))}
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="text-xs font-semibold text-stone-700 bg-stone-50 border border-warm-border rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="All">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-warm-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-warm-border text-stone-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer & Contact</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-border/60 text-stone-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    No customer orders match your query.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const addr = order.shippingAddress;
                  return (
                    <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-stone-900 block">{order.id}</span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(order.date).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-stone-900">{addr.fullName}</p>
                        <p className="text-[10px] text-stone-500 font-mono">
                          {addr.primaryPhone || addr.phone}
                          {addr.altPhone && ` • Alt: ${addr.altPhone}`}
                        </p>
                        <p className="text-[10px] text-stone-400">{addr.city}, {addr.state}</p>
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-800">
                        {order.items.reduce((acc, it) => acc + it.quantity, 0)} snacks
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        ₹{order.total}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 rounded-md text-stone-700 block w-max">
                          {order.paymentMethod}
                        </span>
                        <span className={`text-[10px] font-bold ${
                          order.paymentStatus === 'Paid' ? 'text-emerald-700' : order.paymentStatus === 'Failed' ? 'text-rose-700' : 'text-amber-700'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`text-xs font-bold rounded-xl px-2.5 py-1 border transition-colors cursor-pointer ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : order.status === 'Shipped' || order.status === 'Out for Delivery'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : order.status === 'Cancelled' || order.status === 'Payment Failed'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenDetailModal(order)}
                          className="px-2.5 py-1.5 hover:bg-stone-100 text-stone-600 hover:text-brand-700 rounded-xl transition-colors font-semibold text-[11px] inline-flex items-center gap-1 border border-warm-border"
                          title="View Complete Customer & Delivery Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Order Detail & Dispatch Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-warm-border overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#FFFDF5] to-[#FEF9E7] border-b border-warm-border flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-extrabold text-xl text-stone-900">
                    Order Inspection: {selectedOrder.id}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-2.5 py-0.5 rounded-full">
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Placed on {new Date(selectedOrder.date).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Customer & Complete Delivery Details */}
              <div className="p-4 rounded-2xl bg-warm-cream/60 border border-warm-border space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-warm-border/60">
                  <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    <span>Customer & Delivery Details</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">Verified Customer</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Recipient</span>
                    <strong className="text-stone-800 text-sm">{selectedOrder.shippingAddress.fullName}</strong>
                    <p className="text-stone-600 mt-1 leading-relaxed">
                      {selectedOrder.shippingAddress.houseFlat || selectedOrder.shippingAddress.addressLine1}
                      <br />
                      {selectedOrder.shippingAddress.streetLocality || selectedOrder.shippingAddress.addressLine2}
                      {selectedOrder.shippingAddress.landmark && <><br /><span className="text-stone-400">Near: {selectedOrder.shippingAddress.landmark}</span></>}
                      <br />
                      <strong>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</strong>
                    </p>
                  </div>
                  <div className="space-y-1 sm:border-l sm:border-warm-border/60 sm:pl-4">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Contact Details</span>
                    <p className="text-stone-700 font-semibold">
                      Primary: <span className="font-mono">{selectedOrder.shippingAddress.primaryPhone || selectedOrder.shippingAddress.phone}</span>
                    </p>
                    {selectedOrder.shippingAddress.altPhone && (
                      <p className="text-stone-700 font-semibold">
                        Alternate: <span className="font-mono">{selectedOrder.shippingAddress.altPhone}</span>
                      </p>
                    )}
                    <p className="text-stone-600">
                      Email: <span className="text-stone-800 font-medium">{selectedOrder.shippingAddress.email}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Items in this Order */}
              <div className="space-y-2">
                <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                  Ordered Items ({selectedOrder.items.length})
                </span>
                <div className="divide-y divide-warm-border/60 border border-warm-border rounded-2xl overflow-hidden bg-stone-50/50">
                  {selectedOrder.items.map((it) => (
                    <div key={it.id} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.product.images[0]}
                          alt={it.product.name}
                          className="w-10 h-10 object-cover rounded-lg border border-warm-border"
                        />
                        <div>
                          <p className="font-semibold text-stone-900">{it.product.name}</p>
                          <p className="text-[10px] text-stone-500">
                            {it.selectedWeight} × {it.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courier & Dispatch Form */}
              <form onSubmit={handleSaveFulfillmentDetails} className="p-4 rounded-2xl bg-stone-50 border border-warm-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-brand-600" />
                    <span>Courier & Waybill Tracking Update</span>
                  </span>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-3 py-1 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    <span>Save Dispatch</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Courier Partner</label>
                    <select
                      value={editCourier}
                      onChange={(e) => setEditCourier(e.target.value)}
                      className="w-full p-2 bg-white border border-warm-border rounded-xl font-semibold"
                    >
                      {courierOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Waybill / Docket Number</label>
                    <input
                      type="text"
                      value={editTracking}
                      onChange={(e) => setEditTracking(e.target.value)}
                      placeholder="e.g. DEL-889102"
                      className="w-full p-2 bg-white border border-warm-border rounded-xl font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Estimated Delivery</label>
                    <input
                      type="text"
                      value={editEstimatedDelivery}
                      onChange={(e) => setEditEstimatedDelivery(e.target.value)}
                      placeholder="e.g. 2 to 3 business days"
                      className="w-full p-2 bg-white border border-warm-border rounded-xl"
                    />
                  </div>
                </div>
              </form>

              {/* Status Update Trigger */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] block">
                  Update Fulfillment Lifecycle Status:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {statuses.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatusChange(selectedOrder.id, s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedOrder.status === s
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'bg-white border border-warm-border text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="space-y-1.5 pt-2 border-t border-warm-border">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-stone-800">₹{selectedOrder.subtotal}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({selectedOrder.appliedCoupon || 'Coupon'}):</span>
                    <span>-₹{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping & Packaging:</span>
                  <span>₹{selectedOrder.deliveryCharge}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t border-warm-border">
                  <span>Total Amount Paid ({selectedOrder.paymentMethod}):</span>
                  <span className="text-brand-700 text-lg">₹{selectedOrder.total}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
