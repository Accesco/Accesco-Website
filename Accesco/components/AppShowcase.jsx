'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function AppShowcase() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Bengaluru'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [step, setStep] = useState(1);
  const [referralLink, setReferralLink] = useState('');
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const savedLink = localStorage.getItem('accesco_referral_link');
    const savedPosition = localStorage.getItem('accesco_waitlist_position');
    
    if (savedLink && savedPosition) {
      setReferralLink(savedLink);
      setPosition(parseInt(savedPosition));
      setStep(4);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      setLoading(false);
      return;
    }

    if (!validatePhone(formData.phone)) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit Indian mobile number.' });
      setLoading(false);
      return;
    }

    try {
      // 1. Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('waitlist')
        .select('*')
        .or(`email.eq.${formData.email},phone.eq.${formData.phone}`)
        .single();

      if (existingUser) {
        setReferralLink(`${window.location.origin}/referral?code=${existingUser.referral_code}`);
        setPosition(existingUser.waitlist_position);
        localStorage.setItem('accesco_referral_link', `${window.location.origin}/referral?code=${existingUser.referral_code}`);
        localStorage.setItem('accesco_waitlist_position', existingUser.waitlist_position.toString());
        setStep(4);
        return;
      }

      // 2. Generate referral code
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // 3. Get total count for position
      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });
        
      const newPosition = (count || 0) + 1;

      // 4. Insert new user
      const { data, error } = await supabase
        .from('waitlist')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            referral_code: referralCode,
            waitlist_position: newPosition,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const newReferralLink = `${window.location.origin}/referral?code=${referralCode}`;
      setReferralLink(newReferralLink);
      setPosition(newPosition);
      
      localStorage.setItem('accesco_referral_link', newReferralLink);
      localStorage.setItem('accesco_waitlist_position', newPosition.toString());
      
      setStep(4);

    } catch (error) {
      console.error('Waitlist error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Something went wrong. Please try again later.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setMessage({ type: 'success', text: 'Referral link copied!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <section className="app-showcase-section">
      <div className="app-showcase-container">
        
        {/* Left Side: Mockup or Graphic */}
        <div className="app-mockup-wrapper">
          <div className="circular-rings">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
          </div>
          
          {/* Main Visual */}
          <div className="floating-card premium-mockup-card">
            <div className="mockup-header">
              <div className="mockup-logo">
                <span>Accesco</span>
              </div>
              <div className="mockup-menu"></div>
            </div>
            <div className="mockup-body">
              <div className="mockup-greeting">Good evening, Argha</div>
              <div className="mockup-balance">
                <div className="balance-label">Total Saved This Month</div>
                <div className="balance-value">₹4,250</div>
              </div>
              
              <div className="mockup-services">
                <div className="m-service">
                  <div className="m-service-icon bg-grokly"></div>
                  <span>Grokly</span>
                </div>
                <div className="m-service">
                  <div className="m-service-icon bg-swadishtt"></div>
                  <span>Swadishtt</span>
                </div>
                <div className="m-service">
                  <div className="m-service-icon bg-instastyle"></div>
                  <span>InstaStyle</span>
                </div>
              </div>
              
              <div className="mockup-tracking">
                <div className="tracking-title">Live Delivery</div>
                <div className="tracking-bar">
                  <div className="tracking-progress"></div>
                </div>
                <div className="tracking-status">Arriving in 12 mins</div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="floating-badge badge-1">
            <span className="badge-icon">✨</span>
            Smart Suggestions
          </div>
          <div className="floating-badge badge-2">
            <span className="badge-icon">🔄</span>
            Circular Returns
          </div>
        </div>

        {/* Right Side: Content & Waitlist Form */}
        <div className="app-content-wrapper">
          <div className="ac-chip ac-chip-gold">Early Access</div>
          
          <h2 className="showcase-title">
            The App That Runs Your Household.
          </h2>
          
          <p className="showcase-subtitle">
            Join the waitlist for Accesco Living. Be among the first to experience 
            intelligent commerce that predicts your needs, manages your budget, 
            and rewards sustainability.
          </p>

          <div className="waitlist-card">
            {step === 4 ? (
              <div className="referral-success-state">
                <div className="success-icon-large">🎉</div>
                <h3>You're on the list!</h3>
                <p>Your current waitlist position:</p>
                <div className="position-number">#{position.toLocaleString()}</div>
                
                <div className="referral-box mt-4">
                  <p className="referral-text">Want to move up? Invite friends using your link:</p>
                  <div className="referral-input-group">
                    <input type="text" value={referralLink} readOnly className="referral-input" />
                    <button onClick={copyToClipboard} className="copy-btn">Copy</button>
                  </div>
                  {message.text && (
                    <div className={`form-message ${message.type}`}>
                      {message.text}
                    </div>
                  )}
                  <p className="referral-hint">Every friend who joins moves you up 10 spots!</p>
                </div>
                
                <button 
                  className="reset-btn mt-4"
                  onClick={() => {
                    localStorage.removeItem('accesco_referral_link');
                    localStorage.removeItem('accesco_waitlist_position');
                    setStep(1);
                    setFormData({ name: '', email: '', phone: '', city: 'Bengaluru' });
                  }}
                >
                  Join with another account
                </button>
              </div>
            ) : (
              <form className="waitlist-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Mobile Number</label>
                    <div className="phone-input-wrap">
                      <span className="phone-prefix">+91</span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="10-digit number"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  >
                    <option value="Bengaluru">Bengaluru (Current Launch)</option>
                    <option value="Mumbai">Mumbai (Coming Soon)</option>
                    <option value="Delhi">Delhi NCR (Coming Soon)</option>
                    <option value="Hyderabad">Hyderabad (Coming Soon)</option>
                    <option value="Other">Other City</option>
                  </select>
                </div>

                {message.text && (
                  <div className={`form-message ${message.type}`}>
                    {message.text}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="waitlist-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loader-dots"><span>.</span><span>.</span><span>.</span></span>
                  ) : (
                    'Join the Waitlist'
                  )}
                </button>
                <p className="waitlist-disclaimer">
                  By joining, you agree to our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {/* ── Scoped CSS using dangerouslySetInnerHTML for SSR safety ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .app-showcase-section {
          padding: 100px 0;
          background: #1A0A0F;
          position: relative;
          overflow: hidden;
        }
        
        .app-showcase-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        /* Waitlist Form Styles */
        .waitlist-card {
          background: #FFFDF8;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-family: 'Sora', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1A0A0F;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 14px 16px;
          background: #F8F5F2;
          border: 1px solid rgba(122, 0, 66, 0.1);
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: #1A0A0F;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #7A0042;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(122, 0, 66, 0.1);
        }

        .phone-input-wrap {
          display: flex;
          align-items: center;
          background: #F8F5F2;
          border: 1px solid rgba(122, 0, 66, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }

        .phone-input-wrap:focus-within {
          border-color: #7A0042;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(122, 0, 66, 0.1);
        }

        .phone-prefix {
          padding: 14px 0 14px 16px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          color: #6B5B65;
        }

        .phone-input-wrap input {
          border: none;
          background: transparent;
          border-radius: 0;
        }
        
        .phone-input-wrap input:focus {
          box-shadow: none;
        }

        .waitlist-submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #7A0042 0%, #A00056 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 8px;
        }

        .waitlist-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(122, 0, 66, 0.3);
        }

        .waitlist-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .form-message {
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          text-align: center;
        }

        .form-message.error {
          background: rgba(220, 38, 38, 0.1);
          color: #DC2626;
          border: 1px solid rgba(220, 38, 38, 0.2);
        }

        .form-message.success {
          background: rgba(22, 163, 74, 0.1);
          color: #16A34A;
          border: 1px solid rgba(22, 163, 74, 0.2);
        }

        .waitlist-disclaimer {
          margin-top: 16px;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          color: #9E8E98;
        }

        .waitlist-disclaimer a {
          color: #7A0042;
          text-decoration: underline;
        }

        /* Referral Success State */
        .referral-success-state {
          text-align: center;
          padding: 20px 0;
        }

        .success-icon-large {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .referral-success-state h3 {
          font-family: 'Sora', sans-serif;
          font-size: 1.5rem;
          color: #1A0A0F;
          margin-bottom: 8px;
        }

        .position-number {
          font-family: 'Sora', sans-serif;
          font-size: 3rem;
          font-weight: 800;
          color: #7A0042;
          margin: 16px 0;
        }

        .referral-box {
          background: #F8F5F2;
          padding: 20px;
          border-radius: 16px;
          border: 1px dashed rgba(122, 0, 66, 0.3);
        }

        .referral-text {
          font-size: 0.9rem;
          color: #1A0A0F;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .referral-input-group {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .referral-input {
          flex: 1;
          padding: 12px;
          border: 1px solid rgba(122, 0, 66, 0.2);
          border-radius: 8px;
          background: #fff;
          font-family: monospace;
          font-size: 0.9rem;
          color: #1A0A0F;
        }

        .copy-btn {
          padding: 0 20px;
          background: #1A0A0F;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'Sora', sans-serif;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .copy-btn:hover {
          background: #7A0042;
        }

        .referral-hint {
          font-size: 0.8rem;
          color: #6B5B65;
        }

        .reset-btn {
          background: none;
          border: none;
          color: #6B5B65;
          text-decoration: underline;
          font-size: 0.85rem;
          cursor: pointer;
          transition: color 0.2s;
        }

        .reset-btn:hover {
          color: #7A0042;
        }
        
        .ac-chip-gold {
          display: inline-block;
          padding: 6px 14px;
          background: rgba(200, 150, 62, 0.15);
          color: #C8963E;
          border-radius: 999px;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          margin-bottom: 24px;
          border: 1px solid rgba(200, 150, 62, 0.3);
        }
        
        .showcase-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 800;
          color: #FFFDF8;
          line-height: 1.1;
          margin: 0 0 20px 0;
          letter-spacing: -0.02em;
        }
        
        .showcase-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.1rem;
          color: rgba(255, 253, 248, 0.7);
          line-height: 1.6;
          margin: 0 0 40px 0;
          max-width: 480px;
        }
        
        .app-mockup-wrapper {
          position: relative;
          height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .circular-rings {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(200, 150, 62, 0.15);
        }
        
        .ring-1 { width: 300px; height: 300px; }
        .ring-2 { width: 450px; height: 450px; border-style: dashed; opacity: 0.5; animation: spin 40s linear infinite; }
        .ring-3 { width: 600px; height: 600px; border-color: rgba(122, 0, 66, 0.2); }
        
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .premium-mockup-card {
          width: 280px;
          background: #FFFDF8;
          border-radius: 32px;
          padding: 24px;
          position: relative;
          z-index: 10;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 6px #000;
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        .mockup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .mockup-logo span {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          color: #1A0A0F;
          font-size: 1.1rem;
        }
        
        .mockup-menu {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #F8F5F2;
        }
        
        .mockup-greeting {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          color: #6B5B65;
          margin-bottom: 4px;
        }
        
        .balance-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          color: #9E8E98;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        
        .balance-value {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 2rem;
          color: #1A0A0F;
          margin-bottom: 32px;
        }
        
        .mockup-services {
          display: flex;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        
        .m-service {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .m-service-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
        }
        
        .bg-grokly { background: rgba(46,125,50,0.1); }
        .bg-swadishtt { background: rgba(122,0,66,0.1); }
        .bg-instastyle { background: rgba(74,20,140,0.1); }
        
        .m-service span {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          color: #1A0A0F;
        }
        
        .mockup-tracking {
          background: #F8F5F2;
          padding: 16px;
          border-radius: 16px;
        }
        
        .tracking-title {
          font-family: 'Sora', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 12px;
        }
        
        .tracking-bar {
          height: 6px;
          background: rgba(0,0,0,0.05);
          border-radius: 3px;
          margin-bottom: 8px;
          overflow: hidden;
        }
        
        .tracking-progress {
          width: 60%;
          height: 100%;
          background: #7A0042;
          border-radius: 3px;
        }
        
        .tracking-status {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          color: #7A0042;
          font-weight: 600;
        }
        
        .floating-badge {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 12px 20px;
          border-radius: 999px;
          color: #FFFDF8;
          font-family: 'Sora', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 20;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
        .badge-1 { top: 15%; right: 5%; animation: float 6s ease-in-out infinite; }
        .badge-2 { bottom: 20%; left: 0%; animation: float 5s ease-in-out infinite 1s; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @media (max-width: 960px) {
          .app-showcase-container {
            grid-template-columns: 1fr;
            gap: 60px;
          }
          .app-mockup-wrapper {
            height: 450px;
            order: 2;
          }
          .app-content-wrapper {
            order: 1;
            text-align: center;
          }
          .showcase-subtitle {
            margin: 0 auto 40px auto;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
          .badge-1, .badge-2 {
            display: none;
          }
        }
      ` }} />
    </section>
  );
}