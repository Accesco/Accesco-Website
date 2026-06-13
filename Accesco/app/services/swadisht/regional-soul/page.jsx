'use client';

/**
 * Regional Soul Page
 * @page /services/swadisht/regional-soul
 * @description Explore India through authentic state-wise cuisine
 */

import { useState } from 'react';
import { useSwadishtt } from '../contexts/SwadishttContext';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './regional-soul.module.css';
const STATES = [
  {
    id: 'kerala',
    name: 'Kerala',
    tagline: "God's Own Kitchen",
    kicker: 'THE SPICE COAST HERITAGE',
    color: '#0D2A1C', 
    specialties: ['Appam & Stew', 'Fish Curry', 'Puttu & Kadala', 'Payasam', 'Sadya'],
    chefNote: 'Prepared by home chefs from Kochi & Thrissur',
    story: 'Kerala cuisine is defined by its abundant use of coconut, curry leaves, and fresh seafood. Every dish tells the story of a coastal land blessed with spices.',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2000&auto=format&fit=crop',
    dishes: [
      { id: 'k1', name: 'Onam Sadya', price: 599, calories: 1440, rating: 4.9, isVeg: true, image: '/images/swadisht/regional/onam-sadya.jpg', desc: '26-dish feast on banana leaf. Sourced from organic farms in Palakkad.' },
      { id: 'k2', name: 'Kerala Fish Curry', price: 320, calories: 380, rating: 4.7, isVeg: false, image: '/images/swadisht/regional/fish-curry.jpg', desc: 'Tangy coconut milk curry with Kudampuli. Caught fresh from the Vembanad Lake.' },
      { id: 'k3', name: 'Appam & Stew', price: 180, calories: 280, rating: 4.6, isVeg: true, image: '/images/swadisht/regional/appam-stew.jpg', desc: 'Lacy rice crepes with coconut milk stew. A Christian household recipe from Alleppey.' },
      { id: 'k4', name: 'Puttu & Kadala', price: 140, calories: 320, rating: 4.5, isVeg: true, image: '/images/swadisht/regional/puttu.jpg', desc: 'Steamed rice cylinders with black chickpea curry.' },
    ],
  },
  {
    id: 'punjab',
    name: 'Punjab',
    tagline: 'Land of Five Rivers',
    kicker: 'THE REBELS OF THE HARVEST',
    color: '#3A1524', 
    specialties: ['Sarson da Saag', 'Makki di Roti', 'Chole Bhature', 'Lassi', 'Amritsari Kulcha'],
    chefNote: 'Authentic dhaba-style cooking from Amritsar families',
    heroImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop',
    story: 'Punjabi food is bold, hearty, and generous — just like its people. From the smoky tandoor to the creamy dal makhani, every bite is a celebration of life.',
    dishes: [
      { id: 'p1', name: 'Sarson da Saag', price: 220, calories: 340, rating: 4.8, isVeg: true, image: '/images/swadisht/regional/sarson-saag.jpg', desc: 'Mustard greens with hand-churned white butter and makki roti.' },
      { id: 'p2', name: 'Amritsari Kulcha', price: 160, calories: 420, rating: 4.7, isVeg: true, image: '/images/swadisht/regional/kulcha.jpg', desc: 'Crispy layered bread stuffed with spiced potatoes and baked in tandoor.' },
      { id: 'p3', name: 'Lassi', price: 80, calories: 180, rating: 4.9, isVeg: true, image: '/images/swadisht/regional/lassi.jpg', desc: 'Thick sweet yogurt drink served in a traditional clay kullad.' },
      { id: 'p4', name: 'Dal Makhani', price: 240, calories: 380, rating: 4.8, isVeg: true, image: '/images/swadisht/regional/dal-makhani.jpg', desc: 'Slow-cooked black lentils simmered for 24 hours.' },
    ],
  },
  {
    id: 'bengal',
    name: 'Bengal',
    tagline: 'Sweet & Subtle Flavors',
    kicker: 'THE NOBILITY OF THE GANGES',
    color: '#01579B', 
    specialties: ['Machher Jhol', 'Mishti Doi', 'Rosogolla', 'Kosha Mangsho', 'Luchi'],
    chefNote: 'Traditional Bengali home cooks from Kolkata',
    heroImage: 'https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=2000&auto=format&fit=crop',

    story: 'Bengali cuisine is a delicate balance of sweet and savory. Fish is the soul of the kitchen, and no meal is complete without a mishti (sweet) at the end.',
    dishes: [
      { id: 'b1', name: 'Machher Jhol', price: 280, calories: 320, rating: 4.7, isVeg: false, image: '/images/swadisht/regional/machher-jhol.jpg', desc: 'Light fish curry with potatoes, seasoned with signature Panch Phoron.' },
      { id: 'b2', name: 'Kosha Mangsho', price: 380, calories: 480, rating: 4.8, isVeg: false, image: '/images/swadisht/regional/kosha-mangsho.jpg', desc: 'Velvety mutton curry slow-cooked for a deep, dark mahogany finish.' },
      { id: 'b3', name: 'Rosogolla', price: 60, calories: 120, rating: 4.9, isVeg: true, image: '/images/swadisht/regional/rosogolla.jpg', desc: 'Spongy chhena dumplings soaked in a light, fragrant syrup.' },
      { id: 'b4', name: 'Mishti Doi', price: 80, calories: 160, rating: 4.8, isVeg: true, image: '/images/swadisht/regional/mishti-doi.jpg', desc: 'Earthy, caramelized yogurt fermented in traditional terracotta pots.' },
    ],
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    tagline: 'The Royal Desert Legacy',
    kicker: 'THE FIRE OF THE RAJPUTS',
    color: '#BF360C', 
    specialties: ['Dal Baati Churma', 'Laal Maas', 'Gatte ki Sabzi', 'Ker Sangri', 'Ghevar'],
    chefNote: 'Royal Rajput kitchen traditions from Jaipur & Jodhpur',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2000&auto=format&fit=crop',
    story: 'Born from a harsh landscape, Rajasthani food is built for royalty. It reflects the ingenuity of cooking with minimal water and maximum soul.',
    dishes: [
      { id: 'r1', name: 'Dal Baati Churma', price: 280, calories: 680, rating: 4.8, isVeg: true, image: '/images/swadisht/regional/dal-baati.jpg', desc: 'Hand-pressed wheat balls baked over embers, served with pure Desi Ghee.' },
      { id: 'r2', name: 'Laal Maas', price: 420, calories: 560, rating: 4.9, isVeg: false, image: '/images/swadisht/regional/laal-maas.jpg', desc: 'Fiery mutton curry smoked with Mathania chillies.' },
      { id: 'r3', name: 'Gatte ki Sabzi', price: 200, calories: 320, rating: 4.5, isVeg: true, image: '/images/swadisht/regional/gatte.jpg', desc: 'Gram flour dumplings simmered in a tangy yogurt gravy.' },
      { id: 'r4', name: 'Ghevar', price: 120, calories: 280, rating: 4.7, isVeg: true, image: '/images/swadisht/regional/ghevar.jpg', desc: 'Disc-shaped honeycomb sweet topped with malai rabri.' },
    ],
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    tagline: 'The Coromandel Spice Trail',
    kicker: 'ANCIENT DRAVIDIAN WISDOM',
    color: '#4E342E', 
    specialties: ['Chettinad Chicken', 'Idli & Sambar', 'Dosa', 'Filter Coffee', 'Pongal'],
    chefNote: 'Brahmin & Chettinad home cooks from Chennai & Karaikudi',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2000&auto=format&fit=crop',
    story: 'From mild, sattvic temple foods to complex, aromatic Chettinad spices, Tamil cuisine is a testament to ancient culinary wisdom.',
    dishes: [
      { id: 't1', name: 'Chettinad Chicken', price: 360, calories: 520, rating: 4.9, isVeg: false, image: '/images/swadisht/regional/chettinad-chicken.jpg', desc: 'Prepared with 16 varieties of spices including kalpasi and marathi moggu.' },
      { id: 't2', name: 'Ghee Pongal', price: 120, calories: 380, rating: 4.6, isVeg: true, image: '/images/swadisht/regional/pongal.jpg', desc: 'Temple-style rice porridge tempered with ginger, black pepper, and cashews.' },
      { id: 't3', name: 'Filter Coffee', price: 60, calories: 80, rating: 4.9, isVeg: true, image: '/images/swadisht/regional/filter-coffee.jpg', desc: 'Hand-picked beans from Nilgiris, brewed in a brass filter.' },
      { id: 't4', name: 'Idli Sambar', price: 100, calories: 240, rating: 4.7, isVeg: true, image: '/images/swadisht/regional/idli-sambar.jpg', desc: 'Pillow-soft rice cakes with drumstick-infused tiffin sambar.' },
    ],
  },
];

