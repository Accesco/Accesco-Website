'use client';

/**
 * Instant Catering Page
 * @page /services/swadisht/instant-catering
 * @description Pre-curated catering packs for quick events — 4-5 hour delivery
 */

import { useState } from 'react';
import { SwadishttProvider, useSwadishtt } from '../contexts/SwadishttContext';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './instant-catering.module.css';

const CATERING_PACKAGES = [
  {
    id: 'cp-small',
    name: 'Small Gathering Pack',
    icon: '🏠',
    serves: '10–15 people',
    price: 2999,
    deliveryTime: '4–5 hours',
    color: '#1976D2',
    popular: false,
    includes: [
      '2 Starters',
      '3 Main Courses',
      '2 Breads',
      '1 Rice Dish',
      '1 Dessert',
      'Beverages',
    ],
    extras: [],
    description: 'Perfect for house parties, small family gatherings, and casual get-togethers.',
    customizable: true,
  },
  {
    id: 'cp-birthday',
    name: 'Birthday Celebration',
    icon: '🎂',
    serves: '20–25 people',
    price: 4999,
    deliveryTime: '4–5 hours',
    color: '#E23744',
    popular: true,
    includes: [
      '3 Starters',
      '4 Main Courses',
      '3 Breads',
      '2 Rice Dishes',
      '2 Desserts',
      'Birthday Cake',
      'Beverages',
      'Disposable Plates & Cutlery',
    ],
    extras: ['Decoration', 'Balloons', 'Candles'],
    description: 'Make every birthday special with a complete celebration package.',
    customizable: true,
  },
  {
    id: 'cp-office',
    name: 'Office Lunch Pack',
    icon: '💼',
    serves: '15–20 people',
    price: 3499,
    deliveryTime: '3–4 hours',
    color: '#1C8B3C',
    popular: false,
    includes: [
      '2 Starters',
      '3 Main Courses',
      '2 Breads',
      '1 Rice Dish',
      'Salad',
      'Beverages',
    ],
    extras: [],
    description: 'Corporate-friendly packaging, ideal for team lunches and office meetings.',
    customizable: true,
  },
  {
    id: 'cp-wedding',
    name: 'Mini Wedding Pack',
    icon: '💍',
    serves: '40–50 people',
    price: 9999,
    deliveryTime: '6–8 hours',
    color: '#7B1FA2',
    popular: false,
    includes: [
      '4 Starters',
      '6 Main Courses',
      '4 Breads',
      '2 Rice Dishes',
      '3 Desserts',
      'Welcome Drinks',
      'Beverages',
      'Serving Staff (2)',
      'Disposable Crockery',
    ],
    extras: ['Floral Decoration', 'Welcome Banner', 'Serving Counters'],
    description: 'Intimate wedding receptions, engagement ceremonies, and milestone celebrations.',
    customizable: true,
  },
];

const DIETARY_OPTIONS = ['Veg Only', 'Non-Veg', 'Mixed', 'Jain', 'No Onion-Garlic'];
const CUISINE_OPTIONS = ['North Indian', 'South Indian', 'Mughlai', 'Continental', 'Chinese', 'Mixed'];

