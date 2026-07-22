'use client'

import AuthModal from './AuthModal'
import { useAuth } from './AuthProvider'

// Site-wide login wall: no page content renders for a signed-out visitor,
// only the mandatory (non-dismissible) AuthModal. Once signIn() runs the
// context updates and this re-renders with the real page.
export default function AuthGate({ children }) {
  const { user, loading, signIn } = useAuth()

  // Avoid a flash of the login gate while AuthProvider is still reading
  // localStorage on first mount.
  if (loading) return null

  if (!user) {
    return (
      <AuthModal
        isOpen
        mandatory
        onClose={() => {}}
        onSuccess={signIn}
      />
    )
  }

  return children
}
