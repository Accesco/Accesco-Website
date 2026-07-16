'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';
import AuthModal from '../components/AuthModal';
import {
  getLeaderboard,
  getUserReferralStats,
  subscribeToReferralStats,
  claimMilestoneGift,
} from '../../lib/referralService';
import {
  REFERRAL_MILESTONES,
  COINS_PER_REFERRAL,
  getGiftChoicesForMilestone,
} from '../../lib/giftCatalog';
import './referral.css';

const milestones = [
  { referrals: 1 },
  { referrals: 3 },
  { referrals: 5 },
  { referrals: 10, bonus: '+ Giveaway' },
  { referrals: 20, bonus: '+ Giveaway' },
  { referrals: 30, bonus: '+ Better Gift' },
  { referrals: 40, bonus: '+ Best Gift' },
].map((m) => ({ ...m, coins: m.referrals * COINS_PER_REFERRAL }));

const rewardTiers = REFERRAL_MILESTONES.map((tier) => ({
  id: tier.id,
  range: `${tier.minReferrals} – ${tier.maxReferrals}`,
  minimum: tier.minReferrals,
  coins: tier.minReferrals * COINS_PER_REFERRAL,
  description: `${tier.choiceCount} gift choices under ₹${tier.priceCap.toLocaleString('en-IN')}`,
}));

function RewardCard({ tier, referralCount, claim, user, onClaim, onRequireLogin }) {
  const unlocked = referralCount >= tier.minimum;
  const [picking, setPicking] = useState(false);
  const [selectedGift, setSelectedGift] = useState('');
  const [claiming, setClaiming] = useState(false);
  const choices = getGiftChoicesForMilestone(tier.id);

  const handleChooseClick = () => {
    if (!user) {
      onRequireLogin();
      return;
    }
    setPicking(true);
  };

  const handleConfirm = async () => {
    if (!selectedGift) return;
    setClaiming(true);
    try {
      await onClaim(tier.id, selectedGift);
      setPicking(false);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <article className={`rewardCard ${unlocked ? 'unlocked' : ''}`}>
      <h3>{tier.range}</h3>
      <p>Referrals</p>

      <div className="rewardCoins">
        <span>₹</span>
        <strong>{tier.coins} Coins</strong>
      </div>

      <small>{tier.description}</small>

      {claim ? (
        <>
          <button type="button" disabled>
            🎁 {claim.giftName}
          </button>
          <small style={{ color: '#850043', fontWeight: 700 }}>
            {claim.status === 'pending_first_order'
              ? 'Delivered with your first order'
              : claim.status === 'fulfilled_pending_dispatch'
              ? 'Ready to ship'
              : 'Delivered'}
          </small>
        </>
      ) : picking ? (
        <div className="shareInputRow" style={{ marginTop: 10 }}>
          <select
            value={selectedGift}
            onChange={(e) => setSelectedGift(e.target.value)}
            style={{ width: '100%', minWidth: 0, height: 46, padding: '0 10px', border: '1px solid #e7dbd5', borderRadius: 10, font: 'inherit', fontSize: 11 }}
          >
            <option value="">Choose…</option>
            {choices.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} (₹{g.price})
              </option>
            ))}
          </select>
          <button type="button" onClick={handleConfirm} disabled={!selectedGift || claiming}>
            {claiming ? '…' : 'Confirm'}
          </button>
        </div>
      ) : (
        <button type="button" onClick={handleChooseClick} disabled={!unlocked}>
          {unlocked ? 'Choose Reward' : `Unlocks at ${tier.minimum}`}
          <span>⌄</span>
        </button>
      )}
    </article>
  );
}

