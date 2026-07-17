/**
 * @fileoverview Computes great-circle bearings (heading) between geographic coordinates.
 *
 * @module lib/headingCalculator
 */

import { normalizeLatLng } from './geoUtils';

/**
 * Computes the bearing/heading in degrees from origin to destination.
 * Value returns standard compass bearing [0, 360).
 *
 * @param {{lat: number, lng: number}|[number, number]} fromPoint - Start coordinate
 * @param {{lat: number, lng: number}|[number, number]} toPoint - Destination coordinate
 * @returns {number} Bearing in degrees from 0 to 360
 */
export function computeHeading(fromPoint, toPoint) {
  const from = normalizeLatLng(fromPoint);
  const to = normalizeLatLng(toPoint);

  if (!from || !to) {
    return 0;
  }

  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const dLon = toRad(to.lng - from.lng);
  const fromLatRad = toRad(from.lat);
  const toLatRad = toRad(to.lat);

  const y = Math.sin(dLon) * Math.cos(toLatRad);
  const x =
    Math.cos(fromLatRad) * Math.sin(toLatRad) -
    Math.sin(fromLatRad) * Math.cos(toLatRad) * Math.cos(dLon);

  const heading = toDeg(Math.atan2(y, x));
  return (heading + 360) % 360;
}

export default computeHeading;
