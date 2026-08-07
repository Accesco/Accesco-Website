import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Checks whether a referral code actually exists before we let someone sign up
 * with it. Without this an unknown code fails silently — attribution just 404s
 * after the account is already created, and the user never finds out their
 * friend's code was mistyped.
 *
 * Deliberately returns only whether the code resolves and a display name, so
 * this can't be used to enumerate profile data (phones, coins, referral counts).
 */
export async function POST(request) {
  try {
    const { code } = await request.json();

    const clean = String(code || '').trim().toUpperCase();

    if (!clean) {
      return NextResponse.json({ valid: false, reason: 'empty' }, { status: 200 });
    }

    if (!/^[A-Z0-9]{4,20}$/.test(clean)) {
      return NextResponse.json({ valid: false, reason: 'format' }, { status: 200 });
    }

    const snapshot = await getDocs(
      query(collection(db, 'referralProfiles'), where('referralCode', '==', clean), limit(1)),
    );

    if (snapshot.empty) {
      return NextResponse.json({ valid: false, reason: 'not_found' }, { status: 200 });
    }

    const data = snapshot.docs[0].data();

    return NextResponse.json(
      {
        valid: true,
        isMarketing: data.isMarketing === true,
        // First name only — enough to reassure "yes, this is your friend's
        // code" without leaking the referrer's full identity.
        referrerName: String(data.name || '').trim().split(' ')[0] || null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Referral validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
