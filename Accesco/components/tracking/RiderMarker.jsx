/**
 * @fileoverview Dynamic Leaflet marker for the delivery rider.
 *
 * Position updates happen via imperative ref in useLiveTracking (60fps).
 *
 * @module components/tracking/RiderMarker
 */

import { memo } from 'react';
import { Marker } from 'react-leaflet';
import { createRiderIcon } from '@/lib/mapHelpers';

/**
 * Live rider marker with rotational heading.
 *
 * @param {object} props
 * @param {[number, number]} props.position - Lat/lng array coordinates
 * @param {number} props.heading - Compass heading rotation angle (degrees)
 * @param {React.MutableRefObject<any>} props.markerRef - Leaflet ref handle for 60fps pans
 * @returns {React.ReactElement} Leaflet Marker element
 */
function RiderMarker({ position, heading, markerRef }) {
  const icon = createRiderIcon(heading);

  return (
    <Marker
      position={position}
      icon={icon}
      ref={markerRef}
    />
  );
}

export default memo(RiderMarker);
