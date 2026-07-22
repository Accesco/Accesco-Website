'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './tracking.module.css';
import dynamic from 'next/dynamic';
import { formatETA } from '@/lib/etaEngine';
import { ORDER_STATUS } from '@/lib/trackingConstants';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { updateOrderStatusInFirestore } from '@/lib/orderService';
import { useSwadishtt } from '../contexts/SwadishttContext';

const LiveTrackingMap = dynamic(() => import('../components/Map/LiveTrackingMap'), {
  ssr: false,
  loading: () => <div style={{ height: '480px', background: '#F5F3F4' }} />,
});

/** Expanded delivery timeline matching InstaStyle architecture */
const TIMELINE = [
  ORDER_STATUS.PLACED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.PACKED,
  ORDER_STATUS.RIDER_ASSIGNED,
  ORDER_STATUS.PICKED_UP,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.ARRIVING,
  ORDER_STATUS.DELIVERED,
];

const STATUS_META = {
  [ORDER_STATUS.PLACED]: { label: 'Placed', desc: 'Order received.' },
  [ORDER_STATUS.CONFIRMED]: { label: 'Confirmed', desc: 'Kitchen accepted your order.' },
  [ORDER_STATUS.PREPARING]: { label: 'Preparing', desc: 'Your meal is being prepared.' },
  [ORDER_STATUS.PACKED]: { label: 'Packed', desc: 'Order is packed and ready.' },
  [ORDER_STATUS.RIDER_ASSIGNED]: { label: 'Assigned', desc: 'A rider has been assigned.' },
  [ORDER_STATUS.PICKED_UP]: { label: 'Picked Up', desc: 'Rider picked up your order.' },
  [ORDER_STATUS.OUT_FOR_DELIVERY]: { label: 'Out For Delivery', desc: 'Rider is heading to you.' },
  [ORDER_STATUS.ARRIVING]: { label: 'Arriving', desc: 'Rider is nearby.' },
  [ORDER_STATUS.DELIVERED]: { label: 'Delivered', desc: 'Order delivered successfully.' },
  [ORDER_STATUS.CANCELLED]: { label: 'Cancelled', desc: 'Order was cancelled.' },
  PENDING: { label: 'Placed', desc: 'Order received, awaiting confirmation.' },
  CONFIRMED: { label: 'Confirmed', desc: 'Kitchen has accepted your order.' },
  PROCESSING: { label: 'Preparing', desc: 'Your meal is being freshly prepared.' },
  DISPATCHED: { label: 'Out For Delivery', desc: 'Delivery partner is heading to you.' },
};

function resolveTimelineStatus(raw, liveOrderStatus) {
  if (liveOrderStatus && TIMELINE.includes(liveOrderStatus)) {
    return liveOrderStatus;
  }

  const key = (raw || 'PENDING').toUpperCase();
  const legacyMap = {
    PENDING: ORDER_STATUS.PLACED,
    CONFIRMED: ORDER_STATUS.PREPARING,
    PROCESSING: ORDER_STATUS.PREPARING,
    DISPATCHED: ORDER_STATUS.OUT_FOR_DELIVERY,
    DELIVERED: ORDER_STATUS.DELIVERED,
    CANCELLED: ORDER_STATUS.CANCELLED,
    PACKING: ORDER_STATUS.PACKED,
    ASSIGNED: ORDER_STATUS.RIDER_ASSIGNED,
  };

  if (TIMELINE.includes(key) || key === ORDER_STATUS.CANCELLED) return key;
  return legacyMap[key] || ORDER_STATUS.PLACED;
}

