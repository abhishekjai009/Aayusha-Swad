export type ProductCategory = 'Makhana' | 'Thekua' | 'Cookies' | 'Namak Paare';

export interface ProductWeightOption {
  weight: string; // e.g. "200g", "500g", "1kg"
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  avatar?: string;
  helpfulCount?: number;
}

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  category: ProductCategory;
  shortDescription: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  weight: string; // default display weight, e.g. "250g"
  weightOptions: ProductWeightOption[];
  rating: number;
  reviewCount: number;
  images: string[];
  inStock: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  badge?: string; // e.g. "Best Seller", "100% Desi Ghee", "Zero Palm Oil"
  ingredients: string[];
  nutritionFacts: {
    servingSize: string;
    calories: string;
    protein: string;
    carbohydrates: string;
    sugar: string;
    fat: string;
    dietaryFiber: string;
  };
  storageInstructions: string;
  shelfLife: string;
  tags: string[];
  reviews: ProductReview[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedWeight: string;
  price: number;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  description: string;
  isActive: boolean;
  expiryDate?: string;
}

export type OrderStatus = 
  | 'Pending Payment'
  | 'Payment Failed'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refund Initiated'
  | 'Refunded';

export interface ShippingAddress {
  fullName: string;
  primaryPhone?: string;
  altPhone?: string;
  email: string;
  houseFlat?: string;
  streetLocality?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  // Aliases for backwards compatibility with existing UI
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  appliedCoupon?: string;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  orderStatus?: OrderStatus;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    message: string;
  }[];
  courierPartner?: string;
  estimatedDelivery: string;
  paymentTransactionId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: ShippingAddress[];
  isPhoneVerified?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface BannerAnnouncement {
  id: string;
  text: string;
  linkText?: string;
  linkUrl?: string;
  couponCode?: string;
  isActive: boolean;
}
