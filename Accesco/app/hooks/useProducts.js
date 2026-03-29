'use client'

import { useState, useEffect } from 'react'

export const FALLBACK_PRODUCTS = [
  { id: '1',  name: 'Fresh Tomatoes',    price: 40,  category: 'Vegetables',      image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '2',  name: 'Green Apples',      price: 120, category: 'Fruits',          image: '/images/green-apples.png' },
  { id: '3',  name: 'Fresh Milk 1L',     price: 60,  category: 'Dairy and Bakery',image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '5',  name: 'Potato Chips',      price: 20,  category: 'Snacks',          image: '/images/potato-chips.png' },
  { id: '6',  name: 'Basmati Rice 1kg',  price: 80,  category: 'Grocery',         image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '7',  name: 'Fresh Carrots',     price: 50,  category: 'Vegetables',      image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '8',  name: 'Bananas',           price: 40,  category: 'Fruits',          image: 'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '9',  name: 'Whole Wheat Bread', price: 45,  category: 'Dairy and Bakery',image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '11', name: 'Mixed Nuts',        price: 250, category: 'Snacks',          image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '12', name: 'Toor Dal 500g',     price: 70,  category: 'Grocery',         image: '/images/toor-dal.png' },
]

// Check if Firebase env vars are actually set (not placeholder values)
function isFirebaseConfigured() {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  return !!(key && key !== 'YOUR_API_KEY' && key.startsWith('AIza'))
}

export function useProducts() {
  // ✅ START with fallback data immediately — no loading flash
  const [products, setProducts] = useState(FALLBACK_PRODUCTS)
  const [loading, setLoading] = useState(false)
  const [usingFirebase, setUsingFirebase] = useState(false)

  useEffect(() => {
    // Only attempt Firebase if properly configured
    if (!isFirebaseConfigured()) return

    let unsubscribe = null

    const connectFirebase = async () => {
      try {
        const { collection, onSnapshot, getDocs, addDoc } = await import('firebase/firestore')
        const { db } = await import('../../lib/firebase')

        // Seed if empty
        const snap = await getDocs(collection(db, 'products'))
        if (snap.empty) {
          console.log('🌱 Seeding Firestore with products...')
          for (const p of FALLBACK_PRODUCTS) {
            const { id, ...data } = p
            await addDoc(collection(db, 'products'), data)
          }
        }

        // Live listener — replaces local data with Firestore data
        unsubscribe = onSnapshot(
          collection(db, 'products'),
          (snapshot) => {
            if (!snapshot.empty) {
              const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              setProducts(data)
              setUsingFirebase(true)
              console.log('🔥 Connected to Firebase Firestore')
            }
          },
          (err) => {
            console.warn('Firestore listener error, keeping local data:', err.message)
          }
        )
      } catch (err) {
        console.warn('Firebase connection failed, using local data:', err)
      }
    }

    connectFirebase()
    return () => { if (unsubscribe) unsubscribe() }
  }, [])

  return { products, loading, usingFirebase }
}
