/**
 * @fileoverview Notification payload factory for delivery lifecycle events.
 *
 * Generates reusable notification objects only — no Firebase Cloud Messaging,
 * no Firestore writes, no network side effects.
 *
 * @module lib/notificationEngine
 */

import { NOTIFICATION_TYPES } from './trackingConstants';

/**
 * @typedef {object} NotificationPayload
 * @property {string} type - One of NOTIFICATION_TYPES
 * @property {string} title
 * @property {string} body
 * @property {object} data - Structured metadata for clients
 * @property {number} createdAt - ms epoch
 */

/**
 * Builds a reusable notification object.
 *
 * Time Complexity:  O(1)
 * Space Complexity: O(1)
 *
 * @param {string} type
 * @param {string} title
 * @param {string} body
 * @param {object} [data={}]
 * @returns {NotificationPayload}
 */
function buildNotification(type, title, body, data = {}) {
  return {
    type,
    title,
    body,
    data: { ...data },
    createdAt: Date.now(),
  };
}

/**
 * Resolves a display order id from a loose context object.
 * @param {object} [ctx]
 * @returns {string}
 */
function orderLabel(ctx = {}) {
  return ctx.orderId || ctx.id || ctx.orderNumber || 'your order';
}

/**
 * @param {object} [ctx]
 * @returns {NotificationPayload}
 */
export function sendPreparing(ctx = {}) {
  const id = orderLabel(ctx);
  return buildNotification(
    NOTIFICATION_TYPES.PREPARING,
    'Preparing your order',
    `Order ${id} is being prepared.`,
    { orderId: ctx.orderId || ctx.id || null, status: NOTIFICATION_TYPES.PREPARING, ...ctx },
  );
}

/**
 * @param {object} [ctx]
 * @returns {NotificationPayload}
 */
export function sendPacked(ctx = {}) {
  const id = orderLabel(ctx);
  return buildNotification(
    NOTIFICATION_TYPES.PACKED,
    'Order packed',
    `Order ${id} is packed and ready for pickup.`,
    { orderId: ctx.orderId || ctx.id || null, status: NOTIFICATION_TYPES.PACKED, ...ctx },
  );
}

/**
 * @param {object} [ctx]
 * @returns {NotificationPayload}
 */
export function sendAssigned(ctx = {}) {
  const id = orderLabel(ctx);
  const rider = ctx.riderName || ctx.rider?.name || 'Your rider';
  return buildNotification(
    NOTIFICATION_TYPES.ASSIGNED,
    'Rider assigned',
    `${rider} has been assigned to order ${id}.`,
    {
      orderId: ctx.orderId || ctx.id || null,
      status: NOTIFICATION_TYPES.ASSIGNED,
      riderName: rider,
      ...ctx,
    },
  );
}

/**
 * @param {object} [ctx]
 * @returns {NotificationPayload}
 */
export function sendPickedUp(ctx = {}) {
  const id = orderLabel(ctx);
  return buildNotification(
    NOTIFICATION_TYPES.PICKED_UP,
    'Order picked up',
    `Order ${id} has been picked up by your rider.`,
    { orderId: ctx.orderId || ctx.id || null, status: NOTIFICATION_TYPES.PICKED_UP, ...ctx },
  );
}

/**
 * @param {object} [ctx]
 * @returns {NotificationPayload}
 */
export function sendOutForDelivery(ctx = {}) {
  const id = orderLabel(ctx);
  const eta = ctx.eta != null ? ` ETA ~${ctx.eta} min.` : '';
  return buildNotification(
    NOTIFICATION_TYPES.OUT_FOR_DELIVERY,
    'Out for delivery',
    `Order ${id} is on the way.${eta}`,
    {
      orderId: ctx.orderId || ctx.id || null,
      status: NOTIFICATION_TYPES.OUT_FOR_DELIVERY,
      eta: ctx.eta ?? null,
      ...ctx,
    },
  );
}

/**
 * @param {object} [ctx]
 * @returns {NotificationPayload}
 */
export function sendArriving(ctx = {}) {
  const id = orderLabel(ctx);
  return buildNotification(
    NOTIFICATION_TYPES.ARRIVING,
    'Arriving soon',
    `Your rider is arriving with order ${id}.`,
    { orderId: ctx.orderId || ctx.id || null, status: NOTIFICATION_TYPES.ARRIVING, ...ctx },
  );
}

/**
 * @param {object} [ctx]
 * @returns {NotificationPayload}
 */
export function sendDelivered(ctx = {}) {
  const id = orderLabel(ctx);
  return buildNotification(
    NOTIFICATION_TYPES.DELIVERED,
    'Order delivered',
    `Order ${id} has been delivered. Enjoy!`,
    { orderId: ctx.orderId || ctx.id || null, status: NOTIFICATION_TYPES.DELIVERED, ...ctx },
  );
}

/**
 * @param {object} [ctx]
 * @returns {NotificationPayload}
 */
export function sendCancelled(ctx = {}) {
  const id = orderLabel(ctx);
  const reason = ctx.reason ? ` Reason: ${ctx.reason}` : '';
  return buildNotification(
    NOTIFICATION_TYPES.CANCELLED,
    'Order cancelled',
    `Order ${id} was cancelled.${reason}`,
    {
      orderId: ctx.orderId || ctx.id || null,
      status: NOTIFICATION_TYPES.CANCELLED,
      reason: ctx.reason || null,
      ...ctx,
    },
  );
}

/**
 * @param {object} [ctx]
 * @returns {NotificationPayload}
 */
export function sendCartReminder(ctx = {}) {
  const count = ctx.itemCount != null ? `${ctx.itemCount} item(s)` : 'items';
  return buildNotification(
    NOTIFICATION_TYPES.CART_REMINDER,
    'Complete your order',
    `You still have ${count} waiting in your cart.`,
    {
      type: NOTIFICATION_TYPES.CART_REMINDER,
      itemCount: ctx.itemCount ?? null,
      ...ctx,
    },
  );
}
