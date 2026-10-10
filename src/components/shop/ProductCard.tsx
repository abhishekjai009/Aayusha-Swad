import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, Star, ShoppingBag, Eye, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProductId,
    setCurrentView
  } = useStore();

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.weight, 1);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.weight, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={handleCardClick}
      className="group relative rounded-3xl bg-white border border-warm-border/80 shadow-xs hover:shadow-elevated transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Image Section */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-full bg-brand-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
            isInWishlist(product.id)
              ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
              : 'bg-white/90 text-stone-600 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart
            className={`w-4 h-4 ${
              isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>

        {/* Quick View Hover Trigger */}
        {onQuickView && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="pointer-events-auto px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-stone-800 text-xs font-semibold shadow-md flex items-center gap-1.5 hover:bg-white hover:text-brand-600 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-brand-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mt-1">
            {product.shortDescription}
          </p>

          {/* Weight badge */}
          <div className="mt-2.5">
            <span className="inline-block text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
              Net Wt: {product.weight}
            </span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-warm-border/80 space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-stone-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="py-2.5 px-3 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-brand-600" />
              <span>Add</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-brand-400" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
