'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import styles from './profile.module.css';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/lib/mockData';
import ActiveOrdersWidget from '@/components/ActiveOrdersWidget';
import Select from '@/components/instastyle/Select';

const PROFILE_STORAGE_KEY = 'instastyle_profile';

const initialProfile = {
  fullName: 'Accesco Customer',
  email: 'customer@accesco.in',
  phone: '+91 9022217637',
  gender: 'Prefer not to say',
  sizeTop: 'M',
  sizeBottom: '32',
  styleNotes: 'Minimal, everyday, and occasion-ready edits.',
};

const savedAddresses = [
  {
    id: 'addr_1',
    label: 'Home',
    line1: '21, 6th Main Road',
    line2: 'Indiranagar, Bengaluru, Karnataka',
    pincode: '560038',
  },
  {
    id: 'addr_2',
    label: 'Work',
    line1: '2nd Floor, Accesco Hub',
    line2: 'Koramangala, Bengaluru, Karnataka',
    pincode: '560095',
  },
];

const recentOrders = [
  { id: 'AC-2041', date: 'Today', status: 'Packed', amount: '₹4,980' },
  { id: 'AC-1972', date: '2 days ago', status: 'Delivered', amount: '₹2,760' },
  { id: 'AC-1890', date: 'Last week', status: 'Returned', amount: '₹1,340' },
];

const accountMoments = [
  { id: 'm_1', title: 'Profile tuned', detail: 'Sizes and preferences updated', time: 'Today' },
  { id: 'm_2', title: 'Order delivered', detail: 'Premium summer edit delivered', time: '2 days ago' },
  { id: 'm_3', title: 'Wishlist refreshed', detail: '5 new products saved', time: 'This week' },
];

