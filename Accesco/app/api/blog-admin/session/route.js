import { NextResponse } from 'next/server';
import {
  verifyPassword,
  issueToken,
  isRequestAuthorized,
  BLOG_ADMIN_COOKIE,
  BLOG_ADMIN_MAX_AGE,
} from '@/lib/blogAdminAuth';

export const dynamic = 'force-dynamic';

// GET /api/blog-admin/session — check whether the caller already has a valid session
export async function GET(request) {
  return NextResponse.json({ authenticated: isRequestAuthorized(request) });
}

// POST /api/blog-admin/session — log in with the shared marketing password
export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!verifyPassword(password)) {
      return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(BLOG_ADMIN_COOKIE, issueToken(), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: BLOG_ADMIN_MAX_AGE,
    });
    return response;
  } catch (err) {
    console.error('[API] POST /blog-admin/session error:', err);
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}

// DELETE /api/blog-admin/session — log out
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(BLOG_ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
  return response;
}
