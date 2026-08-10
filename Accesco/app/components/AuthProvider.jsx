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

// Mirrors the docId convention used in AuthModal: accounts that signed in
// via Google (with or without a linked phone) are keyed by their Firebase
// Auth uid, while phone-only accounts are keyed by their phone digits.
function resolveUserDocId(firebaseUser) {
  const isGoogleLinked = firebaseUser.providerData.some(
    (p) => p.providerId === 'google.com',
  )

  if (isGoogleLinked) return firebaseUser.uid
  if (firebaseUser.phoneNumber) return firebaseUser.phoneNumber.replace(/\D/g, '')
  return firebaseUser.uid
}

async function loadUserProfile(firebaseUser) {
  const docId = resolveUserDocId(firebaseUser)

  let profile = null
  try {
    const snap = await getDoc(doc(db, 'users', docId))
    profile = snap.exists() ? snap.data() : null
  } catch (e) {
    console.error('Error loading user profile from Firestore:', e)
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
