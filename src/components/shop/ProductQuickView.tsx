import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, Star, ShoppingBag, Zap, Heart, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, onClose }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProductId,
    setCurrentView
  } = useStore();

  const [selectedWeight, setSelectedWeight] = useState<string>(product?.weight || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const currentOption = product.weightOptions.find((opt) => opt.weight === selectedWeight);
  const activePrice = currentOption ? currentOption.price : product.price;
  const activeOriginalPrice = currentOption ? currentOption.originalPrice : product.originalPrice;

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, selectedWeight, quantity);
    onClose();
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewFullDetails = () => {
    setSelectedProductId(product.id);
    setCurrentView('product-detail');
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-warm-border overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-400 hover:text-stone-700 bg-white/80 backdrop-blur-sm rounded-full transition-colors"
          aria-label="Close Preview"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image */}
          <div className="relative aspect-square bg-stone-100">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 text-xs mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-stone-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h3 className="font-serif font-bold text-2xl text-stone-900 mt-2">
                {product.name}
              </h3>
              {product.hindiName && (
                <p className="text-xs text-brand-700 font-semibold">{product.hindiName}</p>
              )}

              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mt-3">
                <span className="text-2xl font-bold text-stone-900">₹{activePrice}</span>
                {activeOriginalPrice && (
                  <span className="text-sm text-stone-400 line-through">₹{activeOriginalPrice}</span>
                )}
              </div>

              {/* Weight Options */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Select Pack Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.weightOptions.map((opt) => (
                    <button
                      key={opt.weight}
                      onClick={() => setSelectedWeight(opt.weight)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        selectedWeight === opt.weight
                          ? 'border-brand-500 bg-brand-50 text-brand-800 ring-2 ring-brand-300/40'
                          : 'border-warm-border text-stone-700 hover:border-brand-200'
                      }`}
                    >
                      {opt.weight} • ₹{opt.price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-4">
                <span className="text-xs font-semibold text-stone-700">Quantity:</span>
                <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 hover:bg-stone-200 text-stone-700 font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 hover:bg-stone-200 text-stone-700 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2 border-t border-warm-border">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-soft transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Basket</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Zap className="w-4 h-4 text-brand-400" />
                  <span>Buy Now</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleViewFullDetails}
                  className="text-xs font-semibold text-brand-700 hover:underline"
                >
                  View Full Product Details & Nutrition →
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="text-xs font-medium text-stone-500 hover:text-rose-500 flex items-center gap-1"
                >
                  <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isInWishlist(product.id) ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
