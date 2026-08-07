'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../../lib/firebase'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context == null) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore user from localStorage on mount
    try {
      const saved = localStorage.getItem('accesco_user')
      if (saved) setUser(JSON.parse(saved))
    } catch (_) {}
    setLoading(false)

    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser)
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
    localStorage.removeItem('accesco_user')
    setUser(null)
    try {
      await firebaseSignOut(auth)
    } catch (e) {
      console.error('Error signing out of Firebase:', e)
    }
  }

  // Called after successful login; keep localStorage in sync with React state
  const signIn = (userData) => {
    try {
      localStorage.setItem('accesco_user', JSON.stringify(userData))
    } catch (_) {}
    setUser(userData)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signIn, getIdToken }}>
      {children}
    </AuthContext.Provider>
  )
}
