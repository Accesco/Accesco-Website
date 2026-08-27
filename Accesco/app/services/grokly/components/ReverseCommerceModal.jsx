'use client';

/**
 * ReverseCommerceModal
 * Zepto-style "Return Packaging" flow:
 *  Screen 1 – Select Items to Return (from current cart's returnable products)
 *  Screen 2 – Return Confirmed summary + Green Points earned
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ReverseCommerceModal.module.css';

const CREDIT_PER_ITEM = 10; // ₹10 per returnable item

export default function ReverseCommerceModal({ isOpen, onClose, cartReturnableItems = [], onConfirm, confirmedItems = [] }) {
  const [screen, setScreen] = useState('select'); // 'select' | 'confirmed'
  const [selected, setSelected] = useState({});

  // Pre-populate with any already-confirmed selections
  useEffect(() => {
    if (isOpen) {
      setScreen('select');
      const preSelected = {};
      confirmedItems.forEach(item => {
        preSelected[item.id] = true;
      });
      setSelected(preSelected);
    }
  }, [isOpen]);

  const toggleItem = (id) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedItems = cartReturnableItems.filter(item => selected[item.product.id]);
  const totalCredits = selectedItems.reduce((sum, item) => sum + (item.quantity * CREDIT_PER_ITEM), 0);
  const co2Saved = parseFloat((selectedItems.reduce((sum, item) => sum + item.quantity, 0) * 0.25).toFixed(2));

  const handleConfirm = () => {
    onConfirm(selectedItems.map(i => ({
      id: i.product.id,
      name: i.product.name,
      image: i.product.image,
      quantity: i.quantity,
      creditsEarned: i.quantity * CREDIT_PER_ITEM,
    })));
    setScreen('confirmed');
  };

  const handleDone = () => {
    onClose();
    setTimeout(() => setScreen('select'), 300);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={handleDone} aria-label="Close return modal" />

      {/* Sheet */}
      <div className={styles.sheet} role="dialog" aria-modal="true" aria-label="Reverse Commerce: Return Packaging">
        {/* Handle */}
        <div className={styles.handle} />

        {/* ── SCREEN 1: Select Items ── */}
        {screen === 'select' && (
          <>
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <span className={styles.ecoBadge}>Eco Return</span>
                <h2 className={styles.title}>Return Packaging</h2>
                <p className={styles.subtitle}>
                  Select items whose packaging you want to return. Earn <strong>₹{CREDIT_PER_ITEM} Green Points</strong> per item bag returned to our rider.
                </p>
              </div>
              <button className={styles.closeBtn} onClick={handleDone} aria-label="Close">✕</button>
            </div>

            {cartReturnableItems.length === 0 ? (
              <div className={styles.emptyState}>
                <div style={{ fontSize: '24px', marginBottom: '8px', color: '#1B3A2B' }}>[Cart Empty]</div>
                <p>No returnable packaging items in your current cart.</p>
                <p className={styles.emptyHint}>Add dairy, milk bottles, or container products to start returning!</p>
              </div>
            ) : (
              <>
                <div className={styles.itemList}>
                  {cartReturnableItems.map(({ product, quantity }) => (
                    <button
                      key={product.id}
                      className={`${styles.itemRow} ${selected[product.id] ? styles.itemRowSelected : ''}`}
                      onClick={() => toggleItem(product.id)}
                      aria-pressed={!!selected[product.id]}
                    >
                      <div className={styles.itemImgWrap}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- product.image comes from the product catalog's heterogeneous external hosts, not compatible with next/image's static remotePatterns allowlist */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className={styles.itemImg}
                          onError={e => { e.target.src = `https://placehold.co/60x60/e8f5e9/0c831f?text=${product.name[0]}`; }}
                        />
                        <span className={styles.itemQtyBadge}>×{quantity}</span>
                      </div>

                      <div className={styles.itemInfo}>
                        <span className={styles.itemName}>{product.name}</span>
                        <span className={styles.itemUnit}>{product.unit}</span>
                        <span className={styles.itemCredit}>
                          Earn ₹{quantity * CREDIT_PER_ITEM} Green Points
                        </span>
                      </div>

                      <div className={`${styles.checkbox} ${selected[product.id] ? styles.checkboxChecked : ''}`}>
                        {selected[product.id] && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Credit Summary Bar */}
                {selectedItems.length > 0 && (
                  <div className={styles.creditBar}>
                    <div className={styles.creditBarLeft}>
                      <div>
                        <span className={styles.creditAmount}>₹{totalCredits} Green Points</span>
                        <span className={styles.creditSub}>{selectedItems.reduce((s, i) => s + i.quantity, 0)} item(s) · {co2Saved}kg CO₂ saved</span>
                      </div>
                    </div>
                    <span className={styles.creditTag}>On Delivery</span>
                  </div>
                )}

                <div className={styles.actions}>
                  <button
                    className={styles.skipBtn}
                    onClick={handleDone}
                  >
                    Skip
                  </button>
                  <button
                    className={`${styles.confirmBtn} ${selectedItems.length === 0 ? styles.confirmBtnDisabled : ''}`}
                    onClick={selectedItems.length > 0 ? handleConfirm : undefined}
                    disabled={selectedItems.length === 0}
                  >
                    Confirm Return ({selectedItems.length})
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ── SCREEN 2: Confirmed ── */}
        {screen === 'confirmed' && (
          <div className={styles.confirmedScreen}>
            <div className={styles.confirmedIconWrap}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B3A2B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className={styles.confirmedTitle}>Return Confirmed!</h2>
            <p className={styles.confirmedSubtitle}>
              Hand over clean packaging to the rider when your order arrives.
            </p>

            <div className={styles.confirmedSummaryBox}>
              <div className={styles.confirmedSummaryRow}>
                <span>Items to return</span>
                <strong>{selectedItems.reduce((s, i) => s + i.quantity, 0)}</strong>
              </div>
              <div className={styles.confirmedSummaryRow}>
                <span>Green Points earned</span>
                <strong className={styles.greenText}>₹{totalCredits}</strong>
              </div>
              <div className={styles.confirmedSummaryRow}>
                <span>CO₂ offset</span>
                <strong className={styles.greenText}>{co2Saved} kg</strong>
              </div>
            </div>

            <div className={styles.confirmedItems}>
              {selectedItems.map(({ product, quantity }) => (
                <div key={product.id} className={styles.confirmedItem}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- product.image comes from the product catalog's heterogeneous external hosts, not compatible with next/image's static remotePatterns allowlist */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.confirmedItemImg}
                    onError={e => { e.target.src = `https://placehold.co/40x40/e8f5e9/0c831f?text=${product.name[0]}`; }}
                  />
                  <span className={styles.confirmedItemName}>{product.name} × {quantity}</span>
                  <span className={styles.confirmedItemCredit}>+₹{quantity * CREDIT_PER_ITEM}</span>
                </div>
              ))}
            </div>

            <div className={styles.confirmedNote}>
              Credits are added to your Grokly Wallet once the order is delivered and packaging is returned.
            </div>

            <button className={styles.doneBtn} onClick={handleDone}>
              Done
            </button>
          </div>
        )}
      </div>
    </>
  );
}
