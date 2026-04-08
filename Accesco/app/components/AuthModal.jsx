'use client'

import { useState } from 'react'
import { db } from '../../lib/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [focused, setFocused] = useState('')

  const reset = () => {
    setName(''); setPhone(''); setEmail('')
    setError(''); setSuccess(false); setFocused('')
  }

  const handleClose = () => { reset(); onClose() }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const n = name.trim(), p = phone.trim(), em = email.trim()
    if (!n) { setError('Please enter your full name'); return }
    if (!p) { setError('Please enter your phone number'); return }
    if (!/^[+\d\s\-()]{7,20}$/.test(p)) { setError('Enter a valid phone number with country code'); return }
    if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setError('Enter a valid email address'); return }

    setLoading(true)
    try {
      const docId = p.replace(/[^\d]/g, '')
      await setDoc(doc(db, 'users', docId), {
        name: n, phone: p, email: em || null,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      }, { merge: true })

      const user = { name: n, phone: p, email: em || null, uid: docId }
      localStorage.setItem('accesco_user', JSON.stringify(user))
      setSuccess(true)
      setTimeout(() => { onSuccess && onSuccess(user); handleClose() }, 1800)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="am-backdrop" onClick={handleClose}>
      <div className="am-shell" onClick={e => e.stopPropagation()}>

        {/* ── Left decorative panel ── */}
        <div className="am-left">
          <div className="am-left-inner">
            <div className="am-left-logo">
              <img src="/images/accesco_white.png" alt="Accesco Living" />
              <span>Accesco Living</span>
            </div>
            <h2 className="am-left-title">India's Unified Living Ecosystem</h2>
            <p className="am-left-sub">
              One platform for groceries, fashion, food, finance and more.
            </p>
            <div className="am-left-features">
              <div className="am-feature">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1L13 7L19 8L14.5 12.5L15.5 19L10 16L4.5 19L5.5 12.5L1 8L7 7L10 1Z" fill="currentColor"/>
                </svg>
                <span>Secure & Private</span>
              </div>
              <div className="am-feature">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>No Password Required</span>
              </div>
              <div className="am-feature">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C10 2 3 5 3 10C3 15 10 18 10 18C10 18 17 15 17 10C17 5 10 2 10 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 10C11.1046 10 12 9.10457 12 8C12 6.89543 11.1046 6 10 6C8.89543 6 8 6.89543 8 8C8 9.10457 8.89543 10 10 10Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Free Forever</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="am-right">
          <button className="am-close" onClick={handleClose} aria-label="Close">
            <i className="ri-close-line"/>
          </button>

          {success ? (
            <div className="am-success">
              <div className="am-success-ring">
                <div className="am-success-check">✓</div>
              </div>
              <h3>You're in!</h3>
              <p>Welcome to AccesCo, {name.split(' ')[0]}.</p>
            </div>
          ) : (
            <>
              <div className="am-right-header">
                <h2>Welcome!</h2>
                <p>No password needed — just your details.</p>
              </div>

              {error && (
                <div className="am-error">
                  <i className="ri-error-warning-fill"/> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="am-form">
                {/* Name */}
                <div className={`am-field ${focused === 'name' ? 'am-field--focus' : ''} ${name ? 'am-field--filled' : ''}`}>
                  <label className="am-label">
                    Full Name <span className="am-req">*</span>
                  </label>
                  <div className="am-input-row">
                    <span className="am-ico"><i className="ri-user-3-line"/></span>
                    <input
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused('')}
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className={`am-field ${focused === 'phone' ? 'am-field--focus' : ''} ${phone ? 'am-field--filled' : ''}`}>
                  <label className="am-label">
                    Phone Number <span className="am-req">*</span>
                  </label>
                  <div className="am-input-row">
                    <span className="am-ico"><i className="ri-phone-line"/></span>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      onFocus={() => setFocused('phone')}
                      onBlur={() => setFocused('')}
                      disabled={loading}
                    />
                  </div>
                  <span className="am-hint">Include country code · +91 India · +1 USA</span>
                </div>

                {/* Email */}
                <div className={`am-field ${focused === 'email' ? 'am-field--focus' : ''} ${email ? 'am-field--filled' : ''}`}>
                  <label className="am-label">
                    Email <span className="am-opt">optional</span>
                  </label>
                  <div className="am-input-row">
                    <span className="am-ico"><i className="ri-mail-line"/></span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      disabled={loading}
                    />
                  </div>
                </div>

                <button type="submit" className="am-submit" disabled={loading}>
                  {loading
                    ? <><span className="am-spin"><i className="ri-loader-4-line"/></span> Saving…</>
                    : <>Continue <i className="ri-arrow-right-line"/></>
                  }
                </button>
              </form>

              <p className="am-privacy">
                <i className="ri-lock-2-line"/> Your data is stored securely in Firebase and never shared.
              </p>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        /* Backdrop */
        .am-backdrop {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(10,5,20,0.72);
          backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: amFadeIn .25s ease;
        }
        @keyframes amFadeIn { from{opacity:0} to{opacity:1} }

        /* Modal shell */
        .am-shell {
          display: flex; width: 100%; max-width: 820px;
          border-radius: 28px; overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06);
          animation: amSlideUp .35s cubic-bezier(0.22,1,0.36,1);
          max-height: 95vh;
        }
        @keyframes amSlideUp {
          from { opacity:0; transform: translateY(32px) scale(0.97) }
          to   { opacity:1; transform: translateY(0)    scale(1) }
        }

        /* ── Left panel ── */
        .am-left {
          width: 320px; flex-shrink: 0;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          padding: 48px 40px;
          display: flex; flex-direction: column; justify-content: center;
          position: relative; overflow: hidden;
        }
        .am-left::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%);
          pointer-events: none;
        }
        .am-left-inner { position: relative; z-index: 1; }
        .am-left-logo {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 48px;
          font-size: 16px; font-weight: 700; letter-spacing: -0.3px;
          color: #ffffff;
        }
        .am-left-logo img {
          width: 52px;
          height: 52px;
          object-fit: contain;
        }
        .am-left-title {
          font-size: 48px; font-weight: 700; line-height: 1.3;
          color: #fff; margin: 0 0 16px;
          letter-spacing: -0.5px;
        }
        .am-left-sub {
          font-size: 15px; color: rgba(255,255,255,0.6);
          line-height: 1.6; margin: 0 0 40px;
        }
        .am-left-features { 
          display: flex; flex-direction: column; gap: 16px; 
        }
        .am-feature {
          display: flex; align-items: center; gap: 12px;
          color: rgba(255,255,255,0.8); 
          font-size: 14px; 
          font-weight: 500;
        }
        .am-feature svg {
          flex-shrink: 0;
          color: rgba(255,255,255,0.6);
        }

        /* ── Right panel ── */
        .am-right {
          flex: 1; background: #fff;
          padding: 44px 44px 40px;
          overflow-y: auto;
          position: relative;
          display: flex; flex-direction: column; justify-content: center;
        }
        .am-close {
          position: absolute; top: 20px; right: 20px;
          width: 36px; height: 36px; border-radius: 50%;
          background: #f4f4f4; border: none;
          font-size: 20px; cursor: pointer; color: #777;
          display: flex; align-items: center; justify-content: center;
          transition: all .2s;
        }
        .am-close:hover { background: #eaeaea; color: #333; transform: rotate(90deg); }

        .am-right-header { margin-bottom: 28px; }
        .am-right-header h2 {
          font-size: 30px; font-weight: 900; color: #111; margin: 0 0 6px;
        }
        .am-right-header p { font-size: 14px; color: #888; margin: 0; }

        /* Error */
        .am-error {
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 10px; padding: 11px 14px;
          font-size: 13px; font-weight: 600; color: #dc2626;
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 20px;
        }

        /* Form */
        .am-form { display: flex; flex-direction: column; gap: 18px; }

        .am-field {
          display: flex; flex-direction: column; gap: 5px;
        }
        .am-label {
          font-size: 12px; font-weight: 700; color: #555;
          text-transform: uppercase; letter-spacing: 0.6px;
        }
        .am-req { color: #000000; }
        .am-opt {
          font-size: 11px; font-weight: 500; color: #bbb;
          text-transform: none; letter-spacing: 0;
        }
        .am-input-row {
          position: relative;
          border: 2px solid #ebebeb;
          border-radius: 14px;
          background: #fafafa;
          transition: border-color .2s, box-shadow .2s, background .2s;
          overflow: hidden;
        }
        .am-field--focus .am-input-row {
          border-color: #000000;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0,0,0,.05);
        }
        .am-field--filled .am-input-row {
          border-color: #ddd;
          background: #fff;
        }
        .am-ico {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          font-size: 17px; color: #bbb; pointer-events: none;
          transition: color .2s;
        }
        .am-field--focus .am-ico { color: #000000; }
        .am-field--filled .am-ico { color: #999; }
        .am-input-row input {
          width: 100%; padding: 14px 14px 14px 42px;
          border: none; background: transparent;
          font-size: 15px; font-family: inherit;
          color: #111; outline: none;
          box-sizing: border-box;
        }
        .am-input-row input::placeholder { color: #ccc; }
        .am-input-row input:disabled { opacity: .55; }
        .am-hint { font-size: 11px; color: #c0c0c0; }

        /* Submit */
        .am-submit {
          width: 100%; padding: 15px;
          background: #000000;
          color: #fff; border: none; border-radius: 12px;
          font-size: 15px; font-weight: 700; letter-spacing: -0.2px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all .3s; margin-top: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,.2);
        }
        .am-submit:hover:not(:disabled) {
          background: #333333;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,.3);
        }
        .am-submit:active:not(:disabled) { transform: translateY(0); }
        .am-submit:disabled { opacity: .6; cursor: not-allowed; }
        .am-spin { animation: amSpin 1s linear infinite; display: inline-flex; }
        @keyframes amSpin { to { transform: rotate(360deg) } }

        /* Privacy note */
        .am-privacy {
          font-size: 11px; color: #ccc; margin: 16px 0 0;
          display: flex; align-items: center; gap: 5px;
          justify-content: center; text-align: center;
        }

        /* Success state */
        .am-success {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 20px 0; text-align: center;
          gap: 12px;
        }
        .am-success-ring {
          width: 72px; height: 72px; border-radius: 50%;
          background: #000000;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 28px rgba(0,0,0,.25);
          animation: amPop .4s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes amPop { from{transform:scale(0.4);opacity:0} to{transform:scale(1);opacity:1} }
        .am-success-check {
          font-size: 32px; font-weight: 900; color: #fff; line-height: 1;
        }
        .am-success h3 {
          font-size: 24px; font-weight: 900; color: #111; margin: 0;
        }
        .am-success p { font-size: 15px; color: #777; margin: 0; }

        /* ── Responsive ── */
        @media (max-width: 680px) {
          .am-left { display: none; }
          .am-shell { max-width: 480px; border-radius: 24px; }
          .am-right { padding: 36px 28px 32px; }
          .am-right-header h2 { font-size: 26px; }
        }
        @media (max-width: 400px) {
          .am-right { padding: 32px 20px 28px; }
        }
      `}</style>
    </div>
  )
}
