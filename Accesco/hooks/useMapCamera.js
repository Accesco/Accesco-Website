/**
 * @fileoverview Custom hook to control Leaflet camera following, centering, and bounds fitting.
 *
 * @module hooks/useMapCamera
 */

import { useEffect, useRef, useCallback } from 'react';
import { fitTrackingBounds, followRider } from '../lib/mapHelpers';

/**
 * Handles map camera zooming and tracking.
 *
 * @param {React.MutableRefObject<any>} mapRef - Reference to MapContainer instance
 * @param {[number, number]|null} storeLoc - Pickup location
 * @param {[number, number]|null} customerLoc - Destination location
 * @param {boolean} [autoFollowEnabled=true] - Auto-pan camera to follow rider
 * @returns {{ fitBounds: (riderLoc?: [number, number]) => void, panToRider: (riderLoc: [number, number]) => void }}
 */
export function useMapCamera(mapRef, storeLoc, customerLoc, autoFollowEnabled = true) {
  const isFirstFit = useRef(true);

  const fitBounds = useCallback(
    (riderLoc = null) => {
      const map = mapRef.current;
      if (!map || !storeLoc || !customerLoc) return;

      fitTrackingBounds(map, {
        store: storeLoc,
        customer: customerLoc,
        rider: riderLoc,
      });
    },
    [mapRef, storeLoc, customerLoc]
  );

  const panToRider = useCallback(
    (riderLoc) => {
      if (!autoFollowEnabled) return;
      const map = mapRef.current;
      if (!map || !riderLoc) return;

      followRider(map, riderLoc);
    },
    [mapRef, autoFollowEnabled]
  );

  // Auto-fit bounds on initial load
  useEffect(() => {
    if (isFirstFit.current && storeLoc && customerLoc && mapRef.current) {
      fitBounds();
      isFirstFit.current = false;
    }
  }, [storeLoc, customerLoc, mapRef, fitBounds]);

  return { fitBounds, panToRider };
}

export default useMapCamera;
