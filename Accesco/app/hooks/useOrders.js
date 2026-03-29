'use client'

import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

// Graceful fallback if Firebase is not configured
let db = null

async function getDb() {
  if (db) return db
  try {
    const firebase = await import('../../lib/firebase')
    db = firebase.db
    return db
  } catch (e) {
    console.warn('Firebase not configured, running without DB:', e.message)
    return null
  }
}

export async function placeOrder(
  items,
  total,
  address,
  coordinates
) {
  try {
    const firestore = await getDb()
    if (!firestore) {
      console.warn('No Firebase connection - order saved locally only')
      return null
    }

    const order = {
      items,
      total,
      address,
      coordinates: coordinates || null,
      status: 'pending',
      createdAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(firestore, 'orders'), order)
    console.log('Order saved to Firebase with ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.warn('Could not save order to Firebase:', error)
    return null
  }
}
