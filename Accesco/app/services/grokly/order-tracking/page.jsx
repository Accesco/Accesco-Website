'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGrokly } from '../contexts/GroklyContext';
import styles from './tracking.module.css';
import Link from 'next/link';

function GroklyTrackingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const eta = searchParams.get('eta')
  const { orders } = useGrokly();
  
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className={styles.container}>
        <h1>Order not found</h1>
        <Link href="/services/grokly">Back to Shopping</Link>
      </div>
    );
  }

  const steps = [
    { label: 'Order Placed', status: 'PLACED' },
    { label: 'Confirmed', status: 'CONFIRMED' },
    { label: 'Packing', status: 'PACKING' },
    { label: 'Out for Delivery', status: 'OUT_FOR_DELIVERY' },
    { label: 'Delivered', status: 'DELIVERED' }
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.orderInfo}>
          <h1>Track Order {order.id}</h1>
          <p>Estimated arrival time: {eta}</p>
        </div>
        <div className={styles.statusBadge} data-status={order.status}>
          {order.status.replace(/_/g, ' ')}
        </div>
      </header>

      <div className={styles.trackingCard}>
        <div className={styles.timeline}>
          {steps.map((step, index) => (
            <div 
              key={step.status} 
              className={`${styles.step} ${index <= currentStepIndex ? styles.active : ''} ${index === currentStepIndex ? styles.current : ''}`}
            >
              <div className={styles.stepDot}>
                {index < currentStepIndex ? <i className="ri-check-line" style={{ fontSize: '14px' }}></i> : index + 1}
              </div>
              <div className={styles.stepLabel}>{step.label}</div>
              {index < steps.length - 1 && <div className={styles.stepLine} />}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.detailsColumn}>
          <div className={styles.detailSection}>
            <h2>Delivery Address</h2>
            <div className={styles.detailCard}>
              <div className={styles.iconBox}><i className="ri-map-pin-2-fill"></i></div>
              <div>
                <strong>{order.customerName}</strong>
                <p>{order.address}</p>
                <p className={styles.phone}>{order.phone}</p>
              </div>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h2>Payment Method</h2>
            <div className={styles.detailCard}>
              <div className={styles.iconBox}><i className="ri-bank-card-fill"></i></div>
              <div>
                <strong>{order.paymentMethod}</strong>
                <p>Transaction ID: TXN{order.id.split('-')[1]}</p>
              </div>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h2>Delivery Partner</h2>
            <div className={styles.partnerCard}>
              <div className={styles.avatar}>GP</div>
              <div>
                <strong>Grokly Partner</strong>
                <p>Verified Farmer-Direct Courier</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.orderItems}>
          <h2>Order Summary</h2>
          <div className={styles.itemsList}>
            {order.items.map(item => (
              <div key={item.id} className={styles.item}>
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <hr className={styles.divider} />
          <div className={styles.billRow}>
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className={styles.billRow}>
            <span>Delivery Fee</span>
            <span>₹{order.deliveryFee}</span>
          </div>
          <div className={styles.total}>
            <span>Total Paid</span>
            <span>₹{order.total}</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/services/grokly/profile" className={styles.profileBtn}>Go to My Orders</Link>
        <Link href="/services/grokly" className={styles.shopBtn}>Continue Shopping</Link>
      </div>
    </div>
  );
}

export default function GroklyTracking() {
  return (
    <Suspense fallback={<div className={styles.container}><p>Loading order...</p></div>}>
      <GroklyTrackingContent />
    </Suspense>
  );
}