/**
 * @fileoverview Firestore subscriber for live delivery tracking updates.
 *
 * @module services/firestoreTrackingService
 */

import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { COLLECTIONS } from '../lib/trackingConstants';

const COLLECTION = COLLECTIONS.RIDER_TRACKING || 'rider_tracking';

/**
 * Subscribes to live rider location snapshot in Firestore.
 *
 * @param {string} orderId - Order identifier
 * @param {(data: any) => void} callback - Triggers on snapshot updates
 * @returns {() => void} unsubscribe callback
 */
export function subscribeToFirestore(orderId, callback) {
  if (!orderId) {
    return () => {};
  }

  const ref = doc(db, COLLECTION, orderId);

  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data());
      } else {
        callback(null);
      }
    },
    (err) => {
      console.error(`[FirestoreTrackingService] Subscription error for ${orderId}:`, err);
      callback(null);
    }
  );
}
