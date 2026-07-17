/**
 * @fileoverview Realistic delivery rider tracking simulation service.
 * Simulates real rider kinetics: acceleration, deceleration, traffic lights,
 * sharp turn slow-downs, and dynamic traffic speed multipliers.
 *
 * @module services/simulationTrackingService
 */

import { computeHeading } from '../lib/headingCalculator';
import { normalizeLatLng } from '../lib/geoUtils';
import {
  calculateDistance,
  calculateETA,
  calculateTrafficMultiplier,
  remainingDistanceFromProgress,
  remainingETAFromProgress
} from '../lib/etaEngine';
import {
  ORDER_STATUS,
  RIDER_STATUS,
  DEFAULT_SPEED,
  DEFAULT_TICK_INTERVAL
} from '../lib/trackingConstants';

/**
 * Maps progress values to corresponding delivery states.
 * @param {number} p - Overall progress (0 to 1)
 * @param {number} prepRatio - Ratio of timeline spent preparing
 * @returns {{ status: string, orderStatus: string }}
 */
function statusesForProgress(p, prepRatio) {
  if (p < prepRatio * 0.4) {
    return { status: RIDER_STATUS.IDLE, orderStatus: ORDER_STATUS.PREPARING };
  }
  if (p < prepRatio * 0.75) {
    return { status: RIDER_STATUS.IDLE, orderStatus: ORDER_STATUS.PACKED };
  }
  if (p < prepRatio) {
    return { status: RIDER_STATUS.ASSIGNED, orderStatus: ORDER_STATUS.RIDER_ASSIGNED };
  }

  const rideP = prepRatio >= 1 ? 1 : (p - prepRatio) / (1 - prepRatio);
  if (rideP < 0.1) {
    return { status: RIDER_STATUS.PICKING_UP, orderStatus: ORDER_STATUS.PICKED_UP };
  }
  if (rideP < 0.88) {
    return { status: RIDER_STATUS.ON_THE_WAY, orderStatus: ORDER_STATUS.OUT_FOR_DELIVERY };
  }
  if (rideP < 1.0) {
    return { status: RIDER_STATUS.ARRIVING, orderStatus: ORDER_STATUS.ARRIVING };
  }
  return { status: RIDER_STATUS.DELIVERED, orderStatus: ORDER_STATUS.DELIVERED };
}

/**
 * Builds segment metadata for simulating turns.
 * @param {Array<{lat: number, lng: number}>} path
 * @returns {{ segDist: number[], cumDist: number[], totalDist: number }}
 */
function buildPathTables(path) {
  const segDist = [];
  const cumDist = [0];
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const d = calculateDistance(path[i].lat, path[i].lng, path[i + 1].lat, path[i + 1].lng);
    segDist.push(d);
    total += d;
    cumDist.push(total);
  }
  return { segDist, cumDist, totalDist: total };
}

/**
 * Active client simulations map.
 * @type {Map<string, { stop: () => void }>}
 */
const activeSimulations = new Map();

/**
 * Creates and runs a telemetry simulation for an order.
 *
 * @param {string} orderId - Unique order tracking ID
 * @param {object} context - Routing details
 * @param {(snapshot: any) => void} callback - Emits update ticks
 * @returns {() => void} stop simulation function
 */
