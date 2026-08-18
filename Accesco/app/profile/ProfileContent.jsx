'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import AccescoHeader from '../../components/AccescoHeader';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../components/AuthProvider';
import { fetchWallet, redeemCode } from '../../lib/walletService';
import {
  fetchSavedAddresses,
  createAddress,
  deleteAddress as deleteAddressApi,
  selectAddress,
} from '../../lib/addressService';
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

// Maps a backend wallet transaction ({id, type, amount, reason, source,
// referenceId, createdAt}) to the {id, title, type, amount, date} shape
// TransactionHistorySection already renders, so that component didn't need
// to change when the wallet moved from localStorage to a real API.
function toDisplayTransaction(tx) {
  return {
    id: tx.id,
    title: tx.reason || (tx.type === 'credit' ? 'Wallet Credit' : 'Wallet Debit'),
    type: tx.type,
    amount: tx.amount,
    // Kept (not just for display) so redeemedCoupons below can tell which
    // transactions were coupon redemptions and for which code.
    source: tx.source,
    referenceId: tx.referenceId,
    date: tx.createdAt
      ? new Date(tx.createdAt).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : '',
  };
}

export default function ProfileContent() {
  const { user, loading, signOut, signIn, getIdToken } = useAuth();
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

  // Payment methods state — walletBalance/walletTransactions now come from
  // the real backend (see the wallet-loading effect below), not localStorage.
  const [walletBalance, setWalletBalance] = useState(0);
  const [addAmount, setAddAmount] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addMoneyNotice, setAddMoneyNotice] = useState('');
  const [upiList, setUpiList] = useState([]);
  const [newUpi, setNewUpi] = useState('');
  const [showAddUpi, setShowAddUpi] = useState(false);
  const [cardsList, setCardsList] = useState([]);

  // Redeem code state
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState({ type: '', text: '' });
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [hasFreeDelivery, setHasFreeDelivery] = useState(false);
  // Monetary coupons redeemed server-side are derived from the wallet's own
  // transaction history (source: 'coupon_redemption') rather than tracked
  // separately — the wallet transaction list is the single source of truth
  // for "has this code already been redeemed" now that redemption is
  // server-validated. FREEDEL is the one exception: it's a non-monetary
  // perk with no wallet transaction, so it's merged in from hasFreeDelivery.
  const redeemedCoupons = [
    ...walletTransactions.filter((t) => t.source === 'coupon_redemption').map((t) => t.referenceId),
    ...(hasFreeDelivery ? ['FREEDEL'] : []),
  ];

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

  // Load REAL data for the logged-in user
  useEffect(() => {
    const grokly = JSON.parse(localStorage.getItem('grokly_orders') || '[]');
    const swadishtt = JSON.parse(localStorage.getItem('swadishtt-orders') || '[]');
    const instastyle = JSON.parse(localStorage.getItem('instastyle_orders') || '[]');
    setTotalOrders(grokly.length + swadishtt.length + instastyle.length);

    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setCity(parsedLocation?.city || parsedLocation?.displayAddress || 'Bengaluru, Karnataka');
      } catch {
        setCity(savedLocation);
      }
    }

    const userKey = user?.uid || user?.phone || 'guest';

    // 1. Addresses now load from the backend — see the separate
    // addresses-loading effect below (lib/addressService.js /
    // app/api/addresses).

    // 2. Real UPI (wallet balance itself now loads from the backend — see
    // the separate wallet-loading effect below)
    const savedUpi = localStorage.getItem(`accesco_upi_list_${userKey}`);
    if (savedUpi) {
      try { setUpiList(JSON.parse(savedUpi)); } catch (e) {}
    } else {
      setUpiList([]);
    }

    const savedCards = localStorage.getItem(`accesco_saved_cards_${userKey}`);
    if (savedCards) {
      try { setCardsList(JSON.parse(savedCards)); } catch (e) {}
    } else {
      setCardsList([]);
    }

    // 3. Real Wishlist / Bookmarks
    const groklyWish = JSON.parse(localStorage.getItem('grokly_wishlist') || '[]');
    const swadishttWish = JSON.parse(localStorage.getItem('swadishtt_wishlist') || '[]');
    const instastyleWish = JSON.parse(localStorage.getItem('instastyle_wishlist') || '[]');
    const accescoWish = JSON.parse(localStorage.getItem(`accesco_bookmarks_${userKey}`) || '[]');
    setBookmarks([...groklyWish, ...swadishttWish, ...instastyleWish, ...accescoWish]);

    // 4. Real Subscriptions
    const savedSubs = localStorage.getItem(`accesco_subscriptions_${userKey}`);
    if (savedSubs) {
      try { setSubscriptions(JSON.parse(savedSubs)); } catch (e) {}
    } else {
      setSubscriptions([]);
    }

    // 5. Real Notification preferences
    const savedNotif = localStorage.getItem(`accesco_notif_settings_${userKey}`);
    if (savedNotif) {
      try { setNotifSettings(JSON.parse(savedNotif)); } catch (e) {}
    }

    // 6. Real Language & Currency
    const savedLang = localStorage.getItem(`accesco_lang_${userKey}`);
    if (savedLang) setSelectedLang(savedLang);
    const savedCurr = localStorage.getItem(`accesco_currency_${userKey}`);
    if (savedCurr) setSelectedCurrency(savedCurr);

    // 9. Real Free Delivery Pass
    const savedFreeDel = localStorage.getItem(`accesco_free_delivery_${userKey}`);
    setHasFreeDelivery(savedFreeDel === 'true');
  }, [user]);

  // Referral coins are earned against the phone number a user verified
  // (referralProfiles is keyed by phone digits — see
  // app/api/referral/attribute/route.js), which for a Google-linked account
  // can differ from their Firebase uid. Preferring phone digits here — when
  // the user has a verified phone at all — means someone who has earned
  // referral rewards actually sees them; falling back to uid covers
  // Google-only accounts with no phone (who have no referral coins to miss
  // either way, since earning them requires phone verification).
  const walletUid = user?.phone ? user.phone.replace(/[^\d]/g, '') : user?.uid;

  // Real wallet balance + ledger from the backend (see app/api/wallet).
  useEffect(() => {
    if (!user || !walletUid) {
      setWalletBalance(0);
      setWalletTransactions([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const { wallet } = await fetchWallet(getIdToken, walletUid);
      if (cancelled || !wallet) return;
      setWalletBalance(wallet.balance || 0);
      setWalletTransactions((wallet.transactions || []).map(toDisplayTransaction));
    })();
    return () => { cancelled = true; };
  }, [user, walletUid]);

  const displayName = user?.name || 'Accesco User';
  const phone = user?.phone || 'Not added';
  const email = user?.email || 'Not added';

  // Real saved addresses from the backend (see app/api/addresses). Maps the
  // backend shape ({label, houseNo, area, city, pincode, isDefault, ...})
  // onto the {tag, flat, street, city, state, pincode, isDefault} shape
  // AddressesSection already renders, so that component didn't need to
  // change: `label` (a permanent Home/Work/Other category) becomes the
  // display `tag` here, since the backend's own `tag` field means something
  // different (which address is currently selected for delivery).
  useEffect(() => {
    if (!user?.uid) {
      setAddresses([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const { addresses: fetched } = await fetchSavedAddresses(getIdToken, user.uid);
      if (cancelled) return;
      setAddresses(
        (fetched || []).map((addr) => ({
          id: addr.id,
          tag: addr.label || 'Other',
          name: displayName,
          phone,
          flat: addr.houseNo || '',
          street: addr.area || addr.fullAddress || '',
          city: addr.city || '',
          state: addr.state || 'Karnataka',
          pincode: addr.pincode || '',
          isDefault: !!addr.isDefault,
        }))
      );
    })();
    return () => { cancelled = true; };
  }, [user, displayName, phone, getIdToken]);
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
  // Address handlers now call the real backend (app/api/addresses via
  // lib/addressService.js) instead of only ever writing to localStorage —
  // each one re-fetches the list afterward so isDefault/ordering stay
  // correct regardless of how the server resolved them (e.g. the
  // auto-promote-next-address-to-default behavior on delete).
  const refreshAddresses = async () => {
    if (!user?.uid) return;
    const { addresses: fetched } = await fetchSavedAddresses(getIdToken, user.uid);
    setAddresses(
      (fetched || []).map((addr) => ({
        id: addr.id,
        tag: addr.label || 'Other',
        name: displayName,
        phone,
        flat: addr.houseNo || '',
        street: addr.area || addr.fullAddress || '',
        city: addr.city || '',
        state: addr.state || 'Karnataka',
        pincode: addr.pincode || '',
        isDefault: !!addr.isDefault,
      }))
    );
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.flat || !newAddr.street || !newAddr.pincode || !user?.uid) return;
    try {
      await createAddress(getIdToken, user.uid, {
        label: newAddr.tag,
        houseNo: newAddr.flat,
        area: newAddr.street,
        city: newAddr.city,
        pincode: newAddr.pincode,
        fullAddress: `${newAddr.flat}, ${newAddr.street}, ${newAddr.city} - ${newAddr.pincode}`,
        isDefault: addresses.length === 0,
      });
      await refreshAddresses();
      setNewAddr({ tag: 'Home', flat: '', street: '', city: 'Bengaluru', pincode: '' });
      setShowAddressForm(false);
    } catch (err) {
      console.error('Failed to save address:', err);
    }
  };

  const setDefaultAddress = async (id) => {
    if (!user?.uid) return;
    try {
      await selectAddress(getIdToken, user.uid, id);
      await refreshAddresses();
    } catch (err) {
      console.error('Failed to set default address:', err);
    }
  };

  const deleteAddress = async (id) => {
    if (!user?.uid) return;
    try {
      await deleteAddressApi(getIdToken, user.uid, id);
      await refreshAddresses();
    } catch (err) {
      console.error('Failed to delete address:', err);
    }
  };

  // Wallet handler
  // Crediting a real wallet without collecting real payment would be a
  // fraud vector, and wiring actual payment collection here duplicates the
  // separate Razorpay-integrity work already scoped elsewhere — so this
  // stays a visible "coming soon" state rather than a silent fake credit.
  const handleAddMoney = (e) => {
    e.preventDefault();
    setAddMoneyNotice('Adding money directly is coming soon. For now, redeem a promo code above to add funds to your wallet.');
    setAddAmount('');
  };

  const handleAddUpi = (e) => {
    e.preventDefault();
    if (!newUpi || !newUpi.includes('@')) return;
    const updated = [...upiList, newUpi.trim()];
    setUpiList(updated);
    localStorage.setItem(`accesco_upi_list_${userKey}`, JSON.stringify(updated));
    setNewUpi('');
    setShowAddUpi(false);
  };

  // Coupon handler. FREEDEL is a non-monetary delivery perk with no wallet
  // equivalent, so it's left exactly as it was — local-only. Every other
  // code now redeems through the real, server-validated wallet (see
  // app/api/wallet/redeem) instead of the old hardcoded client-side check,
  // which could never actually stop someone from editing validCodes/reward
  // in devtools and crediting themselves anything.
  const handleRedeem = async (e, codeToRedeem = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetCode = (codeToRedeem || promoInput).trim().toUpperCase();
    if (!targetCode) return;

    if (targetCode === 'FREEDEL') {
      if (redeemedCoupons.includes('FREEDEL')) {
        setPromoMessage({ type: 'error', text: `❌ Coupon code 'FREEDEL' has already been redeemed!` });
        return;
      }
      setHasFreeDelivery(true);
      localStorage.setItem(`accesco_free_delivery_${userKey}`, 'true');
      localStorage.setItem('grokly_free_delivery', 'true');
      localStorage.setItem('swadishtt_free_delivery', 'true');

      setPromoInput('');
      setPromoMessage({
        type: 'success',
        text: `🚚 Coupon code 'FREEDEL' successfully applied! Free Delivery Pass activated across all services.`,
      });
      return;
    }

    if (!walletUid) {
      setPromoMessage({ type: 'error', text: '❌ Please log in to redeem a code.' });
      return;
    }

    try {
      const result = await redeemCode(getIdToken, walletUid, targetCode);
      setWalletBalance(result.balance);
      setWalletTransactions((prev) => [toDisplayTransaction(result.transaction), ...prev]);
      setPromoInput('');
      setPromoMessage({
        type: 'success',
        text: `🎉 Coupon code '${targetCode}' successfully applied! ₹${result.transaction.amount} added to your wallet balance. New Balance: ₹${result.balance}.`,
      });
    } catch (err) {
      setPromoMessage({ type: 'error', text: `❌ ${err.message}` });
    }
  };

  // Subscription toggle
  const toggleSub = (id) => {
    const updated = subscriptions.map((s) => (s.id === id ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' } : s));
    setSubscriptions(updated);
    localStorage.setItem(`accesco_subscriptions_${userKey}`, JSON.stringify(updated));
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
                        addMoneyNotice={addMoneyNotice}
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
