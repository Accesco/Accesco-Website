"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "@/app/components/AuthProvider";
import {
  subscribeToRiderLocation,
  startRiderSimulation,
  computeRoutePosition,
  stepProgressTowards,
} from "@/lib/riderTrackingService";

const RIDE_DURATION_MS = 3 * 60 * 1000;

// Track which orders already have a running simulation this session, so a
// refresh / strict-mode double-mount doesn't spawn duplicate rider feeds.
const startedSimulations = new Set();

// Live delivery-rider marker using the branded scooter illustration.
const riderIcon = new L.Icon({
  iconUrl: "/images/delivery-rider.png",
  iconSize: [38, 68],       // keeps the image's portrait aspect ratio
  iconAnchor: [19, 60],     // anchored on the scooter's wheels (near bottom)
  className: "swadisht-rider-icon",
});

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

export default function LiveTrackingMap({ orderId }) {
  const [userLoc, setUserLoc] = useState(null);
  const [routePositions, setRoutePositions] = useState([]);
  const [riderPos, setRiderPos] = useState(null);
  const riderMarkerRef = useRef(null);
  const routeLineRef = useRef(null);
  const targetProgressRef = useRef(0);
  const mapRef = useRef(null);

  // Option 1 (until /api/darkstore picks the nearest real store): place the store
  // ~1.5 km from the customer so the rider always starts nearby, in any city.
  // Falls back to the Chennai darkstore until the user's location is known.
  const storeLoc = userLoc
    ? [userLoc[0] + 0.012, userLoc[1] + 0.012]
    : [13.08268, 80.27072];

  const { userData } = useAuth ? useAuth() : {};

  useEffect(() => {
    const parsed = userData?.selectedLocation;
    if (parsed) {
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
    }
  }, [userData]);

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

  // Live rider tracking: subscribe to `progress`, then animate the marker along
  // the exact road at 60fps (accuracy) and consume the trail behind it.
  useEffect(() => {
    if (!orderId || routePositions.length < 2) return;

    setRiderPos(routePositions[0]); // render the marker at the store initially

    // Bounded step per frame so the marker can never visually teleport, even if
    // the live target is far ahead when the map first subscribes.
    const maxStepPerFrame = (4 / (RIDE_DURATION_MS / 1000)) / 60;
    let displayProgress = 0;
    let raf;
    const animate = () => {
      displayProgress = stepProgressTowards(displayProgress, targetProgressRef.current, maxStepPerFrame);
      const { lat, lng, remaining } = computeRoutePosition(routePositions, displayProgress);
      if (riderMarkerRef.current) riderMarkerRef.current.setLatLng([lat, lng]);
      if (routeLineRef.current && remaining.length >= 2) routeLineRef.current.setLatLngs(remaining);
      // Follow the rider like Google Maps driver tracking.
      if (mapRef.current) mapRef.current.setView([lat, lng], mapRef.current.getZoom(), { animate: false });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const unsubscribe = subscribeToRiderLocation(orderId, (data) => {
      if (data && typeof data.progress === "number") targetProgressRef.current = data.progress;
    });

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
    };
  }, [orderId, routePositions]);

  // Start the stand-in rider feed once the road route is known, so the rider
  // follows the actual road geometry from the store to the customer.
  useEffect(() => {
    if (!orderId || !userLoc || routePositions.length < 2) return;
    if (startedSimulations.has(orderId)) return;
    startedSimulations.add(orderId);

    const path = routePositions.map(([lat, lng]) => ({ lat, lng }));
    const from = path[0];
    const to = path[path.length - 1];
    const waypoints = path.slice(1, -1);

    const stopSim = startRiderSimulation(orderId, from, to, {
      waypoints,
      durationMs: RIDE_DURATION_MS,
      tickMs: 1000, // frequent updates + CSS glide = smooth constant-speed motion
    });

    return () => stopSim();
  }, [orderId, userLoc, routePositions]);

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
      ref={mapRef}
      key={userLoc.join(",")}
      center={storeLoc}
      zoom={15}
      zoomControl={true}
      scrollWheelZoom={true}
      style={{ height: "100%", minHeight: "480px", width: "100%", zIndex: 1 }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

      <Marker position={storeLoc} icon={storeIcon} />
      <Marker position={userLoc} icon={userIcon} />
      {riderPos && <Marker position={riderPos} icon={riderIcon} ref={riderMarkerRef} />}
      {routePositions.length > 0 && (
        <Polyline
          ref={routeLineRef}
          positions={routePositions}
          color="#2d0018"
          weight={5}
          opacity={0.8}
        />
      )}
    </MapContainer>
  );
}


