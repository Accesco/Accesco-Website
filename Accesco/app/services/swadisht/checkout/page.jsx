'use client';

// Force dynamic rendering to prevent prerendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Checkout Page
 * @page /services/swadisht/checkout
 * @description Order checkout with address and payment
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSwadishtt } from '../contexts/SwadishttContext';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './checkout.module.css';

const ORDERS_STORAGE_KEY = 'swadishtt-orders';

function CheckoutContent() {
  const router = useRouter();
  const { cart, cartHydrated, clearCart } = useSwadishtt();
  const [step, setStep] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');

  useEffect(() => {
    if (!cartHydrated) return;
    if (orderPlaced) return;
    if (cart.length > 0) return;

    router.replace('/services/swadisht/cart');
  }, [cartHydrated, cart.length, orderPlaced, router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Edited Jabez: prefill checkout fields from localStorage (user + location).
    let storedUser = null;
    let storedLocation = null;

    try {
      const rawUser = localStorage.getItem('accesco_user');
      if (rawUser) storedUser = JSON.parse(rawUser);
    } catch (error) {
      console.error('Error reading accesco_user from localStorage:', error);
    }

    try {
      const rawLocation = localStorage.getItem('userLocation');
      if (rawLocation) storedLocation = JSON.parse(rawLocation);
    } catch (error) {
      console.error('Error reading userLocation from localStorage:', error);
    }

    const resolvedName = typeof storedUser?.name === 'string' ? storedUser.name : '';
    const resolvedPhone = typeof storedUser?.phone === 'string' ? storedUser.phone : '';
    const resolvedCity =
      (typeof storedLocation?.city === 'string' && storedLocation.city) ||
      (typeof storedLocation?.state === 'string' && storedLocation.state) ||
      (typeof storedLocation?.region === 'string' && storedLocation.region) ||
      '';
    const resolvedAddress =
      (typeof storedLocation?.fullAddress === 'string' && storedLocation.fullAddress) ||
      (typeof storedLocation?.formattedAddress === 'string' && storedLocation.formattedAddress) ||
      (typeof storedLocation?.displayAddress === 'string' && storedLocation.displayAddress) ||
      (typeof storedLocation?.area === 'string' && resolvedCity
        ? `${storedLocation.area}, ${resolvedCity}`
        : (typeof storedLocation?.area === 'string' ? storedLocation.area : '')) ||
      '';

    setDeliveryAddress((prev) => ({
      ...prev,
      name: prev.name || resolvedName,
      phone: prev.phone || resolvedPhone,
      address: prev.address || resolvedAddress,
      city: prev.city || resolvedCity,
    }));
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const deliveryFee = subtotal >= 300 ? 0 : 40;
  const platformFee = 5;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + platformFee + gst;

  const persistOrder = (nextOrder) => {
    if (typeof window === 'undefined') return;

    // Edited Jabez: persist Swadishtt orders to localStorage for the /orders page.
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const existing = Array.isArray(parsed) ? parsed : [];
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([nextOrder, ...existing]));
    } catch (error) {
      console.error('Error saving Swadishtt orders:', error);
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    const orderId = `SW${Date.now().toString(36).toUpperCase()}`;
    const nextOrder = {
      id: orderId,
      status: 'Placed',
      placedAt: new Date().toISOString(),
      paymentMethod,
      delivery: { ...deliveryAddress },
      totals: {
        subtotal,
        deliveryFee,
        platformFee,
        gst,
        total,
      },
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image,
        restaurant: item.restaurant || '',
      })),
    };

    persistOrder(nextOrder);
    setLastOrderId(orderId);
    
    // Simulate order placement
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      router.push('/services/swadisht/orders');
    }, 3000);
  };

  if (cart.length === 0 && !orderPlaced) {
    router.push('/services/swadisht/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <div className={styles.page}>
        <SwadishttHeader />
        <div className={styles.successScreen}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Order Placed Successfully!</h1>
          <p className={styles.successText}>
            Your order has been confirmed and will be delivered soon.
          </p>
          <div className={styles.orderNumber}>
            Order #{lastOrderId || `SW${Math.floor(Math.random() * 100000)}`}
          </div>
          <p className={styles.redirectText}>Redirecting to orders page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <SwadishttHeader />
      
      <div className={styles.container}>
        <div className={styles.checkoutLayout}>
          {/* Main Content */}
          <div className={styles.mainSection}>
            {/* Progress Steps */}
            <div className={styles.progressSteps}>
              <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>1</div>
                <span className={styles.stepLabel}>Delivery Address</span>
              </div>
              <div className={styles.progressLine}></div>
              <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>2</div>
                <span className={styles.stepLabel}>Payment</span>
              </div>
            </div>

            {/* Step 1: Delivery Address */}
            {step === 1 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Delivery Address</h2>
                <form onSubmit={handleAddressSubmit} className={styles.addressForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Full Name *</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={deliveryAddress.name}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Phone Number *</label>
                      <input
                        type="tel"
                        className={styles.formInput}
                        value={deliveryAddress.phone}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Complete Address *</label>
                    <textarea
                      className={styles.formTextarea}
                      value={deliveryAddress.address}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, address: e.target.value})}
                      rows={3}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Landmark (Optional)</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={deliveryAddress.landmark}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, landmark: e.target.value})}
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>City *</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={deliveryAddress.city}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Pincode *</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={deliveryAddress.pincode}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, pincode: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className={styles.continueBtn}>
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className={styles.stepContent}>
                <button className={styles.backBtn} onClick={() => setStep(1)}>
                  ← Back to Address
                </button>
                
                <h2 className={styles.stepTitle}>Payment Method</h2>
                
                <div className={styles.paymentMethods}>
                  <div 
                    className={`${styles.paymentOption} ${paymentMethod === 'upi' ? styles.selected : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <div className={styles.paymentRadio}>
                      {paymentMethod === 'upi' && <div className={styles.radioSelected}></div>}
                    </div>
                    <div className={styles.paymentInfo}>
                      <div className={styles.paymentTitle}>UPI</div>
                      <div className={styles.paymentDesc}>Pay via Google Pay, PhonePe, Paytm</div>
                    </div>
                  </div>

                  <div 
                    className={`${styles.paymentOption} ${paymentMethod === 'card' ? styles.selected : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className={styles.paymentRadio}>
                      {paymentMethod === 'card' && <div className={styles.radioSelected}></div>}
                    </div>
                    <div className={styles.paymentInfo}>
                      <div className={styles.paymentTitle}>Credit / Debit Card</div>
                      <div className={styles.paymentDesc}>Visa, Mastercard, Rupay</div>
                    </div>
                  </div>

                  <div 
                    className={`${styles.paymentOption} ${paymentMethod === 'netbanking' ? styles.selected : ''}`}
                    onClick={() => setPaymentMethod('netbanking')}
                  >
                    <div className={styles.paymentRadio}>
                      {paymentMethod === 'netbanking' && <div className={styles.radioSelected}></div>}
                    </div>
                    <div className={styles.paymentInfo}>
                      <div className={styles.paymentTitle}>Net Banking</div>
                      <div className={styles.paymentDesc}>All major banks supported</div>
                    </div>
                  </div>

                  <div 
                    className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.selected : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className={styles.paymentRadio}>
                      {paymentMethod === 'cod' && <div className={styles.radioSelected}></div>}
                    </div>
                    <div className={styles.paymentInfo}>
                      <div className={styles.paymentTitle}>Cash on Delivery</div>
                      <div className={styles.paymentDesc}>Pay when you receive</div>
                    </div>
                  </div>
                </div>

                <button className={styles.placeOrderBtn} onClick={handlePlaceOrder}>
                  Place Order - ₹{total}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className={styles.sidebarSection}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              
              <div className={styles.orderItems}>
                {cart.map((item, index) => (
                  <div key={index} className={styles.orderItem}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className={styles.orderItemImage}
                      onError={(e) => {
                        e.target.src = `https://placehold.co/60x50/E23744/FFFFFF/png?text=${encodeURIComponent(item.name)}`;
                      }}
                    />
                    <div className={styles.orderItemInfo}>
                      <div className={styles.orderItemName}>{item.name}</div>
                      <div className={styles.orderItemQty}>Qty: {item.quantity || 1}</div>
                    </div>
                    <div className={styles.orderItemPrice}>₹{item.price * (item.quantity || 1)}</div>
                  </div>
                ))}
              </div>

              <div className={styles.summaryDivider}></div>

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? styles.free : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Platform Fee</span>
                <span>₹{platformFee}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>GST</span>
                <span>₹{gst}</span>
              </div>

              <div className={styles.summaryDivider}></div>

              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  // Prevent rendering during build/prerendering
  if (typeof window === 'undefined') {
    return null;
  }
  return <CheckoutContent />;
}
