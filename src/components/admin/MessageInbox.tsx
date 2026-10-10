import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Mail, Check, Phone, Clock, MessageSquare } from 'lucide-react';

export const MessageInbox: React.FC = () => {
  const { messages, markMessageRead } = useStore();

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-5 rounded-3xl border border-warm-border shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-serif font-bold text-lg text-stone-900">
            Contact & Bulk Gifting Inquiries
          </h3>
          <p className="text-xs text-stone-500">
            Messages received through the Contact & Corporate Enquiry form.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="bg-white rounded-3xl border border-warm-border p-12 text-center text-stone-400 text-xs">
            Inbox is currently clear.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-3xl border shadow-xs transition-all space-y-3 ${
                msg.isRead ? 'bg-white border-warm-border' : 'bg-[#FFFDF7] border-amber-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-warm-border/60">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-stone-900">{msg.name}</span>
                  <span className="text-[10px] font-semibold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-full">
                    {msg.subject}
                  </span>
                  {!msg.isRead && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </div>

                <div className="flex items-center gap-3 text-stone-400 text-xs">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(msg.date).toLocaleDateString()}</span>
                  </span>
                  {!msg.isRead && (
                    <button
                      onClick={() => markMessageRead(msg.id)}
                      className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Mark Read</span>
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                "{msg.message}"
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                <span>Email: <strong className="text-stone-700">{msg.email}</strong></span>
                {msg.phone && (
                  <span>Phone / WhatsApp: <strong className="text-stone-700">{msg.phone}</strong></span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
