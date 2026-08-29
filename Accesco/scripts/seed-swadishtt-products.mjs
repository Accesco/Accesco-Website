/**
 * Seed script — pushes Swadishtt's existing static menu data
 * (app/services/swadisht/lib/swadishttData.js's RESTAURANTS[].menu[]) into
 * the new swadishtt_products Firestore collection via POST /api/swadishtt/
 * products, the same way scripts/seed-grokly-products.mjs seeds Grokly.
 *
 * Restaurant-level metadata (images, offers, timings, location) is NOT
 * migrated — it stays in the static file; only individual menu items
 * become real backend-managed catalog entries.
 *
 * IMPORTANT: your dev server must already be running (npm run dev)
 * in another terminal before you run this script.
 *
 * POST /api/swadishtt/products requires an admin-role caller (see
 * app/api/_lib/authz.js) — same as scripts/seed-grokly-products.mjs, sign
 * in as an admin account and grab that account's Firebase ID token.
 *
 * Run with:
 *   ADMIN_ID_TOKEN=<token> ADMIN_UID=<uid> node scripts/seed-swadishtt-products.mjs
 *
 * Pass --dry to print what would be pushed without calling the API:
 *   node scripts/seed-swadishtt-products.mjs --dry
 */

import { RESTAURANTS } from '../app/services/swadisht/lib/swadishttData.js';

const BASE_URL = 'http://localhost:3000';
const DRY_RUN = process.argv.includes('--dry');
const ADMIN_ID_TOKEN = process.env.ADMIN_ID_TOKEN || '';
const ADMIN_UID = process.env.ADMIN_UID || '';

if (!DRY_RUN && (!ADMIN_ID_TOKEN || !ADMIN_UID)) {
  console.warn(
    'Warning: ADMIN_ID_TOKEN/ADMIN_UID not set — POST /api/swadishtt/products requires an ' +
    'admin-role caller, so every push below will fail with 403. See the header comment ' +
    'in this file for how to obtain them, or pass --dry to preview without pushing.'
  );
}

function normalizeMenuItem(restaurant, dish) {
  return {
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    name: dish.name,
    description: dish.description || '',
    price: dish.price,
    image: dish.image || '',
    category: dish.category || 'Main Course',
    isVeg: !!dish.isVeg,
    isBestseller: !!dish.isBestseller,
    inStock: true,
    isActive: true,
  };
}

// POST /api/swadishtt/products always addDoc()s a brand-new document (see
// that route) with no upsert-by-id behavior — running this script twice
// would create duplicate menu items unless already-migrated dishes are
// skipped. There's no stable id to check (the static menu items' own ids
// aren't carried into the backend schema), so existing items per restaurant
// are fetched once via the already-existing GET ?restaurantId= filter and
// matched by name — good enough to make re-running this script safe
// without adding a new field just for this.
async function fetchExistingNames(restaurantId) {
  const res = await fetch(`${BASE_URL}/api/swadishtt/products?restaurantId=${encodeURIComponent(restaurantId)}`);
  if (!res.ok) return new Set();
  const data = await res.json();
  return new Set((data.products || []).map((p) => p.name));
}

async function pushProduct(product) {
  const res = await fetch(`${BASE_URL}/api/swadishtt/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(ADMIN_ID_TOKEN ? { Authorization: `Bearer ${ADMIN_ID_TOKEN}`, 'x-user-id': ADMIN_UID } : {}),
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to push "${product.name}" (${product.restaurantId}): ${err.error}`);
  }
}

async function seed() {
  let pushed = 0;
  let skipped = 0;
  for (const restaurant of RESTAURANTS) {
    const existingNames = DRY_RUN ? new Set() : await fetchExistingNames(restaurant.id);

    for (const dish of restaurant.menu || []) {
      const product = normalizeMenuItem(restaurant, dish);

      if (DRY_RUN) {
        console.log(`  [dry] ${restaurant.name} — ${product.name} (₹${product.price})`);
        pushed++;
        continue;
      }

      if (existingNames.has(product.name)) {
        console.log(`  skipped (already migrated): ${restaurant.name} — ${product.name}`);
        skipped++;
        continue;
      }

      await pushProduct(product);
      console.log(`  pushed: ${restaurant.name} — ${product.name}`);
      pushed++;
    }
  }
  console.log(`\nDone — ${pushed} ${DRY_RUN ? 'previewed' : 'pushed'}, ${skipped} already-migrated items skipped.`);
  if (!DRY_RUN) {
    console.log('Check http://localhost:3000/api/swadishtt/products');
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
