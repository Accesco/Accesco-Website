'use client';

import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGrokly } from '../contexts/GroklyContext';
import styles from './tracking.module.css';
import Link from 'next/link';
import { mockRiderData } from '@/lib/mockRiderData';
import { subscribeToRiderLocation, startRiderSimulation, computeRoutePosition, stepProgressTowards } from '@/lib/riderTrackingService';

// Track which orders already have a running simulation this session, so a
// refresh / strict-mode double-mount doesn't spawn duplicate rider feeds.
const startedSimulations = new Set();

// Production-ready SVG Icons to replace emojis

const CheckIcon = ({ className }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const StarIcon = ({ className, style }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" style={style}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const DoorIcon = ({ className, style }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
  </svg>
);

const PhoneIcon = ({ className, style }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const BikeIcon = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="18" r="3" />
    <circle cx="19" cy="18" r="3" />
    <path d="M12 18V12l4-4h4" />
    <path d="M12 12H8l-3-3V5a2 2 0 0 1 2-2h3" />
  </svg>
);

const CartIcon = ({ className }) => (
  <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CardIcon = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const BagIcon = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

function GroklyTrackingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const eta = searchParams.get('eta') || '12';
  const { orders } = useGrokly();

  // Local state for the current order synced with context orders
  const [currentOrder, setCurrentOrder] = useState(null);

  // Keep local order in sync with context orders
  useEffect(() => {
    if (!orderId) return;
    const found = orders.find(o => o.id === orderId);
    if (found) {
      setCurrentOrder(found);
    }
  }, [orders, orderId]);

  const order = currentOrder || orders.find(o => o.id === orderId);

  // Resolve the real delivery ("Your door") coordinates: prefer the order's saved
  // coordinates, fall back to a default.
  const getHomeLatLng = () => {
    if (order?.deliveryLat && order?.deliveryLng) {
      return [order.deliveryLat, order.deliveryLng];
    }
    return [12.9592, 77.7610]; // fallback
  };

  // Option 1 (until real dark-store locations exist): place the store ~1.5 km from
  // the customer so the rider always starts nearby and the trip looks realistic
  // in any city, instead of a fixed Bangalore hub.
  const getHubLatLng = ([homeLat, homeLng]) => {
    const OFFSET = 0.012; // ~1.3 km in latitude
    return [homeLat + OFFSET, homeLng + OFFSET];
  };

  // Stable store/home coordinates for this order.
  const homeCoords = useMemo(() => getHomeLatLng(), [order?.deliveryLat, order?.deliveryLng]);
  const hubCoords = useMemo(() => getHubLatLng(homeCoords), [homeCoords]);
  // Actual driving route (roads) from store → home, fetched from OSRM.
  const [roadRoute, setRoadRoute] = useState([]);

  // States for interactive custom features
  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState('');
  const [chatSent, setChatSent] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  
  // Interactive Tab selection: 'delivery' vs 'summary' (Recreating input_file_9.png and input_file_10.png)
  const [activeTab, setActiveTab] = useState('delivery');

  // Dynamic countdown timer for "Forgot to add?" block
  const [timer, setTimer] = useState(48); 

  // Maps loading states
  const miniMapRef = useRef(null);
  const miniMapInstanceRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const roadPolylineRef = useRef(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapResetKey, setMapResetKey] = useState(0);

  // Countdown timer effect
  useEffect(() => {
    const clock = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Mock Pay Online trigger
  const handlePayOnline = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsPaid(true);
    }, 1500);
  };

  // 100% Bulletproof Leaflet Initialization (Resolves blank/grey box issues completely)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load Leaflet map CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (!miniMapRef.current) return;

      // Clean up previous map instance safely to prevent "Map container is already initialized" error
      if (miniMapInstanceRef.current) {
        miniMapInstanceRef.current.remove();
        miniMapInstanceRef.current = null;
      }

      const L = window.L;
      if (!L) return;

      // hubCoords / homeCoords come from the memoized values above.
      const center = [
        (hubCoords[0] + homeCoords[0]) / 2,
        (hubCoords[1] + homeCoords[1]) / 2,
      ]; // Midpoint between store and home

      const miniMap = L.map(miniMapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        doubleClickZoom: true,
        boxZoom: false,
        attributionControl: false
      }).setView(center, 14);

      miniMapInstanceRef.current = miniMap;

      // CartoDB Voyager — detailed street map with roads/labels visible (Swiggy/Zomato-style)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20
      }).addTo(miniMap);

      // Define styled marker icons matching input_file_12.png perfectly (Using more radiant modern green)
      const greenDotIcon = L.divIcon({
        html: `<div style="
          background: #0c831f;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(12,131,31,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        "><span style="display:inline-block; width:6px; height:6px; background:#fff; border-radius:50%"></span></div>`,
        className: 'custom-hub-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const orangeDotIcon = L.divIcon({
        html: `<div style="
          background: #ea580c;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(234,88,12,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        "><span style="display:inline-block; width:6px; height:6px; background:#fff; border-radius:50%"></span></div>`,
        className: 'custom-home-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      // Delivery rider marker using the branded scooter illustration.
      // Wrapped in a div so the inner <img> can be flipped to face the travel direction.
      const riderIcon = L.divIcon({
        html: `<img class="rider-scooter-img" src="/images/delivery-rider.png"
                 style="width:38px;height:68px;transition:transform 0.3s ease;" />`,
        className: 'custom-rider-icon',
        iconSize: [38, 68],
        iconAnchor: [19, 60],
      });

      // The road route polyline is drawn by a separate effect once OSRM returns it.
      L.marker(hubCoords, { icon: greenDotIcon }).addTo(miniMap);
      L.marker(homeCoords, { icon: orangeDotIcon }).addTo(miniMap);

      // Place the rider marker; its position is driven live by the Firestore feed below.
      // Movement is animated at 60fps client-side, so no CSS transition is needed here.
      riderMarkerRef.current = L.marker(hubCoords, { icon: riderIcon }).addTo(miniMap);

      setMapsLoaded(true);

      // Force Leaflet to recalculate container dimensions once layout render finishes
      setTimeout(() => {
        if (miniMapInstanceRef.current) {
          miniMapInstanceRef.current.invalidateSize();
        }
      }, 100);
    };

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        initMap();
      };
      document.head.appendChild(script);
    }

    return () => {
      if (miniMapInstanceRef.current) {
        miniMapInstanceRef.current.remove();
        miniMapInstanceRef.current = null;
      }
    };
    // Re-init the map when the resolved delivery coordinates change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapResetKey, order?.deliveryLat, order?.deliveryLng]);

  // Fetch the actual driving route (roads) from store → home via OSRM, so the
  // path follows streets like Swiggy/Zomato instead of a straight line.
  useEffect(() => {
    let cancelled = false;
    const fetchRoute = async () => {
      try {
        const start = `${hubCoords[1]},${hubCoords[0]}`;
        const end = `${homeCoords[1]},${homeCoords[0]}`;
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`
        );
        const data = await res.json();
        if (cancelled) return;
        if (data.routes?.length) {
          setRoadRoute(data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]));
        } else {
          setRoadRoute([hubCoords, homeCoords]); // straight fallback
        }
      } catch (e) {
        if (!cancelled) setRoadRoute([hubCoords, homeCoords]); // straight fallback
      }
    };
    fetchRoute();
    return () => { cancelled = true; };
  }, [hubCoords, homeCoords]);

  // Draw / update the route polyline along the roads and fit the map to it.
  useEffect(() => {
    const map = miniMapInstanceRef.current;
    if (!map || !window.L || !mapsLoaded) return;
    const L = window.L;

    if (roadPolylineRef.current) {
      map.removeLayer(roadPolylineRef.current);
      roadPolylineRef.current = null;
    }
    const line = roadRoute.length >= 2 ? roadRoute : [hubCoords, homeCoords];
    roadPolylineRef.current = L.polyline(line, {
      color: '#0c831f',
      weight: 4,
      opacity: 0.85,
    }).addTo(map);

    // Start on the store; the rider-follow loop keeps the camera centered on the
    // scooter. Users can zoom in/out freely — their chosen zoom is preserved.
    try {
      map.setView(hubCoords, 15);
    } catch (e) {
      console.error('setView failed:', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadRoute, mapsLoaded]);

  // Live rider tracking. The simulator (or a real rider app later) writes a
  // `progress` value to Firestore; the client animates the marker smoothly along
  // the exact road geometry at 60fps (accuracy) and consumes the trail behind it.
  useEffect(() => {
    if (!orderId || !mapsLoaded || roadRoute.length < 2) return;

    const path = roadRoute.map(([lat, lng]) => ({ lat, lng }));
    const from = path[0];
    const to = path[path.length - 1];
    const waypoints = path.slice(1, -1);

    const RIDE_DURATION_MS = 3 * 60 * 1000;

    // Start the stand-in rider feed once per order this session.
    let stopSim = () => {};
    if (!startedSimulations.has(orderId)) {
      startedSimulations.add(orderId);
      stopSim = startRiderSimulation(orderId, from, to, {
        waypoints,
        durationMs: RIDE_DURATION_MS,
        tickMs: 1000,
        rider: {
          riderName: mockRiderData.rider.name,
          riderPhone: mockRiderData.rider.phone,
        },
      });
    }

    // Target progress comes from Firestore; display progress moves toward it at a
    // bounded speed each frame — fast enough to stay responsive to real updates,
    // but capped so the marker can never visually teleport across the map.
    const maxStepPerFrame = (4 / (RIDE_DURATION_MS / 1000)) / 60;
    let targetProgress = 0;
    let displayProgress = 0;
    let raf;

    const animate = () => {
      displayProgress = stepProgressTowards(displayProgress, targetProgress, maxStepPerFrame);

      const { lat, lng, heading, remaining } = computeRoutePosition(roadRoute, displayProgress);

      if (riderMarkerRef.current) {
        riderMarkerRef.current.setLatLng([lat, lng]);
        const el = riderMarkerRef.current.getElement();
        const img = el && el.querySelector('.rider-scooter-img');
        if (img) {
          const facingRight = heading > 0 && heading < 180; // heading east = moving right
          img.style.transform = facingRight ? 'scaleX(1)' : 'scaleX(-1)';
        }
      }
      // Trail consumption: only draw the route still ahead of the rider.
      if (roadPolylineRef.current && remaining.length >= 2) {
        roadPolylineRef.current.setLatLngs(remaining);
      }
      // Follow the rider like Google Maps driver tracking.
      const map = miniMapInstanceRef.current;
      if (map) map.setView([lat, lng], map.getZoom(), { animate: false });

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const unsubscribe = subscribeToRiderLocation(orderId, (data) => {
      if (data && typeof data.progress === 'number') targetProgress = data.progress;
    });

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
      stopSim();
    };
  }, [orderId, mapsLoaded, roadRoute]);

  if (!order) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Order Not Found</h1>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>We couldn't locate the active order you're tracking.</p>
          <Link href="/services/grokly" className={styles.shopBtn} style={{ padding: '12px 24px', textDecoration: 'none' }}>
            Back to Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Calculate dynamic progress bar percentage
  const getProgressPercentage = () => {
    switch (order.status) {
      case 'PLACED': return 20;
      case 'CONFIRMED': return 40;
      case 'PACKING': return 60;
      case 'OUT_FOR_DELIVERY': return 80;
      case 'DELIVERED': return 100;
      default: return 80;
    }
  };

  return (
    <div className={styles.container}>
      
      {/* 1. Header Area (Recreating the exact layout from input_file_6.png) */}
      <div className={styles.pageHeader}>
        <div className={styles.headerInfoWrapper}>
          <div>
            <span className={styles.orderLabel}>ORDER TRACKING</span>
            <h1 className={styles.orderIdTitle}>#{order.id.split('-')[1] || order.id || '1781081083395'}</h1>
          </div>
          <div className={styles.deliveredBadge}>
            <span className={styles.greenPulseDot}></span>
            {order.status === 'DELIVERED' ? 'DELIVERED' : order.status.replace(/_/g, ' ')}
          </div>
        </div>

        {/* Progress Timeline bar */}
        <div className={styles.progressBarBg}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className={styles.progressLabels}>
          <span>Order Placed</span>
          <span>Arriving Soon</span>
        </div>
      </div>

      {/* 2. Hero Estimated Arrival Card (Matching the forest-green look from input_file_6.png) */}
      <div className={styles.heroRiderCard}>
        <div className={styles.heroRiderHeader}>
          <div className={styles.riderMainInfo}>
            <span className={styles.arrivalHeading}>ESTIMATED ARRIVAL</span>
            <div className={styles.etaDisplay}>
              {eta} <span className={styles.etaMinLabel}>min</span>
            </div>
            <p className={styles.arrivalSubtext}>2.3 km away • Live tracking</p>
            <div className={styles.vehiclePill}>
              <BikeIcon className={styles.vehiclePillIcon} />
              <span>{mockRiderData.rider.vehicleNumber}</span>
            </div>
          </div>

          <div className={styles.riderProfileBox}>
            <div className={styles.initialsAvatar}>
              RK
            </div>
            <strong className={styles.riderName}>{mockRiderData.rider.name}</strong>
            <span className={styles.riderStats} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <StarIcon style={{ color: '#eab308' }} /> {mockRiderData.rider.rating} • 350+ trips
            </span>
          </div>
        </div>
      </div>

      {/* Call & Message Action Buttons Row */}
      <div className={styles.actionButtonsRow}>
        <a href={`tel:${mockRiderData.rider.phone}`} className={styles.callRiderBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          Call Partner
        </a>
        <button onClick={() => setChatOpen(!chatOpen)} className={styles.msgRiderBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Message
        </button>
      </div>

      {/* Chat window micro-interaction */}
      {chatOpen && (
        <div className={styles.chatOverlay}>
          <div className={styles.chatHeader}>
            <span className={styles.chatTitle}>Chat with {mockRiderData.rider.name}</span>
            <button onClick={() => setChatOpen(false)} className={styles.chatClose}>&times;</button>
          </div>
          <div className={styles.chatQuickReplies}>
            <button onClick={() => setChatText('Leave at the door')} className={styles.quickReplyBtn}>
              <DoorIcon style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Leave at door
            </button>
            <button onClick={() => setChatText('Call when nearby')} className={styles.quickReplyBtn}>
              <PhoneIcon style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Call when nearby
            </button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setChatSent(true); setChatText(''); setTimeout(() => setChatSent(false), 3000); }} className={styles.chatInputWrapper}>
            <input type="text" placeholder="Type a message..." value={chatText} onChange={(e) => setChatText(e.target.value)} className={styles.chatInput} />
            <button type="submit" className={styles.chatSendBtn}>Send</button>
          </form>
          {chatSent && (
            <div className={styles.chatSent} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckIcon className={styles.inlineCheck} /> Sent to partner!
            </div>
          )}
        </div>
      )}

      {/* 3. Live Tracking Map Card - Realistic Leaflet Map (Matching input_file_12.png perfectly) */}
      <div className={styles.liveMapTrackingCard}>
        <div className={styles.mapLabelRow}>
          <div>
            <span className={styles.smallSectionLabel}>LIVE TRACKING</span>
            <h2 className={styles.mapStatusHeading}>Packing your order</h2>
          </div>
          <span className={styles.mapLiveIndicator}>
            <span className={styles.greenPulseDotMini}></span>
            LIVE
          </span>
        </div>

        {/* 100% Reliable Leaflet OpenStreetMap Container */}
        <div className={styles.mapVisualContainer}>
          {!mapsLoaded && (
            <div className={styles.miniMapSkeleton}>
              <div className={styles.spinner}></div>
              <p style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>Loading Map Tiles...</p>
            </div>
          )}
          {/* Key-based remounting forces DOM node freshness to eliminate container-init crashes */}
          <div 
            key={mapResetKey}
            ref={miniMapRef} 
            style={{ width: '100%', height: '100%', borderRadius: '20px', zIndex: 1 }} 
          />
        </div>
        
        {/* Footnote timeline tracker from screenshot - fully emoji free with CSS bullets */}
        <div className={styles.dotRoadTracker}>
          <span className={styles.dotLabel}>
            <span className={styles.bulletNodeStore}></span>
            Store
          </span>
          <span className={styles.dotLine}>- - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
          <span className={styles.dotLabel}>
            Your door
            <span className={styles.bulletNodeHome}></span>
          </span>
        </div>
      </div>

      {/* 4. Side-by-side Action Cards (Forgot to add? & Pay ₹21) */}
      <div className={styles.parallelGrid}>
        
        {/* Left Card: Forgot to add? */}
        <div className={styles.forgotCard}>
          <div className={styles.forgotBody}>
            <div className={styles.forgotHeader}>
              <div className={styles.bagIcon}>
                <BagIcon className={styles.productionVectorIcon} />
              </div>
              <div className={styles.forgotText}>
                <h2>Forgot to add?</h2>
                <p>Add items while order is being packed</p>
              </div>
            </div>
          </div>

          <Link href="/services/grokly" className={styles.addItemsBtn}>
            Add Items • {formatTimer(timer)}
          </Link>
        </div>

        {/* Right Card: Pay ₹21 */}
        <div className={styles.paymentCard}>
          <div className={styles.paymentBody}>
            <div className={styles.forgotHeader}>
              <div className={styles.cardIcon}>
                <CardIcon className={styles.productionVectorIcon} />
              </div>
              <div className={styles.paymentText}>
                <h2>Pay ₹{order.total}</h2>
                <p>Pay before or on delivery</p>
              </div>
            </div>
          </div>
          <div className={styles.payActionRow}>
            {isPaid ? (
              <span className={styles.paySuccessState}>
                <CheckIcon className={styles.inlineCheck} />
                Paid Online
              </span>
            ) : (
              <button 
                className={styles.payOnlineBtn} 
                onClick={handlePayOnline}
                disabled={isPaying}
              >
                {isPaying ? 'Processing...' : 'Pay Online'}
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 5. Clickable Tabbed Layout: Delivery Status & Order Summary Card (Side-by-side clickable buttons) */}
      <div className={styles.unifiedTabbedCard}>
        <div className={styles.tabButtonsContainer}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'delivery' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('delivery')}
          >
            Delivery Status
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'summary' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Order Summary
          </button>
        </div>

        {/* Render active Tab Content */}
        {activeTab === 'delivery' ? (
          /* "Delivery Status" Tab Contents (Matching input_file_9.png exactly) */
          <div className={styles.progressContainer}>
            
            <div className={`${styles.progressStep} ${order.status !== 'PLACED' ? styles.progressStepCompleted : styles.progressStepPending}`}>
              <div className={styles.progressBullet}>
                <CheckIcon className={styles.timelineCheckSvg} />
              </div>
              <div className={styles.progressContent}>
                <div className={styles.stepTitleRow}>
                  <p className={styles.progressTitle}>Order Confirmed</p>
                  <span className={styles.stepTime}>10:30 AM</span>
                </div>
                <p className={styles.progressDesc}>Received & confirmed by merchant store.</p>
              </div>
            </div>

            <div className={`${styles.progressStep} ${order.status !== 'PLACED' && order.status !== 'CONFIRMED' ? styles.progressStepCompleted : styles.progressStepPending}`}>
              <div className={styles.progressBullet}>
                <CheckIcon className={styles.timelineCheckSvg} />
              </div>
              <div className={styles.progressContent}>
                <div className={styles.stepTitleRow}>
                  <p className={styles.progressTitle}>Rider Assigned</p>
                  <span className={styles.stepTime}>10:32 AM</span>
                </div>
                <p className={styles.progressDesc}>{mockRiderData.rider.name} accepted your delivery request.</p>
              </div>
            </div>

            <div className={`${styles.progressStep} ${order.status !== 'PLACED' && order.status !== 'CONFIRMED' && order.status !== 'PACKING' ? styles.progressStepCompleted : styles.progressStepPending}`}>
              <div className={styles.progressBullet}>
                <CheckIcon className={styles.timelineCheckSvg} />
              </div>
              <div className={styles.progressContent}>
                <div className={styles.stepTitleRow}>
                  <p className={styles.progressTitle}>Picked Up</p>
                  <span className={styles.stepTime}>10:45 AM</span>
                </div>
                <p className={styles.progressDesc}>Package inspected & verified at Whitefield hub.</p>
              </div>
            </div>

            <div className={`${styles.progressStep} ${order.status === 'OUT_FOR_DELIVERY' ? styles.progressStepActive : order.status === 'DELIVERED' ? styles.progressStepCompleted : styles.progressStepPending}`}>
              <div className={styles.progressBullet}>
                <CheckIcon className={styles.timelineCheckSvg} />
              </div>
              <div className={styles.progressContent}>
                <div className={styles.stepTitleRow}>
                  <p className={styles.progressTitle}>Out for Delivery</p>
                  <span className={styles.stepTime}>10:52 AM</span>
                </div>
                <p className={styles.progressDesc}>Rider checked-out and navigating on-route.</p>
              </div>
            </div>

            <div className={`${styles.progressStep} ${order.status === 'DELIVERED' ? styles.progressStepCompleted : styles.progressStepActive}`}>
              <div className={styles.progressBulletActive}>
                <span className={styles.activePulsingCenterDot}></span>
              </div>
              <div className={styles.progressContent}>
                <div className={styles.stepTitleRow}>
                  <p className={styles.progressTitle} style={{ color: '#0c831f' }}>Arriving Soon</p>
                  <span className={styles.arrivingLabelTag}>In ~{eta} min</span>
                </div>
                <p className={styles.progressDesc}>Rider is on the way — will hand over at your door.</p>
              </div>
            </div>

          </div>
        ) : (
          /* "Order Summary" Tab Contents (Matching input_file_10.png exactly) */
          <div className={styles.orderSummaryTabContent}>
            <div className={styles.summaryItemRow}>
              <span className={styles.summaryLabelWithIcon}>
                <CartIcon className={styles.summaryRowIcon} />
                Subtotal
              </span>
              <strong>₹{order.subtotal}</strong>
            </div>
            <div className={styles.summaryItemRow}>
              <span className={styles.summaryLabelWithIcon}>
                <BikeIcon className={styles.summaryRowIcon} />
                Delivery Partner Fee
              </span>
              <strong>₹{order.deliveryFee}</strong>
            </div>
            <div className={styles.summaryItemRow}>
              <span className={styles.summaryLabelWithIcon}>
                <LockIcon className={styles.summaryRowIcon} />
                Platform Fee
              </span>
              <strong>₹2</strong>
            </div>
            
            <div className={styles.summaryTotalPaidRow}>
              <span className={styles.totalPaidTextLabel}>Total Paid</span>
              <div className={styles.totalPaidBadgeWrapper}>
                <strong className={styles.totalAmountValue}>₹{order.total}</strong>
                <span className={styles.paidCheckBadge} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  PAID <CheckIcon />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Delivery Address Card (Matching input_file_8.png) */}
      <div className={styles.metaLabelHeader}>DELIVERY ADDRESS</div>
      <div className={styles.metaCardWrapper}>
        <div className={styles.metaIconPink}>
          <MapPinIcon className={styles.pinkPinIcon} />
        </div>
        <div className={styles.metaCardContent}>
          <strong>{order.customerName || 'Accesco Customer'}</strong>
          <p>{order.address || 'Bengaluru'}</p>
          <p className={styles.metaSubtext}>{order.phone || '+91 9022217467'}</p>
        </div>
      </div>

      {/* 7. Payment Details Card (Matching input_file_8.png) */}
      <div className={styles.metaLabelHeader}>PAYMENT DETAILS</div>
      <div className={styles.metaCardWrapper}>
        <div className={styles.metaIconBlue}>
          <CardIcon className={styles.blueCardIcon} />
        </div>
        <div className={styles.metaCardContent}>
          <strong>{order.paymentMethod || 'UPI'}</strong>
          <p className={styles.metaSubtext}>TXN{order.id.split('-')[1] || '1781081083395'}</p>
        </div>
        <span className={styles.successBadge}>SUCCESS</span>
      </div>

      {/* 8. Bottom Action Buttons (Matching input_file_8.png) */}
      <div className={styles.footerActionsRow}>
        <Link href="/services/grokly/profile" className={styles.footerProfileBtn}>My Orders</Link>
        <Link href="/services/grokly" className={styles.footerShopBtn}>Continue Shopping</Link>
      </div>

    </div>
  );
}

export default function GroklyTracking() {
  return (
    <Suspense fallback={<div className={styles.container}><p style={{ textAlign: 'center', padding: '60px' }}>Loading real-time tracking dashboard...</p></div>}>
      <GroklyTrackingContent />
    </Suspense>
  );
}