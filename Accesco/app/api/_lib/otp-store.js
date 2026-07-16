const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const OTP_COOLDOWN_MS = 60 * 1000; // 60 seconds

// IP rate limit constants (e.g., max 5 requests per 15 minutes per IP)
const IP_LIMIT_MAX = 5;
const IP_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const otpStore = new Map();
const cooldownStore = new Map();
const ipRateLimitStore = new Map(); // Map<ip, Array<timestamps>>

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function maskEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  const [localPart, domain] = normalizedEmail.split('@');

  if (!localPart || !domain) return 'invalid-email';
  if (localPart.length <= 2) return `${localPart[0] || '*'}*@${domain}`;

  return `${localPart.slice(0, 2)}***@${domain}`;
}

function createOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function saveOtp(email, otp) {
  const normalizedEmail = normalizeEmail(email);
  const now = Date.now();

  otpStore.set(normalizedEmail, {
    otp,
    expiresAt: now + OTP_TTL_MS,
  });

  cooldownStore.set(normalizedEmail, now + OTP_COOLDOWN_MS);
  console.info(`[otp-store] OTP saved for ${maskEmail(normalizedEmail)} (expires in 5m)`);
}

function getOtpRecord(email) {
  const normalizedEmail = normalizeEmail(email);
  const record = otpStore.get(normalizedEmail);

  if (!record) {
    console.info(`[otp-store] No OTP record for ${maskEmail(normalizedEmail)}`);
    return null;
  }

  if (record.expiresAt <= Date.now()) {
    otpStore.delete(normalizedEmail);
    console.info(`[otp-store] OTP expired for ${maskEmail(normalizedEmail)}`);
    return null;
  }

  return record;
}

function deleteOtp(email) {
  const normalizedEmail = normalizeEmail(email);
  otpStore.delete(normalizedEmail);
  console.info(`[otp-store] OTP deleted for ${maskEmail(normalizedEmail)}`);
}

function getCooldownRemainingMs(email) {
  const normalizedEmail = normalizeEmail(email);
  const cooldownUntil = cooldownStore.get(normalizedEmail);

  if (!cooldownUntil) return 0;

  const remaining = cooldownUntil - Date.now();
  if (remaining <= 0) {
    cooldownStore.delete(normalizedEmail);
    return 0;
  }

  console.info(
    `[otp-store] Cooldown active for ${maskEmail(normalizedEmail)} (${Math.ceil(remaining / 1000)}s remaining)`,
  );
  return remaining;
}

/**
 * Checks if the given client IP has exceeded the globally configured sliding window limit.
 * @param {string} ip
 * @returns {{ allowed: boolean, remainingMs: number }}
 */
function checkIpRateLimit(ip) {
  const now = Date.now();
  const requests = ipRateLimitStore.get(ip) || [];

  // Filter out request timestamps that fall outside our sliding window
  const activeRequests = requests.filter((timestamp) => now - timestamp < IP_WINDOW_MS);

  if (activeRequests.length >= IP_LIMIT_MAX) {
    const oldestActiveTimestamp = activeRequests[0];
    const remainingMs = IP_WINDOW_MS - (now - oldestActiveTimestamp);
    return {
      allowed: false,
      remainingMs: Math.max(0, remainingMs),
    };
  }

  // Record this attempt
  activeRequests.push(now);
  ipRateLimitStore.set(ip, activeRequests);
  return {
    allowed: true,
    remainingMs: 0,
  };
}

export {
  OTP_TTL_MS,
  createOtp,
  deleteOtp,
  getCooldownRemainingMs,
  getOtpRecord,
  normalizeEmail,
  saveOtp,
  checkIpRateLimit,
};