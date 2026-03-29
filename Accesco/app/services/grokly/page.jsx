'use client'


import { useState, useEffect } from 'react'
import Script from 'next/script'
import { useProducts } from '../../hooks/useProducts'
import { placeOrder } from '../../hooks/useOrders'
import './grokly.css'

export default function GroklyPage() {
  const { products, loading, usingFirebase } = useProducts()
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showAddress, setShowAddress] = useState(false)
  const [address, setAddress] = useState({ house: '', street: '', pin: '' })
  const [savedAddress, setSavedAddress] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('Order Placed Successfully!')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [coordinates, setCoordinates] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [locating, setLocating] = useState(false)
  const [imgErrors, setImgErrors] = useState({})

  const categories = ['All', 'Vegetables', 'Fruits', 'Dairy and Bakery', 'Snacks', 'Grocery']

  // Sidebar categories with icons
  const sidebarCategories = [
    { name: 'Vegetables', icon: '🥬' },
    { name: 'Fruits', icon: '🍎', image: '/images/sidebar-fruits.png' },
    { name: 'Dairy and Bakery', icon: '🥛' },
    { name: 'Snacks', icon: '🍿', image: '/images/sidebar-snacks.png' },
    { name: 'Grocery', icon: '🛒', image: '/images/sidebar-grocery.png' },
  ]

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    triggerToast(`${product.name} added to cart`)
  }

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    )
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude }
        setCoordinates(coords)
        setShowMap(true)
        setLocating(false)
        triggerToast('Location detected')
      },
      (error) => {
        alert('Unable to get location: ' + error.message)
        setLocating(false)
      }
    )
  }

  const saveAddress = () => {
    if (!address.house && !address.street && !address.pin) {
      alert('Please fill in at least one address field')
      return
    }
    const parts = [address.house, address.street, address.pin].filter(Boolean)
    setSavedAddress(parts.join(', '))
    setShowAddress(false)
    triggerToast('Address saved')
  }

  const handlePlaceOrder = async () => {
    if (!savedAddress) {
      setShowCart(false)
      setShowAddress(true)
      return
    }
    const orderId = await placeOrder(cart, cartTotal, savedAddress, coordinates)
    if (orderId) {
      triggerToast(`Order #${orderId.slice(0, 6).toUpperCase()} placed!`)
    } else {
      triggerToast('Order Placed Successfully!')
    }
    setCart([])
    setShowCart(false)
  }

  useEffect(() => {
    if (showMap && coordinates && typeof window !== 'undefined' && window.google?.maps) {
      const mapEl = document.getElementById('mapContainer')
      if (!mapEl) return
      const map = new window.google.maps.Map(mapEl, { center: coordinates, zoom: 15 })
      new window.google.maps.Marker({ position: coordinates, map })
    }
  }, [showMap, coordinates])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowCart(false)
        setShowAddress(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&libraries=places`}
        strategy="afterInteractive"
      />

      {/* ===== HEADER ===== */}
      <header className="main-header">
        <div className="header-container">
          <div className="header-top">
            <div className="brand">
              <img
                src="/images/grokly-icon.png"
                alt="Grokly"
                className="logo"
                onError={(e) => {
                  e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/3050/3050158.png'
                }}
              />
              <h1 className="brand-name">Grokly</h1>
            </div>
            
            <div className="delivery-info">
              <div className="delivery-time">Delivery in 8 minutes</div>
              <div className="address-display" onClick={() => setShowAddress(true)}>
                {savedAddress || 'Select delivery location'}
                <i className="ri-arrow-down-s-line"></i>
              </div>
            </div>

            {usingFirebase && <span className="firebase-badge">🔥 LIVE</span>}
          </div>

          <div className="header-bottom">
            <div className="search-bar">
              <i className="ri-search-line"></i>
              <input
                type="search"
                placeholder='Search "paneer"'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="action-icons">
              <button className="login-btn">Login</button>
              <button className="cart-icon" onClick={() => setShowCart(true)}>
                <i className="ri-shopping-cart-line"></i>
                <span>My Cart</span>
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== SERVICE TABS (like Zepto: 50% OFF, Super Mall, Cafe) ===== */}
      <div className="service-tabs-bar">
        <div className="service-tabs">
          <div className="service-tab service-tab-active">
            <span className="service-tab-icon">🛒</span>
            <span className="service-tab-label">Grokly</span>
          </div>
          <a href="/services/localmeds" className="service-tab service-tab-localmeds">
            <div className="service-tab-logo-wrap">
              <img
                src="/images/localmeds-logo.png"
                alt="LocalMeds"
                className="service-tab-logo-img"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <span className="service-tab-label">LocalMeds</span>
            <span className="service-tab-badge">New</span>
          </a>
        </div>
      </div>

      {/* ===== MAIN LAYOUT WITH SIDEBAR ===== */}
      <div className="main-layout">
        {/* LEFT SIDEBAR */}
        <aside className="category-sidebar">
          <div
            className={`sidebar-category ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            <div className="sidebar-category-icon" style={{ fontSize: '32px' }}>🛒</div>
            <span>All</span>
          </div>
          {sidebarCategories.map((cat) => (
            <div
              key={cat.name}
              className={`sidebar-category ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <div className="sidebar-category-icon" style={{ fontSize: '32px' }}>
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                ) : (
                  cat.icon
                )}
              </div>
              <span>{cat.name}</span>
            </div>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <div className="main-content">
          {/* PRODUCT FEED */}
          <section className="market-feed">
            <div className="feed-section">
              <div className="feed-title">
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                <span style={{ fontSize: '16px', color: '#999', fontWeight: 600, marginLeft: '8px' }}>
                  ({filteredProducts.length})
                </span>
              </div>

              {loading ? (
                <div className="empty-state">
                  <i className="ri-loader-4-line" style={{ animation: 'spin 1s linear infinite' }}></i>
                  <p>Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <i className="ri-search-line"></i>
                  <p style={{ fontSize: '18px', fontWeight: 700 }}>No products found</p>
                  <p style={{ fontSize: '14px', color: '#999' }}>Try searching for something else</p>
                </div>
              ) : (
                <div className="product-grid">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="delivery-badge">
                        <i className="ri-time-line"></i>
                        8 MINS
                      </div>
                      <div className="p-img-wrapper">
                        {imgErrors[product.id] ? (
                          <div className="img-placeholder">
                            <i className="ri-image-line"></i>
                            <span>{product.name}</span>
                          </div>
                        ) : (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="p-img"
                            loading="lazy"
                            onError={() => setImgErrors((prev) => ({ ...prev, [product.id]: true }))}
                          />
                        )}
                      </div>
                      <div className="p-info">
                        <div className="p-title">{product.name}</div>
                        <div className="p-quantity">{product.category}</div>
                        <div className="p-meta">
                          <div className="p-price">
                            ₹{product.price}
                          </div>
                          <button className="add-btn" onClick={() => addToCart(product)}>
                            ADD
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ===== CART BACKDROP ===== */}
      {showCart && <div className="cart-backdrop show" onClick={() => setShowCart(false)} />}

      {/* ===== SIDE CART ===== */}
      <aside className={`side-cart ${showCart ? 'show' : ''}`}>
        <div className="cart-header">
          <i className="ri-arrow-left-line" onClick={() => setShowCart(false)} />
          <span>My Cart</span>
          {cart.length > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: '14px', color: '#999', fontWeight: 600 }}>
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <i className="ri-shopping-cart-line" />
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#666' }}>Your cart is empty</p>
              <p style={{ fontSize: '14px', color: '#999' }}>Add items to get started</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price * item.quantity}</div>
                </div>
                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="total-row">
              <span>Total</span>
              <strong>₹{cartTotal}</strong>
            </div>
            <button className="checkout-btn" onClick={handlePlaceOrder}>
              {savedAddress ? 'Place Order' : 'Add Address & Order'}
            </button>
          </div>
        )}
      </aside>

      {/* ===== ADDRESS BACKDROP ===== */}
      {showAddress && <div className="address-backdrop show" onClick={() => setShowAddress(false)} />}

      {/* ===== ADDRESS MODAL ===== */}
      <div className={`address-modal ${showAddress ? 'show' : ''}`}>
        <div className="modal-header-row">
          <h3>Delivery Address</h3>
          <i className="ri-close-line modal-close" onClick={() => setShowAddress(false)} />
        </div>
        <button className="get-location-btn" onClick={getLocation} disabled={locating}>
          <i className="ri-map-pin-line"></i>
          {locating ? 'Detecting location…' : 'Use Current Location'}
        </button>
        {coordinates && (
          <div className="coordinates-display show">
            <i className="ri-crosshair-line" /> {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
          </div>
        )}
        <div className={`map-container ${showMap ? 'show' : ''}`} id="mapContainer" />
        <div className="address-divider">or enter manually</div>
        <div className="address-body">
          <input
            placeholder="House / Flat No."
            value={address.house}
            onChange={(e) => setAddress({ ...address, house: e.target.value })}
          />
          <input
            placeholder="Area / Street"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <input
            placeholder="Pincode"
            value={address.pin}
            onChange={(e) => setAddress({ ...address, pin: e.target.value })}
          />
        </div>
        <button className="checkout-btn" onClick={saveAddress}>
          Save & Continue
        </button>
      </div>

      {/* ===== TOAST ===== */}
      {showToast && <div className="success-toast">{toastMsg}</div>}

      {/* Loading spinner */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
