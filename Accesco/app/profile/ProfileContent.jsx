'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import AccescoHeader from '../../components/AccescoHeader';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../components/AuthProvider';
import {
  updateWalletBalanceInFirebase,
  updateUserFieldsInFirebase,
  redeemCouponInFirebase,
} from '../../lib/userService';
import './profile.css';

// Import modular section components
import AccountDetailsSection from './components/AccountDetailsSection';
import AddressesSection from './components/AddressesSection';
import PaymentMethodsSection from './components/PaymentMethodsSection';
import RedeemCodeSection from './components/RedeemCodeSection';
import BookmarksSection from './components/BookmarksSection';
import SubscriptionsSection from './components/SubscriptionsSection';
import NotificationsSection from './components/NotificationsSection';
import LanguageRegionSection from './components/LanguageRegionSection';
import SecurityLoginSection from './components/SecurityLoginSection';
import HelpSupportSection from './components/HelpSupportSection';

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
  { id: 'account-details', label: 'Account details', icon: 'ri-user-line' },
  { id: 'addresses', label: 'Addresses', icon: 'ri-map-pin-line' },
  { id: 'payment-methods', label: 'Payment methods', icon: 'ri-bank-card-line' },
  { id: 'redeem-code', label: 'Redeem a code', icon: 'ri-coupon-3-line' },
  { id: 'bookmarks', label: 'Bookmarks', icon: 'ri-bookmark-line' },
  { id: 'subscriptions', label: 'Subscriptions', icon: 'ri-file-list-3-line' },
  { id: 'notifications', label: 'Notifications', icon: 'ri-notification-3-line' },
  { id: 'language-region', label: 'Language & region', icon: 'ri-global-line' },
  { id: 'security-login', label: 'Security & login', icon: 'ri-shield-keyhole-line' },
  { id: 'help-support', label: 'Help & support', icon: 'ri-question-line' },
];

const exploreItems = [
  { label: 'Invite & earn', icon: 'ri-gift-line', href: '/referral' },
  { label: 'Accesco Library', icon: 'ri-play-circle-line', href: '/accesco-library' },
  { label: 'Xpense Meter', icon: 'ri-calculator-line', href: '/xpense-meter' },
  { label: 'Partner with us', icon: 'ri-shake-hands-line', href: '/partner' },
];

const AVAILABLE_COUPONS = [
  { code: 'ACCESCO20', title: '20% OFF on First Grocery Order', expiry: 'Valid till 31 Aug', disc: 'Up to ₹100' },
  { code: 'SWADISHT50', title: '₹50 OFF on Food Delivery', expiry: 'Valid till 15 Aug', disc: 'Min order ₹249' },
  { code: 'FREEDEL', title: 'Free Delivery Across All Services', expiry: 'Valid today', disc: 'No min order' },
];

