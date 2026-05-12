'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context == null) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore user from localStorage on mount
    try {
      const saved = localStorage.getItem('accesco_user')
      if (saved) setUser(JSON.parse(saved))
    } catch (_) {}
    setLoading(false)
  }, [])

  const signOut = () => {
    localStorage.removeItem('accesco_user')
    setUser(null)
  }

  // Called after successful login; keep localStorage in sync with React state
  const signIn = (userData) => {
    try {
      localStorage.setItem('accesco_user', JSON.stringify(userData))
    } catch (_) {}
    setUser(userData)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}
