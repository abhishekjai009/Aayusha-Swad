import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  User, 
  Mail,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    sendOtp, 
    verifyOtp, 
    loginAsDemoUser, 
    loginAsDemoAdmin 
  } = useStore();
  const { addToast } = useToast();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  
  // 6 individual OTP inputs
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timers & loading states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [expiryCountdown, setExpiryCountdown] = useState(300); // 5 minutes

  // Reset modal state when opened/closed
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('phone');
      setOtpDigits(['', '', '', '', '', '']);
      setErrorMessage('');
      setIsLoading(false);
    }
  }, [isAuthModalOpen]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  // 5-minute expiry countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && expiryCountdown > 0) {
      timer = setInterval(() => {
        setExpiryCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, expiryCountdown]);

  if (!isAuthModalOpen) return null;

  const fullPhone = `${countryCode}${phoneNumber.replace(/\D/g, '')}`;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const rawNumber = phoneNumber.replace(/\D/g, '');

    if (rawNumber.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsLoading(true);
    const res = await sendOtp(fullPhone);
    setIsLoading(false);

    if (res.success) {
      setStep('otp');
      setResendCooldown(res.cooldownSeconds || 30);
      setExpiryCountdown(res.expiresInSeconds || 300);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setErrorMessage('');
    setIsLoading(true);
    const res = await sendOtp(fullPhone);
    setIsLoading(false);

    if (res.success) {
      setResendCooldown(res.cooldownSeconds || 30);
      setExpiryCountdown(res.expiresInSeconds || 300);
      setOtpDigits(['', '', '', '', '', '']);
      addToast({
        type: 'success',
        title: 'New Code Sent',
        message: `Fresh 6-digit OTP dispatched to ${fullPhone}.`
      });
      inputRefs.current[0]?.focus();
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Handle paste event of 6 digits
    if (value.length > 1) {
      const pasteDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      if (pasteDigits.length > 0) {
        const nextDigits = [...otpDigits];
        pasteDigits.forEach((d, i) => {
          if (index + i < 6) nextDigits[index + i] = d;
        });
        setOtpDigits(nextDigits);
        const focusIdx = Math.min(5, index + pasteDigits.length);
        inputRefs.current[focusIdx]?.focus();
        return;
      }
    }

    const cleanDigit = value.replace(/\D/g, '').slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = cleanDigit;
    setOtpDigits(nextDigits);

    // Auto-advance focus to next digit box
    if (cleanDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otpDigits.join('');
    if (otpCode.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code.');
      return;
    }

    if (expiryCountdown <= 0) {
      setErrorMessage('This OTP has expired. Please request a new code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    const res = await verifyOtp(fullPhone, otpCode, fullName, email);
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const formatExpiryTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-warm-border overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-[#FFFDF5] via-[#FEF9E7] to-[#FDF4D8] border-b border-warm-border relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-400 flex items-center justify-center shadow-md mb-3">
            <span className="font-serif font-black text-xl text-white">AS</span>
          </div>

          <h3 className="font-serif font-extrabold text-2xl text-stone-900 tracking-tight">
            {step === 'phone' ? 'Phone Verification & Login' : 'Enter 6-Digit OTP'}
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            {step === 'phone' 
              ? 'Fast, password-free login with 6-digit SMS OTP verification.' 
              : `Code sent to ${fullPhone}. Valid for 5 minutes.`}
          </p>
        </div>

        {/* Demo Fast Access Bar */}
        <div className="p-4 bg-amber-50/80 border-b border-amber-200/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>One-Click Instant Evaluation</span>
            </div>
            <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
              Live DB Ready
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={loginAsDemoUser}
              className="py-2 px-3 rounded-xl bg-white hover:bg-stone-50 border border-amber-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <User className="w-3.5 h-3.5 text-brand-600" />
              <span>Demo Customer</span>
            </button>
            <button
              type="button"
              onClick={loginAsDemoAdmin}
              className="py-2 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Step 1: Phone Number Input */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Mobile Number *
              </label>
              <div className="flex rounded-xl border border-warm-border overflow-hidden focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200 bg-stone-50">
                <div className="flex items-center gap-1 px-3 bg-stone-100/70 border-r border-warm-border text-xs font-bold text-stone-700 select-none">
                  <span>🇮🇳</span>
                  <span>{countryCode}</span>
                </div>
                <input
                  type="tel"
                  required
                  autoFocus
                  maxLength={10}
                  placeholder="98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-3 py-3 text-sm font-semibold tracking-wider text-stone-900 bg-transparent focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1 pl-1">
                We'll send a 6-digit OTP code to verify your phone number.
              </p>
            </div>

            {/* Optional profile registration details */}
            <div className="space-y-3 pt-1 border-t border-warm-border/60">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name (Optional for new users)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Abhishek Jaiswal"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address (For order receipts)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || phoneNumber.replace(/\D/g, '').length !== 10}
              className="w-full py-3.5 bg-gradient-to-r from-stone-900 to-stone-800 hover:from-black hover:to-stone-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-soft flex items-center justify-center gap-2 transition-all mt-3"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send 6-Digit OTP Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: 6-Digit OTP Entry */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="p-6 space-y-5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">
                Verifying <strong className="text-stone-900">{fullPhone}</strong>
              </span>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-brand-700 font-bold hover:underline"
              >
                Change Number
              </button>
            </div>

            {/* 6 Digit Inputs */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 text-center">
                Enter 6-Digit OTP Code
              </label>
              <div className="flex justify-between gap-2 max-w-xs mx-auto">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-lg font-black font-mono bg-stone-50 border border-warm-border rounded-xl focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Timers & Resend Controls */}
            <div className="space-y-2 pt-2 border-t border-warm-border/60">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>
                    Expires in: <strong className={expiryCountdown < 60 ? 'text-rose-600' : 'text-stone-700'}>
                      {formatExpiryTime(expiryCountdown)}
                    </strong>
                  </span>
                </div>

                {resendCooldown > 0 ? (
                  <span className="text-[11px] text-stone-400 font-medium">
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-brand-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpDigits.join('').length !== 6 || expiryCountdown <= 0}
              className="w-full py-3.5 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 hover:from-brand-700 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-soft flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Verify OTP & Sign In</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Assurance Footer */}
        <div className="p-4 bg-stone-50 border-t border-warm-border text-center">
          <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Encrypted Secure Authentication • Anti-abuse Protected</span>
          </p>
        </div>

      </div>
    </div>
  );
};
