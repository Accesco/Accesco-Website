import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getCountFromServer } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

// GET /api/waitlist/count — public, aggregate signup count only. Uses
// Firestore's count() aggregation query so no waitlistUsers document (name/
// email/phone) is ever read or transmitted — only a number is.
export async function GET() {
  try {
    const snapshot = await getCountFromServer(collection(db, 'waitlistUsers'));
    return NextResponse.json({ count: snapshot.data().count }, { status: 200 });
  } catch (error) {
    console.error('GET /api/waitlist/count error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
