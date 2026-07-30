'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AccescoHeader from '../../components/AccescoHeader';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../components/AuthProvider';
import './profile.css';

const services = [
  {
    name: 'Grokly',
    type: 'Essentials',
    logo: '/images/grokly-icon.png',
    description: 'Fresh groceries and farm-direct essentials, delivered fast.',
    href: '/services/grokly',
    action: 'Order Grocery',
    className: 'grokly',
  },
  {
    name: 'Swadishtt',
    type: 'Food delivery',
    logo: '/images/swadisht/swadisht_logo.JPG',
    description: 'Ghar jaisa khana from verified cloud kitchens near you.',
    href: '/services/swadisht',
    action: 'Order History',
    className: 'swadishtt',
  },
  {
    name: 'InstaStyle',
    type: 'Fashion',
    logo: '/images/instastyle-logo.png',
    description: 'Outfit ready, before you are — curated fashion delivered fast.',
    href: '/services/instastyle',
    action: 'Order History',
    className: 'instastyle',
  },
];

const accountItems = [
  { label: 'Account details', icon: 'ri-user-line', active: true },
  { label: 'Payment methods', icon: 'ri-bank-card-line', href: '/profile/payment-methods' },
  { label: 'Payment history', icon: 'ri-history-line', href: '/profile/payment-history' },
  { label: 'Redeem a code', icon: 'ri-coupon-3-line' },
  { label: 'Bookmarks', icon: 'ri-bookmark-line' },
  { label: 'Subscriptions', icon: 'ri-file-list-3-line' },
  { label: 'Notifications', icon: 'ri-notification-3-line' },
  { label: 'Language & region', icon: 'ri-global-line' },
  { label: 'Security & login', icon: 'ri-shield-keyhole-line' },
  { label: 'Help & support', icon: 'ri-question-line' },
];

const exploreItems = [
  { label: 'Invite & earn', icon: 'ri-gift-line', href: '/referral' },
  { label: 'Accesco Library', icon: 'ri-play-circle-line', href: '/accesco-library' },
  { label: 'Xpense Meter', icon: 'ri-calculator-line', href: '/calculator' },
  { label: 'Partner with us', icon: 'ri-shake-hands-line', href: '/partner' },
];

