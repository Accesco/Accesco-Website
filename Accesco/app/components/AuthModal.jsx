'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { db, auth } from '../../lib/firebase'
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'
import {
  sendOtpEmailVerification,
  verifyOtpEmailCode,
} from '../../lib/waitlistService'
import {
  initializeReferralProfile,
  getPendingReferral,
  markReferralVisitConsumed,
  isValidReferralCodeFormat,
  normalizeReferralCode,
  validateReferralCode,
} from '../../lib/referralService'

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

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  mandatory = false,
}) {
  if (!isOpen) return null

  return (
    <AuthModalContent
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onSuccess}
      mandatory={mandatory}
    />
  )
}

function AuthModalContent({
  isOpen,
  onClose,
  onSuccess,
  mandatory,
}) {
  const [name, setName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  
  const [referralCode, setReferralCode] = useState('')
  const [referralPrefilled, setReferralPrefilled] = useState(false)
  const [referralVisitUid, setReferralVisitUid] = useState(null)
  const [referralStatus, setReferralStatus] = useState({ state: 'idle' })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [focused, setFocused] = useState('')

  const [step, setStep] = useState('details')
  const [otpCode, setOtpCode] = useState('')
  const [phoneCodeSent, setPhoneCodeSent] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  const recaptchaVerifierRef = useRef(null)
  const recaptchaHostRef = useRef(null)
  const recaptchaContainerIdRef = useRef(`am-recaptcha-${Date.now()}`)

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    if (mandatory) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mandatory])

  // Load referral from `?ref=CODE` link visit
  useEffect(() => {
    let cancelled = false

    getPendingReferral().then((pending) => {
      if (cancelled || !pending) return

      setReferralCode(pending.code)
      setReferralPrefilled(true)
      setReferralVisitUid(pending.visitUid)
    })

    return () => {
      cancelled = true
    }
  }, [])

  // Live validation of typed referral code
  useEffect(() => {
    const code = referralCode.trim()

    if (!code) {
      setReferralStatus({ state: 'idle' })
      return undefined
    }

    if (!isValidReferralCodeFormat(code)) {
      setReferralStatus({ state: 'invalid' })
      return undefined
    }

    setReferralStatus({ state: 'checking' })

    let cancelled = false

    const timeout = setTimeout(async () => {
      const result = await validateReferralCode(code)
      if (cancelled) return

      if (result.valid === null) {
        setReferralStatus({ state: 'unknown' })
      } else if (result.valid) {
        setReferralStatus({
          state: 'valid',
          referrerName: result.isMarketing
            ? null
            : result.referrerName || null,
        })
      } else {
        setReferralStatus({ state: 'invalid' })
      }
    }, 450)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [referralCode])

  // Timer cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return undefined

    const timeout = setTimeout(
      () => setResendCooldown((s) => s - 1),
      1000,
    )

    return () => clearTimeout(timeout)
  }, [resendCooldown])

  // Social sign-in
  const [googleLoading, setGoogleLoading] = useState(false)
  const [pendingSocialUser, setPendingSocialUser] = useState(null)

  // Optional email verification state
  const [emailCode, setEmailCode] = useState('')
  const [emailCodeSent, setEmailCodeSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  const clearRecaptcha = useCallback(() => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear()
      } catch (err) {
        console.error('reCAPTCHA clear failed:', err)
      }
      recaptchaVerifierRef.current = null
    }

    if (recaptchaHostRef.current) {
      recaptchaHostRef.current.innerHTML = ''
      const newId = `am-recaptcha-${Date.now()}`
      const fresh = document.createElement('div')
      fresh.id = newId
      recaptchaHostRef.current.appendChild(fresh)
      recaptchaContainerIdRef.current = newId
    }
  }, [])

  const reset = useCallback(() => {
    setName('')
    setFirstName('')
    setLastName('')
    setPhone('')
    setEmail('')
    setReferralCode('')
    setReferralPrefilled(false)
    setReferralVisitUid(null)
    setReferralStatus({ state: 'idle' })

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

    clearRecaptcha()
  }, [clearRecaptcha])

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [reset, onClose])

  const handleFirstNameChange = (value) => {
    setFirstName(value)
    setName(`${value} ${lastName}`.trim())
  }

  const handleLastNameChange = (value) => {
    setLastName(value)
    setName(`${firstName} ${value}`.trim())
  }

  const normalizePhone = (p) => {
    const stripped = p.replace(/[\s\-().]/g, '')
    if (stripped.startsWith('+')) {
      return stripped
    }
    return '+91' + stripped.replace(/\D/g, '')
  }

  const validateReferralBeforeSubmit = async () => {
    const code = referralCode.trim().toUpperCase()

    if (!code) return null

    if (!isValidReferralCodeFormat(code)) {
      return 'Referral code should be 4-20 letters or numbers, e.g. ACCLAUNCH'
    }

    if (referralStatus.state === 'valid') return null

    const result = await validateReferralCode(code)

    if (result.valid === null) {
      setReferralStatus({ state: 'unknown' })
      return null
    }

    if (!result.valid) {
      setReferralStatus({ state: 'invalid' })
      return `You're using a wrong referral code — "${code}" doesn't exist. Please check it, or leave the field blank.`
    }

    setReferralStatus({
      state: 'valid',
      referrerName: result.isMarketing
        ? null
        : result.referrerName || null,
    })

    return null
  }

  const sendPhoneOtp = async () => {
    if (loading) return

    setLoading(true)
    setError('')

    try {
      clearRecaptcha()

      const verifier = new RecaptchaVerifier(
        auth,
        recaptchaContainerIdRef.current,
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
      setResendCooldown(45)
    } catch (err) {
      console.error('Phone OTP send failed:', err)
      clearRecaptcha()
      setError(
        err.message ||
          'Failed to send OTP. Check your phone number and try again.',
      )
    } finally {
      setLoading(false)
    }
  }

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
      return setError('Enter a valid phone number with country code')
    }

    const docId = p.replace(/[^\d]/g, '')
    if (docId.length < 7) {
      return setError('Enter a valid phone number including digits')
    }

    if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      return setError('Enter a valid email address')
    }

    const referralError = await validateReferralBeforeSubmit()
    if (referralError) {
      return setError(referralError)
    }

    setStep('verify')

    if (!phoneCodeSent) {
      sendPhoneOtp()
    }
  }

  const completeVerifiedSocialUser = async (existing, firebaseUser) => {
    const user = {
      name: existing.name || firebaseUser.displayName || 'Accesco User',
      phone: existing.phone || firebaseUser.phoneNumber || null,
      email: existing.email || firebaseUser.email || null,
      photoURL: existing.photoURL || firebaseUser.photoURL || null,
      uid: firebaseUser.uid,
    }

    localStorage.setItem('accesco_user', JSON.stringify(user))
    setName(user.name)
    setSuccess(true)

    setTimeout(() => {
      onSuccess && onSuccess(user)
      handleClose()
    }, 1300)
  }

  const handleSocialAuthResult = async (firebaseUser, provider) => {
    const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
    const existing = snap.exists() ? snap.data() : null

    if (existing?.phoneVerified) {
      await completeVerifiedSocialUser(existing, firebaseUser)
      return
    }

    setPendingSocialUser({
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || '',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || null,
      provider,
    })

    setName(firebaseUser.displayName || '')
    setEmail(firebaseUser.email || '')
    setPhone('')
    setPhoneCodeSent(false)
    setConfirmationResult(null)
    setStep('social-phone')
  }

  const isPopupDismissed = (err) =>
    err.code === 'auth/popup-closed-by-user' ||
    err.code === 'auth/cancelled-popup-request'

  const handleGoogleSignIn = async () => {
    if (googleLoading) return

    setGoogleLoading(true)
    setError('')

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      await handleSocialAuthResult(result.user, 'google')
    } catch (err) {
      console.error('Google sign-in failed:', err)
      if (!isPopupDismissed(err)) {
        setError(err.message || 'Google sign-in failed. Please try again.')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleSocialPhoneSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const p = phone.trim()
    if (!p) return setError('Please enter your phone number')

    if (!/^[+\d\s\-()]{7,20}$/.test(p)) {
      return setError('Enter a valid phone number with country code')
    }

    const docId = p.replace(/[^\d]/g, '')
    if (docId.length < 7) {
      return setError('Enter a valid phone number including digits')
    }

    const referralError = await validateReferralBeforeSubmit()
    if (referralError) {
      return setError(referralError)
    }

    setStep('verify')

    if (!phoneCodeSent) {
      sendPhoneOtp()
    }
  }

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
      setError(err.message || 'Failed to send email code')
    } finally {
      setEmailLoading(false)
    }
  }

  const verifyEmailOtp = async () => {
    if (!/^\d{6}$/.test(emailCode.trim())) {
      setError('Please enter a valid 6-digit email code.')
      return
    }

    setEmailLoading(true)
    setError('')

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

  const handleVerifySubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!confirmationResult) {
      setError('Code is still being sent. Please wait a moment.')
      return
    }

    if (!/^\d{6}$/.test(otpCode.trim())) {
      setError('Please enter a valid 6-digit OTP.')
      return
    }

    setLoading(true)

    try {
      await confirmationResult.confirm(otpCode.trim())

      const p = phone.trim()
      const n = pendingSocialUser
        ? pendingSocialUser.name || name.trim() || 'Accesco User'
        : name.trim()
      const em = pendingSocialUser
        ? pendingSocialUser.email || email.trim()
        : email.trim()
      const docId = pendingSocialUser
        ? pendingSocialUser.uid
        : p.replace(/[^\d]/g, '')

      await setDoc(
        doc(db, 'users', docId),
        {
          name: n,
          phone: p,
          email: em || null,
          photoURL: pendingSocialUser?.photoURL || null,
          provider: pendingSocialUser?.provider || 'phone',
          phoneVerified: true,
          emailVerified,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      try {
        const appliedCode = normalizeReferralCode(referralCode)
        await initializeReferralProfile(p, n, appliedCode)

        if (appliedCode && referralVisitUid) {
          await markReferralVisitConsumed(referralVisitUid, p)
        }
      } catch (err) {
        console.error('Referral profile init failed:', err)
      }

      const user = {
        name: n,
        phone: p,
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
      if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP. Please check the code and try again.')
      } else if (err.code === 'auth/code-expired') {
        setError('OTP has expired. Please request a new one.')
      } else {
        setError('Something went wrong. Please try again.')
      }
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

  const getInputStyle = (field) => ({
    width: '100%',
    height: 35,
    boxSizing: 'border-box',
    padding: '0 11px',
    border: focused === field ? '1px solid #c50062' : '1px solid #d8d8d8',
    borderRadius: 5,
    outline: 'none',
    background: focused === field ? '#ffffff' : '#f7f7f7',
    color: '#1a1a1a',
    fontFamily: 'inherit',
    fontSize: 10,
    fontWeight: 400,
    boxShadow: focused === field ? '0 0 0 2px rgba(197,0,98,0.12)' : 'none',
    transition: '150ms ease',
  })

  const referralInputStyle = () => {
    const base = {
      ...getInputStyle('referralCode'),
      textTransform: 'uppercase',
    }

    if (referralStatus.state === 'invalid') {
      return {
        ...base,
        border: '1px solid #c50062',
        background: 'rgba(197,0,98,0.05)',
      }
    }

    if (referralStatus.state === 'valid') {
      return { ...base, border: '1px solid #16a34a' }
    }

    return base
  }

  const renderReferralNote = () => {
    if (referralStatus.state === 'checking') {
      return <span style={styles.referralNoteMuted}>Checking code…</span>
    }

    if (referralStatus.state === 'invalid') {
      return (
        <span style={styles.referralNoteError}>
          Wrong referral code — check it, or leave this blank
        </span>
      )
    }

    if (referralStatus.state === 'valid') {
      return (
        <span style={styles.referralNoteValid}>
          {referralStatus.referrerName
            ? `Valid code — invited by ${referralStatus.referrerName} ✓`
            : 'Referral code applied ✓'}
        </span>
      )
    }

    if (referralStatus.state === 'unknown') {
      return (
        <span style={styles.referralNoteMuted}>
          Could not verify right now — you can continue
        </span>
      )
    }

    if (referralPrefilled) {
      return <span style={styles.referralNote}>Applied from your invite link</span>
    }

    return null
  }

  return (
    <div
      style={styles.backdrop}
      onClick={mandatory ? undefined : handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Account Authentication"
    >
      <div
        className="auth-modal-shell"
        style={styles.shell}
        onClick={(e) => e.stopPropagation()}
      >
        {!mandatory && (
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close authentication modal"
            style={styles.closeButton}
          >
            ✕
          </button>
        )}

        <section className="auth-modal-left" style={styles.left}>
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
                  One Ecosystem. Endless Possibilities.
                  <br />
                  Join Accesco Living and Experience
                  <br />a smarter way to live and shop
                </p>
              </>
            ) : step === 'social-phone' ? (
              <>
                <h2 style={styles.heroTitle}>
                  Verify Your
                  <br />
                  Phone Number
                </h2>
                <p style={styles.heroSub}>
                  Add Your Mobile Number to
                  <br />
                  Secure and Complete your Account
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

        <section className="auth-modal-right" style={styles.right}>
          {success ? (
            <div style={styles.success}>
              <div style={styles.successCircle}>✓</div>
              <h3 style={styles.successTitle}>You&apos;re in!</h3>
              <p style={styles.successText}>
                Welcome to Accesco, {name.split(' ')[0]}.
              </p>
            </div>
          ) : (
            <>
              {/* React Ref Managed Host for Invisible reCAPTCHA */}
              <div ref={recaptchaHostRef} id="am-recaptcha-host" />

              {step === 'details' ? (
                <div style={styles.detailsScreen}>
                  <header style={styles.signupHeader}>
                    <h2 style={styles.signupTitle}>Sign Up Account</h2>
                    <p style={styles.signupSubtitle}>
                      Enter Your Personal Data to Create your Account
                    </p>
                  </header>

                  <div style={styles.socialRow}>
                    <button
                      type="button"
                      style={styles.socialButtonFull}
                      onClick={handleGoogleSignIn}
                      disabled={googleLoading || loading}
                    >
                      <GoogleIcon />
                      <span>
                        {googleLoading ? 'Signing in…' : 'Continue with Google'}
                      </span>
                    </button>
                  </div>

                  <div style={styles.divider}>
                    <span style={styles.dividerLine} />
                    <span style={styles.dividerText}>Or</span>
                    <span style={styles.dividerLine} />
                  </div>

                  {error && <div style={styles.error}>{error}</div>}

                  <form onSubmit={handleDetailsSubmit} style={styles.detailsForm}>
                    <div style={styles.nameGrid}>
                      <div style={styles.field}>
                        <label style={styles.label}>First Name</label>
                        <input
                          style={getInputStyle('firstName')}
                          type="text"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => handleFirstNameChange(e.target.value)}
                          onFocus={() => setFocused('firstName')}
                          onBlur={() => setFocused('')}
                          disabled={loading}
                          autoFocus
                        />
                      </div>

                      <div style={styles.field}>
                        <label style={styles.label}>Last Name</label>
                        <input
                          style={getInputStyle('lastName')}
                          type="text"
                          placeholder="Francisco"
                          value={lastName}
                          onChange={(e) => handleLastNameChange(e.target.value)}
                          onFocus={() => setFocused('lastName')}
                          onBlur={() => setFocused('')}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Mobile Number</label>
                      <input
                        style={getInputStyle('phone')}
                        type="tel"
                        placeholder="eg. 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onFocus={() => setFocused('phone')}
                        onBlur={() => setFocused('')}
                        disabled={loading}
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>
                        Email <em style={styles.optional}>(Optional)</em>
                      </label>
                      <input
                        style={getInputStyle('email')}
                        type="email"
                        placeholder="eg.Johnfranc@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused('')}
                        disabled={loading}
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>
                        Referral Code <em style={styles.optional}>(Optional)</em>
                      </label>
                      <input
                        style={referralInputStyle()}
                        type="text"
                        placeholder="eg. ACCLAUNCH"
                        value={referralCode}
                        onChange={(e) =>
                          setReferralCode(e.target.value.toUpperCase())
                        }
                        onFocus={() => setFocused('referralCode')}
                        onBlur={() => setFocused('')}
                        maxLength={20}
                        disabled={loading}
                        autoComplete="off"
                      />
                      {renderReferralNote()}
                    </div>

                    <button
                      type="submit"
                      style={styles.submit}
                      disabled={loading}
                    >
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                      {!loading && <span style={styles.arrow}>→</span>}
                    </button>
                  </form>
                </div>
              ) : step === 'social-phone' ? (
                <div style={styles.detailsScreen}>
                  <header style={styles.signupHeader}>
                    <h2 style={styles.signupTitle}>Verify Your Phone</h2>
                    <p style={styles.signupSubtitle}>
                      {pendingSocialUser?.name
                        ? `Hi ${pendingSocialUser.name.split(' ')[0]}, add`
                        : 'Add'}{' '}
                      your mobile number to finish setting up your account
                    </p>
                  </header>

                  {error && <div style={styles.error}>{error}</div>}

                  <form onSubmit={handleSocialPhoneSubmit} style={styles.detailsForm}>
                    <div style={styles.field}>
                      <label style={styles.label}>Mobile Number</label>
                      <input
                        style={getInputStyle('phone')}
                        type="tel"
                        placeholder="eg. 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onFocus={() => setFocused('phone')}
                        onBlur={() => setFocused('')}
                        disabled={loading}
                        autoFocus
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>
                        Referral Code <em style={styles.optional}>(Optional)</em>
                      </label>
                      <input
                        style={referralInputStyle()}
                        type="text"
                        placeholder="eg. ACCLAUNCH"
                        value={referralCode}
                        onChange={(e) =>
                          setReferralCode(e.target.value.toUpperCase())
                        }
                        onFocus={() => setFocused('referralCode')}
                        onBlur={() => setFocused('')}
                        maxLength={20}
                        disabled={loading}
                        autoComplete="off"
                      />
                      {renderReferralNote()}
                    </div>

                    <button
                      type="submit"
                      style={styles.submit}
                      disabled={loading}
                    >
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                      {!loading && <span style={styles.arrow}>→</span>}
                    </button>
                  </form>
                </div>
              ) : (
                <form onSubmit={handleVerifySubmit} style={styles.verifyForm}>
                  <div>
                    <header style={styles.verifyHeader}>
                      <h2 style={styles.verifyTitle}>OTP Authentication</h2>
                      <p style={styles.verifySubtitle}>
                        We have Sent a 6 digit OTP to
                      </p>

                      <div style={styles.phoneRow}>
                        <span style={styles.phoneText}>{phone}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setStep(
                              pendingSocialUser ? 'social-phone' : 'details',
                            )
                            setError('')
                          }}
                          disabled={loading}
                          style={styles.changeButton}
                        >
                          Change
                        </button>
                      </div>
                    </header>

                    {error && <div style={styles.verifyError}>{error}</div>}

                    <div style={styles.otpInputArea}>
                      <div style={styles.otpBoxes} aria-hidden="true">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <span
                            key={index}
                            style={{
                              ...styles.otpBox,
                              ...(focused === 'otp' &&
                              index === Math.min(otpCode.length, 5)
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
                        aria-label="Enter 6-digit OTP code"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        onFocus={() => setFocused('otp')}
                        onBlur={() => setFocused('')}
                        maxLength={6}
                        disabled={loading}
                        autoFocus
                      />
                    </div>

                    {resendCooldown > 0 && (
                      <div style={styles.resendTimer}>
                        <span style={styles.clockIcon}>◷</span>
                        <span style={styles.resendText}>Resend OTP in</span>
                        <span style={styles.timerValue}>
                          {formatCooldown(resendCooldown)}
                        </span>
                      </div>
                    )}
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
                          <span style={styles.arrow}>→</span>
                        </>
                      )}
                    </button>

                    <div style={styles.bottomResendRow}>
                      <span style={styles.bottomResendText}>
                        Dont Receive Code ?
                      </span>
                      <button
                        type="button"
                        onClick={sendPhoneOtp}
                        disabled={loading || resendCooldown > 0}
                        style={styles.bottomResendButton}
                      >
                        {resendCooldown > 0
                          ? `Resend OTP (${formatCooldown(resendCooldown)})`
                          : 'Resend OTP'}
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
              width: min(430px, calc(100vw - 20px)) !important;
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
    boxShadow: '0 30px 85px rgba(0,0,0,0.68)',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },

  closeButton: {
    position: 'absolute',
    top: 14,
    left: 14,
    zIndex: 10,
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.35)',
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 1,
    cursor: 'pointer',
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
    padding: '27px 24px 8px 24px',
    overflowY: 'auto',
    background: '#ffffff',
    color: '#1a1a1a',
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
    color: '#1a1a1a',
    fontSize: 25,
    lineHeight: 1.12,
    fontWeight: 700,
    letterSpacing: '-0.025em',
  },

  signupSubtitle: {
    margin: '8px 0 0',
    color: 'rgba(26,26,26,0.72)',
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
    border: '1px solid #d8d8d8',
    borderRadius: 5,
    background: '#ffffff',
    color: '#1a1a1a',
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
    background: '#e2e2e2',
  },

  dividerText: {
    color: 'rgba(26,26,26,0.5)',
    fontSize: 7,
    lineHeight: 1,
  },

  error: {
    margin: '0 0 10px',
    padding: '6px 8px',
    border: '1px solid rgba(197,0,98,0.3)',
    borderRadius: 4,
    background: 'rgba(197,0,98,0.08)',
    color: '#c50062',
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
    color: 'rgba(26,26,26,0.85)',
    fontSize: 9,
    lineHeight: 1,
    fontWeight: 500,
  },

  optional: {
    color: 'rgba(26,26,26,0.45)',
    fontSize: 8,
    fontStyle: 'normal',
    fontWeight: 400,
  },

  referralNote: {
    color: '#cf0066',
    fontSize: 8,
    lineHeight: 1.2,
    fontWeight: 500,
  },

  referralNoteMuted: {
    color: 'rgba(26,26,26,0.5)',
    fontSize: 8,
    lineHeight: 1.2,
    fontWeight: 500,
  },

  referralNoteError: {
    color: '#c50062',
    fontSize: 8,
    lineHeight: 1.2,
    fontWeight: 600,
  },

  referralNoteValid: {
    color: '#16a34a',
    fontSize: 8,
    lineHeight: 1.2,
    fontWeight: 600,
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
    color: '#1a1a1a',
    fontSize: 26,
    lineHeight: 1.1,
    fontWeight: 700,
    letterSpacing: '-0.025em',
  },

  verifySubtitle: {
    margin: '13px 0 0',
    color: 'rgba(26,26,26,0.6)',
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
    background: 'rgba(197,0,98,0.08)',
    color: '#c50062',
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
    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
    gap: 8,
  },

  otpBox: {
    minWidth: 0,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    border: '1px solid #d8d8d8',
    borderRadius: 5,
    background: '#f7f7f7',
    color: '#1a1a1a',
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
    color: 'rgba(26,26,26,0.55)',
  },

  timerValue: {
    color: '#cf0066',
    fontWeight: 600,
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
    color: 'rgba(26,26,26,0.55)',
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
    boxShadow: '0 16px 38px rgba(197,0,98,0.3)',
  },

  successTitle: {
    margin: '0 0 7px',
    color: '#1a1a1a',
    fontSize: 25,
    fontWeight: 700,
  },

  successText: {
    margin: 0,
    color: 'rgba(26,26,26,0.68)',
    fontSize: 11,
  },
}