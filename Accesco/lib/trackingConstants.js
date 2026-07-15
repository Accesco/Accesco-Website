/**
 * @fileoverview Centralized constants for the Quick Commerce delivery tracking system.
 *
 * Single source of truth for order/rider lifecycles, Firestore collection names,
 * ETA defaults, traffic multipliers, and notification types.
 *
 * Rules:
 * - Export only constants (no functions).
 * - Prefer named exports; never magic strings at call sites.
 * - Objects are frozen to prevent accidental runtime mutation.
 *
 * @module lib/trackingConstants
 */

/**
 * Order lifecycle statuses for the delivery pipeline.
 * Values match existing frontend order status conventions (UPPER_SNAKE).
 *
 * @readonly
 * @enum {string}
 */
export const ORDER_STATUS = Object.freeze({
  PLACED: 'PLACED',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  PACKED: 'PACKED',
  RIDER_ASSIGNED: 'RIDER_ASSIGNED',
  PICKED_UP: 'PICKED_UP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  ARRIVING: 'ARRIVING',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
});

/**
 * Rider activity statuses during assignment and delivery.
 * Values match `riderTrackingService` document field conventions (snake_case).
 *
 * @readonly
 * @enum {string}
 */
export const RIDER_STATUS = Object.freeze({
  IDLE: 'idle',
  ASSIGNED: 'assigned',
  PICKING_UP: 'picking_up',
  ON_THE_WAY: 'on_the_way',
  ARRIVING: 'arriving',
  DELIVERED: 'delivered',
});

/**
 * Firestore collection names used by the tracking architecture.
 *
 * @readonly
 * @enum {string}
 */
export const COLLECTIONS = Object.freeze({
  ORDERS: 'orders',
  VENDORS: 'vendors',
  RIDERS: 'riders',
  RIDER_TRACKING: 'rider_tracking',
  NOTIFICATIONS: 'notifications',
});

/**
 * Default average rider speed in kilometers per hour.
 * Used by ETA calculations when live speed telemetry is unavailable.
 *
 * @type {number}
 * @readonly
 */
export const DEFAULT_SPEED = 25;

/**
 * Default vendor preparation time in minutes.
 * Used before packing is complete when vendor-specific prep data is missing.
 *
 * @type {number}
 * @readonly
 */
export const DEFAULT_PREP_TIME = 15;

/**
 * Default simulation / position-poll tick interval in milliseconds.
 * Aligns with `riderTrackingService` default write cadence (~3s).
 *
 * @type {number}
 * @readonly
 */
export const DEFAULT_TICK_INTERVAL = 3000;

/**
 * Multipliers applied to travel duration based on traffic density.
 * `LIGHT` is baseline (1.0); higher values increase ETA.
 *
 * @readonly
 * @enum {number}
 */
export const TRAFFIC_MULTIPLIERS = Object.freeze({
  LIGHT: 1.0,
  MODERATE: 1.2,
  HEAVY: 1.5,
  SEVERE: 2.0,
});

/**
 * Notification event types emitted across the order/rider lifecycle.
 *
 * @readonly
 * @enum {string}
 */
export const NOTIFICATION_TYPES = Object.freeze({
  PREPARING: 'PREPARING',
  PACKED: 'PACKED',
  ASSIGNED: 'ASSIGNED',
  PICKED_UP: 'PICKED_UP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  ARRIVING: 'ARRIVING',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  CART_REMINDER: 'CART_REMINDER',
});
