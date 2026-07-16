// /app/api/feedback/route.js
// Stores NPS-style feedback (score + optional review) submitted from
// components/AppShowcase.jsx. Uses the same client Firebase SDK pattern
// as /api/products — no service account needed.

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

const COLLECTION = 'feedback';

export async function POST(request) {
  try {
    const body = await request.json();
    const { user, score, review } = body;
    // ...rest stays the same

    const docRef = await addDoc(collection(db, COLLECTION), {
      user: (user || 'User').toString().slice(0, 100),
      score,
      review: (review || '').toString().slice(0, 300),
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('POST /api/feedback error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}