import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Setup data directory
const dataDir = path.resolve(process.cwd(), 'server', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'aayusha_swad.db');
export const db = new Database(dbPath);

// Enable WAL mode and foreign keys for high performance & ACID safety
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    -- 1. Users Table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      phone TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL DEFAULT '',
      email TEXT DEFAULT '',
      role TEXT NOT NULL DEFAULT 'customer', -- 'customer' | 'admin'
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 2. OTP Verification Table (never stores plain text OTP)
    CREATE TABLE IF NOT EXISTS otps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT NOT NULL,
      hashed_otp TEXT NOT NULL,
      salt TEXT NOT NULL,
      expires_at INTEGER NOT NULL, -- Unix timestamp in ms
      attempts INTEGER NOT NULL DEFAULT 0,
      resend_count INTEGER NOT NULL DEFAULT 0,
      is_verified INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone);

    -- 3. Customer Saved Addresses
    CREATE TABLE IF NOT EXISTS customer_addresses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      primary_phone TEXT NOT NULL,
      alt_phone TEXT DEFAULT '',
      email TEXT DEFAULT '',
      house_flat TEXT NOT NULL,
      street_locality TEXT NOT NULL,
      landmark TEXT DEFAULT '',
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      is_default INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_addresses_user ON customer_addresses(user_id);

    -- 4. Products Table
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      hindi_name TEXT,
      category TEXT NOT NULL,
      short_description TEXT NOT NULL,
      full_description TEXT NOT NULL,
      price REAL NOT NULL,
      original_price REAL,
      weight TEXT NOT NULL,
      weight_options TEXT NOT NULL, -- JSON
      rating REAL NOT NULL DEFAULT 5.0,
      review_count INTEGER NOT NULL DEFAULT 0,
      images TEXT NOT NULL, -- JSON
      in_stock INTEGER NOT NULL DEFAULT 1,
      is_best_seller INTEGER NOT NULL DEFAULT 0,
      is_new_arrival INTEGER NOT NULL DEFAULT 0,
      is_featured INTEGER NOT NULL DEFAULT 0,
      badge TEXT,
      ingredients TEXT NOT NULL, -- JSON
      nutrition_facts TEXT NOT NULL, -- JSON
      storage_instructions TEXT NOT NULL,
      shelf_life TEXT NOT NULL,
      tags TEXT NOT NULL, -- JSON
      reviews TEXT NOT NULL DEFAULT '[]', -- JSON
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 5. Product Inventory Table
    CREATE TABLE IF NOT EXISTS product_inventory (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      weight_option TEXT NOT NULL,
      stock_quantity INTEGER NOT NULL DEFAULT 100,
      reserved_quantity INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_inv_product_weight ON product_inventory(product_id, weight_option);

    -- 6. Orders Table
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      customer_name TEXT NOT NULL,
      primary_phone TEXT NOT NULL,
      alt_phone TEXT DEFAULT '',
      email TEXT NOT NULL,
      house_flat TEXT NOT NULL,
      street_locality TEXT NOT NULL,
      landmark TEXT DEFAULT '',
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      subtotal REAL NOT NULL,
      discount REAL NOT NULL DEFAULT 0,
      delivery_charge REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      applied_coupon TEXT,
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL, -- 'Paid' | 'Pending' | 'Failed' | 'Refunded'
      order_status TEXT NOT NULL,   -- 'Pending Payment' | 'Payment Failed' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Refund Initiated' | 'Refunded'
      tracking_number TEXT NOT NULL,
      courier_partner TEXT NOT NULL DEFAULT 'Delhivery Express',
      estimated_delivery TEXT NOT NULL,
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(primary_phone);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
    CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

    -- 7. Order Items Table
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      selected_weight TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      image_url TEXT,
      subtotal REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

    -- 8. Payments Table
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      gateway TEXT NOT NULL DEFAULT 'Razorpay',
      gateway_order_id TEXT,
      gateway_payment_id TEXT,
      gateway_signature TEXT,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      status TEXT NOT NULL, -- 'created' | 'authorized' | 'captured' | 'failed' | 'refunded'
      payment_method TEXT,
      error_description TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
    CREATE INDEX IF NOT EXISTS idx_payments_gateway_order ON payments(gateway_order_id);

    -- 9. Payment Transactions Audit Log
    CREATE TABLE IF NOT EXISTS payment_transactions (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      gateway TEXT NOT NULL DEFAULT 'Razorpay',
      event_type TEXT NOT NULL,
      status TEXT NOT NULL,
      payload TEXT, -- JSON response
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    -- 10. Order Status History Table
    CREATE TABLE IF NOT EXISTS order_status_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      status TEXT NOT NULL,
      message TEXT NOT NULL,
      created_by TEXT NOT NULL DEFAULT 'system',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_status_history_order ON order_status_history(order_id);

    -- 11. Email Notifications Dispatch Log (prevents duplicate emails & supports retry)
    CREATE TABLE IF NOT EXISTS email_logs (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      recipient_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      status TEXT NOT NULL, -- 'sent' | 'failed' | 'retry_pending'
      error TEXT,
      html_body TEXT,
      sent_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_email_logs_order ON email_logs(order_id);

    -- 12. Coupons Table
    CREATE TABLE IF NOT EXISTS coupons (
      code TEXT PRIMARY KEY,
      discount_type TEXT NOT NULL, -- 'percentage' | 'flat'
      discount_value REAL NOT NULL,
      min_order_value REAL NOT NULL DEFAULT 0,
      description TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      expiry_date TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 13. Contact Messages
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  // Check if products exist
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (productCount.count === 0) {
    console.log('📦 Seeding initial products & inventory...');
    
    // Seed initial products from hardcoded catalog
    const seedProducts = [
      {
        id: 'makhana-himalayan-salt',
        name: 'Himalayan Pink Salt Makhana',
        hindi_name: 'सेंधा नमक मखाना',
        category: 'Makhana',
        short_description: 'Slow-roasted jumbo foxnuts tossed in pure desi ghee and mineral-rich Himalayan pink salt.',
        full_description: 'Indulge in guilt-free crunch with Aayusha Swad’s Himalayan Pink Salt Makhana. Hand-harvested from pristine lotus ponds, these premium jumbo foxnuts are gently roasted in small batches using pure A2 Desi Cow Ghee and seasoned with stone-ground Himalayan pink rock salt.',
        price: 199,
        original_price: 249,
        weight: '150g',
        weight_options: JSON.stringify([
          { weight: '150g', price: 199, originalPrice: 249, inStock: true },
          { weight: '300g (Pack of 2)', price: 379, originalPrice: 498, inStock: true },
          { weight: '500g Mega Saver', price: 599, originalPrice: 799, inStock: true }
        ]),
        rating: 4.9,
        review_count: 142,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop'
        ]),
        in_stock: 1,
        is_best_seller: 1,
        is_new_arrival: 0,
        is_featured: 1,
        badge: 'Bestseller',
        ingredients: JSON.stringify(['Premium Foxnuts (Phool Makhana)', 'Pure Desi Cow Ghee', 'Himalayan Pink Salt', 'Black Pepper Extract']),
        nutrition_facts: JSON.stringify({
          servingSize: '30g',
          calories: '110 kcal',
          protein: '3.2g',
          carbohydrates: '18.4g',
          sugar: '0g',
          fat: '2.5g',
          dietaryFiber: '2.1g'
        }),
        storage_instructions: 'Store in an airtight container in a cool, dry place away from direct sunlight.',
        shelf_life: '6 Months from date of packaging',
        tags: JSON.stringify(['Gluten-Free', 'Pure Ghee', 'Roasted', 'Low Calorie', 'High Protein']),
        reviews: JSON.stringify([
          {
            id: 'rev-1',
            userName: 'Pooja Sharma',
            rating: 5,
            date: '2026-09-18',
            comment: 'The crunch is unbelievably fresh! You can taste the genuine desi ghee aroma.',
            verifiedPurchase: true
          }
        ])
      },
      {
        id: 'thekua-traditional-ghee',
        name: 'Traditional Desi Ghee Thekua',
        hindi_name: 'पारंपरिक शुद्ध घी ठेकुआ',
        category: 'Thekua',
        short_description: 'Authentic handmade Bihari Thekua slow-cooked in 100% pure cow ghee with whole wheat and organic jaggery.',
        full_description: 'An auspicious culinary masterpiece crafted using heritage wood-carved presses (Sancha). Made strictly with stone-ground whole wheat flour, organic sugarcane jaggery, pure cow ghee, and fragrant green cardamom with whole fennel seeds.',
        price: 280,
        original_price: 350,
        weight: '400g',
        weight_options: JSON.stringify([
          { weight: '400g (Approx. 12 pcs)', price: 280, originalPrice: 350, inStock: true },
          { weight: '800g Family Pack', price: 530, originalPrice: 700, inStock: true },
          { weight: '1.2kg Heritage Tin', price: 780, originalPrice: 1050, inStock: true }
        ]),
        rating: 5.0,
        review_count: 215,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop'
        ]),
        in_stock: 1,
        is_best_seller: 1,
        is_new_arrival: 0,
        is_featured: 1,
        badge: 'Traditional Recipe',
        ingredients: JSON.stringify(['Stone-Ground Whole Wheat Flour', 'Pure Desi Cow Ghee', 'Organic Desi Gur (Jaggery)', 'Whole Fennel Seeds (Saunf)', 'Green Cardamom']),
        nutrition_facts: JSON.stringify({
          servingSize: '40g',
          calories: '165 kcal',
          protein: '2.8g',
          carbohydrates: '24.2g',
          sugar: '9.4g',
          fat: '6.5g',
          dietaryFiber: '1.9g'
        }),
        storage_instructions: 'Keep in an airtight tin at room temperature. Do not refrigerate.',
        shelf_life: '30 Days from date of packaging',
        tags: JSON.stringify(['100% Desi Ghee', 'No White Sugar', 'Authentic Recipe', 'Zero Palm Oil']),
        reviews: JSON.stringify([
          {
            id: 'rev-3',
            userName: 'Meera Sengupta',
            rating: 5,
            date: '2026-09-22',
            comment: 'Reminds me of Chhath Puja prasad from home! Incredible authentic flavor.',
            verifiedPurchase: true
          }
        ])
      },
      {
        id: 'namak-paare-ajwain',
        name: 'Crispy Ajwain Namak Paare',
        hindi_name: 'अजवाइन नमक पारे',
        category: 'Namak Paare',
        short_description: 'Golden flaky diamond-cut savoury crackers infused with fragrant carom seeds.',
        full_description: 'A timeless Indian teatime staple. Diamond cut and slow-fried to crispy golden perfection, each bite is laced with the warm fragrance of roasted ajwain and rock salt.',
        price: 160,
        original_price: 200,
        weight: '350g',
        weight_options: JSON.stringify([
          { weight: '350g Fresh Box', price: 160, originalPrice: 200, inStock: true },
          { weight: '700g (Pack of 2)', price: 300, originalPrice: 400, inStock: true },
          { weight: '1kg Bulk Pantry', price: 420, originalPrice: 570, inStock: true }
        ]),
        rating: 4.8,
        review_count: 89,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop'
        ]),
        in_stock: 1,
        is_best_seller: 0,
        is_new_arrival: 1,
        is_featured: 1,
        badge: 'Tea Time Fav',
        ingredients: JSON.stringify(['Refined Flour & Whole Wheat Blend', 'Pure Cow Ghee Moyan', 'Organic Ajwain (Carom Seeds)', 'Rock Salt']),
        nutrition_facts: JSON.stringify({
          servingSize: '30g',
          calories: '135 kcal',
          protein: '2.5g',
          carbohydrates: '19.0g',
          sugar: '0.2g',
          fat: '5.5g',
          dietaryFiber: '1.2g'
        }),
        storage_instructions: 'Keep in an airtight jar. Best enjoyed with hot masala chai.',
        shelf_life: '45 Days from packaging',
        tags: JSON.stringify(['Crunchy', 'Tea Time', 'Pure Desi Ghee']),
        reviews: JSON.stringify([])
      },
      {
        id: 'cookies-nankhatai-royal',
        name: 'Pistachio Elaichi Royal Nankhatai',
        hindi_name: 'शाही पिस्ता इलायची नानखटाई',
        category: 'Cookies',
        short_description: 'Melt-in-mouth traditional Indian shortbread cookies topped with Iranian pistachios and green cardamom.',
        full_description: 'Handcrafted royal Nankhatai made strictly with pure cow ghee and roasted gram flour (Besan). Melts effortlessly on your tongue with rich buttery aroma.',
        price: 240,
        original_price: 300,
        weight: '300g',
        weight_options: JSON.stringify([
          { weight: '300g (12 Pcs Tin)', price: 240, originalPrice: 300, inStock: true },
          { weight: '600g Duo Tin Gift Set', price: 460, originalPrice: 600, inStock: true }
        ]),
        rating: 4.9,
        review_count: 98,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop'
        ]),
        in_stock: 1,
        is_best_seller: 1,
        is_new_arrival: 0,
        is_featured: 1,
        badge: 'Melt In Mouth',
        ingredients: JSON.stringify(['Roasted Gram Flour (Besan)', 'Whole Wheat Flour', 'Pure Desi Cow Ghee', 'Iranian Pistachios', 'Green Cardamom']),
        nutrition_facts: JSON.stringify({
          servingSize: '25g',
          calories: '120 kcal',
          protein: '2.1g',
          carbohydrates: '14.5g',
          sugar: '6.2g',
          fat: '6.0g',
          dietaryFiber: '1.0g'
        }),
        storage_instructions: 'Store in a cool dry place in airtight container.',
        shelf_life: '45 Days',
        tags: JSON.stringify(['Royal Sweets', 'Pure Desi Ghee', 'Handmade']),
        reviews: JSON.stringify([])
      }
    ];

    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, name, hindi_name, category, short_description, full_description,
        price, original_price, weight, weight_options, rating, review_count,
        images, in_stock, is_best_seller, is_new_arrival, is_featured, badge,
        ingredients, nutrition_facts, storage_instructions, shelf_life, tags, reviews
      ) VALUES (
        @id, @name, @hindi_name, @category, @short_description, @full_description,
        @price, @original_price, @weight, @weight_options, @rating, @review_count,
        @images, @in_stock, @is_best_seller, @is_new_arrival, @is_featured, @badge,
        @ingredients, @nutrition_facts, @storage_instructions, @shelf_life, @tags, @reviews
      )
    `);

    const insertInventory = db.prepare(`
      INSERT INTO product_inventory (id, product_id, weight_option, stock_quantity, reserved_quantity)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((products) => {
      for (const p of products) {
        insertProduct.run(p);
        const options = JSON.parse(p.weight_options);
        for (const opt of options) {
          insertInventory.run(`${p.id}_${opt.weight}`, p.id, opt.weight, 150, 0);
        }
      }
    });

    insertMany(seedProducts);
  }

  // Seed coupons if empty
  const couponCount = db.prepare('SELECT COUNT(*) as count FROM coupons').get() as { count: number };
  if (couponCount.count === 0) {
    console.log('🏷️ Seeding coupons...');
    const insertCoupon = db.prepare(`
      INSERT INTO coupons (code, discount_type, discount_value, min_order_value, description, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertCoupon.run('SWAD100', 'flat', 100, 499, 'Flat ₹100 OFF on orders above ₹499', 1);
    insertCoupon.run('DESIGHEE15', 'percentage', 15, 699, '15% OFF on orders above ₹699', 1);
    insertCoupon.run('FESTIVE20', 'percentage', 20, 999, '20% Mega Festive discount above ₹999', 1);
  }

  // Seed default Demo Admin and Demo User if not exists
  const adminCheck = db.prepare('SELECT * FROM users WHERE phone = ?').get('+919999988888') as any;
  if (!adminCheck) {
    db.prepare(`
      INSERT INTO users (id, phone, full_name, email, role)
      VALUES (?, ?, ?, ?, ?)
    `).run('adm-1', '+919999988888', 'Aayusha Swad Master Admin', 'admin@aayushaswad.com', 'admin');
  }

  const userCheck = db.prepare('SELECT * FROM users WHERE phone = ?').get('+919876543210') as any;
  if (!userCheck) {
    db.prepare(`
      INSERT INTO users (id, phone, full_name, email, role)
      VALUES (?, ?, ?, ?, ?)
    `).run('usr-1', '+919876543210', 'Abhishek Jaiswal', 'abhishek@example.com', 'customer');

    // Add address for demo user
    db.prepare(`
      INSERT INTO customer_addresses (
        id, user_id, full_name, primary_phone, alt_phone, email,
        house_flat, street_locality, landmark, city, state, pincode, is_default
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'addr-1',
      'usr-1',
      'Abhishek Jaiswal',
      '+919876543210',
      '+919811122233',
      'abhishek@example.com',
      'Flat 402, Royal Palms Residency',
      'Linking Road, Bandra West',
      'Near Nature Basket',
      'Mumbai',
      'Maharashtra',
      '400050',
      1
    );
  }

  // Seed sample initial order if no orders exist
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
  if (orderCount.count === 0) {
    console.log('📦 Seeding sample orders...');
    const orderId = 'AS-84920';
    db.prepare(`
      INSERT INTO orders (
        id, user_id, customer_name, primary_phone, alt_phone, email,
        house_flat, street_locality, landmark, city, state, pincode,
        subtotal, discount, delivery_charge, total, applied_coupon,
        payment_method, payment_status, order_status,
        tracking_number, courier_partner, estimated_delivery
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      'usr-1',
      'Abhishek Jaiswal',
      '+919876543210',
      '+919811122233',
      'abhishek@example.com',
      'Flat 402, Royal Palms Residency',
      'Linking Road, Bandra West',
      'Near Nature Basket',
      'Mumbai',
      'Maharashtra',
      '400050',
      479,
      100,
      0,
      379,
      'SWAD100',
      'UPI',
      'Paid',
      'Confirmed',
      'DEL-88491029',
      'Delhivery Express',
      '3 to 4 business days'
    );

    // Order item
    db.prepare(`
      INSERT INTO order_items (
        id, order_id, product_id, product_name, selected_weight, price, quantity, image_url, subtotal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'item-1',
      orderId,
      'makhana-himalayan-salt',
      'Himalayan Pink Salt Makhana',
      '150g',
      199,
      1,
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop',
      199
    );

    db.prepare(`
      INSERT INTO order_items (
        id, order_id, product_id, product_name, selected_weight, price, quantity, image_url, subtotal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'item-2',
      orderId,
      'thekua-traditional-ghee',
      'Traditional Desi Ghee Thekua',
      '400g',
      280,
      1,
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop',
      280
    );

    // Status history
    db.prepare(`
      INSERT INTO order_status_history (order_id, status, message, created_by)
      VALUES (?, ?, ?, ?)
    `).run(orderId, 'Confirmed', 'Order placed successfully. Payment mode: UPI verified.', 'system');

    // Payment record
    db.prepare(`
      INSERT INTO payments (
        id, order_id, gateway, gateway_order_id, gateway_payment_id, gateway_signature, amount, currency, status, payment_method
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'pay_sample_1',
      orderId,
      'Razorpay',
      'order_sample_84920',
      'pay_sample_84920',
      'sample_sig_abc123',
      379,
      'INR',
      'captured',
      'UPI'
    );
  }
}
