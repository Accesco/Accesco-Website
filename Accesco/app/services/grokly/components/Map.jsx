// ./components/Map.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon missing in Next.js
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// CRITICAL FIX: This forces the camera to move when you search
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position && position.lat && position.lng) {
      // flyTo accepts [latitude, longitude] and zoom level
      map.flyTo([position.lat, position.lng], 17, { animate: true });
    }
  }, [position, map]);
  return null;
}

export default function Map({ center, onLocationChange }) {
  const [position, setPosition] = useState(center);
  const markerRef = useRef(null);

  // Sync internal pin state with external search updates
  useEffect(() => {
    if (center && center.lat && center.lng) {
      setPosition(center);
    }
  }, [center]);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onLocationChange(e.latlng.lat, e.latlng.lng);
      }
    });
    return null;
  };

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const latlng = marker.getLatLng();
        setPosition(latlng);
        onLocationChange(latlng.lat, latlng.lng);
      }
    },
  };

  // Prevent rendering if coordinates are missing
  if (!position || !position.lat || !position.lng) return null;

  return (
    <MapContainer 
      center={[position.lat, position.lng]} 
      zoom={14} 
      style={{ height: '300px', width: '100%', borderRadius: '8px', zIndex: 1 }} 
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Mounts the camera controller to the map */}
      <RecenterMap position={position} />
      
      <MapEvents />
      <Marker 
        draggable={true}
        eventHandlers={eventHandlers}
        position={[position.lat, position.lng]}
        ref={markerRef}
        icon={redIcon}
      />
    </MapContainer>
  );
}