'use client'

import { useState, useRef } from 'react'
import { db, auth } from '../../lib/firebase'
import {
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from 'firebase/auth'
import {
  sendOtpEmailVerification,
  verifyOtpEmailCode,
} from '../../lib/waitlistService'

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.72-.06-1.4-.2-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.32 2.98-7.39Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.62-2.38l-3.24-2.53c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.13H3.05v2.61A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.92A6 6 0 0 1 6.08 12c0-.67.12-1.32.32-1.92V7.47H3.05A10 10 0 0 0 2 12c0 1.61.38 3.14 1.05 4.53l3.35-2.61Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.95c1.47 0 2.8.51 3.84 1.51l2.88-2.88A9.68 9.68 0 0 0 12 2a10 10 0 0 0-8.95 5.47l3.35 2.61C7.19 7.71 9.4 5.95 12 5.95Z"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.7 12.6c0-3.1 2.5-4.6 2.6-4.7a5.54 5.54 0 0 0-4.36-2.36c-1.84-.19-3.62 1.1-4.56 1.1-.96 0-2.4-1.08-3.96-1.05a5.8 5.8 0 0 0-4.88 2.97c-2.12 3.67-.54 9.06 1.49 12.02 1.01 1.45 2.18 3.06 3.74 3 1.52-.06 2.09-.96 3.93-.96 1.82 0 2.36.96 3.95.92 1.64-.03 2.67-1.45 3.65-2.91a12.1 12.1 0 0 0 1.67-3.4 5.25 5.25 0 0 1-3.27-4.66ZM15.74 3.6A5.35 5.35 0 0 0 16.96 0a5.44 5.44 0 0 0-3.5 1.71 5.06 5.06 0 0 0-1.25 3.48 4.5 4.5 0 0 0 3.53-1.59Z" />
    </svg>
  )
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [name, setName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [focused, setFocused] = useState('')

  // OTP flow: 'details' collects info, 'verify' does phone (mandatory) + email (optional) OTP
  const [step, setStep] = useState('details')
  const [otpCode, setOtpCode] = useState('')
  const [phoneCodeSent, setPhoneCodeSent] =
    useState(false)
  const [confirmationResult, setConfirmationResult] =
    useState(null)

  const recaptchaVerifierRef = useRef(null)

  // Optional email verification state
  const [emailCode, setEmailCode] = useState('')
  const [emailCodeSent, setEmailCodeSent] =
    useState(false)
  const [emailVerified, setEmailVerified] =
    useState(false)
  const [emailLoading, setEmailLoading] =
    useState(false)

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

    setEmailCode('')
    setEmailCodeSent(false)
    setEmailVerified(false)

    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear()
      recaptchaVerifierRef.current = null
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFirstNameChange = (value) => {
    setFirstName(value)
    setName(`${value} ${lastName}`.trim())
  }

  const handleLastNameChange = (value) => {
    setLastName(value)
    setName(`${firstName} ${value}`.trim())
  }

  // Converts user-entered phone to E.164 format required by Firebase
  const normalizePhone = (p) => {
    const stripped = p.replace(/[\s\-().]/g, '')

    if (stripped.startsWith('+')) {
      return stripped
    }

    return '+91' + stripped.replace(/\D/g, '')
  }

  // Step 1 → validate details, then send phone OTP and move to verify step
  const handleDetailsSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const n = name.trim()
    const p = phone.trim()
    const em = email.trim()

    if (!n) {
      return setError('Please enter your full name')
    }

    if (!p) {
      return setError('Please enter your phone number')
    }

    if (!/^[+\d\s\-()]{7,20}$/.test(p)) {
      return setError(
        'Enter a valid phone number with country code',
      )
    }

    const docId = p.replace(/[^\d]/g, '')

    if (docId.length < 7) {
      return setError(
        'Enter a valid phone number including digits',
      )
    }

    if (
      em &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)
    ) {
      return setError('Enter a valid email address')
    }

    setStep('verify')

    if (!phoneCodeSent) {
      sendPhoneOtp()
    }
  }

  const sendPhoneOtp = async () => {
    // Prevent a second reCAPTCHA widget from being created while one is still loading
    if (loading) return

    setLoading(true)
    setError('')

    try {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear()
        recaptchaVerifierRef.current = null
      }

      const verifier = new RecaptchaVerifier(
        auth,
        'am-recaptcha-container',
        {
          size: 'invisible',
        },
      )

      recaptchaVerifierRef.current = verifier

      const result = await signInWithPhoneNumber(
        auth,
        normalizePhone(phone.trim()),
        verifier,
      )

      setConfirmationResult(result)
      setPhoneCodeSent(true)
    } catch (err) {
      console.error('Phone OTP send failed:', err)

      setError(
        err.message ||
          'Failed to send OTP. Check your phone number and try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  // Optional: send an email verification code
  const sendEmailOtp = async () => {
    if (!email.trim()) {
      setError('Please add an email first')
      return
    }

    setEmailLoading(true)
    setError('')

    try {
      await sendOtpEmailVerification(email.trim())

      setEmailCodeSent(true)
      setEmailVerified(false)
    } catch (err) {
      console.error('Email OTP send failed:', err)

      setError(
        err.message || 'Failed to send email code',
      )
    } finally {
      setEmailLoading(false)
    }
  }

  // Optional: verify the email code
  const verifyEmailOtp = async () => {
    if (!/^\d{6}$/.test(emailCode.trim())) {
      setError(
        'Please enter a valid 6-digit email code.',
      )
      return
    }

    setEmailLoading(true)
    setError('')

    try {
      await verifyOtpEmailCode(
        email.trim(),
        emailCode.trim(),
      )

      setEmailVerified(true)
    } catch (err) {
      console.error('Email OTP verify failed:', err)

      setError(
        err.message || 'Email verification failed',
      )
    } finally {
      setEmailLoading(false)
    }
  }

  // Step 2 → verify phone OTP (mandatory), then save the user
  const handleVerifySubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!confirmationResult) {
      setError(
        'Code is still being sent. Please wait a moment.',
      )
      return
    }

    if (!/^\d{6}$/.test(otpCode.trim())) {
      setError('Please enter a valid 6-digit OTP.')
      return
    }

    setLoading(true)

    try {
      await confirmationResult.confirm(
        otpCode.trim(),
      )

      const n = name.trim()
      const p = phone.trim()
      const em = email.trim()
      const docId = p.replace(/[^\d]/g, '')

      await setDoc(
        doc(db, 'users', docId),
        {
          name: n,
          phone: p,
          email: em || null,
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

      const user = {
        name: n,
        phone: p,
        email: em || null,
        uid: docId,
      }

      localStorage.setItem(
        'accesco_user',
        JSON.stringify(user),
      )

      setSuccess(true)

      setTimeout(() => {
        onSuccess && onSuccess(user)
        handleClose()
      }, 1300)
    } catch (err) {
      console.error(err)

      if (
        err.code ===
        'auth/invalid-verification-code'
      ) {
        setError(
          'Invalid OTP. Please check the code and try again.',
        )
      } else if (
        err.code === 'auth/code-expired'
      ) {
        setError(
          'OTP has expired. Please request a new one.',
        )
      } else {
        setError(
          'Something went wrong. Please try again.',
        )
      }
    } finally {
      setLoading(false)
    }
  }

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
        ? '0 0 0 2px rgba(197,0,98,0.12)'
        : 'none',

    transition: '150ms ease',
  })

  if (!isOpen) return null

  return (
    <div
      style={styles.backdrop}
      onClick={handleClose}
    >
      <div
        className="auth-modal-shell"
        style={styles.shell}
        onClick={(e) => e.stopPropagation()}
      >
        <section
          className="auth-modal-left"
          style={styles.left}
        >
          <div style={styles.leftLight} />
          <div style={styles.leftShade} />

          <div style={styles.leftContent}>
            {step === 'details' ? (
              <>
                <h2 style={styles.heroTitle}>
                  Get Started
                  <br />
                  With Accesco Living
                </h2>

                <p style={styles.heroSub}>
                  One Ecosystem.Endless Possibilities.
                  <br />
                  Join Accesco Living and Experience
                  <br />a smarter way to live and shop
                </p>
              </>
            ) : (
              <>
                <h2 style={styles.heroTitle}>
                  Verify Your
                  <br />
                  Account
                </h2>

                <p style={styles.heroSub}>
                  Enter the 6-Digit OTP Sent to your
                  <br />
                  Registered Mobile Number
                </p>
              </>
            )}
          </div>
        </section>

        <section
          className="auth-modal-right"
          style={styles.right}
        >
          {success ? (
            <div style={styles.success}>
              <div style={styles.successCircle}>
                ✓
              </div>

              <h3 style={styles.successTitle}>
                You&apos;re in!
              </h3>

              <p style={styles.successText}>
                Welcome to Accesco,{' '}
                {name.split(' ')[0]}.
              </p>
            </div>
          ) : (
            <>
              {/* Invisible reCAPTCHA container required by Firebase Phone Auth */}
              <div id="am-recaptcha-container" />

              {step === 'details' ? (
                <div style={styles.detailsScreen}>
                  <header style={styles.signupHeader}>
                    <h2 style={styles.signupTitle}>
                      Sign Up Account
                    </h2>

                    <p style={styles.signupSubtitle}>
                      Enter Your Personal Data to
                      Create your Account
                    </p>
                  </header>

                  <div style={styles.socialRow}>
                    <button
                      type="button"
                      style={styles.socialButton}
                    >
                      <GoogleIcon />
                      <span>Google</span>
                    </button>

                    <button
                      type="button"
                      style={styles.socialButton}
                    >
                      <AppleIcon />
                      <span>Apple</span>
                    </button>
                  </div>

                  <div style={styles.divider}>
                    <span style={styles.dividerLine} />

                    <span style={styles.dividerText}>
                      Or
                    </span>

                    <span style={styles.dividerLine} />
                  </div>

                  {error && (
                    <div style={styles.error}>
                      {error}
                    </div>
                  )}

                  <form
                    onSubmit={handleDetailsSubmit}
                    style={styles.detailsForm}
                  >
                    <div style={styles.nameGrid}>
                      <div style={styles.field}>
                        <label style={styles.label}>
                          First Name
                        </label>

                        <input
                          style={inputStyle('firstName')}
                          type="text"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) =>
                            handleFirstNameChange(
                              e.target.value,
                            )
                          }
                          onFocus={() =>
                            setFocused('firstName')
                          }
                          onBlur={() => setFocused('')}
                          disabled={loading}
                          autoFocus
                        />
                      </div>

                      <div style={styles.field}>
                        <label style={styles.label}>
                          Last Name
                        </label>

                        <input
                          style={inputStyle('lastName')}
                          type="text"
                          placeholder="Francisco"
                          value={lastName}
                          onChange={(e) =>
                            handleLastNameChange(
                              e.target.value,
                            )
                          }
                          onFocus={() =>
                            setFocused('lastName')
                          }
                          onBlur={() => setFocused('')}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>
                        Mobile Number
                      </label>

                      <input
                        style={inputStyle('phone')}
                        type="tel"
                        placeholder="eg. 98765 43210"
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value)
                        }
                        onFocus={() =>
                          setFocused('phone')
                        }
                        onBlur={() => setFocused('')}
                        disabled={loading}
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>
                        Email{' '}
                        <em style={styles.optional}>
                          (Optional)
                        </em>
                      </label>

                      <input
                        style={inputStyle('email')}
                        type="email"
                        placeholder="eg.Johnfranc@gmail.com"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        onFocus={() =>
                          setFocused('email')
                        }
                        onBlur={() => setFocused('')}
                        disabled={loading}
                      />
                    </div>

                    <button
                      type="submit"
                      style={styles.submit}
                      disabled={loading}
                    >
                      {loading
                        ? 'Sending OTP...'
                        : 'Send OTP'}

                      {!loading && (
                        <span style={styles.arrow}>
                          →
                        </span>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <form
                  onSubmit={handleVerifySubmit}
                  style={styles.verifyForm}
                >
                  <div>
                    <header style={styles.verifyHeader}>
                      <h2 style={styles.verifyTitle}>
                        OTP Authentication
                      </h2>

                      <p style={styles.verifySubtitle}>
                        We have Sent a 6 digit OTP to
                      </p>

                      <div style={styles.phoneRow}>
                        <span style={styles.phoneText}>
                          {phone}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setStep('details')
                            setError('')
                          }}
                          disabled={loading}
                          style={styles.changeButton}
                        >
                          Change
                        </button>
                      </div>
                    </header>

                    {error && (
                      <div style={styles.verifyError}>
                        {error}
                      </div>
                    )}

                    <div style={styles.otpInputArea}>
                      <div
                        style={styles.otpBoxes}
                        aria-hidden="true"
                      >
                        {Array.from({
                          length: 6,
                        }).map((_, index) => (
                          <span
                            key={index}
                            style={{
                              ...styles.otpBox,

                              ...(focused === 'otp' &&
                              index ===
                                Math.min(
                                  otpCode.length,
                                  5,
                                )
                                ? styles.otpBoxActive
                                : {}),
                            }}
                          >
                            {otpCode[index] || ''}
                          </span>
                        ))}
                      </div>

                      <input
                        style={styles.otpRealInput}
                        type="text"
                        inputMode="numeric"
                        aria-label="Enter 6-digit OTP"
                        value={otpCode}
                        onChange={(e) =>
                          setOtpCode(e.target.value)
                        }
                        onFocus={() =>
                          setFocused('otp')
                        }
                        onBlur={() => setFocused('')}
                        maxLength={6}
                        disabled={loading}
                        autoFocus
                      />
                    </div>

                    <div style={styles.resendTimer}>
                      <span style={styles.clockIcon}>
                        ◷
                      </span>

                      <span style={styles.resendText}>
                        Resend OTP in
                      </span>

                      <span style={styles.timerValue}>
                        00:45
                      </span>
                    </div>

                    {/* Optional email verification is retained but hidden to match the supplied design */}
                    <div
                      style={
                        styles.hiddenEmailVerification
                      }
                    >
                      <label style={styles.label}>
                        Verify Email{' '}
                        <em style={styles.optional}>
                          optional
                        </em>
                      </label>

                      {emailVerified ? (
                        <p style={styles.successNote}>
                          Email verified ✓
                        </p>
                      ) : !email.trim() ? (
                        <p style={styles.mutedNote}>
                          Add an email in the previous
                          step to verify it.
                        </p>
                      ) : !emailCodeSent ? (
                        <button
                          type="button"
                          onClick={sendEmailOtp}
                          disabled={emailLoading}
                          style={
                            styles.secondaryButton
                          }
                        >
                          {emailLoading
                            ? 'Sending…'
                            : 'Send email code'}
                        </button>
                      ) : (
                        <>
                          <input
                            style={inputStyle(
                              'emailCode',
                            )}
                            type="text"
                            inputMode="numeric"
                            placeholder="Email 6-digit code"
                            value={emailCode}
                            onChange={(e) =>
                              setEmailCode(
                                e.target.value,
                              )
                            }
                            onFocus={() =>
                              setFocused(
                                'emailCode',
                              )
                            }
                            onBlur={() =>
                              setFocused('')
                            }
                            maxLength={6}
                            disabled={emailLoading}
                          />

                          <div style={styles.buttonRow}>
                            <button
                              type="button"
                              onClick={sendEmailOtp}
                              disabled={emailLoading}
                              style={
                                styles.miniButtonMuted
                              }
                            >
                              Resend
                            </button>

                            <button
                              type="button"
                              onClick={
                                verifyEmailOtp
                              }
                              disabled={emailLoading}
                              style={styles.miniButton}
                            >
                              {emailLoading
                                ? 'Verifying…'
                                : 'Verify email'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={styles.verifyBottom}>
                    <button
                      type="submit"
                      style={styles.verifySubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        'Verifying…'
                      ) : (
                        <>
                          Verify &amp; Continue

                          <span style={styles.arrow}>
                            →
                          </span>
                        </>
                      )}
                    </button>

                    <div
                      style={styles.bottomResendRow}
                    >
                      <span
                        style={
                          styles.bottomResendText
                        }
                      >
                        Dont Receive Code ?
                      </span>

                      <button
                        type="button"
                        onClick={sendPhoneOtp}
                        disabled={loading}
                        style={
                          styles.bottomResendButton
                        }
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </>
          )}
        </section>

        <style jsx>{`
          input::placeholder {
            color: #656565;
            opacity: 1;
          }

          button {
            font-family: inherit;
          }

          @media (max-width: 760px) {
            .auth-modal-shell {
              width: min(
                430px,
                calc(100vw - 20px)
              ) !important;

              height: auto !important;
              min-height: 531px !important;

              grid-template-columns: 1fr !important;

              padding: 0 !important;
            }

            .auth-modal-left {
              display: none !important;
            }

            .auth-modal-right {
              min-height: 531px !important;

              padding: 34px 32px 28px !important;
            }
          }

          @media (max-width: 390px) {
            .auth-modal-right {
              padding: 30px 22px 24px !important;
            }
          }
        `}</style>
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

  padding: 16,

  background: 'rgba(255, 255, 255, 0.72)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
},

