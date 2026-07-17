"use client";

import { useEffect, useState, useRef, useMemo, memo } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  subscribeToRiderLocation,
  startRiderSimulation,
  computeRoutePosition,
  stepProgressTowards,
} from "@/lib/riderTrackingService";
import { fetchRoute } from "@/lib/routeEngine";
import { formatETA } from "@/lib/etaEngine";

const RIDE_DURATION_MS = 3 * 60 * 1000;
const TELEMETRY_THROTTLE_MS = 400;
const SETVIEW_EVERY_N_FRAMES = 8;

const riderIcon = new L.Icon({
  iconUrl: "/images/delivery-rider.png",
  iconSize: [38, 68],
  iconAnchor: [19, 60],
  className: "swadisht-rider-icon",
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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

/**
 * Live telemetry strip — memoized so map animation frames do not re-render this tree.
 */
const TrackingTelemetry = memo(function TrackingTelemetry({ telemetry }) {
  if (!telemetry) return null;

  const {
    remainingETA,
    remainingDistance,
    currentSpeed,
    heading,
    status,
    orderStatus,
  } = telemetry;

  const statusLabel = (orderStatus || status || "—")
    .toString()
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
        gap: 8,
        padding: "10px 12px",
        background: "rgba(255,255,255,0.96)",
        borderBottom: "1px solid #EAD9C8",
        fontSize: 12,
        color: "#1C1C1C",
      }}
    >
      <div>
        <div style={{ color: "#9B7E6A", fontWeight: 600 }}>ETA</div>
        <div style={{ fontWeight: 700 }}>
          {remainingETA != null ? formatETA(remainingETA) : "—"}
        </div>
      </div>
      <div>
        <div style={{ color: "#9B7E6A", fontWeight: 600 }}>Distance</div>
        <div style={{ fontWeight: 700 }}>
          {remainingDistance != null
            ? `${Number(remainingDistance).toFixed(2)} km`
            : "—"}
        </div>
      </div>
      <div>
        <div style={{ color: "#9B7E6A", fontWeight: 600 }}>Speed</div>
        <div style={{ fontWeight: 700 }}>
          {currentSpeed != null ? `${Math.round(currentSpeed)} km/h` : "—"}
        </div>
      </div>
      <div>
        <div style={{ color: "#9B7E6A", fontWeight: 600 }}>Heading</div>
        <div style={{ fontWeight: 700 }}>
          {heading != null ? `${Math.round(heading)}°` : "—"}
        </div>
      </div>
      <div>
        <div style={{ color: "#9B7E6A", fontWeight: 600 }}>Status</div>
        <div style={{ fontWeight: 700 }}>{statusLabel}</div>
      </div>
    </div>
  );
});

/**
 * Stable geometry fingerprint so we skip remounting animation when OSRM
 * returns an equivalent path as a new array reference.
 * @param {Array<[number,number]>} route
 * @returns {string}
 */
function routeFingerprint(route) {
  if (!route?.length) return "";
  const first = route[0];
  const last = route[route.length - 1];
  return `${route.length}:${first?.[0]?.toFixed?.(4)},${first?.[1]?.toFixed?.(4)}:${last?.[0]?.toFixed?.(4)},${last?.[1]?.toFixed?.(4)}`;
}

