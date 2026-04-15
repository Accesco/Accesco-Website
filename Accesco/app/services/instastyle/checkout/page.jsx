'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, deliveryFee, tax, total, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'razorpay',
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/services/instastyle/catalog');
    }
  }, [cart, router]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Invalid pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      // In production, this would call your payment gateway and backend API
      alert('Order placed successfully! (Demo mode)');
      clearCart();
      router.push('/services/instastyle');
      setIsProcessing(false);
    }, 2000);
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Checkout</h1>

        <div className={styles.checkoutGrid}>
          {/* Left: Forms */}
          <div className={styles.formsSection}>
            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Contact Information</h2>
                
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={errors.fullName ? styles.error : ''}
                    />
                    {errors.fullName && (
                      <span className={styles.errorText}>{errors.fullName}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className={errors.phone ? styles.error : ''}
                    />
                    {errors.phone && (
                      <span className={styles.errorText}>{errors.phone}</span>
                    )}
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? styles.error : ''}
                    />
                    {errors.email && (
                      <span className={styles.errorText}>{errors.email}</span>
                    )}
                  </div>
                </div>
              </section>

              {/* Delivery Address */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Delivery Address</h2>
                
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="addressLine1">Address Line 1 *</label>
                    <input
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="House No., Building Name"
                      className={errors.addressLine1 ? styles.error : ''}
                    />
                    {errors.addressLine1 && (
                      <span className={styles.errorText}>{errors.addressLine1}</span>
                    )}
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="addressLine2">Address Line 2</label>
                    <input
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      placeholder="Road Name, Area, Colony"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="landmark">Landmark</label>
                    <input
                      type="text"
                      id="landmark"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? styles.error : ''}
                    />
                    {errors.city && (
                      <span className={styles.errorText}>{errors.city}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="state">State *</label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={errors.state ? styles.error : ''}
                    >
                      <option value="">Select State</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                    {errors.state && (
                      <span className={styles.errorText}>{errors.state}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="pincode">Pincode *</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      className={errors.pincode ? styles.error : ''}
                    />
                    {errors.pincode && (
                      <span className={styles.errorText}>{errors.pincode}</span>
                    )}
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Payment Method</h2>
                
                <div className={styles.paymentMethods}>
                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={formData.paymentMethod === 'razorpay'}
                      onChange={handleInputChange}
                    />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>Digital Payment</span>
                      <span className={styles.paymentDesc}>UPI, Credit/Debit Card, Net Banking</span>
                    </div>
                  </label>

                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>Cash on Delivery</span>
                      <span className={styles.paymentDesc}>Pay securely at your doorstep</span>
                    </div>
                  </label>
                </div>
              </section>

              {/* Submit Button */}
              <button
                type="submit"
                className={styles.placeOrderBtn}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Place Order - ₹${total.toLocaleString()}`}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className={styles.summarySection}>
            <div className={styles.summarySticky}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              {/* Items */}
              <div className={styles.summaryItems}>
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className={styles.summaryItem}>
                    <div className={styles.itemImage}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className={styles.image}
                      />
                    </div>
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemMeta}>
                        {item.selectedSize} • {item.selectedColor} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className={styles.itemPrice}>
                      ₹{((item.discountedPrice || item.price) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className={styles.summaryTotals}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? styles.free : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className={styles.totalRow}>
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className={styles.deliveryInfo}>
                <div className={styles.deliveryDot} />
                <span>Express Delivery in 15-20 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
