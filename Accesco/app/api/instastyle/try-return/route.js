import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();

    try {
      const { db } = await import('@/lib/firebase');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

      await addDoc(collection(db, 'instastyle_try_returns'), {
        itemId: body.itemId || 'item_1',
        name: body.name || 'Returned Item',
        refundAmount: body.refundAmount || 0,
        refundMethod: body.refundMethod || 'Circular Credits',
        status: 'scheduled',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('[instastyle/try-return] Firestore error:', err);
    }

    return NextResponse.json({ success: true, status: 'scheduled' });
  } catch (error) {
    console.error('[instastyle/try-return] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
