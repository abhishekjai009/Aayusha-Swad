import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  Product,
  CartItem,
  Coupon,
  Order,
  OrderStatus,
  UserProfile,
  ContactMessage,
  BannerAnnouncement,
  ProductCategory,
  ShippingAddress
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_BANNER,
  DEMO_USER,
  DEMO_ADMIN
} from '../data/initialData';
import { useToast } from './ToastContext';
import { authApi, ordersApi, adminApi, getStoredToken } from '../services/api';

export type ActiveView = 
  | 'home' 
  | 'shop' 
  | 'product-detail' 
  | 'checkout' 
  | 'track-order' 
  | 'profile' 
  | 'admin' 
  | 'about' 
  | 'contact';

interface StoreContextType {
  // Navigation & View
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategoryFilter: ProductCategory | 'All';
  setSelectedCategoryFilter: (cat: ProductCategory | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  activePolicyModal: string | null;
  setActivePolicyModal: (policy: string | null) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addProductReview: (productId: string, review: { userName: string; rating: number; comment: string }) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, selectedWeight?: string, quantity?: number) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  discountAmount: number;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCouponActive: (code: string) => void;
  deleteCoupon: (code: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (orderData: {
    shippingAddress: Order['shippingAddress'];
    paymentMethod: Order['paymentMethod'];
    expressDelivery?: boolean;
  }) => Order;
  confirmBackendOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  fetchMyOrders: () => Promise<void>;

  // User & Auth
  currentUser: UserProfile | null;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string; cooldownSeconds?: number; expiresInSeconds?: number }>;
  verifyOtp: (phone: string, otp: string, fullName?: string, email?: string) => Promise<{ success: boolean; message: string }>;
  saveAddress: (address: Partial<ShippingAddress>) => Promise<boolean>;
  loginAsDemoUser: () => void;
  loginAsDemoAdmin: () => void;
  logout: () => void;

