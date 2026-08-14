'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../../lib/firebase'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context == null) throw new Error('useAuth must be used within AuthProvider')
  return context
}

async function getUserDoc(docId) {
  try {
    const snap = await getDoc(doc(db, 'users', docId))
    return snap.exists() ? snap.data() : null
  } catch (e) {
    console.error('Error loading user profile from Firestore:', e)
    return null
  }
}

// Mirrors the docId convention used in AuthModal: accounts that signed in
// via Google (with or without a linked phone) are keyed by their Firebase
// Auth uid. Phone-only accounts are keyed by their normalized E.164 digits,
// but accounts created before AuthModal normalized the docId are keyed on the
// bare digits typed at signup — usually 10, without the +91 country code — so
// both forms are tried before giving up. api/_lib/auth.js accepts either form
// as the x-user-id header for the same reason.
async function loadUserProfile(firebaseUser) {
  const isGoogleLinked = firebaseUser.providerData.some(
    (p) => p.providerId === 'google.com',
  )

  let docId = firebaseUser.uid
  let profile = null

  if (isGoogleLinked) {
    profile = await getUserDoc(docId)
  } else if (firebaseUser.phoneNumber) {
    const fullDigits = firebaseUser.phoneNumber.replace(/\D/g, '')
    const last10 = fullDigits.slice(-10)

    docId = fullDigits
    profile = await getUserDoc(fullDigits)

    if (!profile && last10 !== fullDigits) {
      profile = await getUserDoc(last10)
      if (profile) docId = last10
    }
  } else {
    profile = await getUserDoc(docId)
  }

  // Phone verification is mandatory. If the Firestore profile doesn't exist
  // yet, or exists but phoneVerified is not true, treat the Firebase Auth
  // session as incomplete — AuthModal will handle the phone+OTP step.
  if (!profile?.phoneVerified) {
    return null
  }

  return {
    uid: docId,
    name: profile?.name || firebaseUser.displayName || 'Accesco User',
    phone: profile?.phone || firebaseUser.phoneNumber || null,
    email: profile?.email || firebaseUser.email || null,
    photoURL: profile?.photoURL || firebaseUser.photoURL || null,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Firebase Auth (and Firestore for the profile) is the single source of
    // truth for who's logged in — no local caching of the session.
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser)

      if (!currentUser) {
        setUser(null)
        setLoading(false)
        return
      }

      const profile = await loadUserProfile(currentUser)
      // profile is null when phone verification is not yet complete.
      // Keep user=null so AuthGate stays open and AuthModal handles the
      // phone+OTP step. setLoading(false) still runs so the modal renders.
      setUser(profile)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const getIdToken = async () => {
    if (firebaseUser) {
      try {
        return await firebaseUser.getIdToken()
      } catch (e) {
        console.error('Error getting Firebase ID token:', e)
        return null
      }
    }
    return null
  }

  const signOut = async () => {
    setUser(null)
    try {
      await firebaseSignOut(auth)
    } catch (e) {
      console.error('Error signing out of Firebase:', e)
    }
  }

  // Called right after successful login/signup for an immediate UI update;
  // onAuthStateChanged will follow up with the authoritative Firestore profile.
  const signIn = (userData) => {
    setUser(userData)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signIn, getIdToken }}>
      {children}
    </AuthContext.Provider>
  )
}
