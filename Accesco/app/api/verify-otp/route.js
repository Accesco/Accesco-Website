import { NextResponse } from 'next/server';
import { deleteOtp, getOtpRecord, normalizeEmail } from '../_lib/otp-store';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{6}$/;

function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body?.email);
    const otp = String(body?.otp || '').trim();

    if (!email || !isValidEmail(email) || !OTP_REGEX.test(otp)) {
      return NextResponse.json(
        { error: 'Valid email and 6-digit OTP are required' },
        { status: 400 },
      );
    }

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
  } catch {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }
}
