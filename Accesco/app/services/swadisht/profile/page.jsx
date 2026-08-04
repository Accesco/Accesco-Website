'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import SwadishttHeader from '../components/SwadishttHeader';
import { useAuth } from '../../../components/AuthProvider';
import {
  fetchProfile,
  updateProfile,
  updateDeliveryAddress,
  uploadProfileImage,
  deleteProfileImage,
} from '../../../../lib/profileService';
import styles from './profile.module.css';

const ORDERS_KEY = 'swadishtt-orders';

const menuItems = [
  ['orders', 'Order History', 'history'],
  ['baskets', 'Saved Baskets', 'basket'],
  ['wishlist', 'Wishlist', 'wishlist'],
  ['returns', 'Eco-Return (Reuse)', 'return'],
  ['address', 'Delivery Address', 'address'],
  ['coupons', 'My Coupons', 'coupon'],
  ['notifications', 'Notifications', 'notification'],
  ['settings', 'Account Settings', 'settings'],
];

const initialBaskets = [
  {
    id: 1,
    name: 'Family Thali',
    description: '8 dishes · Last ordered on 12th May',
    more: 3,
    items: [
      ['Indian Thali', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=180&q=80'],
      ['Paneer Curry', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=180&q=80'],
      ['Indian Roti', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=180&q=80'],
      ['Vegetable Curry', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=180&q=80'],
      ['Dessert', 'https://images.unsplash.com/photo-1666190094763-3a12e9840fd0?auto=format&fit=crop&w=180&q=80'],
    ],
  },
  {
    id: 2,
    name: 'Weekend Biryani',
    description: '6 dishes · Last ordered on 11th May',
    more: 1,
    items: [
      ['Chicken Biryani', 'https://images.unsplash.com/photo-1563379091339-03246963d51a?auto=format&fit=crop&w=180&q=80'],
      ['Biryani Rice', 'https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?auto=format&fit=crop&w=180&q=80'],
      ['Chicken Curry', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=180&q=80'],
      ['Raita', 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=180&q=80'],
      ['Dessert', 'https://images.unsplash.com/photo-1666190094763-3a12e9840fd0?auto=format&fit=crop&w=180&q=80'],
    ],
  },
  {
    id: 3,
    name: 'Healthy Lunch',
    description: '7 dishes · Last ordered on 2nd May',
    more: 2,
    items: [
      ['Healthy Salad', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=180&q=80'],
      ['Healthy Bowl', 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=180&q=80'],
      ['Vegetable Bowl', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=180&q=80'],
      ['Healthy Wrap', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=180&q=80'],
      ['Smoothie', 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=180&q=80'],
    ],
  },
];

function Icon({ type, className = '' }) {
  const props = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  const paths = {
    history: (
      <>
        <path d="M4 8h16l-1.4 12H5.4L4 8Z" />
        <path d="M7 8l2-4h6l2 4M8 12v4M12 12v4M16 12v4" />
      </>
    ),
    basket: (
      <>
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
        <path d="M3 4h2l2.3 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H6" />
      </>
    ),
    wishlist: (
      <path d="M20.8 5.2a5.4 5.4 0 0 0-7.7 0L12 6.3l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 21l8.8-8.1a5.4 5.4 0 0 0 0-7.7Z" />
    ),
    return: (
      <>
        <path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15" />
        <path d="m7 22-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3" />
      </>
    ),
    address: (
      <>
        <path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.8" />
      </>
    ),
    coupon: (
      <>
        <path d="M20 12a2.5 2.5 0 0 0 0-5V4H4v3a2.5 2.5 0 0 0 0 5v5a2.5 2.5 0 0 0 0 5h16v-5a2.5 2.5 0 0 0 0-5Z" />
        <path d="M9 9h.01M15 17h.01M9 17l6-8" />
      </>
    ),
    notification: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
        <path d="M10 21h4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 14.5a2 2 0 0 0 .4 2.2l.1.1-2.7 2.7-.1-.1a2 2 0 0 0-2.2-.4 2 2 0 0 0-1.2 1.8V21H9v-.2A2 2 0 0 0 7.8 19a2 2 0 0 0-2.2.4l-.1.1-2.7-2.7.1-.1a2 2 0 0 0 .4-2.2A2 2 0 0 0 1.5 13H1v-4h.5a2 2 0 0 0 1.8-1.2 2 2 0 0 0-.4-2.2l-.1-.1 2.7-2.7.1.1a2 2 0 0 0 2.2.4A2 2 0 0 0 9 1.5V1h4v.5a2 2 0 0 0 1.2 1.8 2 2 0 0 0 2.2-.4l.1-.1 2.7 2.7-.1.1a2 2 0 0 0-.4 2.2A2 2 0 0 0 20.5 9h.5v4h-.5a2 2 0 0 0-1.5 1.5Z" />
      </>
    ),
    logout: (
      <>
        <path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" />
        <path d="M13 8l4 4-4 4M17 12H8" />
      </>
    ),
    camera: (
      <>
        <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
        <circle cx="12" cy="14" r="3.5" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
      </>
    ),
  };

  return (
    <span className={`${styles.icon} ${className}`}>
      <svg {...props}>{paths[type]}</svg>
    </span>
  );
}

function WelcomeGraphic() {
  return (
    <svg className={styles.welcomeGraphic} viewBox="0 0 230 120">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 91h79" stroke="#222" strokeWidth="5" />
        <path d="M30 88c4-23 18-35 34-35s30 12 34 35" stroke="#222" strokeWidth="5" />
        <path d="M47 50c-7-9 6-12 0-22M64 50c-7-9 6-12 0-22M81 50c-7-9 6-12 0-22" stroke="#c42030" strokeWidth="4" />
        <rect x="116" y="27" width="52" height="62" rx="7" stroke="#222" strokeWidth="5" />
        <path d="M129 27v-7h26v7" stroke="#222" strokeWidth="5" />
        <circle cx="142" cy="57" r="8" stroke="#c42030" strokeWidth="3" />
        <path d="M142 52v6l4 2" stroke="#c42030" strokeWidth="2" />
        <path d="M178 54h37l-5 40h-27Z" stroke="#c42030" strokeWidth="5" />
        <path d="m188 54-9-18M179 36h15" stroke="#222" strokeWidth="4" />
      </g>
      <g fill="#c42030">
        <path d="m12 32 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" />
        <path d="m214 21 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" />
      </g>
    </svg>
  );
}

function Heading({ icon, title, children }) {
  return (
    <div className={styles.heading}>
      <div>
        <Icon type={icon} />
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function SwadishttProfilePage() {
  const { user, getIdToken, signOut } = useAuth();
  const [profile, setProfile] = useState({
    name: 'Sample',
    phone: '9000000000',
    email: 'sample@gmail.com',
    photoURL: null,
  });
  const [profileForm, setProfileForm] = useState(profile);
  const [address, setAddress] = useState({
    address: '',
    city: '',
    pincode: '',
  });
  const [orders, setOrders] = useState([]);
  const [section, setSection] = useState('orders');
  const [search, setSearch] = useState('');
  const [returnFilter, setReturnFilter] = useState('all');
  const [editProfile, setEditProfile] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [message, setMessage] = useState('');
  const [baskets, setBaskets] = useState(initialBaskets);
  const [openBasketMenu, setOpenBasketMenu] = useState(null);
  const [basketNotice, setBasketNotice] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    try {
      const cachedUser = JSON.parse(
        localStorage.getItem('accesco_user') || '{}'
      );
      const loadedProfile = {
        name: cachedUser.name || 'Sample',
        phone: cachedUser.phone || '9000000000',
        email: cachedUser.email || 'sample@gmail.com',
        photoURL: cachedUser.photoURL || null,
      };
      setProfile(loadedProfile);
      setProfileForm(loadedProfile);
    } catch (error) {
      console.error(error);
    }

    try {
      const location = JSON.parse(
        localStorage.getItem('userLocation') || '{}'
      );
      setAddress({
        address:
          location.fullAddress ||
          location.formattedAddress ||
          location.displayAddress ||
          location.area ||
          '',
        city: location.city || '',
        pincode: location.pincode || location.postalCode || '',
      });
    } catch (error) {
      console.error(error);
    }

    try {
      const existingOrders = JSON.parse(
        localStorage.getItem(ORDERS_KEY) || '[]'
      );
      setOrders(Array.isArray(existingOrders) ? existingOrders : []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Once signed in, the backend profile is the source of truth — overwrite the
  // localStorage-seeded state above with the synced record.
  useEffect(() => {
    if (!user?.uid) return;

    let cancelled = false;

    (async () => {
      const { profile: remoteProfile, error: profileError } = await fetchProfile(
        getIdToken,
        user.uid
      );

      if (cancelled) return;

      if (remoteProfile) {
        const loadedProfile = {
          name: remoteProfile.name || 'Sample',
          phone: remoteProfile.phone || '9000000000',
          email: remoteProfile.email || 'sample@gmail.com',
          photoURL: remoteProfile.photoURL || null,
        };
        setProfile(loadedProfile);
        setProfileForm(loadedProfile);

        if (remoteProfile.deliveryAddress) {
          setAddress(remoteProfile.deliveryAddress);
        }
      } else if (profileError) {
        console.error('Failed to load synced profile:', profileError);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.uid, getIdToken]);

  const firstName = profile.name.trim().split(' ')[0] || 'Sample';
  const initial = firstName.charAt(0).toUpperCase();

  const filteredBaskets = useMemo(
    () =>
      baskets.filter((basket) =>
        basket.name.toLowerCase().includes(search.toLowerCase())
      ),
    [baskets, search]
  );

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 2500);
  };

  const showBasketNotice = (text) => {
    setBasketNotice(text);
    window.setTimeout(() => setBasketNotice(''), 2500);
  };

  const renameBasket = (basket) => {
    const newName = window.prompt('Rename basket', basket.name);
    if (!newName?.trim()) return;
    setBaskets((current) =>
      current.map((item) =>
        item.id === basket.id ? { ...item, name: newName.trim() } : item
      )
    );
    setOpenBasketMenu(null);
    showBasketNotice('Basket renamed successfully');
  };

  const duplicateBasket = (basket) => {
    setBaskets((current) => [
      ...current,
      { ...basket, id: Date.now(), name: `${basket.name} Copy` },
    ]);
    setOpenBasketMenu(null);
    showBasketNotice('Basket duplicated successfully');
  };

  const shareBasket = async (basket) => {
    const text = `${basket.name}: ${basket.items.map(([name]) => name).join(', ')}`;
    try {
      if (navigator.share) await navigator.share({ title: basket.name, text });
      else {
        await navigator.clipboard.writeText(text);
        showBasketNotice('Basket details copied');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') console.error('Unable to share basket:', error);
    }
    setOpenBasketMenu(null);
  };

  const deleteBasket = (basket) => {
    if (!window.confirm(`Delete "${basket.name}"?`)) return;
    setBaskets((current) => current.filter((item) => item.id !== basket.id));
    setOpenBasketMenu(null);
    showBasketNotice('Basket deleted');
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    const trimmedName = profileForm.name?.trim();
    if (!trimmedName) {
      showMessage('Full name is required');
      return;
    }

    const nextProfile = {
      name: trimmedName,
      phone: profileForm.phone?.trim() || '',
      email: profileForm.email?.trim() || '',
    };

    if (user?.uid) {
      try {
        await updateProfile(getIdToken, user.uid, nextProfile);
      } catch (error) {
        console.error('saveProfile error:', error);
        showMessage(error.message || 'Failed to update profile');
        return;
      }
    }

    const mergedProfile = { ...profile, ...nextProfile };
    const cachedUser = JSON.parse(localStorage.getItem('accesco_user') || '{}');
    localStorage.setItem(
      'accesco_user',
      JSON.stringify({ ...cachedUser, ...nextProfile })
    );

    setProfile(mergedProfile);
    setProfileForm(mergedProfile);
    setEditProfile(false);
    showMessage('Profile updated successfully');
  };

  const saveAddress = async (event) => {
    event.preventDefault();

    const trimmedAddress = address.address?.trim();
    const trimmedCity = address.city?.trim();
    const trimmedPincode = address.pincode?.trim();

    if (!trimmedAddress || trimmedAddress.length < 5 || !trimmedCity || !/^\d{6}$/.test(trimmedPincode || '')) {
      showMessage('Please enter a complete address with a valid 6-digit pincode');
      return;
    }

    const nextAddress = { address: trimmedAddress, city: trimmedCity, pincode: trimmedPincode };

    if (user?.uid) {
      try {
        await updateDeliveryAddress(getIdToken, user.uid, nextAddress);
      } catch (error) {
        console.error('saveAddress error:', error);
        showMessage(error.message || 'Failed to update delivery address');
        return;
      }
    }

    localStorage.setItem(
      'userLocation',
      JSON.stringify({
        fullAddress: nextAddress.address,
        formattedAddress: nextAddress.address,
        displayAddress: nextAddress.address,
        area: nextAddress.address.split(',')[0]?.trim() || '',
        city: nextAddress.city,
        pincode: nextAddress.pincode,
        postalCode: nextAddress.pincode,
      })
    );

    setAddress(nextAddress);
    setEditAddress(false);
    showMessage('Delivery address saved successfully');
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showMessage('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showMessage('Please select an image smaller than 5 MB.');
      return;
    }
    if (!user?.uid) {
      showMessage('Sign in to update your profile photo.');
      return;
    }

    setAvatarUploading(true);
    try {
      const { photoURL } = await uploadProfileImage(getIdToken, user.uid, file);
      setProfile((current) => ({ ...current, photoURL }));
      setProfileForm((current) => ({ ...current, photoURL }));
      const cachedUser = JSON.parse(localStorage.getItem('accesco_user') || '{}');
      localStorage.setItem('accesco_user', JSON.stringify({ ...cachedUser, photoURL }));
      showMessage('Profile photo updated successfully');
    } catch (error) {
      console.error('handleAvatarChange error:', error);
      showMessage(error.message || 'Failed to update profile photo');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAvatarRemove = async () => {
    if (!user?.uid) {
      setProfile((current) => ({ ...current, photoURL: null }));
      setProfileForm((current) => ({ ...current, photoURL: null }));
      return;
    }

    setAvatarUploading(true);
    try {
      await deleteProfileImage(getIdToken, user.uid);
      setProfile((current) => ({ ...current, photoURL: null }));
      setProfileForm((current) => ({ ...current, photoURL: null }));
      const cachedUser = JSON.parse(localStorage.getItem('accesco_user') || '{}');
      delete cachedUser.photoURL;
      localStorage.setItem('accesco_user', JSON.stringify(cachedUser));
      showMessage('Profile photo removed');
    } catch (error) {
      console.error('handleAvatarRemove error:', error);
      showMessage(error.message || 'Failed to remove profile photo');
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div className={styles.page}>
      <SwadishttHeader />

      {message && <div className={styles.toast}>{message}</div>}
      {basketNotice && (
        <div className={styles.basketNotice}>{basketNotice}</div>
      )}

      <div className={styles.container}>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <section className={styles.userCard}>
              <div className={styles.userTop}>
                <div className={styles.avatarWrap}>
                  <div className={styles.avatar}>
                    {profile.photoURL ? (
                      <img
                        src={profile.photoURL}
                        alt={`${profile.name || 'Accesco User'}'s profile`}
                        className={styles.avatarImage}
                      />
                    ) : (
                      initial
                    )}
                  </div>

                  <label
                    className={styles.avatarEdit}
                    title="Change profile photo"
                    aria-label="Change profile photo"
                  >
                    <Icon type="camera" />
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleAvatarChange}
                      disabled={avatarUploading}
                    />
                  </label>

                  {profile.photoURL && (
                    <button
                      type="button"
                      className={styles.avatarRemove}
                      title="Remove profile photo"
                      aria-label="Remove profile photo"
                      onClick={handleAvatarRemove}
                      disabled={avatarUploading}
                    >
                      <Icon type="trash" />
                    </button>
                  )}
                </div>
                <span>♛ Premium Member</span>
              </div>
              <h1>{profile.name || 'Accesco User'}</h1>
              <p>{profile.phone || 'No phone number linked'}</p>
              <p>{profile.email || 'No email linked'}</p>
            </section>

            <section className={styles.wallet}>
              <div>
                <strong>▣ Swadishtt Wallet</strong>
                <span>NEW</span>
              </div>
              <small>Available Balance</small>
              <section>
                <strong>₹X.XX</strong>
                <button type="button">+ Add Cash</button>
              </section>
            </section>

            <nav className={styles.menu}>
              {menuItems.map(([id, label, icon]) => (
                <button
                  key={id}
                  type="button"
                  className={
                    section === id ? styles.activeMenu : styles.menuItem
                  }
                  onClick={() => setSection(id)}
                >
                  <Icon type={icon} />
                  {label}
                </button>
              ))}

              <div className={styles.menuDivider} />

              <button
                type="button"
                className={styles.logout}
                onClick={async () => {
                  await signOut();
                  window.location.href = '/services/swadisht';
                }}
              >
                <Icon type="logout" />
                Logout
              </button>
            </nav>
          </aside>

          <main className={styles.main}>
            {section === 'orders' && (
              <section className={styles.welcomeBox}>
                <div>
                  <h2>
                    Welcome back,
                    <strong>{firstName}!</strong>
                  </h2>
                  <p>
                    Manage your orders, wallets &amp; more all in one
                    <br />
                    place.
                  </p>
                </div>
                <WelcomeGraphic />
              </section>
            )}

            <section
              className={`${styles.panel} ${
                section !== 'orders' ? styles.largePanel : ''
              }`}
            >
              {section === 'orders' && (
                <>
                  <Heading
                    icon="history"
                    title={`Order History (${orders.length})`}
                  />

                  {orders.length === 0 ? (
                    <div className={styles.empty}>
                      <Icon type="history" className={styles.largeIcon} />
                      <h3>No orders yet</h3>
                      <p>
                        Looks like you haven&apos;t placed any orders.
                        Start shopping to see your orders here.
                      </p>
                      <Link
                        href="/services/swadisht"
                        className={styles.primaryButton}
                      >
                        Start Shopping →
                      </Link>
                    </div>
                  ) : (
                    <div className={styles.orderList}>
                      {orders.slice(0, 6).map((order, index) => (
                        <Link
                          key={order.id || index}
                          href={`/services/swadisht/order-tracking?id=${order.id}`}
                          className={styles.order}
                        >
                          <div>
                            <strong>
                              Order #{order.id || index + 1}
                            </strong>
                            <span>
                              {order.items?.length || 0}{' '}
                              {(order.items?.length || 0) === 1
                                ? 'item'
                                : 'items'}
                            </span>
                          </div>
                          <em>{order.status || 'Placed'}</em>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}

              {section === 'baskets' && (
                <>
                  <Heading icon="basket" title="My Saved Baskets">
                    <label className={styles.search}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-4-4" />
                      </svg>
                      <input
                        type="search"
                        value={search}
                        placeholder="Search baskets..."
                        onChange={(event) => setSearch(event.target.value)}
                      />
                    </label>
                  </Heading>

                  <div className={styles.baskets}>
                    {filteredBaskets.map((basket) => (
                      <article
                        key={basket.id}
                        className={`${styles.basket} ${
                          openBasketMenu === basket.id
                            ? styles.basketMenuOpen
                            : ''
                        }`}
                      >
                        <div className={styles.basketContent}>
                          <div className={styles.basketTitle}>
                            <div>
                              <h3>{basket.name}</h3>
                              <p>{basket.description}</p>
                            </div>
                          </div>

                          <div className={styles.dishes}>
                            {basket.items.map(([name, image]) => (
                              <span key={name} title={name}>
                                <img
                                  src={image}
                                  alt={name}
                                  loading="lazy"
                                  onError={(event) => {
                                    event.currentTarget.onerror = null;
                                    event.currentTarget.src =
                                      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=180&q=80';
                                  }}
                                />
                              </span>
                            ))}
                            <b>+{basket.more}</b>
                          </div>
                        </div>

                        <div className={styles.basketControls}>
                          <Link
                            href="/services/swadisht"
                            className={styles.smallButton}
                          >
                            Order Again
                          </Link>

                          <div className={styles.basketMenuWrapper}>
                            <button
                              type="button"
                              className={styles.threeDotsButton}
                              aria-label={`Options for ${basket.name}`}
                              aria-expanded={openBasketMenu === basket.id}
                              onClick={() =>
                                setOpenBasketMenu((current) =>
                                  current === basket.id ? null : basket.id
                                )
                              }
                            >
                              <span />
                              <span />
                              <span />
                            </button>

                            {openBasketMenu === basket.id && (
                              <div className={styles.basketOptionsMenu}>
                                <button type="button" onClick={() => renameBasket(basket)}>
                                  Rename
                                </button>
                                <button type="button" onClick={() => duplicateBasket(basket)}>
                                  Duplicate
                                </button>
                                <button type="button" onClick={() => shareBasket(basket)}>
                                  Share
                                </button>
                                <div className={styles.optionDivider} />
                                <button
                                  type="button"
                                  className={styles.deleteOption}
                                  onClick={() => deleteBasket(basket)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}

                    {filteredBaskets.length === 0 && (
                      <div className={styles.noBaskets}>
                        <Icon type="basket" />
                        <h3>No baskets found</h3>
                        <p>Try searching for another saved basket.</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {section === 'wishlist' && (
                <>
                  <Heading icon="wishlist" title="Wishlist (0)" />
                  <div className={styles.empty}>
                    <div className={styles.heart}>♡</div>
                    <h3>No dishes in your wishlist</h3>
                    <p>
                      Tap the heart icon on any dish or restaurant to
                      save it here.
                    </p>
                    <Link
                      href="/services/swadisht"
                      className={styles.primaryButton}
                    >
                      Browse Restaurants
                    </Link>
                  </div>
                </>
              )}

              {section === 'returns' && (
                <>
                  <Heading
                    icon="return"
                    title="Reusable Container Returns"
                  >
                    <span className={styles.points}>
                      Green Points: 0 pts
                    </span>
                  </Heading>

                  <div className={styles.filters}>
                    {['all', 'completed', 'pending'].map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        className={
                          returnFilter === filter
                            ? styles.activeFilter
                            : styles.filter
                        }
                        onClick={() => setReturnFilter(filter)}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className={styles.returnEmpty}>
                    <Icon type="return" className={styles.largeIcon} />
                    <h3>No container returns yet</h3>
                    <p>
                      Reusable Swadishtt container returns will appear
                      here.
                    </p>
                  </div>

                  <div className={styles.greenNotice}>
                    Green Points are added after the return is completed.
                  </div>
                </>
              )}

              {section === 'address' && (
                <>
                  <Heading icon="address" title="Delivery Address" />

                  {!editAddress ? (
                    <div className={styles.infoRow}>
                      <Icon type="address" />
                      <div>
                        <h3>Current food delivery address</h3>
                        <p>
                          {address.address || 'No address added'}
                          {address.city && `, ${address.city}`}
                          {address.pincode && ` — ${address.pincode}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        className={styles.outlineButton}
                        onClick={() => setEditAddress(true)}
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <form className={styles.form} onSubmit={saveAddress}>
                      <label>
                        Full address
                        <textarea
                          rows="4"
                          value={address.address}
                          onChange={(event) =>
                            setAddress({
                              ...address,
                              address: event.target.value,
                            })
                          }
                          required
                        />
                      </label>

                      <div className={styles.formRow}>
                        <label>
                          City
                          <input
                            value={address.city}
                            onChange={(event) =>
                              setAddress({
                                ...address,
                                city: event.target.value,
                              })
                            }
                            required
                          />
                        </label>

                        <label>
                          Pincode
                          <input
                            value={address.pincode}
                            maxLength="6"
                            onChange={(event) =>
                              setAddress({
                                ...address,
                                pincode: event.target.value.replace(
                                  /\D/g,
                                  ''
                                ),
                              })
                            }
                            required
                          />
                        </label>
                      </div>

                      <div className={styles.formButtons}>
                        <button
                          type="button"
                          onClick={() => setEditAddress(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit">Save Address</button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {section === 'coupons' && (
                <>
                  <Heading icon="coupon" title="My Swadishtt Coupons" />
                  <div className={styles.empty}>
                    <Icon type="coupon" className={styles.largeIcon} />
                    <h3>No coupons available</h3>
                    <p>
                      Restaurant and free-delivery offers will appear
                      here.
                    </p>
                    <Link
                      href="/services/swadisht"
                      className={styles.primaryButton}
                    >
                      Browse Offers
                    </Link>
                  </div>
                </>
              )}

              {section === 'notifications' && (
                <>
                  <Heading icon="notification" title="Notifications" />
                  <div className={styles.notifications}>
                    <article>
                      <span>🍽</span>
                      <div>
                        <h3>Welcome to Swadishtt</h3>
                        <p>
                          Discover regional dishes and artisanal thalis.
                        </p>
                      </div>
                      <small>Now</small>
                    </article>
                    <article>
                      <span>♨</span>
                      <div>
                        <h3>Fresh recommendations</h3>
                        <p>
                          New restaurants are available near you.
                        </p>
                      </div>
                      <small>Today</small>
                    </article>
                  </div>
                </>
              )}

              {section === 'settings' && (
                <>
                  <Heading icon="settings" title="Account Settings" />

                  {!editProfile ? (
                    <div className={styles.settings}>
                      <div className={styles.infoRow}>
                        <Icon type="settings" />
                        <div>
                          <h3>Profile information</h3>
                          <p>
                            {profile.name} · {profile.email}
                          </p>
                        </div>
                        <button
                          type="button"
                          className={styles.outlineButton}
                          onClick={() => setEditProfile(true)}
                        >
                          Edit
                        </button>
                      </div>

                      <div className={styles.divider} />

                      <div className={styles.infoRow}>
                        <Icon type="wishlist" />
                        <div>
                          <h3>Food preferences</h3>
                          <p>
                            Vegetarian choices, allergies and cuisines.
                          </p>
                        </div>
                      </div>

                      <div className={styles.divider} />

                      <div className={styles.infoRow}>
                        <Icon type="settings" />
                        <div>
                          <h3>Privacy &amp; security</h3>
                          <p>
                            Manage password and account protection.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form className={styles.form} onSubmit={saveProfile}>
                      <label>
                        Full name
                        <input
                          value={profileForm.name}
                          onChange={(event) =>
                            setProfileForm({
                              ...profileForm,
                              name: event.target.value,
                            })
                          }
                          required
                        />
                      </label>

                      <div className={styles.formRow}>
                        <label>
                          Phone
                          <input
                            value={profileForm.phone}
                            onChange={(event) =>
                              setProfileForm({
                                ...profileForm,
                                phone: event.target.value,
                              })
                            }
                          />
                        </label>

                        <label>
                          Email
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(event) =>
                              setProfileForm({
                                ...profileForm,
                                email: event.target.value,
                              })
                            }
                          />
                        </label>
                      </div>

                      <div className={styles.formButtons}>
                        <button
                          type="button"
                          onClick={() => setEditProfile(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit">Save Changes</button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </section>

            {section === 'orders' && (
              <section className={styles.features}>
                <div>◉ <span>Secure Payments<small>100% safe</small></span></div>
                <div>♨ <span>Super Fast Delivery<small>XX minutes</small></span></div>
                <div>♛ <span>Best Quality<small>Handpicked dishes</small></span></div>
                <div>◔ <span>24/7 Support<small>We&apos;re here to help</small></span></div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}