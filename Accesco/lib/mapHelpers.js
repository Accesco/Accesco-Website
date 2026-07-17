/**
 * @fileoverview Leaflet map helpers for live rider tracking.
 *
 * @module lib/mapHelpers
 */

import L from 'leaflet';

/** CartoDB Voyager tile URL used across tracking maps. */
export const TRACKING_TILE_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

/**
 * Fixes Leaflet default icon paths for Next.js bundling.
 */
export function fixLeafletIcons() {
  if (typeof window === 'undefined') return;
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

/**
 * Creates a rotating bike/rider marker icon.
 * @param {number} [heading=0]
 * @returns {L.DivIcon}
 */
export function createRiderIcon(heading = 0) {
  return L.divIcon({
    className: 'tracking-rider-marker',
    html: `<div class="tracking-rider-icon-wrap" style="transform: rotate(${heading}deg)">
      <img src="/images/delivery-rider.png" alt="Rider" width="38" height="68" />
    </div>`,
    iconSize: [38, 68],
    iconAnchor: [19, 60],
  });
}

/** Pickup / store marker icon. */
export const storeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

/** Customer / destination marker icon. */
export const customerIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/**
 * Stable geometry fingerprint for route arrays.
 * @param {Array<[number,number]>} route
 * @returns {string}
 */
export function routeFingerprint(route) {
  if (!route?.length) return '';
  const first = route[0];
  const last = route[route.length - 1];
  return `${route.length}:${first?.[0]?.toFixed?.(4)},${first?.[1]?.toFixed?.(4)}:${last?.[0]?.toFixed?.(4)},${last?.[1]?.toFixed?.(4)}`;
}

/**
 * Smoothly pans the map to follow the rider without jarring jumps.
 * @param {L.Map} map
 * @param {[number,number]} latLng
 * @param {object} [opts]
 * @param {boolean} [opts.animate=true]
 */
export function followRider(map, latLng, opts = {}) {
  if (!map || !latLng) return;
  const { animate = true } = opts;
  map.panTo(latLng, { animate, duration: 0.25 });
}

/**
 * Fits map bounds to include store, customer, and optional rider.
 * @param {L.Map} map
 * @param {{ store: [number,number], customer: [number,number], rider?: [number,number] }} points
 * @param {number} [padding=40]
 */
export function fitTrackingBounds(map, points, padding = 40) {
  if (!map || !points?.store || !points?.customer) return;
  const bounds = L.latLngBounds([points.store, points.customer]);
  if (points.rider) bounds.extend(points.rider);
  map.fitBounds(bounds, { padding: [padding, padding], maxZoom: 16 });
}

/**
 * Parses user location from localStorage (multiple legacy shapes).
 * @returns {[number,number]|null}
 */
export function readStoredUserLocation() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('userLocation');
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    if ((parsed.lat && parsed.lng) || parsed.lon) {
      return [
        parseFloat(parsed.lat),
        parseFloat(parsed.lng) || parseFloat(parsed.lon),
      ];
    }
    if (parsed.latitude && parsed.longitude) {
      return [parseFloat(parsed.latitude), parseFloat(parsed.longitude)];
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Default store offset from customer (~1.3 km north) until vendor API is wired.
 * @param {[number,number]} customerLoc
 * @returns {[number,number]}
 */
export function defaultStoreFromCustomer(customerLoc) {
  if (!customerLoc) return [13.08268, 80.27072];
  return [customerLoc[0] + 0.012, customerLoc[1] + 0.012];
}
