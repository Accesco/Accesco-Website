import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, message } = body;

    // Validate the data
    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Here you can integrate with your email service
    // Examples:
    // 1. SendGrid
    // 2. Nodemailer
    // 3. Resend
    // 4. AWS SES
    // 5. Formspree
    
    // For now, just log the data (replace with your actual email sending logic)
    console.log('Contact form submission:', { fullName, email, message });

    // Example: Send to your email using a service
    // await sendEmail({
    //   to: 'support@accesco.co.in',
    //   from: email,
    //   subject: `New contact form submission from ${fullName}`,
    //   text: message,
    // });

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
