'use client';

import React, { useEffect, useState } from 'react';
import { addWaitlistEntry, validateWaitlistEntry } from '../lib/waitlistService';

export default function AppShowcase() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationErrors = validateWaitlistEntry(form);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(' '));
      return;
    }

    try {
      setLoading(true);
      await addWaitlistEntry({
        name: form.name,
        email: form.email,
        phone: form.phone,
      });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '' });

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
    <section className="app-showcase" id="app-showcase">
      <style jsx>{`
        .waitlist-container {
          max-width: 480px;
          margin: 0 auto 80px;
          padding: 0 20px;
        }

        .waitlist-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .waitlist-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.1);
          color: #333;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }

        .waitlist-title {
          font-size: 36px;
          font-weight: 900;
          color: #FFFFFF;
          margin: 0 0 12px;
          letter-spacing: -1px;
          line-height: 1.1;
        }

        .waitlist-subtitle {
          font-size: 16px;
          color: #666;
          margin: 0;
          line-height: 1.5;
        }

        .waitlist-form {
          background: #fff;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.06);
          position: relative;
          overflow: hidden;
        }

        .waitlist-form::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #7A0042, #9d0054, #7A0042);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { background-position: 200% 0; }
          50% { background-position: -200% 0; }
        }

        .form-group {
          margin-bottom: 20px;
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
          border-color: #7A0042;
          box-shadow: 0 0 0 4px rgba(122, 0, 66, 0.1);
          transform: translateY(-1px);
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .submit-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #7A0042, #9d0054);
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
          letter-spacing: 0.5px;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(122, 0, 66, 0.3);
          background: linear-gradient(135deg, #9d0054, #c0006b);
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
          margin-bottom: 20px;
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
          margin-bottom: 16px;
          border: 1px solid #fecaca;
        }

        .waitlist-stats {
          display: flex;
          justify-content: center;
          gap: 32px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #f3f4f6;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 900;
          color: #7A0042;
          display: block;
        }

        .stat-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .waitlist-form {
            padding: 24px 20px;
            margin: 0 16px;
          }
          
          .waitlist-title {
            font-size: 28px;
          }
          
          .waitlist-stats {
            gap: 20px;
          }
        }
      `}</style>

      {/* Waitlist Section */}
      <div className="waitlist-container">
        <div className="waitlist-header">
          <h2 className="waitlist-title">Join the Revolution</h2>
          <p className="waitlist-subtitle">
            Be among the first to experience India's most intelligent commerce platform
          </p>
        </div>

        <div className="waitlist-form">
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

            <button type="submit" className="submit-button" disabled={loading}>
              {loading && <span className="loading-spinner"></span>}
              {loading ? 'Joining Waitlist...' : 'Join Waitlist'}
            </button>
          </form>

         
        </div>
      </div>

    
    </section>
  );
}