import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, ShieldCheck, Truck, RefreshCcw, FileText } from 'lucide-react';

export const PolicyModal: React.FC = () => {
  const { activePolicyModal, setActivePolicyModal } = useStore();

  if (!activePolicyModal) return null;

  const content: Record<string, { title: string; icon: React.ReactNode; body: React.ReactNode }> = {
    privacy: {
      title: 'Privacy Policy',
      icon: <ShieldCheck className="w-5 h-5 text-brand-600" />,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            At <strong>Aayusha Swad</strong>, we treat your privacy with the utmost reverence. This policy outlines how we collect, protect, and utilize customer information when you browse and purchase from our store.
          </p>
          <h4 className="font-bold text-stone-900 text-sm">1. Information We Collect</h4>
          <p>
            We collect personal details necessary for processing orders and delivery: your name, shipping address, contact phone number, and email. Payment details (card numbers, UPI IDs) are processed through RBI-approved, PCI-DSS compliant payment gateways and are never stored on our servers.
          </p>
          <h4 className="font-bold text-stone-900 text-sm">2. Use of Information</h4>
          <p>
            Your details are used solely to fulfill your snack orders, communicate dispatch tracking updates via SMS/WhatsApp, and provide customer support. We never sell, rent, or trade your personal data to third-party advertisers.
          </p>
        </div>
      )
    },
    terms: {
      title: 'Terms & Conditions',
      icon: <FileText className="w-5 h-5 text-brand-600" />,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            Welcome to <strong>Aayusha Swad</strong>. By using our website and purchasing our authentic Indian snacks, you agree to comply with and be bound by the following terms.
          </p>
          <h4 className="font-bold text-stone-900 text-sm">1. Authentic Homemade Nature</h4>
          <p>
            Our snacks (Thekua, Makhana, Cookies, Namak Paare) are prepared in small artisanal batches using pure Desi Ghee and natural ingredients. Subtle variations in texture, color, and size are natural proof of handcrafted authenticity.
          </p>
          <h4 className="font-bold text-stone-900 text-sm">2. Pricing & Orders</h4>
          <p>
            All prices are listed in Indian Rupees (INR) inclusive of applicable taxes. We reserve the right to modify prices or discontinue items based on fresh ingredient seasonality without prior notice.
          </p>
        </div>
      )
    },
    shipping: {
      title: 'Shipping & Delivery Policy',
      icon: <Truck className="w-5 h-5 text-brand-600" />,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            We take extreme care in packing every order using food-grade vacuum-sealed pouches and sturdy corrugated protective boxes to ensure your snacks arrive with fresh, crispy crunch.
          </p>
          <h4 className="font-bold text-stone-900 text-sm">1. Dispatch & Timelines</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Orders are baked/roasted fresh and dispatched within 24 to 48 hours of order confirmation.</li>
            <li>Metro cities: Delivery within 24 to 48 hours after dispatch.</li>
            <li>Rest of India: Delivery within 3 to 5 business days.</li>
          </ul>
          <h4 className="font-bold text-stone-900 text-sm">2. Shipping Charges</h4>
          <p>
            Orders above ₹499 qualify for <strong>FREE Express Shipping</strong>. For orders below ₹499, a nominal shipping charge of ₹49 is applied.
          </p>
        </div>
      )
    },
    refund: {
      title: 'Refund & Return Policy',
      icon: <RefreshCcw className="w-5 h-5 text-brand-600" />,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            Your satisfaction and culinary delight are our highest priority. Because our products are perishable traditional food items, we follow a straightforward quality guarantee:
          </p>
          <h4 className="font-bold text-stone-900 text-sm">1. Freshness Guarantee & Damaged Transit</h4>
          <p>
            If your package arrived damaged, opened, or if you noticed any quality defect, please notify us within 48 hours of delivery with photos via WhatsApp (+91 98765 43210) or email (support@aayushaswad.com).
          </p>
          <h4 className="font-bold text-stone-900 text-sm">2. Instant Replacement or 100% Refund</h4>
          <p>
            In verified cases of transit damage or quality defect, we will immediately send a fresh replacement batch at zero cost or process a full 100% refund directly back to your original payment method within 3 to 5 business days.
          </p>
        </div>
      )
    }
  };

  const selected = content[activePolicyModal] || content.privacy;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setActivePolicyModal(null)}
      />

      <div className="relative max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-warm-border overflow-hidden">
        <div className="p-5 border-b border-warm-border flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
              {selected.icon}
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900">{selected.title}</h3>
          </div>
          <button
            onClick={() => setActivePolicyModal(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {selected.body}
        </div>

        <div className="p-4 border-t border-warm-border bg-stone-50 flex justify-end">
          <button
            onClick={() => setActivePolicyModal(null)}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
