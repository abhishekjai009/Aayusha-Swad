import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../shop/ProductCard';
import { 
  Star, 
  ShoppingBag, 
  Zap, 
  Heart, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Check, 
  Clock, 
  Share2,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ProductDetailView: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setCurrentView,
    addProductReview
  } = useStore();

  const { addToast } = useToast();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState<string>(product.weight);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'nutrition' | 'reviews'>('details');

  // Review Form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const currentOption = product.weightOptions.find((opt) => opt.weight === selectedWeight);
  const activePrice = currentOption ? currentOption.price : product.price;
  const activeOriginalPrice = currentOption ? currentOption.originalPrice : product.originalPrice;

  const discountPercent = activeOriginalPrice
    ? Math.round(((activeOriginalPrice - activePrice) / activeOriginalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedWeight, quantity);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast({
      type: 'info',
      title: 'Link Copied',
      message: 'Product link copied to your clipboard.'
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    addProductReview(product.id, {
      userName: reviewerName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim()
    });

    setReviewerName('');
    setReviewComment('');
    setReviewRating(5);
    setIsSubmittingReview(false);
  };

  // Related snacks from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="py-8 sm:py-12 bg-[#FAFAF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-8">
          <button onClick={() => setCurrentView('home')} className="hover:text-brand-700">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <button onClick={() => setCurrentView('shop')} className="hover:text-brand-700">Shop</button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-400">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Showcase Section */}
        <div className="bg-white rounded-3xl border border-warm-border p-6 sm:p-10 shadow-xs mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            
            {/* Left: Product Images Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 border border-warm-border">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                  {product.badge && (
                    <span className="px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-extrabold shadow-sm">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Wishlist & Share Buttons */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-brand-600 shadow-sm transition-colors"
                    title="Share product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2.5 rounded-full backdrop-blur-md shadow-sm transition-all ${
                      isInWishlist(product.id)
                        ? 'bg-rose-50 text-rose-500'
                        : 'bg-white/90 text-stone-700 hover:text-rose-500'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-brand-500 ring-2 ring-brand-300'
                          : 'border-warm-border opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Buy Box & Product Attributes */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Category & Rating */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-stone-400 font-normal">({product.reviewCount} customer reviews)</span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-stone-900 tracking-tight">
                    {product.name}
                  </h1>
                  {product.hindiName && (
                    <p className="text-sm font-semibold text-brand-700 mt-1">{product.hindiName}</p>
                  )}
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-3xl font-extrabold text-stone-900">₹{activePrice}</span>
                  {activeOriginalPrice && (
                    <span className="text-lg text-stone-400 line-through">₹{activeOriginalPrice}</span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Save ₹{activeOriginalPrice! - activePrice} ({discountPercent}%)
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {product.fullDescription}
                </p>

                {/* Weight / Pack Size Selector */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
                    Choose Pack Size:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {product.weightOptions.map((opt) => (
                      <button
                        key={opt.weight}
                        onClick={() => setSelectedWeight(opt.weight)}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          selectedWeight === opt.weight
                            ? 'border-brand-500 bg-brand-50/80 text-brand-900 ring-2 ring-brand-300/40 shadow-xs'
                            : 'border-warm-border bg-stone-50/50 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <span className="block text-xs font-bold">{opt.weight}</span>
                        <span className="block text-[11px] text-stone-500 mt-0.5">₹{opt.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-2 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-stone-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3.5 py-2 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4 border-t border-warm-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="py-4 px-6 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-2xl shadow-soft hover:shadow-premium flex items-center justify-center gap-2.5 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Basket</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-4 px-6 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-2xl shadow-xs hover:shadow flex items-center justify-center gap-2.5 transition-all"
                  >
                    <Zap className="w-4 h-4 text-brand-400" />
                    <span>Buy Now • ₹{activePrice * quantity}</span>
                  </button>
                </div>

                {/* Trust Highlights Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-stone-600 text-[11px] font-medium">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Free Express Delivery &gt;₹499</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>100% Desi Ghee Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Freshly Baked Every 48h</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Tabbed Info Section (Ingredients, Nutrition, Storage, Reviews) */}
        <div className="bg-white rounded-3xl border border-warm-border overflow-hidden shadow-xs mb-16">
          
          {/* Tabs Navigation */}
          <div className="flex border-b border-warm-border overflow-x-auto scrollbar-none bg-stone-50/50">
            {[
              { id: 'details', label: 'Artisanal Preparation' },
              { id: 'ingredients', label: 'Ingredients & Allergen' },
              { id: 'nutrition', label: 'Nutritional Facts' },
              { id: 'reviews', label: `Customer Reviews (${product.reviewCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 px-6 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-brand-500 text-brand-700 bg-white'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="p-6 sm:p-10">
            
            {/* Tab 1: Preparation & Storage */}
            {activeTab === 'details' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
                    The Authentic Aayusha Swad Method
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Every batch of our {product.name} is prepared under strict traditional rituals. We refuse automated industrial conveyor lines in favor of master sweet-makers who inspect texture, aroma, and temperature at every stage.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-warm-cream border border-warm-border">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900">Storage Instructions</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {product.storageInstructions}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-warm-cream border border-warm-border">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900">Shelf Life</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {product.shelfLife}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Ingredients */}
            {activeTab === 'ingredients' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
                    100% Honest Natural Ingredients
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                    Zero artificial flavors, zero synthetic food colorings, and zero chemical preservatives.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.ingredients.map((ing) => (
                      <li key={ing} className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-warm-border text-xs font-semibold text-stone-800">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <strong>Allergen Notice:</strong> Contains milk solids (Pure Desi Cow Ghee). May contain traces of tree nuts (almonds, pistachios) and wheat.
                </div>
              </div>
            )}

            {/* Tab 3: Nutrition */}
            {activeTab === 'nutrition' && (
              <div className="max-w-2xl">
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
                  Nutritional Breakdown
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  Serving Size: <strong>{product.nutritionFacts.servingSize}</strong>
                </p>

                <div className="border border-warm-border rounded-2xl overflow-hidden divide-y divide-warm-border text-xs sm:text-sm">
                  <div className="p-3 bg-stone-50 flex justify-between font-bold text-stone-900">
                    <span>Energy / Calories</span>
                    <span>{product.nutritionFacts.calories}</span>
                  </div>
                  <div className="p-3 flex justify-between text-stone-700">
                    <span>Protein</span>
                    <span>{product.nutritionFacts.protein}</span>
                  </div>
                  <div className="p-3 flex justify-between text-stone-700">
                    <span>Carbohydrates</span>
                    <span>{product.nutritionFacts.carbohydrates}</span>
                  </div>
                  <div className="p-3 flex justify-between text-stone-700 pl-6">
                    <span className="text-stone-500">• Natural Sugar</span>
                    <span>{product.nutritionFacts.sugar}</span>
                  </div>
                  <div className="p-3 flex justify-between text-stone-700">
                    <span>Total Fat (Good Healthy Fats)</span>
                    <span>{product.nutritionFacts.fat}</span>
                  </div>
                  <div className="p-3 flex justify-between text-stone-700">
                    <span>Dietary Fiber</span>
                    <span>{product.nutritionFacts.dietaryFiber}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Customer Reviews & Submission */}
            {activeTab === 'reviews' && (
              <div className="space-y-8 max-w-4xl">
                
                {/* Header & Write Review Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-warm-border">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-stone-900">
                      Customer Feedback & Ratings
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-stone-900">{product.rating} out of 5</span>
                      <span className="text-xs text-stone-400">({product.reviewCount} total reviews)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsSubmittingReview(!isSubmittingReview)}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
                  >
                    {isSubmittingReview ? 'Cancel Review' : 'Write a Customer Review'}
                  </button>
                </div>

                {/* Review Submission Form */}
                {isSubmittingReview && (
                  <form onSubmit={handleReviewSubmit} className="p-6 rounded-2xl bg-[#FFFDF7] border border-amber-200 space-y-4">
                    <h4 className="font-serif font-bold text-sm text-stone-900">Share Your Tasting Experience</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="e.g. Ramesh Chandra"
                          className="w-full p-2.5 text-xs bg-white border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Your Rating</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full p-2.5 text-xs bg-white border border-warm-border rounded-xl focus:outline-none focus:border-brand-500 cursor-pointer"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ (5 - Incredible & Delicious)</option>
                          <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                          <option value="3">⭐⭐⭐ (3 - Good)</option>
                          <option value="2">⭐⭐ (2 - Average)</option>
                          <option value="1">⭐ (1 - Needs Improvement)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Your Review</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tell other snack lovers about the crunch, aroma, packaging, and flavor..."
                        className="w-full p-2.5 text-xs bg-white border border-warm-border rounded-xl focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-soft transition-colors"
                    >
                      Submit Review
                    </button>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {product.reviews.length === 0 ? (
                    <p className="text-xs text-stone-400 py-4 italic">
                      Be the first to review this traditional snack!
                    </p>
                  ) : (
                    product.reviews.map((rev) => (
                      <div key={rev.id} className="p-5 rounded-2xl bg-stone-50/50 border border-warm-border/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-stone-900">{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400">{rev.date}</span>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>

                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Related Products Recommendation Carousel */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-black text-2xl text-stone-900 tracking-tight">
                  You May Also Love
                </h3>
                <p className="text-xs text-stone-500">Other authentic snacks in {product.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
