'use client';

import React, { useEffect, useState } from 'react';
import { addWaitlistEntry } from '../lib/waitlistService';

export default function AppShowcase() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email?.trim() || !form.phone?.trim()) {
      alert('Email and phone are required');
      return;
    }

    try {
      setLoading(true);
      await addWaitlistEntry({
        name: form.name,
        email: form.email,
        phone: form.phone,
      });
      alert("You're on the waitlist!");
      setForm({ name: '', email: '', phone: '' });
    } catch (err) {
      console.error('Waitlist submit failed:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

      {/* 🔥 WAITLIST SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2>Join the Waitlist</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ margin: '5px', padding: '8px' }}
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ margin: '5px', padding: '8px' }}
            required
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            style={{ margin: '5px', padding: '8px' }}
            required
          />

          <br />

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              background: '#00eaff',
              cursor: 'pointer'
            }}
          >
            {loading ? "Joining..." : "Join Waitlist"}
          </button>
        </form>
      </div>

      {/* EXISTING CODE BELOW (UNCHANGED) */}

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
        <h2>The A1 Benefits</h2>
        <p>An AccesCo Living premium powered by a healthy smart & personalised lifestyle.</p>
      </div>

      {/* rest remains same */}
    </section>
  );
}