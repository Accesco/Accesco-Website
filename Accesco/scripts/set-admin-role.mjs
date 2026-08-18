/**
 * One-off bootstrap script: grants (or revokes) the 'admin' role on a
 * users/{docId} Firestore document, via the Firebase Admin SDK (service
 * account credentials — NOT the client SDK, so it bypasses Firestore
 * security rules the same way every app/api/** route already does).
 *
 * There is intentionally no API route that can do this — self-elevation
 * must never be reachable over HTTP (see app/api/_lib/authz.js). This is
 * the only way to create the first admin account; every /api/products,
 * /api/instastyle/products, /api/instastyle/upload write, and the
 * platform-wide "latest 50 orders" reads now require it (see
 * app/api/_lib/authz.js's requireAdmin/requireOwnerOrAdmin).
 *
 * The target user doc must already exist (i.e. the person has signed up
 * at least once through the app) — this script only flips their role
 * field, it does not create accounts.
 *
 * Usage — identify the account by whichever id its users/{docId} doc uses
 * (phone digits for a phone-only account, Firebase uid for a Google-linked
 * one — see AuthProvider.jsx's docId convention):
 *
 *   node scripts/set-admin-role.mjs --phone=9198XXXXXXX
 *   node scripts/set-admin-role.mjs --uid=abc123
 *
 * Revoke with --remove:
 *
 *   node scripts/set-admin-role.mjs --phone=9198XXXXXXX --remove
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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

function parseArgs() {
  const args = { remove: process.argv.includes('--remove') };
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--phone=')) args.phone = arg.slice('--phone='.length).replace(/[^\d]/g, '');
    if (arg.startsWith('--uid=')) args.uid = arg.slice('--uid='.length);
  }
  return args;
}

async function main() {
  const { phone, uid, remove } = parseArgs();
  const docId = uid || phone;

  if (!docId) {
    console.error('Usage: node scripts/set-admin-role.mjs --phone=<digits> | --uid=<uid> [--remove]');
    process.exit(1);
  }

  const env = loadEnv();
  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    console.error(
      'Error: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY must all be set ' +
      'in .env.local (service-account admin credentials — the same ones app/api routes use via lib/firebaseAdmin.js).'
    );
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

  const ref = adminDb.collection('users').doc(docId);
  const snap = await ref.get();
  if (!snap.exists) {
    console.error(`Error: users/${docId} does not exist. The account must sign up in the app first.`);
    process.exit(1);
  }

  const role = remove ? 'user' : 'admin';
  await ref.set({ role }, { merge: true });

  const data = snap.data();
  console.log(
    `${remove ? 'Revoked admin from' : 'Granted admin to'} users/${docId} ` +
    `(${data.name || data.phone || data.email || 'unnamed'}) — role is now '${role}'.`
  );
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
