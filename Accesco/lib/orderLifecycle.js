/**
 * Order Lifecycle and Status Engine
 * Standardized status transitions and email triggering across Grokly, Swadishtt, and InstaStyle.
 */

import {
  sendSwadishttConfirmation,
  sendSwadishttStatusUpdate,
  sendInstaStyleConfirmation,
} from '@/lib/mailService';

export const ORDER_LIFECYCLE_STEPS = [
  'PLACED',
  'PAYMENT_PENDING',
  'PAYMENT_SUCCESS',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'PICKED_UP',
  'ON_THE_WAY',
  'DELIVERED',
];

export const STATUS_LABELS = {
  PLACED: 'Order Received',
  PAYMENT_PENDING: 'Payment Pending',
  PAYMENT_SUCCESS: 'Payment Received',
  CONFIRMED: 'Order Confirmed',
  PREPARING: 'Preparing Your Order',
  READY: 'Order Ready',
  PICKED_UP: 'Picked Up by Courier',
  ON_THE_WAY: 'On The Way',
  DELIVERED: 'Delivered',
};

/**
 * Returns the next logical status in the lifecycle transition sequence.
 */
export function getNextLifecycleStatus(currentStatus) {
  const normalized = String(currentStatus || 'PLACED').toUpperCase();
  const currentIndex = ORDER_LIFECYCLE_STEPS.indexOf(normalized);

  if (currentIndex === -1 || currentIndex >= ORDER_LIFECYCLE_STEPS.length - 1) {
    return 'DELIVERED';
  }

  // Skip intermediate payment states during automatic progression if confirmed
  if (normalized === 'CONFIRMED') return 'PREPARING';
  if (normalized === 'PREPARING') return 'READY';
  if (normalized === 'READY') return 'ON_THE_WAY';
  if (normalized === 'ON_THE_WAY') return 'DELIVERED';

  return ORDER_LIFECYCLE_STEPS[currentIndex + 1];
}

/**
 * Sends appropriate email notifications based on venture and new status.
 */
export async function sendOrderLifecycleEmail(venture, order, customerName, email, status) {
  if (!email) return { success: false, reason: 'No email provided' };

  const normVenture = String(venture).toLowerCase();
  const targetStatus = String(status || order.status || 'CONFIRMED').toUpperCase();

  try {
    if (normVenture === 'swadishtt' || normVenture === 'swadisht') {
      if (targetStatus === 'CONFIRMED' || targetStatus === 'PLACED') {
        return await sendSwadishttConfirmation({ order, customerName, email });
      }
      return await sendSwadishttStatusUpdate({ order, customerName, email, newStatus: targetStatus });
    }

    if (normVenture === 'instastyle') {
      return await sendInstaStyleConfirmation({ order, customerName, email });
    }

    if (normVenture === 'grokly') {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) return { success: false, reason: 'RESEND_API_KEY missing' };

      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Accesco <noreply@accescoliving.com>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject: `Grokly Order ${STATUS_LABELS[targetStatus] || targetStatus} — #${order.id}`,
          html: `<div style="font-family:sans-serif;padding:20px;">
            <h2>Grokly Order #${order.id}</h2>
            <p>Hi ${customerName || 'Customer'}, your order status is now: <strong>${STATUS_LABELS[targetStatus] || targetStatus}</strong>.</p>
            <p>Thank you for shopping with Grokly!</p>
          </div>`,
        }),
      });
      return { success: res.ok };
    }

    return { success: false, reason: `Unknown venture: ${venture}` };
  } catch (error) {
    console.error(`[OrderLifecycle] Email notification error for ${venture}:`, error);
    return { success: false, error: error.message };
  }
}
