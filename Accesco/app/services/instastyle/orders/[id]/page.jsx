'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import styles from '../../../../profile/orders/orders.module.css';

export default function InstaStyleOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { orders: contextOrders, addToCart, toggleCart } = useCart();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderId = params.id;

  useEffect(() => {
    const loadOrder = () => {
      setIsLoading(true);
      const allOrders = contextOrders || [];
      const found = allOrders.find(o => o.id === orderId);
      setOrder(found || null);
      setIsLoading(false);
    };

    loadOrder();
  }, [orderId, contextOrders]);

  const handleReorder = () => {
    if (!order || !order.items) return;
    
    // Add all items back to cart
    if (Array.isArray(order.items)) {
      order.items.forEach(item => {
        addToCart({
          id: item.id,
          name: item.name,
          brand: item.brand,
          price: item.price,
          discountedPrice: item.discountedPrice,
          images: [{ url: item.image }],
        }, item.selectedSize || 'M', item.selectedColor || 'Black', item.quantity);
      });
    }
    toggleCart();
  };

  if (isLoading) return <div className={styles.container}>Loading...</div>;
  if (!order) return <div className={styles.container}>Order not found</div>;

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <button 
          style={{ marginBottom: '24px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}
          onClick={() => router.push('/services/instastyle/orders')}
        >
          ← Back to Orders
        </button>

        <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
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
              style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #eee', background: 'white', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={handleReorder}
              onMouseOver={(e) => e.target.style.background = '#fcfcfc'}
              onMouseOut={(e) => e.target.style.background = 'white'}
            >
              Reorder All Items
            </button>
            {order.status !== 'DELIVERED' && (
              <button 
                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#111', color: 'white', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => router.push(`/services/instastyle/order-tracking?id=${order.id}`)}
              >
                Track Live Order
              </button>
            )}
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>Items Ordered</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {Array.isArray(order.items) && order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', border: '1px solid #eee', borderRadius: '12px' }}>
                  <div style={{ width: '64px', height: '64px', position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5' }}>
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element -- item.image comes from the product catalog's heterogeneous external hosts, not compatible with next/image's static remotePatterns allowlist
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{item.brand} {item.name}</div>
                    <div style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>
                      Size: {item.selectedSize} | Color: {item.selectedColor} | Qty: {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    ₹{(item.discountedPrice || item.price) * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Bill Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                <span>Item Total</span>
                <span>₹{order.subtotal || order.total - (order.deliveryFee || 0) - (order.tax || 0)}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                  <span>Delivery Fee</span>
                  <span>₹{order.deliveryFee}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                  <span>Taxes</span>
                  <span>₹{order.tax}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '18px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
                <span>Grand Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '40px', background: '#f9f9f9', padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Delivery Address</h3>
            <p style={{ color: '#555', margin: 0, lineHeight: 1.5 }}>
              {(order.shippingAddress || order.address) ? (
                <>
                  {(order.shippingAddress || order.address).fullName || (order.shippingAddress || order.address).name}<br/>
                  {(order.shippingAddress || order.address).street || (order.shippingAddress || order.address).address}<br/>
                  {(order.shippingAddress || order.address).city}, {(order.shippingAddress || order.address).state} {(order.shippingAddress || order.address).pincode || (order.shippingAddress || order.address).zipCode}<br/>
                  Phone: {(order.shippingAddress || order.address).phone}
                </>
              ) : (
                'Standard Delivery'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}