shell: {
  position: 'relative',

  width: 'min(820px, calc(100vw - 32px))',
  height: 531,
  maxHeight: 'calc(100vh - 32px)',

  transform: 'scale(1.07)',
  transformOrigin: 'center',

  display: 'grid',
  gridTemplateColumns: '424px minmax(0, 1fr)',
  columnGap: 32,

  boxSizing: 'border-box',
  padding: 34,

  overflow: 'hidden',

  background: '#000000',

  boxShadow:
    '0 30px 85px rgba(0,0,0,0.68)',

  fontFamily:
    'Arial, Helvetica, sans-serif',
},

  left: {
    position: 'relative',

    display: 'flex',
    alignItems: 'center',

    overflow: 'hidden',

    boxSizing: 'border-box',
    padding: '34px 29px',

    background:
      'radial-gradient(circle at 5% 5%, rgba(235,0,107,0.96) 0%, rgba(194,0,87,0.83) 27%, rgba(111,0,53,0.5) 56%, transparent 78%), linear-gradient(135deg, #af0052 0%, #76003a 46%, #3d001f 75%, #17000c 100%)',

    color: '#ffffff',
  },

  leftLight: {
    position: 'absolute',
    inset: 0,

    background:
      'linear-gradient(108deg, rgba(255,255,255,0.025), transparent 37%)',

    pointerEvents: 'none',
  },

  leftShade: {
    position: 'absolute',
    inset: 0,

    background:
      'radial-gradient(circle at 91% 53%, transparent 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.42) 100%)',

    pointerEvents: 'none',
  },

  leftContent: {
    position: 'relative',
    zIndex: 2,

    width: '100%',

    transform: 'translateY(20px)',
  },

  heroTitle: {
    margin: '0 0 18px',

    color: '#ffffff',

    fontSize: 34,
    lineHeight: 1.04,
    fontWeight: 700,
    letterSpacing: '-0.04em',
  },

  heroSub: {
    margin: 0,

    color: 'rgba(255,255,255,0.96)',

    fontSize: 12,
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
    gridTemplateColumns: '1fr 1fr',

    gap: 18,

    marginTop: 27,
  },

