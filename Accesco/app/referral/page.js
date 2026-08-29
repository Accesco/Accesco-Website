'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';
import AuthModal from '../components/AuthModal';
import { subscribeToReferralStats } from '../../lib/referralService';
import { REFERRAL_TIERS, LAYER1_REFERRER_CREDIT } from '../../lib/referralRewards';
import './referral.css';

/* ---------- Inline line icons (24x24, stroke: currentColor) ---------- */

function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconBag(props) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function IconGift(props) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

function IconFile(props) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}

/* --------------------------------------------------------------------- */

const nextTierAfter10 = REFERRAL_TIERS.find((t) => t.minReferrals === 10);

function statusLabel(status) {
  switch (status) {
    case 'pending_conversion':
      return 'Ships once you join the waitlist';
    case 'fulfilled_pending_dispatch':
      return 'Ready to ship';
    default:
      return 'Unlocked';
  }
}

/** Read-only tier card — all 9 ladder rewards are auto-granted, so there's
 * nothing left for the user to choose or claim, just a status to show. */
function TierRow({ tier, referralCount, claim }) {
  const unlocked = referralCount >= tier.minReferrals;
  const isPhysical = tier.effects.some((e) => e.type === 'physical');

  return (
    <article className={`rewardCard ${unlocked ? 'unlocked' : ''}`}>
      <h3>{tier.minReferrals}</h3>
      <p>{tier.minReferrals === 1 ? 'Referral' : 'Referrals'}</p>

      <div className="rewardCoins">
        <span>🎁</span>
        <strong>{tier.rewardName}</strong>
      </div>

      <small>{tier.role}</small>

      <button type="button" disabled>
        {unlocked ? (isPhysical && claim ? statusLabel(claim.status) : 'Unlocked ✓') : `Unlocks at ${tier.minReferrals}`}
      </button>
    </article>
  );
}

