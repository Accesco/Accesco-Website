import { db } from './firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  limit,
  getDocs,
} from 'firebase/firestore';

const COLLECTION = 'waitlistUsers';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts digits, spaces, dashes, dots, parentheses, and an optional leading +
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;

// Fallback only for anonymous visitors who join the waitlist without ever
// logging in (the waitlist form doesn't require an account) -- there's no
// phone/email to query Firestore with yet, so this is the one case that still
// has to rely on a local flag rather than a server-side lookup.
const REGISTERED_STORAGE_KEY = 'accesco_waitlist_registered';

function getLoggedInUser() {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem('accesco_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// waitlistUsers.phone is stored exactly as the visitor typed it (see
// addWaitlistEntry below), so an exact-match query can miss entries typed
// with different spacing/country-code formatting. Querying a handful of
// normalized variants with a single `in` clause covers the common cases.
function phoneVariants(phone) {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, '');
  const last10 = digits.slice(-10);

  return Array.from(
    new Set([trimmed, digits, last10, `+91${last10}`, `91${last10}`]),
  )
    .filter(Boolean)
    .slice(0, 10); // Firestore 'in' queries cap out at 10 values
}

/**
 * Queries Firestore directly for a waitlist entry matching the given phone
 * and/or email -- this is the source of truth, not a locally cached flag.
 * @param {{ phone?: string|null; email?: string|null }} identity
 * @returns {Promise<boolean>}
 */
export async function checkWaitlistRegistration({ phone, email } = {}) {
  const lookups = [];

  if (phone) {
    lookups.push(
      getDocs(
        query(collection(db, COLLECTION), where('phone', 'in', phoneVariants(phone)), limit(1)),
      ),
    );
  }

  if (email) {
    lookups.push(
      getDocs(
        query(collection(db, COLLECTION), where('email', '==', email.trim().toLowerCase()), limit(1)),
      ),
    );
  }

  if (lookups.length === 0) return false;

  const results = await Promise.all(lookups);
  return results.some((snap) => !snap.empty);
}

/**
 * Whether the current visitor is on the waitlist. Checks Firestore directly
 * using the logged-in account's phone/email when available (so it's correct
 * across devices/browsers and per-account); falls back to a local flag only
 * for anonymous visitors who joined without logging in.
 * @returns {Promise<boolean>}
 */
export async function isWaitlistRegistered() {
  if (typeof window === 'undefined') return true;

  const user = getLoggedInUser();

  if (user?.phone || user?.email) {
    try {
      const isReg = await checkWaitlistRegistration({ phone: user.phone, email: user.email });
      if (isReg) return true;
    } catch (err) {
      console.error('Waitlist registration check failed:', err);
      return true;
    }
  }

  const stored = window.localStorage.getItem(REGISTERED_STORAGE_KEY);
  if (stored === '0') return false;
  return true;
}

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Validate waitlist form data.
 * @param {{ name?: string; email: string; phone: string }} data
 * @returns {string[]} Array of error messages (empty means valid)
 */
export function validateWaitlistEntry(data) {
  const errors = [];

  const email = data.email?.trim() ?? '';
  const phone = data.phone?.trim() ?? '';
  const name = data.name?.trim() ?? '';

  if (!email) {
    errors.push('Email is required.');
  } else if (!EMAIL_RE.test(email)) {
    errors.push('Please enter a valid email address.');
  }

  if (!phone) {
    errors.push('Phone number is required.');
  } else if (!PHONE_RE.test(phone)) {
    errors.push('Please enter a valid phone number (7–20 digits).');
  }

  if (name.length > 100) {
    errors.push('Name must be 100 characters or fewer.');
  }

  return errors;
}

/**
 * Save a waitlist signup to Firestore.
 * WARNING: This client-side write cannot be rate-limited.
 * Move this to the backend /api/waitlist route for actual security.
 *
 * @param {{ name?: string; email: string; phone: string }} data
 * @returns {Promise<string>} New document id
 * @throws {Error} if validation fails
 */
export async function addWaitlistEntry(data) {
  const errors = validateWaitlistEntry(data);
  if (errors.length > 0) {
    throw new Error(errors.join(' '));
  }

  const email = data.email.trim().toLowerCase();
  const name = data.name?.trim() || '';

  // VULNERABILITY: Direct client-side write. Attackers can spam this without hitting API rate limits.
  const docRef = await addDoc(collection(db, COLLECTION), {
    name,
    email,
    phone: data.phone.trim(),
    createdAt: serverTimestamp(),
  });

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(REGISTERED_STORAGE_KEY, '1');
  }

  // Send confirmation email (non-blocking — don't let a mail failure break signup)
  fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  }).then(async (res) => {
    if (res.status === 429) {
      console.warn('Too many requests');
    }
  }).catch((err) => console.error('Confirmation email failed:', err));

  return docRef.id;
}

/**
 * Send an optional email verification OTP.
 * @param {string} email
 */
export async function sendOtpEmailVerification(email) {
  const response = await fetch('/api/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const payload = await parseJsonResponse(response);

  // Explicitly catch rate limits (429) and bubble the specific error to the UI
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(payload?.error || 'Too many requests. Please wait before trying again.');
    }
    throw new Error(payload?.error || 'Failed to send email OTP');
  }

  return payload;
}

/**
 * Verify an optional email OTP code.
 * @param {string} email
 * @param {string} otp
 */
export async function verifyOtpEmailCode(email, otp) {
  const response = await fetch('/api/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });

  const payload = await parseJsonResponse(response);

  // Explicitly catch rate limits (429) and bubble the specific error to the UI
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(payload?.error || 'Too many verification attempts. Please try again later.');
    }
    throw new Error(payload?.error || 'Email OTP verification failed');
  }

  return payload;
}