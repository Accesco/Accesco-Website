'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  buildUnifiedStores,
  getGroklyCart,
  setGroklyCart,
  getSwadishttCart,
  setSwadishttCart,
  getInstaStyleCart,
  setInstaStyleCart,
} from '@/lib/unifiedCart';
import { useAuth } from '@/app/components/AuthProvider';
import styles from './cart.module.css';

const STORE_THEME_HEX = {
  swadishtt: 'e14615',
  grokly: '2f9e44',
  instastyle: '8a5a2b',
};

const FEATURES = [
  { title: 'Quick Delivery', desc: 'Fast & Reliable' },
  { title: 'Easy Returns', desc: '7-Day Return Policy' },
  { title: 'Best Prices', desc: 'Great Deals Always' },
  { title: 'Secure Payments', desc: '100% Safe & Secure' },
];

function formatINR(amount) {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

function getFallbackImage(theme, name) {
  const hex = STORE_THEME_HEX[theme] || '7A0042';
  const letter = name ? name[0].toUpperCase() : 'A';
  return `https://placehold.co/80x80/f5f0f0/${hex}?text=${encodeURIComponent(letter)}`;
}

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6z" />
    </svg>
  );
}

function CartGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.3" fill="currentColor" stroke="none" />
      <path d="M2.5 3h2l2.2 12.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21 8H6" />
    </svg>
  );
}

