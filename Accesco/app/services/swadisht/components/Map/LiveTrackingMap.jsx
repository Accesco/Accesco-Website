"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon paths in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom Icons
const storeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3081/3081840.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function LiveTrackingMap() {
  const [userLoc, setUserLoc] = useState(null);
  const [routePositions, setRoutePositions] = useState([]);

  // Now the darkstore is default set to chennai
  // Later the /api/darkstore will be implemented to fetch the closest store to the user
  // And the 
  const storeLoc = [13.08268, 80.27072]; // Chennai Darkstore

  useEffect(() => {
    const stored = localStorage.getItem("userLocation");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if ((parsed.lat && parsed.lng) || parsed.lon) {
          setUserLoc([
            parseFloat(parsed.lat),
            parseFloat(parsed.lng) || parseFloat(parsed.lon),
          ]);
        } else if (parsed.latitude && parsed.longitude) {
          setUserLoc([
            parseFloat(parsed.latitude),
            parseFloat(parsed.longitude),
          ]);
        }
      } catch (e) {
        console.error("Failed to parse location data:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!userLoc) return;

    const fetchRoute = async () => {
      try {
        const start = `${storeLoc[1]},${storeLoc[0]}`;
        const end = `${userLoc[1]},${userLoc[0]}`;

        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`,
        );
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map((coord) => [
            coord[1],
            coord[0],
          ]);
          setRoutePositions(coords);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
        setRoutePositions([storeLoc, userLoc]);
      }
    };

    fetchRoute();
  }, [userLoc]);

  if (!userLoc) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          background: "#f8fafc",
          height: "100%",
        }}
      >
        Waiting for user location...
      </div>
    );
  }

  return (
    <MapContainer
      key={userLoc.join(",")}
      bounds={[storeLoc, userLoc]}
      zoomControl={false}
      scrollWheelZoom={false}
      style={{ height: "100%", minHeight: "480px", width: "100%", zIndex: 1 }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

      <Marker position={storeLoc} icon={storeIcon} />
      <Marker position={userLoc} icon={userIcon} />
      {routePositions.length > 0 && (
        <Polyline
          positions={routePositions}
          color="#2d0018"
          weight={5}
          opacity={0.8}
        />
      )}
    </MapContainer>
  );
}


