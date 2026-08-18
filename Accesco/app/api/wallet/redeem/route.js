import { NextResponse } from 'next/server';
import { verifyAuthToken } from '../../_lib/auth';
import { creditWallet } from '../../_lib/wallet';

export const dynamic = 'force-dynamic';

// Server-side coupon catalog — moved here from the client-hardcoded
// AVAILABLE_COUPONS/validCodes in app/profile/ProfileContent.jsx, so a
// client can no longer forge a redemption (or its credit amount) by
// calling this API directly with an arbitrary code/value.
//
// FREEDEL is intentionally NOT here: it's a non-monetary delivery perk with
// no wallet-ledger equivalent (nothing to credit), so it's left exactly as
// it was — handled entirely client-side in ProfileContent.jsx's
// handleRedeem, unchanged by this wallet work.
const COUPON_CATALOG = {
  ACCESCO20: { amount: 20, title: 'Coupon Redeemed (ACCESCO20)' },
  SWADISHT50: { amount: 50, title: 'Coupon Redeemed (SWADISHT50)' },
  WELCOME50: { amount: 50, title: 'Coupon Redeemed (WELCOME50)' },
};

// POST /api/wallet/redeem — body: { code }. One redemption per user per
// code, enforced by creditWallet's idempotency key (coupon_<CODE>_<uid>) —
// not by trusting a client-supplied "already redeemed" list.
export async function POST(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const body = await request.json();
    const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
    const coupon = COUPON_CATALOG[code];

    if (!coupon) {
      return NextResponse.json({ error: `Invalid or expired coupon code '${code}'.` }, { status: 400 });
    }

    const result = await creditWallet({
      uid,
      amount: coupon.amount,
      reason: coupon.title,
      source: 'coupon_redemption',
      referenceId: code,
      idempotencyKey: `coupon_${code}_${uid}`,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 400 });
    }
    if (!result.applied) {
      return NextResponse.json({ error: `Coupon code '${code}' has already been redeemed!` }, { status: 409 });
    }

    return NextResponse.json({
      balance: result.balance,
      transaction: {
        id: result.transactionId,
        type: 'credit',
        amount: coupon.amount,
        reason: coupon.title,
        source: 'coupon_redemption',
        referenceId: code,
        // Approximation of the serverTimestamp() just written — reading the
        // resolved value back would need another round-trip; "now" is
        // accurate enough for this immediate success-response display.
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[wallet/redeem] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
