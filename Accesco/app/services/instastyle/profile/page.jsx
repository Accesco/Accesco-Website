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
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      setProfile((prev) => ({ ...prev, ...parsed }));
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
            Keep your sizes, addresses, orders, and style preferences in one place.
          </p>
          <div className={styles.actions}>
            <Link href="/services/instastyle/catalog" className={styles.primaryAction}>Shop the catalog</Link>
            <Link href="/services/instastyle/wishlist" className={styles.secondaryAction}>Open wishlist</Link>
          </div>

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
              <span>Recommended</span>
              <strong>{recommendedCount}</strong>
            </div>
          </div>
        </div>

        <div className={styles.profileCard}>
          <div className={styles.avatar}>AC</div>
          <div>
            <h2>{profile.fullName}</h2>
            <p>Preferred fit: {profile.sizeTop} / {profile.sizeBottom} • Saved addresses: {savedAddresses.length} • Rewards: Active</p>
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

      <section className={styles.ordersSection}>
        <ActiveOrdersWidget venture="InstaStyle" />
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link 
            href="/services/instastyle/orders" 
            className={styles.secondaryAction}
            style={{ 
              display: 'inline-block', 
              padding: '12px 24px', 
              textDecoration: 'none',
              background: '#f8f9fa',
              borderRadius: '8px',
              fontWeight: 600,
              color: '#111',
              border: '1px solid #eee'
            }}
          >
            View Order History →
          </Link>
        </div>
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