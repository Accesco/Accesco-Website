'use client';

import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import styles from './tracking.module.css';
import Link from 'next/link';
import { mockRiderData } from '@/lib/mockRiderData';
import { subscribeToRiderLocation, startRiderSimulation, computeRoutePosition, stepProgressTowards } from '@/lib/riderTrackingService';

// Track which orders already have a running simulation this session, so a
// refresh / strict-mode double-mount doesn't spawn duplicate rider feeds.
const startedSimulations = new Set();

const CheckIcon = ({ className }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
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

const STEPS = [
  { id: 'PLACED', label: 'Order Received', sub: 'Your style selection is being processed' },
  { id: 'CONFIRMED', label: 'Quality Check', sub: 'Ensuring your items meet our standards' },
  { id: 'PACKING', label: 'Premium Packaging', sub: 'Carefully hand-wrapping your order' },
  { id: 'OUT_FOR_DELIVERY', label: 'En Route', sub: 'Our express courier is nearby' },
  { id: 'DELIVERED', label: 'Style Delivered', sub: 'Unbox your new look' }
];

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { orders, updateOrderStatus } = useCart();
  
  const orderId = searchParams.get('id');
  const eta = searchParams.get('eta') || '12';
  
  const orderFromContext = useMemo(() => orders.find(o => o.id === orderId || o.orderId === orderId), [orders, orderId]);
  const [fetchedOrder, setFetchedOrder] = useState(null);

  useEffect(() => {
    if (!orderId || orderFromContext) return;
    fetch(`/api/instastyle/orders?id=${encodeURIComponent(orderId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.order) setFetchedOrder(data.order);
      })
      .catch((err) => console.error('Cloud order fetch failed:', err));
  }, [orderId, orderFromContext]);

  const order = orderFromContext || fetchedOrder;

  const getHomeLatLng = () => {
    if (order?.deliveryLat && order?.deliveryLng) {
      return [order.deliveryLat, order.deliveryLng];
    }
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('userLocation') : null;
      if (raw) {
        const loc = JSON.parse(raw);
        const lat = parseFloat(loc.latitude ?? loc.lat);
        const lng = parseFloat(loc.longitude ?? loc.lng ?? loc.lon);
        if (!Number.isNaN(lat) && !Number.isNaN(lng)) return [lat, lng];
      }
    } catch (e) {
      console.error('Failed to resolve delivery coordinates:', e);
    }
    return [12.9592, 77.7610]; // fallback
  };

  const getHubLatLng = ([homeLat, homeLng]) => {
    const OFFSET = 0.012; // ~1.3 km in latitude
    return [homeLat + OFFSET, homeLng + OFFSET];
  };

  const homeCoords = useMemo(() => getHomeLatLng(), [order?.deliveryLat, order?.deliveryLng]);
  const hubCoords = useMemo(() => getHubLatLng(homeCoords), [homeCoords]);
  const [roadRoute, setRoadRoute] = useState([]);

  const [deliveryProgress, setDeliveryProgress] = useState(0);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState('');
  const [chatSent, setChatSent] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  
  const [activeTab, setActiveTab] = useState('delivery');
  const [timer, setTimer] = useState(48); 

  const miniMapRef = useRef(null);
  const miniMapInstanceRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const roadPolylineRef = useRef(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapResetKey, setMapResetKey] = useState(0);

  useEffect(() => {
    if (!order || order?.status === 'DELIVERED') return;

    const statusClock = setInterval(() => {
      const currentStatus = order?.status;
      const flow = ['PLACED', 'CONFIRMED', 'PACKING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
      const currentIndex = flow.indexOf(currentStatus);
      if (currentIndex < flow.length - 1) {
        updateOrderStatus(orderId, flow[currentIndex + 1]);
      }
    }, 45000);

    return () => clearInterval(statusClock);
  }, [order, orderId, updateOrderStatus]);

  useEffect(() => {
    if (order?.status === 'OUT_FOR_DELIVERY') {
      const animationTimer = setInterval(() => {
        setDeliveryProgress(prev => {
          if (prev >= 100) {
            clearInterval(animationTimer);
            return 100;
          }
          return prev + 0.5;
        });
      }, 500);
      return () => clearInterval(animationTimer);
    }
  }, [order?.status]);

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

  const handlePayOnline = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsPaid(true);
    }, 1500);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (!miniMapRef.current) return;

      if (miniMapInstanceRef.current) {
        miniMapInstanceRef.current.remove();
        miniMapInstanceRef.current = null;
      }

      const L = window.L;
      if (!L) return;

      const center = [
        (hubCoords[0] + homeCoords[0]) / 2,
        (hubCoords[1] + homeCoords[1]) / 2,
      ];

      const miniMap = L.map(miniMapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        doubleClickZoom: true,
        boxZoom: false,
        attributionControl: false
      }).setView(center, 14);

      miniMapInstanceRef.current = miniMap;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20
      }).addTo(miniMap);

      const greenDotIcon = L.divIcon({
        html: `<div style="
          background: #3e211b;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(62,33,27,0.3);
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
          background: #8b5a2b;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(139,90,43,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        "><span style="display:inline-block; width:6px; height:6px; background:#fff; border-radius:50%"></span></div>`,
        className: 'custom-home-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const riderIcon = L.divIcon({
        html: `<img class="rider-scooter-img" src="/images/delivery-rider.png"
                 style="width:38px;height:68px;transition:transform 0.3s ease;" />`,
        className: 'custom-rider-icon',
        iconSize: [38, 68],
        iconAnchor: [19, 60],
      });

      L.marker(hubCoords, { icon: greenDotIcon }).addTo(miniMap);
      L.marker(homeCoords, { icon: orangeDotIcon }).addTo(miniMap);

      riderMarkerRef.current = L.marker(hubCoords, { icon: riderIcon }).addTo(miniMap);

      setMapsLoaded(true);

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
  }, [mapResetKey, order?.deliveryLat, order?.deliveryLng]);

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
          setRoadRoute([hubCoords, homeCoords]);
        }
      } catch (e) {
        if (!cancelled) setRoadRoute([hubCoords, homeCoords]);
      }
    };
    fetchRoute();
    return () => { cancelled = true; };
  }, [hubCoords, homeCoords]);

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
      color: '#3e211b',
      weight: 4,
      opacity: 0.85,
    }).addTo(map);

    try {
      map.setView(hubCoords, 15);
    } catch (e) {
      console.error('setView failed:', e);
    }
  }, [roadRoute, mapsLoaded]);

  useEffect(() => {
    if (!orderId || !mapsLoaded || roadRoute.length < 2) return;

    const path = roadRoute.map(([lat, lng]) => ({ lat, lng }));
    const from = path[0];
    const to = path[path.length - 1];
    const waypoints = path.slice(1, -1);

    const RIDE_DURATION_MS = 3 * 60 * 1000;

    let stopSim = () => {};
    if (!startedSimulations.has(orderId)) {
      startedSimulations.add(orderId);
      stopSim = startRiderSimulation(orderId, from, to, {
        waypoints,
        durationMs: RIDE_DURATION_MS,
        tickMs: 1000,
        rider: {
          riderName: mockRiderData?.rider?.name,
          riderPhone: mockRiderData?.rider?.phone,
        },
      });
    }

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
          const facingRight = heading > 0 && heading < 180;
          img.style.transform = facingRight ? 'scaleX(1)' : 'scaleX(-1)';
        }
      }
      if (roadPolylineRef.current && remaining.length >= 2) {
        roadPolylineRef.current.setLatLngs(remaining);
      }
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
        <div style={{ padding: '40px', textAlign: 'center' }}>
          Loading order...
        </div>
      </div>
    );
  }

  const currentStepIndex = Math.max(
    STEPS.findIndex(step => step.id === order?.status),
    0
  );

  const progressPercentage =
    currentStepIndex === 0 ? 10 :
    currentStepIndex === 1 ? 30 :
    currentStepIndex === 2 ? 55 :
    currentStepIndex === 3 ? 85 :
    100;

  const riderName = mockRiderData?.rider?.name || 'John S.';
  const riderPhone = mockRiderData?.rider?.phone || '+919876543210';

  const orderTotal = order?.total || 0;
  const deliveryFee = order?.deliveryFee || 19;

  const transactionId =
    order?.id?.split('-')?.[1] ||
    order?.id ||
    '1781081083395';

  return (
    <div className={styles.container}>
      
      {/* 1. Header Area */}
      <div className={styles.pageHeader}>
        <div className={styles.headerInfoWrapper}>
          <div>
            <span className={styles.orderLabel}>ORDER TRACKING</span>
            <h1 className={styles.orderIdTitle}>#{transactionId}</h1>
          </div>
          <div className={styles.deliveredBadge}>
            <span className={styles.greenPulseDot}></span>
            {order?.status === 'DELIVERED' ? 'DELIVERED' : order?.status?.replace(/_/g, ' ')}
          </div>
        </div>

        {/* Progress Timeline bar */}
        <div className={styles.progressBarBg}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className={styles.progressLabels}>
          <span>Order Placed</span>
          <span>Arriving Soon</span>
        </div>
      </div>

      {/* 2. Hero Estimated Arrival Card */}
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
              <span>PREMIUM EXPRESS VAN</span>
            </div>
          </div>

          <div className={styles.riderProfileBox}>
            <div className={styles.initialsAvatar}>
              JS
            </div>
            <strong className={styles.riderName}>{riderName}</strong>
            <span className={styles.riderStats} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" style={{ color: '#D4A017' }} aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              4.9 • Premium Courier
            </span>
          </div>
        </div>
      </div>

      {/* Call & Message Action Buttons Row */}
      <div className={styles.actionButtonsRow}>
        <a href={`tel:${riderPhone}`} className={styles.callRiderBtn}>
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
            <span className={styles.chatTitle}>Chat with {riderName}</span>
            <button onClick={() => setChatOpen(false)} className={styles.chatClose}>&times;</button>
          </div>
          <div className={styles.chatQuickReplies}>
            <button onClick={() => setChatText('Leave at the door')} className={styles.quickReplyBtn}>Leave at door</button>
            <button onClick={() => setChatText('Call when nearby')} className={styles.quickReplyBtn}>Call when nearby</button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setChatSent(true); setChatText(''); setTimeout(() => setChatSent(false), 3000); }} className={styles.chatInputWrapper}>
            <input type="text" placeholder="Type a message..." value={chatText} onChange={(e) => setChatText(e.target.value)} className={styles.chatInput} />
            <button type="submit" className={styles.chatSendBtn}>Send</button>
          </form>
          {chatSent && (
            <div className={styles.chatSent} style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Sent to partner!
            </div>
          )}
        </div>
      )}

      {/* 3. Live Tracking Map Card */}
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

        <div className={styles.mapVisualContainer}>
          {!mapsLoaded && (
            <div className={styles.miniMapSkeleton}>
              <div className={styles.spinner}></div>
              <p style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>Loading Map Tiles...</p>
            </div>
          )}
          <div 
            key={mapResetKey}
            ref={miniMapRef} 
            style={{ width: '100%', height: '100%', borderRadius: '20px', zIndex: 1 }} 
          />
        </div>
        
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

      {/* 4. Side-by-side Action Cards */}
      <div className={styles.parallelGrid}>
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

          <Link href="/services/instastyle" className={styles.addItemsBtn}>
            Add Items • {formatTimer(timer)}
          </Link>
        </div>

        <div className={styles.paymentCard}>
          <div className={styles.paymentBody}>
            <div className={styles.forgotHeader}>
              <div className={styles.cardIcon}>
                <CardIcon className={styles.productionVectorIcon} />
              </div>
              <div className={styles.paymentText}>
                <h2>Pay ₹{orderTotal.toLocaleString()}</h2>
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

      {/* 5. Clickable Tabbed Layout: Delivery Status & Order Summary Card */}
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

        {activeTab === 'delivery' ? (
          <div className={styles.progressContainer}>
            {STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;
              
              return (
                <div 
                  key={step.id} 
                  className={`${styles.progressStep} ${isCompleted ? styles.progressStepCompleted : isActive ? styles.progressStepActive : styles.progressStepPending}`}
                >
                  <div className={isActive ? styles.progressBulletActive : styles.progressBullet}>
                    {isCompleted ? (
                      <CheckIcon className={styles.timelineCheckSvg} />
                    ) : isActive ? (
                      <span className={styles.activePulsingCenterDot}></span>
                    ) : null}
                  </div>
                  <div className={styles.progressContent}>
                    <div className={styles.stepTitleRow}>
                      <p className={styles.progressTitle}>{step.label}</p>
                      {isActive && <span className={styles.arrivingLabelTag}>In ~{eta} min</span>}
                    </div>
                    <p className={styles.progressDesc}>{step.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.orderSummaryTabContent}>
            {order?.items && order?.items?.length > 0 ? (
              order?.items?.map(item => (
                <div key={item.id} className={styles.summaryItemRow}>
                  <span className={styles.summaryLabelWithIcon}>
                    <CartIcon className={styles.summaryRowIcon} />
                    {item.name} x {item.quantity || 1}
                  </span>
                  <strong>₹{((item.price || item.discountedPrice || 0) * (item.quantity || 1)).toLocaleString()}</strong>
                </div>
              ))
            ) : (
              <div className={styles.summaryItemRow}>
                <span className={styles.summaryLabelWithIcon}>
                  <CartIcon className={styles.summaryRowIcon} />
                  Selection Items
                </span>
                <strong>₹{orderTotal.toLocaleString()}</strong>
              </div>
            )}
            
            <div className={styles.summaryItemRow}>
              <span className={styles.summaryLabelWithIcon}>
                <BikeIcon className={styles.summaryRowIcon} />
                Premium Cargo Courier Fee
              </span>
              <strong>₹{deliveryFee.toLocaleString()}</strong>
            </div>
            
            <div className={styles.summaryItemRow}>
              <span className={styles.summaryLabelWithIcon}>
                <LockIcon className={styles.summaryRowIcon} />
                Insurance & Handling Fee
              </span>
              <strong>₹2</strong>
            </div>
            
            <div className={styles.summaryTotalPaidRow}>
              <span className={styles.totalPaidTextLabel}>Total Value</span>
              <div className={styles.totalPaidBadgeWrapper}>
                <strong className={styles.totalAmountValue}>₹{orderTotal.toLocaleString()}</strong>
                <span className={styles.paidCheckBadge}>
                  PAID
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', display: 'inline-block', verticalAlign: 'middle' }} aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Delivery Address Card */}
      <div className={styles.metaLabelHeader}>DELIVERY ADDRESS</div>
      <div className={styles.metaCardWrapper}>
        <div className={styles.metaIconPink}>
          <MapPinIcon className={styles.pinkPinIcon} />
        </div>
        <div className={styles.metaCardContent}>
          <strong>{order?.customerName || order?.address?.fullName || 'Premium Patron'}</strong>
          <p>{order?.address?.city || 'Bengaluru'}</p>
          <p className={styles.metaSubtext}>{order?.address?.addressLine1 || order?.address?.street || 'Standard Selection Location'}</p>
        </div>
      </div>

      {/* 7. Payment Details Card */}
      <div className={styles.metaLabelHeader}>PAYMENT DETAILS</div>
      <div className={styles.metaCardWrapper}>
        <div className={styles.metaIconBlue}>
          <CardIcon className={styles.blueCardIcon} />
        </div>
        <div className={styles.metaCardContent}>
          <strong>{order?.paymentMethod?.toUpperCase() || 'UPI / SECURED LINK'}</strong>
          <p className={styles.metaSubtext}>TXN{transactionId}</p>
        </div>
        <span className={styles.successBadge}>SUCCESS</span>
      </div>

      {/* 8. Bottom Action Buttons */}
      <div className={styles.footerActionsRow}>
        <Link href="/services/instastyle" className={styles.footerProfileBtn}>My selection</Link>
        <Link href="/services/instastyle" className={styles.footerShopBtn}>Explore More Styles</Link>
      </div>

    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.card}>
          <p style={{ textAlign: 'center' }}>Loading your order...</p>
        </div>
      </div>
    }>
      <OrderTrackingContent />
    </Suspense>
  );
}