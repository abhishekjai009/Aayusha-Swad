import { Order, OrderStatus, ShippingAddress, UserProfile } from '../types';

const TOKEN_KEY = 'aayusha_jwt_token_v1';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

// 1. Authentication API
export const authApi = {
  async sendOtp(phone: string) {
    return request<{
      success: boolean;
      message: string;
      cooldownSeconds?: number;
      expiresInSeconds?: number;
      phone: string;
    }>('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
  },

  async verifyOtp(phone: string, otp: string, fullName?: string, email?: string) {
    const res = await request<{
      success: boolean;
      message: string;
      token: string;
      user: UserProfile;
    }>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, fullName, email })
    });
    if (res.token) {
      setStoredToken(res.token);
    }
    return res;
  },

  async getMe() {
    return request<{ success: boolean; user: UserProfile }>('/api/auth/me');
  },

  async saveAddress(address: Partial<ShippingAddress>) {
    return request<{ success: boolean; message: string; addresses: ShippingAddress[] }>('/api/auth/addresses', {
      method: 'POST',
      body: JSON.stringify(address)
    });
  },

  async demoLogin(role: 'customer' | 'admin') {
    const res = await request<{
      success: boolean;
      message: string;
      token: string;
      user: UserProfile;
    }>('/api/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
    if (res.token) {
      setStoredToken(res.token);
    }
    return res;
  },

  logout() {
    setStoredToken(null);
  }
};

// 2. Orders & Payment API
export const ordersApi = {
  async createPaymentOrder(orderData: {
    customerName: string;
    primaryPhone: string;
    altPhone?: string;
    email: string;
    houseFlat: string;
    streetLocality: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    items: {
      productId: string;
      selectedWeight: string;
      quantity: number;
    }[];
    couponCode?: string;
    expressDelivery?: boolean;
  }) {
    return request<{
      success: boolean;
      orderId: string;
      razorpayOrderId: string;
      amount: number;
      currency: string;
      keyId: string;
      customer: {
        name: string;
        email: string;
        phone: string;
      };
      error?: string;
      message?: string;
    }>('/api/orders/create-payment-order', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  async verifyPayment(verificationData: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    paymentMethod?: string;
  }) {
    return request<{
      success: boolean;
      message: string;
      order: Order;
    }>('/api/orders/verify-payment', {
      method: 'POST',
      body: JSON.stringify(verificationData)
    });
  },

  async simulatePayment(orderId: string, paymentMethod: string = 'UPI') {
    return request<{
      success: boolean;
      message: string;
      order: Order;
    }>('/api/orders/simulate-payment', {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentMethod })
    });
  },

  async notifyPaymentFailed(orderId: string, reason?: string) {
    return request('/api/orders/payment-failed', {
      method: 'POST',
      body: JSON.stringify({ orderId, reason })
    });
  },

  async getMyOrders() {
    return request<{ success: boolean; orders: any[] }>('/api/orders/my-orders');
  },

  async trackOrder(orderIdOrTracking: string) {
    return request<{ success: boolean; order: any }>(`/api/orders/track/${encodeURIComponent(orderIdOrTracking)}`);
  }
};

// 3. Admin Management API
export const adminApi = {
  async getOrders(params: { search?: string; status?: string; paymentStatus?: string; date?: string } = {}) {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.status) searchParams.set('status', params.status);
    if (params.paymentStatus) searchParams.set('paymentStatus', params.paymentStatus);
    if (params.date) searchParams.set('date', params.date);

    return request<{ success: boolean; orders: any[] }>(`/api/admin/orders?${searchParams.toString()}`);
  },

  async updateOrderStatus(orderId: string, updates: {
    status?: OrderStatus;
    note?: string;
    courierPartner?: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
  }) {
    return request<{ success: boolean; message: string; order: any }>(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  async getInventory() {
    return request<{ success: boolean; inventory: any[] }>('/api/admin/inventory');
  },

  async updateStock(id: string, stockQuantity: number) {
    return request<{ success: boolean; message: string }>(`/api/admin/inventory/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ stockQuantity })
    });
  },

  async getPayments() {
    return request<{ success: boolean; payments: any[]; transactions: any[] }>('/api/admin/payments');
  }
};
