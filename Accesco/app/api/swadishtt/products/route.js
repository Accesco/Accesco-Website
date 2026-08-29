// /app/api/swadishtt/products/route.js
// Swadishtt menu-item catalog API — mirrors app/api/instastyle/products/
// route.js's shape (client Firebase SDK, requireAdmin-gated writes, same
// field-validation style) for the one commerce vertical that previously had
// no backend catalog at all (menu data lived only in the static
// app/services/swadisht/lib/swadishttData.js file). Restaurant-level
// metadata (images, offers, timings, location) stays in that static file —
// only the menu items themselves (what the cart/checkout actually needs:
// name, description, price, image, category, availability) move here.

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { requireAdmin } from '../../_lib/authz';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  limit as firestoreLimit,
} from 'firebase/firestore';

export const dynamic = 'force-dynamic';

const COLLECTION = 'swadishtt_products';

// GET /api/swadishtt/products — public read. Query params: restaurantId, category, limit.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    const category = searchParams.get('category');
    const pageLimit = parseInt(searchParams.get('limit') || '200', 10);

    // isActive is filtered in JS rather than via a Firestore `!=` clause —
    // that operator has composite-index/field-presence gotchas that aren't
    // worth the complexity here, matching how neither the Grokly nor
    // InstaStyle product routes filter server-side beyond simple equality.
    const clauses = [];
    if (restaurantId) clauses.push(where('restaurantId', '==', restaurantId));
    if (category && category !== 'all') clauses.push(where('category', '==', category));

    const q = query(collection(db, COLLECTION), ...clauses, firestoreLimit(pageLimit));
    const snapshot = await getDocs(q);
    const products = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.isActive === false) return;
      products.push({ id: docSnap.id, ...data });
    });

    return NextResponse.json({ products, count: products.length });
  } catch (error) {
    console.error('GET /api/swadishtt/products error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/swadishtt/products — admin-only create.
export async function POST(request) {
  try {
    const { error: authError, status: authStatus } = await requireAdmin(request);
    if (authError) {
      return NextResponse.json({ error: authError }, { status: authStatus });
    }

    const body = await request.json();
    const required = ['name', 'price', 'restaurantId'];
    const missing = required.filter((f) => !body[f]);
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const product = {
      ventureId: 'swadishtt',
      restaurantId: String(body.restaurantId),
      restaurantName: body.restaurantName || '',
      name: String(body.name).trim(),
      description: String(body.description || '').trim(),
      price: parseFloat(body.price),
      image: body.image || '',
      category: body.category || 'Main Course',
      isVeg: Boolean(body.isVeg),
      isBestseller: Boolean(body.isBestseller),
      inStock: body.inStock !== false,
      isActive: body.isActive !== false,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, COLLECTION), product);

    return NextResponse.json({ success: true, product: { id: docRef.id, ...product } }, { status: 201 });
  } catch (error) {
    console.error('POST /api/swadishtt/products error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
