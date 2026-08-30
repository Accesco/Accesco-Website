import { db } from './firebase';
import {
  collection,
  query,
  where,
  limit,
  getDocs,
} from 'firebase/firestore';

const COLLECTION = 'waitlistUsers';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts digits, spaces, dashes, dots, parentheses, and an optional leading +
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;

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
 * Whether the given account is on the waitlist. Always resolved against
 * Firestore using the logged-in account's phone/email -- there is no local
 * flag involved, so it's correct across devices/browsers and per-account.
 * Visitors with no known phone/email (never logged in) can't be looked up
 * yet, so they're treated as not registered until they do.
 * @param {{ phone?: string|null; email?: string|null }} identity - the
 *   signed-in user's identity, e.g. from useAuth()'s `user`.
 * @returns {Promise<boolean>}
 */
export async function isWaitlistRegistered({ phone, email } = {}) {
  if (typeof window === 'undefined') return false;
  if (!phone && !email) return false;

  try {
    return await checkWaitlistRegistration({ phone, email });
  } catch (err) {
    console.error('Waitlist registration check failed:', err);
    return false;
  }
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
 * Save a waitlist signup via the backend (app/api/waitlist POST).
 *
 * This used to write directly to Firestore from the browser — flagged in
 * this file's own history as a real vulnerability, since a client-side
 * write can't be rate-limited or have its "already registered" check
 * actually enforced (only the API route's rate limiter can do either). The
 * write, duplicate check, and rate limiting all now happen server-side;
 * this function's signature/validation/thrown-error behavior is unchanged
 * so existing callers (components/AppShowcase.jsx, components/
 * WaitlistGate.jsx) didn't need to change.
 *
 * @param {{ name?: string; email: string; phone: string; interests?: string }} data
 * @returns {Promise<string|undefined>} New document id
 * @throws {Error} if validation fails, the request is rate-limited, or the
 *   phone/email is already registered
 */
export async function addWaitlistEntry(data) {
  const errors = validateWaitlistEntry(data);
  if (errors.length > 0) {
    throw new Error(errors.join(' '));
  }

  const email = data.email.trim().toLowerCase();
  const name = data.name?.trim() || '';
  const phone = data.phone.trim();
  const interests = data.interests?.trim() || '';

  const response = await fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, phone, interests }),
  });

  const payload = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(payload?.error || 'Failed to join the waitlist. Please try again.');
  }

  // If this person was referred, joining the waitlist is what confirms the
  // referral (not a first order — ordering is itself gated behind the
  // waitlist, so it would never be the earlier event). Non-blocking side effect.
  import('./referralFulfillment').then(({ markWaitlistJoinAndFulfillGifts }) =>
    markWaitlistJoinAndFulfillGifts({ phone }),
  ).catch((err) => console.error('Referral waitlist conversion failed:', err));

  return payload?.id;
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