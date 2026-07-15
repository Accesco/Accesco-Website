/**
 * @fileoverview OSRM route engine for Quick Commerce delivery.
 *
 * Fetches driving routes from the public OSRM HTTP API, decodes polylines,
 * and returns normalized route payloads. Pure networking + math — no Firebase,
 * React, or UI.
 *
 * @module lib/routeEngine
 */

import { calculateDistance } from './etaEngine';
import { isValidCoord, normalizeLatLng } from './geoUtils';
import { DEFAULT_SPEED } from './trackingConstants';

/** Default OSRM public routing endpoint. @type {string} */
const DEFAULT_OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

/** Default request timeout in milliseconds. @type {number} */
const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Empty route payload used when no drawable path can be produced.
 * @returns {{ coordinates: Array<[number, number]>, polyline: string, distance: number, duration: number }}
 */
function emptyRoute() {
  return {
    coordinates: [],
    polyline: '',
    distance: 0,
    duration: 0,
  };
}

/**
 * Straight-line fallback between two validated points.
 * @param {{lat:number,lng:number}} origin
 * @param {{lat:number,lng:number}} destination
 * @returns {{ coordinates: Array<[number, number]>, polyline: string, distance: number, duration: number }}
 */
function fallbackRoute(origin, destination) {
  const distance = calculateDistance(
    origin.lat,
    origin.lng,
    destination.lat,
    destination.lng,
  );
  return {
    coordinates: [
      [origin.lat, origin.lng],
      [destination.lat, destination.lng],
    ],
    polyline: '',
    distance,
    duration: calculateRouteDuration(distance),
  };
}

/**
 * Decodes an Encoded Polyline Algorithm Format string into [lat, lng] pairs.
 *
 * Time Complexity:  O(n) where n = encoded string length
 * Space Complexity: O(p) where p = number of decoded points
 *
 * @param {string} encoded - Encoded polyline string
 * @param {number} [precision=5] - Decimal precision (OSRM uses 5)
 * @returns {Array<[number, number]>} Array of `[lat, lng]` coordinates
 */
