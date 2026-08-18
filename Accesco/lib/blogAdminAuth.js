// Stateless shared-password gate for the marketing blog admin UI at /admin/blogs.
// The session cookie is an HMAC of the password itself, so any server instance
// can verify it without shared storage.
import crypto from 'crypto';

const COOKIE_NAME = 'blog_admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 24; // 1 day

function getPassword() {
  const password = process.env.BLOG_ADMIN_PASSWORD;
  if (!password) {
    throw new Error('BLOG_ADMIN_PASSWORD is not configured');
  }
  return password;
}

function computeToken(password) {
  return crypto.createHmac('sha256', password).update('blog-admin-session').digest('hex');
}

export function verifyPassword(candidate) {
  const password = getPassword();
  const a = Buffer.from(candidate || '');
  const b = Buffer.from(password);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function issueToken() {
  return computeToken(getPassword());
}

export function isValidToken(token) {
  if (!token) return false;
  try {
    const expected = computeToken(getPassword());
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function isRequestAuthorized(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return isValidToken(token);
}

export const BLOG_ADMIN_COOKIE = COOKIE_NAME;
export const BLOG_ADMIN_MAX_AGE = MAX_AGE_SECONDS;
