'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGrokly } from '../contexts/GroklyContext';
import { products } from '../../../../lib/groklyProducts';
import styles from './checkout.module.css';

export default function GroklyCheckout() {
  const { cart, placeOrder } = useGrokly();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [customerDetails, setCustomerDetails] = useState({
    name: 'Accesco Customer',
    address: 'Bengaluru',
    phone: '+91 9022217637'
  });
  const [eta , setEta] = useState(0);
  const [deliverySpeed, setDeliverySpeed] = useState('instant');

  // Fetch address from geolocation
  // It is to add the address automatically in the checkout box
  useEffect(() => {
    const fetchLocationAddress = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude, accuracy } = position.coords;
              
              try {
                const response = await fetch('/api/location', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    latitude,
                    longitude,
                    accuracy,
                  }),
                });

                if (response.ok) {
                  const data = await response.json();
                  if (data.success) {
                    setCustomerDetails(prev => ({
                      ...prev,
                      address: data.formattedAddress?.label || data.locationName || prev.address,
                    }));
                  }
                }
              } catch (error) {
                console.error('Error fetching location address:', error);
              } finally {
                setIsLoadingLocation(false);
              }
            },
            (error) => {
              console.error('Geolocation error:', error);
              setIsLoadingLocation(false);
            }
          );
        } else {
          setIsLoadingLocation(false);
        }
      } catch (error) {
        console.error('Error in location fetch:', error);
        setIsLoadingLocation(false);
      }
    };

    fetchLocationAddress();
  }, []);

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => ({ product: products.find(p => p.id === id), quantity: qty }))
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

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    const resolvedEta = deliverySpeed === 'batched' ? (eta ? eta + 15 : 25) : eta;
    const order = placeOrder({
      total,
      subtotal,
      deliveryFee,
      deliverySpeed,
      discount,
      items: cartItems.map(i => ({ id: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity })),
      paymentMethod: 'UPI',
      address: customerDetails.address,
      customerName: customerDetails.name,
      phone: customerDetails.phone
    });

    setTimeout(() => {
      setIsProcessing(false);
      router.push(`/services/grokly/order-tracking?id=${order.id}&eta=${resolvedEta}`);
    }, 2000);
  };
  useEffect(() => {
  const fetchEta = async () => {
    try {
      const location = JSON.parse(localStorage.getItem("userLocation"));

      if (!location) {
        console.log("No location found in localStorage");
        return;
      }

      const res = await fetch("/api/darkstore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: location.lat,
          longitude: location.lon,
        }),
      });

      const text = await res.text();
      if (!text) {
        console.error("Empty response");
        return;
      }

      const data = JSON.parse(text);

      console.log("API Response:", data);

      // ✅ STORE ETA
      setEta(data.eta_minutes);

    } catch (err) {
      console.error("Error:", err);
    }
  };

  fetchEta();
}, []); 

  if (cart.length === 0) {
    return (
      <div className={styles.container}>
        <h1>Your cart is empty</h1>
        <button onClick={() => router.push('/services/grokly')}>Go Shopping</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Checkout</h1>
      <div className={styles.grid}>
        <div className={styles.details}>
          <section className={styles.section}>
            <h2>Delivery Details</h2>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input 
                type="text" 
                value={customerDetails.name}
                onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Address {isLoadingLocation && '(Loading...)'}</label>
              <textarea 
                value={customerDetails.address}
                onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                placeholder={isLoadingLocation ? 'Fetching your location...' : 'Enter your address'}
                disabled={isLoadingLocation}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input 
                type="text" 
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
              />
            </div>
          </section>

          {/* Delivery Speed Selection Section */}
          <section className={styles.deliverySpeedBox}>
            <h3 className={styles.speedHeading}>Would you wait 15 minutes to save ₹20?</h3>
            <p className={styles.speedSubheading}>A checkout toggle quick-commerce apps are missing</p>
            
            <div className={styles.speedOptions}>
              <div 
                className={`${styles.speedOption} ${deliverySpeed === 'instant' ? styles.speedOptionInstantActive : ''}`}
                onClick={() => setDeliverySpeed('instant')}
              >
                <div className={styles.speedOptionLeft}>
                  <span className={styles.speedIcon}><i className="ri-flashlight-line"></i></span>
                  <div className={styles.speedInfo}>
                    <span className={styles.speedTitle}>Get it in {eta || 11} min</span>
                    <span className={styles.speedDesc}>Standard — a rider just for you</span>
                  </div>
                </div>
                <span className={styles.speedOffText}>₹0 off</span>
              </div>

              <div 
                className={`${styles.speedOption} ${deliverySpeed === 'batched' ? styles.speedOptionActive : ''}`}
                onClick={() => setDeliverySpeed('batched')}
              >
                <div className={styles.speedOptionLeft}>
                  <span className={styles.speedIcon}><i className="ri-time-line"></i></span>
                  <div className={styles.speedInfo}>
                    <span className={styles.speedTitle}>I can wait · ~{eta ? eta + 15 : 25} min</span>
                    <span className={styles.speedDesc}>We'll batch you with a nearby order</span>
                  </div>
                </div>
                <span className={styles.saveBadge}>SAVE ₹20</span>
              </div>
            </div>

            <p className={styles.speedFooter}>One rider · two nearby orders · lower cost for everyone</p>
            <h4 className={styles.speedTagline}>Speed is a feature. So is <span>patience.</span></h4>
          </section>
          
          <section className={styles.section}>
            <h2>Payment Method</h2>
            <div className={styles.paymentOption}>
              <input type="radio" checked readOnly />
              <div className={styles.paymentInfo}>
                <strong>UPI (PhonePe / Google Pay)</strong>
                <p>Fast and secure payment via any UPI app</p>
              </div>
            </div>
          </section>
        </div>
        
        <div className={styles.summary}>
          {/* Save Time Next Time Card */}
          <div className={styles.saveTimeCard}>
            <div className={styles.saveTimeLeft}>
              <span className={styles.saveTimeEmoji} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ri-shopping-basket-line" style={{ fontSize: '24px' }}></i>
              </span>
              <div className={styles.saveTimeTexts}>
                <h4 className={styles.saveTimeTitle}>Save Time, Next Time</h4>
                <p className={styles.saveTimeDesc}>Create a basket with these items and reorder in one tap.</p>
              </div>
            </div>
            <button className={styles.createBasketBtn} onClick={handleCreateBasket}>
              Create basket
            </button>
          </div>

          <h2>Order Summary</h2>
          {cartItems.map(({ product, quantity }) => (
            <div key={product.id} className={styles.item}>
              <span>{product.name} x {quantity}</span>
              <span>₹{product.price * quantity}</span>
            </div>
          ))}
          <hr />
          <div className={styles.row}>
            <span>Subtotal</span>
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
            <div className={styles.row} style={{ color: '#0c831f', fontWeight: 'bold' }}>
              <span>Delivery Discount (Batched)</span>
              <span>-₹20</span>
            </div>
          )}
          <div className={`${styles.row} ${styles.total}`}>
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <button 
            className={styles.placeOrderBtn} 
            onClick={handlePlaceOrder}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
