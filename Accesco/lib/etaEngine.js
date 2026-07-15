/**
 * @fileoverview Pure ETA / distance engine for Quick Commerce delivery tracking.
 *
 * Responsibilities:
 * - Great-circle distance (Haversine)
 * - Travel ETA under speed + traffic
 * - Remaining distance / ETA along an ordered route polyline
 * - Preparation-time estimation and human-readable ETA formatting
 *
 * Constraints:
 * - Pure JavaScript only (no Firebase, React, Firestore, network, or DOM).
 * - All functions are side-effect free and return plain values.
 *
 * @module lib/etaEngine
 */

import {
  DEFAULT_SPEED,
  DEFAULT_PREP_TIME,
  TRAFFIC_MULTIPLIERS,
} from './trackingConstants';
import {
  EARTH_RADIUS_KM,
  isValidCoord,
  toRadians,
  normalizeLatLng,
} from './geoUtils';

/**
 * Builds a prefix (cumulative) distance array along a route polyline.
 * prefix[0] = 0; prefix[i] = total km from route[0] to route[i].
 *
 * Time Complexity:  O(n)
 * Space Complexity: O(n)
 *
 * @param {Array<{lat: number, lng: number}|[number, number]>} route
 * @returns {number[]} cumulative distances in km
 */
function buildPrefixDistances(route) {
  const n = route.length;
  const prefix = new Array(n);
  prefix[0] = 0;

  for (let i = 1; i < n; i += 1) {
    const prev = normalizePoint(route[i - 1]);
    const curr = normalizePoint(route[i]);
    const segment =
      prev && curr
        ? calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng)
        : 0;
    prefix[i] = prefix[i - 1] + segment;
  }

  return prefix;
}

/** @param {*} point @returns {{lat: number, lng: number}|null} */
function normalizePoint(point) {
  return normalizeLatLng(point);
}

/**
 * Binary-searches a sorted prefix-distance array for the largest index `i`
 * such that prefix[i] <= targetKm.
 *
 * Time Complexity:  O(log n)
 * Space Complexity: O(1)
 *
 * @param {number[]} prefix
 * @param {number} targetKm
 * @returns {number} index in [0, prefix.length - 1]
 */
