import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, Trash2, CheckCircle2, MessageSquare } from 'lucide-react';

export const ReviewModerator: React.FC = () => {
  const { products, updateProduct } = useStore();

  // Aggregate all reviews across products
  const allReviewsWithProduct = products.flatMap((p) =>
    p.reviews.map((r) => ({
      ...r,
      productId: p.id,
      productName: p.name,
      productImage: p.images[0]
    }))
  );

  const handleDeleteReview = (productId: string, reviewId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const updatedReviews = product.reviews.filter((r) => r.id !== reviewId);
    const avg =
      updatedReviews.length > 0
        ? Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1))
        : 5.0;

    updateProduct(productId, {
      reviews: updatedReviews,
      reviewCount: updatedReviews.length,
      rating: avg
    });
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-5 rounded-3xl border border-warm-border shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-serif font-bold text-lg text-stone-900">
            Customer Reviews Moderation
          </h3>
          <p className="text-xs text-stone-500">
            {allReviewsWithProduct.length} verified tasting reviews across all snacks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allReviewsWithProduct.length === 0 ? (
          <div className="col-span-2 bg-white rounded-3xl border border-warm-border p-12 text-center text-stone-400 text-xs">
            No reviews submitted yet.
          </div>
        ) : (
          allReviewsWithProduct.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-5 rounded-3xl border border-warm-border shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.productImage}
                      alt={rev.productName}
                      className="w-8 h-8 rounded-lg object-cover border border-warm-border"
                    />
                    <div>
                      <p className="font-bold text-xs text-stone-900 line-clamp-1">{rev.productName}</p>
                      <p className="text-[10px] text-stone-400">Review by {rev.userName}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-stone-400">{rev.date}</span>
                </div>

                <div className="flex items-center gap-1 text-amber-500 my-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-2 border-t border-warm-border flex items-center justify-between text-xs">
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Approved & Published</span>
                </span>

                <button
                  onClick={() => handleDeleteReview(rev.productId, rev.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
