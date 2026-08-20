/**
 * Server-only wallet/ledger helpers (Firebase Admin SDK — same tier as
 * _lib/instastyleCart.js / _lib/xpenseMeter.js). The wallet collection is
 * never touched by the client Firestore SDK; every read/write goes through
 * these functions from an authenticated API route.
 *
 * Data model:
 *   wallets/{uid}                          — { balance, createdAt, updatedAt }
 *   wallets/{uid}/transactions/{txId}      — append-only ledger entry
 *
 * Balance is a stored running total, updated only inside the same Firestore
 * transaction as its ledger entry — never computed by summing transactions
 * at read time. Every credit/debit accepts an idempotencyKey used as the
 * ledger entry's own doc ID (mirrors the deterministic-ID-as-idempotency
 * pattern already used for cart items in _lib/instastyleCart.js): replaying
 * the same key is a no-op that returns the already-applied result instead
 * of crediting/debiting twice.
 */

import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

function walletRef(uid) {
  return adminDb.collection('wallets').doc(uid);
}

function transactionsCollection(uid) {
  return walletRef(uid).collection('transactions');
}

export async function getOrInitWallet(uid) {
  const ref = walletRef(uid);
  const snap = await ref.get();
  if (snap.exists) {
    return { balance: snap.data().balance || 0 };
  }
  await ref.set(
    { balance: 0, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  return { balance: 0 };
}

export async function listRecentTransactions(uid, limitCount = 50) {
  const snap = await transactionsCollection(uid).orderBy('createdAt', 'desc').limit(limitCount).get();
  // Admin SDK Timestamp objects don't serialize cleanly through
  // NextResponse.json() — convert to ISO strings before they leave here.
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
    };
  });
}

async function applyLedgerEntry({ uid, amount, type, reason, source, referenceId, idempotencyKey }) {
  if (!uid) {
    return { error: 'uid is required', status: 400 };
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: 'amount must be a positive finite number', status: 400 };
  }
  if (!idempotencyKey) {
    return { error: 'idempotencyKey is required', status: 400 };
  }

  const wRef = walletRef(uid);
  const tRef = transactionsCollection(uid).doc(idempotencyKey);

  return adminDb.runTransaction(async (tx) => {
    const [walletSnap, txSnap] = await Promise.all([tx.get(wRef), tx.get(tRef)]);

    // Replaying an idempotency key that already applied is a no-op — the
    // caller gets back the already-settled result instead of a double
    // credit/debit. This is what makes a retried request (or a referral
    // attribution call that legitimately can't run twice for the same
    // referee) safe to call more than once.
    if (txSnap.exists) {
      const currentBalance = walletSnap.exists ? walletSnap.data().balance || 0 : 0;
      return { balance: currentBalance, applied: false, transactionId: idempotencyKey };
    }

    const currentBalance = walletSnap.exists ? walletSnap.data().balance || 0 : 0;
    const delta = type === 'credit' ? amount : -amount;
    const newBalance = currentBalance + delta;

    if (newBalance < 0) {
      return { error: 'Insufficient balance', status: 400, balance: currentBalance };
    }

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
      type,
      amount,
      reason: reason || null,
      source: source || null,
      referenceId: referenceId || null,
      balanceAfter: newBalance,
      createdAt: FieldValue.serverTimestamp(),
    });

    return { balance: newBalance, applied: true, transactionId: idempotencyKey };
  });
}

export async function creditWallet({ uid, amount, reason, source, referenceId, idempotencyKey }) {
  return applyLedgerEntry({ uid, amount, type: 'credit', reason, source, referenceId, idempotencyKey });
}

export async function debitWallet({ uid, amount, reason, source, referenceId, idempotencyKey }) {
  return applyLedgerEntry({ uid, amount, type: 'debit', reason, source, referenceId, idempotencyKey });
}
