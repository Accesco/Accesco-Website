'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import styles from './checkout.module.css';
import Select from '@/components/instastyle/Select';
import { payWithRazorpay } from '@/lib/razorpayService';

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
  const [paymentError, setPaymentError] = useState('');

  // Location detection states
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  
  // Dynamic ETA state
  const [deliveryETA, setDeliveryETA] = useState(null);

  const deliverySpeed = 'instant';
  const speedDiscount = 0;
  const finalTotal = total;

  const STATE_OPTIONS = [
    'Delhi',
    'Maharashtra',
    'Karnataka',
    'Tamil Nadu',
    'Gujarat',
    'Rajasthan',
    'Uttar Pradesh',
  ];

  const safeReadJson = async (response) => {
    try {
      return await response.json();
    } catch {
      return null;
    }
  };

  const coerceStateForSelect = (stateValue) => {
    const raw = (stateValue || '').trim();
    if (!raw) return '';

    const lower = raw.toLowerCase();
    const normalized = lower.includes('delhi')
      ? 'Delhi'
      : lower.includes('maharashtra')
        ? 'Maharashtra'
        : lower.includes('karnataka')
          ? 'Karnataka'
          : lower.includes('tamil')
            ? 'Tamil Nadu'
            : lower.includes('gujarat')
              ? 'Gujarat'
              : lower.includes('rajasthan')
                ? 'Rajasthan'
                : lower.includes('uttar pradesh')
                  ? 'Uttar Pradesh'
                  : raw;

    return STATE_OPTIONS.includes(normalized) ? normalized : '';
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedUser = localStorage.getItem('accesco_user');
      if (!storedUser) return;

      const parsed = JSON.parse(storedUser);
      const name = typeof parsed?.name === 'string' ? parsed.name.trim() : '';
      const email = typeof parsed?.email === 'string' ? parsed.email.trim() : '';

      let phoneRaw =
        typeof parsed?.phone === 'string' || typeof parsed?.phone === 'number'
          ? String(parsed.phone)
          : '';
      let digitsOnly = phoneRaw.replace(/\D/g, '');
      if (digitsOnly.length > 10) digitsOnly = digitsOnly.slice(-10);

      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || name,
        phone: prev.phone || digitsOnly,
        email: prev.email || email,
      }));

      setErrors((prev) => ({
        ...prev,
        fullName: '',
        phone: '',
        email: '',
      }));
    } catch {
      // ignore malformed storage
    }
  }, []);

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
          // Run requests concurrently, but don't let ETA failure block address autofill.
          const [locationResult, darkStoreResult] = await Promise.allSettled([
            fetch('/api/location', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ latitude, longitude, accuracy }),
            }),
            fetch('/api/darkstore', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ latitude, longitude }),
            }),
          ]);

          if (locationResult.status !== 'fulfilled') {
            throw new Error('Failed to contact location service.');
          }

          const locationResponse = locationResult.value;
          const locationData = await safeReadJson(locationResponse);

          if (!locationResponse.ok) {
            throw new Error(
              locationData?.message || locationData?.error || 'Failed to detect location.'
            );
          }

          // Map API payload fields into the checkout form.
          const streetNumber = locationData?.streetNumber || '';
          const street = locationData?.street || '';
          const area = locationData?.area || locationData?.neighbourhood || '';
          const landmark = locationData?.landmark || '';
          const city = locationData?.city || '';
          const state = coerceStateForSelect(locationData?.state);
          const pincode = locationData?.postalCode || '';

          const primaryLine = [streetNumber, street].filter(Boolean).join(' ').trim();
          const fallbackAddress =
            locationData?.fullAddress ||
            locationData?.formattedAddress ||
            locationData?.displayAddress ||
            '';

          setFormData((prev) => ({
            ...prev,
            addressLine1: primaryLine || area || fallbackAddress,
            addressLine2: primaryLine ? area : locationData?.neighbourhood || '',
            landmark: landmark || prev.landmark,
            city,
            state,
            pincode,
          }));

          setErrors((prev) => ({
            ...prev,
            addressLine1: '',
            city: '',
            state: '',
            pincode: '',
          }));

          if (darkStoreResult.status === 'fulfilled') {
            const darkStoreResponse = darkStoreResult.value;
            const storeData = await safeReadJson(darkStoreResponse);

            if (
              darkStoreResponse.ok &&
              storeData?.success &&
              typeof storeData?.eta_minutes === 'number'
            ) {
              setDeliveryETA(storeData.eta_minutes);
            }
          }

        } catch (error) {
          setLocationError(error?.message || 'Failed to detect location.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        if (error?.code === 1) {
          setLocationError('Location permission denied. Please enable it and try again.');
        } else if (error?.code === 2) {
          setLocationError('Location information is unavailable.');
        } else if (error?.code === 3) {
          setLocationError('Location request timed out. Please try again.');
        } else {
          setLocationError(error?.message || 'Failed to detect location.');
        }
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
    setPaymentError('');

    const placeTheOrder = (paymentInfo = {}) => {
      const order = placeOrder({
        total: finalTotal,
        subtotal,
        tax,
        deliveryFee,
        deliverySpeed,
        speedDiscount,
        address: formData,
        customerEmail: formData.email,
        customerName: formData.fullName,
        paymentMethod: formData.paymentMethod,
        eta: deliverySpeed === 'batched' ? (typeof batchedETA !== 'undefined' ? batchedETA : null) : (deliveryETA || null),
        ...paymentInfo,
      });
      router.push(`/services/instastyle/order-tracking?id=${order.id}`);
    };

    // Cash on Delivery skips the payment gateway entirely.
    if (formData.paymentMethod === 'cod') {
      setTimeout(() => {
        setIsProcessing(false);
        placeTheOrder();
      }, 1500);
      return;
    }

    // Digital payment: collect payment via Razorpay before the order is created.
    try {
      const payment = await payWithRazorpay({
        amount: finalTotal,
        receipt: `instastyle_${Date.now()}`,
        name: 'InstaStyle',
        description: `InstaStyle order · ${cart.length} item(s)`,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#111111' },
      });
      placeTheOrder({
        razorpayOrderId: payment.orderId,
        razorpayPaymentId: payment.paymentId,
      });
    } catch (err) {
      console.error('Payment failed:', err);
      setPaymentError(err.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
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
                    {isLocating ? 'Locating & Calculating ETA...' : 'Detect My Location'}
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
                    <Select 
                      label="State *"
                      value={formData.state}
                      options={[
                        'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 
                        'Gujarat', 'Rajasthan', 'Uttar Pradesh'
                      ]}
                      onChange={(val) => handleInputChange({ target: { name: 'state', value: val } })}
                      placeholder="Select State"
                    />
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

              {paymentError && (
                <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>
                  {paymentError}
                </div>
              )}

              <button
                type="submit"
                className={styles.placeOrderBtn}
                disabled={isProcessing}
              >
                {isProcessing
                  ? (formData.paymentMethod === 'cod' ? 'Processing...' : 'Processing Payment...')
                  : `Place Order - ₹${finalTotal.toLocaleString()}`}
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
                {speedDiscount > 0 && (
                  <div className={styles.totalRow} style={{ color: '#7c3aed', fontWeight: '700' }}>
                    <span>Batched Delivery Discount</span>
                    <span>-₹{speedDiscount}</span>
                  </div>
                )}
                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className={styles.deliveryInfo}>
                <div className={styles.deliveryDot} />
                <span>
                  Standard Priority Shipping
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}