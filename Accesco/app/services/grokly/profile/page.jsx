'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGrokly } from '../contexts/GroklyContext';
import { products } from '../lib/groklyData';
import { 
  ArrowLeft, Search, Plus, Minus, MoreVertical, 
  Trash2, Copy, Edit3, Share2, ShoppingBag, 
  Info, CheckCircle2, ChevronRight, User, 
  MapPin, CreditCard, Heart, ShoppingCart, LogOut
} from 'lucide-react';
import styles from './profile.module.css';
import { useAuth } from '../../../components/AuthProvider';

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

export default function GroklyProfile() {
  const { cart, cartCount, orders, addToCart, openCart, location, updateLocation, getProductQuantity, incrementQuantity, decrementQuantity } = useGrokly();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Navigation states
  // 'profile' | 'baskets' | 'basket-detail' | 'wishlist'
  const [currentView, setCurrentView] = useState('profile');

  useEffect(() => {
    const view = searchParams.get('view');
    if (view && ['profile', 'baskets', 'wishlist'].includes(view)) {
      setCurrentView(view);
    }
  }, [searchParams]);

  const [selectedBasketId, setSelectedBasketId] = useState(null);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // newest | oldest | name
  
  // Custom basket list state
  const [baskets, setBaskets] = useState(INITIAL_BASKETS);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('grokly_baskets');
      if (stored) {
        setBaskets(JSON.parse(stored));
      } else {
        localStorage.setItem('grokly_baskets', JSON.stringify(INITIAL_BASKETS));
      }
    } catch (e) {
      console.error('Failed to load baskets:', e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('grokly_baskets', JSON.stringify(baskets));
    } catch (e) {
      console.error('Failed to save baskets:', e);
    }
  }, [baskets]);
  
  // Dropdown menu & Toast
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // success | info | danger

  // Wishlist (stored in localStorage)
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('grokly_wishlist');
      if (stored) setWishlist(JSON.parse(stored));
    } catch (e) { /* noop */ }
  }, []);

  // User Profile
  const [profile, setProfile] = useState({
    name: 'Accesco Customer',
    phone: '',
    email: '',
    address: 'India'
  });

  // Sync profile details with authenticated user session
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name || user.displayName || prev.name,
        phone: user.phone || user.phoneNumber || prev.phone,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

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

  return (
    <div className={styles.groklyProfileWrapper}>
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
          <h2 className={styles.viewTitle}>
            {currentView === 'profile' ? 'My Account' : currentView === 'baskets' ? 'My Baskets' : currentView === 'wishlist' ? 'Wishlist' : selectedBasket?.name}
          </h2>
          <div style={{ width: 40 }} />
        </header>

        {/* Dashboard Grid */}
        <div className={styles.dashboardGrid}>
          {/* LEFT COLUMN: User Card, Cash, Settings, Navigation */}
          {/* On mobile, only show this when currentView is 'profile' */}
          <div className={`${styles.leftColumn} ${currentView !== 'profile' ? styles.mobileHidden : ''}`}>
            <div className={styles.profileCard}>
              <div className={styles.avatar}>
                {profile.name.charAt(0)}
              </div>
              <div className={styles.userInfo}>
                <h1>{profile.name}</h1>
                <p>{profile.phone} • {profile.email}</p>
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
                  <span className={styles.balLabel}>Balance</span>
                  <span className={styles.balAmount}>₹0</span>
                </div>
                <button className={styles.addBalBtn} onClick={() => showToast('Payment Gateway coming soon!', 'info')}>
                  Add Cash
                </button>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <div className={styles.desktopNav}>
              <button 
                className={`${styles.navTab} ${currentView === 'profile' ? styles.activeTab : ''}`}
                onClick={() => setCurrentView('profile')}
              >
                <ShoppingBag size={18} />
                <span>Order History</span>
              </button>
              <button 
                className={`${styles.navTab} ${currentView === 'baskets' || currentView === 'basket-detail' ? styles.activeTab : ''}`}
                onClick={() => setCurrentView('baskets')}
              >
                <ShoppingCart size={18} />
                <span>Saved Baskets</span>
              </button>
              <button 
                className={`${styles.navTab} ${currentView === 'wishlist' ? styles.activeTab : ''}`}
                onClick={() => setCurrentView('wishlist')}
              >
                <Heart size={18} />
                <span>Wishlist</span>
              </button>
              <button 
                className={`${styles.navTab} ${styles.navTabLogout}`}
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>

            {/* Info Settings */}
            <div className={styles.settingsGrid}>
              <div className={styles.settingsCard}>
                <div className={styles.settingsHeader}>
                  <div className={styles.settingsIconTitle}>
                    <MapPin size={18} style={{ color: '#0c831f', marginRight: 8 }} />
                    <h3>Delivery Address</h3>
                  </div>
                </div>
                <p>{location}</p>
                <button className={styles.editBtn} onClick={() => {
                  const newAddr = prompt('Update your delivery address:', location);
                  if (newAddr && newAddr.trim()) {
                    updateLocation(newAddr.trim());
                    localStorage.setItem('userLocation', JSON.stringify({ displayAddress: newAddr.trim(), fullAddress: newAddr.trim() }));
                    showToast('Address updated!');
                  }
                }}>Edit Address</button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Dynamic views */}
          {/* On mobile, only show when NOT 'profile', or we can show orders in profile page on mobile */}
          <div className={`${styles.rightColumn} ${currentView === 'profile' ? styles.mobileOnlyOrders : ''} ${currentView !== 'profile' && currentView !== 'baskets' && currentView !== 'basket-detail' && currentView !== 'wishlist' ? styles.mobileHidden : ''}`}>
            
            {/* View 1: Order History */}
            {currentView === 'profile' && (
              <div className={styles.paneCard}>
                <h2 className={styles.paneTitle}>Order History ({orders.length})</h2>
                {orders.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>No orders yet</p>
                    <Link href="/services/grokly" className={styles.shopBtn}>Start Shopping</Link>
                  </div>
                ) : (
                  <div className={styles.orderList}>
                    {orders.map(order => (
                      <div key={order.id} className={styles.orderCard}>
                        <div className={styles.orderMain}>
                          <div className={styles.orderId}>{order.id}</div>
                          <div className={styles.orderDate}>{formatDate(order.timestamp)}</div>
                          <div className={styles.orderItems}>
                            {order.items.length} items · ₹{order.total}
                          </div>
                        </div>
                        <div className={styles.orderStatus} data-status={order.status}>
                          {order.status.replace(/_/g, ' ')}
                        </div>
                        <Link href={`/services/grokly/order-tracking?id=${order.id}`} className={styles.trackLink}>
                          Track Order
                        </Link>
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
                                  <img src={prod.image} alt={prod.name} />
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
                  <span className={styles.detailEstPrice}>Total Value: ₹{getBasketTotal(selectedBasket)}</span>
                </div>

                <div className={styles.detailItemsScroll}>
                  {selectedBasket.items.map((item) => {
                    const prod = getProductInfo(item.id);
                    return (
                      <div key={item.id} className={styles.detailItemRow}>
                        <div className={styles.detailItemThumb}>
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop';
                            }}
                          />
                        </div>

                        <div className={styles.detailItemInfo}>
                          <h4 className={styles.detailItemName}>{prod.name}</h4>
                          <p className={styles.detailItemUnit}>{prod.unit || '1 pack'}</p>
                          <div className={styles.detailItemPricing}>
                            <span className={styles.detailPriceActual}>₹{prod.price}</span>
                            {prod.mrp && prod.mrp > prod.price && (
                              <span className={styles.detailPriceMrp}>₹{prod.mrp}</span>
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
                    Add Basket to Cart · ₹{getBasketTotal(selectedBasket)}
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

                      const removeFromWishlist = () => {
                        try {
                          const stored = localStorage.getItem('grokly_wishlist');
                          let list = stored ? JSON.parse(stored) : [];
                          list = list.filter(i => i.id !== item.id);
                          localStorage.setItem('grokly_wishlist', JSON.stringify(list));
                          setWishlist(list);
                        } catch (e) { /* noop */ }
                      };

                      return (
                        <div key={item.id} className={styles.detailItemRow}>
                          <div className={styles.detailItemThumb}>
                            <img src={prod.image} alt={prod.name} />
                          </div>
                          <div className={styles.detailItemInfo}>
                            <h4 className={styles.detailItemName}>{prod.name}</h4>
                            <p className={styles.detailItemUnit}>{prod.unit || '1 pack'}</p>
                            <div className={styles.detailItemPricing}>
                              <span className={styles.detailPriceActual}>₹{prod.price}</span>
                              {prod.mrp && prod.mrp > prod.price && (
                                <span className={styles.detailPriceMrp}>₹{prod.mrp}</span>
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
                      style={{ background: '#0c831f' }}
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
                        Proceed to Checkout (₹{Object.entries(cart).reduce((sum, [id, qty]) => sum + (getProductInfo(id).price * qty), 0)})
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
