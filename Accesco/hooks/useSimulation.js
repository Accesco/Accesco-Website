/**
 * @fileoverview Hook wrapping the simulation service lifecycle.
 *
 * @module hooks/useSimulation
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { startSimulation } from '../services/simulationTrackingService';

/**
 * Runs a route-following rider simulation reactively.
 *
 * @param {object} options
 * @param {string} options.orderId
 * @param {Array<{lat:number,lng:number}|[number,number]>} options.route
 * @param {boolean} [options.enabled=true]
 * @param {number} [options.durationMs]
 * @param {number} [options.tickMs=1000]
 * @param {number} [options.speedKmh]
 * @param {object} [options.rider]
 * @returns {{ state: object|null, isRunning: boolean, restart: () => void }}
 */
export function useSimulation({
  orderId,
  route,
  enabled = true,
  durationMs,
  tickMs = 1000,
  speedKmh,
  rider
} = {}) {
  const [state, setState] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const stopRef = useRef(null);

  const stop = useCallback(() => {
    if (stopRef.current) {
      stopRef.current();
      stopRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const start = useCallback(() => {
    stop();
    if (!enabled || !route || route.length < 2 || !orderId) return;

    const context = {
      route,
      store: route[0],
      customer: route[route.length - 1],
      durationMs,
      tickMs,
      speed: speedKmh,
      rider
    };

    const stopSim = startSimulation(orderId, context, (tick) => {
      setState(tick);
    });

    stopRef.current = stopSim;
    setIsRunning(true);
  }, [orderId, enabled, route, durationMs, tickMs, speedKmh, rider, stop]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  return { state, isRunning, restart: start };
}

export default useSimulation;
