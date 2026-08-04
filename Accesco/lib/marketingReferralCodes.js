/**
 * Marketing referral codes — house-owned codes handed out per channel/campaign
 * so we can attribute signups that don't come from a real user's referral link.
 *
 * These live in the same `referralProfiles` collection as user codes, so the
 * whole existing pipeline (attribute → referralCount/coins → referredUsers
 * history → conversion flip in referralFulfillment.js) works on them unchanged.
 * The only difference is the doc ID: user profiles are keyed by phone digits,
 * marketing profiles by `MKT_<CODE>`, and they carry `isMarketing: true` so
 * reporting surfaces (leaderboard) can leave them out.
 *
 * Seed/refresh them in Firestore with:
 *   node scripts/seed-marketing-referral-codes.mjs
 */

const MARKETING_DOC_PREFIX = 'MKT_';

export const MARKETING_REFERRAL_CODES = [
  { code: 'ACCLAUNCH', label: 'Launch Campaign', channel: 'campaign' },
  { code: 'ACCFOUNDER', label: 'Founding Members Drive', channel: 'campaign' },
  { code: 'ACCINSTA', label: 'Instagram', channel: 'social' },
  { code: 'ACCYOUTUBE', label: 'YouTube', channel: 'social' },
  { code: 'ACCFACEBOOK', label: 'Facebook', channel: 'social' },
  { code: 'ACCLINKEDIN', label: 'LinkedIn', channel: 'social' },
  { code: 'ACCXPOST', label: 'X (Twitter)', channel: 'social' },
  { code: 'ACCWHATSAPP', label: 'WhatsApp Broadcast', channel: 'messaging' },
  { code: 'ACCSMSDROP', label: 'SMS Campaign', channel: 'messaging' },
  { code: 'ACCEMAILER', label: 'Email Newsletter', channel: 'messaging' },
  { code: 'ACCCREATOR', label: 'Creator & Influencer Collabs', channel: 'partnerships' },
  { code: 'ACCPARTNER', label: 'Brand Partner Co-marketing', channel: 'partnerships' },
  { code: 'ACCCAMPUS', label: 'Campus Ambassadors', channel: 'offline' },
  { code: 'ACCSOCIETY', label: 'Housing Society / RWA Drives', channel: 'offline' },
  { code: 'ACCEVENTS', label: 'Events & Pop-ups', channel: 'offline' },
];

/** Firestore doc ID for a marketing code (user profiles use phone digits). */
export function marketingProfileDocId(code) {
  return `${MARKETING_DOC_PREFIX}${String(code).trim().toUpperCase()}`;
}

const MARKETING_CODE_SET = new Set(MARKETING_REFERRAL_CODES.map((c) => c.code));

/** True if `code` is one of ours, so user code generation never collides with it. */
export function isMarketingReferralCode(code) {
  return MARKETING_CODE_SET.has(String(code || '').trim().toUpperCase());
}

/** Shareable link for a marketing code — same `?ref=` param ReferralCapture reads. */
export function marketingReferralLink(code, baseUrl = 'https://accescoliving.com') {
  return `${baseUrl}/?ref=${String(code).trim().toUpperCase()}`;
}
