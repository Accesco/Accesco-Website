'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import ActiveOrdersWidget from '@/components/ActiveOrdersWidget';
import styles from '../../../profile/orders/orders.module.css';

export default function InstaStyleOrdersPage() {
  const router = useRouter();
  const { orders: contextOrders, reorder } = useCart();

  const handleReorder = (e, order) => {
    e.stopPropagation();
    reorder(order.items || []);
    router.push('/services/instastyle');
  };
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('instastyle_orders');
      if (raw) {
        setOrders(JSON.parse(raw));
      } else {
        setOrders(contextOrders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [contextOrders]);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (filter === 'DELIVERED') {
      filtered = filtered.filter(o => o.status === 'DELIVERED');
    } else if (filter === 'PLACED') {
      filtered = filtered.filter(o => o.status !== 'DELIVERED');
    }
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [orders, filter]);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: '#111' }}>InstaStyle Orders</h1>
          <button onClick={() => router.push('/services/instastyle')} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>
            Back to Shop
          </button>
        </div>

        <ActiveOrdersWidget venture="InstaStyle" />

        <div className={styles.filters}>
          <button className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>All Orders</button>
          <button className={`${styles.filterBtn} ${filter === 'DELIVERED' ? styles.active : ''}`} onClick={() => setFilter('DELIVERED')}>Delivered</button>
          <button className={`${styles.filterBtn} ${filter === 'PLACED' || filter === 'CONFIRMED' || filter === 'PACKING' || filter === 'OUT_FOR_DELIVERY' ? styles.active : ''}`} onClick={() => setFilter('PLACED')}>Active</button>
        </div>

        {isLoading ? (
          <div className={styles.emptyState}>Loading orders...</div>
        ) : filteredOrders.length > 0 ? (
          <div className={styles.orderList}>
            {filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className={styles.orderCard}
                onClick={() => router.push(`/services/instastyle/orders/${order.id}`)}
              >
                <div className={styles.orderMain}>
                  <div style={{ width: '80px', height: '80px', position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
                    {order.items && order.items[0] && order.items[0].image ? (
                      // eslint-disable-next-line @next/next/no-img-element -- order item image comes from the product catalog's heterogeneous external hosts, not compatible with next/image's static remotePatterns allowlist
                      <img src={order.items[0].image} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 700 }}>INS</div>
                    )}
                  </div>
                  <div className={styles.orderInfo}>
                    <div className={styles.orderVenture}>Order {order.id}</div>
                    <div className={styles.orderDate}>{formatDate(order.timestamp)}</div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                      <div className={`${styles.orderStatus} ${styles[`status-${order.status}`]}`}>
                        {order.status.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                      {Array.isArray(order.items) 
                        ? `${order.items.length} items: ${order.items.slice(0, 2).map(i => i.name).join(', ')}${order.items.length > 2 ? '...' : ''}`
                        : `Items`
                      }
                    </div>
                  </div>
                </div>
                
                <div className={styles.orderRight}>
                  <div className={styles.orderAmount}>₹{order.total}</div>
                  <div className={styles.viewDetails}>
                    View Details <span>→</span>
                  </div>
                  {order.status !== 'DELIVERED' ? (
                    <button
                      className={styles.reorderBtn}
                      style={{ background: '#111', color: 'white', marginTop: '8px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/services/instastyle/order-tracking?id=${order.id}`);
                      }}
                    >
                      Track Order
                    </button>
                  ) : (
                    <button
                      className={styles.reorderBtn}
                      style={{ background: '#111', color: 'white', marginTop: '8px' }}
                      onClick={(e) => handleReorder(e, order)}
                    >
                      Order Again
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>No orders found</h2>
            <p>You haven't placed any InstaStyle orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
