'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './report-issue.module.css';

const RECENT_ORDERS = [
  {
    id: 'AC-2041',
    date: 'Today',
    status: 'Packed',
    items: [
      { id: 'oi_1', name: 'ZARA Wool Blend Blazer', size: 'M', color: 'Beige', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&q=80' },
      { id: 'oi_2', name: 'H&M Linen Trousers', size: '32', color: 'Olive', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&q=80' },
    ],
  },
  {
    id: 'AC-1972',
    date: '2 days ago',
    status: 'Delivered',
    items: [
      { id: 'oi_3', name: 'Mango Striped Shirt', size: 'L', color: 'Navy/White', img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=100&q=80' },
      { id: 'oi_4', name: 'Uniqlo Ribbed Top', size: 'S', color: 'Ivory', img: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=100&q=80' },
    ],
  },
  {
    id: 'AC-1890',
    date: 'Last week',
    status: 'Returned',
    items: [
      { id: 'oi_5', name: 'Vintage Denim Jacket', size: 'M', color: 'Light Wash', img: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=100&q=80' },
    ],
  },
];

const ISSUE_TYPES = [
  {
    id: 'size_fit',
    title: 'Size or Fit Issue',
    desc: 'Item does not match expected size or fit preference.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
        <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0l12.6 12.6z" />
        <path d="m14.5 12.5 2-2" />
        <path d="m11.5 9.5 2-2" />
        <path d="m8.5 6.5 2-2" />
      </svg>
    ),
  },
  {
    id: 'damaged',
    title: 'Damaged or Defective',
    desc: 'Arrived with fabric damage, stain, or missing tag.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
        <path d="m12 15 2 2 4-4" />
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M7 7h.01" />
      </svg>
    ),
  },
  {
    id: 'wrong_item',
    title: 'Wrong Product Received',
    desc: 'Different color, size, or item was delivered.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    id: 'quality',
    title: 'Condition Misrepresentation',
    desc: 'Item condition differs from listed AI condition grade.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: 'missing',
    title: 'Missing Item in Package',
    desc: 'An item from the order was not included.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

export default function InstaStyleReportIssuePage() {
  const router = useRouter();

  const [step, setStep] = useState(1); // 1: select order+item, 2: select issue, 3: details, 4: confirmed
  const [selectedOrder, setSelectedOrder] = useState(RECENT_ORDERS[0]);
  const [selectedItem, setSelectedItem] = useState(RECENT_ORDERS[0].items[0]);
  const [selectedType, setSelectedType] = useState('size_fit');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      orderId: selectedOrder.id,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      issueType: selectedType,
      details,
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch('/api/instastyle/report-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((err) => console.error(err));

      setStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
          aria-label="Go back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className={styles.headerTitle}>Report an Issue</h1>
        <div style={{ width: 36 }} />
      </header>

      {/* Step Progress Bar */}
      {step < 4 && (
        <div className={styles.stepBar}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`${styles.stepDot} ${step >= s ? styles.stepDotActive : ''}`}
            />
          ))}
        </div>
      )}

      <main className={styles.container}>
        {/* Step 1: Select Order & Item */}
        {step === 1 && (
          <div className={styles.card}>
            <div className={styles.sectionLabel}>SELECT ORDER</div>

            <div className={styles.orderList}>
              {RECENT_ORDERS.map((order) => (
                <div
                  key={order.id}
                  className={`${styles.orderCard} ${selectedOrder.id === order.id ? styles.orderCardSelected : ''}`}
                  onClick={() => { setSelectedOrder(order); setSelectedItem(order.items[0]); }}
                >
                  <div className={styles.orderCardLeft}>
                    <div className={styles.orderIdTag}>#{order.id}</div>
                    <div className={styles.orderMeta}>{order.date} • {order.items.length} items</div>
                  </div>
                  <div className={`${styles.statusBadge} ${styles[`status_${order.status.toLowerCase()}`]}`}>
                    {order.status}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.sectionLabel} style={{ marginTop: 24 }}>SELECT ITEM IN ORDER #{selectedOrder.id}</div>
            <div className={styles.itemList}>
              {selectedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.itemCard} ${selectedItem.id === item.id ? styles.itemCardSelected : ''}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className={styles.itemCardImg}
                    onError={(e) => { e.target.src = 'https://placehold.co/80x80/F5F5F5/111111?text=Item'; }}
                  />
                  <div className={styles.itemCardInfo}>
                    <div className={styles.itemCardName}>{item.name}</div>
                    <div className={styles.itemCardMeta}>Size {item.size} • {item.color}</div>
                  </div>
                </div>
              ))}
            </div>

            <button className={styles.nextBtn} onClick={() => setStep(2)}>
              Next: Choose Issue Category →
            </button>
          </div>
        )}

        {/* Step 2: Choose Issue Category */}
        {step === 2 && (
          <div className={styles.card}>
            <div className={styles.selectedItemPreview}>
              <img
                src={selectedItem.img}
                alt={selectedItem.name}
                className={styles.previewImg}
                onError={(e) => { e.target.src = 'https://placehold.co/60x60/F5F5F5/111111?text=Item'; }}
              />
              <div>
                <div className={styles.previewName}>{selectedItem.name}</div>
                <div className={styles.previewMeta}>Order #{selectedOrder.id}</div>
              </div>
            </div>

            <div className={styles.sectionLabel}>SELECT ISSUE CATEGORY</div>
            <div className={styles.optionsList}>
              {ISSUE_TYPES.map((type) => {
                const isSelected = selectedType === type.id;
                return (
                  <div
                    key={type.id}
                    className={`${styles.optionCard} ${isSelected ? styles.optionCardSelected : ''}`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className={styles.optionIconWrap}>{type.icon}</div>
                    <div className={styles.optionContent}>
                      <div className={styles.optionTitle}>{type.title}</div>
                      <div className={styles.optionDesc}>{type.desc}</div>
                    </div>
                    <div className={`${styles.radioCircle} ${isSelected ? styles.radioSelected : ''}`}>
                      {isSelected && <div className={styles.radioInnerDot} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <button className={styles.nextBtn} onClick={() => setStep(3)}>
              Next: Add Details →
            </button>
          </div>
        )}

        {/* Step 3: Details & Submit */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className={styles.card}>
            <div className={styles.selectedItemPreview}>
              <img
                src={selectedItem.img}
                alt={selectedItem.name}
                className={styles.previewImg}
                onError={(e) => { e.target.src = 'https://placehold.co/60x60/F5F5F5/111111?text=Item'; }}
              />
              <div>
                <div className={styles.previewName}>{selectedItem.name}</div>
                <div className={styles.previewMeta}>
                  {ISSUE_TYPES.find(t => t.id === selectedType)?.title}
                </div>
              </div>
            </div>

            <div className={styles.sectionLabel}>DESCRIBE THE ISSUE</div>
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Additional Details (optional)</label>
              <textarea
                className={styles.textarea}
                rows={4}
                placeholder="Provide specific details about the issue with your item..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <div className={styles.summaryBox}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Order ID</span>
                <span className={styles.summaryVal}>#{selectedOrder.id}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Item</span>
                <span className={styles.summaryVal}>{selectedItem.name}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Category</span>
                <span className={styles.summaryVal}>{ISSUE_TYPES.find(t => t.id === selectedType)?.title}</span>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting Report...' : 'Submit Issue Report'}
            </button>
          </form>
        )}

        {/* Step 4: Confirmed */}
        {step === 4 && (
          <div className={styles.confirmedCard}>
            <div className={styles.checkCircle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className={styles.confirmedHeading}>Report Submitted</h2>
            <p className={styles.confirmedText}>
              Our support team has received your report for <strong>{selectedItem.name}</strong> (Order #{selectedOrder.id}).
              We will review and resolve this within <strong>24 hours</strong>.
            </p>
            <button type="button" className={styles.submitBtn} onClick={() => router.push('/services/instastyle/profile')}>
              Back to Profile
            </button>
            <button type="button" className={styles.secondaryBtn} onClick={() => router.push('/services/instastyle/orders')}>
              View Orders
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
