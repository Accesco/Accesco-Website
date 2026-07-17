import { NextResponse } from 'next/server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildContactEmailHtml({ fullName, email, phone, subject, message }) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a1a;background:#fafafa;border-radius:8px;">
      <h2 style="margin:0 0 4px;font-size:22px;">New Contact Message</h2>
      <p style="margin:0 0 24px;color:#666;font-size:14px;">Received via Accesco Living contact form</p>

      <table style="width:100%;border-collapse:collapse;font-size:15px;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#555;width:120px;">Name</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;">${fullName}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#555;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;"><a href="mailto:${email}" style="color:#1a1a1a;">${email}</a></td>
        </tr>
        ${phone ? `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#555;">Phone</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;">${phone}</td>
        </tr>` : ''}
        ${subject ? `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#555;">Subject</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;">${subject}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:10px 0;color:#555;vertical-align:top;">Message</td>
          <td style="padding:10px 0;white-space:pre-wrap;">${message}</td>
        </tr>
      </table>

      <p style="margin:32px 0 0;font-size:12px;color:#999;">Accesco Living · accescoliving.com</p>
    </div>
  `;
}

function buildContactAckHtml({ fullName }) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a;">
      <h2 style="margin:0 0 12px;font-size:22px;">Thanks for reaching out, ${fullName}.</h2>
      <p style="margin:0 0 16px;line-height:1.7;font-size:15px;color:#333;">
        We've received your message and our team will get back to you within 24–48 hours.
      </p>
      <p style="margin:0 0 16px;line-height:1.7;font-size:15px;color:#333;">
        In the meantime, explore what we're building at 
        <a href="https://www.accescoliving.com" style="color:#1a1a1a;font-weight:600;">accescoliving.com</a>.
      </p>
      <p style="margin:32px 0 0;font-size:13px;color:#999;">— The Accesco Team</p>
    </div>
  `;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, subject, message } = body;

    if (!fullName?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[contact] RESEND_API_KEY is not configured');
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Accesco <noreply@accescoliving.com>';

    // 1. Notify the Accesco team
    const teamRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: ['support@accescoliving.com'],
        reply_to: email.trim(),
        subject: subject?.trim()
          ? `[Contact] ${subject.trim()} — from ${fullName.trim()}`
          : `[Contact] New message from ${fullName.trim()}`,
        html: buildContactEmailHtml({ fullName: fullName.trim(), email: email.trim(), phone, subject, message: message.trim() }),
      }),
    });

    if (!teamRes.ok) {
      const err = await teamRes.json().catch(() => ({}));
      console.error('[contact] Resend team notification failed:', err);
      return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 502 });
    }

    // 2. Send acknowledgement to the sender (non-blocking)
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email.trim()],
        subject: 'We received your message — Accesco Living',
        html: buildContactAckHtml({ fullName: fullName.trim() }),
      }),
    }).catch((err) => console.error('[contact] ACK email failed:', err));

    return NextResponse.json({ message: 'Message sent successfully.' }, { status: 200 });
  } catch (error) {
    console.error('[contact] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
