const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const OTP_COOLDOWN_MS = 60 * 1000; // 60 seconds

const otpStore = new Map();
const cooldownStore = new Map();

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

export {
  OTP_TTL_MS,
  createOtp,
  deleteOtp,
  getCooldownRemainingMs,
  getOtpRecord,
  normalizeEmail,
  saveOtp,
};
