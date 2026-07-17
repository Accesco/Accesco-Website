/**
 * @fileoverview Main live tracking hook linking routing, telemetry, and 60fps animation.
 *
 * @module hooks/useLiveTracking
 */

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { subscribeToTracking } from '../services/trackingService';
import { useRoute } from './useRoute';
import { useTrackingAnimation } from './useTrackingAnimation';
import {
  readStoredUserLocation,
  defaultStoreFromCustomer,
  routeFingerprint
} from '../lib/mapHelpers';

const RIDE_DURATION_MS = 3 * 60 * 1000;
const TELEMETRY_THROTTLE_MS = 400;

/**
 * Coordinate live rider location subscriptions, routing, and marker interpolation.
 *
 * @param {object} params
 * @param {string} params.orderId - Unique order tracking ID
 * @param {{lat: number, lng: number}} [params.store] - Store location override
 * @param {{lat: number, lng: number}} [params.customer] - Customer location override
 * @param {object} [params.rider] - Rider profile properties
 * @param {number} [params.speed] - Speed baseline
 * @param {number} [params.traffic] - Traffic baseline multiplier
 * @param {(telemetry: any) => void} [params.onUpdate] - Optional update callback
 * @returns {any} Live tracking state and leaflet DOM references
 */
export function useLiveTracking({
  orderId,
  store: storeProp,
  customer: customerProp,
  rider,
  speed,
  traffic,
  onUpdate,
} = {}) {
  const [customerLoc, setCustomerLoc] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [targetProgress, setTargetProgress] = useState(0);

  const mapRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const routeLineRef = useRef(null);

  const onUpdateRef = useRef(onUpdate);
  const lastTelemetryKeyRef = useRef('');
  const lastTelemetryAtRef = useRef(0);

  // Keep callback fresh
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  // 1. Resolve customer coordinates (Prop vs LocalStorage)
  useEffect(() => {
    if (customerProp?.lat && customerProp?.lng) {
      setCustomerLoc([customerProp.lat, customerProp.lng]);
      return;
    }
    const stored = readStoredUserLocation();
    if (stored) {
      setCustomerLoc(stored);
    }
  }, [customerProp?.lat, customerProp?.lng]);

  // 2. Resolve store/pickup coordinates
  const storeLoc = useMemo(() => {
    if (storeProp?.lat && storeProp?.lng) {
      return [storeProp.lat, storeProp.lng];
    }
    return defaultStoreFromCustomer(customerLoc);
  }, [storeProp?.lat, storeProp?.lng, customerLoc]);

  // 3. Load OSRM Route
  const { route, loading: routeLoading, error: routeError } = useRoute(storeLoc, customerLoc);
  const routeKey = useMemo(() => routeFingerprint(route), [route]);

  // Throttled telemetry publisher
  const publishTelemetry = useCallback((next) => {
    const key = JSON.stringify(next);
    if (key === lastTelemetryKeyRef.current) return;

    const elapsed = Date.now() - lastTelemetryAtRef.current;
    const apply = () => {
      lastTelemetryKeyRef.current = key;
      lastTelemetryAtRef.current = Date.now();
      setTelemetry(next);
      if (typeof onUpdateRef.current === 'function') {
        onUpdateRef.current(next);
      }
    };

    if (elapsed >= TELEMETRY_THROTTLE_MS) {
      apply();
    } else {
      setTimeout(apply, TELEMETRY_THROTTLE_MS - elapsed);
    }
  }, []);

  // 4. Subscribe to live updates
  useEffect(() => {
    if (!orderId || route.length < 2 || !customerLoc) return undefined;

    const context = {
      orderId,
      store: { lat: storeLoc[0], lng: storeLoc[1] },
      customer: { lat: customerLoc[0], lng: customerLoc[1] },
      route: route.map(([lat, lng]) => ({ lat, lng })),
      rider,
      speed,
      traffic,
      durationMs: RIDE_DURATION_MS,
      tickMs: 1000,
    };

    const unsubscribe = subscribeToTracking(orderId, context, (snapshot) => {
      if (!snapshot) return;

      if (typeof snapshot.progress === 'number') {
        setTargetProgress(Math.min(1, Math.max(0, snapshot.progress)));
      }

      publishTelemetry({
        lat: snapshot.lat,
        lng: snapshot.lng,
        heading: snapshot.heading,
        remainingETA: snapshot.eta,
        remainingDistance: snapshot.distance,
        currentSpeed: snapshot.speed,
        status: snapshot.status,
        orderStatus: snapshot.orderStatus,
        riderName: snapshot.riderName,
        riderPhone: snapshot.riderPhone,
        riderId: snapshot.riderId,
        progress: snapshot.progress,
        traffic: snapshot.traffic,
        updatedAt: snapshot.updatedAt,
      });
    });

    return unsubscribe;
  }, [
    orderId,
    routeKey,
    customerLoc,
    storeLoc,
    rider,
    speed,
    traffic,
    publishTelemetry,
    route
  ]);

  // 5. Drive 60fps RequestAnimationFrame
  const { displayPosition, remainingRoute } = useTrackingAnimation({
    route,
    targetProgress,
    riderMarkerRef,
    routeLineRef,
    mapRef,
    autoFollow: true,
  });

  return {
    loading: routeLoading && !route.length,
    error: routeError,
    customerLoc,
    storeLoc,
    route,
    displayPosition,
    remainingRoute,
    telemetry,
    targetProgress,
    mapRef,
    riderMarkerRef,
    routeLineRef,
  };
}

export default useLiveTracking;
