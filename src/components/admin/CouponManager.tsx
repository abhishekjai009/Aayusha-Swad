import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types';
import { Plus, Tag, Trash2, Check, X, Percent, IndianRupee } from 'lucide-react';

export const CouponManager: React.FC = () => {
  const { coupons, addCoupon, toggleCouponActive, deleteCoupon } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'flat' as 'percentage' | 'flat',
    discountValue: 100,
    minOrderValue: 499,
    description: '',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    addCoupon({
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      minOrderValue: formData.minOrderValue,
      description: formData.description || `${formData.discountType === 'flat' ? `Flat ₹${formData.discountValue}` : `${formData.discountValue}%`} OFF on min ₹${formData.minOrderValue}`,
      isActive: formData.isActive
    });

    setFormData({
      code: '',
      discountType: 'flat',
      discountValue: 100,
      minOrderValue: 499,
      description: '',
      isActive: true
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-warm-border shadow-xs">
        <div>
          <h3 className="font-serif font-bold text-lg text-stone-900">
            Promotional Coupons & Discounts
          </h3>
          <p className="text-xs text-stone-500">
            Create coupon codes that customers can apply at checkout.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-soft flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className={`p-6 rounded-3xl border shadow-xs transition-all flex flex-col justify-between space-y-4 ${
              coupon.isActive ? 'bg-white border-warm-border' : 'bg-stone-50 border-stone-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-50 border border-brand-200 font-mono font-bold text-sm text-brand-800">
                  <Tag className="w-3.5 h-3.5 text-brand-600" />
                  <span>{coupon.code}</span>
                </div>

                <button
                  onClick={() => toggleCouponActive(coupon.code)}
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    coupon.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              <h4 className="font-serif font-bold text-base text-stone-900">
                {coupon.discountType === 'flat' ? `₹${coupon.discountValue} Flat Discount` : `${coupon.discountValue}% Percentage Discount`}
              </h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {coupon.description}
              </p>
              <p className="text-[11px] font-semibold text-stone-400 mt-2">
                Min. Order Value: ₹{coupon.minOrderValue}
              </p>
            </div>

            <div className="pt-3 border-t border-warm-border flex items-center justify-between text-xs">
              <button
                onClick={() => toggleCouponActive(coupon.code)}
                className="text-brand-700 font-bold hover:underline"
              >
                {coupon.isActive ? 'Deactivate' : 'Activate'}
              </button>

              <button
                onClick={() => deleteCoupon(coupon.code)}
                className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                title="Delete coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-warm-border overflow-hidden">
            <div className="p-6 bg-stone-50 border-b border-warm-border flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-stone-900">Create New Coupon Code</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI150"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl uppercase font-mono font-bold tracking-wider focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'flat' | 'percentage' })}
                    className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                  >
                    <option value="flat">Flat ₹ Amount</option>
                    <option value="percentage">% Percentage</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {formData.discountType === 'flat' ? 'Discount (₹) *' : 'Discount (%) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Minimum Order Value (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                  className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Festive discount on all Indian snacks"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-3 border-t border-warm-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-soft"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
