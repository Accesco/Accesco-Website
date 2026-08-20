'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SwadishttHeader from '../components/SwadishttHeader';
import { useSwadishtt } from '../contexts/SwadishttContext';
import styles from './orders.module.css';

const ORDERS_STORAGE_KEY = 'swadishtt-orders';

const FILTERS = [
  { key: 'all', label: 'All Orders' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'In Progress' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

function formatDate(value) {
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

function matchesFilter(order, filterKey) {
  if (filterKey === 'all') return true;
  const status = (order?.status || '').toLowerCase().replace(/\s+/g, '');
  if (filterKey === 'processing') {
    return status === 'processing' || status === 'preparing' || status === 'dispatched' || status === 'pending';
  }
  return status.includes(filterKey);
}

function getStatusKey(status) {
  return (status || 'placed').toLowerCase().replace(/\s+/g, '');
}

function StatusBadge({ status }) {
  const key = getStatusKey(status);
  return (
    <span className={`${styles.statusBadge} ${styles[`status_${key}`] || ''}`}>
      {status || 'Placed'}
    </span>
  );
}

function OrderCard({ order, index }) {
  const router = useRouter();

  const items = Array.isArray(order.items) ? order.items : [];
  const totalItems = items.reduce(
    (sum, item) => sum + (item?.quantity || 1),
    0
  );

  const totalValue = order?.totals?.total ?? order?.total ?? 0;
  const orderId = order.id || `SW-${index + 1}`;

  const firstItem = items[0];

  const handleViewDetails = () => {
    router.push(`/services/swadisht/orders/${orderId}`);
  };

const handleReportIssue = () => {
  router.push(`/services/swadisht/orders/${order.id}/return-options`);
};

  return (
    <article className={styles.orderCard}>
      <div className={styles.orderCardMain}>
        {/* Item image */}
        <div className={styles.orderImageWrapper}>
          {firstItem?.image ? (
            <Image
              src={firstItem.image}
              alt={firstItem.name || 'Order item'}
              width={72}
              height={72}
              className={styles.orderImage}
            />
          ) : (
            <div className={styles.orderImagePlaceholder}>🍽️</div>
          )}
        </div>

        {/* Order information */}
        <div className={styles.orderInfo}>
          <p className={styles.orderNumber}>
            Order #{orderId}
          </p>

          <p className={styles.restaurantName}>
            {firstItem?.restaurant || 'Swadishtt Kitchen'}
          </p>

          <p className={styles.orderDate}>
            {formatDate(order?.placedAt)}
          </p>

          <p className={styles.orderItemsSummary}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
            <span>•</span>
            ₹{totalValue}
          </p>
        </div>

        {/* Status */}
        <div className={styles.orderStatusSection}>
          <StatusBadge status={order?.status} />

          <p className={styles.statusDate}>
            {order?.status?.toLowerCase() === 'delivered'
              ? `Delivered on ${formatDate(order?.placedAt)}`
              : formatDate(order?.placedAt)}
          </p>
        </div>

        {/* Actions */}
        <div className={styles.orderCardActions}>
          <button
            type="button"
            className={styles.viewDetailsBtn}
            onClick={handleViewDetails}
          >
            View Details
          </button>

          <button
            type="button"
            className={styles.reportIssueBtn}
            onClick={handleReportIssue}
          >
            Report Issue / Return
          </button>
        </div>
      </div>
    </article>
  );
}

export default function SwadishttOrdersPage() {
  const { addToCart, user } = useSwadishtt();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      try {
        const queryParam = user?.uid ? `userId=${encodeURIComponent(user.uid)}` : '';
        const res = await fetch(`/api/swadishtt/orders?${queryParam}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.orders)) {
            setOrders(data.orders);
          }
        }
      } catch (error) {
        console.error('Error fetching Swadishtt orders from cloud:', error);
      } finally {
        setHydrated(true);
      }
    }
    loadOrders();
  }, [user]);

  const filteredOrders = orders.filter((o) => matchesFilter(o, activeFilter));

  const handleReorder = (order) => {
    if (!Array.isArray(order?.items)) return;
    order.items.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        restaurant: item.restaurant || '',
        sku: item.sku || '',
        quantity: item.quantity || 1,
      });
    });
    router.push('/services/swadisht/cart');
  };

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Order History</h1>
            {user?.name && (
              <p className={styles.userInfoSub}>
                {user.name} · {user.email || user.phone}
              </p>
            )}
            <p className={styles.pageSub}>{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</p>
          </div>
          <Link href="/services/swadisht" className={styles.newOrderBtn}>
            + New Order
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`${styles.filterTab} ${activeFilter === f.key ? styles.filterTabActive : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
              {f.key === 'all' && (
                <span className={styles.filterCount}>{orders.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Hint text */}
        {filteredOrders.length > 0 && (
          <p className={styles.expandHint}>Tap any order to see full details</p>
        )}

        {!hydrated ? null : filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🍽️</div>
            <h2 className={styles.emptyTitle}>No orders found</h2>
            <p className={styles.emptyText}>
              {activeFilter === 'all'
                ? 'You have not placed any Swadishtt orders yet.'
                : `No orders matching "${FILTERS.find((f) => f.key === activeFilter)?.label}".`}
            </p>
            <Link href="/services/swadisht" className={styles.browseBtn}>
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {filteredOrders.map((order, index) => (
            <OrderCard
  key={order.id || index}
  order={order}
  index={index}
/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}