'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGrokly } from '../contexts/GroklyContext';
import styles from './tracking.module.css';
import Link from 'next/link';
import { mockRiderData } from '@/lib/mockRiderData';

function GroklyTrackingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const eta = searchParams.get('eta') || '11 mins';
  const { orders } = useGrokly();
  
  const order = orders.find(o => o.id === orderId);

  // States for interactive custom features
  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState('');
  const [chatSent, setChatSent] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  
  // Dynamic countdown timer for "Add more items" block
  const [timer, setTimer] = useState(81); 

  // Maps Refs
  const miniMapRef = useRef(null);
  const miniMapInstanceRef = useRef(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  // Countdown clock effect
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
      if (!miniMapRef.current || miniMapInstanceRef.current) return;

      const L = window.L;
      if (!L) return;

      const hubCoords = [12.9698, 77.7499]; // Whitefield Hub
      const homeCoords = [12.9592, 77.7610]; // Home
      const center = [12.9645, 77.7554];

      const miniMap = L.map(miniMapRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        doubleClickZoom: false,
        boxZoom: false
      }).setView(center, 13);

      miniMapInstanceRef.current = miniMap;

      // CartoDB Positron elegant minimal desaturated map layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(miniMap);

      // Define styled marker icons matching the brand (Grokly Green)
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

      // Render delivery track line
      L.polyline([hubCoords, homeCoords], {
        color: '#0c831f',
        weight: 3,
        opacity: 0.6,
        dashArray: '4, 6'
      }).addTo(miniMap);

      L.marker(hubCoords, { icon: greenDotIcon }).addTo(miniMap);
      L.marker(homeCoords, { icon: orangeDotIcon }).addTo(miniMap);

      setMapsLoaded(true);
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
  }, []);

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

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.orderInfo}>
          <h1>Track Order #{order.id.split('-')[1] || order.id}</h1>
          <p>Estimated Arrival: <strong>{eta}</strong></p>
        </div>
        <div className={styles.statusBadge}>
          {order.status.replace(/_/g, ' ')}
        </div>
      </header>

      {/* Premium Hero Rider Card */}
      <div className={styles.heroRiderCard}>
        <div className={styles.heroRiderHeader}>
          <div className={styles.riderMainInfo}>
            <div className={styles.riderAvatarWrapper}>
              <img
                src={mockRiderData.rider.profileImage}
                alt={mockRiderData.rider.name}
                className={styles.riderAvatar}
              />
              <span className={styles.riderOnlineBadge}></span>
            </div>
            <div className={styles.riderMeta}>
              <h2 className={styles.riderName}>
                {mockRiderData.rider.name}
              </h2>
              <div className={styles.riderRating}>
                ⭐ {mockRiderData.rider.rating} • {mockRiderData.rider.deliveries.trim()}
              </div>
              <div className={styles.vehicleBadge}>
                <span>🏍️ {mockRiderData.rider.vehicleType}</span>
                <span className={styles.vehicleNo}>{mockRiderData.rider.vehicleNumber}</span>
              </div>
            </div>
          </div>

          <div className={styles.etaContainer}>
            <div className={styles.etaTime}>{eta}</div>
            <div className={styles.etaLabel}>Estimated Arrival</div>
            <div className={styles.distanceRemaining}>2.3 km away</div>
          </div>
        </div>

        {/* Action Row */}
        <div className={styles.heroRiderActions}>
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
            {chatOpen ? 'Hide Chat' : 'Message Partner'}
          </button>
        </div>

        {/* Micro-Interaction: Quick Chat Overlay */}
        {chatOpen && (
          <div className={styles.chatOverlay}>
            <div className={styles.chatHeader}>
              <span className={styles.chatTitle}>Chat with {mockRiderData.rider.name}</span>
              <button onClick={() => setChatOpen(false)} className={styles.chatClose}>&times;</button>
            </div>
            
            <div className={styles.chatQuickReplies}>
              <button onClick={() => handleQuickReply('Leave at the door')} className={styles.quickReplyBtn}>🚪 Leave at door</button>
              <button onClick={() => handleQuickReply('Call when nearby')} className={styles.quickReplyBtn}>📞 Call when nearby</button>
              <button onClick={() => handleQuickReply('Drop at guard gate')} className={styles.quickReplyBtn}>🛡️ Drop with guard</button>
            </div>

            <form onSubmit={handleSendMessage} className={styles.chatInputWrapper}>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                className={styles.chatInput}
              />
              <button type="submit" className={styles.chatSendBtn}>Send</button>
            </form>

            {chatSent && (
              <div className={styles.sentSuccess}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Message sent to delivery partner!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Requirement 1: Map and Arriving ETA card full-width at the top (Grokly Green styled) */}
      <div className={styles.topCard}>
        <div className={styles.etaCol}>
          <span className={styles.packingStatus}>Packing your order</span>
          <h1 className={styles.arrivingEta}>
            Arriving in <br />
            <span>{eta}</span>
          </h1>
        </div>
        
        <div className={styles.miniMapCol}>
          {!mapsLoaded && <div className={styles.miniMapSkeleton}></div>}
          <div ref={miniMapRef} style={{ width: '100%', height: '100%', borderRadius: '20px', zIndex: 1 }} />
          <button 
            className={styles.expandBtn}
            onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}
            title="Expand Map"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Requirement 2: Forgot to add something and Pay online parallel to each other and under the map */}
      <div className={styles.parallelGrid}>
        
        {/* Forgot to add something? Card */}
        <div className={styles.forgotCard}>
          <div className={styles.forgotBody}>
            <div className={styles.forgotHeader}>
              <div className={styles.bagIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0c831f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                  <line x1="12" y1="13" x2="12" y2="19"></line>
                  <line x1="9" y1="16" x2="15" y2="16"></line>
                </svg>
              </div>
              <div className={styles.forgotText}>
                <h2>Forgot to add something?</h2>
                <p>Add more items while your order is being packed</p>
              </div>
            </div>
          </div>

          <Link href="/services/grokly" className={styles.addItemsBtn}>
            Add more items
            <span className={styles.countdownPill}>
              {formatTimer(timer)}
            </span>
          </Link>
        </div>

        {/* Payment Card */}
        <div className={styles.paymentCard}>
          <div className={styles.paymentBody}>
            <div className={styles.forgotHeader}>
              <div className={styles.cardIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0c831f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                </svg>
              </div>
              <div className={styles.paymentText}>
                <h2>Pay ₹{order.total} before or on delivery</h2>
                <p>Please keep change handy or avoid the hassle by paying online</p>
              </div>
            </div>
          </div>
          <div className={styles.payActionRow}>
            {isPaid ? (
              <span className={styles.paySuccessState}>✅ Paid Online successfully!</span>
            ) : (
              <button 
                className={styles.payOnlineBtn} 
                onClick={handlePayOnline}
                disabled={isPaying}
              >
                {isPaying ? 'Processing...' : 'Pay online'}
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Requirement 3: Last keep the live delivery status and order summary parallel */}
      <div className={styles.grid}>
        
        {/* Left Column: Live Delivery Status */}
        <div className={styles.detailsColumn}>
          
          <div className={styles.deliveryStatusCard}>
            <h2>Live Delivery Status</h2>
            <div className={styles.progressContainer}>
              
              <div className={`${styles.progressStep} ${order.status !== 'PLACED' ? styles.progressStepCompleted : styles.progressStepPending}`}>
                <div className={styles.progressBullet}>✓</div>
                <div className={styles.progressContent}>
                  <p className={styles.progressTitle}>Order Confirmed</p>
                  <p className={styles.progressTime}>10:30 AM</p>
                  <p className={styles.progressDesc}>Your order was received and confirmed by the merchant store.</p>
                </div>
              </div>

              <div className={`${styles.progressStep} ${order.status !== 'PLACED' && order.status !== 'CONFIRMED' ? styles.progressStepCompleted : styles.progressStepPending}`}>
                <div className={styles.progressBullet}>✓</div>
                <div className={styles.progressContent}>
                  <p className={styles.progressTitle}>Rider Assigned</p>
                  <p className={styles.progressTime}>10:32 AM</p>
                  <p className={styles.progressDesc}>{mockRiderData.rider.name} accepted your delivery slot request.</p>
                </div>
              </div>

              <div className={`${styles.progressStep} ${order.status !== 'PLACED' && order.status !== 'CONFIRMED' && order.status !== 'PACKING' ? styles.progressStepCompleted : styles.progressStepPending}`}>
                <div className={styles.progressBullet}>✓</div>
                <div className={styles.progressContent}>
                  <p className={styles.progressTitle}>Picked Up & Prepared</p>
                  <p className={styles.progressTime}>10:45 AM</p>
                  <p className={styles.progressDesc}>Items successfully inspected, packaged, and verified at the Whitefield hub.</p>
                </div>
              </div>

              <div className={`${styles.progressStep} ${order.status === 'OUT_FOR_DELIVERY' ? styles.progressStepActive : order.status === 'DELIVERED' ? styles.progressStepCompleted : styles.progressStepPending}`}>
                <div className={styles.progressBullet}>{order.status === 'OUT_FOR_DELIVERY' ? '⚡' : '✓'}</div>
                <div className={styles.progressContent}>
                  <p className={styles.progressTitle}>Out For Delivery</p>
                  <p className={styles.progressTime}>10:52 AM</p>
                  <p className={styles.progressDesc}>The rider has checked-out with your order and is navigating on-route.</p>
                </div>
              </div>

              <div className={`${styles.progressStep} ${order.status === 'DELIVERED' ? styles.progressStepActive : styles.progressStepPending}`}>
                <div className={styles.progressBullet}>🎁</div>
                <div className={styles.progressContent}>
                  <p className={styles.progressTitle}>Arrived & Delivered</p>
                  <p className={styles.progressTime}>Pending Arrival</p>
                  <p className={styles.progressDesc}>Rider handovers package directly to you at the door.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className={styles.detailsColumn}>
          <div className={styles.orderItems}>
            <h2>Order Summary</h2>
            <div className={styles.itemsList}>
              {order.items.map(item => (
                <div key={item.id} className={styles.item}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <hr className={styles.divider} />
            <div className={styles.billRow}>
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className={styles.billRow}>
              <span>Delivery Partner Fee</span>
              <span>₹{order.deliveryFee}</span>
            </div>
            <div className={styles.total}>
              <span>Total Paid</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Full-width lower metadata sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: '20px' }}>
        <div className={styles.detailSection}>
          <h2>Delivery Address</h2>
          <div className={styles.detailCard}>
            <div className={styles.iconBox}><i className="ri-map-pin-2-fill"></i></div>
            <div>
              <strong>{order.customerName}</strong>
              <p>{order.address}</p>
              <p className={styles.phone}>{order.phone}</p>
            </div>
          </div>
        </div>

        <div className={styles.detailSection}>
          <h2>Payment Details</h2>
          <div className={styles.detailCard}>
            <div className={styles.iconBox}><i className="ri-bank-card-fill"></i></div>
            <div>
              <strong>{order.paymentMethod}</strong>
              <p>Transaction ID: TXN{order.id.split('-')[1] || '789234'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className={styles.actions}>
        <Link href="/services/grokly/profile" className={styles.profileBtn}>Go to My Orders</Link>
        <Link href="/services/grokly" className={styles.shopBtn}>Continue Shopping</Link>
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