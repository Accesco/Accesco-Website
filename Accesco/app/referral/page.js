'use client';

import React, { useState, useEffect } from 'react';
import { getLeaderboard, getUserReferralStats } from '../../lib/referralService';
import AccescoHeader from '../../components/AccescoHeader';
import Footer from '../../components/Footer';
import '../homepage.css'; // For common styles

export default function ReferralPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [email, setEmail] = useState('');
  const [myStats, setMyStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const topUsers = await getLeaderboard();
        setLeaderboard(topUsers);
      } catch (err) {
        console.error("Failed to load leaderboard");
      }
    }
    loadLeaderboard();
  }, []);

  const handleCheckStats = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoadingStats(true);
    setError('');
    try {
      const stats = await getUserReferralStats(email);
      if (stats) {
        setMyStats(stats);
      } else {
        setError('No waitlist profile found for this email. Have you signed up yet?');
      }
    } catch (err) {
      setError('Error fetching stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const getTierStatus = (coins) => {
    if (coins >= 60) return { tier: 3, label: 'Platinum Tier', nextRef: 0 };
    if (coins >= 40) return { tier: 2, label: 'Gold Tier', nextRef: 5 };
    if (coins >= 20) return { tier: 1, label: 'Silver Tier', nextRef: 3 };
    return { tier: 0, label: 'Bronze Tier', nextRef: 1 };
  };

  const myTier = myStats ? getTierStatus(myStats.coins) : { tier: 0 };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'inherit' }}>
      <AccescoHeader />

      <main style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', px: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#1a0014', marginBottom: '16px', fontFamily: 'Davetica, sans-serif' }}>
            Invite & Earn <span style={{ color: '#7A0042' }}>Rewards</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#6b5a6b', maxWidth: '600px', margin: '0 auto' }}>
            Join the Accesco Waitlist revolution. Invite your friends, climb the leaderboard, and unlock exclusive Mega Gifts!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', padding: '0 20px' }}>
          
          {/* Left Column - My Stats */}
          <div>
            <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 40px rgba(122,0,66,0.08)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Your Target</h2>
              
              {!myStats ? (
                <form onSubmit={handleCheckStats}>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>Enter your waitlist email to check your stats or get your unique link.</p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid #e5e7eb', marginBottom: '16px', boxSizing: 'border-box' }}
                  />
                  {error && <p style={{ color: 'red', fontSize: '14px', margin: '-8px 0 16px' }}>{error}</p>}
                  <button 
                    type="submit" 
                    disabled={loadingStats}
                    style={{ width: '100%', padding: '16px', background: '#000', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {loadingStats ? 'Checking...' : 'Check My Stats'}
                  </button>
                </form>
              ) : (
                <div>
                  <div style={{ background: '#f9fafb', padding: '24px', borderRadius: '16px', marginBottom: '24px', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 8px', color: '#6b5a6b' }}>Total Coins Earned</h3>
                    <div style={{ fontSize: '48px', fontWeight: '900', color: '#7A0042', fontFamily: 'Davetica, sans-serif' }}>
                      {myStats.coins}
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ margin: '0 0 8px', fontWeight: '600' }}>Your Referral Link:</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        readOnly 
                        value={`https://accescoliving.com/?ref=${myStats.referralCode}`}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', background: '#eee' }}
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`https://accescoliving.com/?ref=${myStats.referralCode}`);
                          alert('Copied!');
                        }}
                        style={{ padding: '0 16px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Share
                      </button>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '24px 0' }} />

                  <h3 style={{ margin: '0 0 16px' }}>Mega Gift Status: {myTier.label}</h3>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ padding: '16px', background: myTier.tier >= 1 ? '#f0fdf4' : '#fff', opacity: myTier.tier >= 1 ? 1 : 0.5, borderBottom: '1px solid #e5e7eb' }}>
                      <strong>Tier 1 (1 Referral)</strong> - Small Gift Unlocked
                    </div>
                    <div style={{ padding: '16px', background: myTier.tier >= 2 ? '#f0fdf4' : '#fff', opacity: myTier.tier >= 2 ? 1 : 0.5, borderBottom: '1px solid #e5e7eb' }}>
                      <strong>Tier 2 (3 Referrals)</strong> - Silver Gift Unlocked
                    </div>
                    <div style={{ padding: '16px', background: myTier.tier >= 3 ? '#f0fdf4' : '#fff', opacity: myTier.tier >= 3 ? 1 : 0.5 }}>
                      <strong>Tier 3 (5 Referrals)</strong> - Mega Gift Unlocked
                    </div>
                  </div>
                  {myTier.tier >= 2 && (
                    <button style={{ width: '100%', background: 'linear-gradient(135deg, #7A0042, #ffb347)', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', marginTop: '24px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Claim Your Gift Now
                    </button>
                  )}
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
                  {leaderboard.map((user, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: index === 0 ? 'linear-gradient(90deg, #fffbeb, #fff)' : '#f9fafb', border: index === 0 ? '1px solid #fde68a' : '1px solid transparent', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {index + 1}
                        </div>
                        <div style={{ fontWeight: '600' }}>{user.name || 'Anonymous User'}</div>
                      </div>
                      <div style={{ color: '#7A0042', fontWeight: 'bold' }}>
                        {user.coins} Coins
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
    </div>
  );
}
