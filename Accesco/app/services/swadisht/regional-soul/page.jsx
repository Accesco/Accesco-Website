'use client';

import { useState } from 'react';
import { useSwadishtt } from '../contexts/SwadishttContext';
import SwadishttHeader from '../components/SwadishttHeader';
import { STATES } from './statesData';
import styles from './regional-soul.module.css';
import { Sparkles, MapPin, ArrowLeft, Star, Heart, Flame } from 'lucide-react';

export default function RegionalSoulPage() {
  const { addToCart } = useSwadishtt();
  const [view, setView] = useState('hub');
  const [selectedState, setSelectedState] = useState(STATES[0]);
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [wishlist, setWishlist] = useState({});

  const regions = ['All Regions', 'North India', 'South India', 'East India', 'West India', 'Northeast'];

  const filteredStates = selectedRegion === 'All Regions'
    ? STATES
    : STATES.filter((state) => state.region === selectedRegion);

  const handleSelectState = (state) => {
    setSelectedState(state);
    setView('state-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (dish) => {
    addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
    });
  };

  const toggleWishlist = (dishId) => {
    setWishlist((prev) => ({ ...prev, [dishId]: !prev[dishId] }));
  };

  return (
    <main className={styles.pageContent}>
      <SwadishttHeader />

      {view === 'hub' ? (
        <>
          <section
            className={styles.hero}
            style={{
           backgroundImage:
  "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2000&q=80')",
            }}
          >
            <div className={styles.heroContent}>
              <span className={styles.heroKicker}>
                <Sparkles size={14} /> Curated Culinary Preservation
              </span>

              <h1 className={styles.heroTitle}>
                Discover the <br />
                <span className={styles.heroItalic}>Soul of India</span>
              </h1>

              <p className={styles.heroSub}>
                A sophisticated journey through regional traditions, timeless craftsmanship,
                and the vibrant stories that define the Indian subcontinent.
              </p>

              <button
                type="button"
                className={styles.heroBtnPrimary}
                onClick={() => document.getElementById('region-explorer-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Your Exploration
              </button>
            </div>
          </section>

          <section id="region-explorer-section" className={styles.explorerSection}>
            <div className={styles.sectionHeaderRow}>
              <div className={styles.sectionTitleBlock}>
                <span className={styles.heritageLabel}>Heritage Catalogue</span>
                <h2 className={styles.sectionTitle}>Explore Our Heritage</h2>
                <p className={styles.sectionDesc}>
                  Traverse the diverse landscape of Indian gastronomy. Click on any state card
                  to dive into its local stories and order artisanal delicacies.
                </p>
              </div>

              <div className={styles.regionSelectorRow}>
                {regions.map((region) => (
                  <button
                    type="button"
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`${styles.regionTab} ${selectedRegion === region ? styles.regionActive : ''}`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.statesGrid}>
              {filteredStates.map((state) => (
                <article
                  key={state.id}
                  onClick={() => handleSelectState(state)}
                  className={styles.stateCard}
                >
                  <img src={state.heroImage} alt={state.name} className={styles.stateCardImg} />
                  <div className={styles.stateCardCover} />

                  <div className={styles.stateCardContent}>
                    <span className={styles.stateCardNative}>{state.nativeName}</span>
                    <h3 className={styles.stateCardTitle}>{state.name}</h3>

                    <div className={styles.stateCardHoverInfo}>
                      <p className={styles.stateCardTagline}>{state.tagline}</p>
                      <p className={styles.stateCardSpecialties}>{state.specialties.join(' • ')}</p>
                    </div>

                    <div className={styles.stateCardFooter}>
                      <span>{state.region}</span>
                      <MapPin size={14} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className={styles.detailWrapper}>
          <section
            className={styles.detailHero}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.85)), url('${selectedState.heroImage}')`,
            }}
          >
            <button type="button" onClick={() => setView('hub')} className={styles.backBtn}>
              <ArrowLeft size={14} /> Back to Explorer
            </button>

            <div className={styles.detailHeroContent}>
              <span className={styles.detailHeroKicker}>{selectedState.kicker}</span>
              <h1 className={styles.detailHeroTitle}>
                {selectedState.name}: {selectedState.tagline}
              </h1>
              <p className={styles.detailHeroStory}>{selectedState.story}</p>

              <div className={styles.detailSpecialtiesContainer}>
                <div className={styles.specialtiesPillRow}>
                  {selectedState.specialties.map((specialty) => (
                    <span key={specialty} className={styles.specialtyPill}>{specialty}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className={styles.tapestrySection}>
  <div className={styles.storyLayout}>
    <div className={styles.storyTextBlock}>
      <h2 className={styles.tapestryTitle}>
        {selectedState.traditionalCookingTitle}
      </h2>
      <p className={styles.tapestryText}>
        {selectedState.traditionalCookingStory}
      </p>
    </div>

    <div className={styles.storyImagesTop}>
      {selectedState.traditionalImages.map((img, index) => (
        <div key={index} className={styles.storySmallImage}>
          <img src={img} alt={`${selectedState.name} tradition ${index + 1}`} />
        </div>
      ))}
    </div>

    <div className={styles.storyMainImage}>
      <img
        src={selectedState.specialDishImage || selectedState.heroImage}
        alt={selectedState.culinaryAlchemistTitle}
      />
      <div className={styles.storyImageTag}>
        <strong>{selectedState.culinaryAlchemistTitle}</strong>
        <span>{selectedState.chefNote}</span>
      </div>
    </div>

    <div className={styles.storyCard}>
      <h3>{selectedState.culinaryAlchemistTitle}</h3>
      <p>{selectedState.culinaryAlchemistStory}</p>
    </div>
  </div>
</section>
          <section className={styles.menuContainer}>
            <div className={styles.menuHeader}>
              <span className={styles.menuLabel}>Artisan Specials</span>
              <h2 className={styles.menuTitle}>Taste of {selectedState.name}</h2>
              <p className={styles.menuSubtitle}>Handpicked dishes inspired by regional kitchens and local traditions.</p>
            </div>

            <div className={styles.dishGridCardRow}>
              {selectedState.dishes.map((dish) => (
                <article key={dish.id} className={styles.dishCardModern}>
                  {dish.badge && <span className={styles.dishBadgeLabel}>{dish.badge}</span>}

                  <span className={styles.dishRatingBadge}>
                    <Star size={12} fill="currentColor" /> {dish.rating}
                  </span>

                  <div className={styles.dishImgWrapper}>
                    <img src={dish.image} alt={dish.name} />
                    <span className={styles.dishVegMarker}>
                      <span className={`${styles.vegColorDot} ${dish.isVeg ? styles.vegDotGreen : styles.vegDotRed}`} />
                      {dish.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>

                  <div className={styles.dishContentBlock}>
                    <div>
                      <h3 className={styles.dishNameText}>{dish.name}</h3>
                      <p className={styles.dishDescriptionText}>{dish.desc}</p>
                    </div>

                    <div className={styles.dishFooterRow}>
                      <div>
                        <span className={styles.dishPriceText}>₹{dish.price}</span>
                        <span className={styles.dishCalText}>{dish.calories} cal</span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(dish.id)}
                          aria-label="Toggle wishlist"
                          className={styles.addTrayBtn}
                          style={{ padding: '10px 12px' }}
                        >
                          <Heart size={14} fill={wishlist[dish.id] ? 'currentColor' : 'none'} />
                        </button>

                        <button type="button" onClick={() => handleAddToCart(dish)} className={styles.addTrayBtn}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
