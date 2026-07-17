/**
 * @fileoverview Rider movement simulation along a route polyline.
 *
 * Advances rider from vendor → customer every tick, computing lat, lng,
 * heading, speed, remaining distance, ETA, progress, and status.
 *
 * Replaceable layer: today drives the Tracking API; tomorrow Firestore
 * or a real GPS feed writes positions instead.
 *
 * @module lib/simulationEngine
 */

import {
  calculateDistance,
  calculateETA,
  calculateTrafficMultiplier,
  remainingDistanceFromProgress,
  remainingETAFromProgress,
} from './etaEngine';
import { normalizeLatLng } from './geoUtils';
import {
  DEFAULT_SPEED,
  DEFAULT_TICK_INTERVAL,
  ORDER_STATUS,
  RIDER_STATUS,
} from './trackingConstants';

/**
 * @typedef {object} SimulationTick
 * @property {number} lat
 * @property {number} lng
 * @property {number} heading
 * @property {number} speed
 * @property {number} eta
 * @property {number} distance
 * @property {number} progress - 0..1 along ride segment
 * @property {number} overallProgress - 0..1 including prep phase
 * @property {string} status
 * @property {string} orderStatus
 */

/**
 * Maps simulation progress → rider + order statuses.
 * @param {number} p - overall progress 0..1
 * @param {number} prepRatio
 * @returns {{ status: string, orderStatus: string }}
 */
export function statusesForProgress(p, prepRatio = 0.2) {
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

function lerpPoint(from, to, t) {
  return {
    lat: from.lat + (to.lat - from.lat) * t,
    lng: from.lng + (to.lng - from.lng) * t,
  };
}

/**
 * Builds cumulative distance tables for a path.
 * @param {Array<{lat:number,lng:number}>} path
 */
function buildPathDistances(path) {
  const segDist = [];
  const cumDist = [0];
  let totalDist = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const d = calculateDistance(
      path[i].lat,
      path[i].lng,
      path[i + 1].lat,
      path[i + 1].lng,
    );
    segDist.push(d);
    cumDist.push(cumDist[i] + d);
    totalDist = cumDist[i + 1];
  }

  return { segDist, cumDist, totalDist };
}

/**
 * Position along path at ride progress 0..1.
 * @param {Array<{lat:number,lng:number}>} path
 * @param {object} tables
 * @param {number} rideP
 */
function pointAtRideProgress(path, tables, rideP) {
  const { segDist, cumDist, totalDist } = tables;
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
}

/**
 * Creates a route-following simulation controller.
 *
 * @param {object} config
 * @param {Array<{lat:number,lng:number}|[number,number]>} config.route
 * @param {number} [config.durationMs=180000]
 * @param {number} [config.tickMs=1000]
 * @param {number} [config.speedKmh=DEFAULT_SPEED]
 * @param {number} [config.prepRatio=0.2]
 * @param {(tick: SimulationTick) => void|Promise<void>} config.onTick
 * @param {() => void} [config.onComplete]
 * @returns {{ start: () => void, stop: () => void, getState: () => SimulationTick|null }}
 */
export function createRiderSimulation({
  route,
  durationMs = 3 * 60 * 1000,
  tickMs = DEFAULT_TICK_INTERVAL,
  speedKmh = DEFAULT_SPEED,
  prepRatio = 0.2,
  onTick,
  onComplete,
}) {
  const path = (route || [])
    .map(normalizeLatLng)
    .filter(Boolean);

  if (path.length < 2) {
    return { start: () => {}, stop: () => {}, getState: () => null };
  }

  const tables = buildPathDistances(path);
  const safeTickMs = Math.max(500, tickMs);
  const totalTicks = Math.max(1, Math.round(durationMs / safeTickMs));
  const traffic = calculateTrafficMultiplier(new Date().getHours());
  const prepMinutes = Math.max(0, (durationMs * prepRatio) / 60000);
  const travelEtaMinutes = calculateETA(tables.totalDist, speedKmh, traffic);

  let tick = 0;
  let cancelled = false;
  let inFlight = false;
  let timeoutId = null;
  let lastState = null;

  const stop = () => {
    cancelled = true;
    if (timeoutId != null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
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
      const overallProgress = Math.min(1, tick / totalTicks);
      const { status, orderStatus } = statusesForProgress(overallProgress, prepRatio);

      let point = path[0];
      let heading = computeHeading(path[0], path[1] || path[0]);
      let rideProgress = 0;

      if (overallProgress >= prepRatio) {
        rideProgress =
          prepRatio >= 1 ? 1 : (overallProgress - prepRatio) / (1 - prepRatio);
        const pos = pointAtRideProgress(path, tables, rideProgress);
        point = pos.point;
        heading = pos.heading;
      }

      const mapProgress = overallProgress < prepRatio ? 0 : rideProgress;

      const distance =
        overallProgress < prepRatio
          ? tables.totalDist
          : remainingDistanceFromProgress(tables.totalDist, mapProgress);

      const remainingPrepMin =
        overallProgress < prepRatio
          ? Math.ceil(((prepRatio - overallProgress) / prepRatio) * prepMinutes)
          : 0;

      const eta =
        overallProgress < prepRatio
          ? remainingPrepMin + travelEtaMinutes
          : remainingETAFromProgress(tables.totalDist, mapProgress, speedKmh, traffic);

      const speed =
        overallProgress < prepRatio || overallProgress >= 1 ? 0 : speedKmh;

      lastState = {
        lat: point.lat,
        lng: point.lng,
        heading,
        speed,
        eta,
        distance: Math.round(distance * 1000) / 1000,
        progress: mapProgress,
        overallProgress,
        status,
        orderStatus,
        traffic,
      };

      await onTick(lastState);

      if (overallProgress >= 1 || cancelled) {
        stop();
        onComplete?.();
        return;
      }

      tick += 1;
      scheduleNext();
    } finally {
      inFlight = false;
    }
  };

  return {
    start: () => {
      if (cancelled) return;
      tick = 0;
      runStep();
    },
    stop,
    getState: () => lastState,
  };
}
