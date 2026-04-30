'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import styles from './tracking.module.css';

const STEPS = [
  { id: 'PLACED', label: 'Order Received', sub: 'Your style selection is being processed' },
  { id: 'CONFIRMED', label: 'Quality Check', sub: 'Ensuring your items meet our standards' },
  { id: 'PACKING', label: 'Premium Packaging', sub: 'Carefully hand-wrapping your order' },
  { id: 'OUT_FOR_DELIVERY', label: 'En Route', sub: 'Our express courier is nearby' },
  { id: 'DELIVERED', label: 'Style Delivered', sub: 'Unbox your new look' }
];

export default function OrderTrackingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { orders, updateOrderStatus } = useCart();
  const orderId = searchParams.get('id');
  
  const order = useMemo(() => orders.find(o => o.id === orderId), [orders, orderId]);
  const [countdown, setCountdown] = useState(20);
  const [deliveryProgress, setDeliveryProgress] = useState(0);

  useEffect(() => {
    if (!order || order.status === 'DELIVERED') return;

    const timer = setInterval(() => {
      const currentStatus = order.status;
      const flow = ['PLACED', 'CONFIRMED', 'PACKING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
      const currentIndex = flow.indexOf(currentStatus);
      if (currentIndex < flow.length - 1) {
        updateOrderStatus(orderId, flow[currentIndex + 1]);
      }
    }, 25000);

    return () => clearInterval(timer);
  }, [order, orderId, updateOrderStatus]);

  // Smooth delivery animation logic
  useEffect(() => {
    if (order?.status === 'OUT_FOR_DELIVERY') {
      const animationTimer = setInterval(() => {
        setDeliveryProgress(prev => {
          if (prev >= 100) {
            clearInterval(animationTimer);
            return 100;
          }
          return prev + 1; // 100 steps
        });
      }, 250); // Takes 25 seconds to complete
      return () => clearInterval(animationTimer);
    }
  }, [order?.status]);

  useEffect(() => {
    if (countdown <= 1) return;
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 60000);
    return () => clearInterval(timer);
  }, [countdown]);

  if (!order) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 style={{ textAlign: 'center' }}>Selection Not Found</h2>
          <button className={styles.backBtn} onClick={() => router.push('/services/instastyle')}>
            Return to Gallery
          </button>
        </div>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex(s => s.id === order.status);
  const progressPercentage = ((currentStepIndex + 1) / STEPS.length) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.etaTitle}>Scheduled Arrival</h2>
          <p className={styles.etaValue}>{order.status === 'DELIVERED' ? 'Arrived' : `${countdown} mins`}</p>
          <p className={styles.etaSub}>Reference: {order.id}</p>
        </div>

        <div className={styles.statusContainer}>
          <div className={styles.statusLine}>
            <div 
              className={styles.statusLineProgress} 
              style={{ height: `${progressPercentage}%` }}
            />
          </div>
          
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            
            return (
              <div 
                key={step.id} 
                className={`${styles.statusItem} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
              >
                <div className={`${styles.statusDot} ${isActive ? styles.pulse : ''}`}>
                  {isCompleted && <span className={styles.statusDotIcon}>✓</span>}
                </div>
                <div className={styles.statusLabel}>{step.label}</div>
                <div className={styles.statusSub}>{step.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Live Tracking Map */}
        <div className={styles.mapContainer}>
          <div className={styles.mapWrapper}>
            <div className={styles.mapBackground} style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
            <div className={styles.routeLine} />
            <div className={styles.userMarker} style={{ left: '20%' }}>
              <div className={styles.userMarkerPulse} />
            </div>
            
            <div className={styles.userMarker} style={{ left: '80%', background: '#171411', border: '1px solid #fff' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>

            <div 
              className={`${styles.deliveryMarker} ${order.status === 'OUT_FOR_DELIVERY' ? styles.moving : ''}`}
              style={{ left: (() => {
                if (order.status === 'DELIVERED') return '80%';
                if (order.status === 'PLACED' || order.status === 'CONFIRMED' || order.status === 'PACKING') return '20%';
                if (order.status === 'OUT_FOR_DELIVERY') {
                  const progress = deliveryProgress / 100;
                  return `${20 + (progress * 60)}%`;
                }
                return '20%';
              })() }}
            >
              <div className={styles.deliveryLabel}>COURIER</div>
              <div className={styles.deliveryIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
            </div>
          </div>
          <div className={styles.mapFooter}>
            <div className={styles.partnerInfo}>
              <div className={styles.partnerAvatar}>JS</div>
              <div>
                <div className={styles.partnerName}>John S.</div>
                <div className={styles.partnerStatus}>Premium Express Courier</div>
              </div>
            </div>
            <button className={styles.callBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Call Courier
            </button>
          </div>
        </div>

        <div className={styles.orderInfo}>
          <h3 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', color: '#888' }}>
            Consignment Details
          </h3>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Destination</span>
            <span className={styles.infoValue}>{order.address?.city || 'Your Location'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Value</span>
            <span className={styles.infoValue}>₹{order.total.toLocaleString()}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Quantity</span>
            <span className={styles.infoValue}>{order.items.length} unique pieces</span>
          </div>
        </div>

        <button className={styles.backBtn} onClick={() => router.push('/services/instastyle')}>
          Explore More Styles
        </button>
      </div>
    </div>
  );
}
