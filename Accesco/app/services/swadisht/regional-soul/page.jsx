'use client';

/**
 * Regional Soul Page
 * @page /services/swadisht/regional-soul
 * @description Explore India through authentic state-wise cuisine
 */

import { useState } from 'react';
import { SwadishttProvider, useSwadishtt } from '../contexts/SwadishttContext';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './regional-soul.module.css';

const STATES = [
  {
    id: 'kerala',
    name: 'Kerala',
    emoji: '',
    tagline: 'God\'s Own Kitchen',
    color: '#2E7D32',
    specialties: ['Appam & Stew', 'Fish Curry', 'Puttu & Kadala', 'Payasam', 'Sadya'],
    chefNote: 'Prepared by home chefs from Kochi & Thrissur',
    story: 'Kerala cuisine is defined by its abundant use of coconut, curry leaves, and fresh seafood. Every dish tells the story of a coastal land blessed with spices.',
    dishes: [
      { id: 'k1', name: 'Onam Sadya', price: 599, calories: 1440, rating: 4.9, isVeg: true, image: '/images/swadisht/regional/onam-sadya.jpg', desc: '26-dish feast on banana leaf' },
      { id: 'k2', name: 'Kerala Fish Curry', price: 320, calories: 380, rating: 4.7, isVeg: false, image: '/images/swadisht/regional/fish-curry.jpg', desc: 'Tangy coconut milk curry' },
      { id: 'k3', name: 'Appam & Stew', price: 180, calories: 280, rating: 4.6, isVeg: true, image: '/images/swadisht/regional/appam-stew.jpg', desc: 'Lacy rice crepes with coconut stew' },
      { id: 'k4', name: 'Puttu & Kadala', price: 140, calories: 320, rating: 4.5, isVeg: true, image: '/images/swadisht/regional/puttu.jpg', desc: 'Steamed rice cylinders with black chickpea curry' },
    ],
  },
  {
    id: 'punjab',
    name: 'Punjab',
    emoji: '',
    tagline: 'Land of Five Rivers',
    color: '#F57F17',
    specialties: ['Sarson da Saag', 'Makki di Roti', 'Chole Bhature', 'Lassi', 'Amritsari Kulcha'],
    chefNote: 'Authentic dhaba-style cooking from Amritsar families',
    story: 'Punjabi food is bold, hearty, and generous — just like its people. From the smoky tandoor to the creamy dal makhani, every bite is a celebration.',
    dishes: [
      { id: 'p1', name: 'Sarson da Saag', price: 220, calories: 340, rating: 4.8, isVeg: true, image: '/images/swadisht/regional/sarson-saag.jpg', desc: 'Mustard greens with makki roti' },
      { id: 'p2', name: 'Amritsari Kulcha', price: 160, calories: 420, rating: 4.7, isVeg: true, image: '/images/swadisht/regional/kulcha.jpg', desc: 'Stuffed bread with chole' },
      { id: 'p3', name: 'Lassi', price: 80, calories: 180, rating: 4.9, isVeg: true, image: '/images/swadisht/regional/lassi.jpg', desc: 'Thick sweet yogurt drink' },
      { id: 'p4', name: 'Dal Makhani', price: 240, calories: 380, rating: 4.8, isVeg: true, image: '/images/swadisht/regional/dal-makhani.jpg', desc: 'Slow-cooked black lentils' },
    ],
  },
  {
    id: 'bengal',
    name: 'Bengal',
    emoji: '',
    tagline: 'Sweet & Subtle Flavors',
    color: '#1565C0',
    specialties: ['Machher Jhol', 'Mishti Doi', 'Rosogolla', 'Kosha Mangsho', 'Luchi'],
    chefNote: 'Traditional Bengali home cooks from Kolkata',
    story: 'Bengali cuisine is a delicate balance of sweet and savory. Fish is the soul of the kitchen, and no meal is complete without a mishti (sweet) at the end.',
    dishes: [
      { id: 'b1', name: 'Machher Jhol', price: 280, calories: 320, rating: 4.7, isVeg: false, image: '/images/swadisht/regional/machher-jhol.jpg', desc: 'Light fish curry with potatoes' },
      { id: 'b2', name: 'Kosha Mangsho', price: 380, calories: 480, rating: 4.8, isVeg: false, image: '/images/swadisht/regional/kosha-mangsho.jpg', desc: 'Slow-cooked spiced mutton' },
      { id: 'b3', name: 'Rosogolla', price: 60, calories: 120, rating: 4.9, isVeg: true, image: '/images/swadisht/regional/rosogolla.jpg', desc: 'Spongy cottage cheese balls in syrup' },
      { id: 'b4', name: 'Mishti Doi', price: 80, calories: 160, rating: 4.8, isVeg: true, image: '/images/swadisht/regional/mishti-doi.jpg', desc: 'Sweetened fermented yogurt' },
    ],
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    emoji: '',
    tagline: 'Temple Food & Chettinad Spice',
    color: '#B71C1C',
    specialties: ['Chettinad Chicken', 'Idli & Sambar', 'Dosa', 'Filter Coffee', 'Pongal'],
    chefNote: 'Brahmin & Chettinad home cooks from Chennai & Karaikudi',
    story: 'Tamil cuisine ranges from the mild, sattvic food of Brahmin households to the fiery, aromatic Chettinad cooking. Both are deeply rooted in tradition and ritual.',
    dishes: [
      { id: 't1', name: 'Chettinad Chicken', price: 360, calories: 520, rating: 4.9, isVeg: false, image: '/images/swadisht/regional/chettinad-chicken.jpg', desc: 'Fiery aromatic curry with kalpasi' },
      { id: 't2', name: 'Ghee Pongal', price: 120, calories: 380, rating: 4.6, isVeg: true, image: '/images/swadisht/regional/pongal.jpg', desc: 'Rice & lentil porridge with ghee' },
      { id: 't3', name: 'Filter Coffee', price: 60, calories: 80, rating: 4.9, isVeg: true, image: '/images/swadisht/regional/filter-coffee.jpg', desc: 'Traditional South Indian decoction coffee' },
      { id: 't4', name: 'Idli Sambar', price: 100, calories: 240, rating: 4.7, isVeg: true, image: '/images/swadisht/regional/idli-sambar.jpg', desc: 'Steamed rice cakes with lentil stew' },
    ],
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    emoji: '',
    tagline: 'Royal Desert Cuisine',
    color: '#E65100',
    specialties: ['Dal Baati Churma', 'Laal Maas', 'Gatte ki Sabzi', 'Ker Sangri', 'Ghevar'],
    chefNote: 'Royal Rajput kitchen traditions from Jaipur & Jodhpur',
    story: 'Born from the harsh desert landscape, Rajasthani food is rich, spicy, and built to last. The cuisine reflects the ingenuity of cooking with minimal water and maximum flavor.',
    dishes: [
      { id: 'r1', name: 'Dal Baati Churma', price: 280, calories: 680, rating: 4.8, isVeg: true, image: '/images/swadisht/regional/dal-baati.jpg', desc: 'Baked wheat balls with lentils & sweet churma' },
      { id: 'r2', name: 'Laal Maas', price: 420, calories: 560, rating: 4.9, isVeg: false, image: '/images/swadisht/regional/laal-maas.jpg', desc: 'Fiery red mutton curry' },
      { id: 'r3', name: 'Gatte ki Sabzi', price: 200, calories: 320, rating: 4.5, isVeg: true, image: '/images/swadisht/regional/gatte.jpg', desc: 'Gram flour dumplings in yogurt gravy' },
      { id: 'r4', name: 'Ghevar', price: 120, calories: 280, rating: 4.7, isVeg: true, image: '/images/swadisht/regional/ghevar.jpg', desc: 'Disc-shaped sweet with rabri' },
    ],
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    emoji: '',
    tagline: 'Coastal & Vidarbha Flavors',
    color: '#4527A0',
    specialties: ['Vada Pav', 'Misal Pav', 'Puran Poli', 'Kolhapuri Chicken', 'Modak'],
    chefNote: 'Authentic Maharashtrian home cooks from Mumbai & Pune',
    story: 'Maharashtra\'s cuisine is as diverse as its geography — from the spicy Kolhapuri curries of the south to the sweet Puran Poli of festivals, every region has its own identity.',
    dishes: [
      { id: 'm1', name: 'Vada Pav', price: 40, calories: 280, rating: 4.8, isVeg: true, image: '/images/swadisht/regional/vada-pav.jpg', desc: 'Mumbai\'s iconic street burger' },
      { id: 'm2', name: 'Misal Pav', price: 120, calories: 380, rating: 4.7, isVeg: true, image: '/images/swadisht/regional/misal-pav.jpg', desc: 'Spicy sprouted curry with bread' },
      { id: 'm3', name: 'Kolhapuri Chicken', price: 340, calories: 480, rating: 4.9, isVeg: false, image: '/images/swadisht/regional/kolhapuri.jpg', desc: 'Fiery dry-spiced chicken' },
      { id: 'm4', name: 'Modak', price: 80, calories: 160, rating: 4.8, isVeg: true, image: '/images/swadisht/regional/modak.jpg', desc: 'Steamed coconut-jaggery dumplings' },
    ],
  },
];

