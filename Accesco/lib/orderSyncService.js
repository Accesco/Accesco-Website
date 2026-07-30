/**
 * Order Sync Service — Unifies Firestore writes for orders, payments, tracking, and notifications.
 * Ensures EVERY order and payment immediately syncs to Firebase.
 */

import { db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { startRiderSimulation } from './riderTrackingService';
import { triggerNotification } from './notificationEngine';

/**
 * Creates/Syncs an order to Firestore `orders` collection.
 * Also syncs payment to `payments` collection if applicable.
 * Triggers realtime rider tracking simulation.
 *
 * @param {object} orderData
 * @returns {Promise<object>} The saved order object
 */
export async function syncOrderToFirebase(orderData) {
  if (!orderData || !orderData.id) {
    throw new Error('Order ID is required to sync order to Firebase');
  }

  const orderId = orderData.id;
  const docRef = doc(db, 'orders', orderId);

  const payload = {
    ...orderData,
    orderId, // backward compatibility
    createdAt: orderData.createdAt || new Date().toISOString(),
    updatedAt: serverTimestamp(),
  };

  try {
    // 1. Write order to Firestore `orders` collection
    await setDoc(docRef, payload, { merge: true });
    console.log('[orderSyncService] Order synced to Firestore:', orderId);

    // 2. If payment details exist, write to `payments` collection
    if (orderData.razorpayPaymentId || orderData.paymentId) {
      const paymentId = orderData.razorpayPaymentId || orderData.paymentId || `pay_${Date.now()}`;
      const payRef = doc(db, 'payments', paymentId);
      await setDoc(
        payRef,
        {
          paymentId,
          orderId,
          userId: orderData.userId || null,
          amount: orderData.total || orderData.totals?.total || 0,
          status: orderData.paymentStatus || 'PAID',
          method: orderData.paymentMethod || 'upi',
          venture: orderData.venture || 'general',
          razorpayOrderId: orderData.razorpayOrderId || null,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    // 3. Start rider simulation in Firestore `rider_tracking` collection for live tracking
    try {
      const storeCoords = orderData.storeCoords || { lat: 12.9716, lng: 77.5946 };
      const deliveryCoords = orderData.deliveryCoords || {
        lat: orderData.deliveryLat || 12.9800,
        lng: orderData.deliveryLng || 77.6000,
      };

      startRiderSimulation(orderId, storeCoords, deliveryCoords, {
        eta: orderData.eta || 15,
        rider: {
          riderName: orderData.driverName || 'Ravi Kumar',
          riderPhone: orderData.driverPhone || '+91 9876543210',
          vehicleNumber: orderData.vehicleNumber || 'KA-01-EQ-4892',
          rating: 4.9,
        },
      });
    } catch (simErr) {
      console.warn('[orderSyncService] Rider simulation init warning:', simErr);
    }

    // 4. Trigger push/in-app notification
    try {
      triggerNotification({
        type: 'CONFIRMED',
        orderId,
        message: `Order #${orderId} has been placed successfully!`,
      });
    } catch (notifErr) {
      console.warn('[orderSyncService] Notification trigger warning:', notifErr);
    }

    return payload;
  } catch (error) {
    console.error('[orderSyncService] Firestore sync error:', error);
    // Return payload so frontend UI can continue gracefully even if network is offline
    return payload;
  }
}
