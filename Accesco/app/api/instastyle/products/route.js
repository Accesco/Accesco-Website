import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { notifyChatbotRefresh } from '@/lib/notifyChatbot';
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  where,
} from 'firebase/firestore';

export const dynamic = 'force-dynamic';

const COLLECTION = 'instastyle_products';

// ─────────────────────────────────────────────
// GET /api/instastyle/products
// Query params: category, isThrift, limit
// ─────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category  = searchParams.get('category');
    const isThrift  = searchParams.get('isThrift');
    const pageLimit = parseInt(searchParams.get('limit') || '100', 10);

    let q = query(
      collection(db, COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(pageLimit)
    );

    if (category && category !== 'all') {
      q = query(
        collection(db, COLLECTION),
        where('category', '==', category),
        orderBy('timestamp', 'desc'),
        limit(pageLimit)
      );
    }

    if (isThrift === 'true') {
      q = query(
        collection(db, COLLECTION),
        where('isThrift', '==', true),
        orderBy('timestamp', 'desc'),
        limit(pageLimit)
      );
    }

    const snapshot = await getDocs(q);
    const products = [];
    snapshot.forEach((doc) => {
      products.push({ _docId: doc.id, ...doc.data() });
    });

    return NextResponse.json({ success: true, products, count: products.length });
  } catch (error) {
    console.error('[API] GET /instastyle/products error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// POST /api/instastyle/products
// Body: product object (JSON)
// ─────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = ['name', 'price', 'category'];
    const missing = required.filter((f) => !body[f]);
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    // Sanitise and enrich
    const product = {
      id:               body.id || `sku_${Date.now()}`,
      name:             String(body.name).trim(),
      brand:            String(body.brand || 'Unbranded').trim(),
      category:         String(body.category).toLowerCase(),
      subcategory:      String(body.subcategory || '').trim(),
      price:            parseFloat(body.price),
      discountedPrice:  body.discountedPrice ? parseFloat(body.discountedPrice) : null,
      discountPercentage: body.discountPercentage || 0,
      sizes:            Array.isArray(body.sizes) ? body.sizes : [],
      colors:           Array.isArray(body.colors) ? body.colors : [],
      images:           Array.isArray(body.images) ? body.images : [],
      description:      String(body.description || '').trim(),
      material:         String(body.material || '').trim(),
      careInstructions: String(body.careInstructions || '').trim(),
      features:         Array.isArray(body.features) ? body.features : [],
      tags:             Array.isArray(body.tags) ? body.tags : [],
      inStock:          body.inStock !== false,
      inventory:        body.inventory || {},
      rating:           parseFloat(body.rating || 5.0),
      reviewCount:      parseInt(body.reviewCount || 0, 10),
      isFeatured:       Boolean(body.isFeatured),
      isThrift:         Boolean(body.isThrift),
      condition:        body.condition || null,
      originalPrice:    body.originalPrice ? parseFloat(body.originalPrice) : null,
      slug:             body.slug || String(body.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      timestamp:        body.timestamp || Date.now(),
      createdAt:        new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, COLLECTION), product);

    notifyChatbotRefresh();

    return NextResponse.json(
      { success: true, product, docId: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] POST /instastyle/products error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
