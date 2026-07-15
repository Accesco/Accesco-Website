/**
 * @fileoverview Vendor selection engine (prototype).
 *
 * Finds the nearest vendor to a customer using a swappable nearest-neighbor
 * strategy. The current implementation is linear search O(n). External APIs
 * stay stable so Geohash / KD-Tree / R-Tree strategies can replace the default
 * without call-site changes.
 *
 * No Firestore. No React. No UI.
 *
 * @module lib/vendorEngine
 */

import {
  calculateDistance,
  calculateETA,
  calculateTrafficMultiplier,
} from './etaEngine';
import { DEFAULT_SPEED } from './trackingConstants';
import { normalizeLatLng, isValidCoord } from './geoUtils';

/**
 * @typedef {{lat: number, lng: number}} Coord
 * @typedef {object} Vendor
 * @property {string} [id]
 * @property {number} [lat]
 * @property {number} [lng]
 * @property {number} [latitude]
 * @property {number} [longitude]
 * @property {Coord} [coordinates]
 * @property {Coord} [location]
 *
 * @typedef {object} NearestVendorResult
 * @property {Vendor|null} vendor
 * @property {number} distance - kilometers
 * @property {number} travelTime - minutes
 */

/**
 * Extracts `{lat,lng}` from heterogeneous vendor / customer shapes.
 * @param {Vendor|Coord|[number, number]|null|undefined} entity
 * @returns {Coord|null}
 */
function extractCoords(entity) {
  if (!entity) return null;

  if (Array.isArray(entity) || (typeof entity === 'object' && (entity.lat != null || entity.latitude != null))) {
    const direct = normalizeLatLng(entity);
    if (direct) return direct;
  }

  if (typeof entity !== 'object') return null;

  if (entity.coordinates) {
    const nested = extractCoords(entity.coordinates);
    if (nested) return nested;
  }
  if (entity.location) {
    const nested = extractCoords(entity.location);
    if (nested) return nested;
  }

  const lat = Number(entity.lat ?? entity.latitude);
  const lng = Number(entity.lng ?? entity.lon ?? entity.longitude);
  return isValidCoord(lat, lng) ? { lat, lng } : null;
}

/**
 * Linear-search nearest-neighbor strategy.
 *
 * Time Complexity:  O(n)
 * Space Complexity: O(1)
 *
 * @param {Coord} customer
 * @param {Vendor[]} vendors
 * @returns {{ vendor: Vendor|null, distance: number }}
 */
function linearNearestStrategy(customer, vendors) {
  let bestVendor = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < vendors.length; i += 1) {
    const vendor = vendors[i];
    const coords = extractCoords(vendor);
    if (!coords) continue;

    const dist = calculateDistance(
      customer.lat,
      customer.lng,
      coords.lat,
      coords.lng,
    );

    if (dist < bestDistance) {
      bestDistance = dist;
      bestVendor = vendor;
    }
  }

  return {
    vendor: bestVendor,
    distance: Number.isFinite(bestDistance) ? bestDistance : 0,
  };
}

/**
 * Active nearest-vendor strategy.
 * Swap this reference (or pass `options.strategy`) to Geohash / KD / R-Tree
 * implementations later — public API of `findNearestVendor` stays identical.
 *
 * @type {(customer: Coord, vendors: Vendor[]) => { vendor: Vendor|null, distance: number }}
 */
let activeStrategy = linearNearestStrategy;

/**
 * Replaces the global nearest-vendor algorithm (e.g. inject KD-Tree later).
 * Prototype hook — optional; prefer `options.strategy` for one-off overrides.
 *
 * @param {(customer: Coord, vendors: Vendor[]) => { vendor: Vendor|null, distance: number }} strategyFn
 */
export function setNearestVendorStrategy(strategyFn) {
  if (typeof strategyFn === 'function') {
    activeStrategy = strategyFn;
  }
}

/**
 * Restores the default O(n) linear-search strategy.
 */
export function resetNearestVendorStrategy() {
  activeStrategy = linearNearestStrategy;
}

/**
 * Exposes the built-in linear strategy for tests / composition.
 * @type {(customer: Coord, vendors: Vendor[]) => { vendor: Vendor|null, distance: number }}
 */
export const LinearNearestVendorStrategy = linearNearestStrategy;

/**
 * Finds the nearest vendor to a customer.
 *
 * Architecture: Strategy pattern — algorithm is injectable without changing
 * this function's signature, enabling Geohash / KD-Tree / R-Tree upgrades.
 *
 * Time Complexity:  O(n) with default linear strategy
 * Space Complexity: O(1)
 *
 * @param {Coord|[number, number]} customerCoordinates
 * @param {Vendor[]} vendors
 * @param {object} [options]
 * @param {number} [options.speedKmh]
 * @param {string|number} [options.traffic]
 * @param {(customer: Coord, vendors: Vendor[]) => { vendor: Vendor|null, distance: number }} [options.strategy]
 * @returns {NearestVendorResult}
 */
export function findNearestVendor(customerCoordinates, vendors, options = {}) {
  const customer = extractCoords(customerCoordinates);
  if (!customer || !Array.isArray(vendors) || vendors.length === 0) {
    return { vendor: null, distance: 0, travelTime: 0 };
  }

  const strategy =
    typeof options.strategy === 'function' ? options.strategy : activeStrategy;

  const { vendor, distance } = strategy(customer, vendors);
  if (!vendor) {
    return { vendor: null, distance: 0, travelTime: 0 };
  }

  const speed = Number.isFinite(options.speedKmh)
    ? options.speedKmh
    : DEFAULT_SPEED;
  const traffic = calculateTrafficMultiplier(
    options.traffic ?? 'light',
  );
  const travelTime = calculateETA(distance, speed, traffic);

  return {
    vendor,
    distance: Math.round(distance * 1000) / 1000,
    travelTime,
  };
}

/**
 * Alias matching the locationService façade name.
 * @param {Coord|[number, number]} customerCoordinates
 * @param {Vendor[]} vendors
 * @param {object} [options]
 * @returns {NearestVendorResult}
 */
export function getNearestVendor(customerCoordinates, vendors, options) {
  return findNearestVendor(customerCoordinates, vendors, options);
}
