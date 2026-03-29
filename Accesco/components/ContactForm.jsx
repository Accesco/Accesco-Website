'use client';

import React, { useState } from 'react';

const faqs = [
  { icon: '🛍️', title: 'Order Issues', desc: 'Track, modify or cancel your orders' },
  { icon: '🍽️', title: 'Dining Reservations', desc: 'Book or manage restaurant reservations' },
  { icon: '🔧', title: 'Technical Support', desc: 'App bugs, login problems & more' },
  { icon: '💳', title: 'Payments & Refunds', desc: 'Billing queries and refund requests' },
];

export default function ContactForm() {
  const [formData, setFormData] = useState({ fullName: '', email: '', category: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ fullName: '', email: '', category: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
      setTimeout(() => setSubmitStatus(null), 4000);
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section">
      <style jsx>{`
        .contact-section {
          min-height: 100vh;
          background: #fff2eb;
          padding: 60px 20px 80px;
          position: relative;
          overflow: hidden;
        }
        .contact-section::before {
          content: '';
          position: fixed;
          top: -200px; left: -200px;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(112,4,87,0.12) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .contact-section::after {
          content: '';
          position: fixed;
          bottom: -200px; right: -200px;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(160,30,125,0.1) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .contact-wrapper { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

        .contact-hero { text-align: center; margin-bottom: 52px; }
        .contact-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, rgba(112,4,87,0.15), rgba(160,30,125,0.1));
          border: 1px solid rgba(112,4,87,0.2);
          color: #700457; font-size: 11px; font-weight: 800;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 8px 18px; border-radius: 999px; margin-bottom: 22px;
        }
        .contact-hero h1 {
          font-size: clamp(36px, 5vw, 56px); font-weight: 900;
          color: #0f0c10; line-height: 1.1; margin: 0 0 18px; letter-spacing: -1.5px;
        }
        .contact-hero h1 span {
          background: linear-gradient(135deg, #700457, #c0187a);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .contact-hero p { font-size: 17px; color: #6b5b70; line-height: 1.7; max-width: 520px; margin: 0 auto; }

        .faq-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 48px; }
        .faq-card {
          background: white; border-radius: 20px; padding: 24px 20px; text-align: center;
          border: 1.5px solid rgba(112,4,87,0.08); box-shadow: 0 4px 24px rgba(112,4,87,0.07);
          transition: all 0.3s ease;
        }
        .faq-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(112,4,87,0.15); border-color: rgba(112,4,87,0.2); }
        .faq-icon { font-size: 30px; margin-bottom: 12px; display: block; }
        .faq-card h3 { font-size: 14px; font-weight: 800; color: #1a0d1c; margin: 0 0 6px; }
        .faq-card p { font-size: 12px; color: #8a7090; margin: 0; line-height: 1.5; }

        .form-card {
          background: white; border-radius: 32px; overflow: hidden;
          box-shadow: 0 32px 80px rgba(112,4,87,0.12); border: 1px solid rgba(112,4,87,0.08);
          display: grid; grid-template-columns: 340px 1fr;
        }

        .form-left {
          background: linear-gradient(160deg, #700457 0%, #3d0230 100%);
          padding: 52px 40px; position: relative; overflow: hidden;
          display: flex; flex-direction: column;
        }
        .form-left::before {
          content: ''; position: absolute; top: -80px; right: -80px;
          width: 220px; height: 220px; border-radius: 50%; background: rgba(255,255,255,0.06);
        }
        .form-left::after {
          content: ''; position: absolute; bottom: -60px; left: -60px;
          width: 180px; height: 180px; border-radius: 50%; background: rgba(255,255,255,0.04);
        }
        .form-left h2 { font-size: 28px; font-weight: 900; color: white; margin: 0 0 12px; line-height: 1.2; position: relative; z-index: 1; }
        .form-left > p { font-size: 14px; color: rgba(255,255,255,0.65); margin: 0 0 40px; line-height: 1.6; position: relative; z-index: 1; }
        .contact-info-items { display: flex; flex-direction: column; gap: 24px; flex: 1; position: relative; z-index: 1; }
        .contact-info-item { display: flex; align-items: flex-start; gap: 16px; }
        .info-icon-wrap {
          width: 42px; height: 42px; background: rgba(255,255,255,0.12); border-radius: 12px;
          display: flex; align-items: center; justify-content: center; font-size: 18px;
          flex-shrink: 0; border: 1px solid rgba(255,255,255,0.1);
        }
        .info-text strong { display: block; font-size: 13px; font-weight: 700; color: white; margin-bottom: 2px; }
        .info-text span { font-size: 12px; color: rgba(255,255,255,0.55); }
        .social-row { display: flex; gap: 12px; margin-top: 40px; position: relative; z-index: 1; }
        .social-dot {
          width: 36px; height: 36px; background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; cursor: pointer; transition: all 0.2s; text-decoration: none; color: white;
        }
        .social-dot:hover { background: rgba(255,255,255,0.2); transform: scale(1.1); }

        .form-right { padding: 52px 48px; }
        .form-right h3 { font-size: 22px; font-weight: 800; color: #0f0c10; margin: 0 0 32px; letter-spacing: -0.5px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group.full { grid-column: span 2; }
        .form-group label { font-size: 11px; font-weight: 800; color: #4a3555; text-transform: uppercase; letter-spacing: 1px; }
        .input-wrap { position: relative; }
        .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 16px; pointer-events: none; opacity: 0.5; }
        .textarea-icon { top: 18px; transform: none; }
        .form-control {
          width: 100%; padding: 15px 18px 15px 44px;
          border: 2px solid #ede0f3; border-radius: 14px;
          font-size: 15px; font-family: inherit; color: #1a0d1c;
          background: #fdf8ff; outline: none; transition: all 0.25s ease; box-sizing: border-box;
        }
        .form-control::placeholder { color: #bba8c7; }
        .form-control:focus { border-color: #700457; background: white; box-shadow: 0 0 0 4px rgba(112,4,87,0.08); }
        select.form-control { cursor: pointer; appearance: none; }
        textarea.form-control { min-height: 130px; resize: vertical; padding-top: 15px; line-height: 1.6; }
        .select-arrow { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #9a80a8; font-size: 12px; }
        .char-count { font-size: 11px; color: #bba8c7; text-align: right; margin-top: 4px; }

        .submit-row { margin-top: 28px; display: flex; flex-direction: column; align-items: stretch; gap: 16px; }
        .submit-btn {
          background: linear-gradient(135deg, #c0187a, #700457);
          color: white; border: none; padding: 16px 36px;
          font-size: 15px; font-weight: 800; border-radius: 14px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 10px; letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 12px 32px rgba(112,4,87,0.3); flex-shrink: 0;
        }
        .submit-btn:hover { transform: translateY(-3px); box-shadow: 0 20px 48px rgba(112,4,87,0.4); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-arrow { transition: transform 0.2s ease; display: inline-block; }
        .submit-btn:hover .btn-arrow { transform: translateX(4px); }
        .guarantee-text { font-size: 12px; color: #9a80a8; line-height: 1.5; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .guarantee-text strong { color: #700457; }

        .status-toast {
          position: fixed; bottom: 32px; right: 32px;
          padding: 18px 28px; border-radius: 16px; font-weight: 700; font-size: 14px;
          display: flex; align-items: center; gap: 12px;
          animation: slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1); z-index: 1000;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        .status-toast.success { background: linear-gradient(135deg, #00c46a, #00a857); color: white; }
        .status-toast.error { background: linear-gradient(135deg, #ff4757, #e84057); color: white; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 900px) {
          .faq-cards { grid-template-columns: repeat(2, 1fr); }
          .form-card { grid-template-columns: 1fr; }
          .form-left { padding: 40px 32px; }
          .contact-info-items { flex-direction: row; flex-wrap: wrap; }
          .social-row { margin-top: 24px; }
          .form-right { padding: 40px 32px; }
        }
        @media (max-width: 600px) {
          .faq-cards { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .form-grid { grid-template-columns: 1fr; }
          .form-group.full { grid-column: span 1; }
          .submit-row { flex-direction: column; align-items: stretch; }
          .contact-section { padding: 40px 16px 60px; }
          .form-right { padding: 32px 24px; }
          .form-left { padding: 32px 24px; }
          .status-toast { left: 16px; right: 16px; bottom: 16px; }
        }
      `}</style>

      <div className="contact-wrapper">
        <div className="contact-hero">
          <div className="contact-badge">
            <span>💬</span> SUPPORT TEAM
          </div>
          <h1>How can we <span>help you?</span></h1>
          <p>Our dedicated team is here for you — whether it's an order, a reservation, or a technical hiccup. We respond fast.</p>
        </div>

        <div className="faq-cards">
          {faqs.map((f) => (
            <div className="faq-card" key={f.title}>
              <span className="faq-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="form-card">
          <div className="form-left">
            <h2>Contact Information</h2>
            <p>Fill out the form and our team will get back to you within 24 hours.</p>
            <div className="contact-info-items">
              <div className="contact-info-item">
                <div className="info-icon-wrap">📧</div>
                <div className="info-text">
                  <strong>Email Us</strong>
                  <span>support@accescoliving.com</span>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="info-icon-wrap">📞</div>
                <div className="info-text">
                  <strong>Call Us</strong>
                  <span>Mon – Sat, 9AM – 6PM IST</span>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="info-icon-wrap">📍</div>
                <div className="info-text">
                  <strong>Office</strong>
                  <span>Bengaluru, Karnataka, India</span>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="info-icon-wrap">⚡</div>
                <div className="info-text">
                  <strong>Response Time</strong>
                  <span>Usually within 2–4 hours</span>
                </div>
              </div>
            </div>
            <div className="social-row">
              <a href="https://www.instagram.com/accescoliving" target="_blank" rel="noopener noreferrer" className="social-dot">📷</a>
              <a href="https://x.com/accesco_living" target="_blank" rel="noopener noreferrer" className="social-dot">𝕏</a>
              <a href="https://www.youtube.com/@accescoliving" target="_blank" rel="noopener noreferrer" className="social-dot">▶</a>
              <a href="https://www.threads.net/@accescoliving" target="_blank" rel="noopener noreferrer" className="social-dot">@</a>
            </div>
          </div>

          <div className="form-right">
            <h3>Send us a message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <div className="input-wrap">
                    <span className="input-icon">👤</span>
                    <input type="text" id="fullName" name="fullName" className="form-control"
                      placeholder="e.g. Rahul Sharma" value={formData.fullName} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrap">
                    <span className="input-icon">✉️</span>
                    <input type="email" id="email" name="email" className="form-control"
                      placeholder="name@email.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group full">
                  <label htmlFor="category">What can we help with?</label>
                  <div className="input-wrap">
                    <span className="input-icon">🏷️</span>
                    <select id="category" name="category" className="form-control"
                      value={formData.category} onChange={handleChange}>
                      <option value="">Select a category...</option>
                      <option value="orders">Order Issues</option>
                      <option value="dining">Dining Reservations</option>
                      <option value="technical">Technical Support</option>
                      <option value="payments">Payments & Refunds</option>
                      <option value="other">Other</option>
                    </select>
                    <span className="select-arrow">▾</span>
                  </div>
                </div>
                <div className="form-group full">
                  <label htmlFor="message">Your Message</label>
                  <div className="input-wrap">
                    <span className="input-icon textarea-icon">💬</span>
                    <textarea id="message" name="message" className="form-control"
                      placeholder="Please describe your request in detail. The more info you give, the faster we can help!"
                      value={formData.message} onChange={handleChange} required></textarea>
                  </div>
                  <div className="char-count">{formData.message.length} characters</div>
                </div>
              </div>
              <div className="submit-row">
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? <>⏳ Sending...</> : <>Send Message <span className="btn-arrow">→</span></>}
                </button>
                <p className="guarantee-text">
                  <strong>🔒 Private &amp; secure.</strong> We never share your info with third parties.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {submitStatus === 'success' && (
        <div className="status-toast success">✅ Message sent! We'll get back to you soon.</div>
      )}
      {submitStatus === 'error' && (
        <div className="status-toast error">❌ Something went wrong. Please try again.</div>
      )}
    </section>
  );
}
