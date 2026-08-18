// /app/api/feedback/route.js
// Stores NPS-style feedback (score + optional review) submitted from
// components/AppShowcase.jsx. Uses the same client Firebase SDK pattern
// as /api/products — no service account needed. Submission stays anonymous
// by design (no auth required) — the 0-10 rating flow has no login gate in
// the UI and isn't tied to a user account, so there's no existing
// authenticated identity to associate here.

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, orderBy, query, limit as firestoreLimit, serverTimestamp } from 'firebase/firestore';
import { requireAdmin } from '../_lib/authz';

export const dynamic = 'force-dynamic';

const COLLECTION = 'feedback';
const VALID_USAGE_LIKELIHOOD = ['Very Likely', 'Likely', 'Not Sure', 'Unlikely'];
const VALID_EARLY_ACCESS = ['Yes', 'No', 'Maybe'];

export async function POST(request) {
  try {
    const body = await request.json();
    const { user, score, review, usageLikelihood, earlyAccess } = body;

    // NPS score must be a whole number 0-10 (matches the UI's 11-button
    // 0-10 rating scale in AppShowcase.jsx) — previously stored whatever
    // was sent with no check at all. Checked for null/undefined explicitly
    // first: Number(null) is 0, which would otherwise silently record a
    // missing score as the worst possible rating instead of rejecting it.
    if (score === null || score === undefined) {
      return NextResponse.json({ error: 'score is required' }, { status: 400 });
    }
    const numericScore = Number(score);
    if (!Number.isInteger(numericScore) || numericScore < 0 || numericScore > 10) {
      return NextResponse.json({ error: 'score must be an integer between 0 and 10' }, { status: 400 });
    }

    const doc = {
      user: (user || 'User').toString().slice(0, 100),
      score: numericScore,
      review: (review || '').toString().slice(0, 300),
      // Previously collected by the UI's two-step flow but silently
      // dropped here since they weren't destructured — now persisted.
      // Loosely validated: an unrecognized value is stored as-is rather
      // than rejected, since these are UI copy the frontend already
      // constrains, not data the client can meaningfully forge to bad effect.
      usageLikelihood: VALID_USAGE_LIKELIHOOD.includes(usageLikelihood) ? usageLikelihood : (usageLikelihood ? String(usageLikelihood).slice(0, 50) : null),
      earlyAccess: VALID_EARLY_ACCESS.includes(earlyAccess) ? earlyAccess : (earlyAccess ? String(earlyAccess).slice(0, 50) : null),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COLLECTION), doc);

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('POST /api/feedback error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/feedback — admin-only reporting endpoint (most recent 200
// submissions). Feedback was previously write-only: nothing could ever
// read submissions back out.
export async function GET(request) {
  try {
    const { error, status } = await requireAdmin(request);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'), firestoreLimit(200));
    const snapshot = await getDocs(q);
    const feedback = [];
    snapshot.forEach((docSnap) => feedback.push({ id: docSnap.id, ...docSnap.data() }));

    return NextResponse.json({ feedback, count: feedback.length });
  } catch (error) {
    console.error('GET /api/feedback error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
