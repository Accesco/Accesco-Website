'use client'

import { usePathname } from 'next/navigation'
import AuthModal from './AuthModal'
import { useAuth } from './AuthProvider'

<<<<<<< HEAD
const DEV_MODE = true; // true = Skip Login | false = Enable Login

=======
// Marketing/info pages stay crawlable and open to signed-out visitors.
// Everything else (the actual shopping/ordering app) stays behind the
// mandatory login wall below.
const PUBLIC_ROUTES = [
  '/about',
  '/contact',
  '/faq',
  '/careers',
  '/privacy',
  '/terms',
  '/refund',
  '/press',
  '/investor-relations',
  '/accesco-library',
  '/qtcvideos',
  '/blogs',
  '/partner',
]

function isPublicRoute(pathname) {
  if (pathname === '/') return true
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

// Site-wide login wall: no page content renders for a signed-out visitor
// on gated routes, only the mandatory (non-dismissible) AuthModal. Once
// signIn() runs the context updates and this re-renders with the real page.
>>>>>>> origin/main
export default function AuthGate({ children }) {
  const pathname = usePathname()
  const { user, loading, signIn } = useAuth()

<<<<<<< HEAD
=======
  if (isPublicRoute(pathname)) return children

  // Avoid a flash of the login gate while AuthProvider is still reading
  // localStorage on first mount.
>>>>>>> origin/main
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