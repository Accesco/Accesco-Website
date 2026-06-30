'use client';


import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AccescoHeader from '../../components/AccescoHeader';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../components/AuthProvider';
import ActiveOrdersWidget from '../../components/ActiveOrdersWidget';
import './profile.css';

function ProfileContent() {
  const { user, loading, signOut, signIn } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  // Auto-open login modal if we have a redirect parameter and user is not logged in
  useEffect(() => {
    if (!loading && !user && redirectUrl) {
      setIsLoginModalOpen(true);
    }
  }, [loading, user, redirectUrl]);

  // Redirect on successful login or if already logged in and redirect exists
  useEffect(() => {
    if (user && redirectUrl) {
      router.push(redirectUrl);
    }
  }, [user, redirectUrl, router]);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const handleLoginSuccess = (userData) => {
    signIn(userData);
    closeLoginModal();
  };

  const displayName = user?.name || 'AccesCo User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSignOut = () => signOut();

  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const grokly = JSON.parse(localStorage.getItem('grokly_orders') || '[]');
    const swadishtt = JSON.parse(localStorage.getItem('swadishtt-orders') || '[]');
    const instastyle = JSON.parse(localStorage.getItem('instastyle_orders') || '[]');
    setTotalOrders(grokly.length + swadishtt.length + instastyle.length);
  }, []);
  return (
    <>
      <AccescoHeader />

      <div className="profile-page">
        <div className="profile-container">

          <div className="profile-header">
            <p className="profile-pretitle">Your Account</p>
            <h1>My Profile</h1>
          </div>

          {loading && <div className="profile-loading">Loading…</div>}

          {!loading && !user && (
            <div className="profile-guest">
              <div className="profile-guest-icon">
                <i className="ri-user-line"></i>
              </div>
              <h2>You're not logged in</h2>
              <p>Enter your details to view your profile and access your preferences.</p>
              <button className="profile-login-btn" onClick={openLoginModal}>
                <i className="ri-login-box-line"></i> Continue
              </button>
            </div>
          )}

          {!loading && user && (
            <>
              <div className="profile-avatar-card">
                <div className="profile-avatar-wrap">
                  <div className="profile-avatar">{initials}</div>
                  <div className="profile-avatar-badge"></div>
                </div>
                <div className="profile-avatar-info">
                  <h2>{displayName}</h2>
                  <p>{user.phone}</p>
                  {user.email && <p style={{ fontSize: '13px', color: '#999' }}>{user.email}</p>}
                  <span className="profile-member-badge">
                    <i className="ri-shield-check-line"></i> AccesCo Member
                  </span>
                </div>
                <button className="profile-signout-btn" onClick={handleSignOut}>
                  <i className="ri-logout-box-r-line"></i> Sign Out
                </button>
              </div>

              <ActiveOrdersWidget />

              <div className="profile-grid">
                <div className="profile-card">
                  <div className="profile-card-title">
                    <i className="ri-user-settings-line"></i> Account Details
                  </div>
                  <div className="profile-detail-row">
                    <span className="profile-detail-label">Name</span>
                    <span className="profile-detail-value">{displayName}</span>
                  </div>
                  <div className="profile-detail-row">
                    <span className="profile-detail-label">Phone</span>
                    <span className="profile-detail-value">{user.phone}</span>
                  </div>
                  {user.email && (
                    <div className="profile-detail-row">
                      <span className="profile-detail-label">Email</span>
                      <span className="profile-detail-value">{user.email}</span>
                    </div>
                  )}
                </div>

                <div className="profile-card">
                  <div className="profile-card-title">
                    <i className="ri-bar-chart-2-line"></i> Activity
                  </div>
                  <div className="profile-stats-grid">
                    <div className="profile-stat-item">
                      <div className="profile-stat-number">{totalOrders}</div>
                      <div className="profile-stat-label">Orders</div>
                    </div>
                    <div className="profile-stat-item">
                      <div className="profile-stat-number">0</div>
                      <div className="profile-stat-label">Rewards</div>
                    </div>
                  </div>
                </div>

                <div className="profile-card full-width">
                  <div className="profile-card-title">
                    <i className="ri-apps-line"></i> Explore accesco
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Accesco Library', href: '/accesco-library', icon: 'ri-play-circle-line' },
                      { label: 'Xpense Meter', href: '/calculator', icon: 'ri-calculator-line' },
                      { label: 'Partner with Us', href: '/partner', icon: 'ri-handshake-line' },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          padding: '12px 20px', borderRadius: '999px',
                          background: 'rgba(112,4,87,0.06)', color: 'rgba(112,4,87,1)',
                          fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px',
                          textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(112,4,87,1)'; e.currentTarget.style.color='#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='rgba(112,4,87,0.06)'; e.currentTarget.style.color='rgba(112,4,87,1)'; }}
                      >
                        <i className={item.icon}></i> {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="profile-loading">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
