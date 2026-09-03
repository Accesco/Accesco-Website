/**
 * @module lib/mailService
 * @description Centralized mail service with HTML templates and order status pipeline.
 * Uses Resend (resend.com) as the mail provider — swap API_KEY via env.
 * Order pipeline: PENDING -> CONFIRMED -> PROCESSING -> DISPATCHED -> DELIVERED
 */

// ─── Order Status Pipeline ─────────────────────────────────────────────────

export const ORDER_STATUSES = {
  PENDING:     { key: 'PENDING',     label: 'Pending',     step: 0 },
  CONFIRMED:   { key: 'CONFIRMED',   label: 'Confirmed',   step: 1 },
  PROCESSING:  { key: 'PROCESSING',  label: 'Processing',  step: 2 },
  DISPATCHED:  { key: 'DISPATCHED',  label: 'Dispatched',  step: 3 },
  DELIVERED:   { key: 'DELIVERED',   label: 'Delivered',   step: 4 },
  CANCELLED:   { key: 'CANCELLED',   label: 'Cancelled',   step: -1 },
};

/**
 * Advance order to the next pipeline stage.
 * @param {string} currentStatus - One of ORDER_STATUSES keys
 * @returns {string} Next status key
 */
export function advanceOrderStatus(currentStatus) {
  const pipeline = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DISPATCHED', 'DELIVERED'];
  const idx = pipeline.indexOf(currentStatus?.toUpperCase());
  if (idx === -1 || idx === pipeline.length - 1) return currentStatus;
  return pipeline[idx + 1];
}

/**
 * Update order status (in-memory helper).
 * @param {string} orderId
 * @param {string} newStatus
 */
export function updateOrderStatusLocal(orderId, newStatus) {
  return { id: orderId, status: newStatus, updatedAt: new Date().toISOString() };
}

// ─── Mail Sender (Resend API) ──────────────────────────────────────────────

const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_EMAIL    = process.env.RESEND_FROM_EMAIL || process.env.NEXT_PUBLIC_MAIL_FROM || 'Accesco <noreply@accescoliving.com>';
const API_KEY       = process.env.RESEND_API_KEY;

/**
 * Send an email via Resend.
 * Safe to call from server components / API routes only.
 * @param {{ to: string, subject: string, html: string }} options
 */
export async function sendMail({ to, subject, html }) {
  if (!API_KEY) {
    console.warn('[mailService] RESEND_API_KEY not set. Email not sent.');
    return { success: false, error: 'API key missing' };
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Send failed');
    return { success: true, id: data.id };
  } catch (err) {
    console.error('[mailService] Send error:', err.message);
    return { success: false, error: err.message };
  }
}

// ─── Template: Base Layout ─────────────────────────────────────────────────

