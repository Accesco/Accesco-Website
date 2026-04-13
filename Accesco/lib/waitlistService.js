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
  }).catch((err) => console.error('Confirmation email failed:', err));

  return docRef.id;
}

export async function sendOtpEmailVerification(email) {
  const response = await fetch('/api/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const payload = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(payload?.error || 'Failed to send OTP');
  }

  return payload;
}

export async function verifyOtpEmailCode(email, otp) {
  const response = await fetch('/api/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });

  const payload = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(payload?.error || 'OTP verification failed');
  }

  return payload;
}
