'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './tracking.module.css';
import dynamic from 'next/dynamic';
import { advanceOrderStatus, updateOrderStatusLocal } from '@/lib/mailService';
import { formatETA } from '@/lib/etaEngine';
import { ORDER_STATUS } from '@/lib/trackingConstants';

const LiveTrackingMap = dynamic(() => import('../components/Map/LiveTrackingMap'), {
  ssr: false,
  loading: () => <div style={{ height: '480px', background: '#F5F3F4' }} />,
});

/** Expanded delivery timeline (new architecture). */
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
  // Legacy mailService / localStorage statuses (backwards compatibility)
  PENDING: { label: 'Placed', desc: 'Order received, awaiting confirmation.' },
  CONFIRMED: { label: 'Confirmed', desc: 'Kitchen has accepted your order.' },
  PROCESSING: { label: 'Preparing', desc: 'Your meal is being freshly prepared.' },
  DISPATCHED: { label: 'Out For Delivery', desc: 'Delivery partner is heading to you.' },
};

/**
 * Maps legacy + live statuses onto the expanded timeline index.
 * @param {string} raw
 * @param {string|null} liveOrderStatus
 * @returns {string}
 */
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

  const [order, setOrder] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [liveTracking, setLiveTracking] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedUser = localStorage.getItem('accesco_user');
    if (storedUser) {
      try { setCurrentUser(JSON.parse(storedUser)); } catch {}
    }
    const storedOrders = JSON.parse(localStorage.getItem('swadishtt-orders') || '[]');
    const found = storedOrders.find((o) => o.id === orderId);
    if (found) setOrder(found);
  }, [orderId]);

  // Live rider updates come from LiveTrackingMap (single Firestore subscription).
  const handleAdvanceStatus = useCallback(() => {
    if (!order) return;
    const next = advanceOrderStatus(order.status || 'PENDING');
    const updated = updateOrderStatusLocal(orderId, next);
    if (updated) setOrder(updated);
  }, [order, orderId]);

  const handleMapTrackingUpdate = useCallback((payload) => {
    setLiveTracking((prev) => {
      const next = { ...prev, ...payload };
      // Avoid redundant state updates when map + page share the same snapshot.
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
  }, []);

  const timelineStatus = useMemo(
    () => resolveTimelineStatus(order?.status, liveTracking?.orderStatus),
    [order?.status, liveTracking?.orderStatus],
  );

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
  const totalItems = order.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
  const userName = currentUser?.name || order.delivery?.name || 'Customer';
  const initials = userName.substring(0, 2).toUpperCase();
  const driverName =
    liveTracking?.riderName ||
    order.deliveryPartner?.name ||
    'Delivery partner';
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

        {/* ── Expanded timeline ── */}
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
          {!isDelivered && (
            <button
              type="button"
              className={styles.btnAdvance}
              onClick={handleAdvanceStatus}
            >
              Simulate Next Status
            </button>
          )}
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
                  : 'Live ETA updating…'}
                {liveTracking?.currentSpeed != null
                  ? ` · ${Math.round(liveTracking.currentSpeed)} km/h`
                  : ''}
              </p>
            </div>
          </div>
        )}

        {/* Live metrics row */}
        {liveTracking && (
          <div className={styles.card} style={{ marginBottom: 24, padding: '16px 20px' }}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 12 }}>Live Status</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 12, fontSize: 13 }}>
              <div>
                <div style={{ color: '#9B7E6A', fontWeight: 600 }}>Status</div>
                <div style={{ fontWeight: 700 }}>
                  {STATUS_META[timelineStatus]?.label || timelineStatus}
                </div>
              </div>
              <div>
                <div style={{ color: '#9B7E6A', fontWeight: 600 }}>ETA</div>
                <div style={{ fontWeight: 700 }}>
                  {liveTracking.remainingETA != null ? formatETA(liveTracking.remainingETA) : '—'}
                </div>
              </div>
              <div>
                <div style={{ color: '#9B7E6A', fontWeight: 600 }}>Distance</div>
                <div style={{ fontWeight: 700 }}>
                  {liveTracking.remainingDistance != null
                    ? `${Number(liveTracking.remainingDistance).toFixed(2)} km`
                    : '—'}
                </div>
              </div>
              <div>
                <div style={{ color: '#9B7E6A', fontWeight: 600 }}>Rider</div>
                <div style={{ fontWeight: 700 }}>{driverName}</div>
              </div>
              <div>
                <div style={{ color: '#9B7E6A', fontWeight: 600 }}>Remaining</div>
                <div style={{ fontWeight: 700 }}>
                  {liveTracking.remainingETA != null
                    ? formatETA(liveTracking.remainingETA)
                    : '—'}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.trackingLayout}>

          <div className={styles.detailsColumn}>

            <div className={styles.card}>
              <div className={styles.customerRow}>
                <div className={styles.customerProfile}>
                  <div className={styles.avatar}>
                    {initials}
                    <div className={styles.verifiedBadge}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className={styles.customerDetails}>
                    <h3>{userName}</h3>
                    <p>Customer</p>
                  </div>
                </div>
                <div className={styles.customerContactActions}>
                  <a href={`mailto:${currentUser?.email}`} className={styles.btnOutlineSmall}>
                    Email
                  </a>
                  <a href={`tel:${currentUser?.phone || order.delivery?.phone}`} className={styles.btnOutlineSmall}>
                    +91 {currentUser?.phone || order.delivery?.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className={`${styles.card} ${styles.staggeredAnim}`}>
              <h2 className={styles.cardTitle}>Order Items ({totalItems})</h2>
              <div className={styles.tableWrapper}>
                <table className={styles.productTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '50%' }}>Item</th>
                      <th style={{ width: '15%' }}>Qty</th>
                      <th style={{ width: '15%' }}>Price</th>
                      <th style={{ width: '20%', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, idx) => (
                      <tr key={idx} className={styles.tableRowHover}>
                        <td>
                          <div className={styles.itemCell}>
                            <div className={styles.itemImagePlaceholder} />
                            <div>
                              <p className={styles.itemName}>{item.name}</p>
                              <p className={styles.itemSku}>{item.restaurant}</p>
                            </div>
                          </div>
                        </td>
                        <td className={styles.fw600}>{item.quantity}&times;</td>
                        <td>&#8377;{item.price}</td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>
                          &#8377;{item.price * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.totalsWrapper}>
                <div className={styles.totalsBlock}>
                  <div className={styles.totalRow}><span>Subtotal</span><span>&#8377;{order.totals?.subtotal}</span></div>
                  <div className={styles.totalRow}>
                    <span>Delivery</span>
                    <span>{order.totals?.deliveryFee === 0 ? 'Free' : `&#8377;${order.totals?.deliveryFee}`}</span>
                  </div>
                  <div className={styles.totalRow}><span>Platform fee</span><span>&#8377;{order.totals?.platformFee}</span></div>
                  <div className={styles.totalRow}><span>GST</span><span>&#8377;{order.totals?.gst}</span></div>
                  <div className={styles.divider} />
                  <div className={styles.grandTotalRow}>
                    <span>Total</span>
                    <span style={{ color: 'var(--primary)' }}>&#8377;{order.totals?.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.mapColumn}>
            <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
              <div className={styles.mapHeader}>
                <p className={styles.sectionLabel}>Live tracking</p>
                <span className={styles.livePulse} />
              </div>
              <div className={styles.mapWrapper}>
                <LiveTrackingMap
                  orderId={order.id}
                  onTrackingUpdate={handleMapTrackingUpdate}
                />
              </div>
              <div className={styles.addressBox}>
                <div className={styles.iconCircle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21C12 21 5 13.5 5 8.5a7 7 0 1114 0C19 13.5 12 21 12 21z"/><circle cx="12" cy="8.5" r="2.5"/>
                  </svg>
                </div>
                <div>
                  <p className={styles.addressLabel}>Delivery location</p>
                  <p className={styles.addressText}>{order.delivery?.address}</p>
                  <p className={styles.addressCity}>{order.delivery?.city}, {order.delivery?.pincode}</p>
                </div>
              </div>
              <div className={styles.paymentMiniCard}>
                <div className={styles.paymentMiniHeader}>
                  <span className={styles.paymentCheck}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className={styles.paymentAmount}>&#8377;{order.totals?.total}</span>
                </div>
                <div className={styles.paymentMiniDetails}>
                  <div className={styles.payRow}><span>Method</span><strong>{order.paymentMethod?.toUpperCase()}</strong></div>
                  <div className={styles.payRow}><span>Status</span><strong>{isDelivered ? 'Paid' : 'Pending'}</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
