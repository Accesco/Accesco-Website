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
import {
  calculateDistance,
  calculateETA,
  calculateTrafficMultiplier,
  remainingDistanceFromProgress,
  remainingETAFromProgress,
} from './etaEngine';
import { fetchRoute } from './routeEngine';
import { normalizeLatLng } from './geoUtils';
import {
  DEFAULT_SPEED,
  DEFAULT_TICK_INTERVAL,
  ORDER_STATUS,
  RIDER_STATUS,
  COLLECTIONS,
} from './trackingConstants';

const COLLECTION = COLLECTIONS.RIDER_TRACKING;

/**
 * Active simulation stop-handles keyed by orderId.
 * Prevents duplicate intervals when startRiderSimulation is called twice.
 * @type {Map<string, () => void>}
 */
const activeSimulations = new Map();

/**
 * Cache of prefix-distance tables keyed by route array identity.
 * Avoids rebuilding O(n) Haversine tables on every animation frame.
 * @type {WeakMap<object, { pts: Array<{lat:number,lng:number}>, seg: number[], cum: number[], total: number }>}
 */
const routePrefixCache = new WeakMap();

/**
 * Maps simulation progress (including prep phase) → rider + order statuses.
 * @param {number} p - overall progress 0..1
 * @param {number} prepRatio - fraction of timeline spent in prep/pack/assign
 * @returns {{ status: string, orderStatus: string }}
 */
function statusesForProgress(p, prepRatio) {
  if (p < prepRatio * 0.4) {
    return { status: RIDER_STATUS.IDLE, orderStatus: ORDER_STATUS.PREPARING };
  }
  if (p < prepRatio * 0.7) {
    return { status: RIDER_STATUS.IDLE, orderStatus: ORDER_STATUS.PACKED };
  }
  if (p < prepRatio) {
    return { status: RIDER_STATUS.ASSIGNED, orderStatus: ORDER_STATUS.RIDER_ASSIGNED };
  }

  const rideP = prepRatio >= 1 ? 1 : (p - prepRatio) / (1 - prepRatio);
  if (rideP < 0.08) {
    return { status: RIDER_STATUS.PICKING_UP, orderStatus: ORDER_STATUS.PICKED_UP };
  }
  if (rideP < 0.88) {
    return { status: RIDER_STATUS.ON_THE_WAY, orderStatus: ORDER_STATUS.OUT_FOR_DELIVERY };
  }
  if (rideP < 1) {
    return { status: RIDER_STATUS.ARRIVING, orderStatus: ORDER_STATUS.ARRIVING };
  }
  return { status: RIDER_STATUS.DELIVERED, orderStatus: ORDER_STATUS.DELIVERED };
}

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

/**
 * Builds (or returns cached) prefix-distance tables for a route polyline.
 * @param {Array<[number,number]>} route
 * @returns {{ pts: Array<{lat:number,lng:number}>, seg: number[], cum: number[], total: number }|null}
 */
function getRoutePrefix(route) {
  if (!route || route.length < 2) return null;

  const cached = routePrefixCache.get(route);
  if (cached) return cached;

  const pts = route.map(([lat, lng]) => ({ lat, lng }));
  const seg = [];
  const cum = [0];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = calculateDistance(pts[i].lat, pts[i].lng, pts[i + 1].lat, pts[i + 1].lng);
    seg.push(d);
    total += d;
    cum.push(total);
  }

  const entry = { pts, seg, cum, total };
  routePrefixCache.set(route, entry);
  return entry;
}

/**
 * Moves `current` toward `target` by at most `maxStep`, instead of easing
 * (current += (target-current) * k), which closes ~99% of ANY gap within
 * about a second regardless of how large it is. That made the marker visibly
 * teleport whenever the live target was ahead of the display value (e.g. a
 * network delay before the map first subscribed). Capping the per-frame step
 * guarantees the marker can only ever move at a bounded, realistic speed.
 *
 * @param {number} current
 * @param {number} target
 * @param {number} maxStep - largest allowed change this frame
 */
