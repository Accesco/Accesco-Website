import { NextResponse } from 'next/server';
import {
  checkRateLimit,
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

// Added to extract the client IP address for accurate rate limiting
function getClientIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
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
    if (process.env.NODE_ENV === 'development') {
      console.info(`\n[DEVELOPMENT MOCK] RESEND_API_KEY is missing. Verification Code for ${email} is: ${otp}\n`);
      return { ok: true };
    }
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
    const clientIp = getClientIp(request);
    const body = await request.json();
    const email = normalizeEmail(body?.email);
    console.info(`[send-otp] OTP request received for ${maskEmail(email)} from IP: ${clientIp}`);

    if (!email || !isValidEmail(email)) {
      console.warn('[send-otp] Rejected request due to invalid email input');
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // --- RATE LIMITING LOGIC (Synchronous In-Memory) ---
    
    // 1. IP Rate Limit: Max 10 requests per 15 minutes (900 seconds)
    const ipCheck = checkRateLimit(`ip:${clientIp}`, 10, 15 * 60);
    if (!ipCheck.allowed) {
      console.warn(`[send-otp] IP rate limit exceeded for ${clientIp}`);
      return NextResponse.json(
        { error: 'Too many requests from this IP. Please try again later.' },
        { status: 429 }
      );
    }

    // 2. Email Rate Limit: Max 15 requests per 10 minutes (600 seconds)
    const emailCheck = checkRateLimit(`email:${email}`, 15, 10 * 60);
    if (!emailCheck.allowed) {
      console.warn(`[send-otp] Email rate limit exceeded for ${maskEmail(email)}`);
      return NextResponse.json(
        { error: 'Too many requests for this email. Please wait 15 minutes.' },
        { status: 429 }
      );
    }

    // 3. Short Cooldown: 60-second wait between consecutive requests
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

    // ---------------------------------------------------

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