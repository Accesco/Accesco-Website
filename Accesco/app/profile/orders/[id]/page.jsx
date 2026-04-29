'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import styles from '../orders.module.css';

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderId = params.id;
  const venture = searchParams.get('venture');

  useEffect(() => {
    const loadOrder = () => {
      setIsLoading(true);
      try {
        let storageKey = '';
        if (venture === 'Grokly') storageKey = 'grokly_orders';
        else if (venture === 'Swadishtt') storageKey = 'swadishtt-orders';
        else if (venture === 'InstaStyle') storageKey = 'instastyle_orders';

        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const orders = JSON.parse(raw);
          const found = orders.find(o => o.id === orderId);
          setOrder(found);
        }
      } catch (error) {
        console.error('Error loading order details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [orderId, venture]);

  if (isLoading) return <div className={styles.container}>Loading...</div>;
  if (!order) return <div className={styles.container}>Order not found</div>;

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <button 
        style={{ marginBottom: '24px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
        onClick={() => router.back()}
      >
        ← Back to Orders
      </button>

      <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #eee' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px' }}>Order Details</h1>
            <p style={{ color: '#666', margin: 0 }}>Order ID: {order.id}</p>
            <p style={{ color: '#666', margin: 0 }}>Placed on: {formatDate(order.timestamp)}</p>
          </div>
          <div className={`${styles.orderStatus} ${styles[`status-${order.status}`]}`} style={{ height: 'fit-content' }}>
            {order.status.replace(/_/g, ' ')}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
          <button 
            style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #eee', background: 'white', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => alert(`Reordering from ${order.venture}...`)}
          >
            Reorder All Items
          </button>
          {order.status !== 'DELIVERED' && (
            <button 
              style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#7A0042', color: 'white', fontWeight: 700, cursor: 'pointer' }}
              onClick={() => {
                const path = order.venture === 'Grokly' ? '/services/grokly/order-tracking' : 
                             order.venture === 'Swadishtt' ? '/services/swadisht/order-tracking' : 
                             '/services/instastyle/order-tracking';
                router.push(`${path}?id=${order.id}`);
              }}
            >
              Track Live Order
            </button>
          )}
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Items</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Array.isArray(order.items) ? (
              // Swadishtt or InstaStyle (Array)
              order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.name} x {item.quantity || 1}</span>
                  <span style={{ fontWeight: 600 }}>₹{item.price * (item.quantity || 1)}</span>
                </div>
              ))
            ) : (
              // Grokly (Object)
              Object.entries(order.items).map(([id, qty], idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Product {id} x {qty}</span>
                  <span style={{ fontWeight: 600 }}>-</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Bill Summary</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
              <span>Item Total</span>
              <span>₹{order.subtotal || order.total}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
              <span>Platform Fee</span>
              <span>₹{order.platformFee || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '18px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
              <span>Grand Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '40px', background: '#f9f9f9', padding: '20px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Delivery Address</h3>
          <p style={{ color: '#666', margin: 0 }}>
            {typeof order.location === 'string' ? order.location : order.location?.area || 'Address details in history'}
          </p>
        </div>
      </div>
    </div>
  );
}
