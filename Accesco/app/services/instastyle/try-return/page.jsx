'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import { updateWalletBalanceInFirebase } from '@/lib/userService';
import styles from './try-return.module.css';

const RETURNABLE_ITEMS = [
  {
    id: 'item_1',
    brand: 'ZARA',
    name: 'Wool Blend Blazer',
    size: 'M',
    color: 'Beige',
    price: 899,
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80',
    orderId: 'AC-2041',
  },
  {
    id: 'item_2',
    brand: 'H&M',
    name: 'Linen Relaxed Trousers',
    size: '32',
    color: 'Olive Green',
    price: 1349,
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=80',
    orderId: 'AC-2041',
  },
  {
    id: 'item_3',
    brand: 'Mango',
    name: 'Striped Oversized Shirt',
    size: 'L',
    color: 'Navy / White',
    price: 2199,
    img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&q=80',
    orderId: 'AC-1972',
  },
  {
    id: 'item_4',
    brand: 'Uniqlo',
    name: 'Ribbed Cotton Top',
    size: 'S',
    color: 'Ivory',
    price: 799,
    img: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=200&q=80',
    orderId: 'AC-1972',
  },
  {
    id: 'item_5',
    brand: 'InstaStyle Thrift',
    name: 'Vintage Denim Jacket',
    size: 'M',
    color: 'Light Wash',
    price: 1499,
    img: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=200&q=80',
    orderId: 'AC-1890',
  },
];

const RETURN_REASONS = [
  {
    id: 'size',
    label: "Size doesn't fit",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
        <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0l12.6 12.6z" />
        <path d="m14.5 12.5 2-2" />
        <path d="m11.5 9.5 2-2" />
        <path d="m8.5 6.5 2-2" />
      </svg>
    ),
  },
  {
    id: 'quality',
    label: 'Quality not as expected',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: 'changed_mind',
    label: 'Changed my mind',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
  },
  {
    id: 'wrong_item',
    label: 'Wrong item received',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
];

