'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSwadishtt } from '../contexts/SwadishttContext';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './cart.module.css';

function CartContent() {
  const router = useRouter();
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useSwadishtt();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const PROMO_CODES = {
    'FIRST50': { discount: 50, type: 'flat', description: 'Flat ₹50 off on first order' },
    'SAVE20': { discount: 20, type: 'percent', description: '20% off on orders above ₹500' },
    'SWADISHT100': { discount: 100, type: 'flat', description: 'Flat ₹100 off' },
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const deliveryFee = subtotal > 0 ? (subtotal >= 300 ? 0 : 40) : 0;
  const platformFee = subtotal > 0 ? 5 : 0;
  const gst = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'flat') {
      discount = appliedPromo.discount;
    } else {
      discount = Math.round(subtotal * (appliedPromo.discount / 100));
    }
  }
  
  const total = subtotal + deliveryFee + platformFee + gst - discount;

  const handleApplyPromo = () => {
    setPromoError('');
    const promo = PROMO_CODES[promoCode.toUpperCase()];
    if (promo) {
      if (promo.type === 'percent' && subtotal < 500) {
        setPromoError('Minimum order value ₹500 required for SAVE20');
        return;
      }
      setAppliedPromo(promo);
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    router.push('/services/swadisht/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className={styles.page}>
        <SwadishttHeader />
        <div className={styles.emptyCart}>
          <div className={styles.emptyIconWrap}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h2 className={styles.emptyTitle}>Your cart is empty</h2>
          <p className={styles.emptyText}>Add items from restaurants to get started</p>
          <Link href="/services/swadisht" className={styles.browseBtn}>
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <SwadishttHeader />
      
      <div className={styles.container}>
        <div className={styles.cartLayout}>
          {/* Left Pane: Items List */}
          <div className={styles.leftPane}>
            <div className={styles.paneHeader}>
              <h2 className={styles.paneTitle}>Your Cart ({cart.length} items)</h2>
              <button className={styles.clearBtn} onClick={clearCart}>
                Clear All
              </button>
            </div>
            
            <div className={styles.cartItems}>
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = `https://placehold.co/100x80/262626/FAF9F6/png?text=${encodeURIComponent(item.name)}`;
                      }}
                    />
                  </div>
                  
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <div className={styles.metaRow}>
                      {item.restaurant && <span className={styles.restaurantName}>{item.restaurant}</span>}
                      <span className={styles.skuBadge}>{item.sku || `SWD-GEN-${item.id.replace(/[^0-9]/g, '') || '00'}`}</span>
                    </div>
                    <div className={styles.itemPrice}>₹{item.price}</div>
                  </div>
                  
                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <button 
                        className={styles.qtyBtn}
                        onClick={() => updateCartQuantity(index, (item.quantity || 1) - 1)}
                      >
                        −
                      </button>
                      <span className={styles.qtyValue}>{item.quantity || 1}</span>
                      <button 
                        className={styles.qtyBtn}
                        onClick={() => updateCartQuantity(index, (item.quantity || 1) + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(index)}
                      aria-label="Remove item"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className={styles.trashIcon}>
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Promo Code Segment */}
            <div className={styles.promoBlock}>
              <h3 className={styles.sectionTitle}>Apply Promo Code</h3>
              <div className={styles.promoInputRow}>
                <input 
                  type="text"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoError('');
                  }}
                  className={styles.promoField}
                />
                <button className={styles.applyBtn} onClick={handleApplyPromo}>
                  Apply
                </button>
              </div>
              
              {promoError && <p className={styles.promoError}>{promoError}</p>}
              
              {appliedPromo && (
                <div className={styles.appliedPromo}>
                  <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>{appliedPromo.description}</span>
                  <button 
                    className={styles.removePromo}
                    onClick={() => { setAppliedPromo(null); setPromoCode(''); }}
                  >
                    ✕
                  </button>
                </div>
              )}
              
              <div className={styles.availablePromos}>
                <p className={styles.availableTitle}>Available Offers:</p>
                <div className={styles.promoChips}>
                  {Object.entries(PROMO_CODES).map(([code, promo]) => (
                    <button 
                      key={code}
                      className={styles.promoChip}
                      onClick={() => { setPromoCode(code); setAppliedPromo(promo); setPromoError(''); }}
                    >
                      <span className={styles.promoCode}>{code}</span>
                      <span className={styles.promoDesc}>{promo.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Pane: Sticky Checkout Breakdown */}
          <div className={styles.rightPane}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              
              <div className={styles.summaryBody}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                
                <div className={styles.summaryRow}>
                  <span>Delivery Charges</span>
                  <span className={deliveryFee === 0 ? styles.freeText : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                
                {subtotal < 300 && subtotal > 0 && (
                  <div className={styles.deliveryProgress}>
                    Add items worth ₹{300 - subtotal} more for free delivery
                  </div>
                )}
                
                <div className={styles.summaryRow}>
                  <span>Platform Fee</span>
                  <span>₹{platformFee}</span>
                </div>
                
                <div className={styles.summaryRow}>
                  <span>GST (5%)</span>
                  <span>₹{gst}</span>
                </div>
                
                {discount > 0 && (
                  <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                    <span>Discount</span>
                    <span>− ₹{discount}</span>
                  </div>
                )}
                
                <div className={styles.summaryDivider}></div>
                
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Grand Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
              
              <button className={styles.checkoutBtn} onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              
              <div className={styles.secureNote}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>Fully Secure &bull; Accesco Commerce</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return <CartContent />;
}
