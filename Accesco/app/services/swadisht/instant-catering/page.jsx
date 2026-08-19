'use client';

import React, { useState, useEffect, useRef } from 'react';
import SwadishttHeader from '../components/SwadishttHeader';
import Image from 'next/image';
import styles from './instant-catering.module.css';
import { useAuth } from '../../../components/AuthProvider';

// ── Catering Packages Initial Data ──
const CATERING_PACKAGES = [
  {
    id: 'cp-small',
    name: 'Small Gathering',
    categoryLabel: 'Home Events',
    serves: '10–15 guests',
    price: 2999,
    originalPrice: 3499,
    deliveryTime: '4–5 hrs',
    accentColor: '#1D4ED8',
    accentLight: '#EFF6FF',
    popular: false,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=80',
    includes: [
      '2 Starters (Veg & Non-veg options)',
      '3 Main Courses with side dishes',
      '2 Types of Indian Breads',
      '1 Rice Dish (Pulao/Biryani)',
      '1 Traditional Indian Dessert',
      'Welcome Beverages (Masala Chai/Cooler)',
    ],
    extras: [],
    description: 'A comforting everyday spread perfect for house parties, casual get-togethers, and kitty parties.',
    customizable: true,
  },
  {
    id: 'cp-birthday',
    name: 'Birthday Celebration',
    categoryLabel: 'Celebrations',
    serves: '20–25 guests',
    price: 4999,
    originalPrice: 5999,
    deliveryTime: '4–5 hrs',
    accentColor: '#E11D48',
    accentLight: '#FFF1F2',
    popular: true,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80',
    includes: [
      '3 Starters (Crispy snacks & tikka)',
      '4 Main Courses (Premium selection)',
      '3 Indian Bread Options',
      '2 Rice Dishes (Biryani & Ghee rice)',
      '2 Traditional Desserts',
      'Celebration Cake (Custom flavor)',
      'Beverages & Disposable Crockery',
    ],
    extras: ['Decoration', 'Table Setting', 'Candles'],
    description: 'Our most-loved pack — festive, generous, and photo-ready menu with custom cake options included.',
    customizable: true,
  },
  {
    id: 'cp-office',
    name: 'Office Lunch Pack',
    categoryLabel: 'Corporate',
    serves: '15–20 guests',
    price: 3499,
    originalPrice: 4299,
    deliveryTime: '3–4 hrs',
    accentColor: '#059669',
    accentLight: '#ECFDF5',
    popular: false,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    includes: [
      '2 Starters (Perfect office finger food)',
      '3 Main Courses (Light & wholesome)',
      '2 Breads (Rotis & Paranthas)',
      '1 Light Rice Dish (Jeera rice)',
      'Salad Station & Condiments',
      'Refreshing Beverages',
    ],
    extras: [],
    description: 'Individually packed, easy to serve, zero-fuss portions ideal for team lunches and office presentations.',
    customizable: true,
  },
  {
    id: 'cp-wedding',
    name: 'Mini Wedding Pack',
    categoryLabel: 'Weddings',
    serves: '40–50 guests',
    price: 9999,
    originalPrice: 13999,
    deliveryTime: '6–8 hrs',
    accentColor: '#B45309',
    accentLight: '#FFFBEB',
    popular: false,
    premium: true,
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&auto=format&fit=crop&q=80',
    includes: [
      '4 Starters (Assorted tandoor & platter)',
      '6 Main Courses (Gourmet regional specialties)',
      '4 Premium Bread Options',
      '2 Rice Dishes (Grand Awadhi Biryani)',
      '3 Traditional Desserts',
      'Welcome Drinks & Fruit Punch',
      '2 Serving Staff included',
      'Premium biodegradable crockery',
    ],
    extras: ['Floral Arrangement', 'Welcome Signage', 'Serving Counter'],
    description: 'A premium multi-course spread built for milestone days, engagement ceremonies, and receptions.',
    customizable: true,
  },
];

