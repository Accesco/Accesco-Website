'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';

const VENTURE_ROUTES = {
  Grokly: { api: '/api/grokly/orders', path: '/services/grokly/order-tracking' },
  Swadishtt: { api: '/api/swadishtt/orders', path: '/services/swadisht/order-tracking' },
  InstaStyle: { api: '/api/instastyle/orders', path: '/services/instastyle/order-tracking' },
};

export default function ActiveOrdersWidget({ venture } = {}) {
  const { user, uid, getIdToken } = useAuth();
  const [activeOrders, setActiveOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const currentIdentifier = user?.uid || uid;
    if (!currentIdentifier && !user?.email) return;

    let cancelled = false;

    const loadActiveOrders = async () => {
      try {
        let authHeaders = {};
        if (user?.uid) {
          const token = await getIdToken();
          if (token) authHeaders = { Authorization: `Bearer ${token}`, 'x-user-id': user.uid };
        }

        const queryParam = user?.uid
          ? `userId=${encodeURIComponent(user.uid)}`
          : user?.email
          ? `email=${encodeURIComponent(user.email)}`
          : `userId=${encodeURIComponent(currentIdentifier)}`;

        const ventures = venture ? [venture] : Object.keys(VENTURE_ROUTES);

        const results = await Promise.all(
          ventures.map((v) =>
            fetch(`${VENTURE_ROUTES[v].api}?${queryParam}`, { headers: authHeaders })
              .then((res) => (res.ok ? res.json() : { orders: [] }))
              .then((data) => (data.orders || []).map((o) => ({ ...o, venture: v, path: VENTURE_ROUTES[v].path })))
              .catch(() => [])
          )
        );

        const combined = results.flat().filter((o) => o.status !== 'DELIVERED');
        if (!cancelled) {
          setActiveOrders(combined);
        }
      } catch (error) {
        console.error('Error loading active orders:', error);
      }
    };

    loadActiveOrders();
    const interval = setInterval(loadActiveOrders, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [venture, user, uid, getIdToken]);

  if (activeOrders.length === 0) return null;

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '20px auto 0',
      padding: '0 clamp(20px, 4vw, 40px)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '20px',
        border: '1px solid rgba(122,0,66,0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, fontFamily: 'Sora' }}>Active Orders</h3>
          <button 
            onClick={() => router.push('/profile')}
            style={{ background: 'none', border: 'none', color: '#7A0042', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
          >
            View All History →
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {activeOrders.map(order => (
            <div 
              key={order.id}
              style={{
                flex: '0 0 auto',
                width: 'clamp(260px, 80vw, 300px)',
                background: '#f9f9f9',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid #eee',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ 
                  fontWeight: 800, 
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: order.venture === 'Grokly' ? '#0c831f' : order.venture === 'Swadishtt' ? '#E23744' : '#111'
                }}>
                  {order.venture}
                </span>
                <span style={{ fontSize: '12px', color: '#999' }}>#{order.id.split('-')[1]?.slice(-4) || order.id.slice(-4)}</span>
              </div>

              <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: '#1a1a1a' }}>
                {order.status.replace(/_/g, ' ')}
              </div>

              <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px', minHeight: '36px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {Array.isArray(order.items) 
                  ? order.items.map(item => item.name).filter(Boolean).join(', ') || 'Items'
                  : Object.keys(order.items || {}).join(', ')}
              </div>

              <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '15px' }}>
                {Array.isArray(order.items) ? order.items.length : Object.keys(order.items || {}).length} {Array.isArray(order.items) && order.items.length === 1 ? 'item' : 'items'} • ₹{order.total}
              </div>

              <div style={{ height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden', marginBottom: '18px' }}>
                <div style={{ 
                  height: '100%', 
                  background: order.venture === 'Grokly' ? '#0c831f' : order.venture === 'Swadishtt' ? '#E23744' : '#111',
                  width: order.status === 'PLACED' ? '25%' : order.status === 'CONFIRMED' ? '50%' : order.status === 'PACKING' ? '75%' : '90%',
                  transition: 'width 1s ease-in-out'
                }} />
              </div>

              {/* Mini Map Tracking Preview */}
              {['CONFIRMED', 'PACKING', 'DELIVERED'].includes(order.status) && (
                <div style={{ 
                  height: '80px', 
                  width: '100%', 
                  background: '#eee', 
                  borderRadius: '12px', 
                  marginBottom: '15px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid #ddd'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url("https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/77.5946,12.9716,14/300x80?access_token=pk.eyJ1IjoiYWNjZXNjbyIsImEiOiJjbHU0bm16bmIwMDRqMmtueHV6bm56bm56In0.X-X-X")',
                    backgroundSize: 'cover'
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: order.venture === 'Grokly' ? '#0c831f' : '#E23744',
                    boxShadow: '0 0 10px white'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '6px',
                    background: 'rgba(255,255,255,0.9)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '9px',
                    fontWeight: 700
                  }}>
                    LIVE TRACKING
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => router.push(`${order.path}?id=${order.id}`)}
                  style={{
                    flex: 2,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: order.venture === 'Grokly' ? '#0c831f' : order.venture === 'Swadishtt' ? '#E23744' : '#111',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Track Order
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/profile/orders/${order.id}`);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    background: '#fff',
                    color: '#333',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