function ChevronIcon({ collapsed }) {
  return (
    <svg
      className={styles.chevron}
      style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}
      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10.5V6a1 1 0 0 0-1-1h-4.5a1 1 0 0 0-.7.3l-9 9a1 1 0 0 0 0 1.4l5.5 5.5a1 1 0 0 0 1.4 0l9-9a1 1 0 0 0 .3-.7z" />
      <circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 3 14h7l-1 8 11-14h-7l0-6z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function StoreSection({ store, collapsed, onToggle, onQtyChange, onRemove }) {
  return (
    <div className={`${styles.storeSection} ${styles[`theme-${store.theme}`]}`}>
      <button className={styles.storeHeader} onClick={() => onToggle(store.key)} aria-expanded={!collapsed}>
        <span className={styles.storeName}>{store.name}</span>
        <span className={styles.storeHeaderRight}>
          <span className={styles.itemBadge}>{store.itemCount} Items</span>
          <ChevronIcon collapsed={collapsed} />
        </span>
      </button>

      {!collapsed && (
        <div className={styles.itemList}>
          {store.items.map((item) => (
            <div className={styles.itemRow} key={item.key}>
              <img
                className={styles.itemImage}
                src={item.image || getFallbackImage(store.theme, item.name)}
                alt={item.name}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getFallbackImage(store.theme, item.name); }}
              />

              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.name}</div>
                {item.variant && <div className={styles.itemVariant}>{item.variant}</div>}
              </div>

              <div className={styles.itemPrice}>{formatINR(item.price)}</div>

              <div className={styles.stepper}>
                <button
                  className={styles.stepperBtn}
                  onClick={() => onQtyChange(store.key, item, item.quantity - 1)}
                  aria-label={`Decrease ${item.name} quantity`}
                >
                  −
                </button>
                <span className={styles.stepperQty}>{item.quantity}</span>
                <button
                  className={styles.stepperBtn}
                  onClick={() => onQtyChange(store.key, item, item.quantity + 1)}
                  aria-label={`Increase ${item.name} quantity`}
                >
                  +
                </button>
              </div>

              <div className={styles.itemLineTotal}>{formatINR(item.price * item.quantity)}</div>

              <button className={styles.deleteBtn} onClick={() => onRemove(store.key, item)} aria-label={`Remove ${item.name}`}>
                <TrashIcon />
              </button>
            </div>
          ))}

          <div className={styles.subtotalRow}>
            <span>Subtotal ({store.itemCount} Items)</span>
            <span className={styles.subtotalAmount}>{formatINR(store.subtotal)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [collapsedMap, setCollapsedMap] = useState({});
  const [search, setSearch] = useState('');

  const refresh = async () => setStores(await buildUnifiedStores(user));

  useEffect(() => {
    refresh();
    setIsMounted(true);
  }, [user]);

  const activeStores = useMemo(() => stores.filter((s) => s.items.length > 0), [stores]);

  const visibleStores = useMemo(() => {
    if (!search.trim()) return activeStores;
    const q = search.trim().toLowerCase();
    return activeStores
      .map((s) => ({ ...s, items: s.items.filter((it) => it.name.toLowerCase().includes(q)) }))
      .filter((s) => s.items.length > 0);
  }, [activeStores, search]);

  const totalItems = activeStores.reduce((sum, s) => sum + s.itemCount, 0);
  const subTotal = activeStores.reduce((sum, s) => sum + s.subtotal, 0);
  const totalSavings = activeStores.reduce((sum, s) => sum + s.savings, 0);
  const platformFee = subTotal > 0 ? 18 : 0;
  const grandTotal = subTotal + platformFee;

  const toggleStore = (key) => setCollapsedMap((prev) => ({ ...prev, [key]: !prev[key] }));

  const updateQuantity = async (storeKey, item, nextQty) => {
    if (storeKey === 'swadishtt') {
      const cart = await getSwadishttCart(user);
      const next = nextQty <= 0
        ? cart.filter((c) => c.id !== item.id)
        : cart.map((c) => (c.id === item.id ? { ...c, quantity: nextQty } : c));
      await setSwadishttCart(user, next);
    } else if (storeKey === 'grokly') {
      const cart = getGroklyCart();
      const next = { ...cart };
      if (nextQty <= 0) delete next[item.id];
      else next[item.id] = nextQty;
      setGroklyCart(next);
    } else if (storeKey === 'instastyle') {
      const cart = getInstaStyleCart();
      const matches = (c) => c.id === item.id && c.selectedSize === item.selectedSize && c.selectedColor === item.selectedColor;
      const next = nextQty <= 0
        ? cart.filter((c) => !matches(c))
        : cart.map((c) => (matches(c) ? { ...c, quantity: nextQty } : c));
      setInstaStyleCart(next);
    }
    await refresh();
  };

  const removeItem = (storeKey, item) => updateQuantity(storeKey, item, 0);

  const handleCheckout = () => {
    router.push('/cart/checkout');
  };

  const storeCountLabel = `${activeStores.length} Store${activeStores.length === 1 ? '' : 's'}`;
  const itemCountLabel = `${totalItems} Item${totalItems === 1 ? '' : 's'}`;

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button className={styles.backBtn} onClick={() => router.back()} aria-label="Go back">
            <BackIcon />
          </button>
          <div>
            <h1 className={styles.title}>My Cart</h1>
            <p className={styles.subtitle}>{storeCountLabel} &nbsp;•&nbsp; {itemCountLabel}</p>
          </div>
        </div>

        <div className={styles.searchWrap}>
          <SearchIcon />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search for Products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.topBarRight}>
          <button className={styles.iconBtn} aria-label="Wishlist">
            <HeartIcon />
          </button>
          <button className={styles.iconBtn} aria-label="Cart">
            <CartGlyph />
          </button>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.storesColumn}>
          {!isMounted ? (
            <div className={styles.emptyState}>
              <p>Loading your cart…</p>
            </div>
          ) : visibleStores.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>
                {activeStores.length === 0 ? 'Your cart is empty' : 'No items match your search'}
              </p>
              {activeStores.length === 0 && (
                <>
                  <p className={styles.emptyDesc}>Add items from Swadishtt, Grokly or Insta Style to see them here.</p>
                  <Link href="/#services" className={styles.emptyCta}>Explore Services</Link>
                </>
              )}
            </div>
          ) : (
            visibleStores.map((store) => (
              <StoreSection
                key={store.key}
                store={store}
                collapsed={!!collapsedMap[store.key]}
                onToggle={toggleStore}
                onQtyChange={updateQuantity}
                onRemove={removeItem}
              />
            ))
          )}

          {activeStores.length > 0 && (
            <div className={styles.billMobile}>
              <div className={styles.billMobileTitle}>Bill Summary</div>
              <div className={styles.billMobileRow}>
                {activeStores.map((store) => (
                  <div className={styles.billMobileCol} key={store.key}>
                    <span className={styles.billMobileColLabel}>{store.name}</span>
                    <span className={styles.billMobileColAmount}>{formatINR(store.subtotal)}</span>
                  </div>
                ))}
                <div className={`${styles.billMobileCol} ${styles.billMobileTotalCol}`}>
                  <span className={styles.billMobileColLabel}>Total</span>
                  <span className={styles.billMobileColAmount}>{formatINR(grandTotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {activeStores.length > 0 && (
          <div className={styles.summaryColumn}>
            <div className={styles.billDesktop}>
              <h2 className={styles.billHeading}>Bill Summary</h2>

              <div className={styles.billStoreList}>
                {activeStores.map((store) => (
                  <div className={styles.billStoreRow} key={store.key}>
                    <span className={`${styles.billDot} ${styles[`theme-${store.theme}`]}`} />
                    <span className={styles.billStoreName}>{store.name}</span>
                    <span className={styles.billStoreAmount}>{formatINR(store.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className={styles.billDivider} />

              <div className={styles.billLine}>
                <span>Sub Total</span>
                <span>{formatINR(subTotal)}</span>
              </div>
              <div className={styles.billLine}>
                <span>Delivery Charges</span>
                <span className={styles.freeTag}>FREE</span>
              </div>
              <div className={styles.billLine}>
                <span>Platform Fees</span>
                <span>{formatINR(platformFee)}</span>
              </div>

              <div className={styles.billDivider} />

              <div className={styles.grandTotalLine}>
                <span>Grand Total</span>
                <span>{formatINR(grandTotal)}</span>
              </div>

              {totalSavings > 0 && (
                <p className={styles.savingsLine}>
                  <TagIcon /> You Save {formatINR(totalSavings)} on this order
                </p>
              )}

              <div className={styles.secureBox}>
                <span className={styles.secureIcon}><LockIcon /></span>
                <div>
                  <div className={styles.secureTitle}>Safe &amp; Secure Payments</div>
                  <div className={styles.secureDesc}>Your Payment Information is 100% Secure with us !</div>
                </div>
              </div>

              <div className={styles.featureGrid}>
                {FEATURES.map((f) => (
                  <div className={styles.featureItem} key={f.title}>
                    <span className={styles.featureIcon}><BoltIcon /></span>
                    <div className={styles.featureTitle}>{f.title}</div>
                    <div className={styles.featureDesc}>{f.desc}</div>
                  </div>
                ))}
              </div>

              <button className={styles.checkoutBtn} onClick={handleCheckout}>
                Checkout Securely <ArrowRightIcon />
              </button>
              <button className={styles.saveForLaterBtn}>
                <HeartIcon /> Save for Later
              </button>
            </div>
          </div>
        )}
      </div>

      {activeStores.length > 0 && (
        <div className={styles.checkoutBar}>
          <div>
            <div className={styles.checkoutBarLabel}>Grand Total</div>
            <div className={styles.checkoutBarSub}>({totalItems} Items)</div>
          </div>
          <div className={styles.checkoutBarAmount}>{formatINR(grandTotal)}</div>
          <button className={styles.checkoutBarBtn} onClick={handleCheckout}>
            Proceed to Checkout <ArrowRightIcon />
          </button>
        </div>
      )}
    </div>
  );
}