export default function SwadishttTrackingPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const { updateOrderStatus } = useSwadishtt();

  const [order, setOrder] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [liveTracking, setLiveTracking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastSyncedStatusRef = useRef('');

  useEffect(() => {
    if (typeof window === 'undefined' || !orderId) return;

    const storedUser = localStorage.getItem('accesco_user');
    if (storedUser) {
      try { setCurrentUser(JSON.parse(storedUser)); } catch {}
    }

    // 1. Initial local storage load
    const storedOrders = JSON.parse(localStorage.getItem('swadishtt-orders') || '[]');
    const found = storedOrders.find((o) => o.id === orderId || o.orderId === orderId);
    if (found) {
      setOrder(found);
      setIsLoading(false);
    }

    // 2. Realtime Firestore Subscription (source of truth)
    const docRef = doc(db, 'swadishtt_orders', orderId);
    const unsubscribeDoc = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const cloudOrder = { id: docSnap.id, ...docSnap.data() };
          setOrder(cloudOrder);

          // Update local cache
          try {
            const raw = localStorage.getItem('swadishtt-orders');
            let list = raw ? JSON.parse(raw) : [];
            const idx = list.findIndex((o) => o.id === orderId || o.orderId === orderId);
            if (idx >= 0) {
              list[idx] = { ...list[idx], ...cloudOrder };
            } else {
              list.unshift(cloudOrder);
            }
            localStorage.setItem('swadishtt-orders', JSON.stringify(list));
          } catch (e) {
            console.error('Error caching order locally:', e);
          }
        }
        setIsLoading(false);
      },
      (err) => {
        console.error('Firestore tracking snapshot error:', err);
        setIsLoading(false);
      }
    );

    // Fallback cloud fetch if Firestore snapshot delay
    fetch(`/api/swadishtt/orders?id=${encodeURIComponent(orderId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.order) {
          setOrder(data.order);
        }
      })
      .catch((err) => console.error('Cloud order recovery failed:', err))
      .finally(() => setIsLoading(false));

    return () => {
      unsubscribeDoc();
    };
  }, [orderId]);

  const handleMapTrackingUpdate = useCallback((payload) => {
    setLiveTracking((prev) => {
      const next = { ...prev, ...payload };
      if (
        prev &&
        prev.remainingETA === next.remainingETA &&
        prev.remainingDistance === next.remainingDistance &&
        prev.currentSpeed === next.currentSpeed &&
        prev.heading === next.heading &&
        prev.status === next.status &&
        prev.orderStatus === next.orderStatus &&
        prev.riderName === next.riderName
      ) {
        return prev;
      }
      return next;
    });

    // Auto-sync status transitions to Firestore & SwadishttContext
    if (payload?.orderStatus && orderId && payload.orderStatus !== lastSyncedStatusRef.current) {
      lastSyncedStatusRef.current = payload.orderStatus;
      updateOrderStatusInFirestore('swadishtt', orderId, payload.orderStatus);
      if (typeof updateOrderStatus === 'function') {
        updateOrderStatus(orderId, payload.orderStatus);
      }
    }
  }, [orderId, updateOrderStatus]);

  const timelineStatus = useMemo(
    () => resolveTimelineStatus(order?.status, liveTracking?.orderStatus),
    [order?.status, liveTracking?.orderStatus],
  );

  if (isLoading && !order) {
    return (
      <div className={styles.pageBackground}>
        <SwadishttHeader />
        <div className={styles.adminContainer}>
          <div className={styles.card} style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#666' }}>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.pageBackground}>
        <SwadishttHeader />
        <div className={styles.adminContainer}>
          <div className={styles.card}>
            <h2>Order not found</h2>
            <p>No details available for order #{orderId}.</p>
          </div>
        </div>
      </div>
    );
  }

  const legacyKey = (order.status || 'PENDING').toUpperCase();
  const stepIndex = TIMELINE.indexOf(timelineStatus);
  const isDelivered =
    timelineStatus === ORDER_STATUS.DELIVERED || legacyKey === 'DELIVERED';
  const totalItems = order.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) ?? 0;
  const userName = currentUser?.name || order.delivery?.name || order.customerName || 'Customer';
  const initials = userName.substring(0, 2).toUpperCase();
  const driverName =
    liveTracking?.riderName ||
    order.deliveryPartner?.name ||
    'Ravi Kumar';
  const driverDist =
    liveTracking?.remainingDistance ??
    order.deliveryPartner?.distanceKm ??
    null;
  const driverEta =
    liveTracking?.remainingETA ??
    order.deliveryPartner?.etaMinutes ??
    null;
  const orderDate = order.placedAt ? new Date(order.placedAt) : new Date();
  const formattedDate = orderDate.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  const showLiveNotice =
    !isDelivered &&
    (timelineStatus === ORDER_STATUS.OUT_FOR_DELIVERY ||
      timelineStatus === ORDER_STATUS.ARRIVING ||
      timelineStatus === ORDER_STATUS.PICKED_UP ||
      timelineStatus === ORDER_STATUS.RIDER_ASSIGNED ||
      legacyKey === 'DISPATCHED' ||
      liveTracking?.progress != null);

  return (
    <div className={styles.pageBackground}>
      <SwadishttHeader />

      <main className={styles.adminContainer}>

        <div className={styles.pageHeader}>
          <div className={styles.headerTitleArea}>
            <h1 className={styles.orderTitle}>Order #{order.id}</h1>
            <span className={`${styles.statusPill} ${styles[`status_${legacyKey.toLowerCase()}`] || styles.status_processing || ''}`}>
              {STATUS_META[timelineStatus]?.label || STATUS_META[legacyKey]?.label || order.status}
            </span>
          </div>
          <div className={styles.metaRow}>
            <span>Ordered via app</span>
            <span>·</span>
            <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
            <span>·</span>
            <span>{order.paymentMethod?.toUpperCase()} payment</span>
            <span className={styles.dateRight}>{formattedDate}</span>
          </div>
        </div>

        {/* Expanded timeline */}
        <div className={styles.card} style={{ marginBottom: '24px' }}>
          <h2 className={styles.cardTitle}>Order Progress</h2>
          <div className={styles.stepper} style={{ flexWrap: 'wrap', rowGap: 16 }}>
            {TIMELINE.map((step, i) => {
              const done = stepIndex >= 0 && i < stepIndex;
              const active = i === stepIndex;
              const meta = STATUS_META[step];
              return (
                <div key={step} className={`${styles.stepItem} ${done ? styles.stepDone : ''} ${active ? styles.stepActive : ''}`}>
                  <div className={styles.stepConnector} />
                  <div className={styles.stepCircle}>
                    {done ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span className={styles.stepNum}>{i + 1}</span>
                    )}
                  </div>
                  <div className={styles.stepBody}>
                    <p className={styles.stepLabel}>{meta.label}</p>
                    {active && <p className={styles.stepDesc}>{meta.desc}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showLiveNotice && (
          <div className={styles.driverNotice}>
            <div className={styles.driverNoticeIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <div className={styles.driverNoticeContent}>
              <span className={styles.driverNoticeLabel}>Live delivery update</span>
              <strong>
                {driverName}
                {driverDist != null ? ` is ${Number(driverDist).toFixed(2)} km away` : ' is on the way'}
              </strong>
              <p>
                {driverEta != null
                  ? `Arriving in about ${formatETA(driverEta)}.`
                  : 'Rider is en route with your fresh order.'}
              </p>
            </div>
          </div>
        )}

        {/* Live Rider Map section */}
        <div className={styles.card} style={{ padding: 0, overflow: 'hidden', marginBottom: '24px' }}>
          <LiveTrackingMap orderId={orderId} onTrackingUpdate={handleMapTrackingUpdate} />
        </div>

        {/* Order Details & Summary section */}
        <div className={styles.grid2}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Customer & Delivery</h2>
            <div className={styles.userRow}>
              <div className={styles.avatar}>{initials}</div>
              <div>
                <strong>{userName}</strong>
                <p className={styles.subtext}>{order.delivery?.phone || order.phone || 'Phone not specified'}</p>
              </div>
            </div>
            <div className={styles.divider} />
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Delivery Address</span>
              <p className={styles.infoValue}>
                {order.delivery?.address || order.delivery?.fullAddress || order.address || 'Standard Address'}
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Order Summary</h2>
            <div className={styles.itemsList}>
              {order.items?.map((item, idx) => (
                <div key={idx} className={styles.itemRow}>
                  <span>{item.quantity}x {item.name}</span>
                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              ))}
            </div>
            <div className={styles.divider} />
            <div className={styles.totalRow}>
              <span>Total Paid</span>
              <strong>₹{order.totals?.total || order.total}</strong>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
