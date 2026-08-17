'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  buildUnifiedStores,
  clearAllBrandCarts,
  getGroklyCart,
  setGroklyCart,
  getSwadishttCart,
  setSwadishttCart,
  getInstaStyleCart,
  setInstaStyleCart,
} from '@/lib/unifiedCart';
import { STORE_PLACERS, postUnifiedOrderRecord } from '@/lib/unifiedCheckoutOrders';
import { payWithRazorpay } from '@/lib/razorpayService';
import { useAuth } from '@/app/components/AuthProvider';
import styles from './checkout.module.css';

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
  // Whether the address fields were prefilled from the location already
  // selected on the homepage (cleared once the user edits the address).
  const [usedSavedLocation, setUsedSavedLocation] = useState(false);

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

    let storedLocation = userData?.selectedLocation || user?.selectedLocation || null;

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

    if (!deliveryAddress.address && (resolvedAddress || resolvedCity || resolvedPincode)) {
      setUsedSavedLocation(true);
    }

    setDeliveryAddress((prev) => ({
      ...prev,
      name: prev.name || (typeof user?.name === 'string' ? user.name : ''),
      phone: prev.phone || (typeof user?.phone === 'string' ? user.phone : ''),
      email: prev.email || (typeof user?.email === 'string' ? user.email : ''),
      address: prev.address || resolvedAddress,
      city: prev.city || resolvedCity,
      pincode: prev.pincode || resolvedPincode,
    }));
  }, [user, userData]);

  const activeStores = useMemo(() => stores.filter((s) => s.items.length > 0), [stores]);
  const totalItems = activeStores.reduce((sum, s) => sum + s.itemCount, 0);
  const subTotal = activeStores.reduce((sum, s) => sum + s.subtotal, 0);
  const platformFee = subTotal > 0 ? 18 : 0;
  const grandTotal = subTotal + platformFee;

  useEffect(() => {
    if (!isMounted || orderPlaced) return;
    if (activeStores.length === 0) router.replace('/cart');
  }, [isMounted, orderPlaced, activeStores.length, router]);

  // Lets the user drop an item right from checkout, without bouncing back to
  // /cart — same per-brand storage each cart already reads/writes, see
  // lib/unifiedCart.js.
  const removeItem = async (storeKey, item) => {
    if (storeKey === 'swadishtt') {
      const cart = await getSwadishttCart(user);
      await setSwadishttCart(user, cart.filter((c) => c.id !== item.id));
    } else if (storeKey === 'grokly') {
      const cart = getGroklyCart();
      const next = { ...cart };
      delete next[item.id];
      setGroklyCart(next);
    } else if (storeKey === 'instastyle') {
      const cart = getInstaStyleCart();
      const matches = (c) => c.id === item.id && c.selectedSize === item.selectedSize && c.selectedColor === item.selectedColor;
      setInstaStyleCart(cart.filter((c) => !matches(c)));
    }
    setStores(await buildUnifiedStores(user));
  };

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

      await postUnifiedOrderRecord({
        unifiedOrderId,
        user,
        address: deliveryAddress,
        paymentMethod,
        payment,
        subtotal: subTotal,
        platformFee,
        grandTotal,
        itemCount: totalItems,
        results,
      });

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
          onClick={() => (step === 2 ? setStep(1) : router.back())}
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
                <h3 className={styles.formSubheading}>Contact Details</h3>
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

                <h3 className={styles.formSubheading}>Delivery Address</h3>

                <div className={styles.formGroup}>
                  <div className={styles.addressLabelRow}>
                    <label className={styles.formLabel}>Complete Address *</label>
                    {usedSavedLocation && (
                      <span className={styles.autoFilledBadge}>📍 From your saved location</span>
                    )}
                  </div>
                  <textarea
                    className={`${styles.formTextarea} ${addressErrors.address ? styles.inputError : ''}`}
                    rows={3}
                    value={deliveryAddress.address}
                    onChange={(e) => {
                      setUsedSavedLocation(false);
                      setDeliveryAddress({ ...deliveryAddress, address: e.target.value });
                    }}
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
                        <button
                          type="button"
                          className={styles.summaryItemRemove}
                          onClick={() => removeItem(store.key, item)}
                          aria-label={`Remove ${item.name}`}
                        >
                          ✕
                        </button>
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
              <div className={styles.billStoreBlock} key={store.key}>
                <div className={styles.billLine}>
                  <span className={styles.billStoreLabel}>{store.name}</span>
                  <span>{formatINR(store.subtotal)}</span>
                </div>
                <div className={styles.billItemList}>
                  {store.items.map((item) => (
                    <div className={styles.billItemLine} key={item.key}>
                      <span>
                        {item.name}
                        {item.variant ? ` (${item.variant})` : ''} × {item.quantity}
                      </span>
                      <span className={styles.billItemRight}>
                        {formatINR(item.price * item.quantity)}
                        <button
                          type="button"
                          className={styles.billItemRemove}
                          onClick={() => removeItem(store.key, item)}
                          aria-label={`Remove ${item.name}`}
                        >
                          ✕
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
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