function StateSelector({ selected, onSelect }) {
  return (
    <div className={styles.stateSelector}>
      {STATES.map((state) => (
        <button
          key={state.id}
          className={`${styles.stateBtn} ${selected?.id === state.id ? styles.stateActive : ''}`}
          style={selected?.id === state.id ? { borderColor: state.color, background: `${state.color}15` } : {}}
          onClick={() => onSelect(state)}
        >
          <span className={styles.stateName}>{state.name}</span>
        </button>
      ))}
    </div>
  );
}

function StateFeatured({ state, onAdd }) {
  return (
    <div className={styles.featuredSection}>
      <div className={styles.featuredHeader} style={{ borderLeftColor: state.color }}>
        <div>
          <h2 className={styles.featuredTitle}>
            {state.emoji} {state.name} — {state.tagline}
          </h2>
          <p className={styles.featuredStory}>{state.story}</p>
          <p className={styles.chefNote}>👨‍🍳 {state.chefNote}</p>
        </div>
      </div>

      <div className={styles.specialtiesRow}>
        <span className={styles.specialtiesLabel}>Specialties:</span>
        {state.specialties.map((s) => (
          <span key={s} className={styles.specialtyTag} style={{ borderColor: state.color, color: state.color }}>
            {s}
          </span>
        ))}
      </div>

      <div className={styles.dishGrid}>
        {state.dishes.map((dish) => (
          <div key={dish.id} className={styles.dishCard}>
            <div className={styles.dishImageWrap}>
              <img
                src={dish.image}
                alt={dish.name}
                onError={(e) => {
                  e.target.src = `https://placehold.co/300x180/${state.color.replace('#', '')}/FFFFFF/png?text=${encodeURIComponent(dish.name)}`;
                }}
              />
              <div className={styles.ratingBadge}>★ {dish.rating}</div>
              <div className={styles.vegBadge}>{dish.isVeg ? 'VEG' : 'NON-VEG'}</div>
            </div>
            <div className={styles.dishContent}>
              <h3 className={styles.dishName}>{dish.name}</h3>
              <p className={styles.dishDesc}>{dish.desc}</p>
              <div className={styles.dishFooter}>
                <div>
                  <span className={styles.dishPrice}>₹{dish.price}</span>
                  <span className={styles.dishCal}>{dish.calories} cal</span>
                </div>
                <button
                  className={styles.addBtn}
                  style={{ background: state.color }}
                  onClick={() => onAdd(dish)}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegionalSoulContent() {
  const { addToCart } = useSwadishtt();
  const [selectedState, setSelectedState] = useState(STATES[0]);

  const handleAdd = (dish) => {
    addToCart({ id: dish.id, name: dish.name, price: dish.price, image: dish.image });
  };

  return (
    <div className={styles.pageContent}>
      <SwadishttHeader />

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Regional Soul</h1>
        <p className={styles.heroSub}>
          Explore India through food — authentic state-wise cuisine curated by locals
        </p>
        <p className={styles.heroQuote}>"Curated exactly as locals experience it"</p>
      </div>

      <div className={styles.container}>
        <div className={styles.sectionLabel}>Select a State</div>
        <StateSelector selected={selectedState} onSelect={setSelectedState} />
        <StateFeatured state={selectedState} onAdd={handleAdd} />
      </div>
    </div>
  );
}

export default function RegionalSoulPage() {
  return (
    <SwadishttProvider>
      <RegionalSoulContent />
    </SwadishttProvider>
  );
}
