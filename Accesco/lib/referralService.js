import { db, auth } from './firebase';
import {
  collection,
  query,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  doc,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { isMarketingReferralCode } from './marketingReferralCodes';

const COLLECTION = 'referralProfiles';
const VISITS_COLLECTION = 'referralVisits';

/**
 * Generates a random alphanumeric referral code (e.g. ACC8X2A). Retries on the
 * (astronomically unlikely) chance of landing on one of our house marketing
 * codes, which share the ACC prefix — see lib/marketingReferralCodes.js.
 */
function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result;

  do {
    result = 'ACC';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (isMarketingReferralCode(result));

  return result;
}

/** Trims/uppercases a referral code, returning null for anything empty. */
export function normalizeReferralCode(code) {
  const clean = String(code || '').trim().toUpperCase();
  return clean || null;
}

/** Shape check only — call validateReferralCode() to confirm it really exists. */
export function isValidReferralCodeFormat(code) {
  return /^[A-Z0-9]{4,20}$/.test(normalizeReferralCode(code) || '');
}

/**
 * Confirms a referral code resolves to a real profile (a user's code or one of
 * the house marketing codes), so a mistyped code is caught before signup
 * instead of silently failing attribution afterwards.
 *
 * A network/server failure resolves to `{ valid: null }` — "couldn't check",
 * which callers should treat as non-blocking rather than as "wrong code".
 *
 * @returns {Promise<{ valid: boolean|null, referrerName?: string, isMarketing?: boolean }>}
 */
export async function validateReferralCode(code) {
  const clean = normalizeReferralCode(code);
  if (!clean) return { valid: false, reason: 'empty' };

  try {
    const response = await fetch('/api/referral/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: clean }),
    });

    if (!response.ok) return { valid: null };

    return await response.json();
  } catch (err) {
    console.error('[referral] Failed to validate referral code:', err);
    return { valid: null };
  }
}

function normalizePhoneDigits(phone) {
  return String(phone || '').replace(/[^\d]/g, '');
}

/**
 * Waits for the Firebase Auth SDK to finish restoring any existing session,
 * so `auth.currentUser` isn't spuriously null on a fresh page load.
 */
async function waitForAuth() {
  if (typeof auth.authStateReady === 'function') {
    await auth.authStateReady();
    return auth.currentUser;
  }

  // Fallback for older SDKs: resolve on the first auth state callback.
  return new Promise((resolve) => {
    const unsub = auth.onAuthStateChanged((user) => {
      unsub();
      resolve(user);
    });
  });
}

/**
 * Reads a `?ref=CODE` referral code from the current URL and records it in
 * Firestore (`referralVisits/{uid}`), so it survives until the visitor
 * actually signs up — which may happen on a later page, or a later visit
 * entirely. Nothing is kept in browser storage.
 *
 * Anonymous visitors have no identity to key the visit on, so we mint one with
 * Firebase Anonymous Auth; the SDK keeps that uid across reloads and return
 * visits. This only runs for visitors who actually arrived on a `?ref=` link,
 * so we don't create an anonymous account for every casual visitor.
 *
 * Never overwrites an existing visit doc, so the first link a visitor clicks
 * wins — same rule as before.
 */
export async function captureReferralCodeFromUrl() {
  if (typeof window === 'undefined') return;

  const ref = normalizeReferralCode(
    new URLSearchParams(window.location.search).get('ref'),
  );
  if (!ref) return;

  try {
    let user = await waitForAuth();

    // Already signed in for real? Attribution only ever happens at signup, so
    // there's nothing to hold onto for an existing account.
    if (user && !user.isAnonymous) return;

    if (!user) {
      user = (await signInAnonymously(auth)).user;
    }

    const visitRef = doc(db, VISITS_COLLECTION, user.uid);
    const existing = await getDoc(visitRef);
    if (existing.exists()) return; // first link wins

    await setDoc(visitRef, {
      referralCode: ref,
      landingPath: window.location.pathname,
      capturedAt: new Date().toISOString(),
      consumed: false,
    });
  } catch (err) {
    // Attribution is best-effort — a blocked anonymous sign-in or a rules
    // rejection must never break the page the visitor actually came for.
    console.error('[referral] Failed to capture referral code:', err);
  }
}

/** The `?ref=CODE` on the URL right now, if the visitor is still on that page. */
function referralCodeFromCurrentUrl() {
  if (typeof window === 'undefined') return null;
  return normalizeReferralCode(
    new URLSearchParams(window.location.search).get('ref'),
  );
}

/**
 * Reads back the referral visit captured by captureReferralCodeFromUrl().
 * Returns the code plus the anonymous uid it's filed under, because signing in
 * with a phone number replaces the anonymous user — callers need the uid if
 * they want to mark the visit consumed afterwards.
 *
 * Falls back to the live URL parameter when there's no stored visit. That
 * covers the common case of signing up on the same page the link landed on,
 * and keeps `?ref=` links working even if Anonymous Auth is turned off in the
 * Firebase console (in which case nothing can be persisted pre-signup).
 *
 * @returns {Promise<{ code: string, visitUid: string | null } | null>}
 */