export default function LiveTrackingMap({ orderId, onTrackingUpdate }) {
  const [userLoc, setUserLoc] = useState(null);
  const [routePositions, setRoutePositions] = useState([]);
  const [riderPos, setRiderPos] = useState(null);
  const [telemetry, setTelemetry] = useState(null);

  const riderMarkerRef = useRef(null);
  const routeLineRef = useRef(null);
  const targetProgressRef = useRef(0);
  const mapRef = useRef(null);
  const onTrackingUpdateRef = useRef(onTrackingUpdate);
  const lastTelemetryKeyRef = useRef("");
  const lastTelemetryAtRef = useRef(0);
  const routeFingerprintRef = useRef("");
  const routePositionsRef = useRef(routePositions);

  useEffect(() => {
    onTrackingUpdateRef.current = onTrackingUpdate;
  }, [onTrackingUpdate]);

  useEffect(() => {
    routePositionsRef.current = routePositions;
  }, [routePositions]);

  const storeLoc = useMemo(
    () =>
      userLoc
        ? [userLoc[0] + 0.012, userLoc[1] + 0.012]
        : [13.08268, 80.27072],
    [userLoc],
  );

  const routeKey = useMemo(
    () => routeFingerprint(routePositions),
    [routePositions],
  );

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
    if (!userLoc) return undefined;
    let cancelled = false;
    const controller =
      typeof AbortController !== "undefined" ? new AbortController() : null;

    const loadRoute = async () => {
      const result = await fetchRoute(
        { lat: storeLoc[0], lng: storeLoc[1] },
        { lat: userLoc[0], lng: userLoc[1] },
        { signal: controller?.signal },
      );
      if (cancelled) return;

      const next =
        result.coordinates?.length > 0
          ? result.coordinates
          : [storeLoc, userLoc];
      const fp = routeFingerprint(next);
      if (fp === routeFingerprintRef.current) return;
      routeFingerprintRef.current = fp;
      setRoutePositions(next);
    };

    loadRoute();
    return () => {
      cancelled = true;
      controller?.abort();
    };
  }, [userLoc, storeLoc]);

  // Single Firestore subscription + 60fps animation (owned by the map).
  useEffect(() => {
    if (!orderId || routePositions.length < 2) return undefined;

    setRiderPos(routePositions[0]);
    targetProgressRef.current = 0;

    const maxStepPerFrame = 4 / (RIDE_DURATION_MS / 1000) / 60;
    let displayProgress = 0;
    let raf = 0;
    let alive = true;
    let frame = 0;
    /** @type {ReturnType<typeof setTimeout>|null} */
    let telemetryTimer = null;
    /** @type {object|null} */
    let pendingTelemetry = null;

    const flushTelemetry = () => {
      telemetryTimer = null;
      if (!alive || !pendingTelemetry) return;
      const next = pendingTelemetry;
      pendingTelemetry = null;
      const key = JSON.stringify(next);
      if (key === lastTelemetryKeyRef.current) return;
      lastTelemetryKeyRef.current = key;
      lastTelemetryAtRef.current = Date.now();
      setTelemetry(next);
      if (typeof onTrackingUpdateRef.current === "function") {
        onTrackingUpdateRef.current(next);
      }
    };

    const publishTelemetry = (next) => {
      const key = JSON.stringify(next);
      if (key === lastTelemetryKeyRef.current && pendingTelemetry == null) return;
      pendingTelemetry = next;
      if (telemetryTimer != null) return;
      const elapsed = Date.now() - lastTelemetryAtRef.current;
      const wait = Math.max(0, TELEMETRY_THROTTLE_MS - elapsed);
      telemetryTimer = setTimeout(flushTelemetry, wait);
    };

    const animate = () => {
      if (!alive) return;
      displayProgress = stepProgressTowards(
        displayProgress,
        targetProgressRef.current,
        maxStepPerFrame,
      );
      const route = routePositionsRef.current;
      const { lat, lng, remaining } = computeRoutePosition(
        route,
        displayProgress,
      );
      if (riderMarkerRef.current) {
        riderMarkerRef.current.setLatLng([lat, lng]);
      }
      if (routeLineRef.current && remaining.length >= 2) {
        routeLineRef.current.setLatLngs(remaining);
      }
      frame += 1;
      if (mapRef.current && frame % SETVIEW_EVERY_N_FRAMES === 0) {
        mapRef.current.setView([lat, lng], mapRef.current.getZoom(), {
          animate: false,
        });
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const unsubscribe = subscribeToRiderLocation(orderId, (data) => {
      if (!data) return;
      if (typeof data.progress === "number") {
        targetProgressRef.current = data.progress;
      }

      publishTelemetry({
        remainingETA: data.remainingETA ?? null,
        remainingDistance: data.remainingDistance ?? null,
        currentSpeed: data.currentSpeed ?? null,
        heading: data.heading ?? null,
        status: data.status ?? null,
        orderStatus: data.orderStatus ?? null,
        riderName: data.riderName ?? null,
        riderPhone: data.riderPhone ?? null,
        progress: data.progress ?? null,
      });
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      if (telemetryTimer != null) clearTimeout(telemetryTimer);
      unsubscribe();
    };
  }, [orderId, routeKey]);

  // Simulation writer — deduped by orderId inside riderTrackingService.
  useEffect(() => {
    if (!orderId || !userLoc || routePositions.length < 2) return undefined;

    const path = routePositions.map(([lat, lng]) => ({ lat, lng }));
    const from = path[0];
    const to = path[path.length - 1];
    const waypoints = path.slice(1, -1);

    const stopSim = startRiderSimulation(orderId, from, to, {
      route: path,
      waypoints,
      store: from,
      customer: to,
      durationMs: RIDE_DURATION_MS,
      tickMs: 1000,
      eta: RIDE_DURATION_MS / 60000,
    });

    return () => {
      stopSim();
    };
  }, [orderId, userLoc, routeKey]);

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
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TrackingTelemetry telemetry={telemetry} />
      <div style={{ flex: 1, minHeight: 480, position: "relative" }}>
        <MapContainer
          ref={mapRef}
          key={userLoc.join(",")}
          center={storeLoc}
          zoom={15}
          zoomControl={true}
          scrollWheelZoom={true}
          style={{
            height: "100%",
            minHeight: "480px",
            width: "100%",
            zIndex: 1,
          }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

          <Marker position={storeLoc} icon={storeIcon} />
          <Marker position={userLoc} icon={userIcon} />
          {riderPos && (
            <Marker position={riderPos} icon={riderIcon} ref={riderMarkerRef} />
          )}
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
      </div>
    </div>
  );
}