  // Contact Messages
  messages: ContactMessage[];
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'isRead'>) => void;
  markMessageRead: (id: string) => void;

  // Banners
  banner: BannerAnnouncement;
  updateBanner: (banner: BannerAnnouncement) => void;

  // Demo Reset
  resetToDemoData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'aayusha_products_v1',
  CART: 'aayusha_cart_v1',
  WISHLIST: 'aayusha_wishlist_v1',
  COUPONS: 'aayusha_coupons_v1',
  APPLIED_COUPON: 'aayusha_applied_coupon_v1',
  ORDERS: 'aayusha_orders_v1',
  USER: 'aayusha_user_v1',
  MESSAGES: 'aayusha_messages_v1',
  BANNER: 'aayusha_banner_v1'
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addToast } = useToast();

  // Navigation state
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);

  // Persistent States with Fallback to seed data
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLIED_COUPON);
    return saved ? JSON.parse(saved) : null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : DEMO_USER;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : [
      {
        id: 'msg-1',
        name: 'Sunil Mehta',
        email: 'sunil@gmail.com',
        phone: '+91 98111 22233',
        subject: 'Corporate Diwali Snack Hamper Enquiry',
        message: 'Hello, we would like to order 150 customized gift hampers with Thekua and Makhana for our corporate clients.',
        date: '2026-10-02T11:20:00Z',
        isRead: false
      }
    ];
  });

  const [banner, setBanner] = useState<BannerAnnouncement>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BANNER);
    return saved ? JSON.parse(saved) : INITIAL_BANNER;
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLIED_COUPON, JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(banner));
  }, [banner]);

  // Sync session with backend API
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      authApi.getMe().then((res) => {
        if (res.success && res.user) {
          setCurrentUser(res.user);
        }
      }).catch(() => {
        authApi.logout();
      });
    }
  }, []);

  const fetchMyOrders = async () => {
    try {
      const res = await ordersApi.getMyOrders();
      if (res.success && Array.isArray(res.orders) && res.orders.length > 0) {
        const mapped: Order[] = res.orders.map((o) => ({
          id: o.id,
          trackingNumber: o.tracking_number,
          date: o.created_at,
          items: (o.items || []).map((it: any) => ({
            id: it.id,
            productId: it.product_id,
            product: products.find((p) => p.id === it.product_id) || ({
              id: it.product_id,
              name: it.product_name,
              images: [it.image_url || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800'],
              price: it.price,
              category: 'Makhana',
              weight: it.selected_weight,
              weightOptions: [],
              rating: 5,
              reviewCount: 0,
              inStock: true,
              shortDescription: '',
              fullDescription: '',
              ingredients: [],
              nutritionFacts: {} as any,
              storageInstructions: '',
              shelfLife: '',
              tags: [],
              reviews: []
            } as any),
            selectedWeight: it.selected_weight,
            price: it.price,
            quantity: it.quantity
          })),
          shippingAddress: {
            fullName: o.customer_name,
            primaryPhone: o.primary_phone,
            phone: o.primary_phone,
            altPhone: o.alt_phone,
            email: o.email,
            houseFlat: o.house_flat,
            streetLocality: o.street_locality,
            addressLine1: `${o.house_flat}, ${o.street_locality}`,
            addressLine2: o.street_locality,
            landmark: o.landmark,
            city: o.city,
            state: o.state,
            pincode: o.pincode
          },
          subtotal: o.subtotal,
          discount: o.discount,
          deliveryCharge: o.delivery_charge,
          total: o.total,
          appliedCoupon: o.applied_coupon,
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          status: o.order_status as OrderStatus,
          statusHistory: (o.statusHistory || []).map((h: any) => ({
            status: h.status as OrderStatus,
            timestamp: h.created_at,
            message: h.message
          })),
          courierPartner: o.courier_partner,
          estimatedDelivery: o.estimated_delivery
        }));
        setOrders(mapped);
      }
    } catch (err) {
      console.warn('Backend orders fetch notice (fallback to local state):', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMyOrders();
    }
  }, [currentUser]);

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const freeDeliveryThreshold = 499;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const deliveryCharge = cartSubtotal === 0 || cartSubtotal >= freeDeliveryThreshold ? 0 : 49;

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (cartSubtotal < appliedCoupon.minOrderValue) return 0;

    if (appliedCoupon.discountType === 'flat') {
      return Math.min(cartSubtotal, appliedCoupon.discountValue);
    } else {
      return Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    }
  }, [appliedCoupon, cartSubtotal]);

  const cartTotal = Math.max(0, cartSubtotal - discountAmount + deliveryCharge);

  // Cart Actions
  const addToCart = (product: Product, selectedWeight?: string, quantity: number = 1) => {
    const weightToUse = selectedWeight || product.weight;
    const matchingOption = product.weightOptions.find((opt) => opt.weight === weightToUse);
    const priceToUse = matchingOption ? matchingOption.price : product.price;

    const cartItemId = `${product.id}-${weightToUse}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          selectedWeight: weightToUse,
          price: priceToUse,
          quantity
        }
      ];
    });

    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${quantity}x ${product.name} (${weightToUse}) added to your basket.`
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    addToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Item removed from your cart.'
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist Actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast({
          type: 'info',
          title: 'Removed from Wishlist',
          message: 'Snack removed from your saved list.'
        });
        return prev.filter((id) => id !== productId);
      } else {
        addToast({
          type: 'success',
          title: 'Saved to Wishlist',
          message: 'Snack added to your wishlist.'
        });
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon Actions
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      addToast({
        type: 'error',
        title: 'Invalid Coupon',
        message: `Coupon "${cleanCode}" does not exist or has expired.`
      });
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    if (cartSubtotal < found.minOrderValue) {
      const needed = found.minOrderValue - cartSubtotal;
      addToast({
        type: 'warning',
        title: 'Minimum Order Value Not Met',
        message: `Add ₹${needed} more to apply coupon ${found.code}.`
      });
      return {
        success: false,
        message: `Minimum order of ₹${found.minOrderValue} required for this coupon.`
      };
    }

    setAppliedCoupon(found);
    addToast({
      type: 'success',
      title: 'Coupon Applied!',
      message: `${found.description} applied successfully.`
    });
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast({
      type: 'info',
      title: 'Coupon Removed',
      message: 'Coupon discount has been removed.'
    });
  };

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
    addToast({
      type: 'success',
      title: 'Coupon Created',
      message: `Coupon code ${newCoupon.code} created successfully.`
    });
  };

  const toggleCouponActive = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    if (appliedCoupon?.code === code) {
      setAppliedCoupon(null);
    }
  };

  // Product Actions (Admin & Customer)
  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => {
    const id = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const newProduct: Product = {
      ...productData,
      id,
      rating: 5.0,
      reviewCount: 0,
      reviews: []
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast({
      type: 'success',
      title: 'Product Added',
      message: `${productData.name} has been added to the store.`
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast({
      type: 'success',
      title: 'Product Updated',
      message: 'Product changes saved successfully.'
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast({
      type: 'info',
      title: 'Product Deleted',
      message: 'Product removed from catalog.'
    });
  };

  const addProductReview = (productId: string, review: { userName: string; rating: number; comment: string }) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newReview = {
            id: 'rev-' + Date.now(),
            userName: review.userName,
            rating: review.rating,
            date: new Date().toISOString().split('T')[0],
            comment: review.comment,
            verifiedPurchase: true,
            helpfulCount: 1
          };
          const updatedReviews = [newReview, ...p.reviews];
          const avgRating = Number(
            (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...p,
            reviews: updatedReviews,
            rating: avgRating,
            reviewCount: updatedReviews.length
          };
        }
        return p;
      })
    );
    addToast({
      type: 'success',
      title: 'Review Submitted',
      message: 'Thank you for sharing your experience!'
    });
  };

  // Order Actions
  const placeOrder = ({
    shippingAddress,
    paymentMethod,
    expressDelivery = false
  }: {
    shippingAddress: Order['shippingAddress'];
    paymentMethod: Order['paymentMethod'];
    expressDelivery?: boolean;
  }): Order => {
    const orderId = `AS-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `DEL-${Date.now().toString().slice(-8)}`;
    const finalDeliveryCharge = expressDelivery ? 99 : deliveryCharge;
    const finalTotal = cartSubtotal - discountAmount + finalDeliveryCharge;

    const newOrder: Order = {
      id: orderId,
      trackingNumber,
      date: new Date().toISOString(),
      items: [...cart],
      shippingAddress,
      subtotal: cartSubtotal,
      discount: discountAmount,
      deliveryCharge: finalDeliveryCharge,
      total: finalTotal,
      appliedCoupon: appliedCoupon?.code,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      status: 'Confirmed',
      courierPartner: 'Delhivery Express',
      estimatedDelivery: '3 to 4 business days',
      statusHistory: [
        {
          status: 'Confirmed',
          timestamp: new Date().toISOString(),
          message: `Order placed successfully. Payment mode: ${paymentMethod}.`
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    addToast({
      type: 'success',
      title: 'Order Confirmed!',
      message: `Your order ${orderId} has been placed successfully.`
    });

    return newOrder;
  };

  const confirmBackendOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev.filter((o) => o.id !== order.id)]);
    clearCart();
    addToast({
      type: 'success',
      title: 'Order Confirmed!',
      message: `Your order ${order.id} has been placed and confirmed.`
    });
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, note?: string) => {
    try {
      if (currentUser?.role === 'admin') {
        await adminApi.updateOrderStatus(orderId, { status: newStatus, note });
      }
    } catch (err) {
      console.warn('Backend order status update note:', err);
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            paymentStatus: newStatus === 'Delivered' ? 'Paid' : o.paymentStatus,
            statusHistory: [
              ...o.statusHistory,
              {
                status: newStatus,
                timestamp: new Date().toISOString(),
                message: note || `Order status updated to ${newStatus}`
              }
            ]
          };
        }
        return o;
      })
    );
    addToast({
      type: 'info',
      title: 'Order Updated',
      message: `Order ${orderId} is now marked as ${newStatus}.`
    });
  };

  const getOrderById = (orderId: string) => {
    const clean = orderId.trim().toUpperCase();
    return orders.find(
      (o) => o.id.toUpperCase() === clean || o.trackingNumber.toUpperCase() === clean
    );
  };

  // Auth & OTP Actions
  const sendOtp = async (phone: string) => {
    try {
      const res = await authApi.sendOtp(phone);
      return res;
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to send OTP.'
      };
    }
  };

  const verifyOtp = async (phone: string, otp: string, fullName?: string, email?: string) => {
    try {
      const res = await authApi.verifyOtp(phone, otp, fullName, email);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthModalOpen(false);
        addToast({
          type: 'success',
          title: 'Verification Successful!',
          message: `Welcome, ${res.user.name || 'Friend'}!`
        });
        fetchMyOrders();
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Verification failed.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Invalid OTP code.' };
    }
  };

  const saveAddress = async (addr: Partial<ShippingAddress>) => {
    try {
      const res = await authApi.saveAddress(addr);
      if (res.success && res.addresses && currentUser) {
        setCurrentUser({
          ...currentUser,
          addresses: res.addresses
        });
        addToast({
          type: 'success',
          title: 'Address Saved',
          message: 'Delivery address updated successfully.'
        });
        return true;
      }
      return false;
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not save address.'
      });
      return false;
    }
  };

  const loginAsDemoUser = async () => {
    try {
      const res = await authApi.demoLogin('customer');
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthModalOpen(false);
        addToast({
          type: 'success',
          title: 'Welcome Back!',
          message: `Logged in as ${res.user.name} (Customer)`
        });
        fetchMyOrders();
        return;
      }
    } catch (err) {
      console.warn('Backend demo login fallback to local state:', err);
    }
    setCurrentUser(DEMO_USER);
    setIsAuthModalOpen(false);
    addToast({
      type: 'success',
      title: 'Welcome Back!',
      message: `Logged in as ${DEMO_USER.name} (Customer)`
    });
  };

  const loginAsDemoAdmin = async () => {
    try {
      const res = await authApi.demoLogin('admin');
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthModalOpen(false);
        setCurrentView('admin');
        addToast({
          type: 'success',
          title: 'Admin Access Granted',
          message: 'Logged in as Store Administrator.'
        });
        fetchMyOrders();
        return;
      }
    } catch (err) {
      console.warn('Backend demo admin login fallback to local state:', err);
    }
    setCurrentUser(DEMO_ADMIN);
    setIsAuthModalOpen(false);
    setCurrentView('admin');
    addToast({
      type: 'success',
      title: 'Admin Access Granted',
      message: 'Logged in as Store Administrator.'
    });
  };

  const logout = () => {
    authApi.logout();
    setCurrentUser(null);
    if (currentView === 'admin' || currentView === 'profile') {
      setCurrentView('home');
    }
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been safely signed out.'
    });
  };

  // Contact Messages
  const submitContactMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'isRead'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      date: new Date().toISOString(),
      isRead: false
    };
    setMessages((prev) => [newMsg, ...prev]);
    addToast({
      type: 'success',
      title: 'Message Sent!',
      message: 'Thank you for reaching out. Our team will contact you within 24 hours.'
    });
  };

  const markMessageRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
  };

  const updateBanner = (newBanner: BannerAnnouncement) => {
    setBanner(newBanner);
    addToast({
      type: 'success',
      title: 'Banner Updated',
      message: 'Announcement bar content updated.'
    });
  };

  // Reset to Demo Data
  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCoupons(INITIAL_COUPONS);
    setOrders(INITIAL_ORDERS);
    setBanner(INITIAL_BANNER);
    setCart([]);
    setWishlist([]);
    setAppliedCoupon(null);
    setCurrentUser(DEMO_USER);
    localStorage.clear();
    addToast({
      type: 'info',
      title: 'Data Reset',
      message: 'All products, coupons, and orders restored to factory defaults.'
    });
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        searchQuery,
        setSearchQuery,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isSearchOpen,
        setIsSearchOpen,
        activePolicyModal,
        setActivePolicyModal,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        addProductReview,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryCharge,
        freeDeliveryThreshold,
        amountNeededForFreeDelivery,
        discountAmount,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        toggleCouponActive,
        deleteCoupon,
        orders,
        placeOrder,
        confirmBackendOrder,
        updateOrderStatus,
        getOrderById,
        fetchMyOrders,
        currentUser,
        sendOtp,
        verifyOtp,
        saveAddress,
        loginAsDemoUser,
        loginAsDemoAdmin,
        logout,
        messages,
        submitContactMessage,
        markMessageRead,
        banner,
        updateBanner,
        resetToDemoData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
