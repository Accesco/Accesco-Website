'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth';
import { ShoppingCart, Utensils, Shirt, GlassWater } from 'lucide-react';
import styles from './AppShowcase.module.css';
import { auth } from '../lib/firebase';
import {
  addWaitlistEntry,
  validateWaitlistEntry,
  sendOtpEmailVerification,
  verifyOtpEmailCode,
} from '../lib/waitlistService';

export default function AppShowcase() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    interests: [],
    verificationCode: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaVerifierRef = useRef(null);

  // Optional email verification state
  const [emailCode, setEmailCode] = useState('');
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const interestOptions = [
    { id: 'grokly', label: 'Groceries & Essentials', icon: <ShoppingCart size={32} /> },
    { id: 'swadishtt', label: 'Food Delivery', icon: <Utensils size={32} /> },
    { id: 'instastyle', label: 'Fashion & Styling', icon: <Shirt size={32} /> },
    { id: 'dinex', label: 'Dining Experience', icon: <GlassWater size={32} /> },
  ];

  const toggleInterest = (id) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  // Converts user-entered phone to E.164 format required by Firebase
  function normalizePhone(phone) {
    const stripped = phone.replace(/[\s\-().]/g, '');
    if (stripped.startsWith('+')) return stripped;
    return '+91' + stripped.replace(/\D/g, '');
  }

  // Create + render the invisible reCAPTCHA once and reuse it (Firebase's recommended
  // pattern). Rendering ahead of time means the widget is already loaded before the
  // user sends an OTP, so the send itself is much faster.
  const ensureRecaptcha = () => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
      recaptchaVerifierRef.current.render().catch((e) => console.error('reCAPTCHA render failed:', e));
    }
    return recaptchaVerifierRef.current;
  };

  const sendPhoneOtp = async () => {
    if (!form.phone?.trim()) {
      setError('Please enter your phone number first');
      return;
    }

    // Prevent overlapping sends while one is still in flight
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const verifier = ensureRecaptcha();
      const phoneNumber = normalizePhone(form.phone.trim());
      const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setConfirmationResult(result);
      setPhoneCodeSent(true);
    } catch (err) {
      console.error('Phone OTP send failed:', err);
      // Reset the verifier so the next attempt starts from a clean state
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
      setError(err.message || 'Failed to send OTP. Check your phone number and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Optional: send an email verification code
  const sendEmailOtp = async () => {
    if (!form.email?.trim()) {
      setError('Please enter your email first');
      return;
    }

    setEmailLoading(true);
    setError('');

    try {
      await sendOtpEmailVerification(form.email.trim());
      setEmailCodeSent(true);
      setEmailVerified(false);
    } catch (err) {
      console.error('Email OTP send failed:', err);
      setError(err.message || 'Failed to send email code');
    } finally {
      setEmailLoading(false);
    }
  };

  // Optional: verify the email code the user entered
  const verifyEmailOtp = async () => {
    if (!/^\d{6}$/.test(emailCode.trim())) {
      setError('Please enter a valid 6-digit email code.');
      return;
    }

    setEmailLoading(true);
    setError('');

    try {
      await verifyOtpEmailCode(form.email.trim(), emailCode.trim());
      setEmailVerified(true);
    } catch (err) {
      console.error('Email OTP verify failed:', err);
      setError(err.message || 'Email verification failed');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleNext = () => {
    setError('');

    if (currentStep === 1) {
      if (!form.name?.trim() || !form.email?.trim() || !form.phone?.trim()) {
        setError('Please fill in all fields');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (form.interests.length === 0) {
        setError('Please select at least one interest');
        return;
      }
      setCurrentStep(3);
      if (!phoneCodeSent) {
        sendPhoneOtp();
      }
    }
  };

  const handlePrev = () => {
    setError('');
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationErrors = validateWaitlistEntry(form);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(' '));
      return;
    }

    if (!confirmationResult) {
      setError('Verification code is still being sent. Please wait a moment.');
      return;
    }

    if (!/^\d{6}$/.test(form.verificationCode.trim())) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      await confirmationResult.confirm(form.verificationCode.trim());
      setPhoneVerified(true);

      await addWaitlistEntry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        interests: form.interests.join(', '),
        emailVerified, // optional — true only if the user chose to verify their email
      });

      // Sign out after Firestore write — we only needed phone verification, not a persistent session
      await signOut(auth);

      setSuccess(true);
      setForm({ name: '', email: '', phone: '', interests: [], verificationCode: '' });
      setPhoneCodeSent(false);
      setPhoneVerified(false);
      setConfirmationResult(null);
      setEmailCode('');
      setEmailCodeSent(false);
      setEmailVerified(false);
      setCurrentStep(1);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Waitlist submit failed:', err);
      if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP. Please check the code and try again.');
      } else if (err.code === 'auth/code-expired') {
        setError('OTP has expired. Please request a new one.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Pre-warm the invisible reCAPTCHA on mount so the first OTP send is fast
  useEffect(() => {
    try {
      ensureRecaptcha();
    } catch (e) {
      console.error('reCAPTCHA warm-up failed:', e);
    }
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const stack = document.getElementById('stack');
    if (!stack) return;

    const cards = Array.from(stack.querySelectorAll('.stack-card'));
    let currentIndex = 0;

    const rotateStack = () => {
      cards.forEach((card, i) => {
        card.classList.remove('pos-1', 'pos-2', 'pos-3');
        const newPos = (i - currentIndex + 3) % 3;
        card.classList.add(`pos-${newPos + 1}`);
      });
      currentIndex = (currentIndex + 1) % cards.length;
    };

    const interval = setInterval(rotateStack, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
   <section id="waitlist" style={{ padding: '64px 20px', background: '#FFFDF8', position: 'relative' }}>

  {/* Invisible reCAPTCHA container required by Firebase Phone Auth */}
  <div id="recaptcha-container"></div>

  {/* Waitlist Section Header */}
  <div style={{ maxWidth: '1200px', margin: '0 auto 40px', padding: '0', textAlign: 'center' }}>

        <h2 className={styles.waitlistTitle}>
          Join the <span className={styles.highlight}>Revolution</span>
        </h2>

        <p className={styles.waitlistSubtitle} style={{ maxWidth: '100%', fontSize: '1.1rem' }}>
          Be the first to experience India's most intelligent commerce platform.
          Get exclusive early access and special launch benefits.
        </p>
      </div>

      <div className={styles.waitlistContainer}>
        {/* Left Side - Information (Poster) */}
        <div className={styles.waitlistInfo}>
          <div className={styles.waitlistPosterWrap}>
            <img
              src="/images/xpense-banner.jpg"
              alt="Accesco Living - Xpense Meter"
              className={styles.waitlistPosterImg}
              onError={(e) => {
                e.currentTarget.src = '/images/accesco_original.png';
                e.currentTarget.style.padding = '40px';
                e.currentTarget.style.background = 'linear-gradient(135deg, #7A0042, #1A0A0F)';
              }}
            />
          </div>

        </div>

        {/* Right Side - Form */}
   <div
  className={styles.waitlistFormWrapper}
  style={{
    background: '#FFFDF8',
    border: '2px solid #700457',
    transition: 'all 0.4s ease'
  }}

>
          <div className={styles.formHeader}>
            <h3 className={styles.formTitle}>Get Early Access</h3>
            <p className={styles.formDescription}>
              {currentStep === 1 && 'Tell us about yourself'}
              {currentStep === 2 && 'What interests you?'}
              {currentStep === 3 && 'Verify your phone number'}
            </p>
          </div>

          {/* Step Indicator */}
          <div className={styles.stepIndicator}>
  <div className={`${styles.stepDot} ${currentStep >= 1 ? styles.stepDotActive : ''}`} style={currentStep === 1 ? { background: '#700457', transform: 'scale(1.2)' } : {}}></div>
  <div className={`${styles.stepDot} ${currentStep >= 2 ? styles.stepDotActive : ''}`} style={currentStep === 2 ? { background: '#700457', transform: 'scale(1.2)' } : {}}></div>
  <div className={`${styles.stepDot} ${currentStep >= 3 ? styles.stepDotActive : ''}`} style={currentStep === 3 ? { background: '#700457', transform: 'scale(1.2)' } : {}}></div>
</div>

          {success && (
            <div className={styles.successMessage}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Welcome to the waitlist! We'll be in touch soon.
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address *</label>
                  <input
                    type="email"
                    className={styles.formInput}
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone Number *</label>
                  <input
                    type="tel"
                    className={styles.formInput}
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>

                <button type="button" className={styles.submitButton} onClick={handleNext}>
                  Next
                </button>
              </>
            )}

            {/* Step 2: Interests */}
            {currentStep === 2 && (
              <>
                <div className={styles.interestsGrid}>
                  {interestOptions.map((interest) => (
                    <div
                      key={interest.id}
                      className={`${styles.interestCard} ${form.interests.includes(interest.id) ? styles.interestCardSelected : ''}`}
                      onClick={() => toggleInterest(interest.id)}
                    >
                      <div className={styles.interestIcon}>{interest.icon}</div>
                      <div className={styles.interestLabel}>{interest.label}</div>
                    </div>
                  ))}
                </div>

                <div className={styles.buttonGroup}>
                  <button type="button" className={styles.navButton} onClick={handlePrev}>
                    Previous
                  </button>
                  <button type="button" className={styles.navButton} onClick={handleNext}>
                    Next
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Phone OTP Verification */}
            {currentStep === 3 && (
              <>
                <div className={styles.verificationSection}>
                  <div className={styles.verificationInfo}>
                    {phoneCodeSent ? (
                      <>
                        <p>We've sent a 6-digit OTP to <strong>{form.phone}</strong></p>
                        <p>Please check your SMS and enter the code below.</p>
                        {phoneVerified && <p style={{ color: '#22c55e' }}>Phone verified successfully.</p>}
                      </>
                    ) : (
                      <p>Sending OTP to your phone number...</p>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>OTP Code *</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Enter 6-digit OTP"
                      value={form.verificationCode}
                      onChange={(e) => setForm({ ...form, verificationCode: e.target.value })}
                      maxLength={6}
                      required
                      style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
                    />
                  </div>

                  <button
                    type="button"
                    className={styles.resendCode}
                    onClick={sendPhoneOtp}
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                </div>

                {/* Optional Email Verification */}
                <div
                  className={styles.verificationSection}
                  style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed #d1a5c4' }}
                >
                  <div className={styles.verificationInfo}>
                    <p style={{ fontWeight: 600 }}>
                      Verify your email <span style={{ color: '#888', fontWeight: 400 }}>(optional)</span>
                    </p>
                    {emailVerified ? (
                      <p style={{ color: '#22c55e' }}>Email verified successfully.</p>
                    ) : (
                      <p style={{ fontSize: '0.9rem', color: '#666' }}>
                        Optionally verify <strong>{form.email}</strong> for a more secure account.
                      </p>
                    )}
                  </div>

                  {!emailVerified && (
                    <>
                      {!emailCodeSent ? (
                        <button
                          type="button"
                          className={styles.navButton}
                          onClick={sendEmailOtp}
                          disabled={emailLoading}
                          style={{ width: '100%' }}
                        >
                          {emailLoading ? 'Sending...' : 'Send email code'}
                        </button>
                      ) : (
                        <>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Email Code</label>
                            <input
                              type="text"
                              className={styles.formInput}
                              placeholder="Enter 6-digit code"
                              value={emailCode}
                              onChange={(e) => setEmailCode(e.target.value)}
                              maxLength={6}
                              style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
                            />
                          </div>
                          <div className={styles.buttonGroup}>
                            <button
                              type="button"
                              className={styles.resendCode}
                              onClick={sendEmailOtp}
                              disabled={emailLoading}
                            >
                              Resend Code
                            </button>
                            <button
                              type="button"
                              className={styles.navButton}
                              onClick={verifyEmailOtp}
                              disabled={emailLoading}
                            >
                              {emailLoading ? 'Verifying...' : 'Verify Email'}
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className={styles.buttonGroup}>
                  <button type="button" className={styles.navButton} onClick={handlePrev}>
                    Previous
                  </button>
                  <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading && <span className={styles.loadingSpinner}></span>}
                    {loading ? 'Joining...' : 'Join Waitlist'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Download App Banner */}

<div className={styles.downloadAppSection}>

  <img
    src="/images/download-app-banner-desktop.png"
    alt="Download App"
    className={styles.downloadAppImageDesktop}
  />

  <img
    src="/images/download-app-banner-mobile.png"
    alt="Download App"
    className={styles.downloadAppImageMobile}
  />

  <a
    href="#"
    className={styles.playStoreHotspot}
    aria-label="Google Play"
  />

  <a
    href="#"
    className={styles.appStoreHotspot}
    aria-label="App Store"
  />
</div>

    </section>
  );
}