export function startSimulation(orderId, context, callback) {
  if (activeSimulations.has(orderId)) {
    return activeSimulations.get(orderId).stop;
  }

  const storePoint = normalizeLatLng(context.store);
  const customerPoint = normalizeLatLng(context.customer);

  if (!storePoint || !customerPoint) {
    console.error('[SimulationService] Missing store/customer coordinates.');
    return () => {};
  }

  // Parse path coords
  let path = [];
  if (Array.isArray(context.route) && context.route.length >= 2) {
    path = context.route.map(normalizeLatLng).filter(Boolean);
  } else {
    path = [storePoint, customerPoint];
  }

  const tables = buildPathTables(path);
  const durationMs = context.durationMs || 3 * 60 * 1000;
  const tickMs = Math.max(200, context.tickMs || DEFAULT_TICK_INTERVAL);
  const totalTicks = Math.max(1, Math.round(durationMs / tickMs));
  const prepRatio = 0.4;
  const prepTicks = Math.round(totalTicks * prepRatio);

  const traffic = calculateTrafficMultiplier(new Date().getHours());
  const maxBaseSpeed = context.speed || DEFAULT_SPEED;

  let tick = 0;
  let currentSpeedKmh = 0;
  let distanceCoveredKm = 0;

  let stoppedAtLight35 = false;
  let stoppedAtLight75 = false;
  let lightStopTicksRemaining = 0;

  let anomalyTicksRemaining = 0;
  let anomalyTargetSpeed = 0;

  let arrivalWaitStarted = false;
  let arrivalTicksRemaining = 0;
  const maxArrivalTicks = Math.ceil(10000 / tickMs);
  let arrivalTicksElapsed = 0;

  let intervalId = null;
  let currentPos = path[0];
  let currentHeading = computeHeading(path[0], path[1] || path[0]);

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    activeSimulations.delete(orderId);
  };

  const runTick = () => {
    let overallProgress = 0;
    let rideProgress = 0;
    let status = RIDER_STATUS.IDLE;
    let orderStatus = ORDER_STATUS.CONFIRMED;

    if (tick < prepTicks) {
      // Prep Phase
      overallProgress = (tick / prepTicks) * 0.4;
      rideProgress = 0;
      currentSpeedKmh = 0;
      currentPos = path[0];
      currentHeading = computeHeading(path[0], path[1] || path[0]);

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

      let targetSpeed = maxBaseSpeed;

      // Find current segment index
      let idx = 0;
      while (idx < tables.segDist.length - 1 && tables.cumDist[idx + 1] < distanceCoveredKm) {
        idx++;
      }

      // 1. Sharp turn slowing
      let isApproachingSharpTurn = false;
      if (idx < path.length - 2) {
        const nextHeading = computeHeading(path[idx + 1], path[idx + 2]);
        const headingDiff = Math.abs(((nextHeading - currentHeading + 180) % 360) - 180);
        if (headingDiff > 45) {
          const distToTurn = tables.cumDist[idx + 1] - distanceCoveredKm;
          if (distToTurn < 0.05) {
            isApproachingSharpTurn = true;
          }
        }
      }

      // 2. Slow near destination
      const remainingDistance = Math.max(0, tables.totalDist - distanceCoveredKm);
      const isNearDestination = remainingDistance < 0.2;

      // 3. Traffic lights at 35% and 75%
      const currentPct = distanceCoveredKm / (tables.totalDist || 1);
      if (currentPct >= 0.35 && !stoppedAtLight35 && lightStopTicksRemaining === 0) {
        stoppedAtLight35 = true;
        lightStopTicksRemaining = Math.ceil(5000 / tickMs);
      } else if (currentPct >= 0.75 && !stoppedAtLight75 && lightStopTicksRemaining === 0) {
        stoppedAtLight75 = true;
        lightStopTicksRemaining = Math.ceil(5000 / tickMs);
      }

      // 4. Random anomalies
      if (lightStopTicksRemaining === 0 && anomalyTicksRemaining === 0 && Math.random() < 0.05) {
        anomalyTicksRemaining = Math.ceil(3000 / tickMs);
        anomalyTargetSpeed = Math.random() < 0.5 ? 0 : 18;
      }

      // Apply speeds
      if (lightStopTicksRemaining > 0) {
        targetSpeed = 0;
        lightStopTicksRemaining--;
      } else if (anomalyTicksRemaining > 0) {
        targetSpeed = anomalyTargetSpeed;
        anomalyTicksRemaining--;
      } else if (isNearDestination) {
        targetSpeed = 15; // Slow near destination
      } else if (isApproachingSharpTurn) {
        targetSpeed = 15; // Slow turn
      } else {
        const segLength = tables.segDist[idx] || 0;
        if (segLength > 0.15) {
          targetSpeed = 42; // Highway
        } else {
          targetSpeed = 32; // Normal
        }
      }

      // Smooth acceleration/braking
      const accelRate = 5;
      const decelRate = 10;
      const timeScale = tickMs / 1000;

      if (currentSpeedKmh < targetSpeed) {
        currentSpeedKmh = Math.min(targetSpeed, currentSpeedKmh + accelRate * timeScale);
      } else if (currentSpeedKmh > targetSpeed) {
        currentSpeedKmh = Math.max(targetSpeed, currentSpeedKmh - decelRate * timeScale);
      }

      // Physics step
      const tickHours = (tickMs / 3600000);
      distanceCoveredKm += currentSpeedKmh * tickHours;

      if (distanceCoveredKm >= tables.totalDist) {
        distanceCoveredKm = tables.totalDist;
        arrivalWaitStarted = true;
        arrivalTicksRemaining = maxArrivalTicks;
      }

      rideProgress = tables.totalDist === 0 ? 1 : distanceCoveredKm / tables.totalDist;
      overallProgress = 0.4 + rideProgress * 0.58;

      if (remainingDistance < 0.5) {
        status = RIDER_STATUS.ARRIVING;
        orderStatus = ORDER_STATUS.ARRIVING;
      } else {
        status = currentSpeedKmh === 0 ? RIDER_STATUS.IDLE : RIDER_STATUS.ON_THE_WAY;
        orderStatus = ORDER_STATUS.OUT_FOR_DELIVERY;
      }

      // Interpolate position
      const segLen = tables.segDist[idx] || 1e-9;
      const legT = Math.min(1, Math.max(0, (rideProgress * tables.totalDist - tables.cumDist[idx]) / segLen));
      const prevNode = path[idx];
      const nextNode = path[idx + 1] || path[idx];
      currentPos = {
        lat: prevNode.lat + (nextNode.lat - prevNode.lat) * legT,
        lng: prevNode.lng + (nextNode.lng - prevNode.lng) * legT,
      };
      currentHeading = computeHeading(prevNode, nextNode);
    } else {
      // Arrival Wait Phase
      arrivalTicksElapsed++;
      arrivalTicksRemaining--;
      currentSpeedKmh = 0;
      rideProgress = 1.0;
      overallProgress = 0.98 + (arrivalTicksElapsed / maxArrivalTicks) * 0.02;
      currentPos = path[path.length - 1];
      currentHeading = computeHeading(path[path.length - 2] || path[0], path[path.length - 1]);

      if (arrivalTicksRemaining <= 0) {
        status = RIDER_STATUS.DELIVERED;
        orderStatus = ORDER_STATUS.DELIVERED;
        overallProgress = 1.0;
      } else {
        status = RIDER_STATUS.ARRIVING;
        orderStatus = ORDER_STATUS.ARRIVED;
      }
    }

    const remainingDistance = Math.max(0, tables.totalDist - distanceCoveredKm);

    let remainingETA = 0;
    if (orderStatus === ORDER_STATUS.DELIVERED) {
      remainingETA = 0;
    } else if (orderStatus === ORDER_STATUS.ARRIVED) {
      remainingETA = 0;
    } else if (orderStatus === ORDER_STATUS.ARRIVING) {
      remainingETA = 1;
    } else if (tick < prepTicks) {
      const remainingPrepMin = Math.ceil(((prepTicks - tick) * tickMs) / 60000);
      remainingETA = remainingPrepMin + calculateETA(tables.totalDist, maxBaseSpeed, traffic);
    } else {
      const avgSpeed = currentSpeedKmh > 0 ? currentSpeedKmh : maxBaseSpeed;
      remainingETA = calculateETA(remainingDistance, avgSpeed, traffic);
    }

    callback({
      position: currentPos,
      lat: currentPos.lat,
      lng: currentPos.lng,
      heading: currentHeading,
      speed: currentSpeedKmh,
      distance: Math.round(remainingDistance * 100) / 100,
      eta: Math.max(1, Math.round(remainingETA)),
      progress: rideProgress,
      overallProgress,
      status,
      orderStatus,
      traffic,
      timestamp: new Date().toISOString(),
      riderName: context.rider?.name || 'Ramesh Kumar',
      riderPhone: context.rider?.phone || '+91 98765 43210',
      riderId: context.rider?.id || 'RID-8842',
      updatedAt: new Date().toISOString()
    });

    if (orderStatus === ORDER_STATUS.DELIVERED) {
      stop();
      return;
    }

    tick++;
  };

  // Launch Simulation Interval
  intervalId = setInterval(runTick, tickMs);
  runTick(); // seed initial step

  const handle = { stop };
  activeSimulations.set(orderId, handle);

  return stop;
}
