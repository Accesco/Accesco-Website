import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebaseAdmin';
import { isRequestAuthorized } from '@/lib/blogAdminAuth';

export const dynamic = 'force-dynamic';

const COLLECTION = 'blogs';

// POST /api/blog-admin/blogs — create a new blog post (marketing admin only)
export async function POST(request) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.title?.trim() || !body.content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const docRef = await adminDb.collection(COLLECTION).add({
      title: body.title.trim(),
      Content: body.content.trim(),
      Category: body.category || 'Business',
      Author: body.author?.trim() || 'ACCESCO Editorial Team',
      img_url: body.image?.trim() || '/images/download (2).png',
      Excerpt: body.excerpt?.trim() || body.content.trim().slice(0, 200) + '...',
      localArea: body.localArea?.trim() || '',
      backlinkUrl: body.backlinkUrl?.trim() || '',
      Date: FieldValue.serverTimestamp(),
      Published: true,
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error('[API] POST /blog-admin/blogs error:', err);
    return NextResponse.json({ success: false, error: 'Failed to publish blog' }, { status: 500 });
  }
}
