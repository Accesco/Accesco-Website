import { db } from './firebase';
import {
  collection,
  query,
  getDoc,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore';

const COLLECTION = 'referralProfiles';
const REFERRED_BY_STORAGE_KEY = 'accesco_referred_by';

/**
 * Generates a random alphanumeric referral code (e.g. ACC8X2A)
 */
function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ACC';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function normalizePhoneDigits(phone) {
  return String(phone || '').replace(/[^\d]/g, '');
}

/**
 * Reads a `?ref=CODE` referral code from the current URL and stores it in
 * localStorage so it survives until the visitor actually signs up (which may
 * happen on a later page, or a later visit entirely). Never overwrites a code
 * that's already stored, so the first link a visitor clicks wins.
 */
export function captureReferralCodeFromUrl() {
  if (typeof window === 'undefined') return;

  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (!ref) return;

    const existing = localStorage.getItem(REFERRED_BY_STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(REFERRED_BY_STORAGE_KEY, ref.trim().toUpperCase());
    }
  } catch (_) {
    // localStorage unavailable — referral attribution just won't apply
  }
}

/** Reads back the referral code captured by captureReferralCodeFromUrl(), if any. */
export function getStoredReferralCode() {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(REFERRED_BY_STORAGE_KEY) || null;
  } catch (_) {
    return null;
  }
}

export function clearStoredReferralCode() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(REFERRED_BY_STORAGE_KEY);
  } catch (_) {}
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
    const cleanReferredBy =
      referredByCode && referredByCode.trim() ? referredByCode.trim().toUpperCase() : null;

    await setDoc(profileRef, {
      phone: digits,
      name: name?.trim() || '',
      referralCode: newCode,
      referredBy: cleanReferredBy,
      referredByProcessed: false,
      referralCount: 0,
      coins: 0,
      milestoneClaims: {},
      hasOrderedAt: null,
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

      clearStoredReferralCode();
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
 * Claims a gift for a reached-but-unclaimed milestone. Server-validates the
 * referral count, tier, and gift choice — see app/api/referral/claim-gift.
 */
export async function claimMilestoneGift(phone, tierId, giftId) {
  const digits = normalizePhoneDigits(phone);

  const response = await fetch('/api/referral/claim-gift', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: digits, tierId, giftId }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error || 'Failed to claim gift');
  }

  return payload;
}

/**
 * Fetches top 10 leaderboard
 */
export async function getLeaderboard() {
  const q = query(collection(db, COLLECTION), orderBy('referralCount', 'desc'), limit(10));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    // Only return safe public info
    return {
      name: data.name || 'Anonymous',
      referralCount: data.referralCount || 0,
      coins: data.coins || 0,
    };
  });
}
