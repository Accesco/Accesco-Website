'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth';
import { 
  ShoppingCart, 
  Utensils, 
  Shirt, 
  GlassWater,
  User,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck
} from 'lucide-react';
import styles from './AppShowcase.module.css';
import { auth } from '../lib/firebase';
import {
  addWaitlistEntry,
  validateWaitlistEntry,
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

  const interestOptions = [
    { id: 'grokly', label: 'Groceries & Essentials', icon: <ShoppingCart size={22} /> },
    { id: 'swadishtt', label: 'Food Delivery', icon: <Utensils size={22} /> },
    { id: 'instastyle', label: 'Fashion & Styling', icon: <Shirt size={22} /> },
    { id: 'dinex', label: 'Dining Experience', icon: <GlassWater size={22} /> },
  ];

  const toggleInterest = (id) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  function normalizePhone(phone) {
    const stripped = phone.replace(/[\s\-().]/g, '');
    if (stripped.startsWith('+')) return stripped;
    return '+91' + stripped.replace(/\D/g, '');
  }

  const sendPhoneOtp = async () => {
    if (!form.phone?.trim()) {
      setError('Please enter your phone number first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const container = document.getElementById('recaptcha-container');
      if (container) {
        container.innerHTML = '';
      }

      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
      recaptchaVerifierRef.current = verifier;

      const phoneNumber = normalizePhone(form.phone.trim());
      const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setConfirmationResult(result);
      setPhoneCodeSent(true);
    } catch (err) {
      console.error('Phone OTP send failed:', err);
      setError(err.message || 'Failed to send OTP. Check your phone number and try again.');
      setPhoneCodeSent(false);
    } finally {
      setLoading(false);
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

    const validationErrors = validateWaitlistEntry(form);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(' '));
      return;
    }

    if (loading) {
      setError('Verification code is still being sent. Please wait.');
      return;
    }

    if (!confirmationResult) {
      if (!error) {
        setError('Verification failed to initiate. Please try again.');
      }
      return;
    }

    if (!/^\d{6}$/.test(form.verificationCode.trim())) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await confirmationResult.confirm(form.verificationCode.trim());
      setPhoneVerified(true);

      await addWaitlistEntry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        interests: form.interests.join(', '),
      });

      await signOut(auth);

      setSuccess(true);
      setForm({ name: '', email: '', phone: '', interests: [], verificationCode: '' });
      setPhoneCodeSent(false);
      setPhoneVerified(false);
      setConfirmationResult(null);
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
    <section id="waitlist" style={{ padding: '80px 20px', background: '#FAFAF9', position: 'relative' }}>

      <div id="recaptcha-container"></div>

      {/* Centered Heading Block Positioned Symmetrically Above the Card */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 48px', padding: '0', textAlign: 'center' }}>
        <h2 className={styles.waitlistTitle}>
          Join the <span className={styles.highlight}>Revolution</span>
        </h2>
        <p className={styles.waitlistSubtitle}>
          Be the first to experience India's most intelligent commerce platform. Get exclusive early access and special launch benefits.
        </p>
      </div>

      {/* Main 1:1 Sorcerer Grid Card Wrapper */}
      <div className={styles.waitlistCard}>
        
        {/* Left Panel: Flush Poster Image */}
        <div className={styles.leftPanel}>
          <img
            src="/images/xpense-banner.jpg"
            alt="Accesco Living - Wanna Skip The Line?"
            className={styles.posterImage}
            onError={(e) => {
              e.currentTarget.src = '/images/accesco_original.png';
              e.currentTarget.style.padding = '40px';
              e.currentTarget.style.background = 'linear-gradient(135deg, #7A0042, #1A0A0F)';
            }}
          />
        </div>

        {/* Right Panel: Clean Form Wrapper */}
        <div className={styles.rightPanel}>
          
          <div className={styles.brandLogoRow}>
            <svg width="90" height="24" viewBox="0 0 90 24" fill="none">
              <path d="M6 12L9 15L14 9" stroke="#7A0042" strokeWidth="2" />
              <circle cx="10" cy="12" r="8" stroke="#7A0042" strokeWidth="2" fill="none" />
              
            </svg>
          </div>

          <h3 className={styles.cardTitle}>Get Early Access</h3>
          
          <p className={styles.cardSubtitle}>
            {currentStep === 1 && "Join the waitlist and be the first to experience India's most intelligent commerce platform."}
            {currentStep === 2 && "What interests you? Choose at least one category to curate your feed."}
            {currentStep === 3 && "Security verification. Enter the 6-digit passcode sent to your phone."}
          </p>

          {success && (
            <div className={styles.successMessage}>
              Welcome to the waitlist! We'll be in touch soon.
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {/* Form Step Router */}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            
            {/* Step 1: Base Inputs */}
            {currentStep === 1 && (
              <div className={styles.inputsStack}>
                <div className={styles.inputWrapper}>
                  <User size={18} className={styles.inputIcon} />
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className={styles.inputWrapper}>
                  <Mail size={18} className={styles.inputIcon} />
                  <input
                    type="email"
                    className={styles.formInput}
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.inputWrapper}>
                  <Phone size={18} className={styles.inputIcon} />
                  <input
                    type="tel"
                    className={styles.formInput}
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>

                <button type="button" className={styles.submitButton} onClick={handleNext}>
                  <span>Join Waitlist</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Step 2: Bento Interest Grid */}
            {currentStep === 2 && (
              <div className={styles.inputsStack}>
                <div className={styles.interestsGrid}>
                  {interestOptions.map((interest) => {
                    const isSelected = form.interests.includes(interest.id);
                    return (
                      <div
                        key={interest.id}
                        className={`${styles.interestCard} ${isSelected ? styles.interestCardSelected : ''}`}
                        onClick={() => toggleInterest(interest.id)}
                      >
                        <div className={styles.interestCardHeader}>
                          <div className={styles.interestIcon}>{interest.icon}</div>
                          <div className={`${styles.customCheckbox} ${isSelected ? styles.customCheckboxActive : ''}`}>
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                        </div>
                        <div className={styles.interestLabel}>{interest.label}</div>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.buttonGroup}>
                  <button type="button" className={styles.prevButton} onClick={handlePrev}>
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button type="button" className={styles.submitButton} onClick={handleNext} style={{ flex: 1 }}>
                    <span>Continue</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Verification */}
            {currentStep === 3 && (
              <div className={styles.inputsStack}>
                <div className={styles.verificationCard}>
                  <ShieldCheck size={32} className={styles.verificationShield} />
                  <p className={styles.verificationSubtitle}>
                    {phoneCodeSent ? (
                      <>Sent a passcode to <strong>{form.phone}</strong></>
                    ) : (
                      'Preparing code transmission...'
                    )}
                  </p>
                </div>

                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Enter 6-digit OTP"
                    value={form.verificationCode}
                    onChange={(e) => setForm({ ...form, verificationCode: e.target.value })}
                    maxLength={6}
                    required
                    style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px', padding: '0' }}
                  />
                </div>

                {phoneCodeSent && (
                  <p className={styles.otpHelperText}>
                    Didn't receive the SMS?{' '}
                    <button
                      type="button"
                      className={styles.resendCodeButton}
                      onClick={sendPhoneOtp}
                      disabled={loading}
                    >
                      Resend Code
                    </button>
                  </p>
                )}

                <div className={styles.buttonGroup}>
                  <button type="button" className={styles.prevButton} onClick={handlePrev}>
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button type="submit" className={styles.submitButton} disabled={loading} style={{ flex: 1 }}>
                    {loading ? (
                      <span>Joining...</span>
                    ) : (
                      <>
                        <span>Reserve My Spot</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>

          {/* Symmetrical Trust Badges */}
          <div className={styles.trustRow}>
            <div className={styles.trustLeft}>
              <div className={styles.trustItem}>
                <span>👥</span>
                <span>Join 12,000+ members</span>
              </div>
              <div className={styles.trustDivider}></div>
              <div className={styles.trustItem}>
                <span>🔒</span>
                <span>Secure &amp; Spam-Free</span>
              </div>
            </div>
            <div className={styles.launchBadge}>
              Launching Soon
            </div>
          </div>

        </div>

      </div>

      {/* Unchanged bottom app download segments */}
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