'use client';

/**
 * Profile Page
 * @page /services/swadisht/profile
 * @description Customer profile for Swadishtt
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './profile.module.css';

const ORDERS_STORAGE_KEY = 'swadishtt-orders';

function formatMoney(value) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount)) return 'Rs 0';
  return `Rs ${amount.toLocaleString('en-IN')}`;
}

function formatDate(value) {
  if (!value) return 'Date unavailable';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Date unavailable';
  return parsed.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatMonthYear(value) {
  if (!value) return '2026';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '2026';
  return parsed.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

function getItemCount(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + (item?.quantity || 1), 0);
}

export default function SwadishttProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Edited Jabez: hydrate profile details from localStorage.
    let storedUser = null;
    let storedLocation = null;

    try {
      const rawUser = localStorage.getItem('accesco_user');
      if (rawUser) storedUser = JSON.parse(rawUser);
    } catch (error) {
      console.error('Error reading accesco_user from localStorage:', error);
    }

    try {
      const rawLocation = localStorage.getItem('userLocation');
      if (rawLocation) storedLocation = JSON.parse(rawLocation);
    } catch (error) {
      console.error('Error reading userLocation from localStorage:', error);
    }

    const resolvedName = typeof storedUser?.name === 'string' ? storedUser.name : '';
    const resolvedPhone = typeof storedUser?.phone === 'string' ? storedUser.phone : '';
    const resolvedEmail = typeof storedUser?.email === 'string' ? storedUser.email : '';
    const resolvedCity =
      (typeof storedLocation?.city === 'string' && storedLocation.city) ||
      (typeof storedLocation?.state === 'string' && storedLocation.state) ||
      (typeof storedLocation?.region === 'string' && storedLocation.region) ||
      '';
    const resolvedAddress =
      (typeof storedLocation?.fullAddress === 'string' && storedLocation.fullAddress) ||
      (typeof storedLocation?.formattedAddress === 'string' && storedLocation.formattedAddress) ||
      (typeof storedLocation?.displayAddress === 'string' && storedLocation.displayAddress) ||
      (typeof storedLocation?.area === 'string' && resolvedCity
        ? `${storedLocation.area}, ${resolvedCity}`
        : (typeof storedLocation?.area === 'string' ? storedLocation.area : '')) ||
      '';

    setProfile((prev) => ({
      ...prev,
      name: prev.name || resolvedName,
      phone: prev.phone || resolvedPhone,
      email: prev.email || resolvedEmail,
      address: prev.address || resolvedAddress,
      city: prev.city || resolvedCity,
    }));

    // Edited Jabez: load Swadishtt order summary for profile stats.
    try {
      const rawOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (rawOrders) {
        const parsed = JSON.parse(rawOrders);
        setOrders(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error reading Swadishtt orders:', error);
    }
  }, []);

  const latestOrder = orders[0];
  const latestTotal = latestOrder?.totals?.total ?? 0;
  const totalSpent = orders.reduce(
    (sum, order) => sum + (Number(order?.totals?.total) || 0),
    0
  );
  const avgSpend = orders.length ? Math.round(totalSpent / orders.length) : 0;
  const addressLine = [profile.address, profile.city]
    .filter((part) => typeof part === 'string' && part.trim())
    .join(', ');
  const tasteTags = Array.isArray(latestOrder?.items)
    ? latestOrder.items
        .map((item) => item?.restaurant || item?.name)
        .filter((label) => typeof label === 'string' && label.trim())
        .slice(0, 4)
    : [];
  const recentOrders = orders.slice(0, 3);
  const firstOrder = orders.length ? orders[orders.length - 1] : null;
  const memberSince = formatMonthYear(firstOrder?.placedAt);

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      <div className={styles.shell}>
        <section className={styles.profileBoard}>
          <aside className={styles.sidebar}>
            <div className={styles.profileCard}>
              <div className={styles.profileTop}>
                <div className={styles.avatar}>
                  {(profile.name || 'S').charAt(0).toUpperCase()}
                </div>
                <div className={styles.profileIdentity}>
                  <span className={styles.memberBadge}>Swadishtt member</span>
                  <h1 className={styles.memberName}>{profile.name || 'Accesco Customer'}</h1>
                  <p className={styles.memberMeta}>
                    {profile.phone || 'Phone not added'}
                    {profile.email ? ` | ${profile.email}` : ''}
                  </p>
                </div>
              </div>
              <div className={styles.profileActions}>
                <Link href="/services/swadisht" className={styles.primaryBtn}>
                  Start new order
                </Link>
                <Link href="/services/swadisht/orders" className={styles.secondaryBtn}>
                  View orders
                </Link>
              </div>
              <div className={styles.profileInfo}>
                <div className={styles.infoRow}>
                  <span>Delivery hub</span>
                  <span>{addressLine || 'Add address in checkout'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Member since</span>
                  <span>{memberSince}</span>
                </div>
              </div>
            </div>

            <div className={styles.tasteCard}>
              <div className={styles.cardHeader}>
                <h2>Taste profile</h2>
                <span>Based on latest order</span>
              </div>
              <div className={styles.chipRow}>
                {tasteTags.length > 0 ? (
                  tasteTags.map((tag) => (
                    <span key={tag} className={styles.chip}>
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className={styles.chipMuted}>No taste data yet</span>
                )}
              </div>
            </div>

            <div className={styles.supportCard}>
              <h2>Support</h2>
              <p>Need help with an order or payment? We respond fast.</p>
              <div className={styles.supportActions}>
                <Link href="/contact" className={styles.supportBtn}>
                  Contact support
                </Link>
                <Link href="/services/swadisht/orders" className={styles.supportGhost}>
                  Track orders
                </Link>
              </div>
            </div>
          </aside>

          <main className={styles.mainColumn}>
            <section className={styles.bannerCard}>
              <div>
                <span className={styles.bannerKicker}>Next order</span>
                <h2 className={styles.bannerTitle}>Ready for your next meal?</h2>
                <p className={styles.bannerCopy}>
                  We keep your favorites close and your delivery fast.
                </p>
              </div>
              <div className={styles.bannerActions}>
                <Link href="/services/swadisht" className={styles.bannerBtn}>
                  Browse restaurants
                </Link>
              </div>
            </section>

            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <span>Orders</span>
                <strong>{orders.length}</strong>
                <small>All time</small>
              </div>
              <div className={styles.metricCard}>
                <span>Total spend</span>
                <strong>{formatMoney(totalSpent)}</strong>
                <small>Across all orders</small>
              </div>
              <div className={styles.metricCard}>
                <span>Average basket</span>
                <strong>{formatMoney(avgSpend)}</strong>
                <small>Based on history</small>
              </div>
              <div className={styles.metricCard}>
                <span>Latest order</span>
                <strong>{latestOrder ? formatDate(latestOrder.placedAt) : 'No orders'}</strong>
                <small>{latestOrder ? latestOrder.status : 'Start ordering'}</small>
              </div>
            </div>

            <section className={styles.ordersPanel}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Recent orders</h2>
                  <p className={styles.sectionSub}>A quick view of your latest deliveries.</p>
                </div>
                <Link href="/services/swadisht/orders" className={styles.sectionLink}>
                  See all
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyTitle}>No Swadishtt orders yet</p>
                  <p className={styles.emptyText}>
                    Start exploring restaurants to build your taste profile.
                  </p>
                  <Link href="/services/swadisht" className={styles.primaryBtn}>
                    Browse restaurants
                  </Link>
                </div>
              ) : (
                <div className={styles.orderList}>
                  {recentOrders.map((order, index) => {
                    const items = Array.isArray(order.items) ? order.items : [];
                    const itemCount = getItemCount(items);
                    const previewItems = items.slice(0, 3);
                    const moreCount = items.length - previewItems.length;

                    return (
                      <article key={order.id || index} className={styles.orderRow}>
                        <div className={styles.orderMeta}>
                          <div className={styles.orderId}>{order.id || `Order ${index + 1}`}</div>
                          <div className={styles.orderSub}>
                            {formatDate(order.placedAt)} | {itemCount} items
                          </div>
                          <div className={styles.orderItems}>
                            {previewItems.map((item, itemIndex) => (
                              <span
                                key={`${order.id || index}-${item.id || itemIndex}`}
                                className={styles.itemTag}
                              >
                                {item.name}
                              </span>
                            ))}
                            {moreCount > 0 ? (
                              <span className={styles.itemMore}>+{moreCount} more</span>
                            ) : null}
                          </div>
                        </div>
                        <div className={styles.orderSummary}>
                          <span className={styles.statusBadge}>{order.status || 'Placed'}</span>
                          <strong className={styles.orderTotal}>
                            {formatMoney(order?.totals?.total ?? 0)}
                          </strong>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <div className={styles.utilityGrid}>
              <section className={styles.utilityCard}>
                <h3>Saved address</h3>
                <p>{addressLine || 'Add an address in checkout for faster reorders.'}</p>
                <Link href="/services/swadisht/checkout" className={styles.utilityLink}>
                  Update address
                </Link>
              </section>
              <section className={styles.utilityCard}>
                <h3>Payment preference</h3>
                <p>{latestOrder?.paymentMethod || 'Add a payment method in checkout.'}</p>
                <Link href="/services/swadisht/checkout" className={styles.utilityLink}>
                  Manage in checkout
                </Link>
              </section>
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}
