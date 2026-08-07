import { NextResponse } from 'next/server';
import { checkRateLimit, deleteOtp, getOtpRecord, normalizeEmail } from '../_lib/otp-store';

export const dynamic = 'force-dynamic';

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
  try {
    const clientIp = getClientIp(request);
    const body = await request.json();
    const email = normalizeEmail(body?.email);
    const otp = String(body?.otp || '').trim();

    if (!email || !isValidEmail(email) || !OTP_REGEX.test(otp)) {
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
      return NextResponse.json(
        { error: 'OTP is invalid or expired' },
        { status: 400 },
      );
    }

    if (record.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    deleteOtp(email);

    return NextResponse.json(
      { message: 'Email verified successfully', verified: true },
      { status: 200 },
    );
  } catch (error) {
    console.error('[verify-otp] Server error:', error);
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }
}