'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SwadishttHeader from '../components/SwadishttHeader';
import { useSwadishtt } from '../contexts/SwadishttContext';
import styles from './profile.module.css';

function formatMoney(value) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount)) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
}

function formatDate(value) {
  if (!value) return 'Date unavailable';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Date unavailable';
  return parsed.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SwadishttProfilePage() {
  const { orders, user: contextUser } = useSwadishtt();

  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [healthMode, setHealthMode] = useState(false);

  // Address editing state
  const [editingAddress, setEditingAddress] = useState(false);
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editPincode, setEditPincode] = useState('');
  const [addressSaved, setAddressSaved] = useState(false);

  const handleHealthModeToggle = () => {
    const nextValue = !healthMode;
    setHealthMode(nextValue);
    localStorage.setItem('swadishtt-health-mode', JSON.stringify(nextValue));
    if (nextValue) {
      window.location.href = '/services/swadisht/healthy-mode';
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const rawHealthMode = localStorage.getItem('swadishtt-health-mode');
      if (rawHealthMode) setHealthMode(JSON.parse(rawHealthMode));
    } catch (error) {
      console.error('Error reading health mode:', error);
    }

    let storedUser = null;
    let storedLocation = null;

    try {
      const rawUser = localStorage.getItem('accesco_user');
      if (rawUser) storedUser = JSON.parse(rawUser);
    } catch (error) {
      console.error('Error reading accesco_user from localStorage:', error);
    }

    try {
      const rawLocation = localStorage.getItem('userLocation');
      if (rawLocation) storedLocation = JSON.parse(rawLocation);
    } catch (error) {
      console.error('Error reading userLocation from localStorage:', error);
    }

    const resolvedName = contextUser?.name || (typeof storedUser?.name === 'string' ? storedUser.name : '');
    const resolvedPhone = contextUser?.phone || (typeof storedUser?.phone === 'string' ? storedUser.phone : '');
    const resolvedEmail = contextUser?.email || (typeof storedUser?.email === 'string' ? storedUser.email : '');

    const resolvedCity =
      (typeof storedLocation?.city === 'string' && storedLocation.city) ||
      (typeof storedLocation?.state === 'string' && storedLocation.state) ||
      (typeof storedLocation?.region === 'string' && storedLocation.region) ||
      '';

    const resolvedPincode =
      (typeof storedLocation?.pincode === 'string' && storedLocation.pincode) ||
      (typeof storedLocation?.postalCode === 'string' && storedLocation.postalCode) ||
      (typeof storedLocation?.pincode === 'number' ? String(storedLocation.pincode) : '') ||
      '';

    const resolvedAddress =
      (typeof storedLocation?.fullAddress === 'string' && storedLocation.fullAddress) ||
      (typeof storedLocation?.formattedAddress === 'string' && storedLocation.formattedAddress) ||
      (typeof storedLocation?.displayAddress === 'string' && storedLocation.displayAddress) ||
      (typeof storedLocation?.area === 'string' && resolvedCity
        ? `${storedLocation.area}, ${resolvedCity}`
        : typeof storedLocation?.area === 'string'
        ? storedLocation.area
        : '') ||
      '';

    setProfile({
      name: resolvedName,
      phone: resolvedPhone,
      email: resolvedEmail,
      address: resolvedAddress,
      city: resolvedCity,
      pincode: resolvedPincode,
    });

    setEditAddress(resolvedAddress);
    setEditCity(resolvedCity);
    setEditPincode(resolvedPincode);
  }, [contextUser]);

  const handleSaveAddress = () => {
    const updatedProfile = {
      ...profile,
      address: editAddress,
      city: editCity,
      pincode: editPincode,
    };
    setProfile(updatedProfile);

    try {
      const rawLocation = localStorage.getItem('userLocation');
      const storedLocation = rawLocation ? JSON.parse(rawLocation) : {};
      const updated = {
        ...storedLocation,
        fullAddress: editAddress,
        formattedAddress: editAddress,
        displayAddress: editAddress,
        city: editCity,
        area: editAddress.split(',')[0]?.trim() || editAddress,
        pincode: editPincode,
        postalCode: editPincode,
      };
      localStorage.setItem('userLocation', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving userLocation:', error);
    }

    setEditingAddress(false);
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 3000);
  };

  const handleCancelEdit = () => {
    setEditAddress(profile.address);
    setEditCity(profile.city);
    setEditPincode(profile.pincode);
    setEditingAddress(false);
  };

  const totalSpent = (orders || []).reduce((sum, order) => sum + (Number(order?.totals?.total || order?.total) || 0), 0);
  const recentOrders = (orders || []).slice(0, 5);

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      {/* Address saved toast */}
      {addressSaved && (
        <div className={styles.savedToast}>Address saved successfully!</div>
      )}

      <div className={styles.container}>
        <div className={styles.dashboardLayout}>
          {/* Left Column: Sidebar Card */}
          <aside className={styles.sidebar}>
            <div className={styles.profileCard}>
              <div className={styles.avatar}>
                {(profile.name || 'U').charAt(0).toUpperCase()}
              </div>
              <h2 className={styles.profileName}>{profile.name || 'Accesco User'}</h2>
              <p className={styles.profilePhone}>
                {profile.phone || 'No phone number linked'}
              </p>
              <p className={styles.profileEmail}>
                {profile.email || 'No email linked'}
              </p>

              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <span className={styles.statVal}>{orders.length}</span>
                  <span className={styles.statLabel}>Orders</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statVal}>{formatMoney(totalSpent)}</span>
                  <span className={styles.statLabel}>Total Spent</span>
                </div>
              </div>

              <div className={styles.quickActions}>
                <Link href="/services/swadisht" className={`${styles.quickActionBtn} ${styles.quickActionPrimary}`}>
                  Start New Order
                </Link>
                <Link href="/services/swadisht/orders" className={`${styles.quickActionBtn} ${styles.quickActionSecondary}`}>
                  View All Orders
                </Link>
              </div>

              <div className={styles.healthToggleCard}>
                <div className={styles.healthInfo}>
                  <span className={styles.healthLabel}>Precision Health Mode</span>
                  <p className={styles.healthDesc}>
                    {healthMode ? 'Healthier alternatives enabled.' : 'Filter menu by nutrition value.'}
                  </p>
                </div>
                <button
                  type="button"
                  className={`${styles.healthToggleBtn} ${healthMode ? styles.healthToggleBtnOn : ''}`}
                  onClick={handleHealthModeToggle}
                  aria-pressed={healthMode}
                >
                  <span className={styles.toggleKnob} />
                </button>
              </div>
            </div>
          </aside>

          {/* Right Column: Details Pane */}
          <main className={styles.detailsPane}>
            {/* Browse Premium Offerings */}
            <section className={styles.panelCard}>
              <div className={styles.panelHeaderRow}>
                <h3 className={styles.panelTitle}>Browse Premium Offerings</h3>
                <Link href="/services/swadisht" className={styles.panelLink}>
                  Browse All →
                </Link>
              </div>
              <p className={styles.panelSubtitle}>
                Order from authentic local kitchens, explore curated menus, and craft custom thalis.
              </p>
              <div className={styles.cuisinePromoGrid}>
                <Link href="/services/swadisht/categories" className={styles.cuisinePromoCard}>
                  <div className={styles.cuisinePromoBg} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&fit=crop)' }}></div>
                  <div className={styles.cuisinePromoOverlay}></div>
                  <div className={styles.cuisinePromoInfo}>
                    <h4>Royal Biryanis</h4>
                    <span>Explore Categories →</span>
                  </div>
                </Link>
                <Link href="/services/swadisht" className={styles.cuisinePromoCard}>
                  <div className={styles.cuisinePromoBg} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&fit=crop)' }}></div>
                  <div className={styles.cuisinePromoOverlay}></div>
                  <div className={styles.cuisinePromoInfo}>
                    <h4>Signature Restaurants</h4>
                    <span>Order Now →</span>
                  </div>
                </Link>
                <Link href="/services/swadisht/thali-engine" className={styles.cuisinePromoCard}>
                  <div className={styles.cuisinePromoBg} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=500&fit=crop)' }}></div>
                  <div className={styles.cuisinePromoOverlay}></div>
                  <div className={styles.cuisinePromoInfo}>
                    <h4>Artisanal Thalis</h4>
                    <span>Build Thali →</span>
                  </div>
                </Link>
                <Link href="/services/swadisht/regional-soul" className={styles.cuisinePromoCard}>
                  <div className={styles.cuisinePromoBg} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&fit=crop)' }}></div>
                  <div className={styles.cuisinePromoOverlay}></div>
                  <div className={styles.cuisinePromoInfo}>
                    <h4>Regional Flavors</h4>
                    <span>Explore India →</span>
                  </div>
                </Link>
              </div>
            </section>

            {/* Delivery Addresses */}
            <section className={styles.panelCard}>
              <div className={styles.panelHeaderRow}>
                <h3 className={styles.panelTitle}>Saved Delivery Address</h3>
                {!editingAddress && (
                  <button
                    type="button"
                    className={styles.editAddressBtn}
                    onClick={() => setEditingAddress(true)}
                  >
                    Edit
                  </button>
                )}
              </div>

              {editingAddress ? (
                <div className={styles.addressEditForm}>
                  <div className={styles.editFormGroup}>
                    <label className={styles.editLabel}>Full Address</label>
                    <textarea
                      className={styles.editTextarea}
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      rows={3}
                      placeholder="House/flat no, street, area, landmark..."
                    />
                  </div>
                  <div className={styles.editFormRow}>
                    <div className={styles.editFormGroup}>
                      <label className={styles.editLabel}>City</label>
                      <input
                        type="text"
                        className={styles.editInput}
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div className={styles.editFormGroup}>
                      <label className={styles.editLabel}>Pincode</label>
                      <input
                        type="text"
                        className={styles.editInput}
                        value={editPincode}
                        onChange={(e) => setEditPincode(e.target.value)}
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />
                    </div>
                  </div>
                  <div className={styles.editActions}>
                    <button type="button" className={styles.cancelEditBtn} onClick={handleCancelEdit}>
                      Cancel
                    </button>
                    <button type="button" className={styles.saveAddressBtn} onClick={handleSaveAddress}>
                      Save Address
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.addressList}>
                  {profile.address ? (
                    <div className={styles.addressItem}>
                      <div className={styles.addressIconWrap}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      </div>
                      <div className={styles.addressInfo}>
                        <span className={styles.addressTag}>Default Delivery Address</span>
                        <p className={styles.addressText}>
                          {profile.address}
                          {profile.city && `, ${profile.city}`}
                          {profile.pincode && ` — ${profile.pincode}`}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.emptyAddressRow}>
                      <p className={styles.emptyPanelText}>No saved delivery address. Click Edit to add one.</p>
                      <button type="button" className={styles.addAddressBtn} onClick={() => setEditingAddress(true)}>
                        + Add Address
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Preferred Payment Methods */}
            <section className={styles.panelCard}>
              <h3 className={styles.panelTitle}>Preferred Payment Methods</h3>
              <div className={styles.paymentMethods}>
                <div className={styles.paymentMethodItem}>
                  <div className={styles.payIconWrap}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  </div>
                  <div className={styles.paymentInfo}>
                    <span className={styles.payName}>UPI Payments (Auto-Saved)</span>
                    <p className={styles.payDetails}>Google Pay, PhonePe, Paytm</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Orders Widget */}
            <section className={styles.panelCard}>
              <div className={styles.panelHeaderRow}>
                <h3 className={styles.panelTitle}>Recent Swadishtt Orders</h3>
                <Link href="/services/swadisht/orders" className={styles.panelLink}>
                  View All →
                </Link>
              </div>

              <div className={styles.recentOrdersList}>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, idx) => (
                    <Link
                      key={order.id || idx}
                      href={`/services/swadisht/order-tracking?id=${order.id || order.orderId}`}
                      className={styles.orderRow}
                    >
                      <div className={styles.orderMeta}>
                        <span className={styles.orderId}>#{order.id || order.orderId}</span>
                        <span className={styles.orderDate}>{formatDate(order.placedAt || order.timestamp)}</span>
                      </div>
                      <div className={styles.orderCostRow}>
                        <span className={styles.orderItemsCount}>
                          {order.items?.length || 1} {order.items?.length === 1 ? 'item' : 'items'}
                        </span>
                        <span className={styles.orderCost}>{formatMoney(order.totals?.total || order.total)}</span>
                      </div>
                      <span className={`${styles.statusBadge} ${styles[order.status?.toLowerCase()] || ''}`}>
                        {order.status || 'Placed'}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className={styles.emptyPanelText}>No orders found in history.</p>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
