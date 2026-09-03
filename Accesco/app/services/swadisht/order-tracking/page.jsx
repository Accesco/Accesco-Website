'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './tracking.module.css';
import dynamic from 'next/dynamic';
import { advanceOrderStatus, updateOrderStatusLocal, ORDER_STATUSES } from '@/lib/mailService';
import { useAuth } from '../../../components/AuthProvider';

const LiveTrackingMap = dynamic(() => import('../components/Map/LiveTrackingMap'), {
  ssr: false,
  loading: () => <div style={{ height: '480px', background: '#F5F3F4' }} />,
});

const PIPELINE = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DISPATCHED', 'DELIVERED'];

const STATUS_META = {
  PENDING:    { label: 'Pending',    desc: 'Order received, awaiting confirmation.' },
  CONFIRMED:  { label: 'Confirmed',  desc: 'Kitchen has accepted your order.' },
  PROCESSING: { label: 'Preparing',  desc: 'Your meal is being freshly prepared.' },
  DISPATCHED: { label: 'On the Way', desc: 'Delivery partner is heading to you.' },
  DELIVERED:  { label: 'Delivered',  desc: 'Order delivered successfully.' },
};

export default function SwadishttTrackingPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  const { user: currentUser } = useAuth();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadOrder() {
      if (!orderId) return;
      try {
        const res = await fetch('/api/swadishtt/orders');
        if (res.ok) {
          const data = await res.json();
          const found = (Array.isArray(data.orders) ? data.orders : []).find((o) => o.id === orderId);
          if (found && !cancelled) setOrder(found);
        }
      } catch (err) {
        console.error('Failed to load tracking order:', err);
      }
    }
    loadOrder();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const handleAdvanceStatus = useCallback(async () => {
    if (!order) return;
    const next = advanceOrderStatus(order.status || 'PENDING');
    setOrder(prev => prev ? { ...prev, status: next } : prev);

    try {
      await fetch('/api/swadishtt/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          newStatus: next,
          customerEmail: order.customerEmail || order.delivery?.email || currentUser?.email,
          customerName: order.customerName || order.delivery?.name || currentUser?.name,
          orderData: order,
        }),
      });
    } catch (e) {
      console.error('Failed to sync status update:', e);
    }
  }, [order, orderId, currentUser]);

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

  /* ── Derived values ── */
  const statusKey    = (order.status || 'PENDING').toUpperCase();
  const stepIndex    = PIPELINE.indexOf(statusKey);
  const isDelivered  = statusKey === 'DELIVERED';
  const totalItems   = order.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
  const userName     = currentUser?.name || order.delivery?.name || 'Customer';
  const initials     = userName.substring(0, 2).toUpperCase();
  const driverName   = order.deliveryPartner?.name || 'Delivery partner';
  const driverDist   = order.deliveryPartner?.distanceKm || 1.8;
  const driverEta    = order.deliveryPartner?.etaMinutes || 10;
  const orderDate    = order.placedAt ? new Date(order.placedAt) : new Date();
  const formattedDate = orderDate.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className={styles.pageBackground}>
      <SwadishttHeader />

      <main className={styles.adminContainer}>

        {/* ── Page header ── */}
        <div className={styles.pageHeader}>
          <div className={styles.headerTitleArea}>
            <h1 className={styles.orderTitle}>Order #{order.id}</h1>
            <span className={`${styles.statusPill} ${styles[`status_${statusKey.toLowerCase()}`] || ''}`}>
              {STATUS_META[statusKey]?.label || order.status}
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

        {/* ── Pipeline Stepper ── */}
        <div className={styles.card} style={{ marginBottom: '24px' }}>
          <h2 className={styles.cardTitle}>Order Progress</h2>
          <div className={styles.stepper}>
            {PIPELINE.map((step, i) => {
              const done    = i < stepIndex;
              const active  = i === stepIndex;
              const meta    = STATUS_META[step];
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

        {/* ── Live driver notice (only while dispatched) ── */}
        {statusKey === 'DISPATCHED' && (
          <div className={styles.driverNotice}>
            <div className={styles.driverNoticeIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <div className={styles.driverNoticeContent}>
              <span className={styles.driverNoticeLabel}>Live delivery update</span>
              <strong>{driverName} is {driverDist} km away</strong>
              <p>Arriving in about {driverEta} minutes.</p>
            </div>
          </div>
        )}

        {/* ── Two-column layout ── */}
        <div className={styles.trackingLayout}>

          {/* LEFT: Customer + Items */}
          <div className={styles.detailsColumn}>

            {/* Customer card */}
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

            {/* Order items card */}
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

          {/* RIGHT: Map + delivery info */}
          <div className={styles.mapColumn}>
            <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
              <div className={styles.mapHeader}>
                <p className={styles.sectionLabel}>Live tracking</p>
                <span className={styles.livePulse} />
              </div>
              <div className={styles.mapWrapper}>
                <LiveTrackingMap orderId={order.id} />
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