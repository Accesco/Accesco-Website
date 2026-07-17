/**
 * @fileoverview Swappable central tracking data provider layer.
 * Manages tracking mode subscriptions (Simulation vs Firestore vs Sockets)
 * using Dependency Injection based on client configuration.
 *
 * @module services/trackingService
 */

import { subscribeToFirestore } from './firestoreTrackingService';
import { startSimulation } from './simulationTrackingService';
import { normalizeTrackingSnapshot } from '../lib/trackingHelpers';

/**
 * Supported tracking providers.
 * @readonly
 * @enum {string}
 */
export const TRACKING_PROVIDER = Object.freeze({
  SIMULATION: 'simulation',
  FIRESTORE: 'firestore',
  SOCKET: 'socket',
  API: 'api' // Retained for legacy backwards compatibility
});

// Check environment mode or default to simulation.
const envMode = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TRACKING_MODE : null;
let activeProvider = envMode || TRACKING_PROVIDER.SIMULATION;

// Set default fallback if an invalid mode is configured
if (!Object.values(TRACKING_PROVIDER).includes(activeProvider)) {
  activeProvider = TRACKING_PROVIDER.SIMULATION;
}

/** @type {Map<string, () => void>} */
const activeSubscriptions = new Map();

/**
 * Switches the tracking data provider globally at runtime.
 * @param {string} provider - One of TRACKING_PROVIDER values
 */
export function setTrackingProvider(provider) {
  if (Object.values(TRACKING_PROVIDER).includes(provider)) {
    activeProvider = provider;
  }
}

/**
 * Returns the currently active tracking provider.
 * @returns {string}
 */
export function getTrackingProvider() {
  return activeProvider;
}

/**
 * Subscribes to live tracking updates for an order.
 *
 * @param {string} orderId - Unique order ID
 * @param {object} context - Tracking subscription context parameters
 * @param {(snapshot: any) => void} callback - Triggers on every update tick
 * @returns {() => void} cleanup function to unsubscribe on unmount
 */
export function subscribeToTracking(orderId, context, callback) {
  if (!orderId) {
    return () => {};
  }

  // Deduplicate existing subscriptions
  if (activeSubscriptions.has(orderId)) {
    activeSubscriptions.get(orderId)();
    activeSubscriptions.delete(orderId);
  }

  let unsubscribe = () => {};

  switch (activeProvider) {
    case TRACKING_PROVIDER.FIRESTORE:
      unsubscribe = subscribeToFirestore(orderId, (raw) => {
        if (!raw) {
          callback(null);
          return;
        }
        callback(normalizeTrackingSnapshot(raw));
      });
      break;

    case TRACKING_PROVIDER.SOCKET:
      // Stub for socket.io implementation. Will fall back to simulation for safety.
      console.warn('[TrackingService] Socket mode selected but not yet wired. Falling back to simulation.');
      unsubscribe = startSimulation(orderId, context, (snap) => {
        callback(snap);
      });
      break;

    case TRACKING_PROVIDER.API:
    case TRACKING_PROVIDER.SIMULATION:
    default:
      unsubscribe = startSimulation(orderId, context, (snap) => {
        callback(snap);
      });
      break;
  }

  const cleanup = () => {
    unsubscribe();
    activeSubscriptions.delete(orderId);
  };

  activeSubscriptions.set(orderId, cleanup);
  return cleanup;
}

/**
 * Fetches a single telemetry snapshot (useful for manual status updates or SSR).
 *
 * @param {object} ctx - Context details
 * @param {{ lat: number, lng: number }} riderLocation - Lat/lng point
 * @returns {Promise<any>} Telemetry snapshot
 */
export async function fetchTrackingSnapshot(ctx, riderLocation) {
  const normalized = normalizeTrackingSnapshot({
    lat: riderLocation.lat,
    lng: riderLocation.lng,
    heading: 0,
    speed: ctx.speed || 25,
    eta: 0,
    distance: 0,
    progress: 0,
    status: 'on_the_way',
    orderStatus: 'OUT_FOR_DELIVERY',
    traffic: ctx.traffic || 1.0,
    updatedAt: new Date().toISOString(),
  });
  return Promise.resolve(normalized);
}
