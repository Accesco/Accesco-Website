import { NextResponse } from 'next/server';
import {
  createOtp,
  getCooldownRemainingMs,
  normalizeEmail,
  saveOtp,
} from '../_lib/otp-store';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

function maskEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  const [localPart, domain] = normalizedEmail.split('@');

  if (!localPart || !domain) return 'invalid-email';
  if (localPart.length <= 2) return `${localPart[0] || '*'}*@${domain}`;

  return `${localPart.slice(0, 2)}***@${domain}`;
}

function buildOtpEmailHtml(otp) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1a1a1a">
      <h2 style="margin:0 0 12px;">Verify your email</h2>
      <p style="margin:0 0 16px;line-height:1.6;">
        Use the code below to verify your email address. This code expires in 5 minutes.
      </p>
      <div style="font-size:28px;letter-spacing:6px;font-weight:700;background:#f6f6f6;padding:14px 16px;border-radius:8px;display:inline-block;">
        ${otp}
      </div>
      <p style="margin:16px 0 0;line-height:1.6;color:#666;">
        If you did not request this, you can safely ignore this email.
      </p>
    </div>
  `;
}

async function sendOtpEmail(email, otp) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[send-otp] RESEND_API_KEY is missing');
    return { ok: false, type: 'config' };
  }

  console.info(`[send-otp] Sending OTP email to ${maskEmail(email)}`);
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'Accesco <noreply@accescoliving.com>',
      to: [email],
      subject: 'Your verification code',
      html: buildOtpEmailHtml(otp),
    }),
  });

  if (!response.ok) {
    console.error(`[send-otp] Resend request failed for ${maskEmail(email)} (${response.status})`);
    return { ok: false, type: 'provider' };
  }

  console.info(`[send-otp] OTP email sent to ${maskEmail(email)}`);
  return { ok: true };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body?.email);
    console.info(`[send-otp] OTP request received for ${maskEmail(email)}`);

    if (!email || !isValidEmail(email)) {
      console.warn('[send-otp] Rejected request due to invalid email input');
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const cooldownRemainingMs = getCooldownRemainingMs(email);
    if (cooldownRemainingMs > 0) {
      console.warn(`[send-otp] Cooldown prevented OTP resend for ${maskEmail(email)}`);
      return NextResponse.json(
        {
          error: 'Please wait before requesting another OTP',
          retryAfterSeconds: Math.ceil(cooldownRemainingMs / 1000),
        },
        { status: 429 },
      );
    }

    const otp = createOtp();
    saveOtp(email, otp);

    const emailResult = await sendOtpEmail(email, otp);
    if (!emailResult.ok) {
      if (emailResult.type === 'config') {
        console.error('[send-otp] Email service not configured');
        return NextResponse.json(
          { error: 'Email service is not configured' },
          { status: 500 },
        );
      }

      console.error(`[send-otp] Failed to send OTP email for ${maskEmail(email)}`);
      return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 502 });
    }

    console.info(`[send-otp] Request completed successfully for ${maskEmail(email)}`);
    return NextResponse.json(
      { message: 'OTP sent successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('[send-otp] Invalid request payload', error);
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }
}
