/**
 * Seeds the 15 marketing referral codes into Firestore's `referralProfiles`
 * collection, so `?ref=CODE` links and the optional referral-code field in the
 * signup modal resolve to a real referrer document.
 *
 * Idempotent: a code that already exists is left alone (its referralCount,
 * coins and referredUsers history are never reset). Only the campaign metadata
 * is refreshed if the label/channel changed.
 *
 * Run with:
 *   node scripts/seed-marketing-referral-codes.mjs
 *
 * Pass --dry to print what would be written without touching Firestore:
 *   node scripts/seed-marketing-referral-codes.mjs --dry
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

import {
  MARKETING_REFERRAL_CODES,
  marketingProfileDocId,
  marketingReferralLink,
} from '../lib/marketingReferralCodes.js';

// Same public web config as lib/firebase.js — duplicated here because that
// module is bundled for the Next.js client and pulls in storage/auth too.
const firebaseConfig = {
  apiKey: 'AIzaSyBon3Q156u3xNWW2nZw8Z6RxWbfNQezIFM',
  authDomain: 'accesco-db.firebaseapp.com',
  projectId: 'accesco-db',
  storageBucket: 'accesco-db.firebasestorage.app',
  messagingSenderId: '113387637108',
  appId: '1:113387637108:web:1c4b181334431c00190421',
};

const COLLECTION = 'referralProfiles';
const DRY_RUN = process.argv.includes('--dry');

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

async function seedCode({ code, label, channel }) {
  const docId = marketingProfileDocId(code);
  const ref = doc(db, COLLECTION, docId);

  if (DRY_RUN) {
    console.log(`  [dry] ${code.padEnd(12)} → ${docId}  ${marketingReferralLink(code)}`);
    return 'dry';
  }

  const existing = await getDoc(ref);

  if (existing.exists()) {
    // Refresh campaign metadata only — never touch the earned stats.
    await setDoc(
      ref,
      {
        name: label,
        isMarketing: true,
        campaign: { channel, label },
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
    return 'updated';
  }

  await setDoc(ref, {
    // Same shape as a user profile (see lib/referralService.js) so every
    // downstream reader works without special-casing marketing docs.
    phone: null,
    name: label,
    referralCode: code,
    referredBy: null,
    referredByProcessed: true, // marketing codes are never themselves referred
    referralCount: 0,
    coins: 0,
    milestoneClaims: {},
    hasOrderedAt: null,
    createdAt: new Date().toISOString(),

    // Marketing-only fields
    isMarketing: true,
    campaign: { channel, label },
  });

  return 'created';
}

async function main() {
  console.log(
    `\nSeeding ${MARKETING_REFERRAL_CODES.length} marketing referral codes into "${COLLECTION}"` +
      `${DRY_RUN ? ' (dry run)' : ''}...\n`,
  );

  const tally = { created: 0, updated: 0, dry: 0, failed: 0 };

  for (const entry of MARKETING_REFERRAL_CODES) {
    try {
      const result = await seedCode(entry);
      tally[result] += 1;

      if (result !== 'dry') {
        console.log(
          `  ${result === 'created' ? '+' : '~'} ${entry.code.padEnd(12)} ${result.padEnd(8)} ${marketingReferralLink(entry.code)}`,
        );
      }
    } catch (err) {
      tally.failed += 1;
      console.error(`  ! ${entry.code.padEnd(12)} failed:`, err.message);
    }
  }

  console.log(
    `\nDone. created: ${tally.created}, updated: ${tally.updated}` +
      `${DRY_RUN ? `, dry: ${tally.dry}` : ''}, failed: ${tally.failed}\n`,
  );

  process.exit(tally.failed > 0 ? 1 : 0);
}

main();
