import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { CreditCard, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck, Eye } from 'lucide-react';

export const PaymentLogViewer: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPayments();
      if (res.success) {
        setPayments(res.payments || []);
        setTransactions(res.transactions || []);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Overview Card */}
      <div className="bg-white rounded-3xl border border-warm-border p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-600" />
            <span>Online Gateway Payments & Audit Logs</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Audit trail of Razorpay payment orders, webhook triggers, signature verifications, and refunds.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          disabled={loading}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl border border-warm-border overflow-hidden shadow-xs">
        <div className="p-4 bg-stone-50/80 border-b border-warm-border flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Payment Records ({payments.length})
          </span>
          <span className="text-[10px] text-stone-400">Recorded with 256-bit signature verification</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/50 border-b border-warm-border text-stone-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Gateway Reference</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-border/60 text-stone-700">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    No payment logs recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-stone-900 block">{p.order_id}</span>
                      <span className="text-[10px] text-stone-400">{new Date(p.created_at).toLocaleString('en-IN')}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                      <div>Order: {p.gateway_order_id || 'N/A'}</div>
                      <div className="text-[10px] text-stone-400">Payment: {p.gateway_payment_id || 'Pending'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-800">{p.customer_name || 'Customer'}</span>
                      <span className="block text-[10px] text-stone-500">{p.primary_phone}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      ₹{p.amount} {p.currency}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.status === 'captured'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'failed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-700">
                      {p.payment_method || 'Online Gateway'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhook & Audit Transactions Log */}
      <div className="bg-white rounded-3xl border border-warm-border p-6 shadow-xs space-y-4">
        <h4 className="font-serif font-bold text-base text-stone-900">
          Webhook & Cryptographic Audit Event Log
        </h4>
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <p className="text-xs text-stone-400">No webhook audit events captured yet.</p>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="p-3 bg-stone-50 rounded-2xl border border-warm-border flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-stone-900">{tx.order_id}</span>
                    <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md text-[10px]">
                      {tx.event_type}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(tx.created_at).toLocaleTimeString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Status: {tx.status}</p>
                </div>

                {tx.payload && (
                  <button
                    onClick={() => setSelectedTx(tx)}
                    className="p-1.5 hover:bg-stone-200 text-stone-600 rounded-lg text-xs"
                    title="View Raw Payload"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for Raw Audit Payload */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setSelectedTx(null)} />
          <div className="relative max-w-lg w-full bg-white rounded-3xl p-6 shadow-2xl border border-warm-border">
            <h4 className="font-bold text-sm text-stone-900 mb-2">Audit Payload: {selectedTx.order_id}</h4>
            <pre className="p-3 bg-stone-900 text-emerald-400 text-xs rounded-xl overflow-x-auto max-h-60 font-mono">
              {JSON.stringify(JSON.parse(selectedTx.payload || '{}'), null, 2)}
            </pre>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
