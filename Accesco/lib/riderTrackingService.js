/**
 * Rider Tracking Service — live delivery-rider location over Firestore.
 *
 * Data model:  rider_tracking/{orderId}
 *   {
 *     lat, lng,            // current rider position
 *     status,             // 'assigned' | 'picking_up' | 'on_the_way' | 'arriving' | 'delivered'
 *     heading,            // bearing in degrees (for rotating the marker)
 *     progress,           // 0..1 along the route (handy for the ETA bar)
 *     riderName, riderPhone,
 *     updatedAt,          // serverTimestamp of the last position write
 *   }
 *
 * The client MAP only ever reads via subscribeToRiderLocation().
 * The WRITER (updateRiderLocation) is what a real rider app would call.
 * startRiderSimulation() is a stand-in "rider source" that interpolates a route
 * and writes positions to Firestore until a real rider GPS feed exists — so the
 * map behaves identically today and after a real fleet is connected.
 */

import { db } from './firebase';
import {
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'rider_tracking';

/**
 * Subscribe to a rider's live location for an order.
 * @param {string} orderId
 * @param {(data: object|null) => void} callback - receives the rider doc data (or null if none yet)
 * @returns {() => void} unsubscribe function
 */
export function subscribeToRiderLocation(orderId, callback) {
  if (!orderId) return () => {};

  const ref = doc(db, COLLECTION, orderId);
  return onSnapshot(
    ref,
    (snap) => callback(snap.exists() ? snap.data() : null),
    (err) => {
      console.error('[riderTracking] subscribe error:', err);
      callback(null);
    },
  );
}

/**
 * Write/update the rider's current position. This is the exact call a real
 * rider mobile app would make; the simulator below calls it too.
 * @param {string} orderId
 * @param {object} data - { lat, lng, status?, heading?, progress?, riderName?, riderPhone? }
 */
export async function updateRiderLocation(orderId, data) {
  if (!orderId) throw new Error('orderId is required');

  const ref = doc(db, COLLECTION, orderId);
  await setDoc(
    ref,
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

// Great-circle bearing (degrees) from point A to B — used to rotate the marker.
function computeHeading(from, to) {
  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;
  const dLon = toRad(to.lng - from.lng);
  const y = Math.sin(dLon) * Math.cos(toRad(to.lat));
  const x =
    Math.cos(toRad(from.lat)) * Math.sin(toRad(to.lat)) -
    Math.sin(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// Linear interpolation between two lat/lng points.
function lerpPoint(from, to, t) {
  return {
    lat: from.lat + (to.lat - from.lat) * t,
    lng: from.lng + (to.lng - from.lng) * t,
  };
}

// Great-circle distance (km) between two points — used for constant-speed movement.
function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

/**
 * Given a road route (array of [lat,lng]) and a progress fraction (0..1 by
 * distance), return the exact on-road position + heading, and the REMAINING
 * route ahead of the rider (for a trail that shrinks as the rider advances).
 *
 * This lets the map animate the rider precisely along every road vertex (accuracy)
 * and consume the line behind it.
 *
 * @param {Array<[number,number]>} route
 * @param {number} progress 0..1
 * @returns {{ lat:number, lng:number, heading:number, remaining:Array<[number,number]> }}
 */
export function computeRoutePosition(route, progress) {
  if (!route || route.length < 2) {
    const p = (route && route[0]) || [0, 0];
    return { lat: p[0], lng: p[1], heading: 0, remaining: route || [] };
  }

  const pts = route.map(([lat, lng]) => ({ lat, lng }));
  const seg = [];
  const cum = [0];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = haversineKm(pts[i], pts[i + 1]);
    seg.push(d);
    total += d;
    cum.push(total);
  }

  const clamped = Math.min(1, Math.max(0, progress));
  if (total === 0) {
    return { lat: pts[0].lat, lng: pts[0].lng, heading: 0, remaining: route };
  }

  const target = clamped * total;
  let i = 0;
  while (i < seg.length - 1 && cum[i + 1] < target) i++;
  const segLen = seg[i] || 1e-9;
  const t = Math.min(1, Math.max(0, (target - cum[i]) / segLen));
  const a = pts[i];
  const b = pts[i + 1];
  const lat = a.lat + (b.lat - a.lat) * t;
  const lng = a.lng + (b.lng - a.lng) * t;
  const heading = computeHeading(a, b);
  // Remaining route = current interpolated point + all vertices still ahead.
  const remaining = [[lat, lng], ...route.slice(i + 1)];

  return { lat, lng, heading, remaining };
}

/**
 * Stand-in rider source: moves a rider from `from` to `to` along `waypoints`
 * (optional), writing each step to Firestore so every subscribed map updates
 * live. Replace this with a real rider GPS feed later — the map code won't change.
 *
 * @param {string} orderId
 * @param {{lat:number,lng:number}} from - hub / store coordinates
 * @param {{lat:number,lng:number}} to - customer coordinates
 * @param {object} [opts]
 * @param {Array<{lat:number,lng:number}>} [opts.waypoints] - route points between from→to
 * @param {number} [opts.durationMs=180000] - total travel time (default 3 min)
 * @param {number} [opts.tickMs=3000] - how often to write a position (default 3s)
 * @param {object} [opts.rider] - { riderName, riderPhone }
 * @returns {() => void} stop function to cancel the simulation
 */
export function startRiderSimulation(orderId, from, to, opts = {}) {
  const {
    waypoints = [],
    durationMs = 3 * 60 * 1000,
    tickMs = 1000,
    rider = {},
  } = opts;

  // Build the full path: hub → waypoints → home
  const path = [from, ...waypoints, to];
  const totalTicks = Math.max(1, Math.round(durationMs / tickMs));
  let tick = 0;
  let cancelled = false;

  // Precompute per-segment and cumulative distances so the rider moves at a
  // CONSTANT speed along the route (accuracy), rather than spending equal time
  // on every segment regardless of its length.
  const segDist = [];
  for (let i = 0; i < path.length - 1; i++) {
    segDist.push(haversineKm(path[i], path[i + 1]));
  }
  const cumDist = [0];
  for (let i = 0; i < segDist.length; i++) {
    cumDist.push(cumDist[i] + segDist[i]);
  }
  const totalDist = cumDist[cumDist.length - 1];

  // Given overall progress 0..1, find the point at that fraction of the total
  // travelled DISTANCE (constant speed).
  const pointAtProgress = (p) => {
    const n = path.length;
    if (p <= 0) return { point: path[0], heading: computeHeading(path[0], path[1] || path[0]) };
    if (p >= 1) return { point: path[n - 1], heading: computeHeading(path[n - 2] || path[0], path[n - 1]) };
    if (totalDist === 0) return { point: path[0], heading: computeHeading(path[0], path[1] || path[0]) };

    const targetDist = p * totalDist;
    let i = 0;
    while (i < segDist.length - 1 && cumDist[i + 1] < targetDist) i++;
    const segLen = segDist[i] || 1e-9;
    const legT = Math.min(1, Math.max(0, (targetDist - cumDist[i]) / segLen));
    const a = path[i];
    const b = path[i + 1];
    return { point: lerpPoint(a, b, legT), heading: computeHeading(a, b) };
  };

  const statusForProgress = (p) => {
    if (p <= 0) return 'assigned';
    if (p < 0.1) return 'picking_up';
    if (p < 0.9) return 'on_the_way';
    if (p < 1) return 'arriving';
    return 'delivered';
  };

  const step = async () => {
    if (cancelled) return;
    const progress = Math.min(1, tick / totalTicks);
    const { point, heading } = pointAtProgress(progress);

    try {
      await updateRiderLocation(orderId, {
        lat: point.lat,
        lng: point.lng,
        heading,
        progress,
        status: statusForProgress(progress),
        ...rider,
      });
    } catch (err) {
      console.error('[riderTracking] simulation write failed:', err);
    }

    if (progress >= 1) {
      clearInterval(interval);
    }
    tick += 1;
  };

  // Write the first position immediately, then tick.
  step();
  const interval = setInterval(step, tickMs);

  return () => {
    cancelled = true;
    clearInterval(interval);
  };
}
