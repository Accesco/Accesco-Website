/**
<<<<<<< HEAD
 * Address Service — Firestore service for managing user delivery addresses.
 * Collection: users/{uid}/addresses
 */

import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Fetch all saved addresses for a given user.
 * @param {string} uid - User ID
 * @returns {Promise<Array>} Array of address objects
 */
export async function getSavedAddresses(uid) {
  if (!uid) return [];
  try {
    const colRef = collection(db, 'users', uid, 'addresses');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list = [];
    snap.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    return list;
  } catch (error) {
    console.error('Error fetching addresses for uid:', uid, error);
    return [];
  }
}

/**
 * Add a new delivery address for a user.
 * @param {string} uid - User ID
 * @param {object} addressData - Address fields
 * @returns {Promise<object>} Created address object with ID
 */
export async function saveAddress(uid, addressData) {
  if (!uid) throw new Error('User ID is required to save address');
  try {
    const addressId = addressData.id || `addr_${Date.now()}`;
    const docRef = doc(db, 'users', uid, 'addresses', addressId);

    // If marked as default, reset other addresses
    if (addressData.isDefault) {
      await resetDefaultAddresses(uid);
    }

    const payload = {
      name: addressData.name || addressData.fullName || '',
      phone: addressData.phone || '',
      email: addressData.email || '',
      address: addressData.address || addressData.addressLine1 || '',
      addressLine2: addressData.addressLine2 || '',
      landmark: addressData.landmark || '',
      city: addressData.city || '',
      state: addressData.state || '',
      pincode: addressData.pincode || '',
      tag: addressData.tag || 'Home',
      isDefault: Boolean(addressData.isDefault),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, payload, { merge: true });
    return { id: addressId, ...payload };
  } catch (error) {
    console.error('Error saving address:', error);
    throw error;
  }
}

/**
 * Update an existing delivery address.
 * @param {string} uid
 * @param {string} addressId
 * @param {object} updates
 */
export async function updateAddress(uid, addressId, updates) {
  if (!uid || !addressId) throw new Error('User ID and Address ID are required');
  try {
    if (updates.isDefault) {
      await resetDefaultAddresses(uid);
    }
    const docRef = doc(db, 'users', uid, 'addresses', addressId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
}

/**
 * Delete a delivery address.
 * @param {string} uid
 * @param {string} addressId
 */
export async function deleteAddress(uid, addressId) {
  if (!uid || !addressId) return;
  try {
    const docRef = doc(db, 'users', uid, 'addresses', addressId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
}

/**
 * Set an address as the default address.
 * @param {string} uid
 * @param {string} addressId
 */
export async function setDefaultAddress(uid, addressId) {
  if (!uid || !addressId) return;
  try {
    await resetDefaultAddresses(uid);
    const docRef = doc(db, 'users', uid, 'addresses', addressId);
    await updateDoc(docRef, { isDefault: true, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
}

/**
 * Helper to un-set isDefault on all user addresses.
 */
async function resetDefaultAddresses(uid) {
  try {
    const colRef = collection(db, 'users', uid, 'addresses');
    const snap = await getDocs(colRef);
    const updates = [];
    snap.forEach((docSnap) => {
      if (docSnap.data().isDefault) {
        updates.push(updateDoc(docSnap.ref, { isDefault: false }));
      }
    });
    await Promise.all(updates);
  } catch (err) {
    console.error('Error resetting default addresses:', err);
  }
}
=======
 * Address Service - Client side API wrapper for Address Management
 */

export async function fetchSavedAddresses(getIdToken, userId) {
  const token = await getIdToken();
  if (!token || !userId) return { addresses: [], error: 'Not authenticated' };

  try {
    const response = await fetch('/api/addresses', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-user-id': userId
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch addresses');
    }

    const data = await response.json();
    return { addresses: data.addresses, error: null };
  } catch (error) {
    console.error('fetchSavedAddresses error:', error);
    return { addresses: [], error: error.message };
  }
}

export async function createAddress(getIdToken, userId, addressData) {
  const token = await getIdToken();
  if (!token || !userId) throw new Error('Not authenticated');

  const response = await fetch('/api/addresses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId
    },
    body: JSON.stringify(addressData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create address');
  }

  return response.json();
}

export async function updateAddress(getIdToken, userId, addressId, addressData) {
  const token = await getIdToken();
  if (!token || !userId) throw new Error('Not authenticated');

  const response = await fetch(`/api/addresses/${addressId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId
    },
    body: JSON.stringify(addressData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update address');
  }

  return response.json();
}

export async function deleteAddress(getIdToken, userId, addressId) {
  const token = await getIdToken();
  if (!token || !userId) throw new Error('Not authenticated');

  const response = await fetch(`/api/addresses/${addressId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete address');
  }

  return response.json();
}

export async function selectAddress(getIdToken, userId, addressId) {
  const token = await getIdToken();
  if (!token || !userId) throw new Error('Not authenticated');

  const response = await fetch(`/api/addresses/${addressId}/select`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to select address');
  }

  return response.json();
}
>>>>>>> origin/main
