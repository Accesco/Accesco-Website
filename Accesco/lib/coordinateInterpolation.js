/**
 * @fileoverview Coordinate and heading linear/exponential interpolation for smooth marker animation.
 *
 * @module lib/coordinateInterpolation
 */

/**
 * Linearly interpolates between two numbers.
 * @param {number} a - Start value
 * @param {number} b - Target value
 * @param {number} t - Interpolation factor (0 to 1)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Linearly interpolates between two headings along the shortest path.
 *
 * @param {number} from - Current heading in degrees
 * @param {number} to - Target heading in degrees
 * @param {number} t - Interpolation factor (0 to 1)
 * @returns {number} Interpolated heading in degrees [0, 360)
 */
export function lerpHeading(from, to, t) {
  const a = ((Number(from) % 360) + 360) % 360;
  const b = ((Number(to) % 360) + 360) % 360;
  let diff = b - a;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return (a + diff * t + 360) % 360;
}

/**
 * Steps heading towards target by a bounded angular step per frame.
 * Prevents rapid spinning changes.
 *
 * @param {number} current - Current heading
 * @param {number} target - Target heading
 * @param {number} maxStep - Maximum step in degrees
 * @returns {number} Adjusted heading
 */
export function stepHeadingTowards(current, target, maxStep) {
  const a = ((Number(current) % 360) + 360) % 360;
  const b = ((Number(target) % 360) + 360) % 360;
  let diff = b - a;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  if (Math.abs(diff) <= maxStep) return b;
  return (a + Math.sign(diff) * maxStep + 360) % 360;
}

/**
 * Eases a lat/lng coordinate pair towards a target using exponential smoothing.
 *
 * @param {{lat: number, lng: number}} current
 * @param {{lat: number, lng: number}} target
 * @param {number} ease - Easing factor (0 to 1)
 * @returns {{lat: number, lng: number}} Eased coordinates
 */
export function interpolatePosition(current, target, ease) {
  const t = Math.min(1, Math.max(0, ease));
  return {
    lat: lerp(current.lat, target.lat, t),
    lng: lerp(current.lng, target.lng, t),
  };
}
