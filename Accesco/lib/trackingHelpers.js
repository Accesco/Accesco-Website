/**
 * @fileoverview Normalization and status helpers for live tracking.
 *
 * @module lib/trackingHelpers
 */

import { ORDER_STATUS, RIDER_STATUS } from './trackingConstants';
import { calculateETA as engineCalculateETA, calculateRemainingDistance as engineCalculateRemainingDistance } from './etaEngine';
import { computeHeading } from './headingCalculator';
import { computeRoutePosition } from './animationEngine';

/** Customer-facing delivery progress stages (Swiggy/Zomato style). */
export const DELIVERY_STAGES = Object.freeze([
  { key: ORDER_STATUS.PLACED, label: 'Order Confirmed' },
  { key: ORDER_STATUS.PREPARING, label: 'Preparing' },
  { key: ORDER_STATUS.PICKED_UP, label: 'Picked Up' },
  { key: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'Out For Delivery' },
  { key: ORDER_STATUS.ARRIVING, label: 'Almost There' },
  { key: ORDER_STATUS.DELIVERED, label: 'Delivered' },
]);

/** Expanded vertical timeline for order tracking page. */
export const ORDER_TIMELINE = Object.freeze([
  ORDER_STATUS.PLACED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.PACKED,
  ORDER_STATUS.RIDER_ASSIGNED,
  ORDER_STATUS.PICKED_UP,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.ARRIVING,
  ORDER_STATUS.DELIVERED,
]);

/** Human-readable labels and descriptions per status. */
export const STATUS_META = Object.freeze({
  [ORDER_STATUS.PLACED]: { label: 'Placed', desc: 'Order received.' },
  [ORDER_STATUS.CONFIRMED]: { label: 'Confirmed', desc: 'Kitchen accepted your order.' },
  [ORDER_STATUS.PREPARING]: { label: 'Preparing', desc: 'Your meal is being prepared.' },
  [ORDER_STATUS.PACKED]: { label: 'Packed', desc: 'Order is packed and ready.' },
  [ORDER_STATUS.RIDER_ASSIGNED]: { label: 'Assigned', desc: 'A rider has been assigned.' },
  [ORDER_STATUS.PICKED_UP]: { label: 'Picked Up', desc: 'Rider picked up your order.' },
  [ORDER_STATUS.OUT_FOR_DELIVERY]: { label: 'Out For Delivery', desc: 'Rider is heading to you.' },
  [ORDER_STATUS.ARRIVING]: { label: 'Arriving', desc: 'Rider is nearby.' },
  [ORDER_STATUS.DELIVERED]: { label: 'Delivered', desc: 'Order delivered successfully.' },
  [ORDER_STATUS.CANCELLED]: { label: 'Cancelled', desc: 'Order was cancelled.' },
  PENDING: { label: 'Placed', desc: 'Order received, awaiting confirmation.' },
  CONFIRMED: { label: 'Confirmed', desc: 'Kitchen has accepted your order.' },
  PROCESSING: { label: 'Preparing', desc: 'Your meal is being freshly prepared.' },
  DISPATCHED: { label: 'Out For Delivery', desc: 'Delivery partner is heading to you.' },
});

const LEGACY_STATUS_MAP = Object.freeze({
  PENDING: ORDER_STATUS.PLACED,
  CONFIRMED: ORDER_STATUS.PREPARING,
  PROCESSING: ORDER_STATUS.PREPARING,
  DISPATCHED: ORDER_STATUS.OUT_FOR_DELIVERY,
  DELIVERED: ORDER_STATUS.DELIVERED,
  CANCELLED: ORDER_STATUS.CANCELLED,
  PACKING: ORDER_STATUS.PACKED,
  ASSIGNED: ORDER_STATUS.RIDER_ASSIGNED,
});

/**
 * Normalizes a raw Tracking API or Firestore payload into a unified snapshot.
 *
 * @param {object|null} raw
 * @returns {import('../services/trackingService').TrackingSnapshot|null}
 */
export function normalizeTrackingSnapshot(raw) {
  if (!raw) return null;

  const tracking = raw.tracking ?? raw;
  const rider = raw.rider ?? {};
  const order = raw.order ?? {};

  const lat = Number(
    tracking.latitude ?? tracking.lat ?? raw.lat,
  );
  const lng = Number(
    tracking.longitude ?? tracking.lng ?? raw.lng,
  );

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return {
    lat,
    lng,
    heading: Number(tracking.heading ?? raw.heading ?? 0),
    speed: Number(tracking.currentSpeed ?? raw.currentSpeed ?? raw.speed ?? 0),
    eta: Number(tracking.remainingETA ?? raw.remainingETA ?? raw.eta ?? 0),
    distance: Number(
      tracking.remainingDistance ?? raw.remainingDistance ?? raw.distance ?? 0,
    ),
    progress: Number(tracking.progress ?? raw.progress ?? 0) / (
      Number(tracking.progress ?? raw.progress ?? 0) > 1 ? 100 : 1
    ),
    status: raw.status ?? rider.status ?? RIDER_STATUS.ON_THE_WAY,
    orderStatus: order.status ?? raw.orderStatus ?? ORDER_STATUS.OUT_FOR_DELIVERY,
    riderName: rider.name ?? raw.riderName ?? null,
    riderPhone: rider.phone ?? raw.riderPhone ?? null,
    riderId: rider.id ?? raw.riderId ?? null,
    traffic: Number(raw.traffic ?? tracking.traffic ?? 1),
    updatedAt: tracking.updatedAt ?? raw.updatedAt ?? new Date().toISOString(),
  };
}

/**
 * Maps legacy + live statuses onto the expanded timeline key.
 * @param {string} raw
 * @param {string|null} liveOrderStatus
 * @returns {string}
 */