export default function ReferralPage() {
  const router = useRouter();
  const { user, signIn } = useAuth();
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeUser = mounted ? user : null;
  const safeStats = mounted ? stats : null;

  useEffect(() => {
    if (!user?.phone) return undefined;

    const unsubscribe = subscribeToReferralStats(user.phone, setStats);
    return unsubscribe;
  }, [user?.phone]);

  const referralCount = Number(safeStats?.referralCount || 0);
  const coins = Number(safeStats?.coins || 0);
  const historyRows = safeStats?.referredUsers || safeStats?.referrals || [];

  const referralLink = safeStats?.referralCode
    ? `https://accescoliving.com/?ref=${safeStats.referralCode}`
    : safeUser
    ? 'Setting up your referral link...'
    : 'Log in to get your referral link';

  const progress = useMemo(() => {
    const maximum = REFERRAL_TIERS[REFERRAL_TIERS.length - 1].minReferrals;
    return Math.min((referralCount / maximum) * 100, 100);
  }, [referralCount]);

  const handleInviteClick = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    handleShareCode();
  };

  async function copyReferralLink() {
    if (!stats?.referralCode) return;

    await navigator.clipboard.writeText(referralLink);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  function shareTo(platform) {
    if (!stats?.referralCode) return;

    const encodedLink = encodeURIComponent(referralLink);
    const text = encodeURIComponent(
      'Join me on Accesco Living and unlock exclusive rewards.'
    );

    const links = {
      x: `https://twitter.com/intent/tweet?text=${text}&url=${encodedLink}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
    };

    window.open(links[platform], '_blank', 'noopener,noreferrer');
  }

  async function handleShareCode() {
    if (!stats?.referralCode) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Accesco Living',
          text: 'Join me on Accesco Living and unlock exclusive rewards.',
          url: referralLink,
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    shareTo('x');
  }

  const renderHistoryRows = () => {
    const rows = safeUser && historyRows.length > 0 ? historyRows : [{}, {}];

    return rows.slice(0, 4).map((entry, index) => {
      const completed =
        entry.status === 'completed' ||
        entry.status === 'complete' ||
        entry.firstOrderPlaced ||
        entry.hasFirstOrder;
      const friend = entry.name || entry.friendName || entry.phone || entry.email || '—';

      return (
        <tr key={`${friend}-${index}`}>
          <td>{friend}</td>
          <td>
            {entry.name || entry.friendName || entry.phone || entry.email ? (
              <span className={completed ? 'pillCompleted' : 'pillPending'}>
                {completed ? 'Completed' : 'Pending'}
              </span>
            ) : (
              '—'
            )}
          </td>
          <td className="rewardValue">{completed ? `₹${LAYER1_REFERRER_CREDIT}` : '—'}</td>
        </tr>
      );
    });
  };

  return (
    <div className="referralPage">
      <header className="referralHeader">
        <Link href="/" className="referralBrand" aria-label="Accesco home">
          <img
            src="/images/referral/AL-logo.png"
            alt="Accesco Living"
            className="referralLogo"
          />
          <span className="brandText">
            Accesco
            <small>Living</small>
          </span>
        </Link>

        <nav className="referralNavigation">
          <Link href="/" className="loginButton">
            Home
          </Link>

          {safeUser ? (
            <Link href="/profile" className="loginButton">
              {safeUser.name?.split(' ')[0] || 'Account'}
            </Link>
          ) : (
            <a
              href="#"
              className="loginButton"
              onClick={(e) => {
                e.preventDefault();
                setIsAuthOpen(true);
              }}
            >
              Login
            </a>
          )}

          <Link href="/#download" className="getAppButton">
            Get App
          </Link>
        </nav>
      </header>

      <main className="referralMain">
        <section className="heroBanner">
          <div className="heroCopy">
            <span className="heroBadge">
              <IconUsers />
              Referral Program
            </span>
            <h1 className="heroTitle">
              Invite Friends.
              <br />
              Earn Rewards.
            </h1>
            <p className="heroSub">
              Share Accesco Living with your friends. When they place their first order,
              you both receive exciting rewards.
            </p>
            <button type="button" className="heroCta" onClick={handleInviteClick}>
              Invite Now →
            </button>
          </div>
          <div className="heroArt" aria-hidden="true">
            <img
              src="/images/referral/referral-logo.png"
              alt=""
              className="heroArtImg"
            />
          </div>
        </section>

        <section className="statsRow">
          <article className="earnedCard">
            <img
              src="/images/referral/wallet.png"
              alt=""
              className="earnedImg"
            />
            <div className="earnedInfo">
              <p>You've Earned</p>
              <strong className="earnedAmount">{safeUser && safeStats ? `₹${coins}` : '₹—'}</strong>
              <small>Available Rewards</small>
              {safeStats?.lastSurprise?.amount ? (
                <small style={{ color: '#850043', fontWeight: 700 }}>
                  🎉 You won ₹{safeStats.lastSurprise.amount} on your last referral!
                </small>
              ) : null}
              <button
                type="button"
                disabled={!safeUser}
                onClick={() => router.push('/profile?section=redeem-code')}
              >
                Redeem Now →
              </button>
            </div>
          </article>

          <article className="codeCard">
            <p>Your Referral Code</p>
            <div className="codeBox">{safeStats?.referralCode || '— — — —'}</div>
            <div className="codeActions">
              <button
                type="button"
                className="copyBtn"
                onClick={copyReferralLink}
                disabled={!safeStats?.referralCode}
              >
                {copied ? 'Copied!' : '⧉ Copy Code'}
              </button>
              <button
                type="button"
                className="shareBtn"
                onClick={handleShareCode}
                disabled={!safeStats?.referralCode}
              >
                ⤴ Share
              </button>
            </div>
          </article>
        </section>

        <section className="howSection">
          <h2>How It Works</h2>
          <div className="howCard">
            <div className="howSteps">
              <article className="howStep">
                <div className="howIcon">
                  <IconUsers />
                  <span>1</span>
                </div>
                <h3>Invite Friends</h3>
                <p>Share your referral link with your friends.</p>
              </article>
              <span className="stepArrow">→</span>
              <article className="howStep">
                <div className="howIcon">
                  <IconBag />
                  <span>2</span>
                </div>
                <h3>Friend Places First Order</h3>
                <p>They place their first order on Accesco Living.</p>
              </article>
              <span className="stepArrow">→</span>
              <article className="howStep">
                <div className="howIcon">
                  <IconGift />
                  <span>3</span>
                </div>
                <h3>Both Get Rewards</h3>
                <p>You both get rewards in the form of cashback or wallet credits.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="progressRow">
          <article className="progressCard">
            <div className="cardHeading">
              <span>
                <IconUsers />
              </span>
              <h2>Your Referral Progress</h2>
            </div>

            <div className="segmentSummary">
              <div className="segmentBar" aria-label="Referral progress out of 10">
                {Array.from({ length: 10 }).map((_, index) => (
                  <span
                    key={index}
                    className={safeUser && index < Math.min(referralCount, 10) ? 'filled' : ''}
                  />
                ))}
              </div>
              <strong>{safeUser ? `${Math.min(referralCount, 10)}/10` : '—/10'}</strong>
            </div>

            <p className="bonusCaption">
              {Math.max(10 - referralCount, 0)} more invites to unlock{' '}
              <strong>{nextTierAfter10?.rewardName}</strong>
            </p>

            <button
              type="button"
              className="milestoneToggle"
              onClick={() => setShowMilestones((value) => !value)}
            >
              View Milestones
            </button>

            {showMilestones && (
              <div className="milestonePanel">
                <div className="meterScroller">
                  <div className="meter">
                    <div className="meterTrack">
                      <div
                        className="meterFill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="meterMilestones">
                      {REFERRAL_TIERS.map((tier) => {
                        const reached = referralCount >= tier.minReferrals;

                        return (
                          <div
                            className={`milestone ${
                              reached ? 'reached' : ''
                            }`}
                            key={tier.id}
                          >
                            <span className="milestoneDot">
                              {reached ? '✓' : ''}
                            </span>

                            <strong>{tier.minReferrals}</strong>

                            <small>
                              {tier.minReferrals === 1
                                ? 'Referral'
                                : 'Referrals'}
                            </small>

                            <em>{tier.rewardName}</em>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="currentProgress">
                  <span>
                    <IconUsers />
                  </span>
                  <p>
                    You have <strong>{referralCount} referrals</strong> and{' '}
                    <strong>{coins} coins</strong>
                  </p>
                </div>

                <div className="rewardsSection">
                  <div className="sectionHeading compactHeading">
                    <span className="headingIcon">
                      <IconGift />
                    </span>

                    <div>
                      <h2>Your Reward Ladder</h2>
                      <p>
                        Every referral counts toward the next tier — rewards unlock
                        automatically, no picking required.
                      </p>
                    </div>
                  </div>

                  <div className="rewardGrid">
                    {REFERRAL_TIERS.map((tier) => (
                      <TierRow
                        key={tier.id}
                        tier={tier}
                        referralCount={referralCount}
                        claim={safeStats?.tierClaims?.[tier.id] || null}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </article>

          <article className="historyCard">
            <div className="historyHeading">
              <div className="cardHeading">
                <span>
                  <IconFile />
                </span>
                <h2>Referral History</h2>
              </div>
              <a href="#">View All →</a>
            </div>

            <table className="historyTable">
              <thead>
                <tr>
                  <th>Friend</th>
                  <th>Status</th>
                  <th>Rewards</th>
                </tr>
              </thead>
              <tbody>{renderHistoryRows()}</tbody>
            </table>
          </article>
        </section>

        <section className="ctaBanner">
          <div>
            <span className="ctaIcon">
              <IconUsers />
            </span>
            <div>
              <h2>Invite Friends & Earn Exciting Rewards!</h2>
              <p>The more you invite, the more you earn.</p>
            </div>
          </div>
          <button type="button" onClick={handleInviteClick}>
            Invite Friends →
          </button>
        </section>

      </main>

      <footer className="referralFooter">
        <div>
          <Link href="/" className="footerBrand">
            ACCESCO <strong>LIVING</strong>
          </Link>
          <p>
            Building experiences that simplify everyday living through technology and
            innovation.
          </p>
          <small>© 2026 Accesco Living. All rights reserved.</small>
        </div>

        <nav>
          <h3>Company</h3>
          <Link href="/#about">About Us</Link>
          <Link href="/#careers">Careers</Link>
          <Link href="/#newsroom">Newsroom</Link>
          <Link href="/#contact">Contact Us</Link>
        </nav>

        <nav>
          <h3>Our Platforms</h3>
          <a href="#">Lifecart</a>
          <a href="#">Grokly (Grocery)</a>
          <a href="#">Swadishtt (Food)</a>
          <a href="#">Instastyle (Fashion)</a>
        </nav>

        <nav>
          <h3>Resources</h3>
          <Link href="/#help">Help Center</Link>
          <Link href="/#privacy">Privacy Policy</Link>
          <Link href="/#terms">Terms & Condition</Link>
          <Link href="/#partner">Partner With Us</Link>
        </nav>
      </footer>

      {mounted && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={(userData) => {
            signIn(userData);
            setIsAuthOpen(false);
          }}
        />
      )}
    </div>
  );
}