function baseLayout({ title, preheader, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#18181b}
  .wrapper{max-width:600px;margin:0 auto;padding:32px 16px}
  .card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)}
  .header{background:#111827;padding:28px 32px;text-align:center}
  .header img{height:36px;margin-bottom:12px}
  .header-brand{color:#fff;font-size:22px;font-weight:700;letter-spacing:.04em}
  .header-sub{color:#9ca3af;font-size:13px;margin-top:4px;letter-spacing:.08em;text-transform:uppercase}
  .body{padding:32px}
  .greeting{font-size:20px;font-weight:600;color:#111827;margin-bottom:8px}
  .note{font-size:14px;color:#4b5563;line-height:1.6;margin-bottom:24px}
  .status-bar{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin-bottom:24px;display:flex;align-items:center;gap:12px}
  .status-dot{width:10px;height:10px;border-radius:50%;background:#16a34a;flex-shrink:0}
  .status-dot.pending{background:#f59e0b}
  .status-dot.dispatched{background:#2563eb}
  .status-label{font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.06em}
  .status-value{font-size:15px;font-weight:700;color:#111827}
  .section-title{font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px}
  .items-table{width:100%;border-collapse:collapse;margin-bottom:20px}
  .items-table th{text-align:left;font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;padding:0 0 8px}
  .items-table td{padding:10px 0;border-top:1px solid #f3f4f6;font-size:14px;color:#374151;vertical-align:middle}
  .items-table td:last-child{text-align:right;font-weight:600;color:#111827}
  .item-name{font-weight:600;color:#111827;font-size:14px}
  .item-meta{font-size:12px;color:#9ca3af;margin-top:2px}
  .totals{background:#f9fafb;border-radius:8px;padding:16px 20px;margin-bottom:24px}
  .total-row{display:flex;justify-content:space-between;font-size:14px;color:#4b5563;padding:4px 0}
  .total-row.grand{border-top:1px solid #e5e7eb;margin-top:8px;padding-top:12px;font-size:16px;font-weight:700;color:#111827}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px}
  .info-box{background:#f9fafb;border-radius:8px;padding:14px 16px}
  .info-label{font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
  .info-value{font-size:14px;font-weight:600;color:#111827;line-height:1.4}
  .cta{display:block;text-align:center;background:#111827;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:.04em;margin-bottom:24px}
  .footer{text-align:center;padding:24px 16px 8px;color:#9ca3af;font-size:12px;line-height:1.6}
  .footer a{color:#6b7280;text-decoration:none}
  @media(max-width:480px){
    .info-grid{grid-template-columns:1fr}
    .body{padding:20px}
  }
</style>
</head>
<body>
<span style="display:none;max-height:0;overflow:hidden">${preheader}</span>
<div class="wrapper">
  <div class="card">
    <div class="header">
      <div class="header-brand">Swadishtt</div>
      <div class="header-sub">by Accesco</div>
    </div>
    <div class="body">
      ${body}
    </div>
  </div>
  <div class="footer">
    <p>Accesco Technologies &nbsp;|&nbsp; <a href="http://accescoliving.com">accescoliving.com</a></p>
    <p style="margin-top:6px">You received this because you placed an order. &nbsp;<a href="http://accescoliving.com/unsubscribe">Unsubscribe</a></p>
  </div>
</div>
</body>
</html>`;
}

// ─── Template: Order Confirmation ──────────────────────────────────────────

/**
 * Generate HTML for Swadishtt order confirmation email.
 * @param {{ order: object, customerName: string }} params
 */
export function buildOrderConfirmationEmail({ order, customerName }) {
  const name    = customerName || order?.delivery?.name || 'Customer';
  const orderId = order?.id || 'N/A';
  const items   = order?.items || [];
  const totals  = order?.totals || {};
  const addr    = order?.delivery || {};
  const method  = (order?.paymentMethod || 'online').toUpperCase();
  const etaMinutes = order?.deliveryPartner?.etaMinutes || (order?.deliverySpeed === 'batched' ? 25 : 10);

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
        <strong>${item.name}</strong>
        ${item.restaurant ? `<br/><span style="color:#888;font-size:12px;">${item.restaurant}</span>` : ''}
        ${item.sku ? `<span style="color:#888;font-size:12px;"> · ${item.sku}</span>` : ''}
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:center;">x${item.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;">&#8377;${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const deliveryAddress = [addr.address, addr.city, addr.pincode].filter(Boolean).join(', ');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1a1a1a;">
      <div style="background:#1a1a1a;border-radius:8px;padding:24px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:13px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Order Confirmed</p>
        <h1 style="margin:0;font-size:26px;font-weight:700;color:#fff;">Your Swadishtt order is placed.</h1>
      </div>

      <p style="font-size:15px;line-height:1.7;margin:0 0 20px;">
        Hi ${name}, your food is being prepared.
        Estimated delivery: <strong>~${etaMinutes} min</strong>.
      </p>

      <p style="font-size:13px;color:#888;margin:0 0 6px;">Order ID: <code style="background:#f0f0f0;padding:2px 6px;border-radius:4px;">${orderId}</code></p>
      <p style="font-size:13px;color:#888;margin:0 0 24px;">Delivery to: ${deliveryAddress || 'Your address'}</p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 0;border-bottom:2px solid #1a1a1a;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Item</th>
            <th style="text-align:center;padding:8px 0;border-bottom:2px solid #1a1a1a;font-size:12px;text-transform:uppercase;">Qty</th>
            <th style="text-align:right;padding:8px 0;border-bottom:2px solid #1a1a1a;font-size:12px;text-transform:uppercase;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <table style="width:100%;font-size:14px;margin-bottom:24px;">
        <tr>
          <td style="padding:4px 0;color:#555;">Subtotal</td>
          <td style="padding:4px 0;text-align:right;">&#8377;${(totals.subtotal || 0).toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#555;">Delivery</td>
          <td style="padding:4px 0;text-align:right;">${totals.deliveryFee === 0 ? '<span style="color:#0c831f;">FREE</span>' : `&#8377;${totals.deliveryFee || 0}`}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#555;">Platform Fee</td>
          <td style="padding:4px 0;text-align:right;">&#8377;${totals.platformFee || 5}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#555;">GST</td>
          <td style="padding:4px 0;text-align:right;">&#8377;${(totals.gst || 0).toLocaleString('en-IN')}</td>
        </tr>
        ${totals.discount > 0 ? `
        <tr>
          <td style="padding:4px 0;color:#0c831f;">Batched Discount</td>
          <td style="padding:4px 0;text-align:right;color:#0c831f;">-&#8377;${totals.discount}</td>
        </tr>` : ''}
        <tr style="border-top:2px solid #1a1a1a;">
          <td style="padding:10px 0 4px;font-weight:700;font-size:16px;">Total Paid</td>
          <td style="padding:10px 0 4px;text-align:right;font-weight:700;font-size:16px;">&#8377;${(totals.total || 0).toLocaleString('en-IN')}</td>
        </tr>
      </table>

      <p style="font-size:13px;color:#999;margin:32px 0 0;">
        — Swadishtt by Accesco Living · <a href="https://accescoliving.com/services/swadisht/order-tracking?id=${orderId}" style="color:#1a1a1a;font-weight:700;text-decoration:underline;">Track Order #${orderId}</a>
      </p>
    </div>
  `;

  const subject  = `Order Confirmed — #${orderId} | Swadishtt`;
  return { subject, html };
}

// ─── Template: Order Status Update ────────────────────────────────────────

/**
 * Generate HTML for order status update email.
 * @param {{ order: object, customerName: string, newStatus: string }} params
 */
export function buildStatusUpdateEmail({ order, customerName, newStatus }) {
  const name    = customerName || order?.delivery?.name || 'Customer';
  const orderId = order?.id || 'N/A';
  const status  = ORDER_STATUSES[newStatus?.toUpperCase()] || { label: newStatus, step: 0 };

  const statusMessages = {
    PROCESSING:  'Your order is being prepared by our kitchen team.',
    DISPATCHED:  'Your order has been picked up and is on its way to you.',
    DELIVERED:   'Your order has been delivered. Enjoy your meal!',
    CANCELLED:   'Your order has been cancelled. A refund will be processed within 3–5 business days.',
  };

  const dotClass = newStatus === 'DISPATCHED' ? 'dispatched' : newStatus === 'PENDING' ? 'pending' : '';
  const statusMsg = statusMessages[newStatus?.toUpperCase()] || `Your order status is now: ${status.label}.`;
  const showTrack = !['DELIVERED', 'CANCELLED'].includes(newStatus?.toUpperCase());

  const body = `
    <p class="greeting">${newStatus === 'DELIVERED' ? 'Delivered!' : `Update on Order #${orderId}`}</p>
    <p class="note">${statusMsg}</p>

    <div class="status-bar">
      <div class="status-dot ${dotClass}"></div>
      <div>
        <div class="status-label">Current Status</div>
        <div class="status-value">${status.label}</div>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <div class="info-label">Order ID</div>
        <div class="info-value">#${orderId}</div>
      </div>
      <div class="info-box">
        <div class="info-label">Customer</div>
        <div class="info-value">${name}</div>
      </div>
    </div>

    ${showTrack ? `<a href="http://accescoliving.com/services/swadisht/order-tracking?id=${orderId}" class="cta">Track My Order</a>` : ''}
    ${newStatus === 'DELIVERED' ? '<p class="note" style="text-align:center;color:#6b7280">Rate your experience on the app. Your feedback helps us improve.</p>' : ''}
  `;

  const subject   = `Order ${status.label} — #${orderId} | Swadishtt`;
  const preheader = statusMsg;
  const html      = baseLayout({ title: subject, preheader, body });
  return { subject, html };
}

// ─── Template: InstaStyle Order Confirmation ───────────────────────────────

/**
 * Generate HTML for InstaStyle order confirmation email.
 * @param {{ order: object, customerName: string }} params
 */
export function buildInstaStyleOrderEmail({ order, customerName }) {
  const name    = customerName || order?.customerName || 'Customer';
  const orderId = order?.id || 'N/A';
  const items   = order?.items || [];
  const totals  = order?.totals || {};
  const addr    = order?.shippingAddress || {};
  const method  = (order?.paymentMethod || 'online').toUpperCase();

  const itemsHtml = items.map((item) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece8;">
        <strong>${item.name}</strong>
        ${item.brand ? `<br/><span style="color:#888;font-size:12px;">${item.brand}</span>` : ''}
        ${item.size ? `<span style="color:#888;font-size:12px;"> · Size ${item.size}</span>` : ''}
        ${item.sku ? `<span style="color:#888;font-size:12px;"> · ${item.sku}</span>` : ''}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece8;text-align:center;">x${item.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece8;text-align:right;">&#8377;${((item.discountedPrice || item.price) * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const deliveryAddress = [addr.line1 || addr.address, addr.city, addr.pincode].filter(Boolean).join(', ');

  const html = `
    <div style="font-family:'Georgia',serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#1a1a1a;">
      <div style="border-top:3px solid #1a1a1a;padding-top:24px;margin-bottom:32px;">
        <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;">Order Confirmed</p>
        <h1 style="margin:0;font-size:28px;font-weight:400;letter-spacing:-0.5px;">InstaStyle</h1>
        <p style="margin:4px 0 0;font-size:12px;color:#888;">by Accesco Living</p>
      </div>

      <p style="font-size:15px;line-height:1.8;margin:0 0 24px;">
        Hi ${name} — your order is confirmed and being prepared.
        Estimated delivery: <strong>3–5 Business Days</strong>.
      </p>

      <p style="font-size:12px;color:#888;margin:0 0 4px;">Order · <code style="background:#f5f5f0;padding:2px 6px;">${orderId}</code></p>
      <p style="font-size:12px;color:#888;margin:0 0 32px;">Ship to: ${deliveryAddress || 'Your address'}</p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 0;border-bottom:1px solid #1a1a1a;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:400;">Item</th>
            <th style="text-align:center;padding:8px 0;border-bottom:1px solid #1a1a1a;font-size:11px;text-transform:uppercase;font-weight:400;">Qty</th>
            <th style="text-align:right;padding:8px 0;border-bottom:1px solid #1a1a1a;font-size:11px;text-transform:uppercase;font-weight:400;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <table style="width:100%;font-size:14px;margin-bottom:32px;">
        <tr>
          <td style="padding:5px 0;color:#666;">Subtotal</td>
          <td style="padding:5px 0;text-align:right;">&#8377;${(totals.subtotal || 0).toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#666;">Shipping</td>
          <td style="padding:5px 0;text-align:right;">${(totals.shippingFee || totals.deliveryFee) === 0 ? '<span style="color:#2d6a4f;">FREE</span>' : `&#8377;${totals.shippingFee || totals.deliveryFee || 0}`}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#666;">GST</td>
          <td style="padding:5px 0;text-align:right;">&#8377;${(totals.gst || totals.tax || 0).toLocaleString('en-IN')}</td>
        </tr>
        ${(totals.discount || 0) > 0 ? `
        <tr>
          <td style="padding:5px 0;color:#2d6a4f;">Discount</td>
          <td style="padding:5px 0;text-align:right;color:#2d6a4f;">-&#8377;${totals.discount}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:12px 0 4px;font-size:16px;font-weight:600;border-top:1px solid #1a1a1a;">Total Paid</td>
          <td style="padding:12px 0 4px;text-align:right;font-size:16px;font-weight:600;border-top:1px solid #1a1a1a;">&#8377;${(totals.total || 0).toLocaleString('en-IN')}</td>
        </tr>
      </table>

      <p style="font-size:12px;color:#999;border-top:1px solid #f0ece8;padding-top:20px;margin:0;">
        InstaStyle by Accesco Living · 
        <a href="https://accescoliving.com/services/instastyle/orders/${orderId}" style="color:#1a1a1a;font-weight:700;text-decoration:underline;">View Order #${orderId}</a>
      </p>
    </div>
  `;

  const subject   = `Order Confirmed — #${orderId} | InstaStyle`;
  return { subject, html };
}

// ─── Template: Grokly Order Confirmation ───────────────────────────────────

/**
 * Generate HTML for Grokly order confirmation email.
 * @param {{ order: object, customerName: string }} params
 */
export function buildGroklyOrderEmail({ order, customerName }) {
  const name    = customerName || order?.customerName || 'Customer';
  const orderId = order?.id || 'N/A';
  const items   = order?.items || [];
  const totals  = order?.totals || {};
  const addr    = order?.address || '';
  const method  = (order?.paymentMethod || 'online').toUpperCase();

  const itemRows = items.map((item) => `
    <tr>
      <td>
        <div class="item-name">${item.name}</div>
        ${item.sku ? `<div class="item-meta">SKU: ${item.sku}</div>` : ''}
      </td>
      <td style="color:#6b7280">${item.quantity}&times;</td>
      <td>&#8377;${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const body = `
    <p class="greeting">Order Confirmed, ${name.split(' ')[0]}.</p>
    <p class="note">Your Grokly order <strong>#${orderId}</strong> is confirmed and is being packed for delivery.</p>

    <div class="status-bar">
      <div class="status-dot"></div>
      <div>
        <div class="status-label">Order Status</div>
        <div class="status-value">Processing</div>
      </div>
    </div>

    <p class="section-title">Items Ordered</p>
    <table class="items-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th style="text-align:right">Total</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <div class="totals">
      <div class="total-row"><span>Subtotal</span><span>&#8377;${(totals.subtotal || 0).toLocaleString('en-IN')}</span></div>
      <div class="total-row"><span>Delivery Fee</span><span>${totals.deliveryFee === 0 ? 'Free' : '&#8377;' + (totals.deliveryFee || 0)}</span></div>
      <div class="total-row grand"><span>Total Paid</span><span>&#8377;${(totals.total || 0).toLocaleString('en-IN')}</span></div>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <div class="info-label">Delivery To</div>
        <div class="info-value">${addr}</div>
      </div>
      <div class="info-box">
        <div class="info-label">Payment Method</div>
        <div class="info-value">${method}</div>
      </div>
      <div class="info-box">
        <div class="info-label">Order ID</div>
        <div class="info-value">#${orderId}</div>
      </div>
      <div class="info-box">
        <div class="info-label">Est. Time</div>
        <div class="info-value">${order.eta ? `${order.eta} Mins` : 'Instant'}</div>
      </div>
    </div>

    <a href="http://accescoliving.com/services/grokly/order-tracking?id=${orderId}" class="cta">Track My Order</a>
  `;

  const subject   = `Order Confirmed — #${orderId} | Grokly`;
  const preheader = `Your Grokly order #${orderId} is confirmed.`;
  const html      = baseLayout({ title: subject, preheader, body });
  return { subject, html };
}

// ─── Convenience senders ───────────────────────────────────────────────────

export function buildInstaStyleStatusUpdateEmail({ order, customerName, newStatus }) {
  const name    = customerName || order?.customerName || 'Customer';
  const orderId = order?.id || 'N/A';
  const statusMessages = {
    CONFIRMED:   'Your InstaStyle order has been confirmed by our merchant partner.',
    PROCESSING:  'Your items are being carefully inspected and packed.',
    DISPATCHED:  'Your order has been handed over to our courier partner.',
    DELIVERED:   'Your fashion package has been successfully delivered.',
    CANCELLED:   'Your order has been cancelled and a refund has been initiated.',
  };
  const statusMsg = statusMessages[newStatus?.toUpperCase()] || `Your order status is now: ${newStatus}.`;
  
  const body = `
    <p class="greeting">Order Update</p>
    <p class="note">Hi ${name}, ${statusMsg}</p>
    <div class="status-bar">
      <div class="status-dot"></div>
      <div>
        <div class="status-label">Current Status</div>
        <div class="status-value">${newStatus}</div>
      </div>
    </div>
    <div class="info-grid">
      <div class="info-box">
        <div class="info-label">Order ID</div>
        <div class="info-value">#${orderId}</div>
      </div>
    </div>
  `;
  const subject = `InstaStyle Update — Order #${orderId}`;
  const html = baseLayout({ title: subject, preheader: statusMsg, body });
  return { subject, html };
}

export async function sendSwadishttConfirmation({ order, customerName, email }) {
  const { subject, html } = buildOrderConfirmationEmail({ order, customerName });
  return sendMail({ to: email, subject, html });
}

export async function sendSwadishttStatusUpdate({ order, customerName, email, newStatus }) {
  const { subject, html } = buildStatusUpdateEmail({ order, customerName, newStatus });
  return sendMail({ to: email, subject, html });
}

export async function sendInstaStyleConfirmation({ order, customerName, email }) {
  const { subject, html } = buildInstaStyleOrderEmail({ order, customerName });
  return sendMail({ to: email, subject, html });
}

export async function sendInstaStyleStatusUpdate({ order, customerName, email, newStatus }) {
  const { subject, html } = buildInstaStyleStatusUpdateEmail({ order, customerName, newStatus });
  return sendMail({ to: email, subject, html });
}

export async function sendGroklyConfirmation({ order, customerName, email }) {
  const { subject, html } = buildGroklyOrderEmail({ order, customerName });
  return sendMail({ to: email, subject, html });
}

