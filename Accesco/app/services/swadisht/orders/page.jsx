'use client';

/**
 * Orders Page
 * @page /services/swadisht/orders
 * @description View order history and track orders
 */

import { useState } from 'react';
import Link from 'next/link';
import { SwadishttProvider } from '../contexts/SwadishttContext';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './orders.module.css';

const MOCK_ORDERS = [
  {
    id: 'SW12345',
    date: '2025-01-15',
    restaurant: 'Swadishtt Kitchen',
    items: [
      { name: 'Butter Chicken', quantity: 1, price: 350 },
      { name: 'Garlic Naan', quantity: 2, price: 60 }
    ],
    total: 470,
    status: 'delivered',
    deliveryTime: '30 mins'
  },
  {
    id: 'SW12344',
    date: '2025-01-14',
    restaurant: 'Green Leaf Pure Veg',
    items: [
      { name: 'Masala Dosa', quantity: 2, price: 120 },
      { name: 'Filter Coffee', quantity: 2, price: 60 }
    ],
    total: 360,
    status: 'delivered',
    deliveryTime: '25 mins'
  },
  {
    id: 'SW12343',
    date: '2025-01-13',
    restaurant: 'Biryani House',
    items: [
      { name: 'Hyderabadi Biryani', quantity: 1, price: 420 }
    ],
    total: 420,
    status: 'cancelled',
    deliveryTime: '—'
  }
];

function OrderCard({ order }) {
  const statusColors = {
    delivered: '#1C8B3C',
    cancelled: '#E23744',
    pending: '#FFB800'
  };

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <div>
          <div className={styles.orderId}>Order #{order.id}</div>
          <div className={styles.orderDate}>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
        <div 
          className={styles.orderStatus}
          style={{ background: `${statusColors[order.status]}20`, color: statusColors[order.status] }}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </div>
      </div>

      <div className={styles.orderRestaurant}>{order.restaurant}</div>

      <div className={styles.orderItems}>
        {order.items.map((item, idx) => (
          <div key={idx} className={styles.orderItem}>
            <span className={styles.itemName}>
              {item.name} × {item.quantity}
            </span>
            <span className={styles.itemPrice}>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className={styles.orderFooter}>
        <div className={styles.orderTotal}>
          <span>Total:</span>
          <span className={styles.totalAmount}>₹{order.total}</span>
        </div>
        <div className={styles.orderActions}>
          {order.status === 'delivered' && (
            <>
              <button className={styles.reorderBtn}>Reorder</button>
              <button className={styles.helpBtn}>Help</button>
            </>
          )}
          {order.status === 'cancelled' && (
            <button className={styles.helpBtn}>View Details</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [filter, setFilter] = useState('all');

  const filteredOrders = filter === 'all' 
    ? MOCK_ORDERS 
    : MOCK_ORDERS.filter(order => order.status === filter);

  return (
    <SwadishttProvider>
      <div className={styles.page}>
        <SwadishttHeader />
        
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>My Orders</h1>
            <div className={styles.filterTabs}>
              <button 
                className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`}
                onClick={() => setFilter('all')}
              >
                All Orders
              </button>
              <button 
                className={`${styles.filterTab} ${filter === 'delivered' ? styles.active : ''}`}
                onClick={() => setFilter('delivered')}
              >
                Delivered
              </button>
              <button 
                className={`${styles.filterTab} ${filter === 'cancelled' ? styles.active : ''}`}
                onClick={() => setFilter('cancelled')}
              >
                Cancelled
              </button>
            </div>
          </div>

          {filteredOrders.length > 0 ? (
            <div className={styles.ordersList}>
              {filteredOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📦</div>
              <h2 className={styles.emptyTitle}>No orders found</h2>
              <p className={styles.emptyText}>
                {filter === 'all' 
                  ? 'You haven\'t placed any orders yet'
                  : `No ${filter} orders`}
              </p>
              <Link href="/services/swadisht" className={styles.browseBtn}>
                Browse Restaurants
              </Link>
            </div>
          )}
        </div>
      </div>
    </SwadishttProvider>
  );
}
