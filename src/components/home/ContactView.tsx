import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Package, 
  Clock 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ContactView: React.FC = () => {
  const { submitContactMessage } = useStore();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Bulk Order & Corporate Gifting');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    submitContactMessage({
      name,
      email,
      phone,
      subject,
      message
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="py-12 sm:py-20 bg-[#FAFAF7] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold">
            <Mail className="w-3.5 h-3.5 text-accent-600" />
            <span>We'd Love to Hear From You</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Contact Us & Bulk Gifting Orders
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto">
            Have a question about our snacks, need custom wedding favors, or want corporate Diwali hampers? We are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info & Benefits */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-border shadow-xs space-y-6">
              <h3 className="font-serif font-bold text-xl text-stone-900">
                Direct Contact Points
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Customer Helpline & WhatsApp</h4>
                    <p className="text-stone-600 mt-0.5">+91 98765 43210</p>
                    <p className="text-[10px] text-stone-400">Available Mon - Sat, 9:00 AM - 8:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Email Enquiries</h4>
                    <p className="text-stone-600 mt-0.5">namaste@aayushaswad.com</p>
                    <p className="text-stone-600">orders@aayushaswad.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Kitchen & Distribution Center</h4>
                    <p className="text-stone-600 mt-0.5 leading-relaxed">
                      Aayusha Swad Artisanal Foods Pvt. Ltd.
                      <br />
                      Bakers Colony, Bailey Road, Patna & Bandra Hub, Mumbai
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate Box Note */}
            <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-amber-200/80 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-brand-800 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-accent-500" />
                <span>Bulk Corporate Discounts</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                We supply handcrafted Thekua and roasted Makhana hampers for over 50+ corporate clients including customized branded gift boxes for Diwali, New Year, and annual milestones.
              </p>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-border shadow-xs">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-stone-900">Message Received!</h3>
                  <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. One of our team members will review your request and get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">
                    Send Us an Enquiry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Vikramaditya"
                        className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile / WhatsApp Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 00000"
                        className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Subject / Enquiry Type</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="Bulk Order & Corporate Gifting">Bulk Order & Corporate Gifting</option>
                      <option value="Festive / Wedding Special Orders">Festive / Wedding Special Orders</option>
                      <option value="Order & Delivery Status Question">Order & Delivery Status Question</option>
                      <option value="Product Quality & Ingredient Question">Product Quality & Ingredient Question</option>
                      <option value="Retail / Distribution Partnership">Retail / Distribution Partnership</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Provide details about your query or requirement (e.g. quantity needed, delivery date, event type)..."
                      className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-soft hover:shadow-premium flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Submit Message</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
