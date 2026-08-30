// /app/api/products/route.js
// Centralized SKU/product API — uses the same client Firebase SDK already
// set up in lib/firebase.js. No service account / admin credentials needed.
// (Same pattern as the existing app/api/instastyle/products/route.js)

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { notifyChatbotRefresh } from '@/lib/notifyChatbot';
import { requireAdmin } from '../_lib/authz';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  where,
  limit as firestoreLimit,
} from 'firebase/firestore';

export const dynamic = 'force-dynamic';

const COLLECTION = 'products';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ventureId = searchParams.get('ventureId');
    const category = searchParams.get('category');
    const pageLimit = parseInt(searchParams.get('limit') || '200', 10);

    if (!ventureId) {
      return NextResponse.json({ error: 'ventureId query param is required' }, { status: 400 });
    }

    let q = query(
      collection(db, COLLECTION),
      where('ventureId', '==', ventureId),
      firestoreLimit(pageLimit)
    );

    if (category && category !== 'all') {
      q = query(
        collection(db, COLLECTION),
        where('ventureId', '==', ventureId),
        where('category', '==', category),
        firestoreLimit(pageLimit)
      );
    }

    const snapshot = await getDocs(q);
    const products = [];
    snapshot.forEach((docSnap) => {
      products.push({ id: docSnap.id, ...docSnap.data() });
    });

    return NextResponse.json({ products, count: products.length });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { error: authError, status: authStatus } = await requireAdmin(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: authStatus });
    }

    const body = await request.json();
    const { sku, ventureId, ...rest } = body;

    if (!sku || !ventureId) {
      return NextResponse.json({ error: 'sku and ventureId are required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    await setDoc(
      doc(db, COLLECTION, sku),
      { sku, ventureId, ...rest, updatedAt: now, createdAt: rest.createdAt || now },
      { merge: true }
    );

    notifyChatbotRefresh();

    return NextResponse.json({ success: true, sku });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}