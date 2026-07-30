'use client'

import { useState, useRef } from 'react'
import { db, auth } from '../../lib/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth'
import { sendOtpEmailVerification, verifyOtpEmailCode } from '../../lib/waitlistService'

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [focused, setFocused] = useState('')

  // OTP flow: 'details' collects info, 'verify' does phone (mandatory) + email (optional) OTP
  const [step, setStep] = useState('details')
  const [otpCode, setOtpCode] = useState('')
  const [phoneCodeSent, setPhoneCodeSent] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState(null)
  const recaptchaVerifierRef = useRef(null)

  // Optional email verification state
  const [emailCode, setEmailCode] = useState('')
  const [emailCodeSent, setEmailCodeSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  const reset = () => {
    setName('')
    setFirstName('')
    setLastName('')
    setPhone('')
    setEmail('')

    setError('')
    setSuccess(false)
    setFocused('')

    setStep('details')
    setOtpCode('')
    setPhoneCodeSent(false)
    setConfirmationResult(null)
    setResendCooldown(0)

    setEmailCode('')
    setEmailCodeSent(false)
    setEmailVerified(false)

    setGoogleLoading(false)
    setPendingSocialUser(null)

    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear()
      recaptchaVerifierRef.current = null
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  // Converts user-entered phone to E.164 format required by Firebase
  const normalizePhone = (p) => {
    const stripped = p.replace(/[\s\-().]/g, '')
    if (stripped.startsWith('+')) return stripped
    return '+91' + stripped.replace(/\D/g, '')
  }

  // Step 1 → validate details, then send phone OTP and move to verify step
  const handleDetailsSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const n = name.trim()
    const p = phone.trim()
    const em = email.trim()

    if (!n) return setError('Please enter your full name')
    if (!p) return setError('Please enter your phone number')

    if (!/^[+\d\s\-()]{7,20}$/.test(p)) {
      return setError('Enter a valid phone number with country code')
    }

    const docId = p.replace(/[^\d]/g, '')

    if (docId.length < 7) {
      return setError('Enter a valid phone number including digits')
    }

    if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      return setError('Enter a valid email address')
    }

    setStep('verify')
    if (!phoneCodeSent) sendPhoneOtp()
  }

  // Firebase's verifier.clear() can leave the widget mounted in the DOM if the
  // previous verifier never finished rendering (e.g. after a network error or
  // a fast double-send), which then throws "reCAPTCHA has already been
  // rendered in this element" on the next attempt. Force the container empty
  // as well so every send starts from a clean slate.
  const clearRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear()
      } catch (err) {
        console.error('reCAPTCHA clear failed:', err)
      }
      recaptchaVerifierRef.current = null
    }

    const container = document.getElementById('am-recaptcha-container')
    if (container) container.innerHTML = ''
  }
  const sendPhoneOtp = async () => {
    if (TEST_MODE) {
      setPhoneCodeSent(true);

      // Fake confirmation object
      setConfirmationResult({
        confirm: async (code) => {
          if (code === "123456") {
            return { user: { uid: "test-user" } };
          }
          throw { code: "auth/invalid-verification-code" };
        },
      });

      setError("");
      return;
    }

    // Firebase code neeche waise hi rahega...
  }

  // const sendPhoneOtp = async () => {
  //   // Prevent a second reCAPTCHA widget from being created while one is still loading
  //   if (loading) return
  //   setLoading(true); setError('')

  //   try {
  //     clearRecaptcha();

  //     const verifier = new RecaptchaVerifier(
  //       auth,
  //       'am-recaptcha-container',
  //       {
  //         size: 'invisible',
  //       },
  //     )

  //     recaptchaVerifierRef.current = verifier

  //     const result = await signInWithPhoneNumber(auth, normalizePhone(phone.trim()), verifier)
  //     setConfirmationResult(result)
  //     setPhoneCodeSent(true)
  //   } catch (err) {
  //     console.error('Phone OTP send failed:', err)

  //     setError(
  //       err.message ||
  //       'Failed to send OTP. Check your phone number and try again.',
  //     )
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // Optional: send an email verification code
  const sendEmailOtp = async () => {
    if (!email.trim()) { setError('Please add an email first'); return }
    setEmailLoading(true); setError('')
    try {
      await sendOtpEmailVerification(email.trim())
      setEmailCodeSent(true); setEmailVerified(false)
    } catch (err) {
      console.error('Email OTP send failed:', err)
      setError(err.message || 'Failed to send email code')
    } finally {
      setEmailLoading(false)
    }
  }

  // Optional: verify the email code
  const verifyEmailOtp = async () => {
    if (!/^\d{6}$/.test(emailCode.trim())) { setError('Please enter a valid 6-digit email code.'); return }
    setEmailLoading(true); setError('')
    try {
      await verifyOtpEmailCode(email.trim(), emailCode.trim())
      setEmailVerified(true)
    } catch (err) {
      console.error('Email OTP verify failed:', err)
      setError(err.message || 'Email verification failed')
    } finally {
      setEmailLoading(false)
    }
  }

  // Step 2 → verify phone OTP (mandatory), then save the user
  const handleVerifySubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!confirmationResult) { setError('Code is still being sent. Please wait a moment.'); return }
    if (!/^\d{6}$/.test(otpCode.trim())) { setError('Please enter a valid 6-digit OTP.'); return }

    setLoading(true)

    try {
      await confirmationResult.confirm(otpCode.trim())

      const p = phone.trim()
      const n =
        pendingSocialUser
          ? pendingSocialUser.name || name.trim() || 'Accesco User'
          : name.trim()
      const em =
        pendingSocialUser
          ? pendingSocialUser.email || email.trim()
          : email.trim()
      const docId = pendingSocialUser
        ? pendingSocialUser.uid
        : p.replace(/[^\d]/g, '')

      await setDoc(
        doc(db, 'users', docId),
        {
          name: n,
          phone: normalizedPhone,
          email: em || null,
          photoURL: pendingSocialUser?.photoURL || null,
          provider: pendingSocialUser?.provider || 'phone',
          phoneVerified: true,
          emailVerified,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        },
      )

      // Sign out of Firebase Auth after the write — we only needed phone verification
      await signOut(auth)

      // Referral profile creation/attribution is a side effect — never let
      // it block or fail the sign-in itself.
      initializeReferralProfile(p, n, getStoredReferralCode()).catch((err) =>
        console.error('Referral profile init failed:', err),
      )

      const user = {
        name: userSnap.exists() ? userSnap.data().name : n,
        phone: normalizedPhone,
        email: em || null,
        photoURL: pendingSocialUser?.photoURL || null,
        uid: docId,
      }

      localStorage.setItem('accesco_user', JSON.stringify(user))

      setSuccess(true)

      setTimeout(() => {
        onSuccess && onSuccess(user)
        handleClose()
      }, 1300)
    } catch (err) {
      console.error(err)
      if (err.code === 'auth/invalid-verification-code') setError('Invalid OTP. Please check the code and try again.')
      else if (err.code === 'auth/code-expired') setError('OTP has expired. Please request a new one.')
      else setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatCooldown = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, '0')}:${(s % 60)
        .toString()
        .padStart(2, '0')}`

  const inputStyle = (field) => ({
    width: '100%',
    height: 35,
    boxSizing: 'border-box',

    padding: '0 11px',

    border:
      focused === field
        ? '1px solid #c50062'
        : '1px solid #2d2d2d',

    borderRadius: 5,
    outline: 'none',

    background:
      focused === field
        ? '#242424'
        : '#202020',

    color: '#ffffff',

    fontFamily: 'inherit',
    fontSize: 10,
    fontWeight: 400,

    boxShadow:
      focused === field
        ? '0 0 0 4px rgba(255,255,255,0.055), 0 16px 34px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.13)'
        : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 28px rgba(0,0,0,0.12)',

    backdropFilter: 'blur(22px)',
    WebkitBackdropFilter: 'blur(22px)',
    transition: '180ms ease',
  })

  if (!isOpen) return null

  return (
    <div style={styles.backdrop} onClick={handleClose}>
      <div style={styles.shell} onClick={(e) => e.stopPropagation()}>
        <div style={styles.glowTop} />
        <div style={styles.glowRight} />
        <div style={styles.diagonalOne} />
        <div style={styles.diagonalTwo} />
        <div style={styles.noiseLayer} />

        <button style={styles.close} onClick={handleClose} aria-label="Close">
          ×
        </button>

        <section style={styles.left}>
          <div style={styles.logoRow}>
            <img
              src="/images/accesco_white.png"
              alt="Accesco Living"
              style={styles.logo}
            />
            <span style={styles.logoText}>Accesco Living</span>
          </div>

          <h2 style={styles.heroTitle}>
            India's
            <br />
            Unified
            <br />
            Living
            <br />
            Ecosystem
          </h2>

          <p style={styles.heroSub}>
            One platform for groceries,
            <br />
            fashion, food, finance and more.
          </p>

          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>★</span>
              <span>Secure &amp; Private</span>
            </div>

            <div style={styles.feature}>
              <span style={styles.featureIcon}>✓</span>
              <span>No Password Required</span>
            </div>

            <div style={styles.feature}>
              <span style={styles.featureIcon}>◇</span>
              <span>Free Forever</span>
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardShine} />

          {success ? (
            <div style={styles.success}>
              <div style={styles.successCircle}>✓</div>
              <h3 style={styles.successTitle}>You're in!</h3>
              <p style={styles.successText}>
                Welcome to Accesco, {name.split(' ')[0]}.
              </p>
            </div>
          ) : (
            <>
              {/* Invisible reCAPTCHA container required by Firebase Phone Auth */}
              <div id="am-recaptcha-container"></div>

              <div style={styles.header}>
                <h2 style={styles.title}>
                  {step === 'details' ? 'Welcome!' : 'Verify your phone'}
                </h2>
                <p style={styles.subtitle}>
                  {step === 'details'
                    ? 'No password needed — just verify your phone.'
                    : phoneCodeSent
                      ? `Enter the 6-digit code sent to ${phone}`
                      : 'Sending OTP to your phone…'}
                </p>
              </div>

              {error && <div style={styles.error}>{error}</div>}

              {step === 'details' ? (
                <>
                  <form onSubmit={handleDetailsSubmit} style={styles.form}>
                    <div style={styles.field}>
                      <label style={styles.label}>
                        Full Name <span style={styles.required}>*</span>
                      </label>
                      <input
                        style={inputStyle('name')}
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused('')}
                        disabled={loading}
                        autoFocus
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>
                        Phone Number <span style={styles.required}>*</span>
                      </label>
                      <input
                        style={inputStyle('phone')}
                        type="tel"
                        placeholder="+91 9022217637"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onFocus={() => setFocused('phone')}
                        onBlur={() => setFocused('')}
                        disabled={loading}
                      />
                      <small style={styles.hint}>
                        Include country code · +91 India · +1 USA
                      </small>
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>
                        Email <em style={styles.optional}>optional</em>
                      </label>
                      <input
                        style={inputStyle('email')}
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused('')}
                        disabled={loading}
                      />
                    </div>

                    <button type="submit" style={styles.submit} disabled={loading}>
                      Continue <span style={styles.arrow}>→</span>
                    </button>
                  </form>

                  <p style={styles.privacy}>
                    <span>▣</span>
                    Your data is stored securely in Firebase and never shared.
                  </p>
                </>
              ) : (
                <>
                  <form onSubmit={handleVerifySubmit} style={styles.form}>
                    {/* Phone OTP — mandatory */}
                    <div style={styles.field}>
                      <label style={styles.label}>
                        OTP Code <span style={styles.required}>*</span>
                      </label>
                      <input
                        style={inputStyle('otp')}
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter 6-digit OTP"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        onFocus={() => setFocused('otp')}
                        onBlur={() => setFocused('')}
                        maxLength={6}
                        disabled={loading}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={sendPhoneOtp}
                        disabled={loading}
                        style={styles.linkButton}
                      >
                        Resend OTP
                      </button>
                    </div>

                    {/* Optional email verification */}
                    <div style={styles.verifySection}>
                      <label style={styles.label}>
                        Verify Email <em style={styles.optional}>optional</em>
                      </label>

                      {emailVerified ? (
                        <p style={styles.successNote}>Email verified ✓</p>
                      ) : !email.trim() ? (
                        <p style={styles.mutedNote}>
                          Add an email in the previous step to verify it.
                        </p>
                      ) : !emailCodeSent ? (
                        <button
                          type="button"
                          onClick={sendEmailOtp}
                          disabled={emailLoading}
                          style={styles.secondaryButton}
                        >
                          {emailLoading ? 'Sending…' : 'Send email code'}
                        </button>
                      ) : (
                        <>
                          <input
                            style={{ ...inputStyle('emailCode'), marginTop: 8 }}
                            type="text"
                            inputMode="numeric"
                            placeholder="Email 6-digit code"
                            value={emailCode}
                            onChange={(e) => setEmailCode(e.target.value)}
                            onFocus={() => setFocused('emailCode')}
                            onBlur={() => setFocused('')}
                            maxLength={6}
                            disabled={emailLoading}
                          />
                          <div style={styles.buttonRow}>
                            <button
                              type="button"
                              onClick={sendEmailOtp}
                              disabled={emailLoading}
                              style={styles.miniButtonMuted}
                            >
                              Resend
                            </button>
                            <button
                              type="button"
                              onClick={verifyEmailOtp}
                              disabled={emailLoading}
                              style={styles.miniButton}
                            >
                              {emailLoading ? 'Verifying…' : 'Verify email'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    <button type="submit" style={styles.submit} disabled={loading}>
                      {loading ? 'Verifying…' : (
                        <>
                          Verify &amp; Continue <span style={styles.arrow}>→</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setStep('details'); setError('') }}
                      disabled={loading}
                      style={styles.backLink}
                    >
                      ← Back to details
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    background: 'rgba(12, 8, 13, 0.48)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },

  shell: {
    position: 'relative',
    width: 'min(940px, calc(100vw - 32px))',
    height: 'min(724px, calc(100vh - 32px))',
    minHeight: 650,
    display: 'grid',
    gridTemplateColumns: '380px 1fr',
    overflow: 'hidden',

    background:
      'radial-gradient(circle at 18% 8%, rgba(115, 0, 60, 0.52), transparent 32%), radial-gradient(circle at 82% 20%, rgba(255,255,255,0.06), transparent 25%), radial-gradient(circle at 70% 75%, rgba(40,0,24,0.65), transparent 38%), linear-gradient(135deg, #230014 0%, #3a001f 38%, #56002f 62%, #240015 100%)',

    boxShadow:
      '0 42px 110px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.07)',
  },

  glowTop: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 360,
    height: 260,
    borderRadius: '50%',
    background: 'rgba(255, 53, 154, 0.22)',
    filter: 'blur(70px)',
    pointerEvents: 'none',
  },

  glowRight: {
    position: 'absolute',
    top: 90,
    right: -110,
    width: 340,
    height: 340,
    borderRadius: '50%',
    background: 'rgba(255, 125, 194, 0.16)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },

  diagonalOne: {
    position: 'absolute',
    right: -160,
    top: -90,
    width: 520,
    height: 900,
    background:
      'linear-gradient(145deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02), transparent)',
    transform: 'rotate(28deg)',
    pointerEvents: 'none',
  },

  diagonalTwo: {
    position: 'absolute',
    left: -180,
    bottom: -180,
    width: 620,
    height: 320,
    background:
      'linear-gradient(145deg, rgba(255,0,132,0.30), rgba(255,255,255,0.035))',
    transform: 'rotate(-34deg)',
    pointerEvents: 'none',
  },

  noiseLayer: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.035), transparent 40%, rgba(0,0,0,0.10))',
    pointerEvents: 'none',
  },

  close: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 20,
    width: 38,
    height: 38,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.24)',
    background: 'rgba(255,255,255,0.07)',
    color: '#fff',
    fontSize: 31,
    lineHeight: 1,
    fontWeight: 300,
    cursor: 'pointer',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16)',
  },

  left: {
    position: 'relative',
    zIndex: 3,
    padding: '48px 0 0 41px',
    color: '#fff',
  },

  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 50,
  },

  logo: {
    width: 55,
    height: 55,
    objectFit: 'contain',
    filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.28))',
  },

  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 750,
    letterSpacing: '-0.04em',
  },

  heroTitle: {
    margin: 0,
    color: '#fff',
    fontSize: 48,
    lineHeight: 1.45,
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },

  right: {
    position: 'relative',
    minWidth: 0,

    boxSizing: 'border-box',
    padding: '27px 6px 8px 0',

    overflowY: 'auto',

    background: '#000000',
    color: '#ffffff',

    scrollbarWidth: 'none',
  },

  detailsScreen: {
    width: '100%',
    minHeight: '100%',
  },

  signupHeader: {
    textAlign: 'center',
  },

  signupTitle: {
    margin: 0,

    color: '#ffffff',

    fontSize: 25,
    lineHeight: 1.12,
    fontWeight: 700,
    letterSpacing: '-0.025em',
  },

  signupSubtitle: {
    margin: '8px 0 0',

    color: 'rgba(255,255,255,0.88)',

    fontSize: 10,
    lineHeight: 1.35,
    fontWeight: 500,
  },

  socialRow: {
    display: 'grid',
    gridTemplateColumns: '1fr',

    gap: 18,

    marginTop: 27,
  },

  socialButtonFull: {
    width: '100%',
    height: 37,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 10,
    padding: 0,

    boxSizing: 'border-box',

    border: '1px solid #2b2b2b',
    borderRadius: 5,

    background: '#202020',
    color: '#eeeeee',

    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: 11,
    fontWeight: 500,
    lineHeight: 1,
    letterSpacing: 0,
    textTransform: 'none',

    cursor: 'pointer',
  },

  divider: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',

    gap: 9,

    margin: '20px 0 17px',
  },

  dividerLine: {
    height: 1,

    background: '#292929',
  },

  dividerText: {
    color: 'rgba(255,255,255,0.58)',

    fontSize: 7,
    lineHeight: 1,
    fontWeight: 700,
    letterSpacing: '-0.055em',
  },

  error: {
    margin: '0 0 10px',
    padding: '6px 8px',

    border: '1px solid rgba(197,0,98,0.3)',
    borderRadius: 4,

    background: 'rgba(197,0,98,0.1)',
    color: '#ff65a1',

    fontSize: 9,
    lineHeight: 1.3,
    textAlign: 'center',
  },

  detailsForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 23,
    width: '100%',
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 11,
    width: '100%',
  },

  label: {
    color: 'rgba(255,255,255,0.92)',

    fontSize: 9,
    lineHeight: 1,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },

  optional: {
    color: 'rgba(255,255,255,0.56)',

    optional: {
      marginLeft: 4,
      color: 'rgba(255,255,255,0.66)',
      fontSize: 11,
      fontStyle: 'normal',
      fontWeight: 650,
      letterSpacing: 0,
      textTransform: 'none',
    },

    hint: {
      marginTop: -2,
      color: 'rgba(255,255,255,0.58)',
      fontSize: 12,
      lineHeight: 1.25,
      fontweight: 400,
    },

    submit: {
      width: '100%',
      height: 54,
      marginTop: 8,
      border: '1px solid rgba(255,255,255,0.16)',
      borderRadius: 13,

      background:
        'linear-gradient(180deg, #76003f 0%, #5a002f 52%, #390020 100%)',

      color: '#ffffff',
      cursor: 'pointer',

      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,

      fontFamily: 'inherit',
      fontSize: 13,
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',

      boxShadow:
        '0 18px 44px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.18)',
    },

    arrow: {
      fontSize: 25,
      lineHeight: 1,
      transform: 'translateY(-1px)',
    },

    verifyForm: {
      minHeight: '100%',

      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },

    verifyHeader: {
      paddingTop: 1,
    },

    verifyTitle: {
      margin: 0,

      color: '#ffffff',

      fontSize: 26,
      lineHeight: 1.1,
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },

    verifySubtitle: {
      margin: '13px 0 0',

      color: 'rgba(255,255,255,0.58)',

      fontSize: 9,
      lineHeight: 1.4,
    },

    phoneRow: {
      display: 'flex',
      alignItems: 'center',

      gap: 8,

      marginTop: 6,
    },

    phoneText: {
      color: '#cf0066',

      fontSize: 10,
      fontWeight: 600,
    },

    changeButton: {
      padding: 0,

      border: 0,

      background: 'transparent',
      color: '#cf0066',

      fontSize: 9,

      cursor: 'pointer',
    },

    verifyError: {
      margin: '14px 0 -42px',
      padding: '6px 8px',

      border: '1px solid rgba(197,0,98,0.3)',
      borderRadius: 4,

      background: 'rgba(197,0,98,0.1)',
      color: '#ff65a1',

      fontSize: 9,
      lineHeight: 1.3,
      textAlign: 'center',
    },

    otpInputArea: {
      position: 'relative',
      zIndex: 2,
      margin: '21px 0 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      boxSizing: 'border-box',

      border: '1px solid #2c2c2c',
      borderRadius: 5,

      background: '#202020',
      color: '#ffffff',

      fontSize: 18,
      fontWeight: 600,
    },

    otpBoxActive: {
      borderColor: '#cf0066',

      boxShadow: '0 0 0 1px #cf0066',
    },

    otpRealInput: {
      position: 'absolute',
      inset: 0,

      width: '100%',
      height: '100%',

      padding: 0,

      border: 0,
      outline: 0,

      background: 'transparent',
      color: 'transparent',
      caretColor: 'transparent',

      opacity: 0.01,

      cursor: 'text',
    },

    resendTimer: {
      display: 'flex',
      alignItems: 'center',

      gap: 4,

      marginTop: 58,
      marginLeft: 8,

      fontSize: 9,
    },

    clockIcon: {
      color: '#cf0066',

      fontSize: 12,
      lineHeight: 1,
    },

    resendText: {
      color: 'rgba(255,255,255,0.54)',
    },

    timerValue: {
      color: '#cf0066',

      fontWeight: 600,
    },

    hiddenEmailVerification: {
      display: 'none',
    },

    verifyBottom: {
      marginTop: 30,
    },

    verifySubmit: {
      width: '100%',
      height: 38,

      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',

      gap: 20,

      boxSizing: 'border-box',
      padding: 0,

      border: '1px solid #c50062',
      borderRadius: 5,

      background: '#c50062',
      color: '#ffffff',

      fontFamily: 'inherit',
      fontSize: 11,
      lineHeight: 1,
      fontWeight: 700,

      cursor: 'pointer',
    },

    bottomResendRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      gap: 5,

      marginTop: 12,
    },

    bottomResendText: {
      color: 'rgba(255,255,255,0.54)',

      fontSize: 9,
    },

    bottomResendButton: {
      padding: 0,

      border: 0,

      background: 'transparent',
      color: '#cf0066',

      fontSize: 9,

      cursor: 'pointer',
    },

    success: {
      position: 'relative',
      zIndex: 2,
      minHeight: 520,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: '#fff',
    },

    successCircle: {
      width: 74,
      height: 74,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
      background: 'linear-gradient(180deg, #c40072, #85004e)',
      color: '#fff',
      fontSize: 38,
      fontWeight: 900,
      boxShadow: '0 18px 44px rgba(0,0,0,0.28)',
    },

    successTitle: {
      margin: '0 0 7px',

      color: '#ffffff',

      fontSize: 25,
      fontWeight: 700,
    },

    successText: {
      margin: 0,

      color: 'rgba(255,255,255,0.66)',

      fontSize: 11,
    },

    successNote: {
      margin: 0,

      color: '#4ade80',

      fontSize: 11,
      fontWeight: 650,
    },

    mutedNote: {
      margin: 0,

      color: 'rgba(255,255,255,0.5)',

      fontSize: 11,
    },

    secondaryButton: {
      width: '100%',
      height: 36,

      border: '1px solid #333333',
      borderRadius: 5,

      background: '#202020',
      color: '#ffffff',

      fontSize: 10,
      fontWeight: 600,

      cursor: 'pointer',
    },

    buttonRow: {
      display: 'flex',
      gap: 8,
      marginTop: 8,
    },

    miniButton: {
      flex: 1,
      padding: '10px 12px',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.28)',
      color: '#fff',
      borderRadius: 12,
      fontWeight: 700,
      fontSize: 13,
      cursor: 'pointer',
    },

    miniButtonMuted: {
      height: 35,

      border: '1px solid #333333',
      borderRadius: 5,

      background: '#202020',
      color: 'rgba(255,255,255,0.7)',

      fontSize: 10,
      fontWeight: 600,
      cursor: 'pointer',
      padding: '4px 0',
    },

  }
}