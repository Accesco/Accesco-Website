import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const COLLECTION = 'waitlistUsers';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts digits, spaces, dashes, dots, parentheses, and an optional leading +
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;

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