// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Auth features will not work.')
}

export const supabase = createClient(
  supabaseUrl || 'https://nfdrnbikwzfmijrqmoqt.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZHJuYmlrd3pmbWlqcnFtb3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0NzQ4NzcsImV4cCI6MjA1MTA1MDg3N30.u4ThkmfWiCOJrfcxm0RB-oaVysQSY8kha7k66UdUuH0'
)

// Auth helper functions
export const signUp = async (email, password, userData = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email)
  return { data, error }
}

export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })
  return { data, error }
}

// Google OAuth
export const signInWithGoogle = async () => {
  const redirectTo = typeof window !== 'undefined' 
    ? `${window.location.origin}/auth/callback`
    : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo
    }
  })
  return { data, error }
}

// Listen to auth changes
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback)
}
