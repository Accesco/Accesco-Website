'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import styles from './orders.module.css';

export default function UnifiedOrdersPage() {
  const router = useRouter();
  const [allOrders, setAllOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      try {
        const queryParam = user?.uid ? `userId=${encodeURIComponent(user.uid)}` : '';
        const res = await fetch(`/api/swadishtt/orders?${queryParam}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.orders)) {
            const mapped = data.orders.map((o) => ({
              ...o,
              venture: o.brand || o.venture || 'Swadishtt',
            }));
            setAllOrders(mapped);
          }
        }
      } catch (error) {
        console.error('Error loading combined orders:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [user]);

  const filteredOrders = useMemo(() => {
    let filtered = allOrders;
    
    if (filter !== 'all') {
      filtered = filtered.filter(o => o.venture === filter);
    }

    // Sorting
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      
      if (sortBy === 'date-desc') return dateB - dateA;
      if (sortBy === 'date-asc') return dateA - dateB;
      return 0;
    });
  }, [allOrders, filter, sortBy]);

  const getVentureClass = (venture) => {
    switch (venture) {
      case 'Grokly': return styles.grokly;
      case 'Swadishtt': return styles.swadishtt;
      case 'InstaStyle': return styles.instastyle;
      default: return '';
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Orders</h1>
      <p style={{ color: '#666', marginBottom: '40px', fontSize: '18px' }}>Select a venture to view your order history.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        <div 
          onClick={() => router.push('/services/grokly/orders')}
          style={{ background: '#fff', border: '1px solid #eee', padding: '32px', borderRadius: '24px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
          onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'}
          onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          <div style={{ width: '64px', height: '64px', background: '#0c831f', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: 800, margin: '0 auto 16px' }}>G</div>
          <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700 }}>Grokly Orders</h2>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Groceries & Essentials</p>
        </div>

        <div 
          onClick={() => router.push('/services/swadisht/orders')}
          style={{ background: '#fff', border: '1px solid #eee', padding: '32px', borderRadius: '24px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
          onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'}
          onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          <div style={{ width: '64px', height: '64px', background: '#e23744', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: 800, margin: '0 auto 16px' }}>S</div>
          <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700 }}>Swadishtt Orders</h2>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Gourmet Food Delivery</p>
        </div>

        <div 
          onClick={() => router.push('/services/instastyle/orders')}
          style={{ background: '#fff', border: '1px solid #eee', padding: '32px', borderRadius: '24px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
          onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'}
          onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          <div style={{ width: '64px', height: '64px', background: '#000', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: 800, margin: '0 auto 16px' }}>I</div>
          <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700 }}>InstaStyle Orders</h2>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Fashion & Apparel</p>
        </div>
      </div>
    </div>
  );
}
