import { NextResponse } from 'next/server';
import { verifyAuthToken } from '../_lib/auth';
import { getOrInitWallet, listRecentTransactions } from '../_lib/wallet';

export const dynamic = 'force-dynamic';

// GET /api/wallet — the caller's own balance + recent ledger entries.
// Identity always comes from the verified token (see verifyAuthToken), so
// there is no userId/uid query param — a caller can only ever see their own
// wallet.
export async function GET(request) {
  try {
    const { uid, error } = await verifyAuthToken(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const [wallet, transactions] = await Promise.all([
      getOrInitWallet(uid),
      listRecentTransactions(uid, 50),
    ]);

    return NextResponse.json({ balance: wallet.balance, transactions });
  } catch (error) {
    console.error('[wallet] GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
