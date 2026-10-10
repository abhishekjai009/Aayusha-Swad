import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../db';
import { PaymentService } from '../services/paymentService';
import { requireAuth } from '../middleware/auth';
import { isValidIndianMobile } from '../services/otpService';

const router = Router();

/**
 * 1. Initialize Online Payment Order
 */
router.post('/create-payment-order', async (req, res) => {
  const {
    customerName,
    primaryPhone,
    altPhone,
    email,
    houseFlat,
    streetLocality,
    landmark,
    city,
    state,
    pincode,
    items,
    couponCode,
    expressDelivery
  } = req.body;

  // Validation
  if (!customerName?.trim()) {
    return res.status(400).json({ success: false, message: 'Full name is required.' });
  }

  if (!primaryPhone?.trim() || !isValidIndianMobile(primaryPhone)) {
    return res.status(400).json({ success: false, message: 'Valid primary mobile number (+91) is required.' });
  }

  if (altPhone?.trim() && !isValidIndianMobile(altPhone)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid alternate mobile number or leave it blank.' });
  }

  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'A valid email address is required for order confirmation.' });
  }

  if (!houseFlat?.trim() || !streetLocality?.trim() || !city?.trim() || !state?.trim()) {
    return res.status(400).json({ success: false, message: 'Complete delivery address (House/Flat, Street, City, State) is required.' });
  }

  if (!pincode?.trim() || !/^\d{6}$/.test(pincode.trim())) {
    return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit Indian PIN code.' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Your snack basket is empty.' });
  }

  const result = await PaymentService.createPaymentOrder({
    userId: req.user?.id,
    customerName: customerName.trim(),
    primaryPhone: primaryPhone.trim(),
    altPhone: altPhone?.trim() || '',
    email: email.trim().toLowerCase(),
    houseFlat: houseFlat.trim(),
    streetLocality: streetLocality.trim(),
    landmark: landmark?.trim() || '',
    city: city.trim(),
    state: state.trim(),
    pincode: pincode.trim(),
    items,
    couponCode,
    expressDelivery: Boolean(expressDelivery)
  });

  if (!result.success) {
    return res.status(400).json({ success: false, message: result.error });
  }

  return res.json(result);
});

/**
 * 2. Verify Payment Signature & Confirm Order
 */
router.post('/verify-payment', async (req, res) => {
  const {
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    paymentMethod
  } = req.body;

  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({
      success: false,
      message: 'Payment verification parameters missing (orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature).'
    });
  }

  const result = await PaymentService.verifyAndConfirmPayment({
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    paymentMethod: paymentMethod || 'Online (UPI / Card)'
  });

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.json(result);
});

/**
 * 3. Payment Simulator for Test Environment
 * Allows testing full payment flow when Razorpay test credentials or simulator is triggered
 */
router.post('/simulate-payment', async (req, res) => {
  const { orderId, paymentMethod = 'UPI' } = req.body;
  if (!orderId) {
    return res.status(400).json({ success: false, message: 'orderId is required.' });
  }

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const paymentRecord = db.prepare('SELECT * FROM payments WHERE order_id = ?').get(orderId) as any;
  const razorpayOrderId = paymentRecord?.gateway_order_id || `order_sim_${Date.now()}`;
  const razorpayPaymentId = `pay_sim_${Date.now()}`;
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_AayushaSwad999';

  const validSignature = crypto
    .createHmac('sha256', key_secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  const result = await PaymentService.verifyAndConfirmPayment({
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature: validSignature,
    paymentMethod
  });

  return res.json(result);
});

/**
 * 4. Payment Failure Notification
 */
router.post('/payment-failed', (req, res) => {
  const { orderId, reason } = req.body;
  if (!orderId) {
    return res.status(400).json({ success: false, message: 'Order ID is required.' });
  }

  db.prepare(`
    UPDATE orders 
    SET order_status = 'Payment Failed', payment_status = 'Failed', updated_at = datetime('now')
    WHERE id = ?
  `).run(orderId);

  db.prepare(`
    INSERT INTO order_status_history (order_id, status, message, created_by)
    VALUES (?, 'Payment Failed', ?, 'system')
  `).run(orderId, reason || 'Online transaction failed or was dismissed.');

  return res.json({ success: true, message: 'Order status updated to Payment Failed.' });
});

/**
 * 5. Razorpay Webhook Endpoint
 */
router.post('/webhook', async (req, res) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const rawBody = (req as any).rawBody || JSON.stringify(req.body);

  if (!signature) {
    return res.status(400).json({ success: false, message: 'Missing webhook signature header.' });
  }

  const result = await PaymentService.handleWebhook(rawBody, signature);
  return res.json(result);
});

/**
 * 6. Get Current Customer's Orders
 */
router.get('/my-orders', requireAuth, (req, res) => {
  const userId = req.user!.id;
  const userPhone = req.user!.phone;

  // Find orders by user_id or primary_phone
  const orders = db.prepare(`
    SELECT * FROM orders 
    WHERE user_id = ? OR primary_phone = ?
    ORDER BY created_at DESC
  `).all(userId, userPhone) as any[];

  const populated = orders.map(order => {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    const statusHistory = db.prepare('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY id ASC').all(order.id);
    return {
      ...order,
      items,
      statusHistory
    };
  });

  return res.json({ success: true, orders: populated });
});

/**
 * 7. Track Order by Order ID or Tracking Number (Public or Authenticated)
 */
router.get('/track/:id', (req, res) => {
  const idQuery = req.params.id.trim();

  const order = db.prepare(`
    SELECT * FROM orders 
    WHERE UPPER(id) = UPPER(?) OR UPPER(tracking_number) = UPPER(?)
  `).get(idQuery, idQuery) as any;

  if (!order) {
    return res.status(404).json({ success: false, message: `No order found with ID or Tracking #${idQuery}` });
  }

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  const statusHistory = db.prepare('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY id ASC').all(order.id);

  return res.json({
    success: true,
    order: {
      ...order,
      items,
      statusHistory
    }
  });
});

export default router;
