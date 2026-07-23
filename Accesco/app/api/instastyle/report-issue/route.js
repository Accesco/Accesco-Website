import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();

    try {
      const { db } = await import('@/lib/firebase');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

      await addDoc(collection(db, 'instastyle_issue_reports'), {
        orderId: body.orderId || 'AC-2041',
        issueType: body.issueType || 'size_fit',
        details: body.details || '',
        status: 'pending_review',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('[instastyle/report-issue] Firestore error:', err);
    }

    return NextResponse.json({
      success: true,
      orderId: body.orderId || 'AC-2041',
      status: 'received',
    });
  } catch (error) {
    console.error('[instastyle/report-issue] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
