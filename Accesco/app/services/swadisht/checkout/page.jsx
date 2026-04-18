'use client';

/**
 * Checkout Page
 * @page /services/swadisht/checkout
 * @description Order checkout with address and payment
 */

// Force dynamic rendering to avoid SSR issues with geolocation
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SwadishttProvider, useSwadishtt } from '../contexts/SwadishttContext';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './checkout.module.css';

function CheckoutContent() {
  const router = useRouter();
  const { cart, clearCart } = useSwadishtt();
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

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const deliveryFee = subtotal >= 300 ? 0 : 40;
  const platformFee = 5;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + platformFee + gst;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
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
            Order #SW{Math.floor(Math.random() * 100000)}
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
  return (
    <SwadishttProvider>
      <CheckoutContent />
    </SwadishttProvider>
  );
}