export function stepProgressTowards(current, target, maxStep) {
  const diff = target - current;
  if (Math.abs(diff) <= maxStep) return target;
  return current + Math.sign(diff) * maxStep;
}

/**
 * Given a road route (array of [lat,lng]) and a progress fraction (0..1 by
 * distance), return the exact on-road position + heading, and the REMAINING
 * route ahead of the rider (for a trail that shrinks as the rider advances).
 *
 * This lets the map animate the rider precisely along every road vertex (accuracy)
 * and consume the line behind it.
 *
 * Prefix tables are cached per route array identity (WeakMap) so 60fps animation
 * stays O(log n) / O(1) segment walk after the first call.
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

  const table = getRoutePrefix(route);
  if (!table) {
    const p = route[0];
    return { lat: p[0], lng: p[1], heading: 0, remaining: route };
  }

  const { pts, seg, cum, total } = table;
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
  const remaining = [[lat, lng], ...route.slice(i + 1)];

  return { lat, lng, heading, remaining };
}

/**
 * Stand-in rider source: moves a rider from `from` to `to` along `waypoints`
 * (optional), writing each step to Firestore so every subscribed map updates
 * live. Replace this with a real rider GPS feed later — the map code won't change.
 *
 * Backwards compatible with the original `(orderId, from, to, opts)` signature.
 * Enhanced `opts` accept `route`, `eta`, `store`, `customer`, and `rider`.
 *
 * @param {string} orderId
 * @param {{lat:number,lng:number}|[number,number]} from - hub / store coordinates
 * @param {{lat:number,lng:number}|[number,number]} to - customer coordinates
 * @param {object} [opts]
 * @param {Array<{lat:number,lng:number}|[number,number]>} [opts.waypoints]
 * @param {Array<{lat:number,lng:number}|[number,number]>} [opts.route]
 * @param {number} [opts.eta] - total ETA in minutes
 * @param {{lat:number,lng:number}|[number,number]} [opts.store]
 * @param {{lat:number,lng:number}|[number,number]} [opts.customer]
 * @param {number} [opts.durationMs=180000]
 * @param {number} [opts.tickMs]
 * @param {object} [opts.rider]
 * @param {number} [opts.speedKmh]
 * @returns {() => void} stop function to cancel the simulation
 */
