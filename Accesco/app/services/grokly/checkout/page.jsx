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

  const subtotal = cartItems.reduce((sum, { product, quantity }) => sum + (product.price * quantity), 0);
  const deliveryFee = subtotal >= 199 ? 0 : 19;
  const total = subtotal + deliveryFee + 2; // + handling fee

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    const order = placeOrder({
      total,
      subtotal,
      deliveryFee,
      items: cartItems.map(i => ({ id: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity })),
      paymentMethod: 'UPI',
      address: customerDetails.address,
      customerName: customerDetails.name,
      phone: customerDetails.phone
    });

    setTimeout(() => {
      setIsProcessing(false);
      router.push(`/services/grokly/order-tracking?id=${order.id}&eta=${eta}`);
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
            <span>₹{deliveryFee}</span>
          </div>
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
