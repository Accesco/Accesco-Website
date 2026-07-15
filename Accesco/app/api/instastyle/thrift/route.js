import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function buildThriftSubmissionEmailHtml({ sellerName, sellerEmail, listing }) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;padding:32px 24px;color:#1a1a1a;">
      <h2 style="margin:0 0 4px;">New Thrift Listing Submitted</h2>
      <p style="margin:0 0 24px;color:#888;font-size:13px;">Pending authentication review</p>

      <table style="width:100%;font-size:14px;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#555;width:130px;">Seller Name</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${sellerName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#555;">Seller Email</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;"><a href="mailto:${sellerEmail}" style="color:#1a1a1a;">${sellerEmail}</a></td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#555;">Item Name</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${listing.name}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#555;">Brand</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${listing.brand || '—'}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#555;">Category</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${listing.category || '—'}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#555;">Condition</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${listing.condition || '—'}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#555;">Asking Price</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">₹${Number(listing.price || 0).toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#555;vertical-align:top;">Description</td>
          <td style="padding:8px 0;">${listing.description || '—'}</td>
        </tr>
      </table>

      <p style="font-size:12px;color:#999;">InstaStyle Thrift Market · Accesco Living</p>
    </div>
  `;
}

function buildThriftAckEmailHtml({ sellerName, listingName }) {
  return `
    <div style="font-family:'Georgia',serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#1a1a1a;">
      <div style="border-top:3px solid #1a1a1a;padding-top:24px;margin-bottom:28px;">
        <h1 style="margin:0;font-size:26px;font-weight:400;">InstaStyle Thrift</h1>
        <p style="margin:4px 0 0;font-size:12px;color:#888;">by Accesco Living</p>
      </div>

      <p style="font-size:15px;line-height:1.8;margin:0 0 16px;">
        Hi ${sellerName || 'there'}, we've received your listing for <strong>${listingName}</strong>.
      </p>
      <p style="font-size:15px;line-height:1.8;margin:0 0 16px;">
        Our authentication team will review your item and get back to you within 2–3 business days.
        If approved, it will be listed on The Thrift Edit and you'll be notified when it sells.
      </p>
      <p style="font-size:14px;color:#666;line-height:1.7;margin:0 0 32px;">
        In the meantime, explore what's already on the market:
        <a href="https://accescoliving.com/services/instastyle/thrift" style="color:#1a1a1a;font-weight:600;">Shop The Thrift Edit</a>
      </p>

      <p style="font-size:12px;color:#999;border-top:1px solid #f0ece8;padding-top:20px;margin:0;">
        — The InstaStyle Team · Accesco Living
      </p>
    </div>
  `;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sellerName, sellerEmail, listing } = body;

    if (!sellerEmail?.trim() || !listing?.name?.trim()) {
      return NextResponse.json({ error: 'Seller email and item name are required.' }, { status: 400 });
    }

    // Persist listing to Firestore
    let listingId = null;
    try {
      const { db } = await import('@/lib/firebase');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const docRef = await addDoc(collection(db, 'instastyle_thrift_submissions'), {
        sellerName: sellerName?.trim() || '',
        sellerEmail: sellerEmail.trim().toLowerCase(),
        listing: {
          name: listing.name.trim(),
          brand: listing.brand?.trim() || '',
          category: listing.category?.trim() || '',
          condition: listing.condition?.trim() || '',
          price: Number(listing.price) || 0,
          description: listing.description?.trim() || '',
        },
        status: 'pending', // pending | approved | rejected
        isThrift: true,
        tags: ['thrift'],
        submittedAt: serverTimestamp(),
      });
      listingId = docRef.id;
    } catch (dbErr) {
      console.error('[instastyle/thrift] Firestore write failed:', dbErr);
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Accesco <noreply@accescoliving.com>';

      // Notify team
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          from: fromEmail,
          to: ['support@accescoliving.com'],
          reply_to: sellerEmail.trim(),
          subject: `[Thrift] New listing: ${listing.name} — ${sellerName || sellerEmail}`,
          html: buildThriftSubmissionEmailHtml({ sellerName, sellerEmail: sellerEmail.trim(), listing }),
        }),
      }).catch(err => console.error('[instastyle/thrift] Team email failed:', err));

      // ACK to seller
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          from: fromEmail,
          to: [sellerEmail.trim()],
          subject: `We received your listing — ${listing.name} | InstaStyle Thrift`,
          html: buildThriftAckEmailHtml({ sellerName, listingName: listing.name }),
        }),
      }).catch(err => console.error('[instastyle/thrift] ACK email failed:', err));
    }

    return NextResponse.json({ success: true, listingId }, { status: 200 });
  } catch (error) {
    console.error('[instastyle/thrift] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { db } = await import('@/lib/firebase');
    const { collection, getDocs, query, where, orderBy } = await import('firebase/firestore');

    const q = query(
      collection(db, 'instastyle_thrift_submissions'),
      where('status', '==', 'pending'),
      orderBy('submittedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const listings = [];
    snapshot.forEach(d => listings.push({ id: d.id, ...d.data() }));

    return NextResponse.json({ listings });
  } catch (error) {
    console.error('[instastyle/thrift] GET error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