export default function InstaStyleTryReturnPage() {
  const { user, uid, getIdToken } = useAuth();
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(RETURNABLE_ITEMS[0]);
  const [selectedReason, setSelectedReason] = useState('size');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showItemPicker, setShowItemPicker] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (user?.uid) {
        const token = await getIdToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
          headers['x-user-id'] = user.uid;
        }
      }
      await fetch('/api/instastyle/try-return', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          itemId: selectedItem.id,
          name: `${selectedItem.brand} ${selectedItem.name}`,
          refundAmount: selectedItem.price,
          refundMethod: 'Circular Credits',
          orderId: selectedItem.orderId,
          reason: selectedReason,
        }),
      }).catch(e => console.error(e));

      // Credit circular credits in Firebase
      const targetUid = user?.uid || uid;
      if (targetUid) {
        const currentBal = Number(user?.walletBalance || 0);
        const newCredits = currentBal + selectedItem.price;
        const newAct = {
          id: `act_tr_${Date.now()}`,
          type: 'earned',
          title: 'Try & Return Completed',
          sub: `${selectedItem.brand} ${selectedItem.name}`,
          amt: `+${selectedItem.price}`,
          amount: selectedItem.price,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        };
        await updateWalletBalanceInFirebase(targetUid, newCredits, newAct);
      }

      setIsConfirmed(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className={styles.headerTitle}>Try & Return</h1>
        <div style={{ width: 36 }} />
      </header>

      <main className={styles.container}>
        {!isConfirmed ? (
          <>
            <div className={styles.sectionLabel}>RETURNING ITEM</div>

            {/* Selected Product Card Box */}
            <div className={styles.productCard}>
              <img
                src={selectedItem.img}
                alt={selectedItem.name}
                className={styles.productImg}
                onError={(e) => { e.target.src = 'https://placehold.co/200x200/F5F5F5/111111?text=Item'; }}
              />
              <div className={styles.productInfo}>
                <span className={styles.brandName}>{selectedItem.brand}</span>
                <h2 className={styles.productTitle}>{selectedItem.name}</h2>
                <div className={styles.productMeta}>Size {selectedItem.size} • {selectedItem.color}</div>
                <div className={styles.productOrderId}>Order #{selectedItem.orderId}</div>
                <div className={styles.productPrice}>₹{selectedItem.price.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Change Item Button */}
            <button className={styles.changeItemBtn} onClick={() => setShowItemPicker(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              Select Different Item
            </button>

            {/* Return Reason */}
            <div className={styles.sectionLabel} style={{ marginTop: 28 }}>SELECT RETURN REASON</div>
            <div className={styles.reasonList}>
              {RETURN_REASONS.map((reason) => (
                <div
                  key={reason.id}
                  className={`${styles.reasonCard} ${selectedReason === reason.id ? styles.reasonCardSelected : ''}`}
                  onClick={() => setSelectedReason(reason.id)}
                >
                  <div className={styles.reasonIconWrap}>{reason.icon}</div>
                  <span className={styles.reasonLabel}>{reason.label}</span>
                  <div className={`${styles.reasonRadio} ${selectedReason === reason.id ? styles.reasonRadioSelected : ''}`}>
                    {selectedReason === reason.id && <div className={styles.reasonRadioDot} />}
                  </div>
                </div>
              ))}
            </div>

            {/* Method Box */}
            <div className={styles.sectionLabel} style={{ marginTop: 28 }}>PICKUP METHOD</div>
            <div className={styles.methodCard}>
              <div>
                <div className={styles.methodTitle}>Return with Next Delivery</div>
                <div className={styles.methodSub}>Hand over item to our agent during your upcoming order delivery. Free & contactless.</div>
              </div>
              <div className={styles.calendarIconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>

            {/* Summary Box */}
            <div className={styles.sectionLabel} style={{ marginTop: 28 }}>REFUND SUMMARY</div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Item</span>
                <span className={styles.summaryValBold}>{selectedItem.brand} {selectedItem.name}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Refund Method</span>
                <span className={styles.summaryValBold}>Circular Credits</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Estimated Refund</span>
                <span className={styles.summaryValPrice}>₹{selectedItem.price.toLocaleString('en-IN')}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Credits to be Earned</span>
                <span className={styles.summaryValGreen}>+{selectedItem.price} pts</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Refund Timeline</span>
                <div className={styles.summaryRightGroup}>
                  <span className={styles.summaryValBold}>Within 24–48 hours of</span>
                  <span className={styles.summarySubLabel}>item verification</span>
                </div>
              </div>
            </div>

            <button className={styles.confirmBtn} onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? 'Processing Return...' : 'Confirm Return'}
            </button>

            <button className={styles.continueShopBtn} onClick={() => router.push('/services/instastyle/catalog')}>
              Continue Shopping
            </button>
          </>
        ) : (
          <div className={styles.confirmedWrap}>
            <div className={styles.checkCircle}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className={styles.confirmedHeading}>Return Request Confirmed</h2>
            <p className={styles.confirmedText}>
              Your return for <strong>{selectedItem.brand} {selectedItem.name}</strong> has been scheduled.
              <br />
              <strong>₹{selectedItem.price.toLocaleString('en-IN')} Circular Credits</strong> will be credited to your account upon pickup verification.
            </p>
            <button className={styles.confirmBtn} onClick={() => router.push('/services/instastyle/circular-credits')}>
              View Circular Credits
            </button>
            <button className={styles.continueShopBtn} onClick={() => router.push('/services/instastyle/profile')}>
              Back to Profile
            </button>
          </div>
        )}
      </main>

      {/* Item Picker Modal */}
      {showItemPicker && (
        <div className={styles.modalOverlay} onClick={() => setShowItemPicker(false)}>
          <div className={styles.itemPickerSheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHeader}>
              <h3 className={styles.sheetTitle}>Select Item to Return</h3>
              <button className={styles.sheetClose} onClick={() => setShowItemPicker(false)}>✕</button>
            </div>
            <div className={styles.itemPickerList}>
              {RETURNABLE_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.pickerItem} ${selectedItem.id === item.id ? styles.pickerItemSelected : ''}`}
                  onClick={() => { setSelectedItem(item); setShowItemPicker(false); }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className={styles.pickerImg}
                    onError={(e) => { e.target.src = 'https://placehold.co/80x80/F5F5F5/111111?text=Item'; }}
                  />
                  <div className={styles.pickerInfo}>
                    <span className={styles.pickerBrand}>{item.brand}</span>
                    <div className={styles.pickerName}>{item.name}</div>
                    <div className={styles.pickerMeta}>Size {item.size} • {item.color} • Order #{item.orderId}</div>
                  </div>
                  <div className={styles.pickerPrice}>₹{item.price.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
