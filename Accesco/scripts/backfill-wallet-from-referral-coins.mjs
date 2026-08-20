/**
 * One-off backfill: mirrors coins earned on existing referralProfiles docs
 * (from before the wallet system existed) into the new wallets/{uid} ledger,
 * so users who earned referral rewards before this change can see and
 * eventually spend them from the same wallet balance new rewards land in.
 *
 * referralProfiles.coins itself is left completely untouched — this only
 * ADDS a matching wallet credit, using the referral profile's own doc ID
 * (phone digits) as the wallet uid, exactly like the live mirror added to
 * app/api/referral/attribute/route.js for new referrals going forward. See
 * that route's comment for why phone digits are the right identity here.
 *
 * Idempotent: each profile gets a single deterministic ledger entry
 * (backfill_<docId>), so running this more than once does not double-credit.
 * Marketing/house codes (docId starting with MKT_) are skipped — those are
 * campaign codes, not real user accounts with a wallet to credit.
 *
 * This script is NOT run automatically as part of any deploy or build step.
 * Review the --dry output before running for real.
 *
 * Run with:
 *   node scripts/backfill-wallet-from-referral-coins.mjs --dry
 *   node scripts/backfill-wallet-from-referral-coins.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const DRY_RUN = process.argv.includes('--dry');

function loadEnv() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  let envPath = path.resolve(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    envPath = path.resolve(__dirname, '../.env');
  }
  if (!fs.existsSync(envPath)) {
    console.error('Error: Neither .env.local nor .env file was found at project root.');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...valueParts] = trimmed.split('=');
    env[key.trim()] = valueParts.join('=').trim();
  });
  return env;
}

// Duplicates (deliberately, not imported) the same credit-transaction shape
// as app/api/_lib/wallet.js's creditWallet — that file uses the '@/...'
// Next.js path alias, which only resolves inside the Next.js build, not a
// plain `node script.mjs` run, and importing it would also hit the same
// env-var-load-order problem loadEnv() above works around.
async function creditWallet(adminDb, { uid, amount, reason, source, referenceId, idempotencyKey }) {
  const wRef = adminDb.collection('wallets').doc(uid);
  const tRef = wRef.collection('transactions').doc(idempotencyKey);

  return adminDb.runTransaction(async (tx) => {
    const [walletSnap, txSnap] = await Promise.all([tx.get(wRef), tx.get(tRef)]);

    if (txSnap.exists) {
      const currentBalance = walletSnap.exists ? walletSnap.data().balance || 0 : 0;
      return { balance: currentBalance, applied: false };
    }

    const currentBalance = walletSnap.exists ? walletSnap.data().balance || 0 : 0;
    const newBalance = currentBalance + amount;

    tx.set(
      wRef,
      {
        balance: newBalance,
        updatedAt: FieldValue.serverTimestamp(),
        ...(walletSnap.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
      },
      { merge: true }
    );
    tx.set(tRef, {
      type: 'credit',
      amount,
      reason,
      source,
      referenceId,
      balanceAfter: newBalance,
      createdAt: FieldValue.serverTimestamp(),
    });

    return { balance: newBalance, applied: true };
  });
}

async function main() {
  const env = loadEnv();
  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    console.error('Error: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY must all be set in .env.local.');
    process.exit(1);
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }
  const adminDb = getFirestore();

  const snap = await adminDb.collection('referralProfiles').get();
  console.log(`Found ${snap.size} referralProfiles docs.`);

  let credited = 0;
  let alreadyDone = 0;
  let skipped = 0;

  for (const docSnap of snap.docs) {
    const docId = docSnap.id;
    const data = docSnap.data();
    const coins = Number(data.coins) || 0;

    if (docId.startsWith('MKT_') || coins <= 0) {
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`  [dry] would credit wallets/${docId} with ${coins} coins`);
      credited++;
      continue;
    }

    const result = await creditWallet(adminDb, {
      uid: docId,
      amount: coins,
      reason: 'Pre-wallet referral coin backfill',
      source: 'referral_backfill',
      referenceId: docId,
      idempotencyKey: `backfill_${docId}`,
    });

    if (result.applied) {
      console.log(`  credited wallets/${docId}: +${coins} → balance ${result.balance}`);
      credited++;
    } else {
      console.log(`  wallets/${docId} already backfilled — skipped`);
      alreadyDone++;
    }
  }

  console.log(`\nDone. Credited: ${credited}, already backfilled: ${alreadyDone}, skipped (no coins / marketing code): ${skipped}.`);
  if (DRY_RUN) console.log('(dry run — nothing was written)');
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
