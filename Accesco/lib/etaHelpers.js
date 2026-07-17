/**
 * @fileoverview High-level ETA helper wrappers and UI formatters.
 * Integrates directly with the core etaEngine.js.
 *
 * @module lib/etaHelpers
 */

import {
  formatETA,
  calculateETA,
  calculateTrafficMultiplier,
  remainingDistanceFromProgress,
  remainingETAFromProgress
} from './etaEngine';

/**
 * Returns a human-friendly ETA and arrival flag based on remaining minutes.
 *
 * @param {number|null} minutes
 * @returns {{ label: string, isArriving: boolean }}
 */
export function getETAMetadata(minutes) {
  if (minutes == null || !Number.isFinite(minutes)) {
    return { label: '—', isArriving: false };
  }
  return {
    label: formatETA(minutes),
    isArriving: minutes <= 3,
  };
}

/**
 * Formats speed for display.
 * @param {number|null} speed
 * @returns {string}
 */
export function formatSpeed(speed) {
  if (speed == null || !Number.isFinite(speed)) return '—';
  return `${Math.round(speed)} km/h`;
}

/**
 * Formats distance for display.
 * @param {number|null} distanceKm
 * @returns {string}
 */
export function formatDistance(distanceKm) {
  if (distanceKm == null || !Number.isFinite(distanceKm)) return '—';
  if (distanceKm < 0.1) return 'Arriving';
  return `${distanceKm.toFixed(2)} km`;
}

export {
  formatETA,
  calculateETA,
  calculateTrafficMultiplier,
  remainingDistanceFromProgress,
  remainingETAFromProgress
};
