import { NextResponse } from 'next/server';
import { checkRateLimit, deleteOtp, getOtpRecord, normalizeEmail } from '../_lib/otp-store';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{6}$/;

function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

// Extract client IP address for accurate rate limiting
function getClientIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}

export async function POST(request) {
  let body;

  // 1. Safe JSON Body Parsing (Gracefully handles empty or malformed request payloads)
  try {
    body = await request.json();
  } catch (parseError) {
    console.warn('[verify-otp] Rejected malformed JSON payload format:', parseError.message);
    return NextResponse.json(
      { error: 'Invalid request payload format. Expected valid JSON.' },
      { status: 400 }
    );
  }

  // 2. Business Logic Execution with Robust Exception Management
  try {
    const clientIp = getClientIp(request);
    const body = await request.json();
    const email = normalizeEmail(body?.email);
    const otp = String(body?.otp || '').trim();

    // Enforce basic schema validation
    if (!email || !isValidEmail(email) || !OTP_REGEX.test(otp)) {
      console.warn(`[verify-otp] Rejected request due to invalid schema inputs: email=${email ? 'provided' : 'missing'}`);
      return NextResponse.json(
        { error: 'Valid email and 6-digit OTP are required' },
        { status: 400 },
      );
    }

    // --- RATE LIMITING LOGIC (Synchronous In-Memory) ---
    // Prevent OTP brute-forcing: Max 5 attempts per 15 minutes per IP
    const ipCheck = checkRateLimit(`verify_ip:${clientIp}`, 5, 15 * 60);
    if (!ipCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many verification attempts from this IP. Please try again later.' },
        { status: 429 }
      );
    }

    // Prevent OTP brute-forcing: Max 15 attempts per 10 minutes per Email
    const emailCheck = checkRateLimit(`verify_email:${email}`, 15, 10 * 60);
    if (!emailCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many verification attempts for this email. Please try again later.' },
        { status: 429 }
      );
    }
    // ---------------------------------------------------

    const record = getOtpRecord(email);
    if (!record) {
      console.info(`[verify-otp] Refused verification: OTP record is expired or missing for ${email}`);
      return NextResponse.json(
        { error: 'OTP is invalid or expired' },
        { status: 400 },
      );
    }

    // Verify OTP code match
    if (record.otp !== otp) {
      console.warn(`[verify-otp] Failed verification: Incorrect code submitted for ${email}`);
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Successfully verified! Safe removal of consumed OTP
    deleteOtp(email);
    console.info(`[verify-otp] Successfully verified and deleted OTP for ${email}`);

    return NextResponse.json(
      { message: 'Email verified successfully', verified: true },
      { status: 200 },
    );
  } catch (error) {
    console.error('[verify-otp] Server error:', error);
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }
}