function PackageCard({ pkg, onBook }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`${styles.packageCard} ${pkg.popular ? styles.popularCard : ''}`}>
      {pkg.popular && <div className={styles.popularBadge}>⭐ Most Popular</div>}

      <div className={styles.packageHeader} style={{ borderTopColor: pkg.color }}>
        <div className={styles.packageIcon}>{pkg.icon}</div>
        <div className={styles.packageInfo}>
          <h3 className={styles.packageName}>{pkg.name}</h3>
          <p className={styles.packageServes}>Serves {pkg.serves}</p>
        </div>
        <div className={styles.packagePricing}>
          <span className={styles.packagePrice}>₹{pkg.price.toLocaleString()}</span>
          <span className={styles.packageDelivery}>🚚 {pkg.deliveryTime}</span>
        </div>
      </div>

      <p className={styles.packageDesc}>{pkg.description}</p>

      <div className={styles.includesList}>
        <h4 className={styles.includesTitle}>What's Included:</h4>
        <div className={styles.includesGrid}>
          {pkg.includes.map((item) => (
            <div key={item} className={styles.includeItem}>
              <span className={styles.checkIcon} style={{ color: pkg.color }}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {pkg.extras.length > 0 && (
        <div className={styles.extrasRow}>
          <span className={styles.extrasLabel}>Add-ons available:</span>
          {pkg.extras.map((e) => (
            <span key={e} className={styles.extraTag}>{e}</span>
          ))}
        </div>
      )}

      <div className={styles.packageActions}>
        <button
          className={styles.detailsBtn}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide Details' : 'Customize Order'}
        </button>
        <button
          className={styles.bookBtn}
          style={{ background: pkg.color }}
          onClick={() => onBook(pkg)}
        >
          Book Now
        </button>
      </div>

      {expanded && (
        <div className={styles.customizePanel}>
          <h4 className={styles.customizeTitle}>Customize Your Order</h4>
          <div className={styles.customizeRow}>
            <label className={styles.customizeLabel}>Dietary Preference</label>
            <div className={styles.optionChips}>
              {DIETARY_OPTIONS.map((opt) => (
                <button key={opt} className={styles.optionChip}>{opt}</button>
              ))}
            </div>
          </div>
          <div className={styles.customizeRow}>
            <label className={styles.customizeLabel}>Cuisine Style</label>
            <div className={styles.optionChips}>
              {CUISINE_OPTIONS.map((opt) => (
                <button key={opt} className={styles.optionChip}>{opt}</button>
              ))}
            </div>
          </div>
          <div className={styles.customizeRow}>
            <label className={styles.customizeLabel}>Special Instructions</label>
            <textarea
              className={styles.specialInstructions}
              placeholder="Any allergies, special requests, or notes for the chef..."
              rows={3}
            />
          </div>
          <button
            className={styles.confirmCustomBtn}
            style={{ background: pkg.color }}
            onClick={() => onBook(pkg)}
          >
            Confirm & Book
          </button>
        </div>
      )}
    </div>
  );
}

function BookingModal({ pkg, onClose }) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');

  if (!pkg) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Book {pkg.name}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.stepIndicator}>
          {[1, 2, 3].map((s) => (
            <div key={s} className={`${styles.step} ${step >= s ? styles.stepActive : ''}`}>
              <span className={styles.stepNum}>{s}</span>
              <span className={styles.stepLabel}>
                {s === 1 ? 'Schedule' : s === 2 ? 'Address' : 'Confirm'}
              </span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>When do you need it?</h3>
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Date</label>
              <input
                type="date"
                className={styles.formInput}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Time</label>
              <input
                type="time"
                className={styles.formInput}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <p className={styles.deliveryNote}>
              🚚 We need {pkg.deliveryTime} notice. Order will be prepared fresh.
            </p>
            <button
              className={styles.nextBtn}
              style={{ background: pkg.color }}
              onClick={() => setStep(2)}
              disabled={!date || !time}
            >
              Next →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Delivery Address</h3>
            <textarea
              className={styles.formTextarea}
              placeholder="Enter full delivery address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
            />
            <div className={styles.stepBtns}>
              <button className={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
              <button
                className={styles.nextBtn}
                style={{ background: pkg.color }}
                onClick={() => setStep(3)}
                disabled={!address}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Order Summary</h3>
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>Package</span>
                <span className={styles.summaryVal}>{pkg.name}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Serves</span>
                <span className={styles.summaryVal}>{pkg.serves}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Date & Time</span>
                <span className={styles.summaryVal}>{date} at {time}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery</span>
                <span className={styles.summaryVal}>{pkg.deliveryTime} before event</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span className={styles.summaryPrice}>₹{pkg.price.toLocaleString()}</span>
              </div>
            </div>
            <p className={styles.cancellationNote}>
              ℹ️ Free cancellation up to 2 hours before scheduled delivery.
            </p>
            <div className={styles.stepBtns}>
              <button className={styles.backBtn} onClick={() => setStep(2)}>← Back</button>
              <button
                className={styles.confirmBtn}
                style={{ background: pkg.color }}
                onClick={onClose}
              >
                Confirm & Pay ₹{pkg.price.toLocaleString()}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InstantCateringContent() {
  const [bookingPkg, setBookingPkg] = useState(null);

  return (
    <div className={styles.pageContent}>
      <SwadishttHeader />

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>🎉 Instant Catering</h1>
        <p className={styles.heroSub}>
          Pre-curated packs for small gatherings — no planning needed
        </p>
        <div className={styles.heroBadges}>
          <span className={styles.heroBadge}>⚡ 4–5 Hour Delivery</span>
          <span className={styles.heroBadge}>🍽️ No Menu Planning</span>
          <span className={styles.heroBadge}>✅ Free Cancellation</span>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.howItWorks}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.stepsRow}>
            {[
              { num: '1', icon: '📦', label: 'Choose Package', desc: 'Pick the right pack for your event size' },
              { num: '2', icon: '🎨', label: 'Customize', desc: 'Set dietary preferences and cuisine style' },
              { num: '3', icon: '📅', label: 'Schedule', desc: 'Pick your date and delivery time' },
              { num: '4', icon: '🚚', label: 'We Deliver', desc: 'Fresh food arrives 4–5 hours before your event' },
            ].map((s) => (
              <div key={s.num} className={styles.howStep}>
                <div className={styles.howStepNum}>{s.num}</div>
                <div className={styles.howStepIcon}>{s.icon}</div>
                <h4 className={styles.howStepLabel}>{s.label}</h4>
                <p className={styles.howStepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Choose Your Package</h2>
        <div className={styles.packagesGrid}>
          {CATERING_PACKAGES.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onBook={setBookingPkg} />
          ))}
        </div>
      </div>

      {bookingPkg && (
        <BookingModal pkg={bookingPkg} onClose={() => setBookingPkg(null)} />
      )}
    </div>
  );
}

export default function InstantCateringPage() {
  return (
    <SwadishttProvider>
      <InstantCateringContent />
    </SwadishttProvider>
  );
}
