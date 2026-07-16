'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getLeaderboard, getUserReferralStats } from '../../lib/referralService';
import './referral.css';

const milestones = [
  { referrals: 1, coins: 20 },
  { referrals: 3, coins: 40 },
  { referrals: 5, coins: 60 },
  { referrals: 10, coins: 100, bonus: '+ Giveaway' },
  { referrals: 20, coins: 150, bonus: '+ Giveaway' },
  { referrals: 30, coins: 200, bonus: '+ Better Gift' },
  { referrals: 40, coins: 250, bonus: '+ Best Gift' },
];

const rewardTiers = [
  {
    range: '10 – 19',
    minimum: 10,
    coins: 100,
    description: '3 gift choices under ₹500',
  },
  {
    range: '20 – 29',
    minimum: 20,
    coins: 150,
    description: '5 gift choices under ₹700',
  },
  {
    range: '30 – 39',
    minimum: 30,
    coins: 200,
    description: '7 gift choices under ₹1,000',
  },
  {
    range: '40 – 50',
    minimum: 40,
    coins: 250,
    description: '10 gift choices under ₹1,500',
  },
];

export default function ReferralPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [email, setEmail] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

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

  const referralCount = Number(stats?.referralCount || 0);
  const coins = Number(stats?.coins || 0);

  const referralLink = stats?.referralCode
    ? `https://accescoliving.com/?ref=${stats.referralCode}`
    : 'Your referral link appears after checking your email';

  const progress = useMemo(() => {
    const maximum = milestones[milestones.length - 1].referrals;
    return Math.min((referralCount / maximum) * 100, 100);
  }, [referralCount]);

  async function handleCheckStats(event) {
    event.preventDefault();

    if (!email.trim()) return;

    setLoading(true);
    setError('');

    try {
      const result = await getUserReferralStats(email);

      if (!result) {
        setStats(null);
        setError(
          'No waitlist profile was found for this email. Please register on the waitlist first.'
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

    const subject = encodeURIComponent('Join me on the Accesco waitlist');
    const body = encodeURIComponent(
      `Join the Accesco waitlist using my referral link:\n\n${referralLink}`
    );

    window.location.href = `mailto:${inviteEmail}?subject=${subject}&body=${body}`;
  }

  function shareTo(platform) {
    if (!stats?.referralCode) return;

    const encodedLink = encodeURIComponent(referralLink);
    const text = encodeURIComponent(
      'Join me on the Accesco waitlist and unlock exclusive rewards.'
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
          <Link href="/login" className="loginButton">
            Login
          </Link>

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

          <form className="statsLookup" onSubmit={handleCheckStats}>
            <label htmlFor="referral-email">
              Check your referral progress
            </label>

            <div>
              <input
                id="referral-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="your@email.com"
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? 'Checking...' : 'Check Stats'}
              </button>
            </div>

            {error && <p className="errorMessage">{error}</p>}
          </form>
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

              <div className="rewardGrid">
                {rewardTiers.map((tier) => {
                  const unlocked = referralCount >= tier.minimum;

                  return (
                    <article
                      className={`rewardCard ${
                        unlocked ? 'unlocked' : ''
                      }`}
                      key={tier.range}
                    >
                      <h3>{tier.range}</h3>
                      <p>Referrals</p>

                      <div className="rewardCoins">
                        <span>₹</span>
                        <strong>{tier.coins} Coins</strong>
                      </div>

                      <small>{tier.description}</small>

                      <button type="button" disabled>
                        {unlocked
                          ? 'Choose Reward'
                          : `Unlocks at ${tier.minimum}`}
                        <span>⌄</span>
                      </button>
                    </article>
                  );
                })}
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
                  Your referral count updates as soon as a person registers
                  on the waitlist.
                </p>
              </div>

              <div>
                <span>🚚</span>
                <p>
                  Selected gifts will be delivered after the first order
                  together.
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
                leaderboard.map((user, index) => (
                  <article className="leaderboardRow" key={`${user.name}-${index}`}>
                    <span className={`rankBadge rank${index + 1}`}>
                      {index + 1}
                    </span>

                    <span className={`avatar avatar${index + 1}`}>
                      {(user.name || 'A')
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>

                    <div className="leaderboardUser">
                      <strong>{user.name || 'Anonymous'}</strong>
                      <small>{user.referralCount || 0} referrals</small>
                    </div>

                    <div className="leaderboardCoins">
                      <strong>{user.coins || 0}</strong>
                      <small>Coins</small>
                    </div>
                  </article>
                ))
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}