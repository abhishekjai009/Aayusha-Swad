import nodemailer, { type Transporter } from 'nodemailer';
import { db } from '../db';

export interface EmailOrderPayload {
  orderId: string;
  customerName: string;
  email: string;
  primaryPhone: string;
  altPhone?: string;
  items: {
    productName: string;
    selectedWeight: string;
    quantity: number;
    price: number;
    subtotal: number;
    imageUrl?: string;
  }[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  appliedCoupon?: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: {
    houseFlat: string;
    streetLocality: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber: string;
  estimatedDelivery: string;
  orderDate: string;
}

export class EmailService {
  private static transporter: Transporter | null = null;

  private static getTransporter(): Transporter {
    if (!this.transporter) {
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
      } else {
        // Fallback to JSON transport or test preview in development
        this.transporter = nodemailer.createTransport({
          jsonTransport: true
        });
      }
    }
    return this.transporter;
  }

  /**
   * Build branded HTML template for Aayusha Swad
   */
  private static buildEmailTemplate(data: EmailOrderPayload): string {
    const trackingUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/?view=track-order&orderId=${data.orderId}`;
    
    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #F3F4F6; vertical-align: middle;">
          <div style="font-weight: 600; color: #1F2937; font-size: 14px;">${item.productName}</div>
          <div style="font-size: 12px; color: #6B7280;">Pack: ${item.selectedWeight} × ${item.quantity}</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #F3F4F6; text-align: center; color: #374151; font-size: 14px;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #F3F4F6; text-align: right; color: #374151; font-size: 14px; font-weight: 600;">
          ₹${item.price}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #F3F4F6; text-align: right; color: #1F2937; font-size: 14px; font-weight: bold;">
          ₹${item.subtotal}
        </td>
      </tr>
    `).join('');

    const formattedDate = new Date(data.orderDate).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Aayusha Swad Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #292524;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAFAF7; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          
          <!-- Brand Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #FFFDF5 0%, #FEF9E7 50%, #FDF4D8 100%); padding: 35px 30px; text-align: center; border-bottom: 2px solid #F59E0B;">
              <table align="center" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #D97706, #F59E0B, #FB923C); border-radius: 14px; text-align: center; line-height: 50px; color: #FFFFFF; font-weight: 900; font-size: 22px; margin: 0 auto 10px auto; box-shadow: 0 4px 10px rgba(217, 119, 6, 0.3);">
                      AS
                    </div>
                    <h1 style="margin: 0; color: #1C1917; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Aayusha Swad</h1>
                    <p style="margin: 4px 0 0 0; color: #B45309; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                      Traditional Taste • 100% Pure Desi Ghee
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Confirmation Hero Banner -->
          <tr>
            <td style="padding: 30px 30px 15px 30px;">
              <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 12px; padding: 18px 20px; text-align: center;">
                <span style="font-size: 24px;">🎉</span>
                <h2 style="margin: 8px 0 4px 0; color: #065F46; font-size: 18px; font-weight: 700;">Order Confirmed & Being Freshly Prepared!</h2>
                <p style="margin: 0; color: #047857; font-size: 13px;">
                  Namaste <strong>${data.customerName}</strong>, thank you for your order. We are preparing your snacks fresh with utmost love and hygiene.
                </p>
              </div>
            </td>
          </tr>

          <!-- Order Summary Meta -->
          <tr>
            <td style="padding: 10px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F9FAFB; border-radius: 12px; padding: 16px;">
                <tr>
                  <td width="50%" style="font-size: 13px; color: #4B5563; padding-bottom: 8px;">
                    Order ID: <strong style="color: #D97706; font-family: monospace; font-size: 14px;">${data.orderId}</strong>
                  </td>
                  <td width="50%" align="right" style="font-size: 13px; color: #4B5563; padding-bottom: 8px;">
                    Order Date: <strong style="color: #111827;">${formattedDate}</strong>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="font-size: 13px; color: #4B5563;">
                    Waybill: <strong style="color: #111827; font-family: monospace;">${data.trackingNumber}</strong>
                  </td>
                  <td width="50%" align="right" style="font-size: 13px; color: #4B5563;">
                    Estimated Delivery: <strong style="color: #059669;">${data.estimatedDelivery}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Purchased Items Table -->
          <tr>
            <td style="padding: 20px 30px;">
              <h3 style="margin: 0 0 12px 0; color: #1F2937; font-size: 16px; font-weight: 700;">Items Ordered</h3>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #E5E7EB; border-radius: 10px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #F9FAFB; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; color: #6B7280;">
                    <th align="left" style="padding: 10px 12px; font-weight: 700;">Product</th>
                    <th align="center" style="padding: 10px 12px; font-weight: 700;">Qty</th>
                    <th align="right" style="padding: 10px 12px; font-weight: 700;">Price</th>
                    <th align="right" style="padding: 10px 12px; font-weight: 700;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Price Breakdown -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-left: auto; max-width: 280px;">
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #6B7280;">Subtotal:</td>
                  <td align="right" style="padding: 4px 0; font-size: 13px; color: #111827; font-weight: 600;">₹${data.subtotal}</td>
                </tr>
                ${data.discount > 0 ? `
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #059669;">Discount (${data.appliedCoupon || 'Coupon'}):</td>
                  <td align="right" style="padding: 4px 0; font-size: 13px; color: #059669; font-weight: 600;">-₹${data.discount}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #6B7280;">Shipping & Packaging:</td>
                  <td align="right" style="padding: 4px 0; font-size: 13px; color: #111827; font-weight: 600;">
                    ${data.deliveryCharge === 0 ? '<span style="color: #059669; font-weight: bold;">FREE</span>' : `₹${data.deliveryCharge}`}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 0 0; border-top: 1px dashed #D1D5DB; font-size: 15px; font-weight: bold; color: #111827;">Total Paid:</td>
                  <td align="right" style="padding: 10px 0 0 0; border-top: 1px dashed #D1D5DB; font-size: 18px; font-weight: 800; color: #D97706;">
                    ₹${data.total}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" align="right" style="padding-top: 4px; font-size: 11px; color: #6B7280;">
                    Payment Mode: <strong>${data.paymentMethod} (${data.paymentStatus})</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Address & Contact Info -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFDF7; border: 1px solid #FDE68A; border-radius: 12px; padding: 18px;">
                <tr>
                  <td>
                    <h4 style="margin: 0 0 8px 0; color: #92400E; font-size: 14px; font-weight: 700;">📍 Delivery Address:</h4>
                    <p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.5;">
                      <strong>${data.customerName}</strong><br>
                      ${data.shippingAddress.houseFlat}, ${data.shippingAddress.streetLocality}<br>
                      ${data.shippingAddress.landmark ? `Landmark: ${data.shippingAddress.landmark}<br>` : ''}
                      ${data.shippingAddress.city}, ${data.shippingAddress.state} - <strong>${data.shippingAddress.pincode}</strong>
                    </p>
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #6B7280;">
                      📞 Primary Mobile: <strong>${data.primaryPhone}</strong>
                      ${data.altPhone ? ` • Alternate: <strong>${data.altPhone}</strong>` : ''}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Track Button CTA -->
          <tr>
            <td align="center" style="padding: 0 30px 30px 30px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #D97706, #F59E0B); border-radius: 12px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);">
                    <a href="${trackingUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 12px;">
                      Track Your Live Shipment ➔
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer & Support Contact -->
          <tr>
            <td style="background-color: #1C1917; padding: 25px 30px; text-align: center; color: #A8A29E; font-size: 12px; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; color: #F59E0B; font-weight: 700; font-size: 13px;">
                Aayusha Swad Pure Homemade Delights
              </p>
              <p style="margin: 0 0 10px 0;">
                Made fresh with 100% pure desi cow ghee, stone-ground flours, and zero preservatives.
              </p>
              <p style="margin: 0; color: #78716C;">
                Questions about your order? Email us at <a href="mailto:support@aayushaswad.com" style="color: #FBBF24; text-decoration: none;">support@aayushaswad.com</a> or WhatsApp <a href="https://wa.me/919876543210" style="color: #FBBF24; text-decoration: none;">+91 98765 43210</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  /**
   * Send order confirmation email idempotently
   */
  static async sendOrderConfirmationEmail(orderData: EmailOrderPayload): Promise<{ success: boolean; message: string }> {
    const subject = `Your Aayusha Swad Order Has Been Confirmed! – Order #${orderData.orderId}`;
    
    // Check if confirmation email was already dispatched for this order to prevent duplicates
    const existingLog = db.prepare(`
      SELECT * FROM email_logs 
      WHERE order_id = ? AND status = 'sent'
    `).get(orderData.orderId) as any;

    if (existingLog) {
      console.log(`[EmailService] Order confirmation email already sent for order ${orderData.orderId}. Skipping to prevent duplication.`);
      return {
        success: true,
        message: 'Order confirmation email already sent.'
      };
    }

    const htmlContent = this.buildEmailTemplate(orderData);
    const logId = `eml_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    try {
      const transporter = this.getTransporter();
      const mailOptions = {
        from: process.env.FROM_EMAIL || '"Aayusha Swad Orders" <orders@aayushaswad.com>',
        to: orderData.email,
        subject: subject,
        html: htmlContent
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`\n========================================================`);
      console.log(`📧 [ORDER CONFIRMATION EMAIL SENT]`);
      console.log(`To: ${orderData.email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Order: ${orderData.orderId} | Total: ₹${orderData.total}`);
      console.log(`========================================================\n`);

      // Log success in database
      db.prepare(`
        INSERT INTO email_logs (id, order_id, recipient_email, subject, status, error, html_body, sent_at)
        VALUES (?, ?, ?, ?, 'sent', NULL, ?, datetime('now'))
      `).run(logId, orderData.orderId, orderData.email, subject, htmlContent);

      return {
        success: true,
        message: 'Order confirmation email sent successfully.'
      };
    } catch (err: any) {
      console.error(`[EmailService] Failed to send email for order ${orderData.orderId}:`, err);
      
      // Log failure in database for retry without canceling the order
      db.prepare(`
        INSERT INTO email_logs (id, order_id, recipient_email, subject, status, error, html_body, sent_at)
        VALUES (?, ?, ?, ?, 'failed', ?, ?, datetime('now'))
      `).run(logId, orderData.orderId, orderData.email, subject, err?.message || 'Unknown email delivery error', htmlContent);

      return {
        success: false,
        message: `Failed to deliver confirmation email: ${err?.message}`
      };
    }
  }

  /**
   * Retry sending failed confirmation emails
   */
  static async retryFailedEmails(): Promise<number> {
    const failedLogs = db.prepare(`
      SELECT * FROM email_logs 
      WHERE status = 'failed'
      ORDER BY sent_at DESC LIMIT 10
    `).all() as any[];

    let retriedCount = 0;
    for (const log of failedLogs) {
      try {
        const transporter = this.getTransporter();
        await transporter.sendMail({
          from: process.env.FROM_EMAIL || '"Aayusha Swad Orders" <orders@aayushaswad.com>',
          to: log.recipient_email,
          subject: log.subject,
          html: log.html_body
        });

        db.prepare(`UPDATE email_logs SET status = 'sent', error = NULL WHERE id = ?`).run(log.id);
        retriedCount++;
      } catch (err) {
        console.error(`[EmailService] Retry failed for log ${log.id}:`, err);
      }
    }

    return retriedCount;
  }
}