const DIETARY_OPTIONS = ['Veg Only', 'Non-Veg', 'Mixed', 'Jain', 'No Onion-Garlic'];
const CUISINE_OPTIONS = ['North Indian', 'South Indian', 'Mughlai', 'Continental', 'Chinese', 'Mixed'];

const HOW_IT_WORKS_STEPS = [
  {
    num: '01',
    label: 'Choose package',
    desc: 'Browse our curated catering packs — from intimate home parties to wedding feasts.',
  },
  {
    num: '02',
    label: 'Customise',
    desc: 'Set dietary preferences, cuisine style, and optionally add specialized extras.',
  },
  {
    num: '03',
    label: 'Schedule',
    desc: 'Pick your delivery date and preferred time window with ease.',
  },
  {
    num: '04',
    label: 'We deliver',
    desc: 'Fresh food arrives 4–5 hrs before your event starts, packed professionally.',
  },
];

const TESTIMONIALS = [
  {
    stars: 5,
    text: "Ordered the Birthday Pack for 22 people — food arrived hot, portions were generous, and the cake was absolutely fresh! Everyone loved it.",
    name: "Priya M.",
    event: "Birthday Celebration",
    initials: "PM",
  },
  {
    stars: 5,
    text: "The Office Lunch Pack was perfect for our team of 18. Clean packaging, delicious taste, and prompt delivery. Highly recommended for corporates.",
    name: "Rohan K.",
    event: "Corporate Lunch",
    initials: "RK",
  },
  {
    stars: 5,
    text: "Mini Wedding Pack exceeded expectations. The main course selection was highly authentic. The included serving staff were professional and helpful.",
    name: "Sneha D.",
    event: "Engagement Ceremony",
    initials: "SD",
  },
];

