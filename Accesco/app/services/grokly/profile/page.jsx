'use client';

import { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGrokly } from '../contexts/GroklyContext';
import { products } from '../lib/groklyData';
import { 
  ArrowLeft, Search, Plus, Minus, MoreVertical, 
  Trash2, Copy, Edit3, Share2, ShoppingBag, 
  Info, CheckCircle2, ChevronRight, User, 
  MapPin, CreditCard, Heart, ShoppingCart, LogOut,
  Leaf, RefreshCw, Truck, Bell, Settings, TicketPercent,
  ShieldCheck, Headphones, Award, Crown, PackageCheck
} from 'lucide-react';
import styles from './profile.module.css';
import { useAuth } from '../../../components/AuthProvider';
import { updateUserFieldsInFirebase } from '@/lib/userService';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { fetchWallet } from '@/lib/walletService';
import GroklyHeader from '../components/GroklyHeader';
import MobileHeader from '../components/MobileHeader';
import BottomNav from '../components/BottomNav';
import CartDrawer from '../components/CartDrawer';
import '../styles/variables.css';


// ─── Reverse Commerce Sub-Component ────────────────────────────────────────
function ReverseCommerceView({ orders, walletBalance, ecoHistory, formatDate, showToast }) {
  const [rcTab, setRcTab] = useState('history');
  const [historyFilter, setHistoryFilter] = useState('all');

  const allReturnHistory = orders.flatMap(order => {
    if (!order.returnItems || order.returnItems.length === 0) return [];
    return [{
      orderId: order.id,
      date: order.timestamp,
      items: order.returnItems,
      credits: order.returnCredits || order.returnItems.reduce((s, i) => s + (i.creditsEarned || i.quantity * 10), 0),
      status: order.status === 'DELIVERED' ? 'completed' : 'pending',
    }];
  });

  const filteredHistory = historyFilter === 'all' ? allReturnHistory
    : allReturnHistory.filter(r => r.status === historyFilter);

  const totalGreenPoints = allReturnHistory
    .filter(r => r.status === 'completed')
    .reduce((s, r) => s + r.credits, 0) + walletBalance;

  if (rcTab === 'points') {
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <button onClick={() => setRcTab('history')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#374151', padding: '4px' }}>
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#111827' }}>Green Points</h2>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #12271D, #1B3A2B)', borderRadius: '20px', padding: '24px', color: '#fff', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.8, margin: '0 0 8px' }}>YOUR GREEN POINTS</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1 }}>{totalGreenPoints}</span>
            <Leaf size={24} style={{ color: '#fff' }} />
          </div>
          <p style={{ fontSize: '12px', opacity: 0.85, margin: '8px 0 0' }}>Keep returning and earn more!</p>
        </div>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', margin: '0 0 12px' }}>How to earn</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {[
            { icon: <RefreshCw size={18} style={{ color: '#12271D' }} />, title: 'Return reusable items', desc: 'Earn points by returning eligible reusable packaging like bottles and containers.' },
            { icon: <Truck size={18} style={{ color: '#12271D' }} />, title: 'Choose next delivery return', desc: 'Return items in your next order and earn points instantly.' },
            { icon: <Leaf size={18} style={{ color: '#12271D' }} />, title: 'Reduce waste', desc: 'Help us reduce waste and support a circular future.' },
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '14px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ flexShrink: 0, marginTop: '2px' }}>{tip.icon}</div>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 700, color: '#111827' }}>{tip.title}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {ecoHistory.length > 0 && (
          <>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', margin: '0 0 12px' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {ecoHistory.slice(0, 5).map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <RefreshCw size={16} style={{ color: '#12271D' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>Returned {item.bags} bag{item.bags > 1 ? 's' : ''}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>{formatDate(item.date)}</p>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#12271D' }}>+{item.credits}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <button
          style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #12271D, #1B3A2B)', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(12,131,31,0.3)' }}
          onClick={() => showToast('Points redemption coming soon!', 'info')}
        >
          Redeem Points
        </button>
      </>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#111827' }}>Return History</h2>
        <button onClick={() => setRcTab('points')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '20px', border: '1.5px solid #86efac', background: '#f0fdf4', color: '#12271D', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
          Green Points: {totalGreenPoints} pts
        </button>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['all', 'completed', 'pending'].map(tab => (
          <button key={tab} onClick={() => setHistoryFilter(tab)} style={{ padding: '7px 16px', borderRadius: '20px', border: '1.5px solid', cursor: 'pointer', fontWeight: 600, fontSize: '12px', borderColor: historyFilter === tab ? '#12271D' : '#e5e7eb', background: historyFilter === tab ? '#12271D' : '#fff', color: historyFilter === tab ? '#fff' : '#6b7280' }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {allReturnHistory.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9ca3af' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px', color: '#9ca3af' }}>[Empty]</div>
          <p style={{ fontSize: '14px', margin: 0 }}>No return history yet.</p>
          <p style={{ fontSize: '12px', margin: '6px 0 0', color: '#6b7280' }}>Add dairy/milk items to cart and select them for return!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(historyFilter === 'all' || historyFilter === 'pending') && filteredHistory.filter(r => r.status === 'pending').map(ret => (
            <div key={ret.orderId} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>Order {ret.orderId}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#1B3A2B', background: '#dcfce7', padding: '3px 10px', borderRadius: '20px' }}>Next Delivery</span>
              </div>
              {ret.items.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- item.image comes from the product catalog's heterogeneous external hosts, not compatible with next/image's static remotePatterns allowlist */}
                  <img src={item.image} alt={item.name} width={36} height={36} style={{ borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb' }} onError={e => { e.target.src = `https://placehold.co/36x36/e8f5e9/0c831f?text=${item.name[0]}`; }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#374151' }}>{item.name}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>{item.quantity} unit{item.quantity > 1 ? 's' : ''}</p>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6b7280', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                <Truck size={14} style={{ color: '#6b7280' }} />
                <span>We'll collect during your next Grokly order.</span>
              </div>
            </div>
          ))}
          {(historyFilter === 'all' || historyFilter === 'completed') && filteredHistory.filter(r => r.status === 'completed').length > 0 && (
            <>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#374151', margin: '8px 0 4px' }}>Completed Returns</h3>
              {filteredHistory.filter(r => r.status === 'completed').map(ret => (
                <div key={ret.orderId} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>Order {ret.orderId}</span>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>{formatDate(ret.date)}</span>
                  </div>
                  {ret.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- item.image comes from the product catalog's heterogeneous external hosts, not compatible with next/image's static remotePatterns allowlist */}
                      <img src={item.image} alt={item.name} width={36} height={36} style={{ borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb' }} onError={e => { e.target.src = `https://placehold.co/36x36/e8f5e9/0c831f?text=${item.name[0]}`; }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#374151' }}>{item.name}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>{item.quantity} unit{item.quantity > 1 ? 's' : ''}</p>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#12271D', whiteSpace: 'nowrap' }}>+{item.creditsEarned || item.quantity * 10} pts</span>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
          {filteredHistory.length === 0 && <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '13px' }}>No {historyFilter} returns found.</div>}
        </div>
      )}
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', background: '#f0fdf4', borderRadius: '12px', color: '#12271D', fontSize: '12px' }}>
        <Leaf size={14} style={{ color: '#12271D' }} />
        <span>Green Points are added once the return is successfully completed.</span>
      </div>
    </>
  );
}
// ─────────────────────────────────────────────────────────────────────────

// Initial baskets mock data
const INITIAL_BASKETS = [
  {
    id: 'basket-weekly',
    name: 'Weekly Groceries',
    itemCount: 9,
    lastOrdered: '12th May',
    items: [
      { id: 'veg-001', quantity: 2 },
      { id: 'veg-002', quantity: 2 },
      { id: 'veg-003', quantity: 1 },
      { id: 'dairy-001', quantity: 3 },
      { id: 'dairy-007', quantity: 1 },
      { id: 'dairy-004', quantity: 1 },
      { id: 'clean-001', quantity: 1 },
      { id: 'clean-002', quantity: 1 },
      { id: 'munch-001', quantity: 4 }
    ]
  },
  {
    id: 'basket-breakfast',
    name: 'Breakfast',
    itemCount: 7,
    lastOrdered: '11th May',
    items: [
      { id: 'dairy-001', quantity: 4 },
      { id: 'dairy-007', quantity: 2 },
      { id: 'tea-002', quantity: 1 },
      { id: 'tea-001', quantity: 1 },
      { id: 'fruit-001', quantity: 2 },
      { id: 'dairy-004', quantity: 1 },
      { id: 'dairy-003', quantity: 2 }
    ]
  },
  {
    id: 'basket-gym',
    name: 'Gym & Protein',
    itemCount: 8,
    lastOrdered: '2nd May',
    items: [
      { id: 'gym-001', quantity: 1 },
      { id: 'gym-002', quantity: 1 },
      { id: 'gym-003', quantity: 1 },
      { id: 'gym-004', quantity: 1 },
      { id: 'gym-005', quantity: 1 },
      { id: 'gym-006', quantity: 1 },
      { id: 'gym-007', quantity: 1 },
      { id: 'gym-008', quantity: 1 }
    ]
  }
];

function GroklyProfileInner() {
  const { cart, cartCount, orders, addToCart, openCart, location, updateLocation, getProductQuantity, incrementQuantity, decrementQuantity } = useGrokly();
  const { user, uid, userData, getIdToken, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // "Order Again": re-add all of a past order's items to the cart, then open it.
  const handleReorder = (order) => {
    (order.items || []).forEach(item => {
      if (item?.id) addToCart(item.id, item.quantity || 1);
    });
    openCart();
    router.push('/services/grokly');
  };

  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const handleSearchChange = (query) => {
    setHeaderSearchQuery(query);
    if (query.trim()) {
      router.push(`/services/grokly?search=${encodeURIComponent(query)}`);
    }
  };
  const handleSearchClear = () => {
    setHeaderSearchQuery('');
  };

  // Navigation states
  // 'profile' | 'baskets' | 'basket-detail' | 'wishlist'
  const [currentView, setCurrentView] = useState('profile');

  useEffect(() => {
    const view = searchParams.get('view');
    if (view && ['profile', 'baskets', 'wishlist', 'reverse-commerce', 'address', 'coupons', 'notifications', 'settings'].includes(view)) {
      setCurrentView(view);
    }
  }, [searchParams]);

  const [selectedBasketId, setSelectedBasketId] = useState(null);
  const [baskets, setBaskets] = useState(INITIAL_BASKETS);

  // Sync baskets from Firebase userData
  useEffect(() => {
    if (userData && Array.isArray(userData.savedBaskets) && userData.savedBaskets.length > 0) {
      setBaskets(userData.savedBaskets);
    }
  }, [userData]);

  // Persist baskets to Firebase when modified
  const isInitialBaskets = useRef(true);
  useEffect(() => {
    if (isInitialBaskets.current) {
      isInitialBaskets.current = false;
      return;
    }
    if (user?.uid) {
      updateUserFieldsInFirebase(user.uid, { savedBaskets: baskets });
    }
  }, [baskets, user]);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // newest | oldest | name
  
  // Dropdown menu & Toast
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // success | info | danger

  const [wishlist, setWishlist] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  const [walletBalance, setWalletBalance] = useState(0);
  const [recycledBags, setRecycledBags] = useState(0);
  const [ecoHistory, setEcoHistory] = useState([]);

  // Load eco details from user profile (userData when available, otherwise user)
  useEffect(() => {
    const profileData = userData || user;
    if (profileData) {
      setWalletBalance(profileData.walletBalance || 0);
      setRecycledBags(profileData.recycledBags || 0);
      setEcoHistory(profileData.walletTransactions || []);
    }
  }, [user, userData]);

  useEffect(() => {
    if (!user) return;
    const walletUid = user.phone ? user.phone.replace(/[^\d]/g, '') : user.uid;
    let cancelled = false;
    (async () => {
      const { wallet } = await fetchWallet(getIdToken, walletUid);
      if (!cancelled && wallet) {
        setWalletBalance(wallet.balance || 0);
      }
    })();
    return () => { cancelled = true; };
  }, [user, getIdToken]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const currentId = user?.uid || uid;
    if (!currentId) return;

    const loadWishlist = async () => {
      try {
        const snap = await getDoc(doc(db, 'grokly_wishlists', currentId));
        if (snap.exists()) {
          setWishlist(snap.data()?.items || []);
        }
      } catch (e) { /* noop */ }
    };
    loadWishlist();
  }, [user, uid]);

  // User Profile
  const [profile, setProfile] = useState({
    name: 'Accesco Customer',
    phone: '',
    email: '',
    address: 'India'
  });

  // Sync profile details with authenticated user session & Firestore userData
  useEffect(() => {
    if (user || userData) {
      setProfile(prev => ({
        ...prev,
        name: userData?.name || userData?.displayName || user?.name || user?.displayName || prev.name,
        phone: userData?.phone || userData?.phoneNumber || user?.phone || user?.phoneNumber || prev.phone,
        email: userData?.email || user?.email || prev.email,
        address: userData?.selectedLocation?.address || userData?.address || prev.address
      }));
    }
  }, [user, userData]);

  const handleLogout = async () => {
    try {
      if (signOut) await signOut();
    } catch (e) { /* noop */ }
    router.push('/login');
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Resolve product information
  const getProductInfo = (id) => {
    return products.find(p => p.id === id) || {
      id,
      name: 'Unknown Product',
      price: 99,
      mrp: 99,
      unit: '1 pc',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&h=100&fit=crop'
    };
  };

  const selectedBasket = useMemo(() => {
    return baskets.find(b => b.id === selectedBasketId);
  }, [baskets, selectedBasketId]);

  // Stepper inside Basket Detail
  const updateBasketItemQuantity = (basketId, productId, increment) => {
    setBaskets(prev => prev.map(b => {
      if (b.id !== basketId) return b;
      
      const updatedItems = b.items.map(item => {
        if (item.id !== productId) return item;
        const newQty = increment ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: Math.max(1, newQty) };
      });

      return {
        ...b,
        items: updatedItems,
        itemCount: updatedItems.reduce((acc, curr) => acc + curr.quantity, 0)
      };
    }));
  };

  // Add all items in a basket to Cart
  const handleAddBasketToCart = (basket) => {
    let itemsAdded = 0;
    basket.items.forEach(item => {
      addToCart(item.id, item.quantity);
      itemsAdded += item.quantity;
    });

    showToast(`Added ${itemsAdded} items to your cart!`);
    setTimeout(() => {
      router.push('/services/grokly');
      setTimeout(() => {
        openCart();
      }, 350);
    }, 1000);
  };

  // Menu operations
  const handleRenameBasket = (id) => {
    setActiveMenuId(null);
    const basket = baskets.find(b => b.id === id);
    const newName = prompt('Enter new basket name:', basket.name);
    if (newName && newName.trim()) {
      setBaskets(prev => prev.map(b => b.id === id ? { ...b, name: newName.trim() } : b));
      showToast('Basket renamed successfully!');
    }
  };

  const handleDuplicateBasket = (id) => {
    setActiveMenuId(null);
    const basket = baskets.find(b => b.id === id);
    const duplicated = {
      ...basket,
      id: `basket-${Date.now()}`,
      name: `${basket.name} (Copy)`,
      lastOrdered: 'Just duplicated'
    };
    setBaskets(prev => [...prev, duplicated]);
    showToast('Basket duplicated!');
  };

  const handleDeleteBasket = (id) => {
    setActiveMenuId(null);
    if (confirm('Are you sure you want to delete this basket?')) {
      setBaskets(prev => prev.filter(b => b.id !== id));
      showToast('Basket deleted!', 'danger');
      if (selectedBasketId === id) {
        setCurrentView('baskets');
      }
    }
  };

  const handleShareBasket = (id) => {
    setActiveMenuId(null);
    const basket = baskets.find(b => b.id === id);
    navigator.clipboard.writeText(`Check out my Grokly Basket: ${basket.name} with ${basket.itemCount} items!`);
    showToast('Basket link copied to clipboard!');
  };

  // Filtered & Sorted baskets
  const filteredBaskets = useMemo(() => {
    let result = baskets;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => b.name.toLowerCase().includes(q));
    }
    
    return [...result].sort((a, b) => {
      if (sortOrder === 'name') {
        return a.name.localeCompare(b.name);
      }
      // Simplified date sort
      return sortOrder === 'newest' ? 1 : -1;
    });
  }, [baskets, searchQuery, sortOrder]);

  const getBasketTotal = (basket) => {
    return basket.items.reduce((sum, item) => {
      const prod = getProductInfo(item.id);
      return sum + (prod.price * item.quantity);
    }, 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  if (!isMounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#111' }}>
        Loading Profile...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--grokly-bg)' }}>
      {/* Desktop Header */}
      <GroklyHeader
        searchQuery={headerSearchQuery}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
      />

      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: 'var(--grokly-max-width)', margin: '0 auto', width: '100%', padding: '24px 20px' }}>
        {/* Toast Notification */}
        {toastMessage && (
          <div className={`${styles.toast} ${styles[`toast-${toastType}`]}`}>
            {toastMessage}
          </div>
        )}

        <div className={styles.container}>
          {/* Header */}
          <header className={styles.navHeader}>
            <button 
              className={styles.backIconButton} 
              onClick={() => {
                if (currentView === 'basket-detail') {
                  setCurrentView('baskets');
                } else if (currentView === 'baskets') {
                  setCurrentView('profile');
                } else if (currentView === 'wishlist') {
                  setCurrentView('profile');
                } else {
                  router.push('/services/grokly');
                }
              }}
            >
              <ArrowLeft size={20} />
            </button>
            {selectedBasket && currentView === 'basket-detail' && (
              <h2 className={styles.viewTitle}>{selectedBasket.name}</h2>
            )}
            <div style={{ width: 40 }} />
          </header>

          {/* Dashboard Grid */}
          <div className={styles.dashboardGrid}>
            {/* LEFT COLUMN: User Card, Cash, Settings, Navigation */}
            <div className={`${styles.leftColumn} ${currentView !== 'profile' ? styles.mobileHidden : ''}`}>
              <div className={styles.profileCard}>
                <div className={styles.profileTopRow}>
                  <div className={styles.avatar}>{profile.name.charAt(0)}</div>
                  <span className={styles.premiumBadge}><Crown size={12} /> Premium Member</span>
                </div>
                <div className={styles.userInfo}>
                  <h1>{profile.name}</h1>
                  <p>{profile.phone || '9000000000'}</p>
                  <p>{profile.email || 'sample@gmail.com'}</p>
                </div>
              </div>

              {/* Quick Navigation Cards - Only shown on Mobile */}
              <div className={styles.quickGridMobile}>
                <button className={styles.quickCard} onClick={() => setCurrentView('profile')}>
                  <div className={styles.quickIconBg} style={{ background: '#e3f2fd' }}>
                    <ShoppingBag size={22} style={{ color: '#1565c0' }} />
                  </div>
                  <span className={styles.quickLabel}>Orders</span>
                </button>
                
                <button className={styles.quickCard} onClick={() => setCurrentView('baskets')}>
                  <div className={styles.quickIconBg} style={{ background: '#e8f5e9' }}>
                    <ShoppingCart size={22} style={{ color: '#2e7d32' }} />
                  </div>
                  <span className={styles.quickLabel}>Baskets</span>
                </button>

                <button className={styles.quickCard} onClick={() => setCurrentView('wishlist')}>
                  <div className={styles.quickIconBg} style={{ background: '#fce4ec' }}>
                    <Heart size={22} style={{ color: '#c2185b' }} />
                  </div>
                  <span className={styles.quickLabel}>Wishlist</span>
                </button>

                <button className={styles.quickCard} onClick={() => setCurrentView('reverse-commerce')}>
                  <div className={styles.quickIconBg} style={{ background: '#e8f5e9' }}>
                    <RefreshCw size={22} style={{ color: '#2e7d32' }} />
                  </div>
                  <span className={styles.quickLabel}>Eco-Return</span>
                </button>
              </div>

              {/* Grokly Cash */}
              <div className={styles.zeptoCashCard}>
                <div className={styles.cashHeader}>
                  <div className={styles.cashTitleBlock}>
                    <CreditCard size={18} style={{ color: '#ffffff' }} />
                    <span className={styles.cashTitle}>Grokly Wallet</span>
                    <span className={styles.cashNew}>NEW</span>
                  </div>
                </div>
                <div className={styles.cashBody}>
                  <div className={styles.balanceInfo}>
                    <span className={styles.balLabel}>Available Balance</span>
                    <span className={styles.balAmount}>₹{walletBalance.toLocaleString()}</span>
                  </div>
                  <button className={styles.addBalBtn} onClick={() => router.push('/profile?section=payment-methods')}>
                    + Add Cash
                  </button>
                </div>
              </div>

              {/* Dashboard Navigation */}
              <div className={styles.desktopNav}>
                <button className={`${styles.navTab} ${currentView === 'profile' ? styles.activeTab : ''}`} onClick={() => setCurrentView('profile')}>
                  <ShoppingBag size={17} /><span>Order History</span>
                </button>
                <button className={`${styles.navTab} ${currentView === 'baskets' || currentView === 'basket-detail' ? styles.activeTab : ''}`} onClick={() => setCurrentView('baskets')}>
                  <ShoppingCart size={17} /><span>Saved Baskets</span>
                </button>
                <button className={`${styles.navTab} ${currentView === 'wishlist' ? styles.activeTab : ''}`} onClick={() => setCurrentView('wishlist')}>
                  <Heart size={17} /><span>Wishlist</span>
                </button>
                <button className={`${styles.navTab} ${currentView === 'reverse-commerce' ? styles.activeTab : ''}`} onClick={() => setCurrentView('reverse-commerce')}>
                  <RefreshCw size={17} /><span>Eco-Return (Reuse)</span>
                </button>
                <button className={`${styles.navTab} ${currentView === 'address' ? styles.activeTab : ''}`} onClick={() => setCurrentView('address')}>
                  <MapPin size={17} /><span>Delivery Address</span>
                </button>
                <button className={`${styles.navTab} ${currentView === 'coupons' ? styles.activeTab : ''}`} onClick={() => setCurrentView('coupons')}>
                  <TicketPercent size={17} /><span>My Coupons</span>
                </button>
                <button className={`${styles.navTab} ${currentView === 'notifications' ? styles.activeTab : ''}`} onClick={() => setCurrentView('notifications')}>
                  <Bell size={17} /><span>Notifications</span>
                </button>
                <button className={`${styles.navTab} ${currentView === 'settings' ? styles.activeTab : ''}`} onClick={() => setCurrentView('settings')}>
                  <Settings size={17} /><span>Account Settings</span>
                </button>
                <button className={`${styles.navTab} ${styles.navTabLogout}`} onClick={handleLogout}>
                  <LogOut size={17} /><span>Logout</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Dynamic views */}
            <div className={`${styles.rightColumn} ${currentView === 'profile' ? styles.mobileDashboardHidden : ''}`}>
              {currentView === 'profile' && (
                <section className={styles.welcomeBanner}>
                  <div>
                    <h2>Welcome back,<br /><span>{profile.name.split(' ')[0]}!</span></h2>
                    <p>Manage your orders, wallet & more all in one place.</p>
                  </div>
                  <div className={styles.welcomeArt} aria-hidden="true">
                    <span className={styles.sparkle}>✦</span>
                    <ShoppingBag size={76} strokeWidth={1.4} />
                    <span className={styles.plant}>♨</span>
                  </div>
                </section>
              )}

              {/* View 1: Order History */}
              {currentView === 'profile' && (
                <div className={styles.paneCard}>
                  <h2 className={styles.paneTitle}>Order History ({orders.length})</h2>
                  {orders.length === 0 ? (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIllustration}><PackageCheck size={58} strokeWidth={1.4} /></div>
                      <h3>No orders yet</h3>
                      <p>Looks like you haven't placed any orders. Start shopping to see your orders here.</p>
                      <Link href="/services/grokly" className={styles.shopBtn}>Start Shopping <ChevronRight size={15} /></Link>
                    </div>
                  ) : (
                    <div className={styles.orderList}>
                      {orders.map(order => (
                        <div key={order.id} className={styles.orderCard}>
                          <div className={styles.orderMain}>
                            <div className={styles.orderId}>{order.id}</div>
                            <div className={styles.orderDate}>{formatDate(order.timestamp)}</div>
                            <div className={styles.orderItems}>
                              {order.items.length} items · Rs.{order.total}
                            </div>
                          </div>
                          <div className={styles.orderStatus} data-status={order.status}>
                            {order.status.replace(/_/g, ' ')}
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleReorder(order)}
                              className={styles.trackLink}
                              style={{ border: 'none', cursor: 'pointer', background: '#1B3A2B', color: '#fff' }}
                            >
                              Order Again
                            </button>
                            <Link href={`/services/grokly/order-tracking?id=${order.id}`} className={styles.trackLink}>
                              Track Order
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* View 2: Baskets List */}
              {currentView === 'baskets' && (
                <div className={styles.paneCard}>
                  <div className={styles.paneHeader}>
                    <h2 className={styles.paneTitle}>My Saved Baskets</h2>
                    <div className={styles.searchBarWrapper}>
                      <div className={styles.searchField}>
                        <Search size={18} className={styles.searchIcon} />
                        <input 
                          type="text" 
                          placeholder="Search baskets..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={styles.searchInput}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.basketsList}>
                    {filteredBaskets.length === 0 ? (
                      <div className={styles.emptyState}>
                        <ShoppingCart size={48} style={{ color: '#ccc', marginBottom: 16 }} />
                        <h3>No baskets found</h3>
                      </div>
                    ) : (
                      filteredBaskets.map(basket => (
                        <div key={basket.id} className={styles.basketRowCard} onClick={() => {
                          setSelectedBasketId(basket.id);
                          setCurrentView('basket-detail');
                        }}>
                          <div className={styles.basketRowInfo}>
                            <div className={styles.basketIconLabel}>
                              <span className={styles.basketItemEmoji}><ShoppingBag size={18} /></span>
                              <div>
                                <h4 className={styles.basketName}>{basket.name}</h4>
                                <p className={styles.basketMeta}>
                                  {basket.items.length} items · Last ordered on {basket.lastOrdered}
                                </p>
                              </div>
                            </div>

                            <div className={styles.thumbnailRow}>
                              {basket.items.slice(0, 5).map((item, idx) => {
                                const prod = getProductInfo(item.id);
                                return (
                                  <div key={`${item.id}-${idx}`} className={styles.tinyThumbnailFrame}>
                                    <Image src={prod.image} alt={prod.name} width={28} height={28} />
                                  </div>
                                );
                              })}
                              {basket.items.length > 5 && (
                                <div className={styles.tinyThumbnailMore}>
                                  +{basket.items.length - 5}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className={styles.rowActions}>
                            <button 
                              className={styles.rowDotBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === basket.id ? null : basket.id);
                              }}
                            >
                              <MoreVertical size={20} />
                            </button>

                            {activeMenuId === basket.id && (
                              <div className={styles.dropdownMenu}>
                                <button className={styles.menuItem} onClick={(e) => { e.stopPropagation(); handleRenameBasket(basket.id); }}>
                                  Rename
                                </button>
                                <button className={styles.menuItem} onClick={(e) => { e.stopPropagation(); handleDuplicateBasket(basket.id); }}>
                                  Duplicate
                                </button>
                                <button className={styles.menuItem} onClick={(e) => { e.stopPropagation(); handleShareBasket(basket.id); }}>
                                  Share
                                </button>
                                <hr className={styles.menuDivider} />
                                <button className={`${styles.menuItem} ${styles.menuItemDelete}`} onClick={(e) => { e.stopPropagation(); handleDeleteBasket(basket.id); }}>
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* View 3: Basket Detail */}
              {currentView === 'basket-detail' && selectedBasket && (
                <div className={styles.paneCardDetail}>
                  <div className={styles.detailCountHeader}>
                    <span>{selectedBasket.items.length} Items in Basket</span>
                    <span className={styles.detailEstPrice}>Total Value: Rs.{getBasketTotal(selectedBasket)}</span>
                  </div>

                  <div className={styles.detailItemsScroll}>
                    {selectedBasket.items.map((item) => {
                      const prod = getProductInfo(item.id);
                      return (
                        <div key={item.id} className={styles.detailItemRow}>
                          <div className={styles.detailItemThumb}>
                            <Image
                              src={prod.image}
                              alt={prod.name}
                              width={48}
                              height={48}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop';
                              }}
                            />
                          </div>

                          <div className={styles.detailItemInfo}>
                            <h4 className={styles.detailItemName}>{prod.name}</h4>
                            <p className={styles.detailItemUnit}>{prod.unit || '1 pack'}</p>
                            <div className={styles.detailItemPricing}>
                              <span className={styles.detailPriceActual}>Rs.{prod.price}</span>
                              {prod.mrp && prod.mrp > prod.price && (
                                <span className={styles.detailPriceMrp}>Rs.{prod.mrp}</span>
                              )}
                            </div>
                          </div>

                          <div className={styles.stepperContainer}>
                            <button 
                              className={styles.stepperBtn}
                              onClick={() => updateBasketItemQuantity(selectedBasket.id, item.id, false)}
                            >
                              <Minus size={14} />
                            </button>
                            <span className={styles.stepperVal}>{item.quantity}</span>
                            <button 
                              className={styles.stepperBtn}
                              onClick={() => updateBasketItemQuantity(selectedBasket.id, item.id, true)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className={styles.detailFooter}>
                    <button 
                      className={styles.basketAddToCartBtn}
                      onClick={() => handleAddBasketToCart(selectedBasket)}
                    >
                      <ShoppingBag size={20} style={{ marginRight: 8 }} />
                      Add Basket to Cart · Rs.{getBasketTotal(selectedBasket)}
                    </button>
                  </div>
                </div>
              )}

              {/* View 4: Wishlist */}
              {currentView === 'wishlist' && (
                <div className={styles.paneCard}>
                  <h2 className={styles.paneTitle}>Wishlist ({wishlist.length})</h2>
                  {wishlist.length === 0 ? (
                    <div className={styles.emptyState}>
                      <Heart size={48} style={{ color: '#fca5a5', marginBottom: 16 }} />
                      <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 800, color: '#111' }}>No items in wishlist</h3>
                      <p style={{ margin: 0, fontSize: 13, color: '#777' }}>Tap the heart icon on any product to save it here.</p>
                      <Link href="/services/grokly" className={styles.shopBtn} style={{ marginTop: 16, display: 'inline-block' }}>Browse Products</Link>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {wishlist.map(item => {
                        const prod = getProductInfo(item.id);
                        const qty = getProductQuantity(item.id);

                        const removeFromWishlist = async () => {
                          const currentId = user?.uid || uid;
                          if (!currentId) return;
                          try {
                            const updatedList = wishlist.filter(i => i.id !== item.id);
                            setWishlist(updatedList);
                            await setDoc(doc(db, 'grokly_wishlists', currentId), {
                              items: updatedList,
                              updatedAt: Date.now(),
                            }, { merge: true });
                          } catch (e) { /* noop */ }
                        };

                        return (
                          <div key={item.id} className={styles.detailItemRow}>
                            <div className={styles.detailItemThumb}>
                              <Image src={prod.image} alt={prod.name} width={48} height={48} />
                            </div>
                            <div className={styles.detailItemInfo}>
                              <h4 className={styles.detailItemName}>{prod.name}</h4>
                              <p className={styles.detailItemUnit}>{prod.unit || '1 pack'}</p>
                              <div className={styles.detailItemPricing}>
                                <span className={styles.detailPriceActual}>Rs.{prod.price}</span>
                                {prod.mrp && prod.mrp > prod.price && (
                                  <span className={styles.detailPriceMrp}>Rs.{prod.mrp}</span>
                                )}
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                              {qty === 0 ? (
                                <button
                                  className={styles.wishlistAddBtn}
                                  onClick={() => addToCart(item.id, 1)}
                                >
                                  Add
                                </button>
                              ) : (
                                <div className={styles.stepperContainer}>
                                  <button
                                    className={styles.stepperBtn}
                                    onClick={() => decrementQuantity(item.id)}
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className={styles.stepperVal}>{qty}</span>
                                  <button
                                    className={styles.stepperBtn}
                                    onClick={() => incrementQuantity(item.id)}
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              )}
                              <button
                                className={styles.wishlistRemoveBtn}
                                onClick={removeFromWishlist}
                                title="Remove from wishlist"
                              >
                                <Heart size={14} fill="#ef4444" stroke="#ef4444" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {wishlist.length > 0 && (
                    <div className={styles.detailFooter} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <button 
                        className={styles.basketAddToCartBtn}
                        onClick={() => {
                          let added = 0;
                          wishlist.forEach(item => {
                            addToCart(item.id, 1);
                            added++;
                          });
                          showToast(`Added ${added} items to cart!`);
                        }}
                        style={{ background: '#1B3A2B' }}
                      >
                        <Plus size={18} style={{ marginRight: 8 }} />
                        Add All Wishlist Items to Cart
                      </button>
                      
                      {cartCount > 0 && (
                        <button 
                          className={styles.basketAddToCartBtn}
                          onClick={() => {
                            router.push('/services/grokly/checkout');
                          }}
                          style={{ background: '#ff3f6c' }}
                        >
                          <ShoppingBag size={18} style={{ marginRight: 8 }} />
                          Proceed to Checkout ({Object.entries(cart).reduce((sum, [id, qty]) => sum + (getProductInfo(id).price * qty), 0)})
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
              {currentView === 'address' && (
                <div className={styles.paneCard}>
                  <h2 className={styles.paneTitle}>Delivery Address</h2>
                  <div className={styles.settingRow}>
                    <MapPin size={22} /><div><h3>Current address</h3><p>{location}</p></div>
                    <button className={styles.editBtn} onClick={() => {
                      const newAddr = prompt('Update your delivery address:', location);
                      if (newAddr && newAddr.trim()) {
                        updateLocation(newAddr.trim());
                        showToast('Address updated!');
                      }
                    }}>Edit</button>
                  </div>
                </div>
              )}

              {currentView === 'coupons' && (
                <div className={styles.paneCard}>
                  <h2 className={styles.paneTitle}>My Coupons</h2>
                  <div className={styles.emptyState}><TicketPercent size={52} /><h3>No coupons available</h3><p>Your available offers and coupon codes will appear here.</p></div>
                </div>
              )}

              {currentView === 'notifications' && (
                <div className={styles.paneCard}>
                  <h2 className={styles.paneTitle}>Notifications</h2>
                  <div className={styles.emptyState}><Bell size={52} /><h3>You're all caught up</h3><p>Order, wallet and offer updates will appear here.</p></div>
                </div>
              )}

              {currentView === 'settings' && (
                <div className={styles.paneCard}>
                  <h2 className={styles.paneTitle}>Account Settings</h2>
                  <div className={styles.settingRow}><User size={22} /><div><h3>Profile information</h3><p>{profile.name} · {profile.email || 'No email added'}</p></div><button className={styles.editBtn} onClick={() => showToast('Profile editor coming soon!', 'info')}>Edit</button></div>
                  <div className={styles.settingRow}><ShieldCheck size={22} /><div><h3>Privacy & security</h3><p>Manage your password and account protection.</p></div><ChevronRight size={18} /></div>
                </div>
              )}

              {/* View 5: Reverse Commerce — Return History + Green Points */}
              {currentView === 'reverse-commerce' && (
                <div className={styles.paneCard}>
                  <ReverseCommerceView
                    orders={orders}
                    walletBalance={walletBalance}
                    ecoHistory={ecoHistory}
                    formatDate={formatDate}
                    showToast={showToast}
                  />
                </div>
              )}

             {currentView === 'profile' && (
  <div className={styles.featuresStrip}>
    <div className={styles.featureItem}>
      <div className={styles.featureIcon}>
        <ShieldCheck size={20} />
      </div>
      <div>
        <div className={styles.featureTitle}>Secure Payments</div>
        <div className={styles.featureDesc}>100% safe & secure</div>
      </div>
    </div>

    <div className={styles.featureItem}>
      <div className={styles.featureIcon}>
        <Truck size={20} />
      </div>
      <div>
        <div className={styles.featureTitle}>Super Fast Delivery</div>
        <div className={styles.featureDesc}>Get it in XX minutes</div>
      </div>
    </div>

    <div className={styles.featureItem}>
      <div className={styles.featureIcon}>
        <Award size={20} />
      </div>
      <div>
        <div className={styles.featureTitle}>Best Quality</div>
        <div className={styles.featureDesc}>Handpicked products</div>
      </div>
    </div>

    <div className={styles.featureItem}>
      <div className={styles.featureIcon}>
        <Headphones size={20} />
      </div>
      <div>
        <div className={styles.featureTitle}>24/7 Support</div>
        <div className={styles.featureDesc}>We're here to help</div>
      </div>
    </div>
  </div>
)}
            </div>
          </div>
        </div>

      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />
    </div>
  );
}

export default function GroklyProfile() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading profile...</div>}>
      <GroklyProfileInner />
    </Suspense>
  );
}