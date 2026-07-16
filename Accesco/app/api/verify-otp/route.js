import { NextResponse } from 'next/server';
import { deleteOtp, getOtpRecord, normalizeEmail } from '../_lib/otp-store';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{6}$/;

function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
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

    // Fetch the active OTP record from store
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
    // 3. Secure Logging & Exception Sanitization (Resolves F-03 / CWE-755)
    // Securely record detailed diagnostic stack traces only to the server-side console
    console.error('[verify-otp] Unhandled server error in verification route:', {
      message: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
    });

    // Return a generic, clean response to the client with no internal implementation leaks
    return NextResponse.json(
      { error: 'An internal error occurred during authentication.' },
      { status: 500 }
    );
  }
}