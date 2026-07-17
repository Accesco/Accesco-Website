/**
 * @fileoverview Standalone rider simulation hook.
 *
 * Exposes simulation state for testing or custom UIs.
 * Production tracking uses `trackingService` internally — this hook
 * is available when you need simulation without the full service layer.
 *
 * @module hooks/useRiderSimulation
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { createRiderSimulation } from '@/lib/simulationEngine';

/**
 * Runs a route-following rider simulation.
 *
 * @param {object} options
 * @param {Array<{lat:number,lng:number}|[number,number]>} options.route
 * @param {boolean} [options.enabled=true]
 * @param {number} [options.durationMs]
 * @param {number} [options.tickMs=1000]
 * @param {number} [options.speedKmh]
 * @returns {{ state: object|null, isRunning: boolean, restart: () => void }}
 */
export function useRiderSimulation({
  route,
  enabled = true,
  durationMs,
  tickMs = 1000,
  speedKmh,
} = {}) {
  const [state, setState] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const simRef = useRef(null);

  const stop = useCallback(() => {
    simRef.current?.stop();
    simRef.current = null;
    setIsRunning(false);
  }, []);

  const start = useCallback(() => {
    stop();
    if (!enabled || !route || route.length < 2) return;

    const sim = createRiderSimulation({
      route,
      durationMs,
      tickMs,
      speedKmh,
      onTick: (tick) => setState(tick),
      onComplete: () => setIsRunning(false),
    });

    simRef.current = sim;
    setIsRunning(true);
    sim.start();
  }, [enabled, route, durationMs, tickMs, speedKmh, stop]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  return { state, isRunning, restart: start };
}

export default useRiderSimulation;
