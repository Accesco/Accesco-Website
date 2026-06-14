import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const greeting = name?.trim() ? `Hi ${name.trim()}` : 'Hi there';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'Accesco <noreply@accescoliving.com>',
        to: [email],
        subject: 'You are on the Accesco waitlist!',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
            <h1 style="font-size:24px;margin-bottom:8px">🎉 Congratulations!</h1>
            <p style="font-size:16px;line-height:1.6">
              ${greeting}, you are now on our waitlist.
            </p>
            <p style="font-size:16px;line-height:1.6">
              We're working hard to make Accesco available to everyone. You'll be among the first to know when we're ready.
            </p>
            <p style="font-size:14px;color:#666;margin-top:32px">
              — The Accesco Team
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Resend error:', err);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Confirmation email sent' }, { status: 200 });
  } catch (error) {
    console.error('Waitlist email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
