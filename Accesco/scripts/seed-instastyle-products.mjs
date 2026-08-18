/**
 * Seed script — pushes the bundled static InstaStyle catalog
 * (lib/mockData.js's `products` export, whose own header comment says
 * "This will be replaced with real Firebase data later") into the real
 * instastyle_products Firestore collection via POST /api/instastyle/
 * products, the same way scripts/seed-grokly-products.mjs seeds Grokly.
 *
 * This is optional and NOT run automatically — the app already resolves
 * products from Firestore first and falls back to the static catalog for
 * anything not yet migrated (see app/api/_lib/instastyleCart.js's
 * resolveProduct), so nothing breaks if this is never run. Running it lets
 * previously-static catalog items get real backend features they didn't
 * have before: stock decrement on order (app/api/_lib/inventory.js),
 * transactional stock validation on add-to-cart, and admin edit/deactivate
 * via PUT/DELETE /api/instastyle/products/[id].
 *
 * IMPORTANT: your dev server must already be running (npm run dev)
 * in another terminal before you run this script.
 *
 * POST /api/instastyle/products requires an admin-role caller (see
 * app/api/_lib/authz.js) — same convention as the other seed scripts.
 *
 * Run with:
 *   ADMIN_ID_TOKEN=<token> ADMIN_UID=<uid> node scripts/seed-instastyle-products.mjs
 *
 * Pass --dry to preview without pushing:
 *   node scripts/seed-instastyle-products.mjs --dry
 */

import { products } from '../lib/mockData.js';

const BASE_URL = 'http://localhost:3000';
const DRY_RUN = process.argv.includes('--dry');
const ADMIN_ID_TOKEN = process.env.ADMIN_ID_TOKEN || '';
const ADMIN_UID = process.env.ADMIN_UID || '';

if (!DRY_RUN && (!ADMIN_ID_TOKEN || !ADMIN_UID)) {
  console.warn(
    'Warning: ADMIN_ID_TOKEN/ADMIN_UID not set — POST /api/instastyle/products requires an ' +
    'admin-role caller, so every push below will fail with 403. See the header comment ' +
    'in this file for how to obtain them, or pass --dry to preview without pushing.'
  );
}

// Passes the static product through mostly as-is — its shape already
// matches what POST /api/instastyle/products expects (same field names:
// name, brand, category, subcategory, price, discountedPrice, sizes,
// colors, images, description, material, careInstructions, features, tags,
// inStock, inventory, rating, reviewCount, isFeatured, slug).
function normalizeProduct(p) {
  return { ...p };
}

// POST /api/instastyle/products always addDoc()s a brand-new document (see
// that route) — unlike Grokly/Swadishtt's upsert-by-sku products routes,
// it has no built-in "already exists" upsert behavior, so running this
// script twice would create duplicate Firestore docs for the same product
// id if it just pushed unconditionally. Checking existence first (via the
// already-existing GET /api/instastyle/products/[id], which resolves by
// the `id` field the same way the cart backend does) makes re-running this
// script safe: already-migrated products are skipped, not duplicated.
async function alreadyExists(productId) {
  const res = await fetch(`${BASE_URL}/api/instastyle/products/${encodeURIComponent(productId)}`);
  return res.ok;
}

async function pushProduct(product) {
  const res = await fetch(`${BASE_URL}/api/instastyle/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(ADMIN_ID_TOKEN ? { Authorization: `Bearer ${ADMIN_ID_TOKEN}`, 'x-user-id': ADMIN_UID } : {}),
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to push "${product.name}" (${product.id}): ${err.error}`);
  }
}

async function seed() {
  let pushed = 0;
  let skipped = 0;
  for (const p of products) {
    const product = normalizeProduct(p);

    if (DRY_RUN) {
      console.log(`  [dry] ${product.name} (${product.id}) — ₹${product.price}`);
      pushed++;
      continue;
    }

    if (await alreadyExists(product.id)) {
      console.log(`  skipped (already migrated): ${product.name}`);
      skipped++;
      continue;
    }

    await pushProduct(product);
    console.log(`  pushed: ${product.name}`);
    pushed++;
  }
  console.log(`\nDone — ${pushed} ${DRY_RUN ? 'previewed' : 'pushed'}, ${skipped} already-migrated products skipped.`);
  if (!DRY_RUN) {
    console.log('Check http://localhost:3000/api/instastyle/products');
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
