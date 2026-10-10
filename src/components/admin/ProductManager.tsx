import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory } from '../../types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Image as ImageIcon,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export const ProductManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<ProductCategory | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    hindiName: '',
    category: 'Thekua' as ProductCategory,
    shortDescription: '',
    fullDescription: '',
    price: 250,
    originalPrice: 300,
    weight: '400g',
    imageUrl: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=800&auto=format&fit=crop',
    inStock: true,
    isBestSeller: false,
    badge: 'Artisanal Batch',
    ingredients: 'Whole Wheat Flour, Pure Desi Cow Ghee, Jaggery, Fennel Seeds, Cardamom',
    storageInstructions: 'Store in an airtight container in a cool dry place.',
    shelfLife: '45 Days'
  });

  const categories: ProductCategory[] = ['Makhana', 'Thekua', 'Cookies', 'Namak Paare'];

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      hindiName: '',
      category: 'Thekua',
      shortDescription: '',
      fullDescription: '',
      price: 250,
      originalPrice: 300,
      weight: '400g',
      imageUrl: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=800&auto=format&fit=crop',
      inStock: true,
      isBestSeller: false,
      badge: 'Artisanal Batch',
      ingredients: 'Whole Wheat Flour, Pure Desi Cow Ghee, Jaggery, Fennel Seeds, Cardamom',
      storageInstructions: 'Store in an airtight container in a cool dry place.',
      shelfLife: '45 Days'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      hindiName: p.hindiName || '',
      category: p.category,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      price: p.price,
      originalPrice: p.originalPrice || p.price + 50,
      weight: p.weight,
      imageUrl: p.images[0] || '',
      inStock: p.inStock,
      isBestSeller: !!p.isBestSeller,
      badge: p.badge || '',
      ingredients: p.ingredients.join(', '),
      storageInstructions: p.storageInstructions,
      shelfLife: p.shelfLife
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const ingredientsArray = formData.ingredients
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const weightOptions = [
      { weight: formData.weight, price: formData.price, originalPrice: formData.originalPrice, inStock: formData.inStock },
      { weight: `Double (${formData.weight} x 2)`, price: Math.round(formData.price * 1.85), originalPrice: formData.originalPrice * 2, inStock: formData.inStock }
    ];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        hindiName: formData.hindiName,
        category: formData.category,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        price: formData.price,
        originalPrice: formData.originalPrice,
        weight: formData.weight,
        weightOptions,
        images: [formData.imageUrl],
        inStock: formData.inStock,
        isBestSeller: formData.isBestSeller,
        badge: formData.badge,
        ingredients: ingredientsArray,
        storageInstructions: formData.storageInstructions,
        shelfLife: formData.shelfLife
      });
    } else {
      addProduct({
        name: formData.name,
        hindiName: formData.hindiName,
        category: formData.category,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        price: formData.price,
        originalPrice: formData.originalPrice,
        weight: formData.weight,
        weightOptions,
        images: [formData.imageUrl],
        inStock: formData.inStock,
        isBestSeller: formData.isBestSeller,
        badge: formData.badge,
        ingredients: ingredientsArray,
        nutritionFacts: {
          servingSize: '30g',
          calories: '135 kcal',
          protein: '3.0g',
          carbohydrates: '18.0g',
          sugar: '4.0g',
          fat: '6.0g',
          dietaryFiber: '1.5g'
        },
        storageInstructions: formData.storageInstructions,
        shelfLife: formData.shelfLife,
        tags: ['Pure Ghee', 'Handcrafted', formData.category]
      });
    }

    setIsModalOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    if (filterCategory !== 'All' && p.category !== filterCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.hindiName && p.hindiName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-warm-border shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as typeof filterCategory)}
            className="text-xs font-semibold text-stone-700 bg-stone-50 border border-warm-border rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="All">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c} ({products.filter((p) => p.category === c).length})
              </option>
            ))}
          </select>
        </div>

        {/* Add Product Button */}
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-soft flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Snack</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-warm-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-warm-border text-stone-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Weight</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Badge</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-border/60 text-stone-700">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-11 h-11 object-cover rounded-xl border border-warm-border flex-shrink-0"
                      />
                      <div>
                        <p className="font-bold text-stone-900 line-clamp-1">{p.name}</p>
                        {p.hindiName && (
                          <p className="text-[10px] text-brand-700 font-medium">{p.hindiName}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-800">{p.category}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-stone-900">₹{p.price}</span>
                    {p.originalPrice && (
                      <span className="text-[10px] text-stone-400 line-through ml-1.5">
                        ₹{p.originalPrice}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-stone-600 font-medium">{p.weight}</td>
                  <td className="py-3 px-4">
                    {p.inStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        <span>In Stock</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                        <X className="w-3 h-3" />
                        <span>Out of Stock</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {p.badge ? (
                      <span className="text-[10px] font-bold text-brand-800 bg-brand-100 px-2 py-0.5 rounded-full uppercase">
                        {p.badge}
                      </span>
                    ) : (
                      <span className="text-stone-400 text-[11px]">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 hover:bg-stone-100 text-stone-600 hover:text-brand-600 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-warm-border overflow-hidden">
            <div className="p-6 bg-stone-50 border-b border-warm-border flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  {editingProduct ? 'Edit Snack Product' : 'Add New Indian Snack'}
                </h3>
                <p className="text-xs text-stone-500">
                  Changes will update live across the entire website and customer catalog.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Pistachio Thekua"
                    className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Hindi Name
                  </label>
                  <input
                    type="text"
                    value={formData.hindiName}
                    onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                    placeholder="e.g. शाही पिस्ता ठेकुआ"
                    className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Badge Ribbon
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. 100% Pure Ghee, Bestseller"
                    className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Original Price / MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Default Pack Weight *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g. 400g Box"
                    className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Shelf Life
                  </label>
                  <input
                    type="text"
                    value={formData.shelfLife}
                    onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                    placeholder="e.g. 45 Days, 6 Months"
                    className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Image URL
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                  />
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded-xl border border-warm-border flex-shrink-0"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One sentence flavor and texture summary..."
                  className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Story & Description
                </label>
                <textarea
                  rows={3}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ingredients (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  placeholder="e.g. Stone Ground Wheat, Pure Cow Ghee, Fennel, Cardamom"
                  className="w-full p-2.5 text-xs bg-stone-50 border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Mark as In-Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Featured / Bestseller</span>
                </label>
              </div>

              <div className="pt-4 border-t border-warm-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-soft transition-colors"
                >
                  {editingProduct ? 'Save Product Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
