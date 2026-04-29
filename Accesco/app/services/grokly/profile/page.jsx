'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGrokly } from '../contexts/GroklyContext';
import ActiveOrdersWidget from '@/components/ActiveOrdersWidget';
import styles from './profile.module.css';

export default function GroklyProfile() {
  const { orders } = useGrokly();
  
  const [profile, setProfile] = useState({
    name: 'Accesco Customer',
    phone: '+91 9022217637',
    email: 'customer@accesco.in',
    address: 'Jaladarshini Layout, Bengaluru'
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className={styles.profileContainer}>
      <header className={styles.header}>
        <div className={styles.avatar}>
          {profile.name.charAt(0)}
        </div>
        <div className={styles.userInfo}>
          <h1>{profile.name}</h1>
          <p>{profile.phone} • {profile.email}</p>
        </div>
      </header>

      <ActiveOrdersWidget venture="Grokly" />

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Order History</h2>
          <span className={styles.count}>{orders.length} orders</span>
        </div>

        {orders.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No orders yet</p>
            <Link href="/services/grokly" className={styles.shopBtn}>Start Shopping</Link>
          </div>
        ) : (
          <div className={styles.orderList}>
            {orders.map(order => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderMain}>
                  <div className={styles.orderId}>{order.id}</div>
                  <div className={styles.orderDate}>{formatDate(order.timestamp)}</div>
                  <div className={styles.orderItems}>
                    {order.items.length} items • ₹{order.total}
                  </div>
                </div>
                <div className={styles.orderStatus} data-status={order.status}>
                  {order.status.replace(/_/g, ' ')}
                </div>
                <Link href={`/services/grokly/order-tracking?id=${order.id}`} className={styles.trackLink}>
                  Track →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>Account Settings</h2>
        <div className={styles.settingsGrid}>
          <div className={styles.settingsCard}>
            <h3>Saved Address</h3>
            <p>{profile.address}</p>
            <button className={styles.editBtn}>Edit</button>
          </div>
          <div className={styles.settingsCard}>
            <h3>Payment Methods</h3>
            <p>Saved UPI IDs, Cards</p>
            <button className={styles.editBtn}>Manage</button>
          </div>
        </div>
      </section>
    </div>
  );
}
