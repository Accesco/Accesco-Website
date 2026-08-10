'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { buildUnifiedStores, clearAllBrandCarts } from '@/lib/unifiedCart';
import { payWithRazorpay } from '@/lib/razorpayService';
import { useAuth } from '@/app/components/AuthProvider';
import styles from './checkout.module.css';

const STORE_NAMES = {
  swadishtt: 'Swadishtt',
  grokly: 'Grokly',
  instastyle: 'Insta Style',
};

function formatINR(amount) {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// Persists one brand's slice of the unified order using that brand's own
// existing order-storage mechanism, so its "My Orders"/tracking pages keep
// working unmodified. Best-effort: the payment already succeeded, so a
// failed sync call here must never block the user's confirmation screen.
async function placeGroklyOrder({ items, subtotal, address, unifiedOrderId, payment, paymentMethod, user }) {
  const orderId = `GRK-${Date.now()}`;
  const order = {
    id: orderId,
    status: 'PLACED',
    timestamp: new Date().toISOString(),
    venture: 'Grokly',
    unifiedOrderId,
    userId: user?.uid || null,
    customerEmail: address.email,
    customerName: address.name,
    deviceId: typeof window !== 'undefined' ? localStorage.getItem('grokly_device_id') : null,
    items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
    subtotal,
    deliveryFee: 0,
    discount: 0,
    total: subtotal,
    totals: { subtotal, deliveryFee: 0, discount: 0, total: subtotal },
    ...(paymentMethod === 'cod'
      ? { paymentMethod: 'cod' }
      : { paymentMethod: 'razorpay', razorpayOrderId: payment.orderId, razorpayPaymentId: payment.paymentId }),
    address: address.address,
    phone: address.phone,
  };

  try {
    await fetch('/api/grokly/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order, customerEmail: address.email }),
    });
  } catch (err) {
    console.error('[unified checkout] Grokly order sync failed:', err);
  }

  return {
    key: 'grokly',
    name: STORE_NAMES.grokly,
    theme: 'grokly',
    id: orderId,
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
    subtotal,
    trackingPath: `/services/grokly/order-tracking?id=${orderId}`,
  };
}

async function placeInstaStyleOrder({ items, subtotal, address, unifiedOrderId, payment, paymentMethod, user }) {
  const orderId = `INS-${Date.now()}`;
  const order = {
    id: orderId,
    status: 'PLACED',
    timestamp: new Date().toISOString(),
    venture: 'InstaStyle',
    unifiedOrderId,
    userId: user?.uid || null,
    customerEmail: address.email,
    customerName: address.name,
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
      selectedSize: i.selectedSize,
      selectedColor: i.selectedColor,
    })),
    totals: { subtotal, deliveryFee: 0, shippingFee: 0, gst: 0, discount: 0, total: subtotal },
    address: {
      addressLine1: address.address,
      city: address.city,
      pincode: address.pincode,
    },
    phone: address.phone,
    ...(paymentMethod === 'cod'
      ? { paymentMethod: 'cod' }
      : { paymentMethod: 'razorpay', razorpayOrderId: payment.orderId, razorpayPaymentId: payment.paymentId }),
  };

  try {
    await fetch('/api/instastyle/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order, customerEmail: address.email }),
    });
  } catch (err) {
    console.error('[unified checkout] InstaStyle order sync failed:', err);
  }

  return {
    key: 'instastyle',
    name: STORE_NAMES.instastyle,
    theme: 'instastyle',
    id: orderId,
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
    subtotal,
    trackingPath: `/services/instastyle/order-tracking?id=${orderId}`,
  };
}

async function placeSwadishttOrder({ items, subtotal, address, unifiedOrderId, payment, paymentMethod, user }) {
  const orderId = `SW${Date.now().toString(36).toUpperCase()}`;
  const order = {
    id: orderId,
    status: 'CONFIRMED',
    placedAt: new Date().toISOString(),
    unifiedOrderId,
    userId: user?.uid || null,
    customerEmail: address.email,
    customerName: address.name,
    ...(paymentMethod === 'cod'
      ? { paymentMethod: 'cod' }
      : { paymentMethod: 'razorpay', razorpayOrderId: payment.orderId, razorpayPaymentId: payment.paymentId }),
    delivery: {
      name: address.name,
      phone: address.phone,
      email: address.email,
      address: address.address,
      city: address.city,
      pincode: address.pincode,
    },
    deliveryPartner: {
      name: 'Ravi Kumar',
      distanceKm: 1.8,
      etaMinutes: 10,
      statusText: 'Delivery partner is heading to the restaurant',
    },
    totals: { subtotal, deliveryFee: 0, platformFee: 0, gst: 0, total: subtotal },
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
      restaurant: i.variant || 'Regular',
      sku: `SWD-GEN-${String(i.id).replace(/[^0-9]/g, '') || '00'}`,
    })),
  };

  try {
    const raw = localStorage.getItem('swadishtt-orders');
    const existing = raw ? JSON.parse(raw) : [];
    localStorage.setItem('swadishtt-orders', JSON.stringify([order, ...(Array.isArray(existing) ? existing : [])]));
  } catch (err) {
    console.error('[unified checkout] Failed to save Swadishtt order locally:', err);
  }

  try {
    await fetch('/api/swadishtt/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order, customerEmail: address.email }),
    });
  } catch (err) {
    console.error('[unified checkout] Swadishtt Firestore sync failed:', err);
  }

  try {
    await fetch('/api/swadishtt/orders/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        newStatus: 'CONFIRMED',
        customerEmail: address.email,
        customerName: address.name,
        orderData: order,
      }),
    });
  } catch (err) {
    console.error('[unified checkout] Swadishtt confirmation email failed:', err);
  }

  return {
    key: 'swadishtt',
    name: STORE_NAMES.swadishtt,
    theme: 'swadishtt',
    id: orderId,
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
    subtotal,
    trackingPath: `/services/swadisht/order-tracking?id=${orderId}`,
  };
}

