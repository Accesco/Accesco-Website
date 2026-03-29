'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function AppShowcase() {
  useEffect(() => {
    // Stack cards animation logic
    const stack = document.getElementById('stack');
    if (!stack) return;

    const cards = Array.from(stack.querySelectorAll('.stack-card'));
    let currentIndex = 0;

    const rotateStack = () => {
      cards.forEach((card, i) => {
        card.classList.remove('pos-1', 'pos-2', 'pos-3');
        const newPos = (i - currentIndex + 3) % 3;
        card.classList.add(`pos-${newPos + 1}`);
      });
      currentIndex = (currentIndex + 1) % cards.length;
    };

    const interval = setInterval(rotateStack, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="app-showcase">
      <div className="app-header">
  <img 
  src="/images/a1_logo.png" 
  alt="A1 Logo" 
  style={{ 
    width: '80px', 
    height: '80px',
    objectFit: 'contain',
    display: 'block',
    margin: '0 auto 12px auto'
  }} 
/>
<h2 style={{ margin: '0 0 8px 0' }}>The A1 Benefits</h2>
  <p>An AccesCo Living premium powered by a healthy smart & personalised lifestyle.</p>
</div>

      <div className="app-container">
        <div className="features-col">
          <Link href="/services/grokly/" className="gen-z-card grocery">
            <div className="icon-container">
              <i className="ri-shopping-basket-line"></i>
            </div>
            <div>
              <h4>Grokly</h4>
              <p>10-min Turbo Delivery</p>
            </div>
          </Link>

          <Link href="/services/instastyle/" className="gen-z-card fashion">
            <div className="icon-container">
              <i className="ri-t-shirt-air-line"></i>
            </div>
            <div>
              <h4>InstaStyle</h4>
              <p>Rent or Buy the Look</p>
            </div>
          </Link>
        </div>

        <div className="glass-stack-container" id="stack">
          <div className="stack-card pos-3" data-idx="3">
            <div className="ui-row">
              <span className="ui-text">Monthly Spend</span>
            </div>
            <div className="ui-circle" style={{ borderColor: '#00eaff', color: '#00eaff' }}>
              ₹12k
            </div>
            <div className="ui-row">
              <span className="ui-sub">Limit: ₹15k</span>{' '}
              <span className="ui-sub" style={{ color: '#00eaff' }}>
                Safe
              </span>
            </div>
            <div className="ui-bar">
              <div className="ui-fill" style={{ width: '80%', background: '#00eaff' }}></div>
            </div>
          </div>

          <div className="stack-card pos-2" data-idx="2">
            <div className="ui-row">
              <span className="ui-text">Health Score</span>{' '}
              <span className="ui-text" style={{ color: '#ff3333' }}>
                92%
              </span>
            </div>
            <div className="ui-bar">
              <div className="ui-fill" style={{ width: '92%', background: '#ff3333' }}></div>
            </div>
            <br />
            <div className="ui-row">
              <span className="ui-text">Calories</span>{' '}
              <span className="ui-sub">1250 / 2200</span>
            </div>
            <div className="ui-bar">
              <div className="ui-fill" style={{ width: '55%', background: '#ff8800' }}></div>
            </div>
          </div>

          <div className="stack-card pos-1" data-idx="1">
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '12px',
                  letterSpacing: '2px',
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: '8px'
                }}
              >
                WELCOME BACK
              </div>
              <h2
                style={{
                  fontSize: '32px',
                  margin: 0,
                  color: '#fff',
                  textShadow: '0 0 10px rgba(255,255,255,0.5)'
                }}
              >
                AccesCo
              </h2>
              <button
                style={{
                  marginTop: '20px',
                  padding: '8px 20px',
                  background: 'white',
                  color: 'black',
                  border: 'none',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                LAUNCH APP
              </button>
            </div>
          </div>
        </div>

        <div className="features-col col-right">
          <Link href="/calculator/index.html" className="gen-z-card budget">
            <div className="icon-container">
              <i className="ri-calculator-line"></i>
            </div>
            <div>
              <h4>Calc AI</h4>
              <p>Smart Expense Tracker</p>
            </div>
          </Link>
          <Link href="/services/swadisht/" className="gen-z-card dine">
            <div className="icon-container">
              <i className="ri-restaurant-2-line"></i>
            </div>
            <div>
              <h4>Swadishtt</h4>
              <p>VIP Table Booking</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
