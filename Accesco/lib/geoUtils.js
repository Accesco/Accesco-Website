/**
 * @fileoverview Shared geo primitives for tracking engines.
 * Internal helpers — prefer importing from etaEngine / routeEngine for public use.
 *
 * @module lib/geoUtils
 */

/** Mean Earth radius in kilometers (WGS-84 sphere approximation). @type {number} */
export const EARTH_RADIUS_KM = 6371;

/**
 * Validates a finite latitude / longitude pair.
 * @param {number} lat
 * @param {number} lng
 * @returns {boolean}
 */
export function isValidCoord(lat, lng) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Degrees → radians.
 * @param {number} deg
 * @returns {number}
 */
export function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Normalizes `{lat,lng}`, `[lat,lng]`, or latitude/longitude aliases.
 * @param {{lat?:number,lng?:number,latitude?:number,longitude?:number,lon?:number}|[number,number]|null|undefined} point
 * @returns {{lat: number, lng: number}|null}
 */
export function normalizeLatLng(point) {
  if (!point) return null;

  if (Array.isArray(point) && point.length >= 2) {
    const lat = Number(point[0]);
    const lng = Number(point[1]);
    return isValidCoord(lat, lng) ? { lat, lng } : null;
  }

  if (typeof point === 'object') {
    const lat = Number(point.lat ?? point.latitude);
    const lng = Number(point.lng ?? point.lon ?? point.longitude);
    return isValidCoord(lat, lng) ? { lat, lng } : null;
  }

  return null;
}