export default function ProfilePage() {
  const { cart, wishlist } = useCart();
  const [profile, setProfile] = useState(initialProfile);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [circularCredits, setCircularCredits] = useState(120);

  const recommendedCount = useMemo(() => products.filter((product) => product.isFeatured).length, []);
  const orderCount = recentOrders.length;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const completionKeys = ['fullName', 'email', 'phone', 'gender', 'sizeTop', 'sizeBottom', 'styleNotes'];
  const profileCompletion = Math.round(
    (completionKeys.filter((field) => String(profile[field] || '').trim().length > 0).length /
      completionKeys.length) *
      100
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      let next = { ...initialProfile };
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        next = { ...next, ...parsed };
      }
      const rawUser = localStorage.getItem('accesco_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        const name = typeof u.name === 'string' ? u.name.trim() : '';
        const phone = typeof u.phone === 'string' ? u.phone.trim() : '';
        const email = typeof u.email === 'string' ? u.email.trim() : '';
        if (name) next.fullName = name;
        if (phone) next.phone = phone;
        if (email) next.email = email;
      }
      setProfile(next);

      // Read circular credits
      const credits = localStorage.getItem('instastyle_circular_credits');
      if (credits) setCircularCredits(Number(credits));
    } catch (error) {
      console.warn('Profile storage read failed:', error);
    }
  }, []);

  const updateField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = () => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500);
    } catch (error) {
      console.warn('Profile storage write failed:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Account center</p>
          <h1>Your InstaStyle profile</h1>
          <p className={styles.subtitle}>
            Keep your sizes, addresses, orders, reverse commerce returns, and style preferences in one place.
          </p>

          <div className={styles.quickStats}>
            <div className={styles.statCard}>
              <span>Wishlist</span>
              <strong>{wishlist.length}</strong>
            </div>
            <div className={styles.statCard}>
              <span>Cart</span>
              <strong>{cartCount}</strong>
            </div>
            <div className={styles.statCard}>
              <span>Orders</span>
              <strong>{orderCount}</strong>
            </div>
            <div className={styles.statCard}>
              <span>Circular Credits</span>
              <strong>{circularCredits}</strong>
            </div>
          </div>
        </div>

        <div className={styles.profileCard}>
          <div className={styles.avatar}>
            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <h2>{profile.fullName}</h2>
            <p>Preferred fit: {profile.sizeTop} / {profile.sizeBottom} • Saved addresses: {savedAddresses.length} • Rewards: Active ({circularCredits} pts)</p>
          </div>
          <div className={styles.completionWrap}>
            <div className={styles.completionHeader}>
              <span>Profile completion</span>
              <strong>{profileCompletion}%</strong>
            </div>
            <div className={styles.completionTrack}>
              <div className={styles.completionBar} style={{ width: `${profileCompletion}%` }} />
            </div>
          </div>
          <div className={styles.cardMeta}>
            <span>Member since</span>
            <strong>2026</strong>
          </div>
        </div>
      </section>

      {/* ── REVERSE COMMERCE & ACCOUNT HUB ── */}
      <section className={styles.hubSection}>
        <div className={styles.hubHeader}>
          <div>
            <h2>Reverse Commerce & Quick Services</h2>
            <p>Access Try & Return, Circular Credits, AI Condition Guide, and Account Settings.</p>
          </div>
        </div>

        <div className={styles.hubGrid}>
          {/* Try & Return Card */}
          <Link href="/services/instastyle/try-return" className={styles.hubCard}>
            <div className={styles.hubCardLeft}>
              <div className={styles.hubIconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <span className={styles.hubTitle}>Try & Return</span>
                <p className={styles.hubDesc}>Return items with next delivery for Circular Credits</p>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          {/* Circular Credits Card */}
          <Link href="/services/instastyle/circular-credits" className={styles.hubCard}>
            <div className={styles.hubCardLeft}>
              <div className={styles.hubIconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </div>
              <div>
                <span className={styles.hubTitle}>Circular Credits</span>
                <p className={styles.hubDesc}>Earn & redeem credits on circular fashion</p>
              </div>
            </div>
            <div className={styles.hubBadge}>{circularCredits} pts</div>
          </Link>

          {/* AI Condition Guide & Sell Card */}
          <Link href="/services/instastyle/add-sku/condition-guide" className={styles.hubCard}>
            <div className={styles.hubCardLeft}>
              <div className={styles.hubIconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div>
                <span className={styles.hubTitle}>AI Condition Guide</span>
                <p className={styles.hubDesc}>Grade B (87% confidence) & Sell apparel</p>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          {/* My Orders Card */}
          <Link href="/services/instastyle/orders" className={styles.hubCard}>
            <div className={styles.hubCardLeft}>
              <div className={styles.hubIconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <div>
                <span className={styles.hubTitle}>My Orders</span>
                <p className={styles.hubDesc}>Track, view receipt & return history</p>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          {/* Saved Items Card */}
          <Link href="/services/instastyle/wishlist" className={styles.hubCard}>
            <div className={styles.hubCardLeft}>
              <div className={styles.hubIconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <span className={styles.hubTitle}>Saved Items</span>
                <p className={styles.hubDesc}>{wishlist.length} items in your wishlist</p>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          {/* Report an Issue Card */}
          <Link href="/services/instastyle/report-issue" className={styles.hubCard}>
            <div className={styles.hubCardLeft}>
              <div className={styles.hubIconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C2E00" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <span className={styles.hubTitle}>Report an Issue</span>
                <p className={styles.hubDesc}>Size fit, damaged or wrong product assistance</p>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Profile details</h3>
            <span>{saveStatus === 'saved' ? 'Saved' : saveStatus === 'error' ? 'Failed' : 'Editable'}</span>
          </div>

          <div className={styles.formGrid}>
            <label>
              <span>Full name</span>
              <input value={profile.fullName} onChange={(e) => updateField('fullName', e.target.value)} />
            </label>
            <label>
              <span>Email</span>
              <input value={profile.email} onChange={(e) => updateField('email', e.target.value)} />
            </label>
            <label>
              <span>Phone</span>
              <input value={profile.phone} onChange={(e) => updateField('phone', e.target.value)} />
            </label>
            <Select 
              label="Gender"
              value={profile.gender}
              options={['Prefer not to say', 'Women', 'Men', 'Non-binary']}
              onChange={(val) => updateField('gender', val)}
            />
            <Select 
              label="Top size"
              value={profile.sizeTop}
              options={['XS', 'S', 'M', 'L', 'XL']}
              onChange={(val) => updateField('sizeTop', val)}
            />
            <Select 
              label="Bottom size"
              value={profile.sizeBottom}
              options={['28', '30', '32', '34', '36']}
              onChange={(val) => updateField('sizeBottom', val)}
            />
          </div>

          <label className={styles.notesField}>
            <span>Style notes</span>
            <textarea
              rows={3}
              value={profile.styleNotes}
              onChange={(e) => updateField('styleNotes', e.target.value)}
            />
          </label>

          <div className={styles.panelActions}>
            <button type="button" className={styles.primaryAction} onClick={saveProfile}>Save profile</button>
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Saved addresses</h3>
            <span>{savedAddresses.length} addresses</span>
          </div>

          <div className={styles.addressList}>
            {savedAddresses.map((address) => (
              <div key={address.id} className={styles.addressCard}>
                <strong>{address.label}</strong>
                <p>{address.line1}</p>
                <p>{address.line2}</p>
                <span>{address.pincode}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.timelineSection}>
        <div className={styles.panelHeader}>
          <h3>Activity timeline</h3>
          <span>Recent account moments</span>
        </div>
        <div className={styles.timelineList}>
          {accountMoments.map((moment) => (
            <article key={moment.id} className={styles.timelineItem}>
              <div>
                <strong>{moment.title}</strong>
                <p>{moment.detail}</p>
              </div>
              <span>{moment.time}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}