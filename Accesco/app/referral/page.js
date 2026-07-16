'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import AuthModal from '../components/AuthModal';
import {
  getLeaderboard,
  subscribeToReferralStats,
  initializeReferralProfile,
  claimMilestoneGift,
} from '../../lib/referralService';
import {
  REFERRAL_MILESTONES,
  getGiftChoicesForMilestone,
  getNextMilestone,
} from '../../lib/giftCatalog';
import AccescoHeader from '../../components/AccescoHeader';
import Footer from '../../components/Footer';
import '../homepage.css'; // For common styles

function MilestoneCard({ milestone, referralCount, claim, onClaim, claiming }) {
  const unlocked = referralCount >= milestone.minReferrals;
  const [selectedGift, setSelectedGift] = useState('');
  const choices = getGiftChoicesForMilestone(milestone.id);

  return (
    <div
      style={{
        padding: '20px',
        background: unlocked ? '#f0fdf4' : '#fff',
        opacity: unlocked ? 1 : 0.55,
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <strong>{milestone.minReferrals}-{milestone.maxReferrals} Referrals</strong>
        <span style={{ fontSize: '13px', color: '#6b5a6b' }}>
          {milestone.choiceCount} gift choices · under ₹{milestone.priceCap}
        </span>
      </div>

      {!unlocked && (
        <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#999' }}>
          {milestone.minReferrals - referralCount} more referral{milestone.minReferrals - referralCount === 1 ? '' : 's'} to unlock
        </p>
      )}

      {unlocked && claim && (
        <p style={{ margin: '8px 0 0', fontSize: '14px' }}>
          🎁 Claimed: <strong>{claim.giftName}</strong>
          <br />
          <span style={{ color: '#7A0042', fontSize: '13px' }}>
            {claim.status === 'pending_first_order'
              ? 'Will be delivered together with your first order'
              : claim.status === 'fulfilled_pending_dispatch'
              ? 'Ready to ship'
              : 'Delivered with your order'}
          </span>
        </p>
      )}

      {unlocked && !claim && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
          <select
            value={selectedGift}
            onChange={(e) => setSelectedGift(e.target.value)}
            style={{ flex: '1 1 200px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          >
            <option value="">Choose your gift…</option>
            {choices.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} (₹{g.price})
              </option>
            ))}
          </select>
          <button
            onClick={() => selectedGift && onClaim(milestone.id, selectedGift)}
            disabled={!selectedGift || claiming}
            style={{
              padding: '10px 18px',
              background: '#7A0042',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: selectedGift ? 'pointer' : 'not-allowed',
            }}
          >
            {claiming ? 'Claiming…' : 'Claim Gift'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ReferralPage() {
  const { user, signIn } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimingTier, setClaimingTier] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    getLeaderboard()
      .then(setLeaderboard)
      .catch(() => console.error('Failed to load leaderboard'));
  }, []);

  useEffect(() => {
    if (!user?.phone) {
      setStatsLoading(false);
      return undefined;
    }

    setStatsLoading(true);

    // Real-time progress meter — reflects new referrals/coins/claims instantly
    const unsubscribe = subscribeToReferralStats(user.phone, (data) => {
      setStats(data);
      setStatsLoading(false);

      // Backfill a referral profile for accounts that existed before this
      // feature (or if the client write in AuthModal failed silently).
      if (!data) {
        initializeReferralProfile(user.phone, user.name).catch((err) =>
          console.error('Referral backfill failed:', err),
        );
      }
    });

    return unsubscribe;
  }, [user?.phone, user?.name]);

  const handleClaim = async (tierId, giftId) => {
    if (!user?.phone) return;
    setClaimingTier(tierId);
    setError('');
    try {
      await claimMilestoneGift(user.phone, tierId, giftId);
      // subscribeToReferralStats will push the updated claim automatically
    } catch (err) {
      setError(err.message || 'Failed to claim gift');
    } finally {
      setClaimingTier(null);
    }
  };

  const referralCount = stats?.referralCount || 0;
  const nextMilestone = getNextMilestone(referralCount);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'inherit' }}>
      <AccescoHeader />

      <main style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', px: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#1a0014', marginBottom: '16px', fontFamily: 'Davetica, sans-serif' }}>
            Invite & Earn <span style={{ color: '#7A0042' }}>Rewards</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#6b5a6b', maxWidth: '600px', margin: '0 auto' }}>
            Join the Accesco Waitlist revolution. Invite your friends, climb the leaderboard, and unlock exclusive gifts!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', padding: '0 20px' }}>

          {/* Left Column - My Stats */}
          <div>
            <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 40px rgba(122,0,66,0.08)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Your Progress</h2>

              {!user ? (
                <div>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                    Log in to see your referral stats, get your unique link, and claim gifts.
                  </p>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    style={{ width: '100%', padding: '16px', background: '#000', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}
                  >
                    Log In
                  </button>
                </div>
              ) : statsLoading ? (
                <p style={{ color: '#666' }}>Loading your stats…</p>
              ) : (
                <div>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ flex: 1, background: '#f9fafb', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                      <h3 style={{ margin: '0 0 8px', fontSize: '13px', color: '#6b5a6b' }}>Coins Earned</h3>
                      <div style={{ fontSize: '36px', fontWeight: '900', color: '#7A0042', fontFamily: 'Davetica, sans-serif' }}>
                        {stats?.coins || 0}
                      </div>
                    </div>
                    <div style={{ flex: 1, background: '#f9fafb', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                      <h3 style={{ margin: '0 0 8px', fontSize: '13px', color: '#6b5a6b' }}>Referrals</h3>
                      <div style={{ fontSize: '36px', fontWeight: '900', color: '#7A0042', fontFamily: 'Davetica, sans-serif' }}>
                        {referralCount}
                      </div>
                    </div>
                  </div>

                  {nextMilestone && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b5a6b', marginBottom: '6px' }}>
                        <span>Next milestone: {nextMilestone.minReferrals} referrals</span>
                        <span>{referralCount}/{nextMilestone.minReferrals}</span>
                      </div>
                      <div style={{ height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.min(100, (referralCount / nextMilestone.minReferrals) * 100)}%`,
                            background: '#7A0042',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {stats?.referralCode && (
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{ margin: '0 0 8px', fontWeight: '600' }}>Your Referral Link:</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          readOnly
                          value={`https://accescoliving.com/?ref=${stats.referralCode}`}
                          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', background: '#eee' }}
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`https://accescoliving.com/?ref=${stats.referralCode}`);
                            alert('Copied!');
                          }}
                          style={{ padding: '0 16px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                          Share
                        </button>
                      </div>
                    </div>
                  )}

                  <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '24px 0' }} />

                  <h3 style={{ margin: '0 0 16px' }}>Referral Milestones</h3>

                  {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

                  {REFERRAL_MILESTONES.map((milestone) => (
                    <MilestoneCard
                      key={milestone.id}
                      milestone={milestone}
                      referralCount={referralCount}
                      claim={stats?.milestoneClaims?.[milestone.id] || null}
                      onClaim={handleClaim}
                      claiming={claimingTier === milestone.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Leaderboard */}
          <div>
            <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 40px rgba(122,0,66,0.08)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Top Referrers Leaderboard
              </h2>

              {leaderboard.length === 0 ? (
                <p style={{ color: '#666' }}>No referrers yet. Be the first!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {leaderboard.map((entry, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: index === 0 ? 'linear-gradient(90deg, #fffbeb, #fff)' : '#f9fafb', border: index === 0 ? '1px solid #fde68a' : '1px solid transparent', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {index + 1}
                        </div>
                        <div style={{ fontWeight: '600' }}>{entry.name || 'Anonymous User'}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#7A0042', fontWeight: 'bold' }}>{entry.coins} Coins</div>
                        <div style={{ fontSize: '12px', color: '#999' }}>{entry.referralCount} referrals</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <AuthModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={(userData) => {
          signIn(userData);
          setIsLoginOpen(false);
        }}
      />
    </div>
  );
}
