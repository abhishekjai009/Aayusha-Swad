import { Router } from 'express';
import { db } from '../db';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Apply admin protection to all routes in this router
router.use(requireAuth, requireAdmin);

/**
 * 1. Get All Orders with Filtering & Search
 */
router.get('/orders', (req, res) => {
  const { search, status, paymentStatus, date } = req.query as {
    search?: string;
    status?: string;
    paymentStatus?: string;
    date?: string;
  };

  let query = 'SELECT * FROM orders WHERE 1=1';
  const queryParams: any[] = [];

  if (status && status !== 'All') {
    query += ' AND order_status = ?';
    queryParams.push(status);
  }

  if (paymentStatus && paymentStatus !== 'All') {
    query += ' AND payment_status = ?';
    queryParams.push(paymentStatus);
  }

  if (date) {
    query += ' AND created_at LIKE ?';
    queryParams.push(`${date}%`);
  }

  if (search && search.trim()) {
    const term = `%${search.trim().toLowerCase()}%`;
    query += ' AND (LOWER(id) LIKE ? OR LOWER(customer_name) LIKE ? OR primary_phone LIKE ? OR LOWER(city) LIKE ? OR LOWER(tracking_number) LIKE ?)';
    queryParams.push(term, term, term, term, term);
  }

  query += ' ORDER BY created_at DESC';

  const orders = db.prepare(query).all(...queryParams) as any[];

  const populated = orders.map(order => {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    const statusHistory = db.prepare('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY id ASC').all(order.id);
    const payment = db.prepare('SELECT * FROM payments WHERE order_id = ?').get(order.id);
    return {
      ...order,
      items,
      statusHistory,
      payment
    };
  });

  return res.json({ success: true, orders: populated });
});

/**
 * 2. Update Order Fulfillment Status, Tracking & Courier
 */
router.patch('/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const {
    status,
    note,
    courierPartner,
    trackingNumber,
    estimatedDelivery
  } = req.body;

  const validStatuses = [
    'Pending Payment',
    'Payment Failed',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Refund Initiated',
    'Refunded'
  ];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
  }

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const newStatus = status || order.order_status;
  const newCourier = courierPartner || order.courier_partner;
  const newTracking = trackingNumber || order.tracking_number;
  const newDelivery = estimatedDelivery || order.estimated_delivery;

  db.prepare(`
    UPDATE orders 
    SET order_status = ?,
        courier_partner = ?,
        tracking_number = ?,
        estimated_delivery = ?,
        updated_at = datetime('now')
    WHERE id = ?
  `).run(newStatus, newCourier, newTracking, newDelivery, orderId);

  // Add history entry
  const statusMessage = note || `Order updated to ${newStatus}${courierPartner ? ` via ${courierPartner}` : ''}`;
  db.prepare(`
    INSERT INTO order_status_history (order_id, status, message, created_by)
    VALUES (?, ?, ?, 'admin')
  `).run(orderId, newStatus, statusMessage);

  // If status is refunded, update payments table too
  if (newStatus === 'Refunded') {
    db.prepare(`
      UPDATE orders SET payment_status = 'Refunded' WHERE id = ?
    `).run(orderId);
    db.prepare(`
      UPDATE payments SET status = 'refunded' WHERE order_id = ?
    `).run(orderId);
  }

  const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);
  const statusHistory = db.prepare('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY id ASC').all(orderId);

  return res.json({
    success: true,
    message: `Order ${orderId} updated successfully.`,
    order: { ...updatedOrder, items, statusHistory }
  });
});

/**
 * 3. Inventory Stock Management
 */
router.get('/inventory', (req, res) => {
  const inventory = db.prepare(`
    SELECT pi.*, p.name as product_name, p.category, p.price as base_price
    FROM product_inventory pi
    JOIN products p ON pi.product_id = p.id
    ORDER BY p.name ASC
  `).all();

  return res.json({ success: true, inventory });
});

router.patch('/inventory/:id', (req, res) => {
  const { id } = req.params;
  const { stockQuantity } = req.body;

  if (typeof stockQuantity !== 'number' || stockQuantity < 0) {
    return res.status(400).json({ success: false, message: 'Invalid stock quantity.' });
  }

  db.prepare(`
    UPDATE product_inventory 
    SET stock_quantity = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(stockQuantity, id);

  return res.json({ success: true, message: 'Stock updated.' });
});

/**
 * 4. Payment Transactions & Audit Logs
 */
router.get('/payments', (req, res) => {
  const payments = db.prepare(`
    SELECT p.*, o.customer_name, o.primary_phone, o.order_status
    FROM payments p
    LEFT JOIN orders o ON p.order_id = o.id
    ORDER BY p.created_at DESC
    LIMIT 100
  `).all();

  const transactions = db.prepare(`
    SELECT * FROM payment_transactions
    ORDER BY created_at DESC
    LIMIT 100
  `).all();

  return res.json({ success: true, payments, transactions });
});

export default router;
