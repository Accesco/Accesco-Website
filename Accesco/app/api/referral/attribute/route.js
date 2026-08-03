import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, doc, getDocs, query, where, runTransaction, addDoc, arrayUnion } from 'firebase/firestore';
import { COINS_PER_REFERRAL } from '../../../../lib/giftCatalog';

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

    // Transaction spans both docs: read+flip the referee's processed flag and
    // increment the referrer's stats atomically, so a retried/duplicate call
    // can never award coins twice for the same referee.
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

      const newReferralCount = (referrerSnap.data().referralCount || 0) + 1;
      const newCoins = (referrerSnap.data().coins || 0) + COINS_PER_REFERRAL;
      const refereeData = refereeSnap.data();

      transaction.update(referrerRef, {
        referralCount: newReferralCount,
        coins: newCoins,
        referredUsers: arrayUnion({
          phone: refereeData.phone || refereeDigits,
          name: refereeData.name || '',
          status: 'pending',
          referredAt: new Date().toISOString(),
        }),
      });

      transaction.update(refereeRef, {
        referredByProcessed: true,
      });
    });

    if (alreadyProcessed) {
      return NextResponse.json({ success: true, message: 'Already attributed' }, { status: 200 });
    }

    // Audit log
    await addDoc(collection(db, 'referralEvents'), {
      referrerCode: referredBy,
      refereePhone: refereeDigits,
      timestamp: new Date().toISOString(),
      coinsAwarded: COINS_PER_REFERRAL,
    });

    return NextResponse.json({ success: true, message: 'Attribution successful' }, { status: 200 });
  } catch (error) {
    console.error('Referral attribution error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
