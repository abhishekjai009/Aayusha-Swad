import { Router } from 'express';
import { db } from '../db';
import { OtpService, sanitizePhoneNumber } from '../services/otpService';
import { generateToken, requireAuth } from '../middleware/auth';

const router = Router();

/**
 * 1. Request 6-digit OTP
 */
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required.' });
  }

  const result = await OtpService.sendOtp(phone);
  if (!result.success) {
    return res.status(429).json(result);
  }

  return res.json(result);
});

/**
 * 2. Verify 6-digit OTP and login / create account
 */
router.post('/verify-otp', async (req, res) => {
  const { phone, otp, fullName, email } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Phone number and 6-digit OTP are required.' });
  }

  const verifyResult = OtpService.verifyOtp(phone, otp);
  if (!verifyResult.success) {
    return res.status(400).json(verifyResult);
  }

  const sanitizedPhone = sanitizePhoneNumber(phone);

  // Check if user already exists
  let user = db.prepare('SELECT * FROM users WHERE phone = ?').get(sanitizedPhone) as any;

  if (!user) {
    // New user signup
    const newId = `usr_${Date.now()}`;
    const defaultName = fullName?.trim() || 'Aayusha Swad Customer';
    const userEmail = email?.trim() || '';

    db.prepare(`
      INSERT INTO users (id, phone, full_name, email, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'customer', datetime('now'), datetime('now'))
    `).run(newId, sanitizedPhone, defaultName, userEmail);

    user = db.prepare('SELECT * FROM users WHERE id = ?').get(newId);
  } else {
    // Update name or email if provided during verification
    if (fullName && fullName.trim()) {
      db.prepare('UPDATE users SET full_name = ?, updated_at = datetime(\'now\') WHERE id = ?').run(fullName.trim(), user.id);
    }
    if (email && email.trim() && !user.email) {
      db.prepare('UPDATE users SET email = ?, updated_at = datetime(\'now\') WHERE id = ?').run(email.trim(), user.id);
    }
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
  }

  // Fetch addresses
  const addresses = db.prepare('SELECT * FROM customer_addresses WHERE user_id = ? ORDER BY is_default DESC').all(user.id);

  // Generate JWT token
  const token = generateToken({
    id: user.id,
    phone: user.phone,
    fullName: user.full_name,
    email: user.email,
    role: user.role
  });

  return res.json({
    success: true,
    message: 'Login successful!',
    token,
    user: {
      id: user.id,
      name: user.full_name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      addresses
    }
  });
});

/**
 * 3. Get currently logged in user profile
 */
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user!.id) as any;
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const addresses = db.prepare('SELECT * FROM customer_addresses WHERE user_id = ? ORDER BY is_default DESC').all(user.id);

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.full_name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      addresses
    }
  });
});

/**
 * 4. Save / update customer address
 */
router.post('/addresses', requireAuth, (req, res) => {
  const {
    id,
    fullName,
    primaryPhone,
    altPhone,
    email,
    houseFlat,
    streetLocality,
    landmark,
    city,
    state,
    pincode,
    isDefault
  } = req.body;

  if (!fullName || !primaryPhone || !houseFlat || !streetLocality || !city || !state || !pincode) {
    return res.status(400).json({ success: false, message: 'All required delivery address fields must be provided.' });
  }

  const addressId = id || `addr_${Date.now()}`;

  if (isDefault) {
    db.prepare('UPDATE customer_addresses SET is_default = 0 WHERE user_id = ?').run(req.user!.id);
  }

  const existing = db.prepare('SELECT * FROM customer_addresses WHERE id = ? AND user_id = ?').get(addressId, req.user!.id);

  if (existing) {
    db.prepare(`
      UPDATE customer_addresses 
      SET full_name = ?, primary_phone = ?, alt_phone = ?, email = ?,
          house_flat = ?, street_locality = ?, landmark = ?,
          city = ?, state = ?, pincode = ?, is_default = ?
      WHERE id = ? AND user_id = ?
    `).run(
      fullName, primaryPhone, altPhone || '', email || '',
      houseFlat, streetLocality, landmark || '',
      city, state, pincode, isDefault ? 1 : 0,
      addressId, req.user!.id
    );
  } else {
    db.prepare(`
      INSERT INTO customer_addresses (
        id, user_id, full_name, primary_phone, alt_phone, email,
        house_flat, street_locality, landmark, city, state, pincode, is_default
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      addressId, req.user!.id, fullName, primaryPhone, altPhone || '', email || '',
      houseFlat, streetLocality, landmark || '', city, state, pincode, isDefault ? 1 : 0
    );
  }

  const addresses = db.prepare('SELECT * FROM customer_addresses WHERE user_id = ? ORDER BY is_default DESC').all(req.user!.id);
  return res.json({ success: true, message: 'Address saved successfully.', addresses });
});

/**
 * 5. Instant Demo Logins (Evaluation convenience)
 */
router.post('/demo-login', (req, res) => {
  const { role } = req.body;
  const targetPhone = role === 'admin' ? '+919999988888' : '+919876543210';
  const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(targetPhone) as any;

  if (!user) {
    return res.status(404).json({ success: false, message: 'Demo profile not found.' });
  }

  const addresses = db.prepare('SELECT * FROM customer_addresses WHERE user_id = ? ORDER BY is_default DESC').all(user.id);
  const token = generateToken({
    id: user.id,
    phone: user.phone,
    fullName: user.full_name,
    email: user.email,
    role: user.role
  });

  return res.json({
    success: true,
    message: `Logged in as ${user.full_name} (${user.role})`,
    token,
    user: {
      id: user.id,
      name: user.full_name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      addresses
    }
  });
});

export default router;
