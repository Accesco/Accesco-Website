'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BellRing } from 'lucide-react'
import { isWaitlistRegistered } from '../../lib/waitlistService'
import { useAuth } from './AuthProvider'

export default function WaitlistGate({ children }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [status, setStatus] = useState(
    process.env.NODE_ENV === 'development'
      ? 'allowed'
      : 'checking'
  )

  useEffect(() => {
    // Allow all service pages when previewing locally with npm run dev.
    if (process.env.NODE_ENV === 'development') {
      setStatus('allowed')
      return
    }

    // Wait for the Firebase auth check to resolve before deciding.
    if (authLoading) return

    let cancelled = false
    let timeout

    isWaitlistRegistered({ phone: user?.phone, email: user?.email }).then((registered) => {
      if (cancelled) return

      if (registered) {
        setStatus('allowed')
        return
      }

      setStatus('blocked')

      timeout = setTimeout(() => {
        router.push('/#waitlist')
      }, 2200)
    })

    return () => {
      cancelled = true

      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [router, authLoading, user])

  if (status === 'blocked') {
    return (
      <WaitlistPrompt
        onGoNow={() => router.push('/#waitlist')}
      />
    )
  }

  return children
}

function WaitlistPrompt({ onGoNow }) {
  return (
    <div style={styles.backdrop}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>
          <BellRing
            size={28}
            color="#ffffff"
            strokeWidth={2.2}
          />
        </div>

        <h2 style={styles.title}>
          Join the Waitlist First
        </h2>

        <p style={styles.message}>
          Please register on our waitlist to explore our services.
        </p>

        <p style={styles.subtext}>
          Taking you there now…
        </p>

        <button
          type="button"
          style={styles.button}
          onClick={onGoNow}
        >
          Go to Waitlist
        </button>
      </div>

      <style jsx>{`
        @keyframes waitlistPromptIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 20000,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    padding: 20,

    background:
      'radial-gradient(circle at 50% 0%, rgba(197,0,98,0.16), transparent 60%), rgba(10,10,12,0.92)',

    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
  },

  card: {
    width: '100%',
    maxWidth: 380,

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',

    padding: '36px 30px 30px',
    boxSizing: 'border-box',

    background: '#ffffff',
    borderRadius: 16,
    boxShadow: '0 30px 70px rgba(0,0,0,0.45)',

    animation: 'waitlistPromptIn 260ms ease',

    fontFamily: 'Arial, Helvetica, sans-serif',
  },

  iconCircle: {
    width: 56,
    height: 56,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 18,
    borderRadius: '50%',

    background:
      'linear-gradient(135deg, #eb006b 0%, #af0052 55%, #6f0035 100%)',

    boxShadow: '0 12px 26px rgba(197,0,98,0.35)',
  },

  title: {
    margin: '0 0 10px',
    color: '#1a1a1a',
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },

  message: {
    margin: '0 0 6px',
    color: 'rgba(26,26,26,0.75)',
    fontSize: 13.5,
    lineHeight: 1.5,
    fontWeight: 500,
  },

  subtext: {
    margin: '0 0 22px',
    color: 'rgba(26,26,26,0.4)',
    fontSize: 11.5,
    fontStyle: 'italic',
  },

  button: {
    width: '100%',
    height: 42,

    border: '1px solid #c50062',
    borderRadius: 8,

    background: '#c50062',
    color: '#ffffff',

    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: 700,

    cursor: 'pointer',
  },
}