socialButton: {
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

  cursor: 'default',
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

    gap: 12,

    width: '100%',
  },

  nameGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',

    gap: 16,
  },

  field: {
    display: 'flex',
    flexDirection: 'column',

    gap: 6,

    width: '100%',
  },

  label: {
    color: 'rgba(255,255,255,0.92)',

    fontSize: 9,
    lineHeight: 1,
    fontWeight: 500,
  },

  optional: {
    color: 'rgba(255,255,255,0.56)',

    fontSize: 8,
    fontStyle: 'normal',
    fontWeight: 400,
  },

  submit: {
    width: '100%',
    height: 38,

    marginTop: 2,

    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 10,

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

  arrow: {
    fontSize: 18,
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

    marginTop: 69,
  },

  otpBoxes: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(6, minmax(0, 1fr))',

    gap: 8,
  },

  otpBox: {
    minWidth: 0,
    height: 50,

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
    minHeight: '100%',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    textAlign: 'center',
  },

  successCircle: {
    width: 64,
    height: 64,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 16,

    borderRadius: '50%',

    background: '#c50062',
    color: '#ffffff',

    fontSize: 30,
    fontWeight: 800,

    boxShadow:
      '0 16px 38px rgba(197,0,98,0.3)',
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
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',

    gap: 8,

    marginTop: 8,
  },

  miniButton: {
    height: 35,

    border: '1px solid #c50062',
    borderRadius: 5,

    background: '#c50062',
    color: '#ffffff',

    fontSize: 10,
    fontWeight: 600,

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
  },
}