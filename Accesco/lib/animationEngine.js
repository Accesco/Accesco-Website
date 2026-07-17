/**
 * @fileoverview 60fps rider animation engine for live map tracking.
 *
 * Interpolates between telemetry snapshots using requestAnimationFrame.
 * Prevents marker teleportation by capping per-frame progress steps and
 * smoothly easing lat/lng/heading toward the latest target.
 *
 * @module lib/animationEngine
 */

import {
  lerp,
  lerpHeading,
  stepHeadingTowards,
  interpolatePosition
} from './coordinateInterpolation';
import { computeHeading } from './headingCalculator';
import { calculateDistance } from './etaEngine';

/** Default easing factor for position lerp (0–1 per frame at 60fps). */
const DEFAULT_POSITION_EASE = 0.12;

/** Max degrees the heading may rotate per animation frame. */
const MAX_HEADING_STEP_DEG = 8;

/** Cache of prefix-distance tables keyed by route array identity. */
const routePrefixCache = new WeakMap();

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
 * Moves `current` toward `target` by at most `maxStep` per frame.
 *
 * @param {number} current
 * @param {number} target
 * @param {number} maxStep - largest allowed change this frame
 * @returns {number}
 */
export function stepProgressTowards(current, target, maxStep) {
  const diff = target - current;
  if (Math.abs(diff) <= maxStep) return target;
  return current + Math.sign(diff) * maxStep;
}

/**
 * Given a road route (array of [lat,lng]) and a progress fraction (0..1 by distance),
 * return the exact on-road position + heading, and the REMAINING route.
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
 * Creates a cancellable requestAnimationFrame loop.
 *
 * @param {(frame: { timestamp: number, deltaMs: number }) => void} onFrame
 * @returns {() => void} cancel function
 */
export function createAnimationLoop(onFrame) {
  let rafId = 0;
  let alive = true;
  let lastTs = 0;

  const tick = (timestamp) => {
    if (!alive) return;
    const deltaMs = lastTs ? timestamp - lastTs : 16.67;
    lastTs = timestamp;
    onFrame({ timestamp, deltaMs });
    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);

  return () => {
    alive = false;
    cancelAnimationFrame(rafId);
  };
}

/**
 * Drives smooth rider movement along a route polyline toward a target progress.
 *
 * @param {object} opts
 * @param {Array<[number,number]>} opts.route
 * @param {number} opts.targetProgress - 0..1 from live telemetry
 * @param {number} opts.displayProgress - current animated progress (mutated)
 * @param {number} [opts.maxStepPerFrame] - max progress delta per frame
 * @param {(state: { lat: number, lng: number, heading: number, remaining: Array<[number,number]>, progress: number }) => void} opts.onUpdate
 * @returns {() => void} cancel animation loop
 */
export function animateRiderOnRoute({
  route,
  targetProgress,
  displayProgress,
  maxStepPerFrame,
  onUpdate,
}) {
  const progressRef = { current: displayProgress };

  return createAnimationLoop(() => {
    progressRef.current = stepProgressTowards(
      progressRef.current,
      targetProgress,
      maxStepPerFrame
    );

    const { lat, lng, heading, remaining } = computeRoutePosition(
      route,
      progressRef.current
    );

    onUpdate({
      lat,
      lng,
      heading,
      remaining,
      progress: progressRef.current,
    });
  });
}

export {
  lerp,
  lerpHeading,
  stepHeadingTowards,
  interpolatePosition
};
