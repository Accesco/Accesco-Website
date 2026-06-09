'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGrokly } from '../contexts/GroklyContext';
import { products } from '../../../../lib/groklyProducts';
import { 
  ArrowLeft, Search, Plus, Minus, MoreVertical, 
  Trash2, Copy, Edit3, Share2, ShoppingBag, 
  Info, CheckCircle2, ChevronRight, User, 
  MapPin, CreditCard, Heart, ShoppingCart
} from 'lucide-react';
import styles from './profile.module.css';

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
  const { orders, addToCart, openCart } = useGrokly();
  const router = useRouter();

  // Navigation states
  // 'profile' | 'baskets' | 'basket-detail'
  const [currentView, setCurrentView] = useState('profile');
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

  // User Profile
  const [profile, setProfile] = useState({
    name: 'Kunal',
    phone: '+91 9876543210',
    email: 'kunal@accesco.in',
    address: 'E-1802, Flora E, Ambika Tower, Andheri East, Mumbai'
  });

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

      {/* ── VIEW 1: PROFILE HOME ── */}
      {currentView === 'profile' && (
        <div className={styles.container}>
          {/* Header */}
          <header className={styles.navHeader}>
            <button className={styles.backIconButton} onClick={() => router.push('/services/grokly')}>
              <ArrowLeft size={20} />
            </button>
            <h2 className={styles.viewTitle}>Profile</h2>
            <div style={{ width: 40 }} />
          </header>

          <div className={styles.profileCard}>
            <div className={styles.avatar}>
              {profile.name.charAt(0)}
            </div>
            <div className={styles.userInfo}>
              <h1>{profile.name}</h1>
              <p>{profile.phone} • {profile.email}</p>
            </div>
          </div>

          {/* Quick links block */}
          <div className={styles.quickGrid}>
            <button 
              className={styles.quickCard} 
              onClick={() => {
                const orderSec = document.getElementById('order-history-section');
                if (orderSec) orderSec.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className={styles.quickIconBg} style={{ background: '#e3f2fd' }}>
                <ShoppingBag size={24} style={{ color: '#1565c0' }} />
              </div>
              <span className={styles.quickLabel}>Your Orders</span>
            </button>
            
            <button className={styles.quickCard} onClick={() => setCurrentView('baskets')}>
              <div className={styles.quickIconBg} style={{ background: '#e8f5e9' }}>
                <ShoppingCart size={24} style={{ color: '#2e7d32' }} />
                <span className={styles.newBadge}>New</span>
              </div>
              <span className={styles.quickLabel}>Your Baskets</span>
            </button>

            <button className={styles.quickCard} onClick={() => showToast('Wishlist feature coming soon!', 'info')}>
              <div className={styles.quickIconBg} style={{ background: '#fce4ec' }}>
                <Heart size={24} style={{ color: '#c2185b' }} />
              </div>
              <span className={styles.quickLabel}>Your Wishlist</span>
            </button>
          </div>

          {/* Zepto Cash & Gift Card Card */}
          <div className={styles.zeptoCashCard}>
            <div className={styles.cashHeader}>
              <div className={styles.cashTitleBlock}>
                <span className={styles.cashIcon} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><i className="ri-wallet-2-line"></i></span>
                <span className={styles.cashTitle}>Grokly Cash &amp; Gift Card</span>
                <span className={styles.cashNew}>NEW</span>
              </div>
              <ChevronRight size={18} style={{ color: '#888' }} />
            </div>
            <div className={styles.cashBody}>
              <div className={styles.balanceInfo}>
                <span className={styles.balLabel}>Available Balance</span>
                <span className={styles.balAmount}>₹0</span>
              </div>
              <button className={styles.addBalBtn} onClick={() => showToast('Payment Gateway integration coming soon!', 'info')}>
                Add Balance
              </button>
            </div>
          </div>

          {/* Active Orders Section */}
          <div className={styles.section} id="order-history-section">
            <div className={styles.sectionHeader}>
              <h2>Order History</h2>
              <span className={styles.count}>{orders.length} orders</span>
            </div>

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
                        {order.items.length} items • ₹{order.total}
                      </div>
                    </div>
                    <div className={styles.orderStatus} data-status={order.status}>
                      {order.status.replace(/_/g, ' ')}
                    </div>
                    <Link href={`/services/grokly/order-tracking?id=${order.id}`} className={styles.trackLink}>
                      Track →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Settings */}
          <div className={styles.section}>
            <h2>Your Information</h2>
            <div className={styles.settingsGrid}>
              <div className={styles.settingsCard}>
                <div className={styles.settingsHeader}>
                  <div className={styles.settingsIconTitle}>
                    <MapPin size={18} style={{ color: '#2e7d32', marginRight: 8 }} />
                    <h3>Saved Address</h3>
                  </div>
                </div>
                <p>{profile.address}</p>
                <button className={styles.editBtn} onClick={() => {
                  const newAddr = prompt('Update your delivery address:', profile.address);
                  if (newAddr && newAddr.trim()) {
                    setProfile({ ...profile, address: newAddr.trim() });
                    showToast('Address updated!');
                  }
                }}>Edit Address</button>
              </div>
              
              <div className={styles.settingsCard}>
                <div className={styles.settingsHeader}>
                  <div className={styles.settingsIconTitle}>
                    <CreditCard size={18} style={{ color: '#2e7d32', marginRight: 8 }} />
                    <h3>Payment Methods</h3>
                  </div>
                </div>
                <p>Saved UPI IDs, Cards</p>
                <button className={styles.editBtn} onClick={() => showToast('Payment methods management coming soon!', 'info')}>Manage Methods</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW 2: BASKETS LIST ── */}
      {currentView === 'baskets' && (
        <div className={styles.container}>
          {/* Header */}
          <header className={styles.navHeader}>
            <button className={styles.backIconButton} onClick={() => setCurrentView('profile')}>
              <ArrowLeft size={20} />
            </button>
            <h2 className={styles.viewTitle}>My Baskets</h2>
            <button className={styles.moreHeaderBtn} onClick={() => showToast('Baskets allow grouping items for easy one-tap checkout!', 'info')}>
              <Info size={20} style={{ color: '#2e7d32' }} />
            </button>
          </header>

          {/* Search bar */}
          <div className={styles.searchBarWrapper}>
            <div className={styles.searchField}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search your baskets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <button 
              className={styles.sortButton} 
              onClick={() => {
                setSortOrder(prev => prev === 'name' ? 'newest' : 'name');
                showToast(`Sorting by ${sortOrder === 'name' ? 'newest' : 'name'}`);
              }}
            >
              ⇅ Sort
            </button>
          </div>

          {/* Baskets list */}
          <div className={styles.basketsList}>
            {filteredBaskets.length === 0 ? (
              <div className={styles.emptyState}>
                <ShoppingCart size={48} style={{ color: '#ccc', marginBottom: 16 }} />
                <h3>No baskets found</h3>
                <p>Type a different name or create one at checkout.</p>
              </div>
            ) : (
              filteredBaskets.map(basket => (
                <div key={basket.id} className={styles.basketRowCard}>
                  <div 
                    className={styles.basketRowInfo}
                    onClick={() => {
                      setSelectedBasketId(basket.id);
                      setCurrentView('basket-detail');
                    }}
                  >
                    <div className={styles.basketIconLabel}>
                      <span className={styles.basketItemEmoji} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><i className="ri-shopping-basket-line"></i></span>
                      <div>
                        <h4 className={styles.basketName}>{basket.name}</h4>
                        <p className={styles.basketMeta}>
                          {basket.items.length} items · Last ordered on {basket.lastOrdered}
                        </p>
                      </div>
                    </div>

                    {/* Thumbnails row */}
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

                  {/* Actions Column */}
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

                    {/* Dropdown Menu */}
                    {activeMenuId === basket.id && (
                      <div className={styles.dropdownMenu}>
                        <button className={styles.menuItem} onClick={() => handleRenameBasket(basket.id)}>
                          <Edit3 size={14} /> Rename
                        </button>
                        <button className={styles.menuItem} onClick={() => handleDuplicateBasket(basket.id)}>
                          <Copy size={14} /> Duplicate
                        </button>
                        <button className={styles.menuItem} onClick={() => handleShareBasket(basket.id)}>
                          <Share2 size={14} /> Share
                        </button>
                        <hr className={styles.menuDivider} />
                        <button className={`${styles.menuItem} ${styles.menuItemDelete}`} onClick={() => handleDeleteBasket(basket.id)}>
                          <Trash2 size={14} /> Delete
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

      {/* ── VIEW 3: BASKET DETAIL ── */}
      {currentView === 'basket-detail' && selectedBasket && (
        <div className={styles.container} style={{ paddingBottom: 100 }}>
          {/* Header */}
          <header className={styles.navHeader}>
            <button className={styles.backIconButton} onClick={() => setCurrentView('baskets')}>
              <ArrowLeft size={20} />
            </button>
            <h2 className={styles.viewTitle}>{selectedBasket.name}</h2>
            <div className={styles.rowActions} style={{ marginRight: 8 }}>
              <button 
                className={styles.moreHeaderBtn}
                onClick={() => setActiveMenuId(activeMenuId === selectedBasket.id ? null : selectedBasket.id)}
              >
                <MoreVertical size={22} />
              </button>

              {/* Dropdown Menu */}
              {activeMenuId === selectedBasket.id && (
                <div className={styles.dropdownMenu} style={{ right: 0, top: '40px' }}>
                  <button className={styles.menuItem} onClick={() => handleRenameBasket(selectedBasket.id)}>
                    <Edit3 size={14} /> Rename
                  </button>
                  <button className={styles.menuItem} onClick={() => handleDuplicateBasket(selectedBasket.id)}>
                    <Copy size={14} /> Duplicate
                  </button>
                  <button className={styles.menuItem} onClick={() => handleShareBasket(selectedBasket.id)}>
                    <Share2 size={14} /> Share
                  </button>
                  <hr className={styles.menuDivider} />
                  <button className={`${styles.menuItem} ${styles.menuItemDelete}`} onClick={() => handleDeleteBasket(selectedBasket.id)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Subheading count */}
          <div className={styles.detailCountHeader}>
            <span>{selectedBasket.items.length} Items in Basket</span>
            <span className={styles.detailEstPrice}>Total Value: ₹{getBasketTotal(selectedBasket)}</span>
          </div>

          {/* Items list */}
          <div className={styles.detailItemsList}>
            {selectedBasket.items.map((item) => {
              const prod = getProductInfo(item.id);
              return (
                <div key={item.id} className={styles.detailItemRow}>
                  {/* Product Thumbnail */}
                  <div className={styles.detailItemThumb}>
                    <img src={prod.image} alt={prod.name} />
                  </div>

                  {/* Product Info */}
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

                  {/* Quantity Stepper */}
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

          {/* Floating checkout button at the bottom */}
          <div className={styles.floatingCheckoutBar}>
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
    </div>
  );
}
