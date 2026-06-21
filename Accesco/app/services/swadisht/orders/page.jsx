'use client';

/**
 * Orders Page
 * @page /services/swadisht/orders
 * @description Order history for Swadishtt
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './orders.module.css';

const ORDERS_STORAGE_KEY = 'swadishtt-orders';

function formatOrderDate(value) {
  if (!value) return 'Date unavailable';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Date unavailable';
  return parsed.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function normalizeStatus(value) {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return { label: 'Placed', key: 'placed' };
  const key = raw.toLowerCase().replace(/\s+/g, '-');
  return { label: raw, key };
}

export default function SwadishttOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    email: '',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load Swadishtt order history from localStorage.
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setOrders(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error reading Swadishtt orders:', error);
    }

    // Prefill profile details from localStorage for the orders view.
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
      if (rawLocation) {
        try {
          storedLocation = JSON.parse(rawLocation);
        } catch (error) {
          storedLocation = rawLocation;
        }
      }
    } catch (error) {
      console.error('Error reading userLocation from localStorage:', error);
    }

    const resolvedName = typeof storedUser?.name === 'string' ? storedUser.name : '';
    const resolvedPhone = typeof storedUser?.phone === 'string' ? storedUser.phone : '';
    const resolvedEmail = typeof storedUser?.email === 'string' ? storedUser.email : '';

    let resolvedCity = '';
    let resolvedAddress = '';

    if (storedLocation && typeof storedLocation === 'object') {
      resolvedCity =
        (typeof storedLocation?.city === 'string' && storedLocation.city) ||
        (typeof storedLocation?.state === 'string' && storedLocation.state) ||
        (typeof storedLocation?.region === 'string' && storedLocation.region) ||
        '';
      resolvedAddress =
        (typeof storedLocation?.fullAddress === 'string' && storedLocation.fullAddress) ||
        (typeof storedLocation?.formattedAddress === 'string' && storedLocation.formattedAddress) ||
        (typeof storedLocation?.displayAddress === 'string' && storedLocation.displayAddress) ||
        '';
      if (!resolvedAddress && typeof storedLocation?.area === 'string') {
        resolvedAddress = resolvedCity ? `${storedLocation.area}, ${resolvedCity}` : storedLocation.area;
      }
    } else if (typeof storedLocation === 'string') {
      resolvedAddress = storedLocation;
    }

    setProfile((prev) => ({
      ...prev,
      name: prev.name || resolvedName,
      phone: prev.phone || resolvedPhone,
      email: prev.email || resolvedEmail,
      address: prev.address || resolvedAddress,
      city: prev.city || resolvedCity,
    }));
  }, []);

  const hasOrders = orders.length > 0;

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      <div className={styles.container}>
        <div className={styles.ordersLayout}>
          <section className={styles.ordersSection}>
            <div className={styles.ordersHeader}>
              <div>
                <h1 className={styles.ordersTitle}>Your Swadishtt Orders</h1>
                <p className={styles.ordersSub}>Track past meals and reorder your favorites.</p>
              </div>
              <span className={styles.ordersCount}>{orders.length} orders</span>
            </div>

            {!hasOrders ? (
              <div className={styles.emptyState}>
                <h2 className={styles.emptyTitle}>No orders yet</h2>
                <p className={styles.emptyText}>Looks like you have not placed a Swadishtt order.</p>
                <Link href="/services/swadisht" className={styles.browseBtn}>
                  Browse Restaurants
                </Link>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {orders.map((order, index) => {
                  const items = Array.isArray(order.items) ? order.items : [];
                  const itemCount = items.reduce(
                    (sum, item) => sum + (item?.quantity || 1),
                    0
                  );
                  const deliveryParts = [
                    order?.delivery?.address,
                    order?.delivery?.landmark,
                    order?.delivery?.city,
                    order?.delivery?.pincode,
                  ].filter((part) => typeof part === 'string' && part.trim());
                  const deliveryLine = deliveryParts.join(', ');
                  const totals = order?.totals || {};
                  const totalValue = totals.total ?? order?.total ?? 0;
                  const status = normalizeStatus(order?.status);

                  const orderId = order.id || `SW-${index + 1}`;

                  return (
                    <article 
                      key={order.id || index} 
                      className={styles.orderCard}
                      onClick={() => router.push(`/services/swadisht/order-tracking?id=${orderId}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.orderHeaderRow}>
                        <div>
                          <div className={styles.orderId}>Order {orderId}</div>
                          <div className={styles.orderDate}>{formatOrderDate(order?.placedAt)}</div>
                        </div>
                        <span
                          className={`${styles.statusBadge} ${styles[`status-${status.key}`] || ''}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div className={styles.orderItems}>
                        {items.map((item, itemIndex) => (
                          <div key={`${order.id || index}-${item.id || itemIndex}`} className={styles.orderItem}>
                            <div className={styles.itemImage}>
                              <img
                                src={item.image}
                                alt={item.name}
                                onError={(e) => {
                                  e.currentTarget.src =
                                    `https://placehold.co/80x60/0F8A65/FFFFFF/png?text=${encodeURIComponent(item.name || 'Item')}`;
                                }}
                              />
                            </div>
                            <div className={styles.itemInfo}>
                              <div className={styles.itemName}>{item.name}</div>
                              {item.restaurant ? (
                                <div className={styles.itemMeta}>{item.restaurant}</div>
                              ) : null}
                              <div className={styles.itemMeta}>Qty: {item.quantity || 1}</div>
                            </div>
                            <div className={styles.itemPrice}>Rs {item.price * (item.quantity || 1)}</div>
                          </div>
                        ))}
                      </div>

                      <div className={styles.orderFooter}>
                        <div className={styles.footerBlock}>
                          <div className={styles.footerLabel}>Delivery</div>
                          <div className={styles.footerValue}>
                            {deliveryLine || 'Address not available'}
                          </div>
                        </div>
                        <div className={styles.footerBlock}>
                          <div className={styles.footerLabel}>Items</div>
                          <div className={styles.footerValue}>{itemCount}</div>
                        </div>
                        <div className={styles.footerBlockRight}>
                          <div className={styles.footerLabel}>Total</div>
                          <div className={styles.footerTotal}>Rs {totalValue}</div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <aside className={styles.profileCard}>
            <h2 className={styles.profileTitle}>Delivery Profile</h2>

            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>Name</span>
              <span className={styles.profileValue}>{profile.name || 'Add your name in checkout'}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>Phone</span>
              <span className={styles.profileValue}>{profile.phone || 'Add your phone in checkout'}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>Email</span>
              <span className={styles.profileValue}>{profile.email || 'Add your email in profile'}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>Address</span>
              <span className={styles.profileValue}>{profile.address || 'Add your address in checkout'}</span>
            </div>
            {profile.city ? (
              <div className={styles.profileRow}>
                <span className={styles.profileLabel}>City</span>
                <span className={styles.profileValue}>{profile.city}</span>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}