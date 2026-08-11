import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, doc, getDocs, query, where, runTransaction, addDoc, arrayUnion } from 'firebase/firestore';
import { LAYER1_REFERRER_CREDIT, LAYER1_REFEREE_CREDIT, REFERRAL_TIERS, rollSurpriseReward } from '../../../../lib/referralRewards';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { refereePhone, referredBy } = await request.json();

    if (!refereePhone || !referredBy) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const refereeDigits = String(refereePhone).replace(/[^\d]/g, '');
    if (refereeDigits.length < 7) {
      return NextResponse.json({ error: 'Invalid referee phone' }, { status: 400 });
    }

    // Find the referrer profile using the referredBy code
    const q = query(collection(db, 'referralProfiles'), where('referralCode', '==', referredBy));
    const referrerSnapshot = await getDocs(q);

    if (referrerSnapshot.empty) {
      return NextResponse.json({ error: 'Referrer not found' }, { status: 404 });
    }

    const referrerDoc = referrerSnapshot.docs[0];
    const referrerRef = doc(db, 'referralProfiles', referrerDoc.id);
    const refereeRef = doc(db, 'referralProfiles', refereeDigits);

    // A referrer can't refer themselves
    if (referrerDoc.id === refereeDigits) {
      return NextResponse.json({ error: 'Cannot refer yourself' }, { status: 400 });
    }

    let alreadyProcessed = false;
    let auditInfo = null;

    // Transaction spans both docs: read+flip the referee's processed flag and
    // apply every reward layer to the referrer atomically, so a retried/
    // duplicate call can never award anything twice for the same referee.
    await runTransaction(db, async (transaction) => {
      const refereeSnap = await transaction.get(refereeRef);
      if (!refereeSnap.exists()) {
        throw new Error('Referee profile not found');
      }

      if (refereeSnap.data().referredByProcessed) {
        alreadyProcessed = true;
        return;
      }

      const referrerSnap = await transaction.get(referrerRef);
      if (!referrerSnap.exists()) {
        throw new Error('Referrer profile not found');
      }

      const referrerData = referrerSnap.data();
      const refereeData = refereeSnap.data();
      const newReferralCount = (referrerData.referralCount || 0) + 1;

      // Layer 3 — surprise pool: a variable bonus on every successful
      // referral, stacked on top of the flat Layer 1 credit.
      const surpriseAmount = rollSurpriseReward();

      // Layer 2 — tier ladder: auto-grant any tier this referral newly
      // crosses (fixed rewards, no user choice involved).
      const existingClaims = { ...(referrerData.tierClaims || {}) };
      const newlyReachedTiers = REFERRAL_TIERS.filter(
        (tier) => newReferralCount >= tier.minReferrals && !existingClaims[tier.id],
      );

      let tierCreditTotal = 0;
      const badgesToAdd = [];
      let freeDeliveryUntil = referrerData.freeDeliveryUntil || null;

      for (const tier of newlyReachedTiers) {
        const claim = { rewardName: tier.rewardName, role: tier.role, claimedAt: new Date().toISOString() };

        for (const effect of tier.effects) {
          if (effect.type === 'credits') {
            tierCreditTotal += effect.amount;
          } else if (effect.type === 'badge') {
            badgesToAdd.push(effect.badge);
          } else if (effect.type === 'perk' && effect.perk === 'free_delivery') {
            const candidate = new Date(Date.now() + effect.days * 24 * 60 * 60 * 1000).toISOString();
            if (!freeDeliveryUntil || candidate > freeDeliveryUntil) {
              freeDeliveryUntil = candidate;
            }
          } else if (effect.type === 'physical') {
            claim.vertical = effect.vertical;
            claim.itemName = effect.item;
            claim.status = referrerData.waitlistJoinedAt ? 'fulfilled_pending_dispatch' : 'pending_conversion';
          }
        }

        existingClaims[tier.id] = claim;
      }

      // Layer 1 — immediate two-sided reward: flat credit for the referrer
      // (below, combined with Layers 2 & 3) and for the referee (on their
      // own doc, right after).
      const newCoins = (referrerData.coins || 0) + LAYER1_REFERRER_CREDIT + surpriseAmount + tierCreditTotal;

      const referrerUpdate = {
        referralCount: newReferralCount,
        coins: newCoins,
        referredUsers: arrayUnion({
          phone: refereeData.phone || refereeDigits,
          name: refereeData.name || '',
          status: 'pending',
          referredAt: new Date().toISOString(),
        }),
        lastSurprise: { amount: surpriseAmount, at: new Date().toISOString() },
      };

      if (newlyReachedTiers.length > 0) {
        referrerUpdate.tierClaims = existingClaims;
      }
      if (badgesToAdd.length > 0) {
        referrerUpdate.badges = arrayUnion(...badgesToAdd);
      }
      if (freeDeliveryUntil !== (referrerData.freeDeliveryUntil || null)) {
        referrerUpdate.freeDeliveryUntil = freeDeliveryUntil;
      }

      transaction.update(referrerRef, referrerUpdate);

      transaction.update(refereeRef, {
        referredByProcessed: true,
        coins: (refereeData.coins || 0) + LAYER1_REFEREE_CREDIT,
      });

      auditInfo = {
        layer1ReferrerCredit: LAYER1_REFERRER_CREDIT,
        layer1RefereeCredit: LAYER1_REFEREE_CREDIT,
        surpriseAmount,
        tiersAwarded: newlyReachedTiers.map((t) => t.id),
      };
    });

    if (alreadyProcessed) {
      return NextResponse.json({ success: true, message: 'Already attributed' }, { status: 200 });
    }

    // Audit log
    await addDoc(collection(db, 'referralEvents'), {
      referrerCode: referredBy,
      refereePhone: refereeDigits,
      timestamp: new Date().toISOString(),
      ...auditInfo,
    });

    return NextResponse.json({ success: true, message: 'Attribution successful' }, { status: 200 });
  } catch (error) {
    console.error('Referral attribution error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
