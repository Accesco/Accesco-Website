import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  try {
    const orderId = params.id;
    const body = await request.json();

    try {
      const { db } = await import('@/lib/firebase');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

      await addDoc(collection(db, 'swadishtt_issue_reports'), {
        orderId,
        issueType: body.issueType || 'missing',
        items: body.items || [],
        details: body.details || '',
        photos: body.photos || [],
        refundTotal: body.refundTotal || 0,
        greenPoints: body.greenPoints || 10,
        status: 'pending_review',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('[swadishtt/report-issue] Firestore error:', err);
    }

    return NextResponse.json({
      success: true,
      orderId,
      status: 'received',
      refundTotal: body.refundTotal || 0,
      greenPoints: body.greenPoints || 10,
    });
  } catch (error) {
    console.error('[swadishtt/report-issue] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
