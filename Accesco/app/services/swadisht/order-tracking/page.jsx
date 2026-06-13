'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './tracking.module.css';

export default function SwadishttTrackingPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedUser = localStorage.getItem('accesco_user');
    if (storedUser) {
      try { setCurrentUser(JSON.parse(storedUser)); }
      catch (e) { console.error('Failed to parse user data'); }
    }

    const storedOrders = JSON.parse(localStorage.getItem('swadishtt-orders') || '[]');
    const currentOrder = storedOrders.find((o) => o.id === orderId);
    if (currentOrder) setOrder(currentOrder);
  }, [orderId]);

  /* ── Not found ── */
  if (!order) {
    return (
      <div className={styles.notFoundWrapper}>
        <div className={styles.card}>
          <h2>Order not found</h2>
          <p>No details available for order #{orderId}.</p>
        </div>
      </div>
    );
  }

  /* ── Derived values ── */
  const isDelivered = order.status?.toLowerCase() === 'delivered';
  const totalItems = order.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
  const userName = currentUser?.name || order.delivery?.name || 'Customer';
  const initials = userName.substring(0, 2).toUpperCase();

  const orderDate = order.placedAt ? new Date(order.placedAt) : new Date();
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
            <span className={styles.statusPill}>
              <span className={styles.statusLightning}>⚡</span>
              {order.status}
            </span>
          </div>
        </div>

        {/* ── Meta row ── */}
        <div className={styles.metaRow}>
          <span>Ordered via app</span>
          <span>·</span>
          <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
          <span>·</span>
          <span>{order.paymentMethod?.toUpperCase()} payment</span>
          <span className={styles.dateRight}>{formattedDate}</span>
        </div>

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
                    <div className={styles.verifiedBadge}>✓</div>
                  </div>
                  <div className={styles.customerDetails}>
                    <h3>{userName} ↗</h3>
                    <p>Customer</p>
                  </div>
                </div>

                <div className={styles.customerContactActions}>
                  <a
                    href={`mailto:${currentUser?.email}`}
                    className={styles.btnOutlineSmall}
                  >
                    ✉ Email
                  </a>
                  <a
                    href={`tel:${currentUser?.phone || order.delivery?.phone}`}
                    className={styles.btnOutlineSmall}
                  >
                    📞 +91 {currentUser?.phone || order.delivery?.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Order items card */}
            <div className={`${styles.card} ${styles.staggeredAnim}`}>
              <h2 className={styles.cardTitle}>Order items ({totalItems})</h2>

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
                            <div className={styles.itemImagePlaceholder}>🍽️</div>
                            <div>
                              <p className={styles.itemName}>{item.name}</p>
                              <p className={styles.itemSku}>{item.restaurant}</p>
                            </div>
                          </div>
                        </td>
                        <td className={styles.fw600}>{item.quantity}×</td>
                        <td>₹{item.price}</td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>
                          ₹{item.price * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.totalsWrapper}>
                <div className={styles.totalsBlock}>
                  <div className={styles.totalRow}>
                    <span>Subtotal</span><span>₹{order.totals?.subtotal}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>Delivery</span>
                    <span>{order.totals?.deliveryFee === 0 ? 'Free' : `₹${order.totals?.deliveryFee}`}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>Platform fee</span><span>₹{order.totals?.platformFee}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>GST</span><span>₹{order.totals?.gst}</span>
                  </div>
                  <div className={styles.divider} />
                  <div className={styles.grandTotalRow}>
                    <span>Total</span>
                    <span style={{ color: 'var(--primary)' }}>₹{order.totals?.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Map + delivery info */}
          <div className={styles.mapColumn}>
            <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>

              {/* Map header */}
              <div className={styles.mapHeader}>
                <p className={styles.sectionLabel}>Live tracking</p>
                <span className={styles.livePulse} />
              </div>

              {/* Map */}
              <div className={styles.mapWrapper}>
                <div
                  style={{
                    height: '480px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F5F3F4',
                    color: '#666',
                    fontSize: '16px',
                    fontWeight: '500',
                  }}
                >
                  📍 Live Tracking Map Unavailable
                </div>
              </div>

              {/* Delivery address */}
              <div className={styles.addressBox}>
                <div className={styles.iconCircle}>📍</div>
                <div>
                  <p className={styles.addressLabel}>Delivery location</p>
                  <p className={styles.addressText}>{order.delivery?.address}</p>
                  <p className={styles.addressCity}>
                    {order.delivery?.city}, {order.delivery?.pincode}
                  </p>
                </div>
              </div>

              {/* Payment summary */}
              <div className={styles.paymentMiniCard}>
                <div className={styles.paymentMiniHeader}>
                  <span className={styles.paymentCheck}>✓</span>
                  <span className={styles.paymentAmount}>₹{order.totals?.total}</span>
                </div>
                <div className={styles.paymentMiniDetails}>
                  <div className={styles.payRow}>
                    <span>Method</span>
                    <strong>{order.paymentMethod?.toUpperCase()}</strong>
                  </div>
                  <div className={styles.payRow}>
                    <span>Status</span>
                    <strong>{isDelivered ? 'Paid' : 'Pending'}</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}