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
    setName('')
    setPhone('')
    setEmail('')
    setError('')
    setSuccess(false)
    setFocused('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async (e) => {
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

    setLoading(true)

    try {
      await setDoc(
        doc(db, 'users', docId),
        {
          name: n,
          phone: p,
          email: em || null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      const user = { name: n, phone: p, email: em || null, uid: docId }

      localStorage.setItem('accesco_user', JSON.stringify(user))

      setSuccess(true)

      setTimeout(() => {
        onSuccess && onSuccess(user)
        handleClose()
      }, 1300)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

const inputStyle = (field) => ({
  width: '100%',
  height: 54,
  borderRadius: 13,
  border:
    focused === field
      ? '1px solid rgba(255,255,255,0.58)'
      : '1px solid rgba(255,255,255,0.24)',
  outline: 'none',
  padding: '0 20px',

  background:
    focused === field
      ? 'rgba(96, 0, 48, 0.34)'
      : 'rgba(40, 0, 24, 0.28)',

  color: '#ffffff',
  fontSize: 15.5,
  fontWeight: 400,
  fontFamily: 'inherit',
  letterSpacing: '-0.01em',

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
              <div style={styles.header}>
                <h2 style={styles.title}>Welcome!</h2>
                <p style={styles.subtitle}>
                  No password needed — just your details.
                </p>
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <form onSubmit={handleSubmit} style={styles.form}>
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
                  {loading ? (
                    'Saving…'
                  ) : (
                    <>
                      Continue <span style={styles.arrow}>→</span>
                    </>
                  )}
                </button>
              </form>

              <p style={styles.privacy}>
                <span>▣</span>
                Your data is stored securely in Firebase and never shared.
              </p>
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
    fontWeight: 900,
    letterSpacing: '-0.065em',
    textShadow: '0 10px 30px rgba(0,0,0,0.24)',
  },

  heroSub: {
    margin: '26px 0',
    color: 'rgba(255,255,255,0.72)',
    fontSize: 16,
    lineHeight: 1.62,
    letterSpacing: '-0.02em',
  },

  features: {
    width: 298,
    paddingTop: 24,
    borderTop: '1px solid rgba(255,255,255,0.14)',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },

  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    color: 'rgba(255,255,255,0.70)',
    fontSize: 16,
    fontWeight: 500,
  },

  featureIcon: {
    width: 22,
    height: 22,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.56)',
    fontSize: 18,
  },

card: {
  position: 'relative',
  zIndex: 4,
  alignSelf: 'center',
  justifySelf: 'start',
  width: 498,
  minHeight: 604,
  padding: '42px 38px 24px',
  borderRadius: 30,
  overflow: 'hidden',

  // DARK MAROON GLASSMORPHISM
  background:
    'linear-gradient(145deg, rgba(90,0,48,0.34), rgba(24,0,16,0.24) 48%, rgba(72,0,42,0.28)), rgba(36,0,22,0.22)',

  border: '1px solid rgba(255,255,255,0.25)',

  boxShadow:
    '0 32px 90px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.06), inset 0 0 70px rgba(255,255,255,0.025)',

  backdropFilter: 'blur(36px) saturate(165%)',
  WebkitBackdropFilter: 'blur(36px) saturate(165%)',

  color: '#ffffff',
},

cardShine: {
  position: 'absolute',
  inset: 0,
  background:
    'radial-gradient(circle at 18% 10%, rgba(255,255,255,0.10), transparent 30%), radial-gradient(circle at 92% 16%, rgba(112,0,62,0.28), transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01) 45%, transparent)',
  pointerEvents: 'none',
},

  header: {
    position: 'relative',
    zIndex: 2,
    marginBottom: 32,
  },

  title: {
    margin: '0 0 12px',
    color: '#fff',
    fontSize: 39,
    lineHeight: 1,
    fontWeight: 700,
    letterSpacing: '-0.055em',
  },

  subtitle: {
    margin: 0,
    color: 'rgba(255,255,255,0.66)',
    fontSize: 16,
    lineHeight: 1.35,
    fontweight: 400,
  },

  error: {
    position: 'relative',
    zIndex: 2,
    margin: '-12px 0 20px',
    padding: '12px 14px',
    borderRadius: 12,
    color: '#fff',
    background: 'rgba(255,255,255,0.10)',
    border: '1px solid rgba(255,255,255,0.18)',
    fontSize: 13,
    fontWeight: 650,
  },

  form: {
    position: 'relative',
    zIndex: 2,
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
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    lineHeight: 1,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },

  required: {
    color: '#fff',
  },

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
    fontweight :400,
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

  privacy: {
    position: 'relative',
    zIndex: 2,
    margin: '21px 0 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    color: 'rgba(255,255,255,0.42)',
    fontSize: 12,
    lineHeight: 1.35,
    textAlign: 'center',
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
    margin: '0 0 8px',
    color: '#fff',
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: '-0.04em',
  },

  successText: {
    margin: 0,
    color: 'rgba(255,255,255,0.68)',
    fontSize: 16,
  },
}