const STORE_PLACERS = {
  grokly: placeGroklyOrder,
  instastyle: placeInstaStyleOrder,
  swadishtt: placeSwadishttOrder,
};

export default function UnifiedCheckoutPage() {
  const router = useRouter();
  const { user, getIdToken } = useAuth();

  const [isMounted, setIsMounted] = useState(false);
  const [stores, setStores] = useState([]);
  const [step, setStep] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrders, setPlacedOrders] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const built = await buildUnifiedStores(user);
      if (!cancelled) {
        setStores(built);
        setIsMounted(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let storedLocation = null;
    try {
      const rawLocation = localStorage.getItem('userLocation');
      if (rawLocation) storedLocation = JSON.parse(rawLocation);
    } catch {
      // ignore malformed storage
    }

    const resolvedCity =
      (typeof storedLocation?.city === 'string' && storedLocation.city) ||
      (typeof storedLocation?.state === 'string' && storedLocation.state) ||
      '';
    const resolvedAddress =
      (typeof storedLocation?.fullAddress === 'string' && storedLocation.fullAddress) ||
      (typeof storedLocation?.formattedAddress === 'string' && storedLocation.formattedAddress) ||
      (typeof storedLocation?.displayAddress === 'string' && storedLocation.displayAddress) ||
      '';
    const resolvedPincode =
      (typeof storedLocation?.pincode === 'string' && storedLocation.pincode) ||
      (typeof storedLocation?.postalCode === 'string' && storedLocation.postalCode) ||
      '';

    setDeliveryAddress((prev) => ({
      ...prev,
      name: prev.name || (typeof user?.name === 'string' ? user.name : ''),
      phone: prev.phone || (typeof user?.phone === 'string' ? user.phone : ''),
      email: prev.email || (typeof user?.email === 'string' ? user.email : ''),
      address: prev.address || resolvedAddress,
      city: prev.city || resolvedCity,
      pincode: prev.pincode || resolvedPincode,
    }));
  }, [user]);

  const activeStores = useMemo(() => stores.filter((s) => s.items.length > 0), [stores]);
  const totalItems = activeStores.reduce((sum, s) => sum + s.itemCount, 0);
  const subTotal = activeStores.reduce((sum, s) => sum + s.subtotal, 0);
  const platformFee = subTotal > 0 ? 18 : 0;
  const grandTotal = subTotal + platformFee;

  useEffect(() => {
    if (!isMounted || orderPlaced) return;
    if (activeStores.length === 0) router.replace('/cart');
  }, [isMounted, orderPlaced, activeStores.length, router]);

  const validateAddress = () => {
    const errors = {};
    if (!deliveryAddress.name.trim()) errors.name = 'Full name is required';
    if (!deliveryAddress.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(deliveryAddress.phone.trim())) errors.phone = 'Invalid 10-digit phone';
    if (!deliveryAddress.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deliveryAddress.email.trim())) errors.email = 'Invalid email address';
    if (!deliveryAddress.address.trim()) errors.address = 'Complete address is required';
    if (!deliveryAddress.city.trim()) errors.city = 'City is required';
    if (!deliveryAddress.pincode.trim()) errors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(deliveryAddress.pincode.trim())) errors.pincode = 'Invalid 6-digit pincode';

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (validateAddress()) setStep(2);
  };

  const handlePay = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setPaymentError('');

    try {
      // Cash on Delivery skips the payment gateway entirely.
      const payment = paymentMethod === 'cod'
        ? null
        : await payWithRazorpay({
            amount: grandTotal,
            receipt: `unified_${Date.now()}`,
            name: 'Accesco Living',
            description: `Order across ${activeStores.length} store(s) · ${totalItems} item(s)`,
            prefill: {
              name: deliveryAddress.name,
              email: deliveryAddress.email,
              contact: deliveryAddress.phone,
            },
            theme: { color: '#7A0042' },
          });

      const unifiedOrderId = `UNI-${Date.now()}`;
      const results = await Promise.all(
        activeStores.map((store) =>
          STORE_PLACERS[store.key]({
            items: store.items,
            subtotal: store.subtotal,
            address: deliveryAddress,
            unifiedOrderId,
            payment,
            paymentMethod,
            user,
          })
        )
      );

      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order: {
              id: unifiedOrderId,
              status: 'PLACED',
              placedAt: new Date().toISOString(),
              userId: user?.uid || null,
              customerEmail: deliveryAddress.email,
              customerName: deliveryAddress.name,
              address: deliveryAddress,
              ...(paymentMethod === 'cod'
                ? { paymentMethod: 'cod' }
                : { paymentMethod: 'razorpay', razorpayOrderId: payment.orderId, razorpayPaymentId: payment.paymentId }),
              subtotal: subTotal,
              platformFee,
              grandTotal,
              itemCount: totalItems,
              stores: results.map((r) => ({
                key: r.key,
                name: r.name,
                orderId: r.id,
                itemCount: r.itemCount,
                subtotal: r.subtotal,
                trackingPath: r.trackingPath,
              })),
            },
          }),
        });
      } catch (err) {
        console.error('[unified checkout] Unified order record failed:', err);
      }

      await clearAllBrandCarts({ user, getIdToken });

      setPlacedOrders(results);
      setOrderPlaced(true);
    } catch (err) {
      console.error('[unified checkout] Payment failed:', err);
      setPaymentError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    const paidTotal = placedOrders.reduce((sum, o) => sum + o.subtotal, 0) + platformFee;
    return (
      <div className={styles.page}>
        <div className={styles.confirmWrap}>
          <div className={styles.confirmCard}>
            <div className={styles.confirmTick}>✓</div>
            <h1 className={styles.confirmTitle}>Order placed!</h1>
            <p className={styles.confirmDesc}>
              {paymentMethod === 'cod'
                ? `Cash on Delivery order of ${formatINR(paidTotal)} booked`
                : `One payment of ${formatINR(paidTotal)} booked`} {totalItems} item{totalItems === 1 ? '' : 's'} across {placedOrders.length} store{placedOrders.length === 1 ? '' : 's'}.
            </p>

            <div className={styles.confirmOrdersList}>
              {placedOrders.map((order) => (
                <Link
                  href={order.trackingPath}
                  key={order.key}
                  className={`${styles.confirmOrderRow} ${styles[`theme-${order.theme}`]}`}
                >
                  <div className={styles.confirmOrderInfo}>
                    <div className={styles.confirmOrderStore}>{order.name}</div>
                    <div className={styles.confirmOrderMeta}>#{order.id} &bull; {order.itemCount} item{order.itemCount === 1 ? '' : 's'}</div>
                  </div>
                  <div className={styles.confirmOrderAmount}>{formatINR(order.subtotal)}</div>
                </Link>
              ))}
            </div>

            <div className={styles.confirmTotalRow}>
              <span>{paymentMethod === 'cod' ? 'Total due on delivery' : 'Total paid'}</span>
              <span>{formatINR(paidTotal)}</span>
            </div>

            <Link href="/cart" className={styles.confirmBackBtn}>
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isMounted || activeStores.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.body}>
          <div className={styles.emptyState}>
            <p>Loading checkout…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <button
          className={styles.backBtn}
          onClick={() => (step === 2 ? setStep(1) : router.push('/cart'))}
          aria-label="Go back"
        >
          <BackIcon />
        </button>
        <div>
          <h1 className={styles.title}>Checkout</h1>
          <p className={styles.subtitle}>{activeStores.length} Store{activeStores.length === 1 ? '' : 's'} &nbsp;•&nbsp; {totalItems} Item{totalItems === 1 ? '' : 's'}</p>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.mainColumn}>
          {step === 1 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Delivery Address</h2>
              <form onSubmit={handleAddressSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Full Name *</label>
                    <input
                      className={`${styles.formInput} ${addressErrors.name ? styles.inputError : ''}`}
                      value={deliveryAddress.name}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, name: e.target.value })}
                    />
                    {addressErrors.name && <span className={styles.fieldError}>{addressErrors.name}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone Number *</label>
                    <input
                      className={`${styles.formInput} ${addressErrors.phone ? styles.inputError : ''}`}
                      value={deliveryAddress.phone}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                    />
                    {addressErrors.phone && <span className={styles.fieldError}>{addressErrors.phone}</span>}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address *</label>
                  <input
                    type="email"
                    className={`${styles.formInput} ${addressErrors.email ? styles.inputError : ''}`}
                    placeholder="For order confirmation"
                    value={deliveryAddress.email}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, email: e.target.value })}
                  />
                  {addressErrors.email && <span className={styles.fieldError}>{addressErrors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Complete Address *</label>
                  <textarea
                    className={`${styles.formTextarea} ${addressErrors.address ? styles.inputError : ''}`}
                    rows={3}
                    value={deliveryAddress.address}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address: e.target.value })}
                  />
                  {addressErrors.address && <span className={styles.fieldError}>{addressErrors.address}</span>}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>City *</label>
                    <input
                      className={`${styles.formInput} ${addressErrors.city ? styles.inputError : ''}`}
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                    />
                    {addressErrors.city && <span className={styles.fieldError}>{addressErrors.city}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Pincode *</label>
                    <input
                      className={`${styles.formInput} ${addressErrors.pincode ? styles.inputError : ''}`}
                      value={deliveryAddress.pincode}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                    />
                    {addressErrors.pincode && <span className={styles.fieldError}>{addressErrors.pincode}</span>}
                  </div>
                </div>

                <button type="submit" className={styles.continueBtn}>
                  Continue to Payment
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className={styles.section}>
              <button className={styles.backToAddressBtn} onClick={() => setStep(1)}>
                &larr; Back to address
              </button>
              <h2 className={styles.sectionTitle}>Review &amp; Pay</h2>

              {activeStores.map((store) => (
                <div key={store.key} className={`${styles.storeGroup} ${styles[`theme-${store.theme}`]}`}>
                  <div className={styles.storeGroupHeader}>
                    <span>{store.name}</span>
                    <span>{formatINR(store.subtotal)}</span>
                  </div>
                  <div className={styles.storeGroupItems}>
                    {store.items.map((item) => (
                      <div className={styles.summaryItemRow} key={item.key}>
                        <span className={styles.summaryItemName}>{item.name}</span>
                        <span className={styles.summaryItemQty}>x{item.quantity}</span>
                        <span className={styles.summaryItemPrice}>{formatINR(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <h2 className={styles.sectionTitle}>Payment Method</h2>
              <div className={styles.paymentOptions}>
                <div
                  className={`${styles.paymentOption} ${paymentMethod === 'razorpay' ? styles.selected : ''}`}
                  onClick={() => setPaymentMethod('razorpay')}
                >
                  <div className={styles.paymentRadio}>
                    {paymentMethod === 'razorpay' && <div className={styles.radioSelected} />}
                  </div>
                  <div className={styles.paymentInfo}>
                    <span className={styles.paymentTitle}>Pay Online</span>
                    <span className={styles.paymentDesc}>UPI, Card, Netbanking &mdash; via Razorpay</span>
                  </div>
                </div>

                <div
                  className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.selected : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className={styles.paymentRadio}>
                    {paymentMethod === 'cod' && <div className={styles.radioSelected} />}
                  </div>
                  <div className={styles.paymentInfo}>
                    <span className={styles.paymentTitle}>Cash on Delivery</span>
                    <span className={styles.paymentDesc}>Pay when your order arrives</span>
                  </div>
                </div>
              </div>

              {paymentError && <div className={styles.errorBox}>{paymentError}</div>}

              <button className={styles.payBtn} onClick={handlePay} disabled={isProcessing}>
                {isProcessing
                  ? 'Processing…'
                  : paymentMethod === 'cod'
                    ? `Place Order (COD) · ${formatINR(grandTotal)}`
                    : `Pay ${formatINR(grandTotal)}`} <ArrowRightIcon />
              </button>
              <p className={styles.secureNote}>
                <LockIcon /> {paymentMethod === 'cod' ? 'One order, all stores' : 'Secured by Razorpay — one payment, all stores'}
              </p>
            </div>
          )}
        </div>

        <div className={styles.summaryColumn}>
          <div className={styles.billPanel}>
            <h2 className={styles.sectionTitle}>Bill Summary</h2>
            {activeStores.map((store) => (
              <div className={styles.billLine} key={store.key}>
                <span>{store.name}</span>
                <span>{formatINR(store.subtotal)}</span>
              </div>
            ))}
            <div className={styles.billDivider} />
            <div className={styles.billLine}>
              <span>Sub Total</span>
              <span>{formatINR(subTotal)}</span>
            </div>
            <div className={styles.billLine}>
              <span>Delivery Charges</span>
              <span className={styles.freeTag}>FREE</span>
            </div>
            <div className={styles.billLine}>
              <span>Platform Fees</span>
              <span>{formatINR(platformFee)}</span>
            </div>
            <div className={styles.billDivider} />
            <div className={styles.grandTotalLine}>
              <span>Grand Total</span>
              <span>{formatINR(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
