'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart, Utensils, Shirt, GlassWater } from 'lucide-react';
import styles from './AppShowcase.module.css';
import {
  addWaitlistEntry,
  sendOtpEmailVerification,
  validateWaitlistEntry,
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
  const [codeSent, setCodeSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

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

  const sendVerificationCode = async () => {
    if (!form.email?.trim()) {
      setError('Please enter your email first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendOtpEmailVerification(form.email.trim());
      setCodeSent(true);
      setOtpVerified(false);
    } catch (err) {
      console.error('OTP send failed:', err);
      setError(err.message || 'Failed to send verification code');
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
      if (!codeSent) {
        sendVerificationCode();
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

    if (!codeSent) {
      setError('Verification code is still being sent. Please wait a moment.');
      return;
    }

    if (!/^\d{6}$/.test(form.verificationCode.trim())) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    try {
      setLoading(true);
      await verifyOtpEmailCode(form.email.trim(), form.verificationCode.trim());
      setOtpVerified(true);

      await addWaitlistEntry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        interests: form.interests.join(', '),
      });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', interests: [], verificationCode: '' });
      setCodeSent(false);
      setOtpVerified(false);
      setCurrentStep(1);

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Waitlist submit failed:', err);
      setError(err.message || 'Something went wrong. Please try again.');
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
   <section id="waitlist" style={{ padding: '64px 20px', background: '#FFFDF8', position: 'relative' }}>

 

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
        <div className={styles.waitlistFormWrapper} style={{
          background: currentStep === 1 ? '#FFFDF8' : currentStep === 2 ? '#FAF7F0' : '#F0F9F4',
          border: `2px solid ${currentStep === 1 ? '#7A0042' : currentStep === 2 ? '#C8963E' : '#10b981'}`,
          transition: 'all 0.4s ease'
        }}>
          <div className={styles.formHeader}>
            <h3 className={styles.formTitle}>Get Early Access</h3>
            <p className={styles.formDescription}>
              {currentStep === 1 && 'Tell us about yourself'}
              {currentStep === 2 && 'What interests you?'}
              {currentStep === 3 && 'Verify your email'}
            </p>
          </div>

          {/* Step Indicator */}
          <div className={styles.stepIndicator}>
            <div className={`${styles.stepDot} ${currentStep >= 1 ? styles.stepDotActive : ''}`} style={currentStep === 1 ? { background: '#7A0042', transform: 'scale(1.2)' } : {}}></div>
            <div className={`${styles.stepDot} ${currentStep >= 2 ? styles.stepDotActive : ''}`} style={currentStep === 2 ? { background: '#C8963E', transform: 'scale(1.2)' } : {}}></div>
            <div className={`${styles.stepDot} ${currentStep >= 3 ? styles.stepDotActive : ''}`} style={currentStep === 3 ? { background: '#10b981', transform: 'scale(1.2)' } : {}}></div>
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

            {/* Step 3: Email Verification */}
            {currentStep === 3 && (
              <>
                <div className={styles.verificationSection}>
                  <div className={styles.verificationInfo}>
                    {codeSent ? (
                      <>
                        <p>We've sent a verification code to <strong>{form.email}</strong></p>
                        <p>Please check your inbox and enter the code below.</p>
                        {otpVerified && <p>Email verification successful.</p>}
                      </>
                    ) : (
                      <p>Sending verification code...</p>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Verification Code *</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Enter 6-digit code"
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
                    onClick={sendVerificationCode}
                    disabled={loading}
                  >
                    Resend Code
                  </button>
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
    </section>
  );
}
