'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, deliveryFee, tax, total, clearCart, placeOrder } = useCart();

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
  
  // Location detection states
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  
  // Dynamic ETA state
  const [deliveryETA, setDeliveryETA] = useState(null);

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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        try {
          // Execute API calls concurrently to optimize loading time
          const [locationResponse, darkStoreResponse] = await Promise.all([
            fetch('/api/location', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ latitude, longitude, accuracy }),
            }),
            fetch('/api/darkstore', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ latitude, longitude }),
            })
          ]);

          const locationData = await locationResponse.json();
          const storeData = await darkStoreResponse.json();

          if (!locationResponse.ok) {
            throw new Error(locationData.message || 'Failed to detect location.');
          }

          // Handle Address Autofill
          if (locationData.success && locationData.formattedAddress) {
            const addr = locationData.formattedAddress;
            setFormData(prev => ({
              ...prev,
              addressLine1: [addr.houseNumber, addr.road].filter(Boolean).join(', ') || addr.area || '',
              addressLine2: addr.area || '',
              city: addr.city || '',
              state: addr.state || '',
              pincode: addr.postalCode || '',
            }));

            setErrors(prev => ({
              ...prev,
              addressLine1: '',
              city: '',
              state: '',
              pincode: ''
            }));
          }

          // Handle Dynamic ETA
          if (storeData.success && storeData.eta_minutes) {
            setDeliveryETA(storeData.eta_minutes);
          }

        } catch (error) {
          setLocationError(error.message);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setLocationError(error.message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } 
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    const order = placeOrder({
      total,
      subtotal,
      tax,
      deliveryFee,
      address: formData,
      paymentMethod: formData.paymentMethod,
      eta: deliveryETA // Optional: Passing the ETA to the order payload
    });

    setTimeout(() => {
      setIsProcessing(false);
      router.push(`/services/instastyle/order-tracking?id=${order.id}`);
    }, 2000);
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${styles.active}`}>
            <span className={styles.stepNum}>1</span>
            <span className={styles.stepLabel}>Shipping</span>
          </div>
          <div className={styles.stepLine}></div>
          <div className={styles.step}>
            <span className={styles.stepNum}>2</span>
            <span className={styles.stepLabel}>Payment</span>
          </div>
          <div className={styles.stepLine}></div>
          <div className={styles.step}>
            <span className={styles.stepNum}>3</span>
            <span className={styles.stepLabel}>Review</span>
          </div>
        </div>

        <h1 className={styles.pageTitle}>Secure Checkout</h1>

        <div className={styles.checkoutGrid}>
          <div className={styles.formsSection}>
            <form onSubmit={handleSubmit}>
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
                    {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
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
                    {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
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
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Delivery Address</h2>
                  <button 
                    type="button" 
                    onClick={handleDetectLocation} 
                    disabled={isLocating}
                    style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px' }}
                  >
                    {isLocating ? 'Locating & Calculating ETA...' : '📍 Detect My Location'}
                  </button>
                </div>
                
                {locationError && (
                  <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    {locationError}
                  </div>
                )}

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
                    {errors.addressLine1 && <span className={styles.errorText}>{errors.addressLine1}</span>}
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
                    {errors.city && <span className={styles.errorText}>{errors.city}</span>}
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
                    {errors.state && <span className={styles.errorText}>{errors.state}</span>}
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
                    {errors.pincode && <span className={styles.errorText}>{errors.pincode}</span>}
                  </div>
                </div>
              </section>

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

              <button
                type="submit"
                className={styles.placeOrderBtn}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Place Order - ₹${total.toLocaleString()}`}
              </button>
            </form>
          </div>

          <div className={styles.summarySection}>
            <div className={styles.summarySticky}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

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

              <div className={styles.deliveryInfo}>
                <div className={styles.deliveryDot} />
                <span>
                  {deliveryETA 
                    ? `Express Delivery in ${deliveryETA} minutes` 
                    : 'Express Delivery in 15-20 minutes'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}