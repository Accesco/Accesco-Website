// Generates outreach embed snippets used when pitching guest posts / partner
// sites for a backlink to a specific Accesco Living blog post.
const SITE_URL = 'https://accescoliving.com';

export function getBacklinkUrl(post, campaign = 'partner_backlink') {
  const path = `/blogs/${post.id}`;
  const params = new URLSearchParams({
    utm_source: 'partner',
    utm_medium: 'backlink',
    utm_campaign: campaign,
  });
  return `${SITE_URL}${path}?${params.toString()}`;
}

export function getBacklinkAnchorText(post) {
  return post.title;
}

export function getBacklinkEmbedSnippet(post, campaign = 'partner_backlink') {
  const url = getBacklinkUrl(post, campaign);
  const anchorText = getBacklinkAnchorText(post);
  const readTime = post.readTime || '5 min read';

  return `
<a href="${url}"
   target="_blank" rel="noopener"
   style="display:flex;align-items:center;gap:12px;max-width:420px;padding:14px 16px;
          border:1px solid #e2e2e2;border-radius:10px;text-decoration:none;
          font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;background:#fafafa;">
  <span style="display:inline-block;width:8px;height:8px;border-radius:50%;
               background:#1F3B57;flex-shrink:0;"></span>
  <span style="font-size:14px;line-height:1.4;">
    <strong style="display:block;font-size:15px;margin-bottom:2px;">
      ${anchorText}
    </strong>
    <span style="color:#666;">Read on Accesco Living — ${readTime}</span>
  </span>
</a>
`.trim();
}
