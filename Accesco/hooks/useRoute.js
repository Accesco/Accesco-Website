/**
 * @fileoverview Custom hook for fetching and caching routes.
 *
 * @module hooks/useRoute
 */

import { useEffect, useState, useRef, useMemo } from 'react';
import { fetchRoute } from '../lib/routeEngine';
import { routeFingerprint } from '../lib/mapHelpers';

/**
 * Fetches and resolves road routes between origin and destination coordinates.
 *
 * @param {[number, number]|null} storeLoc - Origin coordinates
 * @param {[number, number]|null} customerLoc - Destination coordinates
 * @returns {{ loading: boolean, error: string|null, route: Array<[number, number]> }}
 */
export function useRoute(storeLoc, customerLoc) {
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const routeFingerprintRef = useRef('');

  useEffect(() => {
    if (!storeLoc || !customerLoc) {
      return undefined;
    }

    let cancelled = false;
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;

    const loadRoute = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchRoute(
          { lat: storeLoc[0], lng: storeLoc[1] },
          { lat: customerLoc[0], lng: customerLoc[1] },
          { signal: controller?.signal }
        );

        if (cancelled) return;

        const next = result.coordinates?.length >= 2 ? result.coordinates : [storeLoc, customerLoc];
        const fp = routeFingerprint(next);

        if (fp !== routeFingerprintRef.current) {
          routeFingerprintRef.current = fp;
          setRoute(next);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[useRoute] Failed to load route:', err);
          setError('Failed to load delivery route');
          // Fallback to straight line
          setRoute([storeLoc, customerLoc]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRoute();

    return () => {
      cancelled = true;
      controller?.abort();
    };
  }, [storeLoc, customerLoc]);

  return { loading, error, route };
}

export default useRoute;