function RegionalSoulContent() {
  const { addToCart } = useSwadishtt();
  const [selectedState, setSelectedState] = useState(STATES[0]);

  const handleAdd = (dish) => {
    addToCart({ 
      id: dish.id, 
      name: dish.name, 
      price: dish.price, 
      image: dish.image 
    });
  };

  return (
    <div className={styles.pageContent}>
      <SwadishttHeader />

      {/* Cinematic Hero Section */}
      <section 
        className={styles.hero} 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('${selectedState.heroImage}')` }}
      >
        <div className={styles.heroContent}>
          {/* Using the kicker property from the state object */}
          <span className={styles.heroKicker}>{selectedState.kicker}</span>
          <h1 className={styles.heroTitle}>{selectedState.name} — {selectedState.tagline}</h1>
          <p className={styles.heroSub}>{selectedState.story}</p>
          <div className={styles.heroActions}>
            <button className={styles.heroBtnPrimary}>Explore the Menu</button>
            <button className={styles.heroBtnOutline}>Our Provenance</button>
          </div>
        </div>
      </section>

      {/* Regional Soul Header */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Regional Soul</h2>
        <p className={styles.sectionQuote}>"Curated exactly as locals experience it"</p>
      </div>

      {/* State Tabs Selector */}
      <nav className={styles.stateSelector}>
        {STATES.map((state) => (
          <button
            key={state.id}
            className={`${styles.stateBtn} ${selectedState.id === state.id ? styles.stateActive : ''}`}
            onClick={() => setSelectedState(state)}
          >
            {state.name}
          </button>
        ))}
      </nav>

      {/* State Featured Story Card */}
      <div className={styles.featuredSection}>
        <div className={styles.featuredHeader}>
          <h2 className={styles.featuredTitle}>{selectedState.name} — {selectedState.tagline}</h2>
          <p className={styles.featuredStory}>{selectedState.story}</p>
          <p className={styles.chefNote}>🍴 {selectedState.chefNote}</p>
        </div>

        <div className={styles.specialtiesRow}>
          <span className={styles.specialtiesLabel}>SPECIALTIES:</span>
          {selectedState.specialties.map((s) => (
            <span key={s} className={styles.specialtyTag}>{s}</span>
          ))}
        </div>
      </div>

      {/* Dish Grid */}
      <main className={styles.container}>
        <div className={styles.dishGrid}>
          {selectedState.dishes.map((dish) => (
            <article key={dish.id} className={styles.dishCard}>
              <div className={styles.dishImageWrap}>
                <img
                  src={dish.image}
                  alt={dish.name}
                  onError={(e) => {
                    e.target.src = `https://placehold.co/600x600/1a1a1a/FFFFFF/png?text=${encodeURIComponent(dish.name)}`;
                  }}
                />
                <div className={styles.ratingBadge}>★ {dish.rating}</div>
                <div className={styles.vegBadge}>{dish.isVeg ? 'VEG' : 'NON-VEG'}</div>
              </div>
              
              <div className={styles.dishContent}>
                <h3 className={styles.dishName}>{dish.name}</h3>
                <p className={styles.dishDesc}>{dish.desc}</p>
                
                <div className={styles.dishFooter}>
                  <div className={styles.priceCol}>
                    <span className={styles.dishPrice}>₹{dish.price}</span>
                    <span className={styles.dishCal}>{dish.calories} cal</span>
                  </div>
                  <button 
                    className={styles.addBtn} 
                    onClick={() => handleAdd(dish)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      
     
    </div>
  );
}

export default function RegionalSoulPage() {
  return <RegionalSoulContent />;
}