export default function ProfilePage() {
  const { user, loading, signOut, signIn } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
 const [city, setCity] = useState('Bengaluru, Karnataka');

const [isEditing, setIsEditing] = useState(false);
const [editName, setEditName] = useState('');
const [editPhone, setEditPhone] = useState('');
const [editEmail, setEditEmail] = useState('');
const [editError, setEditError] = useState('');

  useEffect(() => {
    const grokly = JSON.parse(localStorage.getItem('grokly_orders') || '[]');
    const swadishtt = JSON.parse(localStorage.getItem('swadishtt-orders') || '[]');
    const instastyle = JSON.parse(localStorage.getItem('instastyle_orders') || '[]');
    setTotalOrders(grokly.length + swadishtt.length + instastyle.length);

    const savedLocation = localStorage.getItem('userLocation');
    if (!savedLocation) return;

    try {
      const parsedLocation = JSON.parse(savedLocation);
      setCity(parsedLocation?.city || parsedLocation?.displayAddress || 'Bengaluru, Karnataka');
    } catch {
      setCity(savedLocation);
    }
  }, []);

  const displayName = user?.name || 'Accesco User';
  const phone = user?.phone || 'Not added';
  const email = user?.email || 'Not added';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const closeLoginModal = () => setIsLoginModalOpen(false);
const startEditing = () => {
  setEditName(user?.name || '');
  setEditPhone(user?.phone || '');
  setEditEmail(user?.email || '');
  setEditError('');
  setIsEditing(true);
};

const cancelEditing = () => {
  setEditError('');
  setIsEditing(false);
};

const saveProfileChanges = (event) => {
  event.preventDefault();

  const updatedName = editName.trim();
  const updatedPhone = editPhone.trim();
  const updatedEmail = editEmail.trim();

  if (!updatedName || !updatedPhone) {
    setEditError('Name and phone number are required.');
    return;
  }

  if (
    updatedEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedEmail)
  ) {
    setEditError('Please enter a valid email address.');
    return;
  }

  signIn({
    ...user,
    name: updatedName,
    phone: updatedPhone,
    email: updatedEmail || null,
  });

  setEditError('');
  setIsEditing(false);
};

  return (
    <div className="profile-shell">
      <AccescoHeader />

      <main className="profile-page">
        <div className="profile-container">
          <header className="profile-heading">
            <p className="profile-eyebrow">Your Account</p>
            <h1>My Profile</h1>
            <p className="profile-intro">
              Your Accesco membership — one card across Grokly, Swadishtt and InstaStyle.
            </p>
          </header>

          {loading && <div className="profile-loading">Loading your profile…</div>}

          {!loading && !user && (
            <section className="profile-guest">
              <span className="profile-guest-icon"><i className="ri-user-line" /></span>
              <h2>You’re not logged in</h2>
              <p>Log in to see your membership, orders, rewards and saved account details.</p>
              <button type="button" className="profile-login-btn" onClick={() => setIsLoginModalOpen(true)}>
                Continue to login <i className="ri-arrow-right-line" />
              </button>
            </section>
          )}

          {!loading && user && (
            <>
              <section className="membership-card" aria-label="Accesco membership card">
                <span className="membership-spark spark-one">✦</span>
                <span className="membership-spark spark-two">✦</span>

                <div className="membership-topline">
                  <span>Accesco Member</span>
                  <span>Est. 2024</span>
                </div>

                <div className="membership-main">
                  <div className="membership-identity">
                    <h2>{displayName}</h2>
                    <div className="membership-contact">
                      <span>{phone}</span>
                      <span>{email}</span>
                      <span>{city}</span>
                    </div>
                  </div>

                  <div className="membership-avatar-wrap">
                    <div className="membership-avatar">{initials}</div>
                    <span className="membership-connected">Connected</span>
                  </div>
                </div>

                <div className="membership-stats">
                  <div className="membership-stat">
                    <strong>{totalOrders}</strong>
                    <span>Total orders</span>
                  </div>
                  <div className="membership-stat">
                    <strong>0</strong>
                    <span>Saved addresses</span>
                  </div>
                  <div className="membership-stat">
                    <strong>₹0</strong>
                    <span>Reward balance</span>
                  </div>
                  <div className="membership-stat account-status">
                    <strong><i /> Active</strong>
                    <span>Account status</span>
                  </div>
                </div>
              </section>

              <section className="profile-section world-section">
                <div className="section-heading">
                  <p className="profile-eyebrow">Everyday Services</p>
                  <h2>Your Accesco world</h2>
                  <p>Every order you place keeps working across your household — one profile, three services.</p>
                </div>

                <div className="service-scroller">
                  {services.map((service) => (
                    <article className={`service-card ${service.className}`} key={service.name}>
                      <div className="service-card-top">
                        <span className="service-icon">
  <Image
    src={service.logo}
    alt={`${service.name} logo`}
    width={30}
    height={30}
  />
</span>
                        <span className="service-type">{service.type}</span>
                      </div>
                      <h3>{service.name}</h3>
                      <p>{service.description}</p>
                      <div className="service-card-bottom">
                        <span><strong>0</strong> Orders placed</span>
                        <Link href={service.href}>{service.action}</Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="profile-section manage-section">
                <div className="section-heading compact">
                  <p className="profile-eyebrow">Account</p>
                  <h2>Manage your account</h2>
                </div>

                <div className="account-layout">
                  <aside className="account-sidebar">
                    <p className="sidebar-label">Account</p>
                    <nav aria-label="Account settings">
                      {accountItems.map((item) =>
                        item.href ? (
                          <Link href={item.href} className={item.active ? 'active' : ''} key={item.label}>
                            <i className={item.icon} />
                            <span>{item.label}</span>
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className={item.active ? 'active' : ''}
                            key={item.label}
                          >
                            <i className={item.icon} />
                            <span>{item.label}</span>
                          </button>
                        )
                      )}
                    </nav>

                    <p className="sidebar-label explore-label">Explore</p>
                    <nav aria-label="Explore Accesco">
                      {exploreItems.map((item) => (
                        <Link href={item.href} key={item.label}>
                          <i className={item.icon} />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </nav>

                    <button type="button" className="sidebar-signout" onClick={signOut}>
                      <i className="ri-logout-box-r-line" />
                      <span>Sign out</span>
                    </button>
                  </aside>

                  <div className="account-content">
                    <form
  className="settings-card details-card"
  onSubmit={saveProfileChanges}
>
  <div className="settings-card-header">
    <span>Account details</span>

    <button
      type="button"
      onClick={isEditing ? cancelEditing : startEditing}
    >
      {isEditing ? 'Cancel' : 'Edit'}
    </button>
  </div>

  <div className="settings-row">
    <span>Name</span>

    {isEditing ? (
      <input
        className="settings-edit-input"
        type="text"
        value={editName}
        onChange={(event) => setEditName(event.target.value)}
        aria-label="Name"
        autoFocus
      />
    ) : (
      <strong>{displayName}</strong>
    )}
  </div>

  <div className="settings-row">
    <span>Phone</span>

    {isEditing ? (
      <input
        className="settings-edit-input"
        type="tel"
        value={editPhone}
        onChange={(event) => setEditPhone(event.target.value)}
        aria-label="Phone number"
      />
    ) : (
      <strong>{phone}</strong>
    )}
  </div>

  <div className="settings-row">
    <span>Email</span>

    {isEditing ? (
      <input
        className="settings-edit-input"
        type="email"
        value={editEmail}
        onChange={(event) => setEditEmail(event.target.value)}
        aria-label="Email address"
        placeholder="Add email address"
      />
    ) : (
      <strong>{email}</strong>
    )}
  </div>

  {editError && (
    <p className="settings-edit-error">{editError}</p>
  )}

  {isEditing && (
    <div className="settings-actions">
      <button type="submit">Save changes</button>
    </div>
  )}
</form>

                    <article className="settings-card security-card">
                      <div className="settings-card-header">
                        <span>Security snapshot</span>
                      </div>
                      <div className="security-row">
                        <span>Login</span>
                        <div>
                          <strong>Protected account</strong>
                          <small>Verified by phone and email</small>
                        </div>
                        <em><i /> Protected</em>
                      </div>
                      <div className="security-row">
                        <span>Recovery</span>
                        <div>
                          <strong>Recovery details</strong>
                          <small>Keep your phone number and email updated for safer access</small>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <footer className="profile-footer">
        <span>© 2026 Accesco Living. All rights reserved.</span>
        <span>Bengaluru, Karnataka · India</span>
      </footer>

<AuthModal
  isOpen={isLoginModalOpen}
  onClose={closeLoginModal}
  onSuccess={(userData) => {
    signIn(userData);
    setIsLoginModalOpen(false);
  }}
/>
    </div>
  );
}