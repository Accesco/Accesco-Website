'use client';

import { useState, useEffect } from 'react';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './instant-catering.module.css';

const CATERING_PACKAGES = [
  {
    id: 'cp-small',
    name: 'Home Gathering Pack',
    categoryLabel: 'Home Events',
    serves: '10–15 guests',
    price: 2999,
    originalPrice: 3499,
    deliveryTime: '4–5 hours advance',
    accentColor: '#1D4ED8',
    accentLight: '#EFF6FF',
    popular: false,
    includes: [
      '2 Starters',
      '3 Main Courses',
      '2 Breads',
      '1 Rice Dish',
      '1 Dessert',
      'Welcome Beverages',
    ],
    extras: [],
    description: 'Perfect for house parties, family get-togethers, kitty parties, and casual celebrations.',
    customizable: true,
  },
  {
    id: 'cp-birthday',
    name: 'Birthday Celebration',
    categoryLabel: 'Celebrations',
    serves: '20–25 guests',
    price: 4999,
    originalPrice: 5999,
    deliveryTime: '4–5 hours advance',
    accentColor: '#7C3AED',
    accentLight: '#F5F3FF',
    popular: true,
    includes: [
      '3 Starters',
      '4 Main Courses',
      '3 Breads',
      '2 Rice Dishes',
      '2 Desserts',
      'Celebration Cake',
      'Beverages',
      'Disposable Crockery',
    ],
    extras: ['Decoration', 'Table Setting', 'Candles'],
    description: 'Make birthdays unforgettable — complete curated menus with cake, décor options and more.',
    customizable: true,
  },
  {
    id: 'cp-office',
    name: 'Corporate Lunch Pack',
    categoryLabel: 'Corporate',
    serves: '15–20 guests',
    price: 3499,
    originalPrice: 4299,
    deliveryTime: '3–4 hours advance',
    accentColor: '#059669',
    accentLight: '#ECFDF5',
    popular: false,
    includes: [
      '2 Starters',
      '3 Main Courses',
      '2 Breads',
      '1 Rice Dish',
      'Salad Station',
      'Beverages',
    ],
    extras: [],
    description: 'Professional packaging, corporate-appropriate portions — ideal for team lunches and office events.',
    customizable: true,
  },
  {
    id: 'cp-wedding',
    name: 'Intimate Wedding Pack',
    categoryLabel: 'Weddings',
    serves: '40–50 guests',
    price: 9999,
    originalPrice: 13999,
    deliveryTime: '6–8 hours advance',
    accentColor: '#B45309',
    accentLight: '#FFFBEB',
    popular: false,
    includes: [
      '4 Starters',
      '6 Main Courses',
      '4 Breads',
      '2 Rice Dishes',
      '3 Desserts',
      'Welcome Drinks',
      '2 Serving Staff',
      'Premium Crockery',
    ],
    extras: ['Floral Arrangement', 'Welcome Signage', 'Serving Counter'],
    description: 'Intimate wedding receptions, engagement ceremonies, and milestone celebrations — made memorable.',
    customizable: true,
  },
];

const DIETARY_OPTIONS = ['Veg Only', 'Non-Veg', 'Mixed', 'Jain', 'No Onion-Garlic'];
const CUISINE_OPTIONS = ['North Indian', 'South Indian', 'Mughlai', 'Continental', 'Chinese', 'Mixed'];

const HOW_IT_WORKS = [
  {
    num: '01',
    label: 'Choose Package',
    desc: 'Browse our curated catering packs — from intimate home parties to weddings.',
  },
  {
    num: '02',
    label: 'Customize',
    desc: 'Pick your dietary preferences, cuisine style, and any special requests.',
  },
  {
    num: '03',
    label: 'Schedule',
    desc: 'Pick your event date and preferred delivery time window with ease.',
  },
  {
    num: '04',
    label: 'We Deliver',
    desc: 'Fresh food arrives 4–5 hours before your event, packaged professionally.',
  },
];

function CheckIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PackageCard({ pkg, onBook }) {
  const [expanded, setExpanded] = useState(false);
  const [dietary, setDietary] = useState('');
  const [cuisine, setCuisine] = useState('');

  const savings = pkg.originalPrice - pkg.price;

  return (
    <div className={`${styles.packageCard} ${pkg.popular ? styles.popularCard : ''}`}>
      {pkg.popular && <div className={styles.popularBadge}>Most Popular</div>}

      <div className={styles.packageTopBar} style={{ background: pkg.accentColor }} />

      <div className={styles.packageHeader}>
        <span className={styles.categoryLabel}>{pkg.categoryLabel}</span>
        <h3 className={styles.packageName}>{pkg.name}</h3>
        <p className={styles.packageServes}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Serves {pkg.serves}
        </p>
      </div>

      <div className={styles.packagePricingRow} style={{ background: pkg.accentLight }}>
        <div className={styles.priceLeft}>
          <span className={styles.packagePrice} style={{ color: pkg.accentColor }}>₹{pkg.price.toLocaleString()}</span>
          <div className={styles.priceSubRow}>
            <span className={styles.packageOriginalPrice}>₹{pkg.originalPrice.toLocaleString()}</span>
            <span className={styles.savingsTag}>Save ₹{savings}</span>
          </div>
        </div>
        <div className={styles.priceRight}>
          <span className={styles.packageDelivery}>{pkg.deliveryTime}</span>
        </div>
      </div>

      <p className={styles.packageDesc}>{pkg.description}</p>

      <div className={styles.includesList}>
        <h4 className={styles.includesTitle}>What's Included</h4>
        <div className={styles.includesGrid}>
          {pkg.includes.map((item) => (
            <div key={item} className={styles.includeItem}>
              <CheckIcon color={pkg.accentColor} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {pkg.extras.length > 0 && (
        <div className={styles.extrasRow}>
          <span className={styles.extrasLabel}>Optional add-ons:</span>
          {pkg.extras.map((e) => (
            <span key={e} className={styles.extraTag}>{e}</span>
          ))}
        </div>
      )}

      {/* Customize panel */}
      {expanded && (
        <div className={styles.customizePanel}>
          <h4 className={styles.customizeTitle}>Customize Your Order</h4>
          <div className={styles.customizeRow}>
            <label className={styles.customizeLabel}>Dietary Preference</label>
            <div className={styles.optionChips}>
              {DIETARY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`${styles.optionChip} ${dietary === opt ? styles.optionChipActive : ''}`}
                  style={dietary === opt ? { borderColor: pkg.accentColor, color: pkg.accentColor } : {}}
                  onClick={() => setDietary(dietary === opt ? '' : opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.customizeRow}>
            <label className={styles.customizeLabel}>Cuisine Style</label>
            <div className={styles.optionChips}>
              {CUISINE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`${styles.optionChip} ${cuisine === opt ? styles.optionChipActive : ''}`}
                  style={cuisine === opt ? { borderColor: pkg.accentColor, color: pkg.accentColor } : {}}
                  onClick={() => setCuisine(cuisine === opt ? '' : opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={styles.packageActions}>
        <button
          type="button"
          className={styles.detailsBtn}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Collapse' : 'Customize'}
        </button>
        <button
          type="button"
          className={styles.bookBtn}
          style={{ background: pkg.accentColor }}
          onClick={() => onBook({ ...pkg, selectedDietary: dietary, selectedCuisine: cuisine })}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

function BookingModal({ pkg, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto-fill from localStorage
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('accesco_user') || '{}');
      if (storedUser.name) setName(storedUser.name);
      if (storedUser.phone) setPhone(storedUser.phone);
      if (storedUser.email) setEmail(storedUser.email);
    } catch {}
    try {
      const storedLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
      const addr =
        storedLocation?.fullAddress ||
        storedLocation?.formattedAddress ||
        storedLocation?.displayAddress ||
        (storedLocation?.area && storedLocation?.city
          ? `${storedLocation.area}, ${storedLocation.city}`
          : '');
      if (addr) setAddress(addr);
    } catch {}
  }, []);

  if (!pkg) return null;

  const stepLabels = ['Schedule', 'Address & Contact', 'Confirm'];
  const minDate = new Date().toISOString().split('T')[0];

  const validateStep2 = () => {
    const errs = {};
    if (!address.trim()) errs.address = 'Please enter a delivery address';
    if (!name.trim()) errs.name = 'Please enter your name';
    if (!phone.trim()) errs.phone = 'Please enter your phone number';
    if (!email.trim()) errs.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Enter a valid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      // Send catering enquiry email via API
      await fetch('/api/swadishtt/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: `CAT-${Date.now().toString(36).toUpperCase()}`,
          newStatus: 'CONFIRMED',
          customerEmail: email,
          customerName: name,
          orderData: {
            id: `CAT-${Date.now().toString(36).toUpperCase()}`,
            type: 'catering',
            package: pkg.name,
            serves: pkg.serves,
            price: pkg.price,
            date,
            time,
            delivery: { address, name, phone, email },
            notes,
            dietary: pkg.selectedDietary,
            cuisine: pkg.selectedCuisine,
            placedAt: new Date().toISOString(),
            totals: { total: pkg.price },
          },
        }),
      });
    } catch (err) {
      console.error('Catering booking email failed:', err);
    }
    setSubmitting(false);
    onSuccess?.();
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader} style={{ borderBottom: `3px solid ${pkg.accentColor}` }}>
          <div>
            <h2 className={styles.modalTitle}>Book {pkg.name}</h2>
            <p className={styles.modalSubtitle}>Serves {pkg.serves} · ₹{pkg.price.toLocaleString()}</p>
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.stepIndicator}>
          {[1, 2, 3].map((s) => (
            <div key={s} className={`${styles.step} ${step >= s ? styles.stepActive : ''}`}>
              <span
                className={styles.stepNum}
                style={step >= s ? { borderColor: pkg.accentColor, color: pkg.accentColor, background: pkg.accentLight } : {}}
              >
                {step > s ? 'Check' : s}
              </span>
              <span className={styles.stepLabel}>{stepLabels[s - 1]}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Schedule */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>When do you need delivery?</h3>
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Event Date *</label>
              <input
                type="date"
                className={styles.formInput}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
              />
            </div>
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Delivery Time *</label>
              <input
                type="time"
                className={styles.formInput}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className={styles.deliveryNoteBox} style={{ borderLeftColor: pkg.accentColor }}>
              <strong>Lead time:</strong> {pkg.deliveryTime} — food arrives fresh, ready to serve.
            </div>
            <button
              className={styles.nextBtn}
              style={{ background: pkg.accentColor }}
              onClick={() => setStep(2)}
              disabled={!date || !time}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Address & Contact */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Delivery Address & Contact</h3>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>Full Name *</label>
              <input
                type="text"
                className={`${styles.formInput} ${errors.name ? styles.inputError : ''}`}
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: '' }); }}
                placeholder="Your full name"
              />
              {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
            </div>

            <div className={styles.formRowSplit}>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Phone *</label>
                <input
                  type="tel"
                  className={`${styles.formInput} ${errors.phone ? styles.inputError : ''}`}
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrors({ ...errors, phone: '' }); }}
                  placeholder="10-digit number"
                />
                {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Email *</label>
                <input
                  type="email"
                  className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
                  placeholder="For booking confirmation"
                />
                {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>Delivery Address *</label>
              <textarea
                className={`${styles.formTextarea} ${errors.address ? styles.inputError : ''}`}
                placeholder="Full address including landmark, floor, building name..."
                value={address}
                onChange={(e) => { setAddress(e.target.value); setErrors({ ...errors, address: '' }); }}
                rows={3}
              />
              {errors.address && <span className={styles.fieldError}>{errors.address}</span>}
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>Special Requests (Optional)</label>
              <textarea
                className={styles.formTextarea}
                placeholder="Allergies, dietary notes, or kitchen instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            <div className={styles.stepBtns}>
              <button type="button" className={styles.backBtn} onClick={() => setStep(1)}>Back</button>
              <button
                className={styles.nextBtn}
                style={{ background: pkg.accentColor }}
                onClick={() => { if (validateStep2()) setStep(3); }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Confirm Your Booking</h3>

            <div className={styles.summaryCard} style={{ borderColor: pkg.accentColor }}>
              <div className={styles.summaryRow}>
                <span>Package</span>
                <span className={styles.summaryVal}>{pkg.name}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Serves</span>
                <span className={styles.summaryVal}>{pkg.serves}</span>
              </div>
              {pkg.selectedDietary && (
                <div className={styles.summaryRow}>
                  <span>Dietary</span>
                  <span className={styles.summaryVal}>{pkg.selectedDietary}</span>
                </div>
              )}
              {pkg.selectedCuisine && (
                <div className={styles.summaryRow}>
                  <span>Cuisine</span>
                  <span className={styles.summaryVal}>{pkg.selectedCuisine}</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>Date & Time</span>
                <span className={styles.summaryVal}>{date} at {time}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Contact</span>
                <span className={styles.summaryVal}>{name} · {phone}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Email</span>
                <span className={styles.summaryVal}>{email}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Address</span>
                <span className={styles.summaryVal} style={{ maxWidth: '180px', textAlign: 'right' }}>{address}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span className={styles.summaryPrice} style={{ color: pkg.accentColor }}>₹{pkg.price.toLocaleString()}</span>
              </div>
            </div>

            <div className={styles.cancellationNote}>
              Free cancellation up to 2 hours before delivery. A confirmation will be sent to {email}.
            </div>

            <div className={styles.stepBtns}>
              <button type="button" className={styles.backBtn} onClick={() => setStep(2)}>Back</button>
              <button
                className={styles.confirmBtn}
                style={{ background: pkg.accentColor }}
                onClick={handleConfirm}
                disabled={submitting}
              >
                {submitting ? 'Confirming...' : `Confirm & Pay ₹${pkg.price.toLocaleString()}`}
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
  const [bookingSuccess, setBookingSuccess] = useState(false);

  return (
    <div className={styles.pageContent}>
      <SwadishttHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroKicker}>Professional Catering · Delivered Fresh</p>
          <h1 className={styles.heroTitle}>Instant Catering<br />for Every Occasion</h1>
          <p className={styles.heroSub}>
            Pre-curated packs for gatherings of all sizes — home parties, birthdays, corporate events, and weddings. No menu planning needed.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.heroBadge}>4–5 Hr Delivery</span>
            <span className={styles.heroBadge}>Zero Hassle</span>
            <span className={styles.heroBadge}>Free Cancellation</span>
            <span className={styles.heroBadge}>4.8 Rated</span>
          </div>
          <a href="#packages" className={styles.heroBtn}>View Packages</a>
        </div>
      </div>

      {/* Success toast */}
      {bookingSuccess && (
        <div className={styles.successToast}>
          Booking confirmed! Check your email for details.
          <button type="button" onClick={() => setBookingSuccess(false)}>✕</button>
        </div>
      )}

      <div className={styles.container}>

        {/* Trust Strip */}
        <div className={styles.trustStrip}>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" /></svg>
            </span>
            <div>
              <strong>500+</strong>
              <span>Events Catered</span>
            </div>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            </span>
            <div>
              <strong>4.8/5</strong>
              <span>Average Rating</span>
            </div>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </span>
            <div>
              <strong>50+</strong>
              <span>Expert Chefs</span>
            </div>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
            </span>
            <div>
              <strong>100%</strong>
              <span>Fresh Ingredients</span>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className={styles.howItWorks}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>Simple Process</span>
            <h2 className={styles.sectionTitle}>How It Works</h2>
          </div>
          <div className={styles.stepsRow}>
            {HOW_IT_WORKS.map((s, idx) => (
              <div key={s.num} className={styles.howStep}>
                <div className={styles.howStepNum}>{s.num}</div>
                <h4 className={styles.howStepLabel}>{s.label}</h4>
                <p className={styles.howStepDesc}>{s.desc}</p>
                {idx < HOW_IT_WORKS.length - 1 && <div className={styles.stepConnector} />}
              </div>
            ))}
          </div>
        </div>

        {/* Packages */}
        <div id="packages">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>Curated Menus</span>
            <h2 className={styles.sectionTitle}>Choose Your Package</h2>
            <p className={styles.sectionSub}>All packages include fresh preparation, professional packaging, and timely delivery.</p>
          </div>
          <div className={styles.packagesGrid}>
            {CATERING_PACKAGES.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} onBook={setBookingPkg} />
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className={styles.ctaBanner}>
          <div className={styles.ctaContent}>
            <h3>Ready to make your event special?</h3>
            <p>Book in minutes — we handle the rest.</p>
          </div>
          <a href="#packages" className={styles.ctaBtn}>Book Now</a>
        </div>
      </div>

      {bookingPkg && (
        <BookingModal
          pkg={bookingPkg}
          onClose={() => setBookingPkg(null)}
          onSuccess={() => setBookingSuccess(true)}
        />
      )}
    </div>
  );
}

export default function InstantCateringPage() {
  return <InstantCateringContent />;
}
