import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { getMilestoneById, isValidGiftChoice, getGiftChoicesForMilestone } from '../../../../lib/giftCatalog';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { phone, tierId, giftId } = await request.json();

    if (!phone || !tierId || !giftId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const milestone = getMilestoneById(tierId);
    if (!milestone) {
      return NextResponse.json({ error: 'Invalid milestone' }, { status: 400 });
    }

    if (!isValidGiftChoice(tierId, giftId)) {
      return NextResponse.json({ error: 'Gift is not a valid choice for this milestone' }, { status: 400 });
    }

    const gift = getGiftChoicesForMilestone(tierId).find((g) => g.id === giftId);
    const digits = String(phone).replace(/[^\d]/g, '');
    const profileRef = doc(db, 'referralProfiles', digits);

    let result;

    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(profileRef);
      if (!snap.exists()) {
        throw new Error('Referral profile not found');
      }

      const data = snap.data();
      const referralCount = data.referralCount || 0;

      if (referralCount < milestone.minReferrals) {
        throw new Error('You have not reached this milestone yet');
      }

      const claims = { ...(data.milestoneClaims || {}) };
      if (claims[tierId]) {
        // Already claimed — return the existing claim rather than erroring,
        // so a retried/duplicate request is a harmless no-op. Firestore
        // Timestamps aren't directly JSON-safe, so report back plain fields.
        const existing = claims[tierId];
        result = {
          alreadyClaimed: true,
          claim: {
            giftId: existing.giftId,
            giftName: existing.giftName,
            price: existing.price,
            status: existing.status,
          },
        };
        return;
      }

      const status = data.hasOrderedAt ? 'fulfilled_pending_dispatch' : 'pending_first_order';

      claims[tierId] = {
        giftId: gift.id,
        giftName: gift.name,
        price: gift.price,
        claimedAt: serverTimestamp(),
        status,
      };

      transaction.update(profileRef, { milestoneClaims: claims });

      // Sentinel serverTimestamp() values aren't JSON-serializable — report
      // back plain fields instead of the just-written claim object.
      result = {
        alreadyClaimed: false,
        claim: { giftId: gift.id, giftName: gift.name, price: gift.price, status },
      };
    });

    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (error) {
    console.error('Gift claim error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