function binarySearchPrefix(prefix, targetKm) {
  let lo = 0;
  let hi = prefix.length - 1;
  let result = 0;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (prefix[mid] <= targetKm) {
      result = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return result;
}

/**
 * Projects `point` onto segment AB and returns distance along the segment (km)
 * plus Euclidean (great-circle) distance from point to the projection (km).
 *
 * Time Complexity:  O(1)
 * Space Complexity: O(1)
 *
 * @param {{lat: number, lng: number}} point
 * @param {{lat: number, lng: number}} a
 * @param {{lat: number, lng: number}} b
 * @returns {{alongSegmentKm: number, distToSegmentKm: number}}
 */
function projectOntoSegment(point, a, b) {
  const abKm = calculateDistance(a.lat, a.lng, b.lat, b.lng);
  if (abKm === 0) {
    return {
      alongSegmentKm: 0,
      distToSegmentKm: calculateDistance(point.lat, point.lng, a.lat, a.lng),
    };
  }

  // Local equirectangular projection around point A for stable param t.
  const latRad = toRadians(a.lat);
  const x = (lng) => toRadians(lng - a.lng) * Math.cos(latRad);
  const y = (lat) => toRadians(lat - a.lat);

  const ax = 0;
  const ay = 0;
  const bx = x(b.lng);
  const by = y(b.lat);
  const px = x(point.lng);
  const py = y(point.lat);

  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const abLenSq = abx * abx + aby * aby;
  let t = abLenSq === 0 ? 0 : (apx * abx + apy * aby) / abLenSq;
  t = Math.max(0, Math.min(1, t));

  const proj = {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
  };

  return {
    alongSegmentKm: abKm * t,
    distToSegmentKm: calculateDistance(
      point.lat,
      point.lng,
      proj.lat,
      proj.lng,
    ),
  };
}

/**
 * Calculates great-circle distance between two WGS-84 coordinates (Haversine).
 *
 * Time Complexity:  O(1)
 * Space Complexity: O(1)
 *
 * @param {number} lat1 - Latitude of point A (degrees)
 * @param {number} lng1 - Longitude of point A (degrees)
 * @param {number} lat2 - Latitude of point B (degrees)
 * @param {number} lng2 - Longitude of point B (degrees)
 * @returns {number} Distance in kilometers (0 on invalid input)
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  if (!isValidCoord(lat1, lng1) || !isValidCoord(lat2, lng2)) {
    return 0;
  }

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const rLat1 = toRadians(lat1);
  const rLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.asin(Math.min(1, Math.sqrt(a)));
  return EARTH_RADIUS_KM * c;
}

/**
 * Estimates travel duration from distance, speed, and traffic.
 *
 * Formula: minutes = (distanceKm / speedKmh) * 60 * trafficMultiplier
 *
 * Time Complexity:  O(1)
 * Space Complexity: O(1)
 *
 * @param {number} distanceKm - Travel distance in kilometers
 * @param {number} [speedKmh=DEFAULT_SPEED] - Average speed in km/h
 * @param {number} [trafficMultiplier=TRAFFIC_MULTIPLIERS.LIGHT] - ≥ 1.0
 * @returns {number} ETA in whole minutes (minimum 0)
 */
export function calculateETA(
  distanceKm,
  speedKmh = DEFAULT_SPEED,
  trafficMultiplier = TRAFFIC_MULTIPLIERS.LIGHT,
) {
  const distance = Number(distanceKm);
  const speed = Number(speedKmh);
  const traffic = Number(trafficMultiplier);

  if (
    !Number.isFinite(distance) ||
    distance < 0 ||
    !Number.isFinite(speed) ||
    speed <= 0 ||
    !Number.isFinite(traffic) ||
    traffic <= 0
  ) {
    return 0;
  }

  const minutes = (distance / speed) * 60 * traffic;
  return Math.max(0, Math.ceil(minutes));
}

/**
 * Calculates remaining path distance from a live position along a polyline.
 *
 * Algorithm:
 * 1. Build prefix distance array along the route — O(n)
 * 2. Find the closest polyline segment to the current point — O(n)
 * 3. Derive distance-travelled, then remaining = total − travelled — O(1)
 * 4. Optionally refine index via binary search on the prefix array — O(log n)
 *
 * Time Complexity:  O(n)
 * Space Complexity: O(n)
 *
 * @param {Array<{lat: number, lng: number}|[number, number]>} route
 * @param {number} currentLat
 * @param {number} currentLng
 * @returns {number} Remaining distance in kilometers (0 if empty / invalid)
 */
export function calculateRemainingDistance(route, currentLat, currentLng) {
  if (!Array.isArray(route) || route.length === 0) {
    return 0;
  }

  if (route.length === 1) {
    const only = normalizePoint(route[0]);
    if (!only || !isValidCoord(currentLat, currentLng)) return 0;
    return calculateDistance(currentLat, currentLng, only.lat, only.lng);
  }

  if (!isValidCoord(currentLat, currentLng)) {
    return 0;
  }

  const prefix = buildPrefixDistances(route);
  const totalKm = prefix[prefix.length - 1];
  if (totalKm <= 0) {
    return 0;
  }

  const point = { lat: currentLat, lng: currentLng };
  let bestTravelled = 0;
  let bestDist = Number.POSITIVE_INFINITY;

  for (let i = 0; i < route.length - 1; i += 1) {
    const a = normalizePoint(route[i]);
    const b = normalizePoint(route[i + 1]);
    if (!a || !b) continue;

    const { alongSegmentKm, distToSegmentKm } = projectOntoSegment(point, a, b);
    if (distToSegmentKm < bestDist) {
      bestDist = distToSegmentKm;
      bestTravelled = prefix[i] + alongSegmentKm;
    }
  }

  // Clamp to route bounds. Binary search locates the prefix segment for
  // numerical stability when bestTravelled sits between vertices.
  const idx = binarySearchPrefix(prefix, bestTravelled);
  const nextIdx = Math.min(idx + 1, prefix.length - 1);
  const travelled = Math.min(
    totalKm,
    Math.max(0, Math.min(prefix[nextIdx], Math.max(prefix[idx], bestTravelled))),
  );

  return Math.max(0, totalKm - travelled);
}

/**
 * O(1) remaining distance when along-route progress (0..1) is already known.
 * Prefer this over closest-segment scan during simulation / animation ticks.
 *
 * Time Complexity:  O(1)
 * Space Complexity: O(1)
 *
 * @param {number} totalKm
 * @param {number} progress - 0..1 along the route by distance
 * @returns {number}
 */
export function remainingDistanceFromProgress(totalKm, progress) {
  const total = Number(totalKm);
  const p = Number(progress);
  if (!Number.isFinite(total) || total <= 0) return 0;
  if (!Number.isFinite(p)) return total;
  const clamped = Math.min(1, Math.max(0, p));
  return Math.max(0, total * (1 - clamped));
}

/**
 * O(1) remaining ETA from known route progress.
 *
 * Time Complexity:  O(1)
 * Space Complexity: O(1)
 *
 * @param {number} totalKm
 * @param {number} progress
 * @param {number} [speedKmh]
 * @param {number} [trafficMultiplier]
 * @returns {number} minutes
 */
export function remainingETAFromProgress(
  totalKm,
  progress,
  speedKmh = DEFAULT_SPEED,
  trafficMultiplier = TRAFFIC_MULTIPLIERS.LIGHT,
) {
  return calculateETA(
    remainingDistanceFromProgress(totalKm, progress),
    speedKmh,
    trafficMultiplier,
  );
}

/**
 * Estimates remaining travel minutes from a live position along a route.
 *
 * Time Complexity:  O(n)  (dominated by remaining-distance scan)
 * Space Complexity: O(n)
 *
 * @param {Array<{lat: number, lng: number}|[number, number]>} route
 * @param {number} currentLat
 * @param {number} currentLng
 * @param {number} [speedKmh=DEFAULT_SPEED]
 * @param {number} [trafficMultiplier=TRAFFIC_MULTIPLIERS.LIGHT]
 * @returns {number} Remaining ETA in whole minutes
 */
export function calculateRemainingETA(
  route,
  currentLat,
  currentLng,
  speedKmh = DEFAULT_SPEED,
  trafficMultiplier = TRAFFIC_MULTIPLIERS.LIGHT,
) {
  const remainingKm = calculateRemainingDistance(route, currentLat, currentLng);
  return calculateETA(remainingKm, speedKmh, trafficMultiplier);
}

/**
 * Estimates vendor preparation time from cart size and optional base minutes.
 *
 * Model: base + 1 minute per additional item after the first (capped).
 *
 * Time Complexity:  O(1)
 * Space Complexity: O(1)
 *
 * @param {number} [itemCount=1] - Number of line items in the order
 * @param {number} [basePrepMinutes=DEFAULT_PREP_TIME] - Baseline prep minutes
 * @returns {number} Estimated preparation time in whole minutes (≥ 0)
 */
export function estimatePreparationTime(
  itemCount = 1,
  basePrepMinutes = DEFAULT_PREP_TIME,
) {
  const items = Number(itemCount);
  const base = Number(basePrepMinutes);

  if (!Number.isFinite(items) || items <= 0) {
    return Number.isFinite(base) && base > 0 ? Math.ceil(base) : DEFAULT_PREP_TIME;
  }

  if (!Number.isFinite(base) || base < 0) {
    return DEFAULT_PREP_TIME;
  }

  const extra = Math.max(0, Math.floor(items) - 1);
  const estimate = base + extra;
  // Soft cap keeps QC-style prep estimates within a realistic window.
  const capped = Math.min(estimate, base + 20);
  return Math.max(0, Math.ceil(capped));
}

/**
 * Resolves a traffic multiplier from density label or hour-of-day heuristic.
 *
 * Accepted density keys (case-insensitive): light | moderate | heavy | severe.
 * If `hour` (0–23) is provided instead/alongside, peak hours map to HEAVY.
 *
 * Time Complexity:  O(1)
 * Space Complexity: O(1)
 *
 * @param {string|number} [densityOrHour='light'] - Density label or hour 0–23
 * @param {number} [hour] - Optional explicit hour when first arg is a density string
 * @returns {number} Traffic multiplier (≥ 1.0)
 */
export function calculateTrafficMultiplier(densityOrHour = 'light', hour) {
  if (typeof densityOrHour === 'number' && Number.isFinite(densityOrHour)) {
    return multiplierFromHour(densityOrHour);
  }

  const label =
    typeof densityOrHour === 'string'
      ? densityOrHour.trim().toUpperCase()
      : 'LIGHT';

  const fromLabel = TRAFFIC_MULTIPLIERS[label];
  if (Number.isFinite(fromLabel)) {
    if (Number.isFinite(hour)) {
      return Math.max(fromLabel, multiplierFromHour(hour));
    }
    return fromLabel;
  }

  if (Number.isFinite(hour)) {
    return multiplierFromHour(hour);
  }

  return TRAFFIC_MULTIPLIERS.LIGHT;
}

/**
 * Maps local hour-of-day to a traffic multiplier.
 * Peak windows (8–10, 17–20) → HEAVY; shoulder (7, 11–12, 16, 21) → MODERATE.
 *
 * @param {number} hour
 * @returns {number}
 */
function multiplierFromHour(hour) {
  const h = Math.floor(Number(hour));
  if (!Number.isFinite(h) || h < 0 || h > 23) {
    return TRAFFIC_MULTIPLIERS.LIGHT;
  }

  if ((h >= 8 && h <= 10) || (h >= 17 && h <= 20)) {
    return TRAFFIC_MULTIPLIERS.HEAVY;
  }
  if (h === 7 || h === 11 || h === 12 || h === 16 || h === 21) {
    return TRAFFIC_MULTIPLIERS.MODERATE;
  }
  return TRAFFIC_MULTIPLIERS.LIGHT;
}

/**
 * Calculates average speed (km/h) from ordered GPS samples with timestamps.
 *
 * Each sample: `{ lat, lng, timestamp }` where `timestamp` is ms since epoch
 * (or any monotonically increasing absolute time unit consistent across samples).
 *
 * Time Complexity:  O(n)
 * Space Complexity: O(1)
 *
 * @param {Array<{lat: number, lng: number, timestamp: number}>} samples
 * @returns {number} Average speed in km/h (falls back to DEFAULT_SPEED)
 */
export function calculateAverageSpeed(samples) {
  if (!Array.isArray(samples) || samples.length < 2) {
    return DEFAULT_SPEED;
  }

  let totalKm = 0;
  let totalHours = 0;

  for (let i = 1; i < samples.length; i += 1) {
    const prev = samples[i - 1];
    const curr = samples[i];
    if (!prev || !curr) continue;

    const lat1 = Number(prev.lat);
    const lng1 = Number(prev.lng);
    const lat2 = Number(curr.lat);
    const lng2 = Number(curr.lng);
    const t1 = Number(prev.timestamp);
    const t2 = Number(curr.timestamp);

    if (
      !isValidCoord(lat1, lng1) ||
      !isValidCoord(lat2, lng2) ||
      !Number.isFinite(t1) ||
      !Number.isFinite(t2) ||
      t2 <= t1
    ) {
      continue;
    }

    const dtHours = (t2 - t1) / 3_600_000;
    if (dtHours <= 0) continue;

    totalKm += calculateDistance(lat1, lng1, lat2, lng2);
    totalHours += dtHours;
  }

  if (totalHours <= 0 || totalKm <= 0) {
    return DEFAULT_SPEED;
  }

  const speed = totalKm / totalHours;
  // Guard against GPS noise producing absurd speeds.
  if (!Number.isFinite(speed) || speed <= 0) {
    return DEFAULT_SPEED;
  }

  return Math.min(speed, 120);
}

/**
 * Formats an ETA in minutes into a short human-readable string.
 *
 * Examples: `0 min`, `12 min`, `1 hr`, `1 hr 5 min`
 *
 * Time Complexity:  O(1)
 * Space Complexity: O(1)
 *
 * @param {number} minutes - ETA in minutes
 * @returns {string} Formatted duration
 */
export function formatETA(minutes) {
  const m = Number(minutes);
  if (!Number.isFinite(m) || m <= 0) {
    return '0 min';
  }

  const whole = Math.ceil(m);
  const hours = Math.floor(whole / 60);
  const mins = whole % 60;

  if (hours === 0) {
    return `${mins} min`;
  }
  if (mins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${mins} min`;
}
