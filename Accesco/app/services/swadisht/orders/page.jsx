'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

function OrderCard({ order, index, onReorder }) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const items = Array.isArray(order.items) ? order.items : [];
  const totalItems = items.reduce((sum, item) => sum + (item?.quantity || 1), 0);
  const totalValue = order?.totals?.total ?? order?.total ?? 0;
  const orderId = order.id || `SW-${index + 1}`;

  return (
    <article className={`${styles.orderCard} ${expanded ? styles.orderCardExpanded : ''}`}>
      {/* ── Collapsed: Summary Row (always visible) ── */}
      <button
        type="button"
        className={styles.orderSummaryRow}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className={styles.orderSummaryLeft}>
          <div className={styles.orderIdBadge}>#{orderId}</div>
          <div className={styles.orderSummaryMeta}>
            <span className={styles.orderRestaurantHint}>
              {items[0]?.restaurant || 'Swadishtt Order'}
              {items.length > 1 ? ` +${items.length - 1} more` : ''}
            </span>
            <span className={styles.orderDate}>{formatDate(order?.placedAt)}</span>
          </div>
        </div>

        <div className={styles.orderSummaryRight}>
          <StatusBadge status={order?.status} />
          <div className={styles.orderSummaryTotal}>
            <span className={styles.totalAmount}>₹{totalValue}</span>
            <span className={styles.itemsCount}>{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
          </div>
          <span className={`${styles.chevron} ${expanded ? styles.chevronUp : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </button>

      {/* ── Expanded: Full Detail ── */}
      {expanded && (
        <div className={styles.orderDetail}>
          {/* Payment & delivery meta */}
          <div className={styles.detailMeta}>
            <div className={styles.detailMetaItem}>
              <span className={styles.detailMetaLabel}>Payment</span>
              <span className={styles.detailMetaValue}>{order?.paymentMethod?.toUpperCase() || '—'}</span>
            </div>
            <div className={styles.detailMetaDivider} />
            <div className={styles.detailMetaItem}>
              <span className={styles.detailMetaLabel}>Order ID</span>
              <span className={styles.detailMetaValue}>#{orderId}</span>
            </div>
            <div className={styles.detailMetaDivider} />
            <div className={styles.detailMetaItem}>
              <span className={styles.detailMetaLabel}>Placed</span>
              <span className={styles.detailMetaValue}>{formatDate(order?.placedAt)}</span>
            </div>
          </div>

          {/* Items list */}
          <div className={styles.itemsList}>
            <p className={styles.detailSectionLabel}>Items Ordered</p>
            {items.map((item, itemIdx) => (
              <div key={`${orderId}-${item.id || itemIdx}`} className={styles.detailItem}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.detailItemImage}
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/52x52/262626/FAF9F6/png?text=${encodeURIComponent(item.name || 'Item')}`;
                  }}
                />
                <div className={styles.detailItemInfo}>
                  <span className={styles.detailItemName}>{item.name}</span>
                  <div className={styles.detailItemMeta}>
                    {item.restaurant && <span>{item.restaurant}</span>}
                    {item.sku && <span className={styles.detailItemSku}>{item.sku}</span>}
                  </div>
                </div>
                <div className={styles.detailItemPrice}>
                  <span className={styles.detailItemQty}>{item.quantity || 1}×</span>
                  <span className={styles.detailItemAmt}>₹{item.price * (item.quantity || 1)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bill Summary */}
          <div className={styles.billSummary}>
            <p className={styles.detailSectionLabel}>Bill Summary</p>
            {order?.totals?.subtotal !== undefined && (
              <div className={styles.billRow}>
                <span>Subtotal</span>
                <span>₹{order.totals.subtotal}</span>
              </div>
            )}
            {order?.totals?.deliveryFee !== undefined && (
              <div className={styles.billRow}>
                <span>Delivery</span>
                <span>{order.totals.deliveryFee === 0 ? 'Free' : `₹${order.totals.deliveryFee}`}</span>
              </div>
            )}
            {order?.totals?.gst !== undefined && (
              <div className={styles.billRow}>
                <span>GST</span>
                <span>₹{order.totals.gst}</span>
              </div>
            )}
            <div className={`${styles.billRow} ${styles.billTotal}`}>
              <span>Total</span>
              <span>₹{totalValue}</span>
            </div>
          </div>

          {/* Delivery Address */}
          {(order.delivery?.address || order.delivery?.name) && (
            <div className={styles.deliveryAddressBlock}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <span className={styles.deliveryAddrLabel}>Delivered to</span>
                <p className={styles.deliveryAddrText}>
                  {order.delivery?.name && <strong>{order.delivery.name}</strong>}
                  {order.delivery?.name && ' · '}
                  {order.delivery?.address}{order.delivery?.city ? `, ${order.delivery.city}` : ''}
                  {order.delivery?.pincode ? ` — ${order.delivery.pincode}` : ''}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className={styles.orderActions}>
            <button
              type="button"
              className={styles.reorderBtn}
              onClick={() => onReorder(order)}
            >
              Reorder
            </button>
            <button
              type="button"
              className={styles.trackBtn}
              onClick={() => router.push(`/services/swadisht/order-tracking?id=${orderId}`)}
            >
              Track Order
            </button>
          </div>
        </div>
      )}
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
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setOrders(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error reading Swadishtt orders:', error);
    }
    setHydrated(true);
  }, []);

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
                onReorder={handleReorder}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}