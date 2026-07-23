import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  try {
    const orderId = params.id;
    const body = await request.json();

    try {
      const { db } = await import('@/lib/firebase');
      const { collection, doc, setDoc, serverTimestamp } = await import('firebase/firestore');

      await setDoc(doc(collection(db, 'swadishtt_container_returns'), `${orderId}_${Date.now()}`), {
        orderId,
        status: 'scheduled',
        greenPointsEarned: 10,
        createdAt: serverTimestamp(),
        ...body,
      });
    } catch (err) {
      console.error('[swadishtt/return-container] Firestore write error:', err);
    }

    return NextResponse.json({ success: true, orderId, status: 'scheduled', greenPointsEarned: 10 });
  } catch (error) {
    console.error('[swadishtt/return-container] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
