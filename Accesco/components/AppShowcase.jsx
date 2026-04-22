'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart, Utensils, Shirt, GlassWater } from 'lucide-react';
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
    <section id="app-showcase" style={{ padding: '64px 20px', background: '#FFFDF8', position: 'relative' }}>
      <style>{`
        /* ── Waitlist premium skin ── */
        .waitlist-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 80px; align-items: center; }
        .waitlist-info { max-width: 540px; }
        .waitlist-title { font-family: 'Sora', sans-serif; font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 900; color: #1A0A0F; margin: 0 0 20px; letter-spacing: -0.04em; line-height: 1.08; }
        .waitlist-title .highlight { background: linear-gradient(135deg, #7A0042 0%, #C8963E 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .waitlist-subtitle { font-family: 'DM Sans', sans-serif; font-size: 1.05rem; color: #6B5B65; margin: 0 0 36px; line-height: 1.7; }
        .waitlist-features { display: none; }
        .waitlist-poster-wrap { margin-bottom: 40px; border-radius: 24px; overflow: hidden; box-shadow: 0 30px 60px rgba(26,10,15,0.15); border: 1px solid rgba(122,0,66,0.1); }
        .waitlist-poster-img { width: 100%; height: auto; display: block; }
        .feature-text h4 { font-family: 'Sora', sans-serif; font-size: 0.9rem; font-weight: 700; color: #1A0A0F; margin: 0 0 3px; }
        .feature-text p  { font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: #6B5B65; margin: 0; }
        /* Form card */
        .waitlist-form-wrapper { background: #fff; border-radius: 28px; padding: 44px; box-shadow: 0 12px 50px rgba(122,0,66,0.07), 0 4px 14px rgba(0,0,0,0.04); border: 1px solid rgba(122,0,66,0.09); position: relative; overflow: hidden; }
        .waitlist-form-wrapper::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #7A0042, #C8963E, #7A0042); background-size: 200%; animation: wlShimmer 3s ease infinite; }
        @keyframes wlShimmer { 0%,100%{background-position:0% center} 50%{background-position:100% center} }
        .form-header { text-align: center; margin-bottom: 28px; }
        .form-title { font-family: 'Sora', sans-serif; font-size: 1.3rem; font-weight: 800; color: #1A0A0F; margin: 0 0 6px; letter-spacing: -0.02em; }
        .form-description { font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: #6B5B65; margin: 0; }
        /* Step indicator */
        .step-indicator { display: flex; justify-content: center; gap: 8px; margin-bottom: 28px; }
        .step-dot { height: 4px; width: 24px; border-radius: 9999px; background: rgba(122,0,66,0.12); transition: all 0.35s; }
        .step-dot.active { background: linear-gradient(90deg, #7A0042, #C8963E); width: 48px; }
        /* Inputs */
        .form-group { margin-bottom: 20px; }
        .form-label { display: block; font-family: 'Sora', sans-serif; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #6B5B65; margin-bottom: 8px; }
        .form-input { width: 100%; padding: 14px 18px; border: 1.5px solid rgba(122,0,66,0.14); border-radius: 12px; font-size: 0.95rem; font-family: 'DM Sans', sans-serif; transition: all 0.22s; background: #FAFAF9; box-sizing: border-box; color: #1A0A0F; outline: none; }
        .form-input:focus { border-color: #7A0042; box-shadow: 0 0 0 3px rgba(122,0,66,0.08); background: #fff; }
        .form-input::placeholder { color: rgba(107,91,101,0.45); }
        /* Interests */
        .interests-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 20px; }
        .interest-card { padding: 18px 14px; border: 1.5px solid rgba(122,0,66,0.12); border-radius: 14px; cursor: pointer; transition: all 0.22s; text-align: center; background: #FAFAF9; }
        .interest-card:hover { border-color: rgba(122,0,66,0.3); background: rgba(122,0,66,0.03); }
        .interest-card.selected { border-color: #7A0042; background: rgba(122,0,66,0.05); }
        .interest-icon { display: flex; justify-content: center; color: #7A0042; margin-bottom: 12px; }
        .interest-label { font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600; color: #1A0A0F; }
        /* Verification */
        .verification-section { text-align: center; }
        .verification-info { background: rgba(122,0,66,0.04); border: 1px solid rgba(122,0,66,0.1); border-radius: 12px; padding: 14px 16px; margin-bottom: 20px; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: #6B5B65; line-height: 1.6; }
        .resend-code { background: none; border: none; color: #7A0042; font-family: 'Sora', sans-serif; font-weight: 700; font-size: 0.82rem; cursor: pointer; text-decoration: underline; margin-top: 10px; }
        /* Buttons */
        .button-group { display: flex; gap: 10px; margin-top: 20px; }
        .nav-button { flex: 1; padding: 15px; border: 1.5px solid rgba(122,0,66,0.18); background: #fff; color: #7A0042; border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.22s; letter-spacing: 0.06em; text-transform: uppercase; }
        .nav-button:hover:not(:disabled) { border-color: #7A0042; background: rgba(122,0,66,0.04); }
        .nav-button:disabled { opacity: 0.45; cursor: not-allowed; }
        .submit-button { width: 100%; padding: 16px; background: #7A0042; color: #FFFDF8; border: none; border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; letter-spacing: 0.08em; text-transform: uppercase; box-shadow: 0 4px 22px rgba(122,0,66,0.3); }
        .submit-button::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent); transition: left 0.5s; }
        .submit-button:hover:not(:disabled)::before { left: 100%; }
        .submit-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(122,0,66,0.4); background: #5A0031; }
        .submit-button:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        /* Spinner */
        .loading-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: #fff; animation: spin 0.8s linear infinite; margin-right: 8px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        /* Feedback messages */
        .success-message { background: linear-gradient(135deg, #10b981, #059669); color: #fff; padding: 14px 18px; border-radius: 12px; text-align: center; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.9rem; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .error-message { background: #fef2f2; color: #dc2626; padding: 12px 16px; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.86rem; margin-bottom: 18px; border: 1px solid rgba(220,38,38,0.2); }
        /* Responsive */
        @media (max-width: 900px) { .waitlist-container { grid-template-columns: 1fr; gap: 50px; } .waitlist-info { max-width: 100%; } }
        @media (max-width: 640px) { .interests-grid { grid-template-columns: 1fr; } .button-group { flex-direction: column; } .waitlist-form-wrapper { padding: 28px 20px; } }
      `}</style>

      {/* Waitlist Section Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 40px', padding: '0 20px' }}>
        <div className="ac-chip ac-chip-maroon" style={{ marginBottom: '20px' }}>
          <span>✦</span> Early Access Program
        </div>

        <h2 className="waitlist-title">
          Join the <span className="highlight">Revolution</span>
        </h2>

        <p className="waitlist-subtitle" style={{ maxWidth: '100%', fontSize: '1.1rem' }}>
          Be among the first to experience India's most intelligent commerce platform.
          Get exclusive early access and special launch benefits.
        </p>
      </div>

      <div className="waitlist-container">
        {/* Left Side - Information (Poster) */}
        <div className="waitlist-info">
          <div className="waitlist-poster-wrap">
            <img
              src="/images/xpense-banner.jpg"
              alt="Accesco Living - Xpense Meter"
              className="waitlist-poster-img"
              onError={(e) => {
                e.currentTarget.src = '/images/accesco_original.png';
                e.currentTarget.style.padding = '40px';
                e.currentTarget.style.background = 'linear-gradient(135deg, #7A0042, #1A0A0F)';
              }}
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="waitlist-form-wrapper" style={{
          background: currentStep === 1 ? '#FFFDF8' : currentStep === 2 ? '#FAF7F0' : '#F0F9F4',
          border: `2px solid ${currentStep === 1 ? '#7A0042' : currentStep === 2 ? '#C8963E' : '#10b981'}`,
          transition: 'all 0.4s ease'
        }}>
          <div className="form-header">
            <h3 className="form-title">Get Early Access</h3>
            <p className="form-description">
              {currentStep === 1 && 'Tell us about yourself'}
              {currentStep === 2 && 'What interests you?'}
              {currentStep === 3 && 'Verify your email'}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="step-indicator">
            <div className={`step-dot ${currentStep >= 1 ? 'active' : ''}`} style={currentStep === 1 ? { background: '#7A0042', transform: 'scale(1.2)' } : {}}></div>
            <div className={`step-dot ${currentStep >= 2 ? 'active' : ''}`} style={currentStep === 2 ? { background: '#C8963E', transform: 'scale(1.2)' } : {}}></div>
            <div className={`step-dot ${currentStep >= 3 ? 'active' : ''}`} style={currentStep === 3 ? { background: '#10b981', transform: 'scale(1.2)' } : {}}></div>
          </div>

          {success && (
            <div className="success-message">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Welcome to the waitlist! We'll be in touch soon.
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>

                <button type="button" className="submit-button" onClick={handleNext}>
                  Next
                </button>
              </>
            )}

            {/* Step 2: Interests */}
            {currentStep === 2 && (
              <>
                <div className="interests-grid">
                  {interestOptions.map((interest) => (
                    <div
                      key={interest.id}
                      className={`interest-card ${form.interests.includes(interest.id) ? 'selected' : ''}`}
                      onClick={() => toggleInterest(interest.id)}
                    >
                      <div className="interest-icon">{interest.icon}</div>
                      <div className="interest-label">{interest.label}</div>
                    </div>
                  ))}
                </div>

                <div className="button-group">
                  <button type="button" className="nav-button" onClick={handlePrev}>
                    Previous
                  </button>
                  <button type="button" className="nav-button" onClick={handleNext}>
                    Next
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Email Verification */}
            {currentStep === 3 && (
              <>
                <div className="verification-section">
                  <div className="verification-info">
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

                  <div className="form-group">
                    <label className="form-label">Verification Code *</label>
                    <input
                      type="text"
                      className="form-input"
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
                    className="resend-code"
                    onClick={sendVerificationCode}
                    disabled={loading}
                  >
                    Resend Code
                  </button>
                </div>

                <div className="button-group">
                  <button type="button" className="nav-button" onClick={handlePrev}>
                    Previous
                  </button>
                  <button type="submit" className="submit-button" disabled={loading}>
                    {loading && <span className="loading-spinner"></span>}
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