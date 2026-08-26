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
 * Run with:
 *   node scripts/seed-grokly-products.mjs
 */

import { products as groklyProducts } from '../lib/groklyProducts.js';
import { dishes, dishIngredients } from '../app/services/grokly/lib/dishesData.js';

const BASE_URL = 'http://localhost:3000';

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
    mood_tags: p.mood_tags || undefined,
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
    headers: { 'Content-Type': 'application/json' },
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