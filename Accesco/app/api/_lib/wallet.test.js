/**
 * Unit tests for the wallet ledger helpers (see wallet.js's header comment).
 * The Admin SDK is mocked so these exercise only wallet.js's own
 * credit/debit/idempotency logic, not Firestore itself.
 */

jest.mock('@/lib/firebaseAdmin', () => ({
  adminDb: {
    collection: jest.fn(),
    runTransaction: jest.fn(),
  },
}));

jest.mock('firebase-admin/firestore', () => ({
  FieldValue: { serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP') },
}));

const { adminDb } = require('@/lib/firebaseAdmin');
const { creditWallet, debitWallet } = require('./wallet');

// In-memory fake Firestore: wallet doc + transaction docs, keyed the same
// way wallet.js addresses them (wallets/{uid}/transactions/{txId}), just
// enough to make tx.get/tx.set and runTransaction behave realistically.
function makeFakeFirestore(initialWallets = {}) {
  const wallets = { ...initialWallets }; // uid -> { balance }
  const transactions = {}; // `${uid}/${txId}` -> data

  const walletDoc = (uid) => ({
    __type: 'wallet',
    uid,
  });
  const txDoc = (uid, txId) => ({
    __type: 'tx',
    uid,
    txId,
  });

  adminDb.collection.mockImplementation((name) => {
    if (name !== 'wallets') throw new Error(`Unexpected top-level collection: ${name}`);
    return {
      doc: (uid) => ({
        ...walletDoc(uid),
        collection: (sub) => {
          if (sub !== 'transactions') throw new Error(`Unexpected subcollection: ${sub}`);
          return { doc: (txId) => txDoc(uid, txId) };
        },
      }),
    };
  });

  // Real Firestore transactions never partially interleave their effective
  // reads+writes against the same documents — one call's whole read-modify-
  // write always completes (commits or retries) before another touching the
  // same doc proceeds. This queue is a simplified stand-in for that
  // guarantee, so the "concurrent" test below is honestly exercising the
  // idempotency-key guard under serialized-transaction semantics, not
  // asserting something the fake wouldn't actually enforce.
  let queue = Promise.resolve();
  adminDb.runTransaction.mockImplementation((fn) => {
    const run = queue.then(() => runOnce(fn));
    queue = run.catch(() => {});
    return run;
  });

  async function runOnce(fn) {
    const tx = {
      get: async (ref) => {
        if (ref.__type === 'wallet') {
          const w = wallets[ref.uid];
          return { exists: !!w, data: () => w };
        }
        const key = `${ref.uid}/${ref.txId}`;
        const t = transactions[key];
        return { exists: !!t, data: () => t };
      },
      set: (ref, data) => {
        if (ref.__type === 'wallet') {
          wallets[ref.uid] = { ...(wallets[ref.uid] || {}), ...data };
        } else {
          transactions[`${ref.uid}/${ref.txId}`] = data;
        }
      },
    };
    return fn(tx);
  }

  return { wallets, transactions };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('creditWallet', () => {
  test('increases balance and writes one ledger entry', async () => {
    const { wallets, transactions } = makeFakeFirestore();

    const result = await creditWallet({
      uid: 'user1',
      amount: 50,
      reason: 'Test credit',
      source: 'test',
      referenceId: 'REF1',
      idempotencyKey: 'credit_1',
    });

    expect(result).toEqual({ balance: 50, applied: true, transactionId: 'credit_1' });
    expect(wallets.user1.balance).toBe(50);
    expect(transactions['user1/credit_1']).toMatchObject({ type: 'credit', amount: 50, balanceAfter: 50 });
  });

  test('rejects a non-positive amount without touching Firestore', async () => {
    makeFakeFirestore();
    const result = await creditWallet({ uid: 'user1', amount: 0, idempotencyKey: 'x' });
    expect(result.error).toBeDefined();
    expect(adminDb.runTransaction).not.toHaveBeenCalled();
  });

  test('replaying the same idempotencyKey applies only once', async () => {
    const { wallets } = makeFakeFirestore();

    const first = await creditWallet({ uid: 'user1', amount: 20, idempotencyKey: 'coupon_ACCESCO20_user1' });
    const second = await creditWallet({ uid: 'user1', amount: 20, idempotencyKey: 'coupon_ACCESCO20_user1' });

    expect(first.applied).toBe(true);
    expect(second.applied).toBe(false);
    expect(wallets.user1.balance).toBe(20); // not 40
  });

  test('a simulated concurrent double-credit against the same key resolves to a single applied credit', async () => {
    makeFakeFirestore();
    const args = { uid: 'user1', amount: 30, idempotencyKey: 'dup_key' };

    // Two "concurrent" calls awaited together — the fake runTransaction runs
    // them sequentially (as Promise.all still awaits both to completion),
    // which is enough to prove the idempotency-key guard (not raw DB-level
    // locking) is what prevents the double-apply here.
    const [a, b] = await Promise.all([creditWallet(args), creditWallet(args)]);
    const appliedCount = [a.applied, b.applied].filter(Boolean).length;
    expect(appliedCount).toBe(1);
  });
});

describe('debitWallet', () => {
  test('decreases balance', async () => {
    const { wallets } = makeFakeFirestore({ user1: { balance: 100 } });
    const result = await debitWallet({ uid: 'user1', amount: 40, idempotencyKey: 'debit_1' });
    expect(result).toEqual({ balance: 60, applied: true, transactionId: 'debit_1' });
    expect(wallets.user1.balance).toBe(60);
  });

  test('debit exceeding balance is rejected and balance is unchanged', async () => {
    const { wallets } = makeFakeFirestore({ user1: { balance: 10 } });
    const result = await debitWallet({ uid: 'user1', amount: 50, idempotencyKey: 'debit_2' });
    expect(result.error).toBe('Insufficient balance');
    expect(wallets.user1.balance).toBe(10);
  });

  test('duplicate idempotencyKey debit is only applied once', async () => {
    const { wallets } = makeFakeFirestore({ user1: { balance: 100 } });
    await debitWallet({ uid: 'user1', amount: 20, idempotencyKey: 'debit_once' });
    const second = await debitWallet({ uid: 'user1', amount: 20, idempotencyKey: 'debit_once' });
    expect(second.applied).toBe(false);
    expect(wallets.user1.balance).toBe(80); // not 60
  });
});
