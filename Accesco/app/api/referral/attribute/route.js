import { NextResponse } from 'next/server';
// Using firebase-admin is best for trusted server operations, but since the existing app uses client SDK in lib/firebase, 
// we will build a secure backend transactional handler. For this implementation, we simulate the secure transaction to Firebase.
// In actual production, you should use firebase-admin, but let's implement the standard fetch API securely against Firestore REST 
// or use the server-side initialized firebase. 
// Assuming the user has configured process.env or has standard firebase access.
import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs, doc, runTransaction, addDoc } from 'firebase/firestore';

export async function POST(request) {
  try {
    const { refereeEmail, referredBy } = await request.json();

    if (!refereeEmail || !referredBy) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Step 1: Find the referrer profile using the referredBy code
    const q = query(collection(db, 'referralProfiles'), where('referralCode', '==', referredBy));
    const referrerSnapshot = await getDocs(q);

    if (referrerSnapshot.empty) {
      return NextResponse.json({ error: 'Referrer not found' }, { status: 404 });
    }

    const referrerDoc = referrerSnapshot.docs[0];
    const referrerRef = doc(db, 'referralProfiles', referrerDoc.id);

    // Step 2: Use a transaction to safely increment coins and count
    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(referrerRef);
      if (!sfDoc.exists()) {
        throw new Error("Document does not exist!");
      }

      const newReferralCount = (sfDoc.data().referralCount || 0) + 1;
      const newCoins = (sfDoc.data().coins || 0) + 20;

      transaction.update(referrerRef, {
        referralCount: newReferralCount,
        coins: newCoins
      });
      
      // Step 3: Optional, write to referralEvents inside transaction conceptually, 
      // but simpler to do it right after or add it as another transaction operation if collection exists.
    });

    // Step 4: Audit Logging
    await addDoc(collection(db, 'referralEvents'), {
      referrerCode: referredBy,
      refereeEmail: refereeEmail,
      timestamp: new Date().toISOString(),
      coinsAwarded: 20
    });

    return NextResponse.json({ success: true, message: 'Attribution successful' }, { status: 200 });
  } catch (error) {
    console.error('Referral attribution error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
