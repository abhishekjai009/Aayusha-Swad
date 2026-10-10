import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderSuccessModal } from './OrderSuccessModal';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  Building2, 
  Tag, 
  Check, 
  ArrowRight, 
  ShoppingBag,
  MapPin,
  Lock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Wallet
} from 'lucide-react';
import { Order, ShippingAddress } from '../../types';
import { ordersApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryCharge,
    discountAmount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    currentUser,
    confirmBackendOrder,
    setCurrentView,
    setIsAuthModalOpen,
    saveAddress
  } = useStore();
  const { addToast } = useToast();

  // Form State
  const defaultAddress = currentUser?.addresses?.[0];

  const [fullName, setFullName] = useState(defaultAddress?.fullName || currentUser?.name || '');
  const [primaryPhone, setPrimaryPhone] = useState(currentUser?.phone || defaultAddress?.primaryPhone || '');
  const [altPhone, setAltPhone] = useState(defaultAddress?.altPhone || '');
  const [email, setEmail] = useState(defaultAddress?.email || currentUser?.email || '');
  const [houseFlat, setHouseFlat] = useState(defaultAddress?.houseFlat || '');
  const [streetLocality, setStreetLocality] = useState(defaultAddress?.streetLocality || '');
  const [landmark, setLandmark] = useState(defaultAddress?.landmark || '');
  const [city, setCity] = useState(defaultAddress?.city || 'Mumbai');
  const [state, setState] = useState(defaultAddress?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(defaultAddress?.pincode || '400050');
  const [shouldSaveAddress, setShouldSaveAddress] = useState(true);

  // Delivery & payment selections
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Netbanking' | 'Wallet'>('UPI');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Execution states
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Sync with current user profile when user logs in
  useEffect(() => {
    if (currentUser) {
      if (!primaryPhone && currentUser.phone) setPrimaryPhone(currentUser.phone);
      if (!fullName && currentUser.name) setFullName(currentUser.name);
      if (!email && currentUser.email) setEmail(currentUser.email);
      if (currentUser.addresses && currentUser.addresses.length > 0) {
        const addr = currentUser.addresses[0];
        if (!houseFlat && addr.houseFlat) setHouseFlat(addr.houseFlat);
        if (!streetLocality && addr.streetLocality) setStreetLocality(addr.streetLocality);
        if (!city && addr.city) setCity(addr.city);
        if (!state && addr.state) setState(addr.state);
        if (!pincode && addr.pincode) setPincode(addr.pincode);
        if (!altPhone && addr.altPhone) setAltPhone(addr.altPhone);
      }
    }
  }, [currentUser]);

  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="py-20 bg-[#FAFAF7] min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center p-8 bg-white rounded-3xl border border-warm-border shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-brand-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-stone-900">Your basket is empty</h2>
          <p className="text-xs text-stone-500">
            Please add some of our traditional snacks to your basket before proceeding to checkout.
          </p>
          <button
            onClick={() => setCurrentView('shop')}
            className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-soft transition-colors"
          >
            Explore Snacks Catalog
          </button>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponInput('');
      setCouponError('');
    } else {
      setCouponError(res.message);
    }
  };

  const finalDeliveryCharge = expressDelivery ? 99 : deliveryCharge;
  const finalPayable = Math.max(1, cartSubtotal - discountAmount + finalDeliveryCharge);

  // Validate form fields
  const validateForm = (): boolean => {
    setCheckoutError('');

    if (!fullName.trim()) {
      setCheckoutError('Please enter your full name.');
      return false;
    }

    if (!primaryPhone.trim() || primaryPhone.replace(/\D/g, '').length < 10) {
      setCheckoutError('Please enter a valid 10-digit primary mobile number.');
      return false;
    }

    if (altPhone.trim() && altPhone.replace(/\D/g, '').length < 10) {
      setCheckoutError('Please enter a valid alternate mobile number or leave it blank.');
      return false;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setCheckoutError('Please enter a valid email address to receive your order confirmation.');
      return false;
    }

    if (!houseFlat.trim()) {
      setCheckoutError('Please specify House/Flat/Building details.');
      return false;
    }

    if (!streetLocality.trim()) {
      setCheckoutError('Please specify Street, Locality or Area.');
      return false;
    }

    if (!city.trim() || !state.trim()) {
      setCheckoutError('City and State are required for express delivery dispatch.');
      return false;
    }

    if (!pincode.trim() || !/^\d{6}$/.test(pincode.trim())) {
      setCheckoutError('Please enter a valid 6-digit Indian PIN code.');
      return false;
    }

    return true;
  };

  // Main payment checkout handler
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Check if user is logged in with verified OTP
    if (!currentUser) {
      addToast({
        type: 'warning',
        title: 'Phone Verification Required',
        message: 'Please verify your mobile number with a quick 6-digit OTP before paying.'
      });
      setIsAuthModalOpen(true);
      return;
    }

    setIsProcessing(true);
    setCheckoutError('');

    try {
      // 1. Save address to account if checked
      if (shouldSaveAddress) {
        saveAddress({
          fullName,
          primaryPhone,
          altPhone,
          email,
          houseFlat,
          streetLocality,
          landmark,
          city,
          state,
          pincode,
          addressLine1: `${houseFlat}, ${streetLocality}`
        });
      }

      // 2. Request backend to create Razorpay Payment Order
      const orderPayload = {
        customerName: fullName.trim(),
        primaryPhone: primaryPhone.trim(),
        altPhone: altPhone.trim() || undefined,
        email: email.trim().toLowerCase(),
        houseFlat: houseFlat.trim(),
        streetLocality: streetLocality.trim(),
        landmark: landmark.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        items: cart.map(item => ({
          productId: item.productId,
          selectedWeight: item.selectedWeight,
          quantity: item.quantity
        })),
        couponCode: appliedCoupon?.code,
        expressDelivery
      };

      const gatewayOrderRes = await ordersApi.createPaymentOrder(orderPayload);

      if (!gatewayOrderRes.success) {
        throw new Error(gatewayOrderRes.error || 'Failed to initialize payment order on server.');
      }

      const { orderId, razorpayOrderId, amount, currency, keyId } = gatewayOrderRes;

      // 3. Initiate Razorpay Checkout Modal or Simulation
      if (window.Razorpay && !keyId.startsWith('rzp_test_AayushaSwad')) {
        // Real Razorpay Checkout flow
        const options = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: 'Aayusha Swad',
          description: `Fresh Homemade Snacks Order #${orderId}`,
          order_id: razorpayOrderId,
          prefill: {
            name: fullName,
            email: email,
            contact: primaryPhone
          },
          theme: {
            color: '#D97706'
          },
          handler: async (response: any) => {
            try {
              // 4. Verify payment signature on backend
              const verifyRes = await ordersApi.verifyPayment({
                orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                paymentMethod: paymentMethod
              });

              if (verifyRes.success && verifyRes.order) {
                confirmBackendOrder(verifyRes.order);
                setPlacedOrder(verifyRes.order);
              } else {
                setCheckoutError(verifyRes.message || 'Payment signature verification failed.');
              }
            } catch (err: any) {
              setCheckoutError(err.message || 'Error verifying payment signature with server.');
            } finally {
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: async () => {
              await ordersApi.notifyPaymentFailed(orderId, 'Customer dismissed Razorpay payment interface.');
              setIsProcessing(false);
              addToast({
                type: 'warning',
                title: 'Payment Dismissed',
                message: 'Your payment was not completed. You can retry anytime.'
              });
            }
          }
        };

        const rzpInstance = new window.Razorpay(options);
        rzpInstance.open();
      } else {
        // Test Simulation / Sandbox Mode
        // Calls the server-side payment simulator which verifies real cryptographic HMAC signatures
        const simRes = await ordersApi.simulatePayment(orderId, paymentMethod);
        if (simRes.success && simRes.order) {
          confirmBackendOrder(simRes.order);
          setPlacedOrder(simRes.order);
        } else {
          setCheckoutError(simRes.message || 'Payment verification failed.');
        }
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('[CheckoutView] Payment initiation error:', err);
      setCheckoutError(err.message || 'Payment processing encountered an error. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FAFAF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5 text-accent-600" />
            <span>256-Bit Encrypted Secure Checkout</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Checkout & Online Payment
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Complete your delivery information below to proceed with 100% verified online payment.
          </p>
        </div>

        {/* Global Error Banner */}
        {checkoutError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">{checkoutError}</p>
          </div>
        )}

        <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Customer Details & Contact Information */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-border shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-warm-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-600" />
                    <span>Customer & Delivery Details</span>
                  </h3>
                </div>

                {currentUser ? (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>OTP Verified Customer</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1"
                  >
                    <span>Sign in with OTP</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abhishek Jaiswal"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 text-xs bg-stone-50 border border-warm-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                {/* Primary Mobile Number (OTP Verified) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700">
                      Primary Mobile Number *
                    </label>
                    {currentUser?.phone === primaryPhone && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> OTP Verified
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500 select-none">
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={primaryPhone.replace(/^\+91/, '')}
                      onChange={(e) => setPrimaryPhone(`+91${e.target.value.replace(/\D/g, '').slice(0, 10)}`)}
                      className="w-full pl-16 pr-3 py-3 text-xs bg-stone-50 border border-warm-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-500 font-semibold"
                    />
                  </div>
                </div>

                {/* Alternate Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Alternate Mobile Number (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500 select-none">
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      placeholder="98111 22233"
                      value={altPhone.replace(/^\+91/, '')}
                      onChange={(e) => setAltPhone(`+91${e.target.value.replace(/\D/g, '').slice(0, 10)}`)}
                      className="w-full pl-16 pr-3 py-3 text-xs bg-stone-50 border border-warm-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address * (For Order Confirmation & Invoice)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="abhishek@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 text-xs bg-stone-50 border border-warm-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                {/* House / Flat / Building */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    House / Flat / Building No. / Apartment *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 402, Royal Palms Residency"
                    value={houseFlat}
                    onChange={(e) => setHouseFlat(e.target.value)}
                    className="w-full p-3 text-xs bg-stone-50 border border-warm-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                {/* Street / Locality */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Street / Locality / Sector *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Linking Road, Bandra West"
                    value={streetLocality}
                    onChange={(e) => setStreetLocality(e.target.value)}
                    className="w-full p-3 text-xs bg-stone-50 border border-warm-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Nature Basket"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full p-3 text-xs bg-stone-50 border border-warm-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 text-xs bg-stone-50 border border-warm-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-3 text-xs bg-stone-50 border border-warm-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                {/* PIN Code */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    PIN Code * (6 digits)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="400050"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full p-3 text-xs bg-stone-50 border border-warm-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-500 font-mono font-bold"
                  />
                </div>

                {/* Save Address Toggle */}
                <div className="flex items-center gap-2 pt-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    id="saveAddressCheckbox"
                    checked={shouldSaveAddress}
                    onChange={(e) => setShouldSaveAddress(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-stone-300"
                  />
                  <label htmlFor="saveAddressCheckbox" className="text-xs text-stone-600 cursor-pointer select-none">
                    Save this delivery address to my account for faster future checkouts
                  </label>
                </div>

              </div>
            </div>

            {/* Step 2: Delivery Speed Options */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-border shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-warm-border">
                <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-600" />
                  <span>Delivery Speed & Packaging</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setExpressDelivery(false)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    !expressDelivery
                      ? 'border-brand-500 bg-brand-50/70 text-brand-900 ring-2 ring-brand-300/40'
                      : 'border-warm-border bg-stone-50/50 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">Standard Nitrogen-Flushed Delivery</span>
                    <span className="font-bold text-xs text-stone-900">
                      {deliveryCharge === 0 ? 'FREE' : '₹49'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">Delivered within 3 to 4 business days</p>
                </div>

                <div
                  onClick={() => setExpressDelivery(true)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    expressDelivery
                      ? 'border-brand-500 bg-brand-50/70 text-brand-900 ring-2 ring-brand-300/40'
                      : 'border-warm-border bg-stone-50/50 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">⚡ Express Priority Air Courier</span>
                    <span className="font-bold text-xs text-stone-900">₹99</span>
                  </div>
                  <p className="text-[11px] text-stone-500">Delivered within 24 to 48 hours</p>
                </div>
              </div>
            </div>

            {/* Step 3: Supported Payment Methods */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-border shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-warm-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-brand-600" />
                    <span>Select Payment Method (Razorpay Gateway)</span>
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Instant Verification
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: <QrCode className="w-4 h-4" /> },
                  { id: 'Card', label: 'Cards', icon: <CreditCard className="w-4 h-4" /> },
                  { id: 'Netbanking', label: 'Net Banking', icon: <Building2 className="w-4 h-4" /> },
                  { id: 'Wallet', label: 'Wallets', icon: <Wallet className="w-4 h-4" /> }
                ].map((mode) => (
                  <button
                    type="button"
                    key={mode.id}
                    onClick={() => setPaymentMethod(mode.id as typeof paymentMethod)}
                    className={`p-3 rounded-2xl border text-center font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === mode.id
                        ? 'border-brand-500 bg-brand-50 text-brand-900 ring-2 ring-brand-300/40 shadow-xs'
                        : 'border-warm-border bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    {mode.icon}
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>

              {/* Informative Sub-box */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-stone-700 space-y-1">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span>Supported by Razorpay Secure Gateway:</span>
                  <span className="text-emerald-700 font-semibold">Zero Surcharge</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  {paymentMethod === 'UPI' && 'Pay directly with Google Pay, PhonePe, Paytm, CRED or any BHIM UPI app with 1-click verification.'}
                  {paymentMethod === 'Card' && 'All Indian Debit & Credit cards accepted: Visa, MasterCard, RuPay, Maestro & American Express.'}
                  {paymentMethod === 'Netbanking' && 'Over 50+ Indian banks supported including HDFC, SBI, ICICI, Axis, Kotak, and PNB.'}
                  {paymentMethod === 'Wallet' && 'Pay using Paytm Wallet, PhonePe, Mobikwik, and Amazon Pay balance.'}
                </p>
              </div>

            </div>

          </div>

          {/* Right Column: Order Summary & Placement */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-border shadow-xs sticky top-28 space-y-6">
              
              <h3 className="font-serif font-bold text-lg text-stone-900 pb-3 border-b border-warm-border">
                Order Summary ({cart.length} items)
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-warm-border/60 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-xl border border-warm-border flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-stone-900 truncate">{item.product.name}</p>
                        <p className="text-[11px] text-stone-500">
                          {item.selectedWeight} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900 flex-shrink-0">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Applicator */}
              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold">{appliedCoupon.code}</span>
                      <p className="text-[10px] text-emerald-700">{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-rose-600 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Coupon code (SWAD100)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs uppercase tracking-wider bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500 font-semibold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-600 pl-1">{couponError}</p>}
                </div>
              )}

              {/* Price Calculations */}
              <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-warm-border">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-800">₹{cartSubtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>
                    {finalDeliveryCharge === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${finalDeliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-stone-900 pt-3 border-t border-dashed border-stone-300">
                  <span>Total Amount</span>
                  <span className="text-brand-700 text-2xl">₹{finalPayable}</span>
                </div>
              </div>

              {/* Proceed to Payment CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 hover:from-brand-700 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm rounded-2xl shadow-soft hover:shadow-premium flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Secure Gateway...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{finalPayable} Online Securely</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Payment Webhook & Server Signature Guaranteed</span>
              </div>

            </div>

          </div>

        </form>

      </div>

      {/* Order Success Modal */}
      <OrderSuccessModal
        order={placedOrder}
        onClose={() => {
          setPlacedOrder(null);
          setCurrentView('home');
        }}
      />
    </div>
  );
};
