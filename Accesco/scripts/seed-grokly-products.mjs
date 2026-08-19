/**
 * Simple seed script — pushes Grokly's product catalog into Firestore
 * by calling your own running app's POST /api/products endpoint.
 *
 * No service account / admin credentials needed — this just uses
 * fetch() against your local server, same as any frontend would.
 *
 * IMPORTANT: your dev server must already be running (npm run dev)
 * in another terminal before you run this script.
 *
 * POST /api/products now requires an admin-role caller (see
 * app/api/_lib/authz.js). Sign in as an admin account in the browser,
 * grab that account's Firebase ID token (e.g. from devtools:
 * `await firebase.auth().currentUser.getIdToken()`, or your app's own
 * getIdToken() helper), and pass it + the account's uid via env vars:
 *
 * Run with:
 *   ADMIN_ID_TOKEN=<token> ADMIN_UID=<uid> node scripts/seed-grokly-products.mjs
 */

import { products as groklyProducts } from '../lib/groklyProducts.js';
import { dishes, dishIngredients } from '../app/services/grokly/lib/dishesData.js';

const BASE_URL = 'http://localhost:3000';
const ADMIN_ID_TOKEN = process.env.ADMIN_ID_TOKEN || '';
const ADMIN_UID = process.env.ADMIN_UID || '';

if (!ADMIN_ID_TOKEN || !ADMIN_UID) {
  console.warn(
    'Warning: ADMIN_ID_TOKEN/ADMIN_UID not set — POST /api/products now requires an ' +
    'admin-role caller, so every push below will fail with 403. See the header comment ' +
    'in this file for how to obtain them.'
  );
}

function normalizeGrokly(p) {
  return {
    sku: p.id,
    ventureId: 'grokly',
    name: p.name,
    brand: p.brand || '',
    category: p.category,
    subCategory: p.subCategory || null,
    price: p.price,
    mrp: p.mrp ?? p.price,
    discount: p.discount ?? 0,
    unit: p.unit || '',
    image: p.image,
    images: p.images || [p.image].filter(Boolean),
    inStock: p.inStock ?? true,
    stockQty: p.stockQty ?? 100,
    tags: p.tags || [],
    rating: p.rating ?? 0,
    reviews: p.reviews ?? 0,
  };
}

function normalizeDishIngredient(ing) {
  return {
    sku: ing.id,
    ventureId: 'grokly',
    name: ing.name,
    category: 'dish-ingredient',
    price: ing.price,
    mrp: ing.mrp ?? ing.price,
    unit: ing.unit || '',
    image: ing.image,
    inStock: true,
    tags: ['dish-ingredient'],
  };
}

async function pushProduct(product) {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(ADMIN_ID_TOKEN ? { Authorization: `Bearer ${ADMIN_ID_TOKEN}`, 'x-user-id': ADMIN_UID } : {}),
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to push ${product.sku}: ${err.error}`);
  }
}

async function seed() {
  const mainProducts = groklyProducts.map(normalizeGrokly);
  const mainSkus = new Set(mainProducts.map((p) => p.sku));
  const extraIngredients = dishIngredients
    .filter((ing) => !mainSkus.has(ing.id))
    .map(normalizeDishIngredient);

  const all = [...mainProducts, ...extraIngredients];
  console.log(`Seeding ${all.length} products (${mainProducts.length} main + ${extraIngredients.length} dish-only)...`);

  let done = 0;
  for (const product of all) {
    await pushProduct(product);
    done++;
    if (done % 10 === 0) console.log(`  ${done}/${all.length}`);
  }

  console.log(`Done — ${done} products pushed. Check http://localhost:3000/api/products?ventureId=grokly`);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});