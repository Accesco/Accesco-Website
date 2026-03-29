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
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                <circle cx="19" cy="19" r="19" fill="rgba(255,255,255,0.15)"/>
                <circle cx="19" cy="19" r="12" fill="rgba(255,255,255,0.25)"/>
                <circle cx="19" cy="19" r="6" fill="white"/>
              </svg>
              <span>Accesco Living</span>
            </div>
            <h2 className="am-left-title">India's Unified<br/>Living Ecosystem</h2>
            <p className="am-left-sub">Groceries · Fashion · Food<br/>Finance &amp; more</p>
            <div className="am-left-pills">
              <div className="am-pill"><i className="ri-shield-check-line"/> Secure &amp; Private</div>
              <div className="am-pill"><i className="ri-flashlight-line"/> No Password</div>
              <div className="am-pill"><i className="ri-heart-line"/> Free Forever</div>
            </div>
          </div>
          {/* decorative circles */}
          <div className="am-deco am-deco-1"/>
          <div className="am-deco am-deco-2"/>
          <div className="am-deco am-deco-3"/>
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
          width: 300px; flex-shrink: 0;
          background: linear-gradient(145deg, #3d0230 0%, #570340 40%, #700457 70%, #8e0570 100%);
          padding: 44px 36px;
          display: flex; flex-direction: column; justify-content: flex-end;
          position: relative; overflow: hidden;
        }
        .am-left-inner { position: relative; z-index: 1; }
        .am-left-logo {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 40px;
          font-size: 15px; font-weight: 900; letter-spacing: 1px;
          text-transform: uppercase; color: rgba(255,255,255,0.9);
        }
        .am-left-title {
          font-size: 26px; font-weight: 900; line-height: 1.2;
          color: #fff; margin: 0 0 12px;
        }
        .am-left-sub {
          font-size: 13px; color: rgba(255,255,255,0.6);
          line-height: 1.6; margin: 0 0 28px;
        }
        .am-left-pills { display: flex; flex-direction: column; gap: 8px; }
        .am-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 12px; border-radius: 999px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.85); font-size: 12px; font-weight: 600;
          width: fit-content;
        }

        /* Decorative circles */
        .am-deco { position: absolute; border-radius: 50%; }
        .am-deco-1 {
          width: 260px; height: 260px; top: -80px; right: -80px;
          background: rgba(255,255,255,0.05);
        }
        .am-deco-2 {
          width: 180px; height: 180px; top: 40px; right: -60px;
          background: rgba(255,255,255,0.04);
        }
        .am-deco-3 {
          width: 120px; height: 120px; bottom: 120px; left: -40px;
          background: rgba(0,0,0,0.12);
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
          background: #fdf0f8; border: 1px solid #e8b0d8;
          border-radius: 10px; padding: 11px 14px;
          font-size: 13px; font-weight: 600; color: #700457;
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
        .am-req { color: #700457; }
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
          border-color: #700457;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(112,4,87,.07);
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
        .am-field--focus .am-ico { color: #700457; }
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
          background: linear-gradient(135deg, #700457 0%, #a01e7d 100%);
          color: #fff; border: none; border-radius: 14px;
          font-size: 15px; font-weight: 800; letter-spacing: 0.5px;
          text-transform: uppercase; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all .3s; margin-top: 4px;
          box-shadow: 0 4px 20px rgba(112,4,87,.3);
        }
        .am-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(112,4,87,.4);
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
          background: linear-gradient(135deg, #1e8449, #27ae60);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 28px rgba(39,174,96,.35);
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