export function decodePolyline(encoded, precision = 5) {
  if (typeof encoded !== 'string' || encoded.length === 0) {
    return [];
  }

  const coordinates = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  const factor = 10 ** precision;

  try {
    while (index < encoded.length) {
      let result = 0;
      let shift = 0;
      let byte = 0;

      do {
        if (index >= encoded.length) return coordinates;
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += deltaLat;

      result = 0;
      shift = 0;

      do {
        if (index >= encoded.length) return coordinates;
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += deltaLng;

      const latitude = lat / factor;
      const longitude = lng / factor;

      if (isValidCoord(latitude, longitude)) {
        coordinates.push([latitude, longitude]);
      }
    }
  } catch {
    return coordinates.length ? coordinates : [];
  }

  return coordinates;
}

/**
 * Parses a raw OSRM JSON response into a normalized route object.
 *
 * Time Complexity:  O(p) for coordinate conversion (p = path points)
 * Space Complexity: O(p)
 *
 * @param {object} data - Raw OSRM API response
 * @returns {{ coordinates: Array<[number, number]>, polyline: string, distance: number, duration: number }}
 */
export function parseRoute(data) {
  if (!data || data.code !== 'Ok' || !Array.isArray(data.routes) || data.routes.length === 0) {
    return emptyRoute();
  }

  const route = data.routes[0];
  if (!route) return emptyRoute();

  let coordinates = [];
  let polyline = '';

  if (typeof route.geometry === 'string') {
    polyline = route.geometry;
    coordinates = decodePolyline(route.geometry);
  } else if (route.geometry && Array.isArray(route.geometry.coordinates)) {
    coordinates = route.geometry.coordinates
      .map((pair) => {
        if (!Array.isArray(pair) || pair.length < 2) return null;
        const lng = Number(pair[0]);
        const lat = Number(pair[1]);
        return isValidCoord(lat, lng) ? [lat, lng] : null;
      })
      .filter(Boolean);
    polyline = '';
  }

  const distanceMeters = Number(route.distance);
  const durationSeconds = Number(route.duration);

  return {
    coordinates,
    polyline,
    distance: Number.isFinite(distanceMeters) ? distanceMeters / 1000 : 0,
    duration: Number.isFinite(durationSeconds) ? durationSeconds / 60 : 0,
  };
}

/**
 * Sums great-circle segment lengths along a coordinate polyline.
 *
 * Time Complexity:  O(n)
 * Space Complexity: O(1)
 *
 * @param {Array<[number, number]|{lat: number, lng: number}>} coordinates
 * @returns {number} Distance in kilometers
 */
export function calculateRouteDistance(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return 0;
  }

  let total = 0;
  for (let i = 1; i < coordinates.length; i += 1) {
    const prev = normalizeLatLng(coordinates[i - 1]);
    const curr = normalizeLatLng(coordinates[i]);
    if (!prev || !curr) continue;
    total += calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
  }
  return total;
}

/**
 * Estimates driving duration from route distance and average speed.
 * Prefer OSRM `duration` from `fetchRoute` / `parseRoute` when available.
 *
 * Time Complexity:  O(1) when distanceKm is provided; O(n) if deriving from coords
 * Space Complexity: O(1)
 *
 * @param {number|Array<[number, number]>} distanceKmOrCoords - km, or coordinate list
 * @param {number} [speedKmh=DEFAULT_SPEED] - Average speed fallback
 * @returns {number} Duration in minutes
 */
export function calculateRouteDuration(distanceKmOrCoords, speedKmh = DEFAULT_SPEED) {
  let distanceKm = 0;

  if (typeof distanceKmOrCoords === 'number') {
    distanceKm = distanceKmOrCoords;
  } else if (Array.isArray(distanceKmOrCoords)) {
    distanceKm = calculateRouteDistance(distanceKmOrCoords);
  }

  const speed = Number(speedKmh);
  if (!Number.isFinite(distanceKm) || distanceKm <= 0 || !Number.isFinite(speed) || speed <= 0) {
    return 0;
  }

  return (distanceKm / speed) * 60;
}

/**
 * Fetches a driving route from OSRM between two coordinates.
 *
 * On network / timeout / empty geometry failures, returns a straight-line
 * fallback so callers always receive a drawable path when coords are valid.
 * Invalid coordinates still return an empty route.
 *
 * @param {{lat: number, lng: number}|[number, number]} from - Origin
 * @param {{lat: number, lng: number}|[number, number]} to - Destination
 * @param {object} [options]
 * @param {number} [options.timeoutMs=10000] - Abort timeout
 * @param {AbortSignal} [options.signal] - External abort signal
 * @param {string} [options.baseUrl] - Override OSRM endpoint (production)
 * @param {'geojson'|'polyline'} [options.geometries='geojson']
 * @param {boolean} [options.fallbackOnError=true] - Straight-line on failure
 * @returns {Promise<{ coordinates: Array<[number, number]>, polyline: string, distance: number, duration: number }>}
 */
export async function fetchRoute(from, to, options = {}) {
  const origin = normalizeLatLng(from);
  const destination = normalizeLatLng(to);

  if (!origin || !destination) {
    return emptyRoute();
  }

  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    geometries = 'geojson',
    signal: externalSignal = null,
    baseUrl = DEFAULT_OSRM_BASE_URL,
    fallbackOnError = true,
  } = options;

  const geom = geometries === 'polyline' ? 'polyline' : 'geojson';
  const url =
    `${baseUrl}/` +
    `${origin.lng},${origin.lat};${destination.lng},${destination.lat}` +
    `?overview=full&geometries=${geom}`;

  const controller =
    typeof AbortController !== 'undefined' ? new AbortController() : null;
  let timeoutId = null;

  const onExternalAbort = () => {
    if (controller) controller.abort();
  };

  try {
    if (controller) {
      timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      if (externalSignal) {
        if (externalSignal.aborted) {
          controller.abort();
        } else {
          externalSignal.addEventListener('abort', onExternalAbort, { once: true });
        }
      }
    }

    const response = await fetch(url, {
      method: 'GET',
      signal: controller ? controller.signal : externalSignal || undefined,
    });

    if (!response.ok) {
      return fallbackOnError ? fallbackRoute(origin, destination) : emptyRoute();
    }

    const data = await response.json();
    const parsed = parseRoute(data);

    if (!parsed.coordinates.length) {
      return fallbackOnError ? fallbackRoute(origin, destination) : emptyRoute();
    }

    return parsed;
  } catch (err) {
    if (err?.name === 'AbortError') {
      return fallbackOnError ? fallbackRoute(origin, destination) : emptyRoute();
    }
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('[routeEngine] fetchRoute failed:', err?.message || err);
    }
    return fallbackOnError ? fallbackRoute(origin, destination) : emptyRoute();
  } finally {
    if (timeoutId != null) clearTimeout(timeoutId);
    if (externalSignal && controller) {
      externalSignal.removeEventListener('abort', onExternalAbort);
    }
  }
}
