'use client';

import React, { useEffect, useState } from 'react';
import { addWaitlistEntry } from '../lib/waitlistService';

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
  const [sentVerificationCode, setSentVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const interestOptions = [
    { id: 'grokly', label: 'Groceries & Essentials', icon: '🛒' },
    { id: 'swadishtt', label: 'Food Delivery', icon: '🍽️' },
    { id: 'instastyle', label: 'Fashion & Styling', icon: '👗' },
    { id: 'dinex', label: 'Dining Experience', icon: '🍷' },
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
    
    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentVerificationCode(code);
    
    // Simulate sending email (in production, call your email API)
    setTimeout(() => {
      setCodeSent(true);
      setLoading(false);
      // In production, you would send this code via email
      console.log('Verification code:', code);
      alert(`Verification code sent to ${form.email}\n\nFor demo purposes, your code is: ${code}`);
    }, 1000);
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

    if (!form.verificationCode?.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (form.verificationCode !== sentVerificationCode) {
      setError('Invalid verification code. Please try again.');
      return;
    }

    try {
      setLoading(true);
      await addWaitlistEntry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        interests: form.interests.join(', '),
      });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', interests: [], verificationCode: '' });
      setCurrentStep(1);
      setCodeSent(false);
      setSentVerificationCode('');
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Waitlist submit failed:', err);
      setError('Something went wrong. Please try again.');
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
    <section className="app-showcase" id="app-showcase">
      <style jsx>{`
        .app-showcase {
          padding: 120px 20px;
          background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
          width: 100%;
          position: relative;
        }

        .waitlist-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          background: transparent;
        }

        .waitlist-info {
          max-width: 540px;
          background: transparent;
        }

        .waitlist-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(122, 0, 66, 0.08);
          border: 1.5px solid rgba(122, 0, 66, 0.15);
          color: #7A0042;
          padding: 8px 18px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin-bottom: 24px;
        }

        .waitlist-title {
          font-size: 56px;
          font-weight: 900;
          color: #1a0014;
          margin: 0 0 24px;
          letter-spacing: -2px;
          line-height: 1.1;
          font-family: 'Davetica', sans-serif;
        }

        .waitlist-title .highlight {
          background: linear-gradient(135deg, #7A0042 0%, #ffb347 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .waitlist-subtitle {
          font-size: 18px;
          color: #3a2a3a;
          margin: 0 0 40px;
          line-height: 1.7;
        }

        .waitlist-features {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 40px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #7A0042 0%, #9d0054 100%);
          border-radius: 12px;
          color: #ffffff;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(122, 0, 66, 0.25);
        }

        .feature-text h4 {
          font-size: 16px;
          font-weight: 700;
          color: #1a0014;
          margin: 0 0 4px 0;
        }

        .feature-text p {
          font-size: 14px;
          color: #6b5a6b;
          margin: 0;
        }

        .waitlist-stats {
          display: flex;
          gap: 40px;
          padding-top: 40px;
          border-top: 1px solid rgba(122, 0, 66, 0.1);
        }

        .stat-item {
          text-align: left;
        }

        .stat-number {
          font-size: 32px;
          font-weight: 900;
          color: #7A0042;
          display: block;
          font-family: 'Davetica', sans-serif;
          letter-spacing: -1px;
        }

        .stat-label {
          font-size: 13px;
          color: #6b5a6b;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 600;
          margin-top: 4px;
        }

        .waitlist-form-wrapper {
          background: #ffffff;
          border-radius: 24px;
          padding: 48px;
          box-shadow: 0 10px 40px rgba(122, 0, 66, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(122, 0, 66, 0.08);
          position: relative;
          overflow: hidden;
        }

        .waitlist-form-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #7A0042, #9d0054, #ffb347);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { background-position: 200% 0; }
          50% { background-position: -200% 0; }
        }

        .form-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .form-title {
          font-size: 24px;
          font-weight: 800;
          color: #1a0014;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
        }

        .form-description {
          font-size: 14px;
          color: #6b5a6b;
          margin: 0;
        }

        .step-indicator {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .step-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #e5e7eb;
          transition: all 0.3s ease;
        }

        .step-dot.active {
          background: #1a1a1a;
          width: 32px;
          border-radius: 6px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 16px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          font-family: inherit;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          background: #fff;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #1a1a1a;
          box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .interests-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .interest-card {
          padding: 20px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          background: #fff;
        }

        .interest-card:hover {
          border-color: #9ca3af;
        }

        .interest-card.selected {
          border-color: #1a1a1a;
          background: #f9fafb;
        }

        .interest-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .interest-label {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .verification-section {
          text-align: center;
        }

        .verification-info {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
          font-size: 14px;
          color: #0c4a6e;
        }

        .resend-code {
          background: none;
          border: none;
          color: #1a1a1a;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          font-size: 14px;
          margin-top: 12px;
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .nav-button {
          flex: 1;
          padding: 18px;
          border: 2px solid #e5e7eb;
          background: #fff;
          color: #1a1a1a;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .nav-button:hover:not(:disabled) {
          border-color: #1a1a1a;
          background: #f9fafb;
        }

        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .submit-button {
          width: 100%;
          padding: 18px;
          background: #000000;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .submit-button:hover:not(:disabled)::before {
          left: 100%;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
          background: #1a1a1a;
        }

        .submit-button:active {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .success-message {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          padding: 16px 20px;
          border-radius: 12px;
          text-align: center;
          font-weight: 600;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 20px;
          border: 1px solid #fecaca;
        }

        @media (max-width: 900px) {
          .app-showcase {
            padding: 80px 20px;
          }

          .waitlist-container {
            grid-template-columns: 1fr;
            gap: 60px;
          }

          .waitlist-info {
            max-width: 100%;
          }

          .waitlist-title {
            font-size: 42px;
          }

          .waitlist-form-wrapper {
            padding: 32px 24px;
          }
        }

        @media (max-width: 640px) {
          .app-showcase {
            padding: 60px 16px;
          }

          .waitlist-container {
            gap: 40px;
          }

          .waitlist-title {
            font-size: 36px;
          }

          .waitlist-subtitle {
            font-size: 16px;
          }

          .waitlist-stats {
            gap: 24px;
          }

          .stat-number {
            font-size: 28px;
          }

          .waitlist-form-wrapper {
            padding: 24px 20px;
          }

          .interests-grid {
            grid-template-columns: 1fr;
          }

          .button-group {
            flex-direction: column;
          }

          .nav-button {
            width: 100%;
          }
        }
      `}</style>

      {/* Waitlist Section */}
      <div className="waitlist-container">
        {/* Left Side - Information */}
        <div className="waitlist-info">
          
          
          <h2 className="waitlist-title">
            Join the <span className="highlight">Revolution</span>
          </h2>
          
          <p className="waitlist-subtitle">
            Be among the first to experience India's most intelligent commerce platform. 
            Get exclusive early access and special launch benefits.
          </p>

          <div className="waitlist-features">
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="feature-text">
                <h4>Priority Access</h4>
                <p>Be first to try new features</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="feature-text">
                <h4>Exclusive Offers</h4>
                <p>Special discounts for early members</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="feature-text">
                <h4>Direct Support</h4>
                <p>Dedicated assistance from our team</p>
              </div>
            </div>
          </div>

         
        </div>

        {/* Right Side - Form */}
        <div className="waitlist-form-wrapper">
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
            <div className={`step-dot ${currentStep >= 1 ? 'active' : ''}`}></div>
            <div className={`step-dot ${currentStep >= 2 ? 'active' : ''}`}></div>
            <div className={`step-dot ${currentStep >= 3 ? 'active' : ''}`}></div>
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