import { db } from './firebase'
import { collection, doc, getDocs, query, runTransaction, serverTimestamp, where } from 'firebase/firestore'

const COLLECTION = 'referralProfiles'

/**
 * Shared conversion logic: marks a referral profile as "converted" and
 * bundles delivery of any gifts claimed but not yet received. Pre-launch,
 * real orders are rare (ordering is itself gated behind the waitlist), so
 * a waitlist join counts as the conversion event just as much as an order
 * does — see markWaitlistJoinAndFulfillGifts below.
 *
 * No-ops silently if the phone has no referral profile, or if it has
 * already converted (hasOrderedAt already set).
 *
 * @param {{ phone: string, orderId?: string, vertical?: string, source: 'order'|'waitlist' }} params
 */
async function markConversionAndFulfillGifts({ phone, orderId = null, vertical = null, source }) {
  const digits = String(phone).replace(/[^\d]/g, '')
  if (digits.length < 7) return

  const profileRef = doc(db, COLLECTION, digits)
  let referredByCode = null

  try {
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(profileRef)
      if (!snap.exists()) return // no referral profile for this phone — nothing to do

      const data = snap.data()
      if (data.hasOrderedAt) return // already converted — already handled

      referredByCode = data.referredBy || null

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
        conversionSource: source,
        ...(claimsChanged ? { milestoneClaims: claims } : {}),
      })
    })

    // Flip this friend's row in the referrer's history from "Pending" to
    // "Completed" now that they've converted.
    if (referredByCode) {
      await markReferrerHistoryCompleted(referredByCode, digits)
    }
  } catch (err) {
    // Referral bundling is a side effect of conversion — never let it
    // break the order/waitlist flow itself.
    console.error('[referralFulfillment] Failed to mark conversion:', err)
  }
}

/**
 * Call this whenever an order is placed in ANY vertical (Grokly, InstaStyle,
 * Swadisht).
 * @param {{ phone: string, orderId: string, vertical: string }} params
 */
export async function markFirstOrderAndFulfillGifts({ phone, orderId, vertical }) {
  if (!phone || !orderId) return
  return markConversionAndFulfillGifts({ phone, orderId, vertical, source: 'order' })
}

/**
 * Call this whenever a user joins the waitlist. Pre-launch, this is the
 * realistic "the referral paid off" moment — see markConversionAndFulfillGifts.
 * @param {{ phone: string }} params
 */
export async function markWaitlistJoinAndFulfillGifts({ phone }) {
  if (!phone) return
  return markConversionAndFulfillGifts({ phone, source: 'waitlist' })
}

async function markReferrerHistoryCompleted(referredByCode, refereeDigits) {
  const q = query(collection(db, COLLECTION), where('referralCode', '==', referredByCode))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return

  const referrerRef = doc(db, COLLECTION, snapshot.docs[0].id)

  await runTransaction(db, async (transaction) => {
    const referrerSnap = await transaction.get(referrerRef)
    if (!referrerSnap.exists()) return

    const referredUsers = referrerSnap.data().referredUsers || []
    let changed = false

    const updated = referredUsers.map((entry) => {
      if (entry.phone === refereeDigits && entry.status !== 'completed') {
        changed = true
        return { ...entry, status: 'completed' }
      }
      return entry
    })

    if (changed) {
      transaction.update(referrerRef, { referredUsers: updated })
    }
  })
}
