'use client';

import { useEffect, memo } from 'react';
import { MapContainer, TileLayer, Marker, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useLiveTracking } from '@/hooks/useLiveTracking';
import {
  fixLeafletIcons,
  TRACKING_TILE_URL,
  storeIcon,
  customerIcon,
  fitTrackingBounds,
} from '@/lib/mapHelpers';

import RiderMarker from './RiderMarker';
import RoutePolyline from './RoutePolyline';
import ETAWidget from './ETAWidget';
import './tracking.css';

fixLeafletIcons();

/**
 * Map bounds fitter — runs once when route is ready.
 */
function MapBoundsFitter({ storeLoc, customerLoc, mapRef }) {
  useEffect(() => {
    if (!mapRef?.current || !storeLoc || !customerLoc) return;
    const map = mapRef.current;
    if (map instanceof L.Map) {
      fitTrackingBounds(map, { store: storeLoc, customer: customerLoc });
    } else if (typeof map.fitBounds === 'function') {
      fitTrackingBounds(map, { store: storeLoc, customer: customerLoc });
    }
  }, [storeLoc, customerLoc, mapRef]);

  return null;
}

/**
 * Production live rider map — bike animation, polyline, markers, auto-follow.
 *
 * Data flows through useLiveTracking → trackingService (API/Firestore).
 * UI never changes when the provider is swapped.
 */
function RiderMap({
  orderId,
  store,
  customer,
  rider,
  speed,
  traffic,
  onTrackingUpdate,
  height = '480px',
  className = '',
}) {
  const {
    loading,
    error,
    customerLoc,
    storeLoc,
    route,
    displayPosition,
    remainingRoute,
    telemetry,
    mapRef,
    riderMarkerRef,
    routeLineRef,
  } = useLiveTracking({
    orderId,
    store,
    customer,
    rider,
    speed,
    traffic,
    onUpdate: onTrackingUpdate,
  });

  if (error && !customerLoc) {
    return (
      <div className={`tracking-map-empty ${className}`} style={{ height }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!customerLoc) {
    return (
      <div className={`tracking-map-empty ${className}`} style={{ height }}>
        <p>Waiting for delivery location…</p>
      </div>
    );
  }

  const riderPos = displayPosition
    ? [displayPosition.lat, displayPosition.lng]
    : route[0] || storeLoc;

  return (
    <div className={`tracking-map-root ${className}`}>
      <ETAWidget telemetry={telemetry} />
      <div className="tracking-map-canvas" style={{ minHeight: height }}>
        {loading && (
          <div className="tracking-map-loading">Loading route…</div>
        )}
        <MapContainer
          ref={mapRef}
          key={customerLoc.join(',')}
          center={storeLoc}
          zoom={15}
          zoomControl
          scrollWheelZoom
          className="tracking-leaflet-map"
          style={{ height: '100%', minHeight: height, width: '100%' }}
        >
          <TileLayer url={TRACKING_TILE_URL} attribution="&copy; OpenStreetMap" />

          <MapBoundsFitter
            storeLoc={storeLoc}
            customerLoc={customerLoc}
            mapRef={mapRef}
          />

          <Marker position={storeLoc} icon={storeIcon} />
          <Marker position={customerLoc} icon={customerIcon} />

          {/* Pulsing destination ring */}
          <CircleMarker
            center={customerLoc}
            radius={12}
            pathOptions={{
              color: '#7A0042',
              fillColor: '#7A0042',
              fillOpacity: 0.15,
              weight: 2,
            }}
            className="tracking-destination-pulse"
          />

          <RiderMarker
            position={riderPos}
            heading={displayPosition?.heading ?? 0}
            markerRef={riderMarkerRef}
          />

          <RoutePolyline
            positions={remainingRoute.length ? remainingRoute : route}
            polylineRef={routeLineRef}
          />
        </MapContainer>
      </div>
    </div>
  );
}

export default memo(RiderMap);
