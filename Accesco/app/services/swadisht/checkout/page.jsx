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
import { payWithRazorpay } from '@/lib/razorpayService';

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
  const [deliverySpeed, setDeliverySpeed] = useState('instant');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

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
        : typeof storedLocation?.area === 'string'
        ? storedLocation.area
        : '') ||
      '';
    
    // Resolving pincode with fallbacks for common naming conventions and types
    const resolvedPincode =
      (typeof storedLocation?.pincode === 'string' && storedLocation.pincode) ||
      (typeof storedLocation?.pinCode === 'string' && storedLocation.pinCode) ||
      (typeof storedLocation?.postalCode === 'string' && storedLocation.postalCode) ||
      (typeof storedLocation?.zipCode === 'string' && storedLocation.zipCode) ||
      (typeof storedLocation?.pincode === 'number' && String(storedLocation.pincode)) ||
      (typeof storedLocation?.postalCode === 'number' && String(storedLocation.postalCode)) ||
      '';
    
    setDeliveryAddress((prev) => ({
      ...prev,
      name: prev.name || resolvedName,
      phone: prev.phone || resolvedPhone,
      address: prev.address || resolvedAddress,
      city: prev.city || resolvedCity,
      pincode: prev.pincode || resolvedPincode, // Appended to state
    }));
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const deliveryFee = subtotal >= 300 ? 0 : 40;
  const platformFee = 5;
  const gst = Math.round(subtotal * 0.05);
  const discount = deliverySpeed === 'batched' ? 20 : 0;
  const total = Math.max(0, subtotal + deliveryFee + platformFee + gst - discount);

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

  const finalizeOrder = (paymentInfo = {}) => {
    const orderId = `SW${Date.now().toString(36).toUpperCase()}`;
    const nextOrder = {
      id: orderId,
      status: 'Preparing',
      placedAt: new Date().toISOString(),
      paymentMethod,
      ...paymentInfo,
      delivery: { ...deliveryAddress },
      deliveryPartner: {
        name: 'Ravi Kumar',
        distanceKm: deliverySpeed === 'batched' ? 3.4 : 1.8,
        etaMinutes: deliverySpeed === 'batched' ? 25 : 10,
        statusText:
          deliverySpeed === 'batched'
            ? 'Delivery partner is completing a nearby order'
            : 'Delivery partner is heading to the restaurant',
      },
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
    setPlacedOrder(nextOrder);

    persistOrder(nextOrder);
    setLastOrderId(orderId);
    setOrderPlaced(true);

    setTimeout(() => {
      clearCart();
      router.push(`/services/swadisht/order-tracking?id=${orderId}`);
    }, 3000);
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    // Cash on Delivery skips the payment gateway entirely.
    if (paymentMethod === 'cod') {
      finalizeOrder();
      return;
    }

    // Digital payment (UPI / Card / Netbanking): collect payment via Razorpay
    // before the order is created.
    setIsProcessing(true);
    setPaymentError('');
    try {
      const payment = await payWithRazorpay({
        amount: total,
        receipt: `swadisht_${Date.now()}`,
        name: 'Swadishtt',
        description: `Swadishtt order · ${cart.length} item(s)`,
        prefill: {
          name: deliveryAddress.name,
          contact: deliveryAddress.phone,
        },
        theme: { color: '#E23744' },
      });
      finalizeOrder({
        razorpayOrderId: payment.orderId,
        razorpayPaymentId: payment.paymentId,
      });
    } catch (err) {
      console.error('Payment failed:', err);
      setPaymentError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    router.push('/services/swadisht/cart');
    return null;
  }

if (orderPlaced) {
  const displayOrder = placedOrder || {};
  const deliveryPartner = displayOrder.deliveryPartner || {};
  const etaMinutes = deliveryPartner.etaMinutes || (deliverySpeed === 'batched' ? 25 : 10);
  const driverDistance = deliveryPartner.distanceKm || (deliverySpeed === 'batched' ? 3.4 : 1.8);
  const driverName = deliveryPartner.name || 'Ravi Kumar';
  const orderLabel = displayOrder.id || lastOrderId || `SW${Math.floor(Math.random() * 100000)}`;

  const displayItems = displayOrder.items || [];
  const itemCount = displayItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const deliveryText =
    displayOrder.delivery?.address ||
    displayOrder.delivery?.fullAddress ||
    [
      displayOrder.delivery?.house,
      displayOrder.delivery?.area,
      displayOrder.delivery?.city,
      displayOrder.delivery?.pincode,
    ]
      .filter(Boolean)
      .join(', ') ||
    'Selected delivery address';

  const paymentLabel =
    displayOrder.paymentMethod?.toUpperCase() ||
    paymentMethod?.toUpperCase() ||
    'SELECTED';

  const totalLabel =
    typeof displayOrder.totals?.total === 'number'
      ? `₹${Math.round(displayOrder.totals.total)}`
      : '₹--';

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      <div className={styles.premiumSuccessScreen}>
        <section className={styles.premiumOrderCard}>
          <div className={styles.premiumTopRow}>
            <div className={styles.premiumTickWrap}>
              <span className={styles.premiumTick}>✓</span>
            </div>

            <div className={styles.premiumHeaderText}>
              <span className={styles.premiumEyebrow}>Order placed</span>
              <h1>We’re preparing your food</h1>
              <p>
                Your order is confirmed. Track your delivery partner and order status from here.
              </p>
            </div>
          </div>

          <div className={styles.deliveryPromiseCard}>
            <div>
              <span>Estimated delivery</span>
              <strong>{etaMinutes} mins</strong>
            </div>

            <div className={styles.deliveryModePill}>
              {deliverySpeed === 'batched' ? 'Saver delivery' : 'Priority delivery'}
            </div>
          </div>

          <div className={styles.partnerCard}>
            <div className={styles.partnerIcon}>🛵</div>

            <div className={styles.partnerInfo}>
              <span>Delivery partner</span>
              <strong>
                {driverName} is {driverDistance} km away
              </strong>
              <p>
                {deliveryPartner.statusText ||
                  'Delivery partner is heading to the restaurant'}
                . Arriving in about {etaMinutes} minutes.
              </p>
            </div>
          </div>

          <div className={styles.timelineCard}>
            <div className={styles.timelineHeader}>
              <span>Current status</span>
              <strong>Preparing</strong>
            </div>

            <div className={styles.timelineTrack}>
              <div className={styles.timelineStepDone}>
                <span></span>
                <p>Placed</p>
              </div>

              <div className={styles.timelineLineDone}></div>

              <div className={styles.timelineStepDone}>
                <span></span>
                <p>Preparing</p>
              </div>

              <div className={styles.timelineLine}></div>

              <div className={styles.timelineStep}>
                <span></span>
                <p>On the way</p>
              </div>
            </div>
          </div>

          <div className={styles.receiptPanel}>
            <div className={styles.receiptHeader}>
              <h2>Order summary</h2>
              <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            </div>

            <div className={styles.receiptItems}>
              {displayItems.slice(0, 3).map((item) => (
                <div className={styles.receiptItem} key={item.id || item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.restaurant || 'Swadishtt kitchen'}</span>
                  </div>

                  <p>
                    {item.quantity || 1} × ₹{item.price}
                  </p>
                </div>
              ))}

              {displayItems.length > 3 && (
                <div className={styles.moreItems}>
                  +{displayItems.length - 3} more item{displayItems.length - 3 > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoBox}>
              <span>Order ID</span>
              <strong>#{orderLabel}</strong>
            </div>

            <div className={styles.infoBox}>
              <span>Payment</span>
              <strong>{paymentLabel}</strong>
            </div>

            <div className={styles.infoBox}>
              <span>Total paid</span>
              <strong>{totalLabel}</strong>
            </div>

            <div className={styles.infoBox}>
              <span>Status</span>
              <strong>Preparing</strong>
            </div>
          </div>

          <div className={styles.deliveryAddressCard}>
            <div className={styles.addressIcon}>📍</div>

            <div>
              <span>Delivering to</span>
              <p>{deliveryText}</p>
            </div>
          </div>

          <div className={styles.premiumActions}>
            <button
              type="button"
              className={styles.trackPrimaryBtn}
              onClick={() => {
                clearCart();
                router.push(`/services/swadisht/order-tracking?id=${orderLabel}`);
              }}
            >
              Track order
            </button>

            <button
              type="button"
              className={styles.trackSecondaryBtn}
              onClick={() => router.push('/services/swadisht/orders')}
            >
              View all orders
            </button>
          </div>

          <p className={styles.autoRedirectNote}>
            Opening live tracking in a few seconds...
          </p>
        </section>
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

            {/* Step 1.5: Delivery Speed Selector */}
            {step === 1 && (
              <section className={styles.deliverySpeedBox}>
                <h3 className={styles.speedHeading}>Would you wait 15 minutes to save ₹20?</h3>
                
                
                <div className={styles.speedOptions}>
                  <div 
                    className={`${styles.speedOption} ${deliverySpeed === 'instant' ? styles.speedOptionInstantActive : ''}`}
                    onClick={() => setDeliverySpeed('instant')}
                  >
                    <div className={styles.speedOptionLeft}>
                      <span className={styles.speedIcon}>⚡</span>
                      <div className={styles.speedInfo}>
                        <span className={styles.speedTitle}>Get it in 10 min</span>
                        <span className={styles.speedDesc}>Standard — a rider just for you</span>
                      </div>
                    </div>
                    <span className={styles.speedOffText}>₹0 off</span>
                  </div>

                  <div 
                    className={`${styles.speedOption} ${deliverySpeed === 'batched' ? styles.speedOptionActive : ''}`}
                    onClick={() => setDeliverySpeed('batched')}
                  >
                    <div className={styles.speedOptionLeft}>
                      <span className={styles.speedIcon}>🕒</span>
                      <div className={styles.speedInfo}>
                        <span className={styles.speedTitle}>I can wait · ~25 min</span>
                        <span className={styles.speedDesc}>We'll batch you with a nearby order</span>
                      </div>
                    </div>
                    <span className={styles.saveBadge}>SAVE ₹20</span>
                  </div>
                </div>

                <p className={styles.speedFooter}>One rider · two nearby orders · lower cost for everyone</p>
                <h4 className={styles.speedTagline}>Speed is a feature. So is <span>patience.</span></h4>
              </section>
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

                {paymentError && (
                  <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>
                    {paymentError}
                  </div>
                )}

                <button
                  className={styles.placeOrderBtn}
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing Payment...' : `Place Order - ₹${total}`}
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
              {deliverySpeed === 'batched' && (
                <div className={styles.summaryRow} style={{ color: '#059669', fontWeight: 'bold' }}>
                  <span>Delivery Discount (Batched)</span>
                  <span>-₹20</span>
                </div>
              )}

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
