/**
 * @fileoverview Custom hook for 60fps rider animation along OSRM routes.
 *
 * Imperatively updates Leaflet markers/polylines to bypass React re-render overhead.
 *
 * @module hooks/useTrackingAnimation
 */

import { useEffect, useRef, useState } from 'react';
import { createAnimationLoop, stepProgressTowards, computeRoutePosition } from '../lib/animationEngine';

const RIDE_DURATION_MS = 3 * 60 * 1000;
const SETVIEW_EVERY_N_FRAMES = 8;

/**
 * Animates a rider marker along a path at 60 FPS using RequestAnimationFrame.
 *
 * @param {object} params
 * @param {Array<[number, number]>} params.route - Coordinates polyline
 * @param {number} params.targetProgress - Telemetry target progress (0 to 1)
 * @param {React.MutableRefObject<any>} params.riderMarkerRef - Leaflet Marker reference
 * @param {React.MutableRefObject<any>} params.routeLineRef - Leaflet Polyline reference
 * @param {React.MutableRefObject<any>} params.mapRef - Leaflet Map reference
 * @param {boolean} [params.autoFollow=true] - Auto pans camera to marker position
 * @returns {{ displayPosition: {lat: number, lng: number, heading: number}, remainingRoute: Array<[number, number]> }}
 */
export function useTrackingAnimation({
  route,
  targetProgress,
  riderMarkerRef,
  routeLineRef,
  mapRef,
  autoFollow = true,
}) {
  const [displayPosition, setDisplayPosition] = useState({ lat: 0, lng: 0, heading: 0 });
  const [remainingRoute, setRemainingRoute] = useState([]);

  const displayProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const routeRef = useRef(route);
  const frameRef = useRef(0);

  // Sync refs
  useEffect(() => {
    targetProgressRef.current = targetProgress;
  }, [targetProgress]);

  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  useEffect(() => {
    if (!route || route.length < 2) return undefined;

    // Reset progress whenever route changes
    displayProgressRef.current = 0;
    const initialLoc = route[0];
    setDisplayPosition({ lat: initialLoc[0], lng: initialLoc[1], heading: 0 });
    setRemainingRoute(route);

    // Max progress step allowed per animation frame to prevent jumping
    const maxStepPerFrame = 4 / (RIDE_DURATION_MS / 1000) / 60;

    const cancelAnim = createAnimationLoop(() => {
      displayProgressRef.current = stepProgressTowards(
        displayProgressRef.current,
        targetProgressRef.current,
        maxStepPerFrame
      );

      const currentRoute = routeRef.current;
      const { lat, lng, heading, remaining } = computeRoutePosition(
        currentRoute,
        displayProgressRef.current
      );

      // 1. Imperatively update Leaflet Rider Marker location and rotation
      const marker = riderMarkerRef.current;
      if (marker) {
        marker.setLatLng([lat, lng]);
        const el = marker.getElement?.();
        if (el) {
          const iconWrap = el.querySelector('.tracking-rider-icon-wrap');
          if (iconWrap) {
            iconWrap.style.transform = `rotate(${Math.round(heading)}deg)`;
          }
        }
      }

      // 2. Imperatively update remaining road trail polyline
      const line = routeLineRef.current;
      if (line && remaining.length >= 2) {
        line.setLatLngs(remaining);
      }

      // 3. Auto follow camera panning
      frameRef.current += 1;
      if (autoFollow && mapRef.current && frameRef.current % SETVIEW_EVERY_N_FRAMES === 0) {
        mapRef.current.panTo([lat, lng], { animate: true, duration: 0.2 });
      }

      // 4. Update local state at throttled rate for UI panels
      setDisplayPosition((prev) => {
        if (
          Math.abs(prev.lat - lat) < 1e-6 &&
          Math.abs(prev.lng - lng) < 1e-6 &&
          Math.abs(prev.heading - heading) < 1
        ) {
          return prev;
        }
        return { lat, lng, heading };
      });

      setRemainingRoute((prev) => {
        if (prev.length === remaining.length && prev[0]?.[0] === remaining[0]?.[0]) {
          return prev;
        }
        return remaining;
      });
    });

    return () => {
      cancelAnim();
    };
  }, [route, riderMarkerRef, routeLineRef, mapRef, autoFollow]);

  return { displayPosition, remainingRoute };
}

export default useTrackingAnimation;
