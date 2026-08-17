import { db } from './firebase'
import { collection, doc, getDocs, query, runTransaction, serverTimestamp, where } from 'firebase/firestore'

const COLLECTION = 'referralProfiles'

/**
 * Marks a referral profile as "converted" and bundles delivery of any gifts
 * claimed but not yet received. Waitlist registration is the confirming
 * event for a referral — not a first order — since ordering itself is gated
 * behind the waitlist, so it would never fire first anyway.
 *
 * No-ops silently if the phone has no referral profile, or if it has
 * already converted (waitlistJoinedAt already set).
 *
 * @param {{ phone: string }} params
 */
export async function markWaitlistJoinAndFulfillGifts({ phone }) {
  if (!phone) return

  const digits = String(phone).replace(/[^\d]/g, '')
  if (digits.length < 7) return

  const profileRef = doc(db, COLLECTION, digits)
  let referredByCode = null

  try {
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(profileRef)
      if (!snap.exists()) return // no referral profile for this phone — nothing to do

      const data = snap.data()
      if (data.waitlistJoinedAt) return // already converted — already handled

      referredByCode = data.referredBy || null

      const claims = { ...(data.tierClaims || {}) }
      let claimsChanged = false

      for (const tierId of Object.keys(claims)) {
        if (claims[tierId]?.status === 'pending_conversion') {
          claims[tierId] = {
            ...claims[tierId],
            status: 'fulfilled_pending_dispatch',
            fulfilledAt: serverTimestamp(),
          }
          claimsChanged = true
        }
      }

      transaction.update(profileRef, {
        waitlistJoinedAt: serverTimestamp(),
        ...(claimsChanged ? { tierClaims: claims } : {}),
      })
    })

    // Flip this friend's row in the referrer's history from "Pending" to
    // "Completed" now that they've converted.
    if (referredByCode) {
      await markReferrerHistoryCompleted(referredByCode, digits)
    }
  } catch (err) {
    // Referral bundling is a side effect of conversion — never let it
    // break the waitlist signup flow itself.
    console.error('[referralFulfillment] Failed to mark conversion:', err)
  }
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
