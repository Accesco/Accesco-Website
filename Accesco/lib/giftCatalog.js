/**
 * Referral milestone gifts. One master catalog of 10 gifts, sorted by price.
 * Each milestone unlocks the N cheapest gifts under its price cap as choices.
 * A user reaching a milestone gets to pick ONE gift from that milestone's list;
 * it's queued for delivery and bundled with their first Accesco Living order
 * (see lib/referralFulfillment.js).
 */
export const GIFT_CATALOG = [
  { id: 'tote-bag', name: 'Accesco Living Tote Bag', price: 299 },
  { id: 'water-bottle', name: 'Steel Insulated Water Bottle', price: 349 },
  { id: 'phone-stand', name: 'Phone Pop Socket & Stand', price: 399 },
  { id: 'neckband', name: 'Bluetooth Neckband Earphones', price: 599 },
  { id: 'desk-organizer', name: 'Desk Organizer Set', price: 649 },
  { id: 'power-bank', name: 'Portable Power Bank (10000mAh)', price: 899 },
  { id: 'wireless-mouse', name: 'Wireless Mouse', price: 949 },
  { id: 'desk-lamp', name: 'Smart LED Desk Lamp', price: 1199 },
  { id: 'bt-speaker', name: 'Bluetooth Speaker', price: 1349 },
  { id: 'earbuds', name: 'Wireless Earbuds (Premium)', price: 1499 },
]

/**
 * Referral milestones. `minReferrals` is the threshold that unlocks the tier;
 * `maxReferrals` is just the display range's ceiling (crossing minReferrals is
 * what triggers eligibility — there is no separate milestone at 50).
 */
export const REFERRAL_MILESTONES = [
  { id: 'tier1', minReferrals: 10, maxReferrals: 19, choiceCount: 3, priceCap: 500 },
  { id: 'tier2', minReferrals: 20, maxReferrals: 29, choiceCount: 5, priceCap: 700 },
  { id: 'tier3', minReferrals: 30, maxReferrals: 39, choiceCount: 7, priceCap: 1000 },
  { id: 'tier4', minReferrals: 40, maxReferrals: 50, choiceCount: 10, priceCap: 1500 },
]

/** Coins awarded per successful referral (unchanged from the original system). */
export const COINS_PER_REFERRAL = 20

export function getMilestoneById(tierId) {
  return REFERRAL_MILESTONES.find((m) => m.id === tierId) || null
}

/**
 * The gifts a user may pick from for a given milestone: the cheapest
 * `choiceCount` catalog items priced at or under `priceCap`.
 */
export function getGiftChoicesForMilestone(tierId) {
  const milestone = getMilestoneById(tierId)
  if (!milestone) return []

  return GIFT_CATALOG
    .filter((g) => g.price <= milestone.priceCap)
    .sort((a, b) => a.price - b.price)
    .slice(0, milestone.choiceCount)
}

/** All milestones a given referral count has unlocked (crossed the minimum for). */
export function getUnlockedMilestones(referralCount) {
  return REFERRAL_MILESTONES.filter((m) => referralCount >= m.minReferrals)
}

/** The next not-yet-reached milestone, for progress-meter display. */
export function getNextMilestone(referralCount) {
  return (
    REFERRAL_MILESTONES.find((m) => referralCount < m.minReferrals) || null
  )
}

export function isValidGiftChoice(tierId, giftId) {
  return getGiftChoicesForMilestone(tierId).some((g) => g.id === giftId)
}
