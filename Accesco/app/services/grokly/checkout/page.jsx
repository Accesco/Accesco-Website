'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGrokly } from '../contexts/GroklyContext';
import { products } from '../lib/groklyData';
import { dishIngredients } from '../lib/dishesData';
import styles from './checkout.module.css';

// Combined lookup: regular products + dish ingredients (which have their own IDs)
const allPurchasable = [...products, ...dishIngredients];
import { useAuth } from '../../../components/AuthProvider';
import AuthModal from '../../../components/AuthModal';
import { payWithRazorpay } from '@/lib/razorpayService';
import { 
  ArrowLeft, MapPin, Phone, User, CreditCard, 
  ShieldCheck, ShoppingBag, Clock, Zap, Sparkles 
} from 'lucide-react';

export default function GroklyCheckout() {
  const { cart, placeOrder, location, cartHydrated } = useGrokly();
  const router = useRouter();
  const { user, signIn } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: 'Accesco Customer',
    address: location || 'Bengaluru',
    phone: '+91 9022217637'
  });

  useEffect(() => {
    if (location) {
      setCustomerDetails(prev => ({
        ...prev,
        address: location
      }));
    }
  }, [location]);

  const [eta , setEta] = useState(0);
  const [deliverySpeed, setDeliverySpeed] = useState('instant');

  // Pre-populate customer name and phone from authenticated user session
  useEffect(() => {
    if (user) {
      setCustomerDetails(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);



  const cartItems = Object.entries(cart)
    .map(([id, qty]) => ({ product: allPurchasable.find(p => p.id === id), quantity: qty }))
    .filter(item => item.product);

  const handleCreateBasket = () => {
    if (cartItems.length === 0) return;
    const basketName = prompt('Enter a name for your new basket:', 'My Saved Basket');
    if (!basketName || !basketName.trim()) return;

    let savedBaskets = [];
    try {
      const stored = localStorage.getItem('grokly_baskets');
      if (stored) {
        savedBaskets = JSON.parse(stored);
      } else {
        savedBaskets = [
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
      }
    } catch (e) {
      console.error(e);
    }

    const newBasket = {
      id: `basket-${Date.now()}`,
      name: basketName.trim(),
      itemCount: cartItems.reduce((acc, curr) => acc + curr.quantity, 0),
      lastOrdered: 'Just created',
      items: cartItems.map(item => ({ id: item.product.id, quantity: item.quantity }))
    };

    savedBaskets.push(newBasket);
    localStorage.setItem('grokly_baskets', JSON.stringify(savedBaskets));
    alert(`Basket "${basketName.trim()}" created successfully! Access it under Profile -> Your Baskets.`);
  };

  const subtotal = cartItems.reduce((sum, { product, quantity }) => sum + (product.price * quantity), 0);
  const deliveryFee = subtotal >= 199 ? 0 : 19;
  const discount = deliverySpeed === 'batched' ? 20 : 0;
  const total = Math.max(0, subtotal + deliveryFee + 2 - discount);

  // Reads the customer's real delivery coordinates from the detected/selected
  // location so the tracking map can show the actual "Your door" position.
  const getDeliveryCoords = () => {
    try {
      const raw = localStorage.getItem('userLocation');
      if (!raw) return {};
      const loc = JSON.parse(raw);
      const lat = parseFloat(loc.latitude ?? loc.lat);
      const lng = parseFloat(loc.longitude ?? loc.lng ?? loc.lon);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        return { deliveryLat: lat, deliveryLng: lng };
      }
    } catch (e) {
      console.error('Failed to read delivery coordinates:', e);
    }
    return {};
  };

  // Places the order for a specific logged-in user, after payment succeeds.
  const submitOrder = async (activeUser) => {
    setIsProcessing(true);
    setPaymentError('');

    try {
      const payment = await payWithRazorpay({
        amount: total,
        receipt: `grokly_${Date.now()}`,
        name: 'Grokly',
        description: `Grokly order · ${cartItems.length} item(s)`,
        prefill: {
          name: activeUser?.name || customerDetails.name,
          email: activeUser?.email || '',
          contact: activeUser?.phone || customerDetails.phone,
        },
        theme: { color: '#0c831f' },
      });

      const resolvedEta = deliverySpeed === 'batched' ? (eta ? eta + 15 : 25) : eta;
      const order = placeOrder({
        total,
        subtotal,
        deliveryFee,
        deliverySpeed,
        discount,
        eta: resolvedEta,
        items: cartItems.map(i => ({ id: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity, sku: i.product.sku || '' })),
        totals: { subtotal, deliveryFee, discount, total },
        paymentMethod: 'razorpay',
        razorpayOrderId: payment.orderId,
        razorpayPaymentId: payment.paymentId,
        address: customerDetails.address,
        customerName: activeUser?.name || customerDetails.name,
        phone: activeUser?.phone || customerDetails.phone,
        customerEmail: activeUser?.email || null,
        userId: activeUser?.uid || activeUser?.id || null,
        ...getDeliveryCoords(),
      });

      router.push(`/services/grokly/order-tracking?id=${order.id}&eta=${resolvedEta}`);
    } catch (err) {
      console.error('Payment failed:', err);
      setPaymentError(err.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    submitOrder(user);
  };

  const handleAuthSuccess = (userData) => {
    signIn(userData);
    setShowAuth(false);
    submitOrder(userData);
  };

  useEffect(() => {
    const fetchEta = async () => {
      try {
        const storedLocation = localStorage.getItem("userLocation");
        let parsedLocation = null;
        if (storedLocation) {
          try {
            parsedLocation = JSON.parse(storedLocation);
          } catch (e) {
            console.error("Failed to parse userLocation:", e);
          }
        }

        // Coordinates check with fallback
        const lat = parsedLocation?.latitude ?? parsedLocation?.lat ?? 12.9716;
        const lon = parsedLocation?.longitude ?? parsedLocation?.lon ?? 77.5946;

        const res = await fetch("/api/darkstore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: lat,
            longitude: lon,
          }),
        });

        const text = await res.text();
        if (!text) {
          console.error("Empty response");
          return;
        }

        const data = JSON.parse(text);
        if (data && data.eta_minutes) {
          setEta(data.eta_minutes);
        }
      } catch (err) {
        console.error("Error fetching ETA:", err);
      }
    };

    fetchEta();
  }, []); 

  if (cartItems.length === 0 && !isProcessing) {
    // Show loading spinner while cart is still hydrating from Firestore
    if (!cartHydrated) {
      return (
        <div className={styles.emptyCartContainer}>
          <p style={{ color: '#888', fontSize: '15px' }}>Loading your cart...</p>
        </div>
      );
    }
    return (
      <div className={styles.emptyCartContainer}>
        <ShoppingBag size={48} className={styles.emptyCartIcon} />
        <h1>Your checkout is empty</h1>
        <p>Looks like you haven't added any fresh groceries to your cart yet.</p>
        <button className={styles.goBackBtn} onClick={() => router.push('/services/grokly')}>Go Shopping</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.checkoutHeader}>
        <button className={styles.backBtn} onClick={() => router.push('/services/grokly')} aria-label="Go back to Grokly">
          <ArrowLeft size={16} /> Back to Grokly
        </button>
        <h1 className={styles.title}>Secure Checkout</h1>
      </header>

      <div className={styles.grid}>
        <div className={styles.details}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <MapPin size={18} className={styles.sectionHeaderIcon} />
              <h2>Delivery Details</h2>
            </div>
            
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.inputIcon} />
                <input 
                  type="text" 
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <div className={styles.inputWrapper}>
                <Phone size={16} className={styles.inputIcon} />
                <input 
                  type="text" 
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Delivery Address {isLoadingLocation && '(Detecting...)'}</label>
              <textarea 
                value={customerDetails.address}
                onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                placeholder={isLoadingLocation ? 'Fetching your location...' : 'Enter your delivery address'}
                disabled={isLoadingLocation}
                rows={3}
              />
            </div>
          </section>

          {/* Delivery Speed Selection Section */}
          <section className={styles.deliverySpeedBox}>
            <div className={styles.speedHeaderWrapper}>
              <Zap size={18} className={styles.speedHeaderIcon} />
              <div className={styles.speedHeaderMain}>
                <h3 className={styles.speedHeading}>Delivery Speed</h3>
                <p className={styles.speedSubheading}>Help reduce traffic emissions by choosing to batch your delivery.</p>
              </div>
            </div>
            
            <div className={styles.speedOptions}>
              <div 
                className={`${styles.speedOption} ${deliverySpeed === 'instant' ? styles.speedOptionInstantActive : ''}`}
                onClick={() => setDeliverySpeed('instant')}
              >
                <div className={styles.speedOptionLeft}>
                  <div className={styles.speedInfo}>
                    <span className={styles.speedTitle}>Get it in {eta || 11} min</span>
                    <span className={styles.speedDesc}>Direct Delivery — dedicated rider just for you</span>
                  </div>
                </div>
                <span className={styles.speedOffText}>Standard</span>
              </div>

              <div 
                className={`${styles.speedOption} ${deliverySpeed === 'batched' ? styles.speedOptionActive : ''}`}
                onClick={() => setDeliverySpeed('batched')}
              >
                <div className={styles.speedOptionLeft}>
                  <div className={styles.speedInfo}>
                    <span className={styles.speedTitle}>Eco Saver · ~{eta ? eta + 15 : 25} min</span>
                    <span className={styles.speedDesc}>Batched Delivery — shared rider route</span>
                  </div>
                </div>
                <span className={styles.saveBadge}>SAVE ₹20</span>
              </div>
            </div>

            <p className={styles.speedFooter}>Eco saver batches deliveries along similar routes, reducing fuel burn and delivery cost.</p>
          </section>
          
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <CreditCard size={18} className={styles.sectionHeaderIcon} />
              <h2>Payment Method</h2>
            </div>
            <div className={styles.paymentOption}>
              <input type="radio" checked readOnly id="upi-radio" />
              <label htmlFor="upi-radio" className={styles.paymentInfo}>
                <strong>UPI (PhonePe / Google Pay / BHIM)</strong>
                <p>Instant digital transfer through secure verification</p>
              </label>
              <div className={styles.shieldBadge}>
                <ShieldCheck size={14} />
                <span>Secure</span>
              </div>
            </div>
          </section>
        </div>
        
        <div className={styles.summary}>
          {/* Save Time Next Time Card */}
          <div className={styles.saveTimeCard}>
            <div className={styles.saveTimeLeft}>
              <div className={styles.basketIconFrame}>
                <ShoppingBag size={18} />
              </div>
              <div className={styles.saveTimeTexts}>
                <h4 className={styles.saveTimeTitle}>Save Time Next Time</h4>
                <p className={styles.saveTimeDesc}>Save this combination of items as a custom basket to reorder with a single click.</p>
              </div>
            </div>
            <button className={styles.createBasketBtn} onClick={handleCreateBasket}>
              Create Basket
            </button>
          </div>

          <h2 className={styles.summaryHeading}>Bill Details</h2>
          
          <div className={styles.summaryItems}>
            {cartItems.map(({ product, quantity }) => (
              <div key={product.id} className={styles.item}>
                <span className={styles.itemName}>{product.name} <span className={styles.itemQty}>x {quantity}</span></span>
                <span>₹{product.price * quantity}</span>
              </div>
            ))}
          </div>
          
          <div className={styles.divider} />
          
          <div className={styles.row}>
            <span>Item Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className={styles.row}>
            <span>Delivery Fee</span>
            <span className={deliveryFee === 0 ? styles.freeText : ''}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </span>
          </div>
          <div className={styles.row}>
            <span>Handling Fee</span>
            <span>₹2</span>
          </div>
          {deliverySpeed === 'batched' && (
            <div className={`${styles.row} ${styles.discountRow}`}>
              <span>Eco Saver Discount</span>
              <span>-₹20</span>
            </div>
          )}
          
          <div className={styles.divider} />
          
          <div className={`${styles.row} ${styles.total}`}>
            <span>To Pay</span>
            <span>₹{total}</span>
          </div>
          {paymentError && (
            <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>
              {paymentError}
            </div>
          )}
          <button
            className={styles.placeOrderBtn}
            onClick={handlePlaceOrder}
            disabled={isProcessing}
          >
            {isProcessing
              ? 'Processing Payment...'
              : !user
                ? `Login & Place Order · ₹${total}`
                : `Pay & Place Order · ₹${total}`}
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
