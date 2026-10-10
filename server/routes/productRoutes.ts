import { Router } from 'express';
import { db } from '../db';

const router = Router();

/**
 * Get all products
 */
router.get('/', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY is_best_seller DESC, name ASC').all() as any[];

  const formatted = products.map(p => ({
    id: p.id,
    name: p.name,
    hindiName: p.hindi_name,
    category: p.category,
    shortDescription: p.short_description,
    fullDescription: p.full_description,
    price: p.price,
    originalPrice: p.original_price,
    weight: p.weight,
    weightOptions: JSON.parse(p.weight_options),
    rating: p.rating,
    reviewCount: p.review_count,
    images: JSON.parse(p.images),
    inStock: Boolean(p.in_stock),
    isBestSeller: Boolean(p.is_best_seller),
    isNewArrival: Boolean(p.is_new_arrival),
    isFeatured: Boolean(p.is_featured),
    badge: p.badge,
    ingredients: JSON.parse(p.ingredients),
    nutritionFacts: JSON.parse(p.nutrition_facts),
    storageInstructions: p.storage_instructions,
    shelfLife: p.shelf_life,
    tags: JSON.parse(p.tags),
    reviews: JSON.parse(p.reviews || '[]')
  }));

  return res.json({ success: true, products: formatted });
});

/**
 * Get all coupons
 */
router.get('/coupons', (req, res) => {
  const coupons = db.prepare('SELECT * FROM coupons WHERE is_active = 1').all() as any[];
  const formatted = coupons.map(c => ({
    code: c.code,
    discountType: c.discount_type,
    discountValue: c.discount_value,
    minOrderValue: c.min_order_value,
    description: c.description,
    isActive: Boolean(c.is_active)
  }));

  return res.json({ success: true, coupons: formatted });
});

export default router;
