/**
 * CouponSection Component - Apply coupon codes
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { PartyPopper, X, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './CouponSection.module.css';

/**
 * Mock available coupons
 */
const AVAILABLE_COUPONS = [
  { code: 'FIRST50', discount: 50, minOrder: 199, description: '₹50 off on orders above ₹199' },
  { code: 'SAVE100', discount: 100, minOrder: 499, description: '₹100 off on orders above ₹499' },
  { code: 'MEGA200', discount: 200, minOrder: 999, description: '₹200 off on orders above ₹999' },
];

/**
 * CouponSection Component
 * Allows users to apply discount coupons
 */
export default function CouponSection({ cartTotal, onApply }) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState('');
  const [showCoupons, setShowCoupons] = useState(false);

  /**
   * Handle coupon application
   */
  const handleApply = () => {
    setError('');
    
    const coupon = AVAILABLE_COUPONS.find(c => c.code === couponCode.toUpperCase());
    
    if (!coupon) {
      setError('Invalid coupon code');
      return;
    }
    
    if (cartTotal < coupon.minOrder) {
      setError(`Minimum order of ₹${coupon.minOrder} required`);
      return;
    }
    
    setAppliedCoupon(coupon);
    if (onApply) onApply(coupon);
  };

  /**
   * Handle coupon selection from list
   */
  const handleSelectCoupon = (coupon) => {
    if (cartTotal < coupon.minOrder) {
      setError(`Add ₹${coupon.minOrder - cartTotal} more to use this coupon`);
      return;
    }
    
    setCouponCode(coupon.code);
    setAppliedCoupon(coupon);
    setShowCoupons(false);
    if (onApply) onApply(coupon);
  };

  /**
   * Handle coupon removal
   */
  const handleRemove = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setError('');
    if (onApply) onApply(null);
  };

  return (
    <div className={styles.couponSection}>
      {/* Applied Coupon */}
      {appliedCoupon ? (
        <div className={styles.appliedCoupon}>
          <div className={styles.appliedLeft}>
            <PartyPopper className={styles.appliedIcon} size={20} aria-hidden="true" />
            <div>
              <div className={styles.appliedCode}>{appliedCoupon.code}</div>
              <div className={styles.appliedSavings}>You saved ₹{appliedCoupon.discount}!</div>
            </div>
          </div>
          <button 
            className={styles.removeBtn}
            onClick={handleRemove}
            aria-label="Remove coupon"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <>
          {/* Coupon Input */}
          <div className={styles.couponInput}>
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className={styles.input}
              aria-label="Coupon code"
            />
            <button 
              className={styles.applyBtn}
              onClick={handleApply}
              disabled={!couponCode}
              aria-label="Apply coupon"
            >
              Apply
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          {/* View Coupons Button */}
          <button 
            className={styles.viewCouponsBtn}
            onClick={() => setShowCoupons(!showCoupons)}
            aria-expanded={showCoupons}
          >
            {showCoupons ? 'Hide' : 'View'} available coupons
            {showCoupons ? (
              <ChevronUp size={16} aria-hidden="true" />
            ) : (
              <ChevronDown size={16} aria-hidden="true" />
            )}
          </button>

          {/* Available Coupons List */}
          {showCoupons && (
            <div className={styles.couponsList}>
              {AVAILABLE_COUPONS.map((coupon) => {
                const isEligible = cartTotal >= coupon.minOrder;
                
                return (
                  <div 
                    key={coupon.code}
                    className={`${styles.couponCard} ${!isEligible ? styles.disabled : ''}`}
                  >
                    <div className={styles.couponLeft}>
                      <div className={styles.couponCode}>{coupon.code}</div>
                      <div className={styles.couponDesc}>{coupon.description}</div>
                    </div>
                    <button
                      className={styles.couponApplyBtn}
                      onClick={() => handleSelectCoupon(coupon)}
                      disabled={!isEligible}
                      aria-label={`Apply ${coupon.code} coupon`}
                    >
                      {isEligible ? 'Apply' : `₹${coupon.minOrder - cartTotal} more`}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
