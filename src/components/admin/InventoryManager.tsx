import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Layers, AlertTriangle, Check, RefreshCw, Save } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface InventoryItem {
  id: string;
  product_id: string;
  weight_option: string;
  stock_quantity: number;
  reserved_quantity: number;
  product_name: string;
  category: string;
  base_price: number;
}

export const InventoryManager: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState<number>(0);
  const { addToast } = useToast();

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getInventory();
      if (res.success && res.inventory) {
        setInventory(res.inventory);
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSaveStock = async (id: string) => {
    try {
      await adminApi.updateStock(id, editQty);
      setInventory(prev => prev.map(item => item.id === id ? { ...item, stock_quantity: editQty } : item));
      setEditingId(null);
      addToast({
        type: 'success',
        title: 'Stock Updated',
        message: 'Product inventory stock level updated successfully.'
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Stock Update Failed',
        message: err.message || 'Could not update stock.'
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-warm-border p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-warm-border">
        <div>
          <h3 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-600" />
            <span>Product Inventory & Stock Management</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time stock tracking per packaging weight variant. Automatically decremented upon online payment confirmation.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          disabled={loading}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Stock</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50/80 border-b border-warm-border text-stone-400 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Snack Product</th>
              <th className="py-3.5 px-4">Variant Weight</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Stock Status</th>
              <th className="py-3.5 px-4">Available Qty</th>
              <th className="py-3.5 px-4">Reserved</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-border/60 text-stone-700">
            {inventory.map((item) => {
              const isLowStock = item.stock_quantity < 20;
              const isEditing = editingId === item.id;

              return (
                <tr key={item.id} className="hover:bg-amber-50/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    {item.product_name}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand-800 bg-brand-50/50 rounded-lg">
                    {item.weight_option}
                  </td>
                  <td className="py-3.5 px-4 text-stone-500">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4">
                    {item.stock_quantity === 0 ? (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 w-max">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Low Stock</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Healthy Stock
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={editQty}
                        onChange={(e) => setEditQty(parseInt(e.target.value, 10) || 0)}
                        className="w-20 p-1.5 text-xs bg-white border border-brand-500 rounded-lg font-mono font-bold"
                        autoFocus
                      />
                    ) : (
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        {item.stock_quantity}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-400">
                    {item.reserved_quantity}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSaveStock(item.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow-xs flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditQty(item.stock_quantity);
                        }}
                        className="px-3 py-1 bg-white hover:bg-stone-50 border border-warm-border text-stone-700 font-bold rounded-lg text-[11px] transition-colors"
                      >
                        Adjust Stock
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
