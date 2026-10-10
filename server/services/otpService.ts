import crypto from 'crypto';
import { db } from '../db';

export interface OtpGenerationResult {
  success: boolean;
  message: string;
  cooldownSeconds?: number;
  expiresInSeconds?: number;
  phone?: string;
  // Note: plain OTP is NEVER sent to frontend in production responses.
}

export interface OtpVerificationResult {
  success: boolean;
  message: string;
  phone?: string;
}

// Normalize phone number to standard format (+91XXXXXXXXXX)
export function sanitizePhoneNumber(phoneInput: string): string {
  const cleaned = phoneInput.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+91')) {
    return cleaned;
  }
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `+91${cleaned.slice(1)}`;
  }
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return cleaned;
}

// Validate standard Indian phone format
export function isValidIndianMobile(phone: string): boolean {
  const sanitized = sanitizePhoneNumber(phone);
  return /^\+91[6-9]\d{9}$/.test(sanitized);
}

// Generate cryptographic hash
function hashOtp(otp: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(otp).digest('hex');
}

export class OtpService {
  private static OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
  private static RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds
  private static MAX_REQUESTS_10MIN = 4; // Max 4 requests in 10 minutes
  private static MAX_VERIFICATION_ATTEMPTS = 5;

  /**
   * Request and send 6-digit OTP to user mobile
   */
  static async sendOtp(phoneInput: string): Promise<OtpGenerationResult> {
    const phone = sanitizePhoneNumber(phoneInput);

    if (!isValidIndianMobile(phone)) {
      return {
        success: false,
        message: 'Please enter a valid 10-digit Indian mobile number.'
      };
    }

    const now = Date.now();
    const tenMinutesAgo = now - 10 * 60 * 1000;

    // Check rate limit: Total requests in last 10 minutes
    const recentRequests = db.prepare(`
      SELECT COUNT(*) as count FROM otps 
      WHERE phone = ? AND created_at >= ?
    `).get(phone, tenMinutesAgo) as { count: number };

    if (recentRequests && recentRequests.count >= this.MAX_REQUESTS_10MIN) {
      return {
        success: false,
        message: 'Too many OTP requests. For security, please wait 10 minutes before requesting again.'
      };
    }

    // Check resend cooldown from the latest OTP
    const latestOtp = db.prepare(`
      SELECT * FROM otps 
      WHERE phone = ? 
      ORDER BY id DESC LIMIT 1
    `).get(phone) as any;

    if (latestOtp && now - latestOtp.created_at < this.RESEND_COOLDOWN_MS) {
      const waitRemaining = Math.ceil((this.RESEND_COOLDOWN_MS - (now - latestOtp.created_at)) / 1000);
      return {
        success: false,
        cooldownSeconds: waitRemaining,
        message: `Please wait ${waitRemaining} seconds before requesting a new OTP.`
      };
    }

    // Generate random 6-digit cryptographic OTP (100000 to 999999)
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const salt = crypto.randomBytes(16).toString('hex');
    const hashed = hashOtp(rawOtp, salt);
    const expiresAt = now + this.OTP_EXPIRY_MS;

    // Invalidate previous unverified OTPs for this phone
    db.prepare(`
      UPDATE otps 
      SET is_verified = -1 
      WHERE phone = ? AND is_verified = 0
    `).run(phone);

    // Save hashed OTP securely in database
    db.prepare(`
      INSERT INTO otps (phone, hashed_otp, salt, expires_at, attempts, resend_count, is_verified, created_at)
      VALUES (?, ?, ?, ?, 0, ?, 0, ?)
    `).run(phone, hashed, salt, expiresAt, (latestOtp?.resend_count || 0) + 1, now);

    // Dispatch SMS via configured service
    await this.dispatchSms(phone, rawOtp);

    return {
      success: true,
      message: `A 6-digit verification code has been sent to ${phone}. Valid for 5 minutes.`,
      expiresInSeconds: 300,
      cooldownSeconds: 30,
      phone
    };
  }

