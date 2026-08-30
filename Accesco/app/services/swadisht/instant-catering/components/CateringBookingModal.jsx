'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '../instant-catering.module.css';
import { useAuth } from '../../../../components/AuthProvider';
import { loadRazorpayScript } from '@/lib/razorpayService';
import { fetchWallet } from '@/lib/walletService';

export default function CateringBookingModal({ pkg, onClose, onSuccess }) {
  const { user, getIdToken } = useAuth();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Payment states
  const MIN_ADVANCE_MAP = {
    'cp-small': 2100,
    'cp-birthday': 3500,
    'cp-office': 2450,
    'cp-wedding': 7000,
  };
  const minAdvance = MIN_ADVANCE_MAP[pkg?.id] || Math.ceil((pkg?.price || 0) * 0.7);
  const [payAmount, setPayAmount] = useState(String(minAdvance));
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'wallet' | 'razorpay'
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentSuccessDetails, setPaymentSuccessDetails] = useState(null);

  const modalRef = useRef(null);

  // Fetch user wallet balance when modal opens
  useEffect(() => {
    if (!user) return;
    const walletUid = user.phone ? user.phone.replace(/[^\d]/g, '') : user.uid;
    (async () => {
      try {
        const { wallet } = await fetchWallet(getIdToken, walletUid);
        if (wallet) setWalletBalance(wallet.balance || 0);
      } catch (e) {
        console.warn('Failed to fetch wallet in booking modal:', e);
      }
    })();
  }, [user, getIdToken]);

  // Lock scrolling & keyboard event listener
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Focus first element
    if (modalRef.current) {
      const focusable = modalRef.current.querySelectorAll('button, input, textarea');
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Autofill details from the signed-in account
  useEffect(() => {
    if (!user) return;
    if (user.name) setName(user.name);
    if (user.phone) setPhone(user.phone);
    if (user.email) setEmail(user.email);
  }, [user]);

  // Autofill delivery address from localStorage
  useEffect(() => {
    try {
      const storedLoc = JSON.parse(localStorage.getItem('userLocation') || '{}');
      const formatted =
        storedLoc?.fullAddress ||
        storedLoc?.formattedAddress ||
        storedLoc?.displayAddress ||
        (storedLoc?.area && storedLoc?.city ? `${storedLoc.area}, ${storedLoc.city}` : '');
      if (formatted) setAddress(formatted);
    } catch (e) {
      console.warn('Location storage read error', e);
    }
  }, []);

  const minDate = new Date().toISOString().split('T')[0];

  const validateStep2 = () => {
    const errs = {};
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedAddress = address.trim();

    if (!trimmedName) errs.name = 'Please enter your name';
    
    // Indian 10-digit phone format validation
    if (!trimmedPhone) {
      errs.phone = 'Please enter your phone number';
    } else if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      errs.phone = 'Enter a valid 10-digit Indian phone number';
    }

    if (!trimmedEmail) {
      errs.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = 'Enter a valid email address';
    }

    if (!trimmedAddress) errs.address = 'Please enter the delivery address';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      setStep(3);
    }
  };

  const numPayAmount = Number(payAmount);
  const isAmountTooLow = !Number.isFinite(numPayAmount) || numPayAmount < minAdvance;
  const isAmountTooHigh = Number.isFinite(numPayAmount) && numPayAmount > pkg.price;
  const isValidPaymentAmount = !isAmountTooLow && !isAmountTooHigh;
  const isWalletInsufficient = paymentMethod === 'wallet' && walletBalance < numPayAmount;
  const isValidPayment = isValidPaymentAmount && !isWalletInsufficient;

  const handleConfirmPayment = async () => {
    if (!isValidPayment || submitting) return;
    setSubmitting(true);
    setApiError('');

    const bookingId = `CAT-${Date.now().toString(36).toUpperCase()}`;
    const walletUid = user?.phone ? user.phone.replace(/[^\d]/g, '') : user?.uid;

    const bookingData = {
      id: bookingId,
      name,
      phone,
      email,
      date,
      time,
      notes,
      serves: pkg.serves,
      dietary: pkg.selectedDietary || 'Standard',
      cuisine: pkg.selectedCuisine || 'Standard',
      delivery: { address, name, phone, email },
    };

    try {
      const token = await getIdToken();
      if (!token || !user?.uid) {
        throw new Error('Please sign in to confirm your booking payment.');
      }

      const authHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-user-id': walletUid || user.uid,
      };

      // Option 1: Direct Wallet Payment
      if (paymentMethod === 'wallet') {
        const response = await fetch('/api/swadishtt/catering', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            action: 'pay_wallet',
            packageId: pkg.id,
            amount: numPayAmount,
            bookingData,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Wallet payment failed.');
        }

        setPaymentSuccessDetails({
          bookingId: data.bookingId,
          totalAmount: data.totalAmount,
          paidAmount: data.paidAmount,
          remainingAmount: data.remainingAmount,
          paymentMethod: 'WALLET',
        });
        onSuccess();
        return;
      }

      // Option 2: Razorpay Online Payment
      if (paymentMethod === 'razorpay') {
        const loaded = await loadRazorpayScript();
        if (!loaded) throw new Error('Failed to load Razorpay SDK. Please check your network connection.');

        const orderRes = await fetch('/api/swadishtt/catering', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            action: 'create_razorpay_order',
            packageId: pkg.id,
            amount: numPayAmount,
          }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) {
          throw new Error(orderData.error || 'Failed to create payment order.');
        }

        await new Promise((resolve, reject) => {
          const rzp = new window.Razorpay({
            key: orderData.keyId,
            amount: orderData.amount,
            currency: orderData.currency,
            order_id: orderData.orderId,
            name: 'Swadishtt Catering',
            description: `Advance for ${pkg.name}`,
            prefill: { name, email, contact: phone },
            theme: { color: pkg.accentColor || '#7A0042' },
            handler: async (response) => {
              try {
                const verifyRes = await fetch('/api/swadishtt/catering', {
                  method: 'POST',
                  headers: authHeaders,
                  body: JSON.stringify({
                    action: 'verify_razorpay_payment',
                    packageId: pkg.id,
                    amount: numPayAmount,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    bookingData,
                  }),
                });

                const verifyData = await verifyRes.json();
                if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed.');

                setPaymentSuccessDetails({
                  bookingId: verifyData.bookingId,
                  totalAmount: verifyData.totalAmount,
                  paidAmount: verifyData.paidAmount,
                  remainingAmount: verifyData.remainingAmount,
                  paymentMethod: 'RAZORPAY',
                });
                onSuccess();
                resolve(verifyData);
              } catch (verr) {
                setApiError(verr.message || 'Payment verification failed.');
                reject(verr);
              }
            },
            modal: {
              ondismiss: () => {
                setApiError('Payment was cancelled. Your booking is not yet confirmed.');
                reject(new Error('Payment cancelled'));
              },
            },
          });

          rzp.on('payment.failed', (resp) => {
            setApiError(resp?.error?.description || 'Payment failed.');
            reject(new Error(resp?.error?.description || 'Payment failed'));
          });

          rzp.open();
        });
      }
    } catch (err) {
      if (err.message !== 'Payment cancelled') {
        console.error('Catering payment error:', err);
        setApiError(err.message || 'Payment failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <h2 id="modal-title">Book {pkg.name}</h2>
            <p>Serves {pkg.serves} · ₹{pkg.price.toLocaleString()}</p>
          </div>
          <button 
            type="button" 
            className={styles.modalClose} 
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Stepper */}
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${step >= 1 ? styles.stepActive : ''}`}>
            <span className={styles.stepNum}>1</span>
            <span className={styles.stepLabel}>Schedule</span>
          </div>
          <div className={`${styles.step} ${step >= 2 ? styles.stepActive : ''}`}>
            <span className={styles.stepNum}>2</span>
            <span className={styles.stepLabel}>Details</span>
          </div>
          <div className={`${styles.step} ${step >= 3 ? styles.stepActive : ''}`}>
            <span className={styles.stepNum}>3</span>
            <span className={styles.stepLabel}>Confirm</span>
          </div>
        </div>

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>When is your event?</h3>
            
            <div className={styles.formRow}>
              <label className={styles.formLabel} htmlFor="event-date">Event Date *</label>
              <input
                type="date"
                id="event-date"
                className={styles.formInput}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                required
              />
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel} htmlFor="event-time">Delivery Time *</label>
              <input
                type="time"
                id="event-time"
                className={styles.formInput}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className={styles.deliveryNoteBox}>
              <strong>Notice Period Required:</strong> This pack requires a minimum of {pkg.deliveryTime} prep-and-delivery lead time. We suggest scheduling delivery 1 hour before guests arrive.
            </div>

            <div className={styles.stepBtns}>
              <button 
                type="button" 
                className={styles.backBtn} 
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.nextBtn}
                onClick={() => setStep(2)}
                disabled={!date || !time}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Contact Details */}
        {step === 2 && (
          <form className={styles.stepContent} onSubmit={handleStep2Submit}>
            <h3 className={styles.stepTitle}>Where should we deliver?</h3>

            <div className={styles.formRow}>
              <label className={styles.formLabel} htmlFor="contact-name">Full Name *</label>
              <input
                type="text"
                id="contact-name"
                className={`${styles.formInput} ${errors.name ? styles.inputError : ''}`}
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
                placeholder="Enter your full name"
                required
              />
              {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
            </div>

            <div className={styles.formRowSplit}>
              <div className={styles.formRow}>
                <label className={styles.formLabel} htmlFor="contact-phone">Phone Number *</label>
                <input
                  type="tel"
                  id="contact-phone"
                  className={`${styles.formInput} ${errors.phone ? styles.inputError : ''}`}
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: '' })); }}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  required
                />
                {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
              </div>

              <div className={styles.formRow}>
                <label className={styles.formLabel} htmlFor="contact-email">Email Address *</label>
                <input
                  type="email"
                  id="contact-email"
                  className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                  placeholder="you@example.com"
                  required
                />
                {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel} htmlFor="delivery-addr">Delivery Address *</label>
              <textarea
                id="delivery-addr"
                className={`${styles.formTextarea} ${errors.address ? styles.inputError : ''}`}
                value={address}
                onChange={(e) => { setAddress(e.target.value); setErrors(prev => ({ ...prev, address: '' })); }}
                placeholder="Building, street, Landmark, City & PIN code"
                rows="2"
                required
              />
              {errors.address && <span className={styles.fieldError}>{errors.address}</span>}
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel} htmlFor="special-notes">Special Instructions (Optional)</label>
              <textarea
                id="special-notes"
                className={styles.formTextarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify any spice preferences, food allergies, or landmark details..."
                rows="2"
              />
            </div>

            <div className={styles.stepBtns}>
              <button 
                type="button" 
                className={styles.backBtn} 
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="submit"
                className={styles.nextBtn}
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Payment & Finalize */}
        {step === 3 && (
          <div className={styles.stepContent}>
            {paymentSuccessDetails ? (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎉</div>
                  <h3 className={styles.stepTitle} style={{ color: '#059669', marginBottom: '4px' }}>
                    Payment & Booking Confirmed!
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    Booking ID: <strong>{paymentSuccessDetails.bookingId}</strong>
                  </p>
                </div>

                <div className={styles.summaryCard} style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
                  <div className={styles.summaryRow}>
                    <span>Selected Package:</span>
                    <span className={styles.summaryVal}>{pkg.name}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Total Package Price:</span>
                    <span className={styles.summaryVal}>₹{paymentSuccessDetails.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Amount Paid Now:</span>
                    <span className={styles.summaryVal} style={{ color: '#059669', fontWeight: '700' }}>
                      ₹{paymentSuccessDetails.paidAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Remaining Balance:</span>
                    <span className={styles.summaryVal} style={{ color: paymentSuccessDetails.remainingAmount > 0 ? '#b45309' : '#059669', fontWeight: '700' }}>
                      ₹{paymentSuccessDetails.remainingAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Payment Method:</span>
                    <span className={styles.summaryVal}>
                      {paymentSuccessDetails.paymentMethod === 'WALLET' ? 'Accesco Pay Wallet' : 'Razorpay (Online)'}
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Scheduled Delivery:</span>
                    <span className={styles.summaryVal}>{date} at {time}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#475569', margin: '16px 0', textAlign: 'center' }}>
                  A confirmation email has been sent to <strong>{email}</strong>.
                </p>

                <button
                  type="button"
                  className={styles.confirmBtn}
                  style={{ width: '100%', marginTop: '12px' }}
                  onClick={() => {
                    onSuccess();
                    onClose();
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <h3 className={styles.stepTitle}>Payment & Booking Confirmation</h3>

                <div className={styles.summaryCard}>
                  <div className={styles.summaryRow}>
                    <span>Package:</span>
                    <span className={styles.summaryVal}>{pkg.name} ({pkg.serves})</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Event Date & Time:</span>
                    <span className={styles.summaryVal}>{date} at {time}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Deliver To:</span>
                    <span className={styles.summaryVal}>{name} ({phone})</span>
                  </div>
                  <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                    <span>Package Total Price:</span>
                    <span className={styles.summaryPrice}>₹{pkg.price.toLocaleString()}</span>
                  </div>
                </div>

                {/* Advance Payment Section */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', margin: '16px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>
                      Advance Payment Amount (₹)
                    </label>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px' }}>
                      Min 70%: ₹{minAdvance.toLocaleString()}
                    </span>
                  </div>

                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    min={minAdvance}
                    max={pkg.price}
                    className={styles.formInput}
                    style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', borderColor: !isValidPaymentAmount ? '#ef4444' : '#cbd5e1' }}
                    placeholder={`Min ₹${minAdvance.toLocaleString()}`}
                  />

                  {/* Validation Messages */}
                  {isAmountTooLow && (
                    <p style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '6px', fontWeight: '600' }}>
                      Minimum payment required is ₹{minAdvance.toLocaleString()} (70% of ₹{pkg.price.toLocaleString()}).
                    </p>
                  )}
                  {isAmountTooHigh && (
                    <p style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '6px', fontWeight: '600' }}>
                      Payment amount cannot exceed total package price of ₹{pkg.price.toLocaleString()}.
                    </p>
                  )}

                  {isValidPaymentAmount && (
                    <div style={{ marginTop: '10px', fontSize: '0.88rem', color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Remaining Balance After Payment:</span>
                      <strong style={{ color: '#059669' }}>₹{(pkg.price - numPayAmount).toLocaleString()}</strong>
                    </div>
                  )}
                </div>

                {/* Payment Method Selector */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '10px' }}>
                    Select Payment Method
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Option 1: Accesco Pay Wallet */}
                    <div
                      onClick={() => setPaymentMethod('wallet')}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: `2px solid ${paymentMethod === 'wallet' ? '#a81c5a' : '#e2e8f0'}`,
                        background: paymentMethod === 'wallet' ? '#fdf2f8' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'wallet'}
                          onChange={() => setPaymentMethod('wallet')}
                          style={{ accentColor: '#a81c5a', width: '18px', height: '18px' }}
                        />
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.92rem', color: '#0f172a' }}>Accesco Pay Wallet</strong>
                          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                            Available balance: <strong>₹{walletBalance.toLocaleString()}</strong>
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '1.2rem' }}>👛</span>
                    </div>

                    {/* Insufficient Wallet Balance Error */}
                    {paymentMethod === 'wallet' && isWalletInsufficient && (
                      <p style={{ color: '#dc2626', fontSize: '0.82rem', margin: '2px 0 0 8px', fontWeight: '600' }}>
                        Insufficient wallet balance. Available: ₹{walletBalance.toLocaleString()}. Required: ₹{numPayAmount.toLocaleString()}.
                      </p>
                    )}

                    {/* Option 2: Razorpay */}
                    <div
                      onClick={() => setPaymentMethod('razorpay')}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: `2px solid ${paymentMethod === 'razorpay' ? '#a81c5a' : '#e2e8f0'}`,
                        background: paymentMethod === 'razorpay' ? '#fdf2f8' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'razorpay'}
                          onChange={() => setPaymentMethod('razorpay')}
                          style={{ accentColor: '#a81c5a', width: '18px', height: '18px' }}
                        />
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.92rem', color: '#0f172a' }}>Razorpay (Online)</strong>
                          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                            UPI / QR Code / Net Banking / Cards
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '1.2rem' }}>📱</span>
                    </div>
                  </div>
                </div>

                {apiError && (
                  <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: '600', marginBottom: '16px', padding: '8px 12px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                    {apiError}
                  </div>
                )}

                <div className={styles.stepBtns}>
                  <button
                    type="button"
                    className={styles.backBtn}
                    onClick={() => setStep(2)}
                    disabled={submitting}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className={styles.confirmBtn}
                    onClick={handleConfirmPayment}
                    disabled={!isValidPayment || submitting}
                  >
                    {submitting ? 'Processing Payment...' : `Pay ₹${isValidPaymentAmount ? numPayAmount.toLocaleString() : '---'} & Confirm`}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
