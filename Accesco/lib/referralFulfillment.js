import { db } from './firebase'
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore'

const COLLECTION = 'referralProfiles'

/**
 * Call this whenever an order is placed in ANY vertical (Grokly, InstaStyle,
 * Swadisht). If this is the referred user's first order ever, it marks the
 * profile and — per the referral plan — bundles delivery of any gifts they've
 * claimed but not yet received, since those are shipped together with the
 * user's own first order rather than separately.
 *
 * No-ops silently if the phone has no referral profile, or if this isn't
 * actually their first order (hasOrderedAt already set).
 *
 * @param {{ phone: string, orderId: string, vertical: string }} params
 */
export async function markFirstOrderAndFulfillGifts({ phone, orderId, vertical }) {
  if (!phone || !orderId) return

  const digits = String(phone).replace(/[^\d]/g, '')
  if (digits.length < 7) return

  const profileRef = doc(db, COLLECTION, digits)

  try {
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(profileRef)
      if (!snap.exists()) return // no referral profile for this phone — nothing to do

      const data = snap.data()
      if (data.hasOrderedAt) return // not their first order — already handled

      const claims = { ...(data.milestoneClaims || {}) }
      let claimsChanged = false

      for (const tierId of Object.keys(claims)) {
        if (claims[tierId]?.status === 'pending_first_order') {
          claims[tierId] = {
            ...claims[tierId],
            status: 'fulfilled_with_order',
            fulfilledOrderId: orderId,
            fulfilledAt: serverTimestamp(),
          }
          claimsChanged = true
        }
      }

      transaction.update(profileRef, {
        hasOrderedAt: serverTimestamp(),
        firstOrderId: orderId,
        firstOrderVertical: vertical || null,
        ...(claimsChanged ? { milestoneClaims: claims } : {}),
      })
    })
  } catch (err) {
    // Referral bundling is a side effect of order placement — never let it
    // break the order flow itself.
    console.error('[referralFulfillment] Failed to mark first order:', err)
  }
}