export function startRiderSimulation(orderId, from, to, opts = {}) {
  if (!orderId) return () => {};

  if (activeSimulations.has(orderId)) {
    return activeSimulations.get(orderId);
  }

  const storePoint = normalizeLatLng(opts.store) || normalizeLatLng(from);
  const customerPoint = normalizeLatLng(opts.customer) || normalizeLatLng(to);

  if (!storePoint || !customerPoint) {
    console.warn('[riderTracking] startRiderSimulation: invalid coordinates');
    return () => {};
  }

  const {
    waypoints = [],
    route: routeOpt = null,
    eta = null,
    durationMs: durationMsOpt,
    tickMs = DEFAULT_TICK_INTERVAL,
    rider = {},
    speedKmh = DEFAULT_SPEED,
  } = opts;

  const durationMs =
    Number.isFinite(durationMsOpt)
      ? durationMsOpt
      : Number.isFinite(eta) && eta > 0
        ? eta * 60 * 1000
        : 3 * 60 * 1000;

  const safeTickMs = Math.max(50, tickMs);
  const totalTicks = Math.max(1, Math.round(durationMs / safeTickMs));

  /** @type {Array<{lat:number,lng:number}>} */
  let path = [];

  if (Array.isArray(routeOpt) && routeOpt.length >= 2) {
    path = routeOpt.map(normalizeLatLng).filter(Boolean);
  } else {
    const mids = (Array.isArray(waypoints) ? waypoints : [])
      .map(normalizeLatLng)
      .filter(Boolean);
    path = [storePoint, ...mids, customerPoint];
  }

  if (path.length < 2) {
    path = [storePoint, customerPoint];
  }

  const prepRatio = 0.4; // 40% preparation and packing phase
  const prepTicks = Math.round(totalTicks * prepRatio);
  let tick = 0;
  let cancelled = false;
  let inFlight = false;
  let seededStatic = false;
  /** @type {ReturnType<typeof setTimeout>|null} */
  let timeoutId = null;

  const segDist = [];
  const cumDist = [0];
  let totalDist = 0;

  const rebuildDistances = () => {
    segDist.length = 0;
    cumDist.length = 0;
    cumDist.push(0);
    for (let i = 0; i < path.length - 1; i++) {
      const d = calculateDistance(
        path[i].lat,
        path[i].lng,
        path[i + 1].lat,
        path[i + 1].lng,
      );
      segDist.push(d);
      cumDist.push(cumDist[i] + d);
    }
    totalDist = cumDist[cumDist.length - 1];
  };

  rebuildDistances();

  // Kinetic state
  let currentSpeedKmh = 0;
  let distanceCoveredKm = 0;

  // Signal Stop Simulation Ticks
  let stoppedAtLight35 = false;
  let stoppedAtLight75 = false;
  let lightStopTicksRemaining = 0;

  // Random traffic events anomalies
  let anomalyTicksRemaining = 0;
  let anomalyTargetSpeed = 0;

  // Arrival wait state
  let arrivalWaitStarted = false;
  let arrivalTicksRemaining = 0;
  const maxArrivalTicks = Math.ceil(10000 / safeTickMs); // Wait exactly 10 seconds
  let arrivalTicksElapsed = 0;

  const pointAtRideProgress = (rideP) => {
    const n = path.length;
    if (rideP <= 0) {
      return { point: path[0], heading: computeHeading(path[0], path[1] || path[0]) };
    }
    if (rideP >= 1) {
      return {
        point: path[n - 1],
        heading: computeHeading(path[n - 2] || path[0], path[n - 1]),
      };
    }
    if (totalDist === 0) {
      return { point: path[0], heading: computeHeading(path[0], path[1] || path[0]) };
    }

    const targetDist = rideP * totalDist;
    let i = 0;
    while (i < segDist.length - 1 && cumDist[i + 1] < targetDist) i++;
    const segLen = segDist[i] || 1e-9;
    const legT = Math.min(1, Math.max(0, (targetDist - cumDist[i]) / segLen));
    const a = path[i];
    const b = path[i + 1];
    return { point: lerpPoint(a, b, legT), heading: computeHeading(a, b) };
  };

  const stop = () => {
    cancelled = true;
    if (timeoutId != null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    activeSimulations.delete(orderId);
  };

  const scheduleNext = () => {
    if (cancelled) return;
    timeoutId = setTimeout(() => {
      timeoutId = null;
      runStep();
    }, safeTickMs);
  };

  const runStep = async () => {
    if (cancelled || inFlight) return;
    inFlight = true;

    try {
      let overallProgress = 0;
      let rideProgress = 0;
      let status = RIDER_STATUS.IDLE;
      let orderStatus = ORDER_STATUS.CONFIRMED;
      let currentPos = path[0];
      let heading = computeHeading(path[0], path[1] || path[0]);

      if (tick < prepTicks) {
        // Prep Phase
        overallProgress = (tick / prepTicks) * 0.4;
        rideProgress = 0;
        currentSpeedKmh = 0;
        
        if (overallProgress < 0.1) {
          status = RIDER_STATUS.IDLE;
          orderStatus = ORDER_STATUS.CONFIRMED;
        } else if (overallProgress < 0.3) {
          status = RIDER_STATUS.IDLE;
          orderStatus = ORDER_STATUS.PACKING;
        } else {
          status = RIDER_STATUS.ASSIGNED;
          orderStatus = ORDER_STATUS.PICKED_UP;
        }
      } else if (!arrivalWaitStarted) {
        // Active Ride Phase
        status = RIDER_STATUS.ON_THE_WAY;
        orderStatus = ORDER_STATUS.OUT_FOR_DELIVERY;

        // Base Target Speed: Normal (32 km/h)
        let targetSpeed = 32;

        // Find current segment index
        let idx = 0;
        while (idx < segDist.length - 1 && cumDist[idx + 1] < distanceCoveredKm) {
          idx++;
        }

        // 1. Sharp turn deceleration
        let isApproachingSharpTurn = false;
        if (idx < path.length - 2) {
          const currentHeading = computeHeading(path[idx], path[idx + 1]);
          const nextHeading = computeHeading(path[idx + 1], path[idx + 2]);
          const headingDiff = Math.abs(((nextHeading - currentHeading + 180) % 360) - 180);
          if (headingDiff > 45) {
            const distToTurn = cumDist[idx + 1] - distanceCoveredKm;
            if (distToTurn < 0.05) { // within 50 meters
              isApproachingSharpTurn = true;
            }
          }
        }

        // 2. Slow near destination
        const remainingDistance = Math.max(0, totalDist - distanceCoveredKm);
        const isNearDestination = remainingDistance < 0.2; // within 200m

        // 3. Traffic lights stops at 35% and 75% progress
        const currentPct = distanceCoveredKm / (totalDist || 1);
        if (currentPct >= 0.35 && !stoppedAtLight35 && lightStopTicksRemaining === 0) {
          stoppedAtLight35 = true;
          lightStopTicksRemaining = Math.ceil(5000 / safeTickMs); // Stop for 5 seconds
        } else if (currentPct >= 0.75 && !stoppedAtLight75 && lightStopTicksRemaining === 0) {
          stoppedAtLight75 = true;
          lightStopTicksRemaining = Math.ceil(5000 / safeTickMs); // Stop for 5 seconds
        }

        // 4. Random anomalies (temporary blockages, slow intersections)
        if (lightStopTicksRemaining === 0 && anomalyTicksRemaining === 0 && Math.random() < 0.05) {
          anomalyTicksRemaining = Math.ceil(3000 / safeTickMs);
          anomalyTargetSpeed = Math.random() < 0.5 ? 0 : 18; // Red light (0 km/h) vs Traffic (18 km/h)
        }

        // Apply Speed constraints
        if (lightStopTicksRemaining > 0) {
          targetSpeed = 0; // Signal Stop
          lightStopTicksRemaining--;
        } else if (anomalyTicksRemaining > 0) {
          targetSpeed = anomalyTargetSpeed;
          anomalyTicksRemaining--;
        } else if (isNearDestination) {
          targetSpeed = 15; // Slow near destination
        } else if (isApproachingSharpTurn) {
          targetSpeed = 15; // Slow Turn
        } else {
          const segLength = segDist[idx] || 0;
          if (segLength > 0.15) {
            targetSpeed = 42; // Highway
          } else {
            targetSpeed = 32; // Normal
          }
        }

        // Smooth acceleration/braking
        const accelRate = 5; // km/h per second
        const decelRate = 10;
        const timeScale = safeTickMs / 1000;

        if (currentSpeedKmh < targetSpeed) {
          currentSpeedKmh = Math.min(targetSpeed, currentSpeedKmh + accelRate * timeScale);
        } else if (currentSpeedKmh > targetSpeed) {
          currentSpeedKmh = Math.max(targetSpeed, currentSpeedKmh - decelRate * timeScale);
        }

        // Physics step
        const tickHours = (safeTickMs / 3600000);
        distanceCoveredKm += currentSpeedKmh * tickHours;

        if (distanceCoveredKm >= totalDist) {
          distanceCoveredKm = totalDist;
          arrivalWaitStarted = true;
          arrivalTicksRemaining = maxArrivalTicks;
        }

        rideProgress = totalDist === 0 ? 1 : distanceCoveredKm / totalDist;
        overallProgress = 0.4 + rideProgress * 0.58;

        if (remainingDistance < 0.5) {
          status = RIDER_STATUS.ARRIVING;
          orderStatus = ORDER_STATUS.ARRIVING; // ARRIVING_SOON
        } else {
          status = currentSpeedKmh === 0 ? RIDER_STATUS.IDLE : RIDER_STATUS.ON_THE_WAY;
          orderStatus = ORDER_STATUS.OUT_FOR_DELIVERY;
        }

        const pos = pointAtRideProgress(rideProgress);
        currentPos = pos.point;
        heading = pos.heading;
      } else {
        // Arrival Wait Phase
        arrivalTicksElapsed++;
        arrivalTicksRemaining--;
        currentSpeedKmh = 0;
        rideProgress = 1.0;
        overallProgress = 0.98 + (arrivalTicksElapsed / maxArrivalTicks) * 0.02;
        currentPos = path[path.length - 1];
        heading = computeHeading(path[path.length - 2] || path[0], path[path.length - 1]);

        if (arrivalTicksRemaining <= 0) {
          status = RIDER_STATUS.DELIVERED;
          orderStatus = ORDER_STATUS.DELIVERED;
          overallProgress = 1.0;
        } else {
          status = RIDER_STATUS.ARRIVING;
          orderStatus = ORDER_STATUS.ARRIVED; // ARRIVED
        }
      }

      const remainingDistance = Math.max(0, totalDist - distanceCoveredKm);
      const trafficMultiplier = calculateTrafficMultiplier(new Date().getHours());

      let remainingETA = 0;
      if (orderStatus === ORDER_STATUS.DELIVERED) {
        remainingETA = 0;
      } else if (orderStatus === ORDER_STATUS.ARRIVED) {
        remainingETA = 0;
      } else if (orderStatus === ORDER_STATUS.ARRIVING) {
        remainingETA = 1;
      } else if (tick < prepTicks) {
        const remainingPrepMin = Math.ceil(((prepTicks - tick) * safeTickMs) / 60000);
        remainingETA = remainingPrepMin + calculateETA(totalDist, 25, trafficMultiplier);
      } else {
        const avgSpeed = currentSpeedKmh > 0 ? currentSpeedKmh : 25;
        remainingETA = calculateETA(remainingDistance, avgSpeed, trafficMultiplier);
      }

      const payload = {
        lat: currentPos.lat,
        lng: currentPos.lng,
        heading,
        progress: rideProgress,
        overallProgress,
        status,
        orderStatus,
        remainingDistance: Math.round(remainingDistance * 1000) / 1000,
        remainingETA,
        currentSpeed: currentSpeedKmh,
        ...rider,
      };

      if (!seededStatic) {
        payload.store = storePoint;
        payload.customer = customerPoint;
        seededStatic = true;
      }

      try {
        await updateRiderLocation(orderId, payload);
      } catch (err) {
        console.error('[riderTracking] simulation write failed:', err);
      }

      if (orderStatus === ORDER_STATUS.DELIVERED || cancelled) {
        stop();
        return;
      }

      tick += 1;
      scheduleNext();
    } finally {
      inFlight = false;
    }
  };

  const boot = async () => {
    if (cancelled) return;

    const hasDetailedRoute =
      (Array.isArray(routeOpt) && routeOpt.length > 2) ||
      (Array.isArray(waypoints) && waypoints.length > 0);

    if (!hasDetailedRoute) {
      try {
        const fetched = await fetchRoute(storePoint, customerPoint);
        if (
          !cancelled &&
          Array.isArray(fetched.coordinates) &&
          fetched.coordinates.length >= 2
        ) {
          path = fetched.coordinates.map(([lat, lng]) => ({ lat, lng }));
          rebuildDistances();
        }
      } catch (err) {
        console.warn('[riderTracking] OSRM enrich skipped:', err?.message || err);
      }
    }

    if (cancelled) return;
    runStep();
  };

  activeSimulations.set(orderId, stop);
  boot();

  return stop;
}