export function resolveTimelineStatus(raw, liveOrderStatus) {
  if (liveOrderStatus && ORDER_TIMELINE.includes(liveOrderStatus)) {
    return liveOrderStatus;
  }

  const key = (raw || 'PENDING').toUpperCase();
  if (ORDER_TIMELINE.includes(key) || key === ORDER_STATUS.CANCELLED) return key;
  return LEGACY_STATUS_MAP[key] || ORDER_STATUS.PLACED;
}

/**
 * Returns delivery stage index for progress UI (0-based).
 * @param {string} orderStatus
 * @returns {number}
 */
export function getDeliveryStageIndex(orderStatus) {
  const idx = DELIVERY_STAGES.findIndex((s) => s.key === orderStatus);
  if (idx >= 0) return idx;

  const legacy = {
    [ORDER_STATUS.PACKED]: 1,
    [ORDER_STATUS.RIDER_ASSIGNED]: 2,
    [ORDER_STATUS.CONFIRMED]: 0,
  };
  return legacy[orderStatus] ?? 0;
}

/**
 * Formats a status string for display.
 * @param {string} status
 * @returns {string}
 */
export function formatStatusLabel(status) {
  if (!status) return '—';
  return status
    .toString()
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Calculates travel ETA under speed + traffic multiplier.
 * @param {number} distanceKm
 * @param {number} speedKmh
 * @param {number} trafficMultiplier
 * @returns {number} ETA in minutes
 */
export function calculateETA(distanceKm, speedKmh, trafficMultiplier) {
  return engineCalculateETA(distanceKm, speedKmh, trafficMultiplier);
}

/**
 * Calculates great-circle bearing between two locations in degrees [0, 360).
 * @param {object} from
 * @param {object} to
 * @returns {number} Bearing in degrees
 */
export function calculateBearing(from, to) {
  return computeHeading(from, to);
}

/**
 * Calculates remaining distance along a polyline route.
 * @param {Array} route
 * @param {number} lat
 * @param {number} lng
 * @returns {number} remaining distance in kilometers
 */
export function calculateRemainingDistance(route, lat, lng) {
  return engineCalculateRemainingDistance(route, lat, lng);
}

/**
 * Interpolates coordinate position along route.
 * @param {Array} route
 * @param {number} progress
 * @returns {object} {lat, lng, heading, remaining}
 */
export function interpolateRoute(route, progress) {
  return computeRoutePosition(route, progress);
}

/**
 * Animates a Leaflet marker smoothly using requestAnimationFrame.
 * @param {object} marker - Leaflet marker instance
 * @param {Array} route - Route coordinates
 * @param {number} startProgress - Starting progress (0..1)
 * @param {number} targetProgress - Target progress (0..1)
 * @param {number} maxStepPerFrame - Max step limit per frame
 * @param {function} onUpdate - Callback function
 * @returns {function} Cancel animation function
 */
export function animateMarker(marker, route, startProgress, targetProgress, maxStepPerFrame, onUpdate) {
  let currentProgress = startProgress;
  let alive = true;
  let rafId = 0;

  const tick = () => {
    if (!alive) return;
    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) <= maxStepPerFrame) {
      currentProgress = targetProgress;
    } else {
      currentProgress += Math.sign(diff) * maxStepPerFrame;
    }

    const { lat, lng, heading, remaining } = computeRoutePosition(route, currentProgress);

    if (marker) {
      marker.setLatLng([lat, lng]);
      const el = marker.getElement();
      if (el) {
        const img = el.querySelector('.rider-scooter-img') || el.querySelector('img') || el;
        if (img) {
          img.style.transform = `rotate(${heading}deg)`;
        }
      }
    }

    if (typeof onUpdate === 'function') {
      onUpdate({ lat, lng, heading, remaining, progress: currentProgress });
    }

    if (currentProgress < targetProgress && alive) {
      rafId = requestAnimationFrame(tick);
    }
  };

  rafId = requestAnimationFrame(tick);

  return () => {
    alive = false;
    cancelAnimationFrame(rafId);
  };
}

/**
 * Computes the timeline status states dynamically based on overall progress percentage.
 * @param {number} overallProgress - Overall tracking progress (0..1)
 * @returns {Array} List of timeline steps with state ('completed' | 'active' | 'pending')
 */
export function updateTimeline(overallProgress) {
  const p = Math.min(100, Math.max(0, overallProgress * 100));
  const stages = [
    { key: 'CONFIRMED', threshold: 0, label: 'Order Confirmed', desc: 'Received & confirmed by merchant store.' },
    { key: 'PACKING', threshold: 10, label: 'Packing', desc: 'Your order is being packed.' },
    { key: 'PICKED_UP', threshold: 30, label: 'Picked Up', desc: 'Package inspected & verified.' },
    { key: 'OUT_FOR_DELIVERY', threshold: 40, label: 'Out for Delivery', desc: 'Rider checked-out and navigating on-route.' },
    { key: 'ARRIVING', threshold: 85, label: 'Arriving Soon', desc: 'Rider is approaching your door.' },
    { key: 'ARRIVED', threshold: 98, label: 'Arrived', desc: 'Rider has reached your location.' },
    { key: 'DELIVERED', threshold: 100, label: 'Delivered', desc: 'Order delivered successfully.' },
  ];

  let activeIndex = 0;
  for (let i = 0; i < stages.length; i++) {
    if (p >= stages[i].threshold) {
      activeIndex = i;
    }
  }

  return stages.map((stage, idx) => {
    let state = 'pending';
    if (idx < activeIndex) {
      state = 'completed';
    } else if (idx === activeIndex) {
      state = (p === 100 && idx === stages.length - 1) ? 'completed' : 'active';
    }
    return {
      ...stage,
      state,
    };
  });
}