export default function ReferralPage() {
  const { user, signIn } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [phoneLookup, setPhoneLookup] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const users = await getLeaderboard();
        setLeaderboard(users.slice(0, 3));
      } catch (err) {
        console.error('Unable to load leaderboard:', err);
      }
    }

    loadLeaderboard();
  }, []);

  // Logged-in users get their live referral profile automatically —
  // no manual lookup needed, and it updates in real time as referrals/claims happen.
  useEffect(() => {
    if (!user?.phone) return undefined;

    const unsubscribe = subscribeToReferralStats(user.phone, setStats);
    return unsubscribe;
  }, [user?.phone]);

  const referralCount = Number(stats?.referralCount || 0);
  const coins = Number(stats?.coins || 0);

  const referralLink = stats?.referralCode
    ? `https://accescoliving.com/?ref=${stats.referralCode}`
    : user
    ? 'Setting up your referral link…'
    : 'Log in to get your referral link';

  const progress = useMemo(() => {
    const maximum = milestones[milestones.length - 1].referrals;
    return Math.min((referralCount / maximum) * 100, 100);
  }, [referralCount]);

  // Manual lookup — only needed for logged-out visitors checking a phone number
  async function handleCheckStats(event) {
    event.preventDefault();

    if (!phoneLookup.trim()) return;

    setLoading(true);
    setError('');

    try {
      const result = await getUserReferralStats(phoneLookup);

      if (!result) {
        setStats(null);
        setError(
          'No referral profile was found for this phone number. Please sign up first.'
        );
        return;
      }

      setStats(result);
    } catch (err) {
      console.error(err);
      setError('We could not load your referral details. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleClaim(tierId, giftId) {
    if (!user?.phone) return;
    setError('');
    try {
      await claimMilestoneGift(user.phone, tierId, giftId);
      // subscribeToReferralStats pushes the updated claim automatically
    } catch (err) {
      setError(err.message || 'Failed to claim gift');
    }
  }

  async function copyReferralLink() {
    if (!stats?.referralCode) return;

    await navigator.clipboard.writeText(referralLink);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  function sendInvite(event) {
    event.preventDefault();

    if (!inviteEmail.trim() || !stats?.referralCode) return;

    const subject = encodeURIComponent('Join me on Accesco Living');
    const body = encodeURIComponent(
      `Join Accesco Living using my referral link:\n\n${referralLink}`
    );

    window.location.href = `mailto:${inviteEmail}?subject=${subject}&body=${body}`;
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

  return (
    <div className="referralPage">
      <header className="referralHeader">
        <Link href="/" className="referralBrand" aria-label="Accesco home">
          <span className="referralLogo">A</span>
          <span>JOIN WAITLIST</span>
        </Link>

        <nav className="referralNavigation">
          <Link href="/" className="loginButton">
            Home
          </Link>

          {user ? (
            <Link href="/profile" className="loginButton">
              {user.name?.split(' ')[0] || 'Account'}
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
        <section className="referralHero">
          <div>
            <h1>
              Earn Together.
              <br />
              Unlock Exclusive <span>Rewards.</span>
            </h1>

            <p>
              Invite your friends, climb the leaderboard,
              <br />
              and unlock exclusive mega gifts.
            </p>

            <div className="quickStats">
              <div className="quickStat">
                <span className="quickIcon">♟</span>
                <div>
                  <strong>{referralCount}</strong>
                  <small>Referrals</small>
                </div>
              </div>

              <div className="quickStat">
                <span className="quickIcon coinIcon">₹</span>
                <div>
                  <strong>{coins}</strong>
                  <small>Coins Earned</small>
                </div>
              </div>

              <div className="quickStat">
                <span className="quickIcon">▥</span>
                <div>
                  <strong>
                    {stats?.rank ? `#${stats.rank}` : '—'}
                  </strong>
                  <small>Your Rank</small>
                </div>
              </div>
            </div>
          </div>

          {!user && (
            <form className="statsLookup" onSubmit={handleCheckStats}>
              <label htmlFor="referral-phone">
                Check your referral progress
              </label>

              <div>
                <input
                  id="referral-phone"
                  type="tel"
                  value={phoneLookup}
                  onChange={(event) => setPhoneLookup(event.target.value)}
                  placeholder="Your phone number"
                  required
                />

                <button type="submit" disabled={loading}>
                  {loading ? 'Checking...' : 'Check Stats'}
                </button>
              </div>

              {error && <p className="errorMessage">{error}</p>}
            </form>
          )}
        </section>

        <div className="referralLayout">
          <section className="referralDashboard">
            <div className="sectionHeading">
              <span className="headingIcon">🎁</span>

              <div>
                <h2>Your Referral Progress</h2>
                <p>Invite more friends and unlock bigger rewards.</p>
              </div>
            </div>

            <div className="meterScroller">
              <div className="meter">
                <div className="meterTrack">
                  <div
                    className="meterFill"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="meterMilestones">
                  {milestones.map((milestone) => {
                    const reached = referralCount >= milestone.referrals;

                    return (
                      <div
                        className={`milestone ${
                          reached ? 'reached' : ''
                        }`}
                        key={milestone.referrals}
                      >
                        <span className="milestoneDot">
                          {reached ? '✓' : ''}
                        </span>

                        <strong>{milestone.referrals}</strong>

                        <small>
                          {milestone.referrals === 1
                            ? 'Referral'
                            : 'Referrals'}
                        </small>

                        <b>{milestone.coins}</b>
                        <small>Coins</small>

                        {milestone.bonus && (
                          <em>{milestone.bonus}</em>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="currentProgress">
              <span>♟</span>
              <p>
                You have <strong>{referralCount} referrals</strong> and{' '}
                <strong>{coins} coins</strong>
              </p>
            </div>

            <div className="rewardsSection">
              <div className="sectionHeading compactHeading">
                <span className="headingIcon">🎁</span>

                <div>
                  <h2>Choose Your Reward</h2>
                  <p>
                    Reach a milestone and choose one gift from the available
                    options.
                  </p>
                </div>
              </div>

              {error && user && <p className="errorMessage">{error}</p>}

              <div className="rewardGrid">
                {rewardTiers.map((tier) => (
                  <RewardCard
                    key={tier.id}
                    tier={tier}
                    referralCount={referralCount}
                    claim={stats?.milestoneClaims?.[tier.id] || null}
                    user={user}
                    onClaim={handleClaim}
                    onRequireLogin={() => setIsAuthOpen(true)}
                  />
                ))}
              </div>
            </div>

            <section className="shareSection">
              <div className="referralLinkBlock">
                <label>Your Referral Link</label>
                <p>Share your unique link anywhere.</p>

                <div className="shareInputRow">
                  <input value={referralLink} readOnly />

                  <button
                    type="button"
                    onClick={copyReferralLink}
                    disabled={!stats?.referralCode}
                  >
                    {copied ? 'Copied!' : '▣  Copy Link'}
                  </button>
                </div>
              </div>

              <div className="shareBottom">
                <form onSubmit={sendInvite}>
                  <label>Invite by Email</label>
                  <p>Send invites to your friends directly.</p>

                  <div className="shareInputRow">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(event) =>
                        setInviteEmail(event.target.value)
                      }
                      placeholder="friend@email.com"
                      required
                    />

                    <button
                      type="submit"
                      disabled={!stats?.referralCode}
                    >
                      ➤ Send Invite
                    </button>
                  </div>
                </form>

                <div className="socialSharing">
                  <label>Share on Social</label>
                  <p>Share your link on social platforms.</p>

                  <div>
                    <button
                      type="button"
                      onClick={() => shareTo('x')}
                      disabled={!stats?.referralCode}
                      aria-label="Share on X"
                    >
                      X
                    </button>

                    <button
                      type="button"
                      onClick={() => shareTo('linkedin')}
                      disabled={!stats?.referralCode}
                      aria-label="Share on LinkedIn"
                    >
                      in
                    </button>

                    <button
                      type="button"
                      onClick={() => shareTo('facebook')}
                      disabled={!stats?.referralCode}
                      aria-label="Share on Facebook"
                    >
                      f
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div className="referralNotes">
              <div>
                <span>🎁</span>
                <p>
                  Gifts can be redeemed as soon as we start operations.
                </p>
              </div>

              <div>
                <span>♟</span>
                <p>
                  Your referral count updates as soon as a person signs up
                  with your link.
                </p>
              </div>

              <div>
                <span>🚚</span>
                <p>
                  Selected gifts will be delivered together with your first
                  order.
                </p>
              </div>
            </div>
          </section>

          <aside className="leaderboardCard">
            <div className="sectionHeading">
              <span className="headingIcon trophyIcon">🏆</span>

              <div>
                <h2>Top Referrers</h2>
                <p>Leaderboard</p>
              </div>
            </div>

            <div className="leaderboardList">
              {leaderboard.length === 0 ? (
                <div className="emptyLeaderboard">
                  No referrers yet. Be the first!
                </div>
              ) : (
                leaderboard.map((entry, index) => (
                  <article className="leaderboardRow" key={`${entry.name}-${index}`}>
                    <span className={`rankBadge rank${index + 1}`}>
                      {index + 1}
                    </span>

                    <span className={`avatar avatar${index + 1}`}>
                      {(entry.name || 'A')
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>

                    <div className="leaderboardUser">
                      <strong>{entry.name || 'Anonymous'}</strong>
                      <small>{entry.referralCount || 0} referrals</small>
                    </div>

                    <div className="leaderboardCoins">
                      <strong>{entry.coins || 0}</strong>
                      <small>Coins</small>
                    </div>
                  </article>
                ))
              )}
            </div>
          </aside>
        </div>
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(userData) => {
          signIn(userData);
          setIsAuthOpen(false);
        }}
      />
    </div>
  );
}
