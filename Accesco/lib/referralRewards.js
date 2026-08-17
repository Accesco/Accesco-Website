/**
 * The Referral Economy — reward rules for the referral program.
 * See: internal strategy doc "The Referral Economy" (4-layer design).
 *
 * Layer 1 (immediate, two-sided): flat instant credit to both the referrer
 * and the referee on every successful referral.
 * Layer 2 (tier ladder): fixed, auto-granted rewards at 9 escalating
 * referral-count thresholds.
 * Layer 3 (surprise pool): a small variable cash bonus rolled on every
 * successful referral, stacked on top of Layer 1.
 * Layer 4 (cross-vertical): some tier rewards are vertical-branded prizes
 * (Grokly/Swadishtt/InstaStyle) rather than generic cash/credits.
 */

/** Placeholder amounts — tune freely, this is the only place they live. */
export const LAYER1_REFERRER_CREDIT = 100
export const LAYER1_REFEREE_CREDIT = 100

/**
 * 9-step tier ladder. Each tier is auto-granted the moment a referrer's
 * `referralCount` reaches `minReferrals` — there is no user choice involved,
 * unlike the old pick-a-gift catalog this replaces.
 *
 * `type` drives how attribute/route.js applies the reward:
 *  - 'credits': increment `coins` by `amount`
 *  - 'badge':   arrayUnion `badge` onto the profile's `badges` list
 *  - 'perk':    set a dated flag (`freeDeliveryDays` from claim time)
 *  - 'physical': queue in `tierClaims` for manual fulfillment. Status is
 *               'pending_conversion' until the referrer themselves joins the
 *               waitlist (the confirming event — not a first order, since
 *               ordering is itself gated behind the waitlist), then flips to
 *               'fulfilled_pending_dispatch' — see lib/referralFulfillment.js.
 *
 * A tier may combine a credits/perk/badge effect with a physical one (e.g.
 * tier 1 grants credits AND a free-delivery perk).
 */
export const REFERRAL_TIERS = [
  {
    id: 'tier_1',
    minReferrals: 1,
    rewardName: '₹100 Circle Credits + Free Delivery Activation',
    role: 'Activation',
    effects: [
      { type: 'credits', amount: 100 },
      { type: 'perk', perk: 'free_delivery', days: 30 },
    ],
  },
  {
    id: 'tier_3',
    minReferrals: 3,
    rewardName: '₹300 Credits + Premium Badge',
    role: 'First status marker',
    effects: [
      { type: 'credits', amount: 300 },
      { type: 'badge', badge: 'premium' },
    ],
  },
  {
    id: 'tier_5',
    minReferrals: 5,
    rewardName: 'Grokly Grocery Essentials Box',
    role: 'Physical payoff',
    effects: [{ type: 'physical', vertical: 'grokly', item: 'Grokly Grocery Essentials Box' }],
  },
  {
    id: 'tier_10',
    minReferrals: 10,
    rewardName: '1 Month Free Delivery',
    role: 'Habit lock-in',
    effects: [{ type: 'perk', perk: 'free_delivery', days: 30 }],
  },
  {
    id: 'tier_20',
    minReferrals: 20,
    rewardName: '₹1,000 Shopping Credits',
    role: 'High-value anchor',
    effects: [{ type: 'credits', amount: 1000 }],
  },
  {
    id: 'tier_30',
    minReferrals: 30,
    rewardName: 'Swadishtt Curated Dinner',
    role: 'Cross-vertical pull',
    effects: [{ type: 'physical', vertical: 'swadishtt', item: 'Swadishtt Curated Dinner' }],
  },
  {
    id: 'tier_50',
    minReferrals: 50,
    rewardName: 'InstaStyle Trial Collection',
    role: 'Cross-vertical pull',
    effects: [{ type: 'physical', vertical: 'instastyle', item: 'InstaStyle Trial Collection' }],
  },
  {
    id: 'tier_75',
    minReferrals: 75,
    rewardName: 'Founder Circle Member',
    role: 'Identity & belonging',
    effects: [{ type: 'badge', badge: 'founder_circle' }],
  },
  {
    id: 'tier_100',
    minReferrals: 100,
    rewardName: 'Lifetime VIP + Exclusive Launch Access',
    role: 'Permanent status',
    effects: [{ type: 'badge', badge: 'lifetime_vip' }],
  },
]

/**
 * Layer 3 surprise pool. Cash-only (no physical prizes — the doc names
 * AirPods/Smartwatch/iPhone but sets no odds or budget, so those are left
 * out until a real prize budget exists). Weights are placeholders, easy to
 * retune in one place.
 */
const SURPRISE_POOL = [
  { amount: 50, weight: 55 },
  { amount: 100, weight: 30 },
  { amount: 250, weight: 10 },
  { amount: 500, weight: 4 },
  { amount: 1000, weight: 1 },
]

/** Rolls one weighted-random amount from the surprise pool. */
export function rollSurpriseReward() {
  const totalWeight = SURPRISE_POOL.reduce((sum, entry) => sum + entry.weight, 0)
  let roll = Math.random() * totalWeight

  for (const entry of SURPRISE_POOL) {
    roll -= entry.weight
    if (roll <= 0) return entry.amount
  }

  return SURPRISE_POOL[0].amount
}

export function getTierById(tierId) {
  return REFERRAL_TIERS.find((t) => t.id === tierId) || null
}

/** All tiers a given referral count has reached (crossed the minimum for). */
export function getReachedTiers(referralCount) {
  return REFERRAL_TIERS.filter((t) => referralCount >= t.minReferrals)
}

/** The next not-yet-reached tier, for progress-meter display. */
export function getNextTier(referralCount) {
  return REFERRAL_TIERS.find((t) => referralCount < t.minReferrals) || null
}