// ── SVG Check Icon ──
function CheckIcon({ color = 'currentColor', size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ── Individual Package Card Component ──
function PackageCard({ pkg, onBook }) {
  const [expanded, setExpanded] = useState(false);
  const [dietary, setDietary] = useState('');
  const [cuisine, setCuisine] = useState('');

  const savings = pkg.originalPrice - pkg.price;
  const isDarkCard = pkg.popular; // Birthday Card is styled as the dark bento block

  return (
    <article 
      className={`${styles.packageCard} ${isDarkCard ? styles.darkCard : ''}`}
      id={`pkg-${pkg.id}`}
    >
      {pkg.popular && <span className={styles.badge}>Most Popular</span>}
      {pkg.premium && <span className={`${styles.badge} ${styles.premiumBadge}`}>Premium</span>}

      <div className={styles.cardTop}>
        <Image
          src={pkg.image}
          alt={pkg.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          priority={pkg.popular}
        />
        <div className={styles.cardTopBar} style={{ backgroundColor: pkg.accentColor }} />
      </div>

      <div className={styles.cardBody}>
        <span className={styles.categoryLabel}>{pkg.categoryLabel}</span>
        <h3 className={styles.pkgName}>{pkg.name}</h3>
        
        <p className={styles.pkgServes}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Serves {pkg.serves}
        </p>

        <p className={styles.pkgDesc}>{pkg.description}</p>

        <div className={styles.priceSection}>
          <div className={styles.priceWrapper}>
            <span className={styles.actualPrice}>₹{pkg.price.toLocaleString()}</span>
            <div className={styles.originalPriceRow}>
              <span className={styles.originalPrice}>₹{pkg.originalPrice.toLocaleString()}</span>
              <span className={styles.discountBadge}>Save ₹{savings}</span>
            </div>
          </div>
          <span className={styles.deliveryNote}>
            {pkg.deliveryTime} Delivery
          </span>
        </div>

        <h4 className={styles.checklistTitle}>What's included</h4>
        <div className={styles.checklist}>
          {pkg.includes.map((item, idx) => (
            <div key={idx} className={styles.checkItem}>
              <span className={styles.checkIconWrapper}>
                <CheckIcon color={pkg.accentColor} size={13} />
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Expandable Customization Section */}
        {expanded && (
          <div className={styles.customizePanel}>
            <h4 className={styles.customSectionTitle}>Dietary Preference</h4>
            <div className={styles.chipsContainer}>
              {DIETARY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`${styles.chip} ${dietary === opt ? styles.chipActive : ''}`}
                  onClick={() => setDietary(dietary === opt ? '' : opt)}
                  aria-pressed={dietary === opt}
                >
                  {opt}
                </button>
              ))}
            </div>

            <h4 className={styles.customSectionTitle}>Cuisine Style</h4>
            <div className={styles.chipsContainer}>
              {CUISINE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`${styles.chip} ${cuisine === opt ? styles.chipActive : ''}`}
                  onClick={() => setCuisine(cuisine === opt ? '' : opt)}
                  aria-pressed={cuisine === opt}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.cardActions}>
          <button
            type="button"
            className={styles.customizeBtn}
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            {expanded ? 'Hide Options' : 'Customise'}
          </button>
          <button
            type="button"
            className={styles.bookNowBtn}
            onClick={() => onBook({ ...pkg, selectedDietary: dietary, selectedCuisine: cuisine })}
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
}

// ── Interactive Multi-Step Booking Modal Component ──
function BookingModal({ pkg, onClose, onSuccess }) {
  const { user, getIdToken } = useAuth();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const modalRef = useRef(null);

  // Lock scrolling & keyboard event listener
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Focus first element
    if (modalRef.current) {
      const focusable = modalRef.current.querySelectorAll('button, input, textarea');
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Autofill details from the signed-in account
  useEffect(() => {
    if (!user) return;
    if (user.name) setName(user.name);
    if (user.phone) setPhone(user.phone);
    if (user.email) setEmail(user.email);
  }, [user]);

  // Autofill delivery address from localStorage
  useEffect(() => {
    try {
      const storedLoc = JSON.parse(localStorage.getItem('userLocation') || '{}');
      const formatted =
        storedLoc?.fullAddress ||
        storedLoc?.formattedAddress ||
        storedLoc?.displayAddress ||
        (storedLoc?.area && storedLoc?.city ? `${storedLoc.area}, ${storedLoc.city}` : '');
      if (formatted) setAddress(formatted);
    } catch (e) {
      console.warn('Location storage read error', e);
    }
  }, []);

  const minDate = new Date().toISOString().split('T')[0];

  const validateStep2 = () => {
    const errs = {};
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedAddress = address.trim();

    if (!trimmedName) errs.name = 'Please enter your name';
    
    // Indian 10-digit phone format validation
    if (!trimmedPhone) {
      errs.phone = 'Please enter your phone number';
    } else if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      errs.phone = 'Enter a valid 10-digit Indian phone number';
    }

    if (!trimmedEmail) {
      errs.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = 'Enter a valid email address';
    }

    if (!trimmedAddress) errs.address = 'Please enter the delivery address';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      setStep(3);
    }
  };

  const handleConfirmOrder = async () => {
    setSubmitting(true);
    setApiError('');
    const bookingId = `CAT-${Date.now().toString(36).toUpperCase()}`;

    try {
      const authHeaders = {};
      if (user?.uid) {
        const token = await getIdToken();
        if (token) {
          authHeaders.Authorization = `Bearer ${token}`;
          authHeaders['x-user-id'] = user.uid;
        }
      }
      const response = await fetch('/api/swadishtt/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({
          orderId: bookingId,
          newStatus: 'CONFIRMED',
          customerEmail: email,
          customerName: name,
          orderData: {
            id: bookingId,
            type: 'catering',
            package: pkg.name,
            serves: pkg.serves,
            price: pkg.price,
            date,
            time,
            delivery: { address, name, phone, email },
            notes,
            dietary: pkg.selectedDietary || 'Standard (No preferences)',
            cuisine: pkg.selectedCuisine || 'Standard (Pre-selected)',
            placedAt: new Date().toISOString(),
            totals: { total: pkg.price },
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Server responded with an error during booking.');
      }

      // Success logic
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Booking API call failed:', err);
      setApiError('Something went wrong while securing your order. Please check your network and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <h2 id="modal-title">Book {pkg.name}</h2>
            <p>Serves {pkg.serves} · ₹{pkg.price.toLocaleString()}</p>
          </div>
          <button 
            type="button" 
            className={styles.modalClose} 
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Stepper */}
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${step >= 1 ? styles.stepActive : ''}`}>
            <span className={styles.stepNum}>1</span>
            <span className={styles.stepLabel}>Schedule</span>
          </div>
          <div className={`${styles.step} ${step >= 2 ? styles.stepActive : ''}`}>
            <span className={styles.stepNum}>2</span>
            <span className={styles.stepLabel}>Details</span>
          </div>
          <div className={`${styles.step} ${step >= 3 ? styles.stepActive : ''}`}>
            <span className={styles.stepNum}>3</span>
            <span className={styles.stepLabel}>Confirm</span>
          </div>
        </div>

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>When is your event?</h3>
            
            <div className={styles.formRow}>
              <label className={styles.formLabel} htmlFor="event-date">Event Date *</label>
              <input
                type="date"
                id="event-date"
                className={styles.formInput}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                required
              />
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel} htmlFor="event-time">Delivery Time *</label>
              <input
                type="time"
                id="event-time"
                className={styles.formInput}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className={styles.deliveryNoteBox}>
              <strong>Notice Period Required:</strong> This pack requires a minimum of {pkg.deliveryTime} prep-and-delivery lead time. We suggest scheduling delivery 1 hour before guests arrive.
            </div>

            <div className={styles.stepBtns}>
              <button 
                type="button" 
                className={styles.backBtn} 
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.nextBtn}
                onClick={() => setStep(2)}
                disabled={!date || !time}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Contact Details */}
        {step === 2 && (
          <form className={styles.stepContent} onSubmit={handleStep2Submit}>
            <h3 className={styles.stepTitle}>Where should we deliver?</h3>

            <div className={styles.formRow}>
              <label className={styles.formLabel} htmlFor="contact-name">Full Name *</label>
              <input
                type="text"
                id="contact-name"
                className={`${styles.formInput} ${errors.name ? styles.inputError : ''}`}
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
                placeholder="Enter your full name"
                required
              />
              {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
            </div>

            <div className={styles.formRowSplit}>
              <div className={styles.formRow}>
                <label className={styles.formLabel} htmlFor="contact-phone">Phone Number *</label>
                <input
                  type="tel"
                  id="contact-phone"
                  className={`${styles.formInput} ${errors.phone ? styles.inputError : ''}`}
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: '' })); }}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  required
                />
                {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
              </div>

              <div className={styles.formRow}>
                <label className={styles.formLabel} htmlFor="contact-email">Email Address *</label>
                <input
                  type="email"
                  id="contact-email"
                  className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                  placeholder="you@example.com"
                  required
                />
                {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel} htmlFor="delivery-addr">Delivery Address *</label>
              <textarea
                id="delivery-addr"
                className={`${styles.formTextarea} ${errors.address ? styles.inputError : ''}`}
                value={address}
                onChange={(e) => { setAddress(e.target.value); setErrors(prev => ({ ...prev, address: '' })); }}
                placeholder="Building, street, Landmark, City & PIN code"
                rows="2"
                required
              />
              {errors.address && <span className={styles.fieldError}>{errors.address}</span>}
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel} htmlFor="special-notes">Special Instructions (Optional)</label>
              <textarea
                id="special-notes"
                className={styles.formTextarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify any spice preferences, food allergies, or landmark details..."
                rows="2"
              />
            </div>

            <div className={styles.stepBtns}>
              <button 
                type="button" 
                className={styles.backBtn} 
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="submit"
                className={styles.nextBtn}
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Review & Finalize */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Confirm Booking Details</h3>

            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>Selected Package:</span>
                <span className={styles.summaryVal}>{pkg.name}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Serves:</span>
                <span className={styles.summaryVal}>{pkg.serves}</span>
              </div>
              
              {pkg.selectedDietary && (
                <div className={styles.summaryRow}>
                  <span>Dietary Preference:</span>
                  <span className={styles.summaryVal}>{pkg.selectedDietary}</span>
                </div>
              )}

              {pkg.selectedCuisine && (
                <div className={styles.summaryRow}>
                  <span>Cuisine Choice:</span>
                  <span className={styles.summaryVal}>{pkg.selectedCuisine}</span>
                </div>
              )}

              <div className={styles.summaryRow}>
                <span>Delivery On:</span>
                <span className={styles.summaryVal}>{date} at {time}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Deliver To:</span>
                <span className={styles.summaryVal}>{name} ({phone})</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Address:</span>
                <span className={styles.summaryVal} style={{ maxWidth: '240px' }}>{address}</span>
              </div>

              {notes.trim() && (
                <div className={styles.summaryRow}>
                  <span>Special Request:</span>
                  <span className={styles.summaryVal} style={{ fontStyle: 'italic' }}>{notes}</span>
                </div>
              )}

              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Grand Total:</span>
                <span className={styles.summaryPrice}>₹{pkg.price.toLocaleString()}</span>
              </div>
            </div>

            <div className={styles.cancellationNote}>
              <strong>Flexible Policy:</strong> Enjoy free cancellation and full refund up to 2 hours before scheduled delivery.
            </div>

            {apiError && <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>{apiError}</div>}

            <div className={styles.stepBtns}>
              <button 
                type="button" 
                className={styles.backBtn} 
                onClick={() => setStep(2)}
                disabled={submitting}
              >
                Back
              </button>
              <button
                type="button"
                className={styles.confirmBtn}
                onClick={handleConfirmOrder}
                disabled={submitting}
              >
                {submitting ? 'Securing Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page Implementation ──
export default function InstantCateringPage() {
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const packagesRef = useRef(null);
  const howItWorksRef = useRef(null);
  const storiesRef = useRef(null);

  // Auto-dismiss success toast after 5 seconds
  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => {
        setToastVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastVisible]);

  const triggerScroll = (elementRef) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingSuccess = () => {
    setToastMessage('Booking secured successfully! A confirmation email and SMS was sent.');
    setToastVisible(true);
  };

  return (
    <div className={styles.pageContent}>
      <SwadishttHeader />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <span className={styles.heroKicker}>Instant Catering</span>
            <h1 className={styles.heroTitle}>
              Celebration-ready food, <span>delivered to your door.</span>
            </h1>
            <p className={styles.heroSub}>
              Pre-curated packs for gatherings of 10–50 guests. No elaborate planning needed — simply pick a pack, customise it to your preferences, and we will handle the rest beautifully.
            </p>

            <div className={styles.heroBadges}>
              <div className={styles.heroBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                4–5 hr delivery
              </div>
              <div className={styles.heroBadge}>
                <CheckIcon color="#059669" size={13} />
                No menu planning
              </div>
              <div className={styles.heroBadge}>
                <CheckIcon color="#059669" size={13} />
                Free cancellation
              </div>
              <div className={styles.heroBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Same-day available
              </div>
            </div>

            <div className={styles.heroButtons}>
              <button 
                type="button" 
                className={styles.primaryHeroBtn}
                onClick={() => triggerScroll(packagesRef)}
              >
                Plan My Catering
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              <button 
                type="button" 
                className={styles.secondaryHeroBtn}
                onClick={() => triggerScroll(packagesRef)}
              >
                View Packages
              </button>
            </div>
          </div>

       <div className={styles.heroRight}>
  <div className={styles.heroImageContainer}>
    <Image
      src="/images/food-dishes.png"
      alt="Swadishtt Catering"
      fill
      priority
      className={styles.heroFoodImage}
    />
  </div>
</div>
        </div>
      </section>

      {/* Dark Statistics Strip */}
      <section className={styles.statsStrip}>
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>Events catered</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>Average rating</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>Same-Day</span>
            <span className={styles.statLabel}>Booking available</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>Guests supported</span>
          </div>
        </div>
        </section>   
<section className={styles.packagesSection}>
  <div className={styles.container}>

    <section
      id="packages"
      ref={packagesRef}
      style={{ scrollMarginTop: '80px', marginBottom: '80px' }}
    >
      <div className={styles.sectionHeader}>
        <h2>Choose your package</h2>
        <p>
          All packages include delivery, hygienic packaging, fresh preparation,
          and a dedicated catering support contact.
        </p>
      </div>

      <div className={styles.packagesGrid}>
        {CATERING_PACKAGES.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            onBook={setSelectedPkg}
          />
        ))}
      </div>
    </section>

  </div>
</section>
      

      {/* How It Works Section */}
      <section id="how-it-works" ref={howItWorksRef} style={{ scrollMarginTop: '80px' }} className={styles.howItWorksBg}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>How it works</h2>
            <p>From kitchen preparation directly to your celebration table in four easy steps.</p>
          </div>

          <div className={styles.timelineRow}>
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <div className={styles.timelineStep} key={step.num}>
                <div className={styles.timelineStepNum}>
                  {step.num}
                </div>
                <h3 className={styles.timelineStepLabel}>{step.label}</h3>
                <p className={styles.timelineStepDesc}>{step.desc}</p>
                {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className={styles.stepConnector} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="stories" ref={storiesRef} style={{ scrollMarginTop: '80px' }} className={styles.testimonialsBg}>
        <div className={styles.container}>
          <div className={styles.testimonialsLayout}>
           
<div className={styles.chiliDecor}>
  <Image
    src="/images/ic3.png"
    alt=""
    width={260}
    height={420}
    className={styles.chiliImage}
    aria-hidden="true"
  />
</div>
            <div>
              <div className={styles.sectionHeader} style={{ textAlign: 'left', margin: '0 0 36px 0', maxWidth: '100%' }}>
                <h2>What our customers say</h2>
                <p>500+ successful events and counting — here’s a look at how a few of our celebrations went.</p>
              </div>

              <div className={styles.testimonialsGrid}>
                {TESTIMONIALS.map((t, idx) => (
                  <div className={styles.testimonialCard} key={idx}>
                    <div className={styles.starsRow} aria-label="5 out of 5 stars">
                      {Array.from({ length: t.stars }).map((_, sIdx) => (
                        <svg key={sIdx} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <p className={styles.reviewText}>"{t.text}"</p>
                    <div className={styles.authorRow}>
                      <div className={styles.authorAvatar} aria-hidden="true">
                        {t.initials}
                      </div>
                      <div className={styles.authorInfo}>
                        <span className={styles.authorName}>{t.name}</span>
                        <span className={styles.authorEvent}>{t.event}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to plan your next event?</h2>
          <p className={styles.ctaSub}>Pick a pre-curated package and get your premium catering locked-in in under 2 minutes.</p>
          <button 
            type="button" 
            className={styles.ctaMainBtn}
            onClick={() => triggerScroll(packagesRef)}
          >
            Book Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 Swadishtt · Instant Catering · A part of Accesco Living</p>
      </footer>

      {/* Interactive Booking Modal */}
      {selectedPkg && (
        <BookingModal
          pkg={selectedPkg}
          onClose={() => setSelectedPkg(null)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Success Toast */}
      {toastVisible && (
        <div className={styles.successToast} role="alert">
          <span>{toastMessage}</span>
          <button 
            type="button" 
            className={styles.toastCloseBtn} 
            onClick={() => setToastVisible(false)}
            aria-label="Dismiss message"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