export default function ProfileContent() {
  const { user, userData, loading, signOut, signIn, refreshUserData } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams?.get('section');

  const [activeSection, setActiveSection] = useState('account-details');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [city, setCity] = useState('Bengaluru, Karnataka');

  // Edit details state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editError, setEditError] = useState('');

  // Real user state initialized without hardcoded mock data
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ tag: 'Home', flat: '', street: '', city: 'Bengaluru', pincode: '' });

  // Payment methods state
  const [walletBalance, setWalletBalance] = useState(0);
  const [addAmount, setAddAmount] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [upiList, setUpiList] = useState([]);
  const [newUpi, setNewUpi] = useState('');
  const [showAddUpi, setShowAddUpi] = useState(false);
  const [cardsList, setCardsList] = useState([]);

  // Redeem code state
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState({ type: '', text: '' });
  const [redeemedCoupons, setRedeemedCoupons] = useState([]);
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [hasFreeDelivery, setHasFreeDelivery] = useState(false);

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkFilter, setBookmarkFilter] = useState('All');

  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState([]);

  // Notifications preferences
  const [notifSettings, setNotifSettings] = useState({
    orderUpdates: true,
    whatsappAlerts: true,
    promoOffers: false,
    dailyReminders: true,
  });

  // Language & Region state
  const [selectedLang, setSelectedLang] = useState('English');
  const [selectedCurrency, setSelectedCurrency] = useState('INR ₹ (India)');
  const [langSaved, setLangSaved] = useState(false);

  // Security state
  const [twoFactor, setTwoFactor] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [passMsg, setPassMsg] = useState('');

  // Support ticket state
  const [supportTicket, setSupportTicket] = useState({ subject: '', message: '' });
  const [ticketSent, setTicketSent] = useState(false);

  // Sync searchParam with activeSection
  useEffect(() => {
    if (sectionParam) {
      setActiveSection(sectionParam);
    } else if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (accountItems.some((item) => item.id === hash)) {
        setActiveSection(hash);
      }
    }
  }, [sectionParam]);

  // Load REAL data for the logged-in user directly from Firebase (userData)
  useEffect(() => {
    const loc = userData?.selectedLocation || user?.selectedLocation;
    if (loc) {
      setCity(loc?.city || loc?.displayAddress || loc?.fullAddress || 'Bengaluru, Karnataka');
    }

    if (userData) {
      setWalletBalance(userData.walletBalance ?? 0);
      setRedeemedCoupons(userData.redeemedCoupons ?? []);
      setHasFreeDelivery(Boolean(userData.hasFreeDelivery));
      setWalletTransactions(userData.transactions ?? []);
      setAddresses(userData.savedAddresses ?? []);
      setUpiList(userData.upiList ?? []);
      setCardsList(userData.savedCards ?? []);
      setSubscriptions(userData.subscriptions ?? []);
      if (userData.notificationSettings) {
        setNotifSettings(userData.notificationSettings);
      }
      if (userData.language) setSelectedLang(userData.language);
      if (userData.currency) setSelectedCurrency(userData.currency);
      setBookmarks(userData.bookmarks ?? []);
    }
  }, [user, userData]);

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

  const userKey = user?.uid || user?.phone || 'guest';

  const handleSectionSelect = (id) => {
    setActiveSection(id);
    const newUrl = `/profile?section=${id}`;
    router.push(newUrl, { scroll: false });
  };

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

    if (updatedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedEmail)) {
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

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Please select an image smaller than 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      signIn({ ...user, profileImage: reader.result });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  // Address handlers
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.flat || !newAddr.street || !newAddr.pincode) return;
    const added = {
      id: `addr-${Date.now()}`,
      tag: newAddr.tag,
      name: displayName,
      phone: phone,
      flat: newAddr.flat,
      street: newAddr.street,
      city: newAddr.city,
      state: 'Karnataka',
      pincode: newAddr.pincode,
      isDefault: addresses.length === 0,
    };
    const updated = [...addresses, added];
    setAddresses(updated);
    if (user?.uid) {
      await updateUserFieldsInFirebase(user.uid, { savedAddresses: updated });
      refreshUserData(user.uid);
    }
    setNewAddr({ tag: 'Home', flat: '', street: '', city: 'Bengaluru', pincode: '' });
    setShowAddressForm(false);
  };

  const setDefaultAddress = async (id) => {
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    if (user?.uid) {
      await updateUserFieldsInFirebase(user.uid, { savedAddresses: updated });
      refreshUserData(user.uid);
    }
  };

  const deleteAddress = async (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    if (user?.uid) {
      await updateUserFieldsInFirebase(user.uid, { savedAddresses: updated });
      refreshUserData(user.uid);
    }
  };

  // Wallet handler
  const handleAddMoney = async (e) => {
    e.preventDefault();
    const val = parseFloat(addAmount);
    if (!val || val <= 0) return;
    const currentBal = typeof walletBalance === 'number' ? walletBalance : parseFloat(walletBalance) || 0;
    const newBal = currentBal + val;

    const newTx = {
      id: `tx_${Date.now()}`,
      title: `Wallet Top-Up`,
      type: 'credit',
      amount: val,
      date: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
    setWalletBalance(newBal);
    setWalletTransactions([newTx, ...walletTransactions]);

    if (user?.uid) {
      await updateWalletBalanceInFirebase(user.uid, newBal, newTx);
      refreshUserData(user.uid);
    }

    setAddAmount('');
    setShowAddMoney(false);
  };

  const handleAddUpi = async (e) => {
    e.preventDefault();
    if (!newUpi || !newUpi.includes('@')) return;
    const updated = [...upiList, newUpi.trim()];
    setUpiList(updated);
    if (user?.uid) {
      await updateUserFieldsInFirebase(user.uid, { upiList: updated });
      refreshUserData(user.uid);
    }
    setNewUpi('');
    setShowAddUpi(false);
  };

  // Coupon handler
  const handleRedeem = async (e, codeToRedeem = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetCode = (codeToRedeem || promoInput).trim().toUpperCase();
    if (!targetCode) return;

    if (!user?.uid) {
      setPromoMessage({
        type: 'error',
        text: '❌ Please sign in to redeem coupon codes.',
      });
      return;
    }

    const result = await redeemCouponInFirebase(user.uid, targetCode, walletBalance, redeemedCoupons);
    if (result.success) {
      setPromoInput('');
      setPromoMessage({
        type: 'success',
        text: result.message,
      });
      await refreshUserData(user.uid);
    } else {
      setPromoMessage({
        type: 'error',
        text: result.error,
      });
    }
  };

  // Subscription toggle
  const toggleSub = async (id) => {
    const updated = subscriptions.map((s) => (s.id === id ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' } : s));
    setSubscriptions(updated);
    if (user?.uid) {
      await updateUserFieldsInFirebase(user.uid, { subscriptions: updated });
      refreshUserData(user.uid);
    }
  };

  // Password update
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.next) {
      setPassMsg('Please complete all password fields.');
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPassMsg('New passwords do not match.');
      return;
    }
    setPassMsg('Password successfully updated!');
    setPasswordForm({ current: '', next: '', confirm: '' });
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
              <span className="profile-guest-icon">
                <i className="ri-user-line" />
              </span>
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
                    <div className="membership-avatar">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt={`${displayName}'s profile`} />
                      ) : (
                        initials
                      )}
                    </div>

                    <label
                      className="membership-avatar-edit"
                      title="Change profile photo"
                      aria-label="Change profile photo"
                    >
                      <i className="ri-pencil-line" />
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleProfileImageChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="membership-stats">
                  <div className="membership-stat">
                    <strong>{totalOrders}</strong>
                    <span>Total orders</span>
                  </div>
                  <div className="membership-stat">
                    <strong>{addresses.length}</strong>
                    <span>Saved addresses</span>
                  </div>
                  <div className="membership-stat">
                    <strong>₹{walletBalance}</strong>
                    <span>Reward balance</span>
                  </div>
                  <div className="membership-stat account-status">
                    <strong>
                      <i /> Active
                    </strong>
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
                        <span>
                          <strong>0</strong> Orders placed
                        </span>
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
                      {accountItems.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          className={`sidebar-nav-btn ${activeSection === item.id ? 'active' : ''}`}
                          onClick={() => handleSectionSelect(item.id)}
                        >
                          <i className={item.icon} />
                          <span>{item.label}</span>
                        </button>
                      ))}
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
                    {activeSection === 'account-details' && (
                      <AccountDetailsSection
                        displayName={displayName}
                        phone={phone}
                        email={email}
                        isEditing={isEditing}
                        editName={editName}
                        editPhone={editPhone}
                        editEmail={editEmail}
                        editError={editError}
                        setEditName={setEditName}
                        setEditPhone={setEditPhone}
                        setEditEmail={setEditEmail}
                        startEditing={startEditing}
                        cancelEditing={cancelEditing}
                        saveProfileChanges={saveProfileChanges}
                      />
                    )}

                    {activeSection === 'addresses' && (
                      <AddressesSection
                        addresses={addresses}
                        showAddressForm={showAddressForm}
                        setShowAddressForm={setShowAddressForm}
                        newAddr={newAddr}
                        setNewAddr={setNewAddr}
                        handleAddAddress={handleAddAddress}
                        setDefaultAddress={setDefaultAddress}
                        deleteAddress={deleteAddress}
                      />
                    )}

                    {activeSection === 'payment-methods' && (
                      <PaymentMethodsSection
                        walletBalance={walletBalance}
                        showAddMoney={showAddMoney}
                        setShowAddMoney={setShowAddMoney}
                        addAmount={addAmount}
                        setAddAmount={setAddAmount}
                        handleAddMoney={handleAddMoney}
                        upiList={upiList}
                        showAddUpi={showAddUpi}
                        setShowAddUpi={setShowAddUpi}
                        newUpi={newUpi}
                        setNewUpi={setNewUpi}
                        handleAddUpi={handleAddUpi}
                        cardsList={cardsList}
                        transactions={walletTransactions}
                      />
                    )}

                    {activeSection === 'redeem-code' && (
                      <RedeemCodeSection
                        promoInput={promoInput}
                        setPromoInput={setPromoInput}
                        promoMessage={promoMessage}
                        setPromoMessage={setPromoMessage}
                        handleRedeem={handleRedeem}
                        coupons={AVAILABLE_COUPONS.filter((c) => !redeemedCoupons.includes(c.code))}
                        walletBalance={walletBalance}
                        transactions={walletTransactions}
                        hasFreeDelivery={hasFreeDelivery}
                      />
                    )}

                    {activeSection === 'bookmarks' && (
                      <BookmarksSection
                        bookmarks={bookmarks}
                        setBookmarks={setBookmarks}
                        bookmarkFilter={bookmarkFilter}
                        setBookmarkFilter={setBookmarkFilter}
                      />
                    )}

                    {activeSection === 'subscriptions' && (
                      <SubscriptionsSection
                        subscriptions={subscriptions}
                        toggleSub={toggleSub}
                      />
                    )}

                    {activeSection === 'notifications' && (
                      <NotificationsSection
                        notifSettings={notifSettings}
                        setNotifSettings={setNotifSettings}
                      />
                    )}

                    {activeSection === 'language-region' && (
                      <LanguageRegionSection
                        selectedLang={selectedLang}
                        setSelectedLang={setSelectedLang}
                        selectedCurrency={selectedCurrency}
                        setSelectedCurrency={setSelectedCurrency}
                        langSaved={langSaved}
                        setLangSaved={setLangSaved}
                      />
                    )}

                    {activeSection === 'security-login' && (
                      <SecurityLoginSection
                        passwordForm={passwordForm}
                        setPasswordForm={setPasswordForm}
                        passMsg={passMsg}
                        handlePasswordSubmit={handlePasswordSubmit}
                        twoFactor={twoFactor}
                        setTwoFactor={setTwoFactor}
                      />
                    )}

                    {activeSection === 'help-support' && (
                      <HelpSupportSection
                        supportTicket={supportTicket}
                        setSupportTicket={setSupportTicket}
                        ticketSent={ticketSent}
                        setTicketSent={setTicketSent}
                      />
                    )}
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
