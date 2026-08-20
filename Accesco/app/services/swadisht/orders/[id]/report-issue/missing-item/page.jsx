'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import SwadishttHeader from '../../../../components/SwadishttHeader';
import styles from './missing-item.module.css';

const DEFAULT_ORDER_ITEMS = [
  { id: 'i1', name: 'Butter Naan', qty: 2, price: 60, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=100&q=80' },
  { id: 'i2', name: 'Raita', qty: 1, price: 40, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=100&q=80' },
  { id: 'i3', name: 'Coke (250ml)', qty: 1, price: 40, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&q=80' },
];

export default function SwadishttMissingItemPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const issueType = searchParams.get('type') || 'missing';

  const orderId = params.id || '12345';
  const [items, setItems] = useState(DEFAULT_ORDER_ITEMS);
  const [selectedItemIds, setSelectedItemIds] = useState(['i1']);
  const [details, setDetails] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/swadishtt/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order && Array.isArray(data.order.items) && data.order.items.length > 0) {
            setItems(data.order.items.map((it, i) => ({
              id: it.id || `item_${i}`,
              name: it.name,
              qty: it.quantity || 1,
              price: it.price,
              image: it.image || 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=100&q=80',
            })));
            setSelectedItemIds([data.order.items[0]?.id || 'item_0']);
          }
        }
      } catch (e) {
        console.error('Failed to fetch order details:', e);
      }
    }
    loadOrder();
  }, [orderId]);

  const toggleSelect = (id) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const mockUrls = files.map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...mockUrls]);
    }
  };

  const handleConfirm = async () => {
    if (selectedItemIds.length === 0) return;
    setIsSubmitting(true);

    const selectedItems = items.filter(i => selectedItemIds.includes(i.id));
    const refundTotal = selectedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const payload = {
      orderId,
      issueType,
      items: selectedItems,
      details,
      photos,
      refundTotal,
      greenPoints: 10,
      timestamp: new Date().toISOString(),
    };

    try {
      // API Call directly to backend/Firestore
      await fetch(`/api/swadishtt/orders/${orderId}/report-issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      router.push(`/services/swadisht/orders/${orderId}/report-issue/issue-reported`);
    } catch (e) {
      console.error('Report submission failed:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      <div className={styles.container}>
        <button className={styles.backIconBtn} onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <h1 className={styles.title}>
          {issueType === 'wrong' ? 'Wrong Item' : issueType === 'quality' ? 'Food Quality Issue' : 'Missing Item'}
        </h1>

        <div className={styles.promptSection}>
          <h2 className={styles.promptTitle}>Tell us more</h2>
          <p className={styles.promptSub}>
            Please provide details about the {issueType === 'missing' ? 'missing item' : 'issue'}.
          </p>
        </div>

        <div className={styles.sectionLabel}>SELECT MISSING ITEM(S)</div>

        <div className={styles.itemsList}>
          {items.map((item) => {
            const isChecked = selectedItemIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`${styles.itemCard} ${isChecked ? styles.itemCardChecked : ''}`}
                onClick={() => toggleSelect(item.id)}
              >
                <div className={`${styles.checkbox} ${isChecked ? styles.checkboxChecked : ''}`}>
                  {isChecked && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>

                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.itemImg}
                  onError={e => { e.currentTarget.src = 'https://placehold.co/48x48/FFF0E8/B62025/png?text=🍛'; }}
                />

                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemQty}>x {item.qty}</div>
                  <div className={styles.itemPrice}>₹{item.price * item.qty}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.inputLabel}>Add more details (optional)</label>
          <div className={styles.textareaWrap}>
            <textarea
              className={styles.textarea}
              rows={3}
              placeholder="Let us know if there's anything else we should know..."
              maxLength={200}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
            <div className={styles.charCounter}>{details.length}/200</div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.inputLabel}>Add photos (optional)</label>
          <label className={styles.uploadArea}>
            <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} hidden />
            <div className={styles.uploadIconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5722" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <span className={styles.uploadText}>Upload images</span>
          </label>

          {photos.length > 0 && (
            <div className={styles.photoPreviewGrid}>
              {photos.map((url, idx) => (
                <img key={idx} src={url} alt="upload preview" className={styles.photoThumb} />
              ))}
            </div>
          )}
        </div>

        <button
          className={styles.confirmBtn}
          onClick={handleConfirm}
          disabled={selectedItemIds.length === 0 || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
}