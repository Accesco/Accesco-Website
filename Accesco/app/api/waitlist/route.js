import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { checkRateLimit } from '../_lib/otp-store';

export const dynamic = 'force-dynamic';

const COLLECTION = 'waitlistUsers';

// Same rules as lib/waitlistService.js's validateWaitlistEntry — kept in
// sync so a legitimate submission validates identically either way.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;

// Same normalization as lib/waitlistService.js's phoneVariants — phone is
// stored exactly as typed, so a handful of common formatting variants are
// checked to catch duplicates an exact match would miss.
function phoneVariants(phone) {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, '');
  const last10 = digits.slice(-10);
  return Array.from(new Set([trimmed, digits, last10, `+91${last10}`, `91${last10}`]))
    .filter(Boolean)
    .slice(0, 10);
}

function getClientIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}

function buildConfirmationEmailHtml({ greeting, interests, phone }) {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
      <h1 style="font-size:24px;margin-bottom:8px">🎉 Congratulations!</h1>
      <p style="font-size:16px;line-height:1.6">
        ${greeting}, you are now on our waitlist.
      </p>
      ${interests ? `<p style="font-size:14px;color:#444"><strong>Selected Interests:</strong> ${interests}</p>` : ''}
      ${phone ? `<p style="font-size:14px;color:#444"><strong>Phone:</strong> ${phone}</p>` : ''}
      <p style="font-size:16px;line-height:1.6">
        We're working hard to make Accesco available to everyone. You'll be among the first to know when we're ready.
      </p>
      <p style="font-size:14px;color:#666;margin-top:32px">
        — The Accesco Team
      </p>
    </div>
  `;
}

// GET /api/waitlist — kept as a stub for backward compatibility (this was
// already a no-op before this change: it never actually checked Firestore).
// The real, correct registration check is lib/waitlistService.js's
// checkWaitlistRegistration, which every caller already uses instead of this.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    return NextResponse.json({ registered: false, email: email || null }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ registered: false }, { status: 200 });
  }
}

// POST /api/waitlist — the actual waitlist signup write. Previously this
// route only sent the confirmation email while the browser wrote directly
// to Firestore (see lib/waitlistService.js's addWaitlistEntry, whose own
// comments flagged this as unrateLimitable/spammable); the write now
// happens here instead, via the Admin SDK, so it's actually covered by
// this route's rate limiting and gets a real server-side duplicate check
// (previously that check existed but only gated the UI, never enforced at
// write time).
export async function POST(request) {
  try {
    const clientIp = getClientIp(request);
    const body = await request.json();

    const email = (body.email || '').toString().trim().toLowerCase();
    const phone = (body.phone || '').toString().trim();
    const name = (body.name || '').toString().trim().slice(0, 100);
    const interests = (body.interests || '').toString().trim();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!phone || !PHONE_RE.test(phone)) {
      return NextResponse.json({ error: 'Please enter a valid phone number (7–20 digits).' }, { status: 400 });
    }
    if (name.length > 100) {
      return NextResponse.json({ error: 'Name must be 100 characters or fewer.' }, { status: 400 });
    }

    const ipCheck = checkRateLimit(`waitlist_ip:${clientIp}`, 15, 10 * 60);
    if (!ipCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests from this IP. Please try again later.' },
        { status: 429 }
      );
    }

    const emailCheck = checkRateLimit(`waitlist_email:${email}`, 1, 24 * 60 * 60);
    if (!emailCheck.allowed) {
      return NextResponse.json(
        { error: 'This email has already been added to the waitlist recently.' },
        { status: 429 }
      );
    }

    // Real duplicate check enforced at write time (previously this exact
    // query only ever gated the signup form's UI, client-side).
    const variants = phoneVariants(phone);
    const [byPhone, byEmail] = await Promise.all([
      adminDb.collection(COLLECTION).where('phone', 'in', variants).limit(1).get(),
      adminDb.collection(COLLECTION).where('email', '==', email).limit(1).get(),
    ]);
    if (!byPhone.empty || !byEmail.empty) {
      return NextResponse.json(
        { error: 'This phone number or email is already on the waitlist.' },
        { status: 409 }
      );
    }

    const docRef = await adminDb.collection(COLLECTION).add({
      name,
      email,
      phone,
      interests,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Confirmation email — best-effort, same as before this change; a mail
    // failure doesn't fail the signup itself, since the write above already
    // succeeded by this point.
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const greeting = name ? `Hi ${name}` : 'Hi there';
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Accesco <noreply@accescoliving.com>',
          to: [email],
          subject: 'You are on the Accesco waitlist!',
          html: buildConfirmationEmailHtml({ greeting, interests, phone }),
        }),
      }).catch((err) => console.error('[waitlist] Confirmation email failed:', err));
    }

    return NextResponse.json({ success: true, id: docRef.id }, { status: 200 });
  } catch (error) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
