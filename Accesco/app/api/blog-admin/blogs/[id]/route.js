import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { isRequestAuthorized } from '@/lib/blogAdminAuth';

export const dynamic = 'force-dynamic';

const COLLECTION = 'blogs';

// PUT /api/blog-admin/blogs/[id] — update an existing blog post (marketing admin only)
export async function PUT(request, { params }) {
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

    await adminDb.collection(COLLECTION).doc(params.id).update({
      title: body.title.trim(),
      Content: body.content.trim(),
      Category: body.category || 'Business',
      Author: body.author?.trim() || 'ACCESCO Editorial Team',
      img_url: body.image?.trim() || '/images/download (2).png',
      Excerpt: body.excerpt?.trim() || body.content.trim().slice(0, 200) + '...',
      localArea: body.localArea?.trim() || '',
      backlinkUrl: body.backlinkUrl?.trim() || '',
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API] PUT /blog-admin/blogs/[id] error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update blog' }, { status: 500 });
  }
}

// DELETE /api/blog-admin/blogs/[id] — delete a blog post (marketing admin only)
export async function DELETE(request, { params }) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await adminDb.collection(COLLECTION).doc(params.id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API] DELETE /blog-admin/blogs/[id] error:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete blog' }, { status: 500 });
  }
}
