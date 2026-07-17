/**
 * @fileoverview Reactive ETA hook wrapping the eta helpers library.
 *
 * @module hooks/useETA
 */

import { useMemo } from 'react';
import { calculateETA, getETAMetadata } from '../lib/etaHelpers';

/**
 * Formats and recalculates ETA from live tracking metrics.
 *
 * @param {object} params
 * @param {number|null} [params.minutes] - Pre-computed ETA minutes from tracking
 * @param {number|null} [params.distanceKm] - Remaining distance for on-the-fly calculation
 * @param {number} [params.speedKmh=25]
 * @param {number} [params.traffic=1.2]
 * @returns {{ minutes: number|null, label: string, isArriving: boolean }}
 */
export function useETA({ minutes, distanceKm, speedKmh = 25, traffic = 1.2 } = {}) {
  return useMemo(() => {
    let mins = Number(minutes);

    if (!Number.isFinite(mins) && Number.isFinite(distanceKm)) {
      mins = calculateETA(distanceKm, speedKmh, traffic);
    }

    if (!Number.isFinite(mins)) {
      return { minutes: null, label: '—', isArriving: false };
    }

    const meta = getETAMetadata(mins);
    return {
      minutes: mins,
      label: meta.label,
      isArriving: meta.isArriving,
    };
  }, [minutes, distanceKm, speedKmh, traffic]);
}

export default useETA;
