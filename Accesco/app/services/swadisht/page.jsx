'use client';


import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import './swadisht.css';

// Cart Context
const CartContext = createContext(undefined);

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('swadishtt-cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('swadishtt-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart => prevCart.map(item => item.id === itemId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);
  const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const getCartCount = () => cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

// Swadishtt menu data
const MENU_ITEMS = [
  { 
    id: '1', 
    name: 'Margherita Pizza', 
    description: 'Classic cheese pizza with fresh mozzarella and basil', 
    price: 249, 
    category: 'Pizza', 
    imageUrl: '/images/swadisht/menu/margherita_pizza.png', 
    isVeg: true, 
    isAvailable: true,
    rating: 4.5,
    time: '20-25 mins',
    bestseller: true
  },
  { 
    id: '2', 
    name: 'Farmhouse Pizza', 
    description: 'Loaded with fresh vegetables and premium cheese', 
    price: 349, 
    category: 'Pizza', 
    imageUrl: '/images/swadisht/menu/farmhouse_pizza.png', 
    isVeg: true, 
    isAvailable: true,
    rating: 4.3,
    time: '25-30 mins',
    bestseller: false
  },
  { 
    id: '3', 
    name: 'Cheese Burger', 
    description: 'Juicy beef burger with melted cheese and fresh veggies', 
    price: 199, 
    category: 'Burgers', 
    imageUrl: '/images/swadisht/menu/cheese_burger.png', 
    isVeg: false, 
    isAvailable: true,
    rating: 4.6,
    time: '15-20 mins',
    bestseller: true
  },
  { 
    id: '4', 
    name: 'Veg Burger', 
    description: 'Crispy vegetable patty with fresh toppings', 
    price: 179, 
    category: 'Burgers', 
    imageUrl: '/images/swadisht/menu/veg_burger.png', 
    isVeg: true, 
    isAvailable: true,
    rating: 4.4,
    time: '15-20 mins',
    bestseller: false
  },
];

// ─── Header ───────────────────────────────────────────────────────────────────
function SwiggyHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <header className={`swiggy-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="swiggy-container">
        <div className="header-wrapper">
          <div className="header-left">
            <div className="logo-wrapper" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src="/images/swadisht/swadisht_logo.JPG" alt="Swadishtt" className="header-logo" onError={(e) => e.target.style.display = 'none'} />
              <div className="brand-info">
                <h1 className="brand-name">Swadishtt</h1>
                <p className="location-text">Bangalore</p>
              </div>
            </div>
          </div>
          
          <nav className="header-nav">
            {/* HOME */}
            <button className="nav-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              <span>Home</span>
            </button>

            {/* REELS — fake button, no action yet */}
            <button className="nav-link reels-nav-btn" onClick={() => {}}>
              <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553.106A1 1 0 0014 7v6a1 1 0 00.553.894l2 1A1 1 0 0018 14V6a1 1 0 00-1.447-.894l-2 1z"/>
              </svg>
              <span>Reels</span>
            </button>

            {/* MENU */}
            <button className="nav-link" onClick={() => scrollToSection('menu')}>
              <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
              <span>Menu</span>
            </button>

            {/* ABOUT */}
            <button className="nav-link" onClick={() => scrollToSection('about')}>
              <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <span>About</span>
            </button>

            {/* HELP */}
            <button className="nav-link" onClick={() => scrollToSection('help')}>
              <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
              </svg>
              <span>Help</span>
            </button>

            {/* CART */}
            <a href="#cart" className="nav-link cart-link" onClick={(e) => { e.preventDefault(); scrollToSection('cart'); }}>
              <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              </svg>
              <span>Cart</span>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

// ─── Restaurant Banner ─────────────────────────────────────────────────────────
function RestaurantBanner() {
  return (
    <div className="restaurant-banner">
      <div className="swiggy-container">
        <div className="banner-content">
          <div className="restaurant-info">
            <h2 className="restaurant-title">Swadishtt</h2>
            <p className="restaurant-tags">Pizza, Burgers, Fast Food</p>
            <p className="restaurant-area">Bangalore, Karnataka</p>
          </div>
          <div className="restaurant-stats">
            <div className="rating-badge">
              <svg className="star-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span className="rating-value">4.5</span>
            </div>
            <p className="rating-subtitle">1K+ ratings</p>
          </div>
        </div>
        
        <div className="info-pills">
          <div className="info-pill">
            <svg className="pill-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
            <span>20-25 mins</span>
          </div>
          <div className="info-pill">
            <svg className="pill-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
            </svg>
            <span>₹200 for two</span>
          </div>
          <div className="info-pill delivery">
            <svg className="pill-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
            </svg>
            <span>Free Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Menu Section ─────────────────────────────────────────────────────────────
function MenuSection() {
  const { addToCart } = useCart();
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(MENU_ITEMS.map(item => item.category))];
  const filtered = MENU_ITEMS.filter(item => filter === 'All' || item.category === filter);

  const handleAdd = (item) => {
    addToCart(item);
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <div class="toast-content">
        <svg class="toast-check" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
        </svg>
        <span>Item added to cart</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  return (
    <div id="menu" className="menu-section">
      <div className="swiggy-container">
        <h3 className="section-title">Menu</h3>
        
        <div className="filter-chips">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`filter-chip ${filter === cat ? 'active' : ''}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {filtered.map(item => (
            <div key={item.id} className="menu-card">
              <div className="card-details">
                <div className="veg-badge">
                  <div className={`veg-dot ${item.isVeg ? 'veg' : 'non-veg'}`}></div>
                </div>
                {item.bestseller && <span className="bestseller-tag">⭐ Bestseller</span>}
                <h4 className="dish-name">{item.name}</h4>
                <p className="dish-price">₹{item.price}</p>
                <p className="dish-desc">{item.description}</p>
                {item.rating && (
                  <div className="dish-meta">
                    <span className="meta-rating">
                      <svg className="meta-star" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      {item.rating}
                    </span>
                    <span className="meta-divider">•</span>
                    <span className="meta-time">{item.time}</span>
                  </div>
                )}
              </div>
              
              <div className="card-image-wrapper">
                <img src={item.imageUrl} alt={item.name} className="dish-image" onError={(e) => e.target.src = `https://via.placeholder.com/180x160/FF6B35/FFFFFF?text=${encodeURIComponent(item.name)}`} />
                <button onClick={() => handleAdd(item)} className="add-button">ADD</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Cart Section ─────────────────────────────────────────────────────────────
function CartSection() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [userId, setUserId] = useState('');
  const [processing, setProcessing] = useState(false);

  const subtotal = getCartTotal();
  const delivery = subtotal >= 200 ? 0 : 40;
  const platform = subtotal > 0 ? 5 : 0;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + platform + gst;

  const handleCheckout = async () => {
    if (!userId.trim()) {
      alert('Please enter User ID');
      return;
    }
    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Order placed successfully!\nTotal: ₹${total}`);
      clearCart();
      setUserId('');
    } catch (error) {
      alert('Error placing order');
    } finally {
      setProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div id="cart" className="cart-empty-state">
        <div className="swiggy-container">
          <div className="empty-content">
            <div className="empty-icon">🛒</div>
            <h3 className="empty-title">Your cart is empty</h3>
            <p className="empty-text">Add items to get started</p>
            <a href="#menu" onClick={(e) => { e.preventDefault(); document.getElementById('menu').scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="browse-btn">Browse Menu</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="cart" className="cart-section">
      <div className="swiggy-container">
        <div className="cart-wrapper">
          <div className="cart-items">
            <h3 className="cart-heading">Cart ({cart.length})</h3>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-left">
                  <div className={`veg-dot ${item.isVeg ? 'veg' : 'non-veg'}`}></div>
                  <div className="item-details">
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-price">₹{item.price}</p>
                  </div>
                </div>
                <div className="item-right">
                  <div className="qty-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="qty-btn">−</button>
                    <span className="qty-display">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="qty-btn">+</button>
                  </div>
                  <p className="item-subtotal">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3 className="summary-title">Bill Details</h3>
            <div className="summary-row"><span>Item Total</span><span>₹{subtotal}</span></div>
            <div className="summary-row"><span>Delivery Fee</span><span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
            {subtotal < 200 && subtotal > 0 && (
              <div className="delivery-msg">💡 Add ₹{200 - subtotal} more for free delivery</div>
            )}
            <div className="summary-row"><span>Platform Fee</span><span>₹{platform}</span></div>
            <div className="summary-row"><span>GST (5%)</span><span>₹{gst}</span></div>
            <div className="summary-total"><span>TO PAY</span><span>₹{total}</span></div>
            <input type="text" placeholder="Enter User ID" value={userId} onChange={(e) => setUserId(e.target.value)} className="user-input" />
            <button onClick={handleCheckout} disabled={processing || !userId.trim()} className="checkout-button">
              {processing ? 'PROCESSING...' : 'PROCEED TO PAY'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <div id="about" className="about-section">
      <div className="swiggy-container">
        <h3 className="section-title">About Swadishtt</h3>
        <div className="about-content">
          <p className="about-text">
            Swadishtt is AccesCo Living's food-focused domain that celebrates authentic Indian 
            flavours with a modern touch. From traditional recipes to curated culinary experiences, 
            we bring together quality, hygiene, and taste you can trust.
          </p>
          <p className="about-text">
            Working with home chefs, food artisans, and emerging brands, Swadishtt delivers food that 
            feels familiar, comforting, and thoughtfully made. Every offering reflects our commitment 
            to authenticity, consistency, and rich Indian food culture.
          </p>
          <p className="about-tagline">
            Swadishtt by AccesCo Living — Where tradition meets taste.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="help" className="swiggy-footer">
      <div className="swiggy-container">
        <div className="footer-grid">
          <div className="footer-col">
            <img src="/images/swadisht/swadisht-icon.png" alt="Swadishtt" className="footer-logo" onError={(e) => e.target.style.display = 'none'} />
            <p className="footer-brand">Swadishtt by AccesCo Living</p>
            <p className="footer-copy">© 2025 Swadishtt. All rights reserved.</p>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-title">Company</h4>
            <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about').scrollIntoView({ behavior: 'smooth' }); }}>About</a>
            <a href="#careers">Careers</a>
            <a href="#team">Team</a>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-title">Contact</h4>
            <a href="#help">Help & Support</a>
            <a href="#partner">Partner with us</a>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-title">Legal</h4>
            <a href="#terms">Terms & Conditions</a>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function SwadishttPage() {
  return (
    <CartProvider>
      <div className="swiggy-app">
        <SwiggyHeader />

        {/* ===== SERVICE TABS (Swadishtt | Swadishtt Cafe | DineX) ===== */}
        <div className="sw-service-tabs-bar">
          <div className="sw-service-tabs">
            <div className="sw-service-tab sw-tab-active">
              <span className="sw-tab-icon">🍕</span>
              <span className="sw-tab-label">Swadishtt</span>
            </div>
            <a href="/services/swadisht-cafe" className="sw-service-tab sw-tab-cafe">
              <span className="sw-tab-icon">☕</span>
              <span className="sw-tab-label">Swadishtt Cafe</span>
              <span className="sw-tab-badge">New</span>
            </a>
            <a href="/services/dinex" className="sw-service-tab sw-tab-dinex">
              <span className="sw-tab-icon">🍽️</span>
              <span className="sw-tab-label">DineX</span>
              <span className="sw-tab-badge">New</span>
            </a>
          </div>
        </div>

        <div className="main-content">
          <RestaurantBanner />
          <MenuSection />
          <CartSection />
          <AboutSection />
        </div>
        <Footer />
      </div>
    </CartProvider>
  );
}
