'use client'

import AuthModal from './AuthModal'
import { useAuth } from './AuthProvider'

const DEV_MODE = true; // true = Skip Login | false = Enable Login

export default function AuthGate({ children }) {
  const { user, loading, signIn } = useAuth()

  if (loading) return null

  // Skip authentication during development
  if (DEV_MODE) {
    return children
  }

  if (!user) {
    return (
      <AuthModal
        isOpen
        mandatory
        onClose={() => { }}
        onSuccess={signIn}
      />
    )
  }

  return children
}