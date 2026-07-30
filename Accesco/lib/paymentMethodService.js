/**
 * Payment Method Service — Firestore service for managing user payment methods.
 * Collection: users/{uid}/payment_methods
 *
 * SECURITY COMPLIANCE:
 * NEVER store raw Card Numbers or CVV!
 * Store ONLY tokenized descriptors: token, brand, lastFour, expiry, upiId, etc.
 */

import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Fetch all saved payment methods for a user.
 * @param {string} uid
 * @returns {Promise<Array>}
 */
export async function getPaymentMethods(uid) {
  if (!uid) return [];
  try {
    const colRef = collection(db, 'users', uid, 'payment_methods');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const methods = [];
    snap.forEach((docSnap) => {
      methods.push({ id: docSnap.id, ...docSnap.data() });
    });
    return methods;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
}

/**
 * Save a new payment method (UPI or Tokenized Card).
 * @param {string} uid
 * @param {object} methodData
 */
export async function savePaymentMethod(uid, methodData) {
  if (!uid) throw new Error('User ID is required');

  const methodId = methodData.id || `pm_${Date.now()}`;
  const docRef = doc(db, 'users', uid, 'payment_methods', methodId);

  if (methodData.isDefault) {
    await resetDefaultPaymentMethods(uid);
  }

  // Ensure raw sensitive card data is never stored
  const payload = {
    type: methodData.type || 'upi', // 'upi' | 'card'
    upiId: methodData.upiId || null,
    token: methodData.token || null,
    brand: methodData.brand || null, // e.g. 'Visa', 'Mastercard', 'RuPay'
    lastFour: methodData.lastFour || null,
    expiry: methodData.expiry || null, // e.g. '12/28'
    holderName: methodData.holderName || null,
    isDefault: Boolean(methodData.isDefault),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(docRef, payload, { merge: true });
  return { id: methodId, ...payload };
}

/**
 * Delete a saved payment method.
 * @param {string} uid
 * @param {string} methodId
 */
export async function deletePaymentMethod(uid, methodId) {
  if (!uid || !methodId) return;
  try {
    const docRef = doc(db, 'users', uid, 'payment_methods', methodId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
}

/**
 * Set a payment method as default.
 * @param {string} uid
 * @param {string} methodId
 */
export async function setDefaultPaymentMethod(uid, methodId) {
  if (!uid || !methodId) return;
  try {
    await resetDefaultPaymentMethods(uid);
    const docRef = doc(db, 'users', uid, 'payment_methods', methodId);
    await updateDoc(docRef, { isDefault: true, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
}

async function resetDefaultPaymentMethods(uid) {
  try {
    const colRef = collection(db, 'users', uid, 'payment_methods');
    const snap = await getDocs(colRef);
    const updates = [];
    snap.forEach((docSnap) => {
      if (docSnap.data().isDefault) {
        updates.push(updateDoc(docSnap.ref, { isDefault: false }));
      }
    });
    await Promise.all(updates);
  } catch (err) {
    console.error('Error resetting default payment methods:', err);
  }
}