export async function getPendingReferral() {
  if (typeof window === 'undefined') return null;

  try {
    const user = await waitForAuth();

    if (user?.isAnonymous) {
      const snap = await getDoc(doc(db, VISITS_COLLECTION, user.uid));

      if (snap.exists() && !snap.data().consumed) {
        const code = normalizeReferralCode(snap.data().referralCode);
        if (code) return { code, visitUid: user.uid };
      }
    }
  } catch (err) {
    console.error('[referral] Failed to read pending referral:', err);
  }

  const urlCode = referralCodeFromCurrentUrl();
  return urlCode ? { code: urlCode, visitUid: null } : null;
}

/**
 * Marks a captured visit as spent once the visitor has signed up, so a shared
 * device doesn't re-apply the same link to the next person. Best-effort: the
 * durable record of who referred whom is `referredBy` on the referral profile.
 */
export async function markReferralVisitConsumed(visitUid, phoneDigits = null) {
  if (!visitUid) return;

  try {
    await updateDoc(doc(db, VISITS_COLLECTION, visitUid), {
      consumed: true,
      consumedAt: new Date().toISOString(),
      consumedByPhone: phoneDigits ? normalizePhoneDigits(phoneDigits) : null,
    });
  } catch (err) {
    console.error('[referral] Failed to mark referral visit consumed:', err);
  }
}

/**
 * Initializes a referral profile for a newly phone-verified user. Keyed by
 * phone digits, since that's the one identifier every account has (email is
 * optional, and Firebase Auth uids differ between the phone and social
 * sign-in paths — see AuthModal.jsx).
 * @param {string} phone
 * @param {string} name
 * @param {string} referredByCode
 * @returns {Promise<string>} The user's referral code
 */
export async function initializeReferralProfile(phone, name, referredByCode = null) {
  const digits = normalizePhoneDigits(phone);
  if (digits.length < 7) throw new Error('A valid phone number is required');

  try {
    const profileRef = doc(db, COLLECTION, digits);

    // Check if profile exists already to prevent duplicates / re-attribution
    const existingSnap = await getDoc(profileRef);
    if (existingSnap.exists()) {
      return existingSnap.data().referralCode;
    }

    const newCode = generateReferralCode();
    const cleanReferredBy = normalizeReferralCode(referredByCode);

    await setDoc(profileRef, {
      phone: digits,
      name: name?.trim() || '',
      referralCode: newCode,
      referredBy: cleanReferredBy,
      referredByProcessed: false,
      referralCount: 0,
      coins: 0,
      tierClaims: {},
      badges: [],
      freeDeliveryUntil: null,
      waitlistJoinedAt: null,
      createdAt: new Date().toISOString(),
    });

    // If referred by someone, trigger the attribution API securely
    if (cleanReferredBy) {
      await fetch('/api/referral/attribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refereePhone: digits,
          referredBy: cleanReferredBy,
        }),
      }).catch((err) => console.error('Failed to attribute referral:', err));
    }

    return newCode;
  } catch (error) {
    console.error('Error initializing referral profile:', error);
    throw error;
  }
}

/**
 * Fetches the user's referral stats
 */
export async function getUserReferralStats(phone) {
  const digits = normalizePhoneDigits(phone);
  if (digits.length < 7) return null;

  const snap = await getDoc(doc(db, COLLECTION, digits));
  return snap.exists() ? snap.data() : null;
}

/**
 * Live-subscribes to a user's referral stats, for the real-time progress
 * meter. Returns an unsubscribe function.
 */
export function subscribeToReferralStats(phone, onUpdate) {
  const digits = normalizePhoneDigits(phone);
  if (digits.length < 7) return () => {};

  const profileRef = doc(db, COLLECTION, digits);
  return onSnapshot(profileRef, (snap) => {
    onUpdate(snap.exists() ? snap.data() : null);
  });
}

/**
 * Fetches top 10 leaderboard. Over-fetches and drops house marketing profiles
 * client-side — a `where('isMarketing','!=',true)` alongside the orderBy would
 * need a composite index and would also exclude pre-existing profiles that
 * simply don't carry the field.
 */
export async function getLeaderboard() {
  const q = query(collection(db, COLLECTION), orderBy('referralCount', 'desc'), limit(40));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map(doc => doc.data())
    .filter(data => data.isMarketing !== true)
    .slice(0, 10)
    .map(data => ({
      // Only return safe public info
      name: data.name || 'Anonymous',
      referralCount: data.referralCount || 0,
      coins: data.coins || 0,
    }));
}