  /**
   * Verify the entered 6-digit OTP
   */
  static verifyOtp(phoneInput: string, enteredOtp: string): OtpVerificationResult {
    const phone = sanitizePhoneNumber(phoneInput);
    const cleanOtp = enteredOtp.trim();

    if (!cleanOtp || cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      return {
        success: false,
        message: 'Please enter a valid 6-digit numeric OTP code.'
      };
    }

    const now = Date.now();

    // Retrieve active OTP record
    const otpRecord = db.prepare(`
      SELECT * FROM otps 
      WHERE phone = ? AND is_verified = 0 
      ORDER BY id DESC LIMIT 1
    `).get(phone) as any;

    if (!otpRecord) {
      return {
        success: false,
        message: 'No active OTP request found for this number. Please request a new code.'
      };
    }

    // Check expiry
    if (now > otpRecord.expires_at) {
      db.prepare('UPDATE otps SET is_verified = -1 WHERE id = ?').run(otpRecord.id);
      return {
        success: false,
        message: 'This OTP has expired (5 minute validity limit). Please request a fresh OTP.'
      };
    }

    // Check maximum attempts limit to prevent brute force
    if (otpRecord.attempts >= this.MAX_VERIFICATION_ATTEMPTS) {
      db.prepare('UPDATE otps SET is_verified = -1 WHERE id = ?').run(otpRecord.id);
      return {
        success: false,
        message: 'Too many incorrect attempts. This OTP has been invalidated for security. Please request a new code.'
      };
    }

    // Verify hash using timing-safe comparison
    const enteredHash = hashOtp(cleanOtp, otpRecord.salt);
    const hashBufferA = Buffer.from(enteredHash, 'hex');
    const hashBufferB = Buffer.from(otpRecord.hashed_otp, 'hex');

    const isMatch = hashBufferA.length === hashBufferB.length && crypto.timingSafeEqual(hashBufferA, hashBufferB);

    if (!isMatch) {
      const newAttempts = otpRecord.attempts + 1;
      db.prepare('UPDATE otps SET attempts = ? WHERE id = ?').run(newAttempts, otpRecord.id);
      const remainingAttempts = this.MAX_VERIFICATION_ATTEMPTS - newAttempts;

      if (remainingAttempts <= 0) {
        db.prepare('UPDATE otps SET is_verified = -1 WHERE id = ?').run(otpRecord.id);
        return {
          success: false,
          message: 'Incorrect OTP. Maximum attempts exceeded. Please request a new code.'
        };
      }

      return {
        success: false,
        message: `Incorrect OTP. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`
      };
    }

    // Successful verification
    db.prepare(`
      UPDATE otps 
      SET is_verified = 1 
      WHERE id = ?
    `).run(otpRecord.id);

    return {
      success: true,
      message: 'Mobile number verified successfully.',
      phone
    };
  }

  /**
   * Internal dispatcher for SMS delivery
   */
  private static async dispatchSms(phone: string, plainOtp: string): Promise<void> {
    const provider = process.env.SMS_PROVIDER || 'mock';

    // 1. Fast2SMS Provider Integration (Standard Indian Bulk SMS Gateway)
    if (provider === 'fast2sms' && process.env.FAST2SMS_API_KEY) {
      try {
        const rawPhone = phone.replace('+91', '');
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            variables_values: plainOtp,
            route: 'otp',
            numbers: rawPhone
          })
        });
        const resJson = await response.json();
        console.log(`[Fast2SMS] Sent OTP to ${phone}: status = ${resJson.return}`);
        return;
      } catch (err) {
        console.error('[Fast2SMS] Failed to send SMS:', err);
      }
    }

    // 2. Twilio Provider Integration
    if (provider === 'twilio' && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            To: phone,
            From: process.env.TWILIO_PHONE_NUMBER || '',
            Body: `Your Aayusha Swad verification code is: ${plainOtp}. Valid for 5 minutes. Do not share this OTP with anyone.`
          }).toString()
        });
        console.log(`[Twilio] Sent OTP to ${phone}`);
        return;
      } catch (err) {
        console.error('[Twilio] Failed to send SMS:', err);
      }
    }

    // 3. Development / Mock SMS Simulation
    // Log clearly to server terminal for instant frictionless developer testing
    console.log('\n========================================================');
    console.log(`📱 [SMS SERVICE] Outgoing Message to ${phone}`);
    console.log(`💬 "Your Aayusha Swad verification code is: ${plainOtp}. Valid for 5 minutes."`);
    console.log('========================================================\n');
  }
}
