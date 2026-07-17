'use client';

import { memo } from 'react';
import { Polyline } from 'react-leaflet';

/**
 * Route polyline — remaining path ahead of the rider shrinks as they advance.
 */
function RoutePolyline({ positions, polylineRef, color = '#2d0018', weight = 5 }) {
  if (!positions?.length) return null;

  return (
    <Polyline
      ref={polylineRef}
      positions={positions}
      color={color}
      weight={weight}
      opacity={0.85}
      lineCap="round"
      lineJoin="round"
    />
  );
}

export default memo(RoutePolyline);
