'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const {
    cart,
    itemCount,
    subtotal,
    deliveryFee,
    tax,
    total,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={closeCart} />

      {/* Drawer */}
      <div className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            Shopping Cart
            {itemCount > 0 && (
              <span className={styles.count}>({itemCount})</span>
            )}
          </h2>
          <button
            className={styles.closeButton}
            onClick={closeCart}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className={styles.content}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <div className={styles.emptyIcon}>🛍️</div>
              <h3>Your cart is empty</h3>
              <p>Add some items to get started</p>
              <Link href="/services/instastyle/catalog" className={styles.shopButton}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className={styles.items}>
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className={styles.item}>
                  {/* Image */}
                  <Link
                    href={`/services/instastyle/products/${item.id}`}
                    className={styles.itemImage}
                    onClick={closeCart}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- item.image comes from the product catalog's heterogeneous external hosts, not compatible with next/image's static remotePatterns allowlist */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.image}
                    />
                  </Link>

                  {/* Details */}
                  <div className={styles.itemDetails}>
                    <Link
                      href={`/services/instastyle/products/${item.id}`}
                      className={styles.itemName}
                      onClick={closeCart}
                    >
                      {item.name}
                    </Link>
                    <p className={styles.itemBrand}>{item.brand}</p>
                    <div className={styles.itemMeta}>
                      <span>Size: {item.selectedSize}</span>
                      <span>•</span>
                      <span>Color: {item.selectedColor}</span>
                    </div>

                    {/* Quantity Controls */}
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.quantityButton}
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.selectedSize,
                            item.selectedColor,
                            item.quantity - 1
                          )
                        }
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.selectedSize,
                            item.selectedColor,
                            item.quantity + 1
                          )
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className={styles.itemActions}>
                    <div className={styles.priceContainer} style={{ textAlign: 'right' }}>
                      <div className={styles.itemPrice}>
                        ₹{((item.discountedPrice || item.price) * item.quantity).toLocaleString()}
                      </div>
                      {(item.discountedPrice && item.discountedPrice < item.price) && (
                        <div className={styles.discountRow} style={{ fontSize: '11px', display: 'flex', gap: '4px', alignItems: 'center', justifyContent: 'flex-end', marginTop: '2px' }}>
                          <span style={{ textDecoration: 'line-through', color: 'rgba(26, 17, 8, 0.5)' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                          <span style={{ color: '#22c55e', fontWeight: '600' }}>{item.discountPercentage}% OFF</span>
                        </div>
                      )}
                    </div>
                    <button
                      className={styles.removeButton}
                      onClick={() =>
                        removeFromCart(item.id, item.selectedSize, item.selectedColor)
                      }
                      aria-label="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className={styles.footer}>
            {/* Summary */}
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? styles.free : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(0)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/services/instastyle/checkout"
              className={styles.checkoutButton}
              onClick={closeCart}
            >
              Proceed to Checkout
            </Link>

            {/* Continue Shopping */}
            <button className={styles.continueButton} onClick={closeCart}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
