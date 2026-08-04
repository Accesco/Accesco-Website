'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import SwadishttHeader from '../../components/SwadishttHeader';
import styles from './order-detail.module.css';

const ORDERS_STORAGE_KEY = 'swadishtt-orders';

function formatDate(value) {
  if (!value) return 'Date unavailable';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Date unavailable';
  return parsed.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function StatusBadge({ status }) {
  const key = (status || 'placed').toLowerCase().replace(/\s+/g, '');
  const isDelivered = key === 'delivered';
  return (
    <span className={`${styles.statusBadge} ${isDelivered ? styles.statusDelivered : key === 'cancelled' ? styles.statusCancelled : styles.statusPending}`}>
      {isDelivered && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {status || 'Placed'}
    </span>
  );
}

export default function SwadishttOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [containerScheduled, setContainerScheduled] = useState(false);

  const orderId = params.id;

  useEffect(() => {
    setIsLoading(true);
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const found = (Array.isArray(parsed) ? parsed : []).find(o => o.id === orderId);
        setOrder(found || null);
      }
    } catch (e) {
      console.error('Error loading order:', e);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    // Check if container return already scheduled
    try {
      const returns = JSON.parse(localStorage.getItem('sw_container_returns') || '[]');
      setContainerScheduled(returns.some(r => r.orderId === orderId));
    } catch (_) {}
  }, [orderId]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <SwadishttHeader />
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
          <p>Loading order…</p>
        </div>
      </div>
    );
  }

  // Demo order when no real order found (for presentation)
  const demoOrder = {
    id: orderId || '12345',
    status: 'Delivered',
    placedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    hasReusableContainer: true,
    items: [
      { id: 'i1', name: 'Paneer Butter Masala', price: 199, quantity: 1, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=120&q=80', restaurant: 'Swadishtt Kitchen' },
      { id: 'i2', name: 'Dal Makhani with Rice', price: 149, quantity: 1, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=120&q=80', restaurant: 'Swadishtt Kitchen' },
    ],
    totals: { subtotal: 348, deliveryFee: 25, gst: 0, total: 373 },
    delivery: { name: 'Priya Sharma', address: '12, 5th Cross, Koramangala', city: 'Bengaluru', pincode: '560095' },
    paymentMethod: 'UPI',
  };

  const o = order || demoOrder;
  const isDelivered = (o.status || '').toLowerCase() === 'delivered';
  const items = Array.isArray(o.items) ? o.items : [];
  const totals = o.totals || {};
  const total = totals.total ?? o.total ?? 0;

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      <div className={styles.container}>
        {/* Back */}
        <div className={styles.backRow}>
          <button className={styles.backBtn} onClick={() => router.push('/services/swadisht/orders')} aria-label="Back to orders">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className={styles.pageTitle}>Order #{o.id}</h1>
        </div>

        {/* Status Banner */}
        <div className={`${styles.statusBanner} ${isDelivered ? styles.statusBannerDelivered : styles.statusBannerPending}`}>
          <div className={styles.statusBannerLeft}>
            <StatusBadge status={o.status} />
            <div>
              <div className={styles.statusBannerDate}>{formatDate(o.placedAt)}</div>
              <div className={styles.statusBannerSub}>Your order has been delivered</div>
            </div>
          </div>
          {isDelivered && (
            <div className={styles.statusIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="8 12 11 15 16 9" />
              </svg>
            </div>
          )}
        </div>

        {/* Items */}
        <div className={styles.card}>
          <p className={styles.sectionLabel}>Items ({items.length})</p>
          {items.map((item, idx) => (
            <div key={item.id || idx} className={styles.itemRow}>
              <img
                src={item.image}
                alt={item.name}
                className={styles.itemImg}
                onError={e => { e.currentTarget.src = `https://placehold.co/52x52/FFF0E8/B62025/png?text=🍛`; }}
              />
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
                {item.restaurant && <span className={styles.itemRest}>{item.restaurant}</span>}
              </div>
              <span className={styles.itemPrice}>₹{item.price * (item.quantity || 1)}</span>
            </div>
          ))}

          {/* Reusable Container Banner */}
          {o.hasReusableContainer && (
            <div className={`${styles.containerBanner} ${containerScheduled ? styles.containerBannerScheduled : ''}`}>
              <div className={styles.containerBannerLeft}>
                <div className={styles.containerIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <div>
                  <div className={styles.containerBannerTitle}>Reusable Container</div>
                  {containerScheduled ? (
                    <>
                      <div className={styles.containerBannerSub}>Return scheduled</div>
                      <div className={styles.containerBannerSub}>We will collect the container with your next Swadishtt delivery.</div>
                    </>
                  ) : (
                    <div className={styles.containerBannerSub}>This order came in an Accesco reusable container.<br /><span className={styles.containerLink}>Return it with your next Swadishtt order.</span></div>
                  )}
                </div>
              </div>
              {containerScheduled ? (
                <div className={styles.scheduledBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Scheduled
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              ) : (
                <Link href={`/services/swadisht/orders/${o.id}/return-container`} className={styles.returnContainerBtn}>
                  Return Container
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Bill Details */}
        <div className={styles.card}>
          <p className={styles.sectionLabel}>Bill Details</p>
          <div className={styles.billRow}>
            <span>Item Total</span>
            <span>₹{totals.subtotal ?? (total - (totals.deliveryFee || 0))}</span>
          </div>
          <div className={styles.billRow}>
            <span>Delivery Fee</span>
            <span>₹{totals.deliveryFee ?? 0}</span>
          </div>
          {(totals.gst > 0) && (
            <div className={styles.billRow}>
              <span>GST</span>
              <span>₹{totals.gst}</span>
            </div>
          )}
          <div className={`${styles.billRow} ${styles.billTotal}`}>
            <span>Total Paid</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionRow}>
          <button
            className={styles.reorderBtn}
            onClick={() => router.push('/services/swadisht')}
          >
            Reorder
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Need Help */}
        <Link href={`/services/swadisht/orders/${o.id}/report-issue`} className={styles.helpRow}>
          <div className={styles.helpLeft}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <div className={styles.helpTitle}>Need Help?</div>
              <div className={styles.helpSub}>Report issue or give feedback</div>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
