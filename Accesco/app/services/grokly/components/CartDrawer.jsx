/**
 * CartDrawer Component
 * Sliding cart panel with checkout functionality
 * @version 1.0.0
 */

'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CartDrawer.module.css';
import { useGrokly } from '../contexts/GroklyContext';
import { products } from '../lib/groklyData';
import CouponSection from './CouponSection';

/**
 * Generate fallback image URL
 */
const getFallbackImage = (name) => {
  const firstLetter = name ? name[0].toUpperCase() : 'P';
  return `https://placehold.co/80x80/e8f5e9/0c831f?text=${encodeURIComponent(firstLetter)}`;
};

/**
 * CartDrawer Component
 * Displays cart items with checkout functionality
 */
export default function CartDrawer() {
  const {
    cart,
    cartCount,
    isCartOpen,
    closeCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
  } = useGrokly();

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Calculate cart items with product details
  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        return product ? { product, quantity } : null;
      })
      .filter(Boolean);
  }, [cart]);

  // Calculate totals
  const { subtotal, savings, deliveryFee, handlingFee, total } = useMemo(() => {
    const subtotal = cartItems.reduce((sum, { product, quantity }) => 
      sum + (product.price * quantity), 0
    );
    
    const savings = cartItems.reduce((sum, { product, quantity }) => 
      sum + ((product.mrp - product.price) * quantity), 0
    );
    
    const deliveryFee = subtotal >= 199 ? 0 : 19;
    const handlingFee = 2;
    const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
    const total = subtotal + deliveryFee + handlingFee - couponDiscount;

    return { subtotal, savings, deliveryFee, handlingFee, couponDiscount, total };
  }, [cartItems, appliedCoupon]);

  /**
   * Handle checkout
   */
  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push('/services/grokly/checkout');
  };

  /**
   * Handle clear cart with confirmation
   */
  const handleClearCart = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  /**
   * Handle image error
   */
  const handleImageError = (e, productName) => {
    e.target.src = getFallbackImage(productName);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={styles.overlay}
        onClick={closeCart}
        aria-label="Close cart"
      />

      {/* Cart Drawer */}
      <div 
        className={styles.drawer}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>My Cart</h2>
            <p className={styles.subtitle}>
              {cartCount} item{cartCount !== 1 ? 's' : ''} • ₹{subtotal}
            </p>
          </div>
          <div className={styles.headerActions}>
            {cartCount > 0 && (
              <button 
                className={styles.clearBtn}
                onClick={handleClearCart}
                aria-label="Clear cart"
                title="Clear cart"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            )}
            <button 
              className={styles.closeBtn}
              onClick={closeCart}
              aria-label="Close cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Delivery Banner */}
        <div 
          className={`${styles.delivBanner} ${deliveryFee === 0 ? styles.free : styles.pending}`}
        >
          {cartCount === 0 ? (
            "Your cart is empty"
          ) : deliveryFee === 0 ? (
            "You got FREE delivery on this order!"
          ) : (
            `Add ₹${199 - subtotal} more for FREE delivery`
          )}
        </div>

        {/* Cart Body */}
        <div className={styles.body}>
          {cartCount === 0 ? (
            /* Empty State */
            <div className={styles.empty}>
              <svg 
                className={styles.emptyIcon} 
                width="64" 
                height="64" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
              >
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
              </svg>
              <h3 className={styles.emptyTitle}>Your cart is empty</h3>
              <p className={styles.emptySub}>Add items to get started</p>
            </div>
          ) : (
            /* Cart Items, Coupon and Bill Details (scrollable together) */
            <>
              <div className={styles.items}>
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className={styles.item}>
                    {/* Product Image */}
                    <div className={styles.itemImgWrap}>
                      <img 
                        className={styles.itemImg}
                        src={product.image}
                        alt={product.name}
                        onError={(e) => handleImageError(e, product.name)}
                      />
                    </div>

                    {/* Product Info */}
                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemName}>{product.name}</h4>
                      <p className={styles.itemUnit}>
                        {product.unit} <span style={{ fontSize: '9px', color: '#9CA3AF', fontFamily: 'monospace', marginLeft: '6px' }}>{product.sku}</span>
                      </p>
                      
                      {/* Price Row */}
                      <div className={styles.itemPriceRow}>
                        <div className={styles.itemPrice}>
                          <span className={styles.itemPriceCurrent}>₹{product.price}</span>
                          {product.mrp > product.price && (
                            <span className={styles.itemPriceMrp}>₹{product.mrp}</span>
                          )}
                        </div>
                        {product.disc > 0 && (
                          <span className={styles.itemDiscount}>{product.disc}% OFF</span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className={styles.itemQty} role="group" aria-label="Quantity controls">
                      <button 
                        className={styles.itemQtyBtn}
                        onClick={() => decrementQuantity(product.id)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className={styles.itemQtyNum} aria-label={`Quantity: ${quantity}`}>
                        {quantity}
                      </span>
                      <button 
                        className={styles.itemQtyBtn}
                        onClick={() => incrementQuantity(product.id)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <CouponSection 
                cartTotal={subtotal}
                onApply={setAppliedCoupon}
              />

              {/* Bill Details */}
              <div className={styles.bill}>
                <h3 className={styles.billTitle}>Bill Details</h3>
                
                <div className={styles.billRow}>
                  <span className={styles.billLabel}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                    </svg>
                    Items total
                  </span>
                  <span className={styles.billValue}>₹{subtotal}</span>
                </div>

                <div className={styles.billRow}>
                  <span className={styles.billLabel}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    Delivery fee
                  </span>
                  <span className={`${styles.billValue} ${deliveryFee === 0 ? styles.free : ''}`}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className={styles.billRow}>
                  <span className={styles.billLabel}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M2 12h20"/>
                    </svg>
                    Handling fee
                  </span>
                  <span className={styles.billValue}>₹{handlingFee}</span>
                </div>

                {savings > 0 && (
                  <div className={styles.billSavings}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"/>
                      <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
                      <path d="M18 12a2 2 0 100 4 2 2 0 000-4z"/>
                    </svg>
                    Your total savings: ₹{savings}
                  </div>
                )}

                {appliedCoupon && (
                  <div className={styles.billRow}>
                    <span className={styles.billLabel}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                      </svg>
                      Coupon ({appliedCoupon.code})
                    </span>
                    <span className={`${styles.billValue} ${styles.discount}`}>
                      -₹{appliedCoupon.discount}
                    </span>
                  </div>
                )}

                <div className={styles.billDivider} />

                <div className={`${styles.billRow} ${styles.total}`}>
                  <span className={styles.billLabel}>Grand Total</span>
                  <span className={styles.billValue}>₹{total}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Checkout Button (only show if cart has items) */}
        {cartCount > 0 && (
          <div className={styles.checkoutWrap}>
            <button 
              className={styles.checkoutBtn}
              onClick={handleCheckout}
              aria-label="Proceed to checkout"
            >
              <div className={styles.checkoutLeft}>
                <div className={styles.checkoutAmount}>₹{total}</div>
                <div className={styles.checkoutSub}>TOTAL</div>
              </div>
              <div className={styles.checkoutRight}>
                Proceed to Checkout
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
