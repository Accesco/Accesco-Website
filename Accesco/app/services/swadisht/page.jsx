'use client';

import React, {
  useState,
  useRef,
  useMemo
} from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  RESTAURANTS
} from './lib/swadishttData';
import SwadishttHeader from './components/SwadishttHeader';
import {
  Search,
  Percent,
  HelpCircle,
  User,
  ShoppingBag,
  MapPin,
  Star,
  ChevronRight,
  Eye,
  ArrowRight,
  Sparkles
} from 'lucide-react';


import './swadisht.css';
import styles from './styles/swadisht-main.module.css';
// --- DATA ARRAYS ---

const featureItems = [
  {
    id: 'swipe-eat',
    title: 'SwipeEats',
    description: 'Swipe to discover your next meal',
    image: '/images/features/swipeEats.png',
    link: '/services/swadisht/swipe-eat',
    tags: ['Food', 'Meals'],
    rating: '4.8',
  },
  {
    id: 'thali-engine',
    title: 'Thali Engine',
    description: 'Build a festive, family-style thali',
    image: '/images/features/thaliEngine.png',
    link: '/services/swadisht/thali-engine',
    tags: ['Thali', 'Indian'],
    rating: '4.8',
  },
  {
    id: 'instant-catering',
    title: 'Instant Catering',
    description: 'Pre-book packs for events & offices',
    image: '/images/features/instantCatering.png',
    link: '/services/swadisht/instant-catering',
    tags: ['Catering', 'Events'],
    rating: '4.8',
  },
  {
    id: 'regional-soul',
    title: 'Regional Soul',
    description: 'Authentic cuisines from across India',
    image: '/images/features/regionalSoul.png',
    link: '/services/swadisht/regional-soul',
    tags: ['Cuisine', 'India'],
    rating: '4.8',
  },
];

const cravingCategories = [
  {
    id: 'all',
    label: 'All',
    image: '/images/swadisht/categories/thali.png',
  },
  {
    id: 'biryani',
    label: 'Biryani',
    image: '/images/swadisht/categories/biryani.png',
  },
  {
    id: 'south-indian',
    label: 'South Indian',
    image: '/images/swadisht/categories/south.png',
  },
  {
    id: 'north-indian',
    label: 'North Indian',
    image: '/images/swadisht/categories/thali.png',
  },
  {
    id: 'burgers',
    label: 'Burgers',
    image: '/images/swadisht/categories/burger.png',
  },
  {
    id: 'pizza',
    label: 'Pizza',
    image: '/images/swadisht/categories/pizza.png',
  },
  {
    id: 'healthy',
    label: 'Healthy',
    image: '/images/swadisht/categories/biryani.png',
  },
  {
    id: 'thali',
    label: 'Thali',
    image: '/images/swadisht/categories/thali.png',
  },
  {
    id: 'street-food',
    label: 'Street Food',
    image: '/images/swadisht/categories/samosa.png',
  },
  {
    id: 'beverages',
    label: 'Beverages',
    image: '/images/swadisht/categories/juice.png',
  },
];

const storyItems = [
  { id: 1, title: 'Crispy Butter Masala Dosa', views: '4.2k', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&h=650&fit=crop&q=80' },
  { id: 2, title: 'Classic Dum Biryani Prep', views: '8.5k', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=650&fit=crop&q=80' },
  { id: 3, title: 'Making of Tandoori Roti', views: '12.1k', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=650&fit=crop&q=80' },
  { id: 4, title: 'The Perfect Samosa Fold', views: '3.1k', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=650&fit=crop&q=80' },
  { id: 5, title: 'Chilled Mango Lassi Pour', views: '6.7k', image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=650&fit=crop&q=80' }
];
const trendingRestaurants = RESTAURANTS
  .filter((restaurant) => restaurant.rating >= 4.4)
  .slice(0, 5);

const pureVegRestaurants = RESTAURANTS.filter(
  (restaurant) => restaurant.features?.pureVeg === true
);

const quickBitesRestaurants = RESTAURANTS.filter((restaurant) =>
  restaurant.cuisines.some((cuisine) =>
    [
      'Fast Food',
      'Burgers',
      'Pizza',
      'Cafe',
      'Beverages',
      'Desserts',
      'Street Food',
    ].includes(cuisine)
  )
);

const testimonials = [
  {
    id: 1,
    stars: 5,
    text: '"Amazing ghar jaisa food! The Thali Engine lets me customize exactly what I want. Super fresh and delivered under 30 mins."',
    name: 'Amit Sharma',
    role: 'Bengaluru'
  },
  {
    id: 2,
    stars: 5,
    text: '"SwipeEat is so addictive! Swiped right on a Mughlai dish I hadn\'t tried before and it was outstanding."',
    name: 'Priya Nair',
    role: 'Delhi'
  },
  {
    id: 3,
    stars: 5,
    text: '"Ordered the Instant Catering for an office luncheon. The trays were hot, clean, and the food was praised by everyone!"',
    name: 'Rohan Deshmukh',
    role: 'Mumbai'
  },
  {
    id: 4,
    stars: 5,
    text: '"Authentic regional taste. Their Regional Soul section really delivers genuine local spices and flavors. Recommended!"',
    name: 'Sneha Gupta',
    role: 'Kolkata'
  }
];

function RestaurantCard({ rest, idPrefix }) {
  const primaryOffer = rest.offers?.[0];

  const offerText =
    primaryOffer?.discount > 0
      ? `Flat ${primaryOffer.discount}% OFF`
      : primaryOffer?.title;

  const locationText = [
    rest.location?.area,
    rest.location?.city,
  ]
    .filter(Boolean)
    .join(", ");

  const closingText =
    rest.closingStatus ||
    (rest.timings?.close
      ? `Closes at ${rest.timings.close}`
      : "Closing time unavailable");

  return (
    <Link
      href={`/services/swadisht/restaurant/${rest.slug}`}
      className={styles.referenceRestaurantCard}
      id={`${idPrefix}-card-${rest.id}`}
    >
      <div className={styles.referenceRestaurantMedia}>
        <img
          src={rest.coverImage}
          alt={rest.name}
          className={styles.referenceRestaurantImage}
          onError={(event) => {
            event.currentTarget.src =
              "https://placehold.co/500x380/f7e8e8/861719?text=Restaurant";
          }}
        />

        {primaryOffer && (
          <div className={styles.referenceOfferTag}>
            <Percent size={15} />
            <span>{offerText}</span>
          </div>
        )}
      </div>

      <div className={styles.referenceRestaurantContent}>
        <div className={styles.referenceRestaurantTop}>
          <h3 className={styles.referenceRestaurantName}>
            {rest.name}
          </h3>

          <div className={styles.referenceRating}>
            <span>{rest.rating}</span>
            <Star size={9} fill="currentColor" />
          </div>
        </div>

        <div className={styles.referenceRestaurantMeta}>
          <span className={styles.referenceCuisines}>
            {rest.cuisines[0]}
          </span>

          <span className={styles.referencePrice}>
            ₹{Number(rest.priceForTwo).toLocaleString("en-IN")} for two
          </span>
        </div>

        <p className={styles.referenceLocation}>
          {locationText}
        </p>

        <div className={styles.referenceStatusRow}>
          <span className={styles.referenceClosing}>
            {closingText}
          </span>

          <span className={styles.referenceDistance}>
            {rest.distance || "—"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function App() {
  const [activeCraving, setActiveCraving] = useState("all");
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const storiesTrackRef = useRef(null);

  const scrollStories = () => {
    if (storiesTrackRef.current) {
      storiesTrackRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  // Filter restaurants based on active craving and search term
  const filteredTrending = useMemo(() => {
    return trendingRestaurants.filter(rest => {
      const matchesSearch = rest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            rest.cuisines.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
      if (activeCraving === 'all') return matchesSearch;
      
      const cravingLabel = cravingCategories.find(c => c.id === activeCraving)?.label || '';
      const matchesCraving = rest.cuisines.some(c => c.toLowerCase() === cravingLabel.toLowerCase());
      return matchesCraving && matchesSearch;
    });
  }, [activeCraving, searchTerm]);

  const filteredQuickBites = useMemo(() => {
    return quickBitesRestaurants.filter(rest => {
      const matchesSearch = rest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            rest.cuisines.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
      if (activeCraving === 'all') return matchesSearch;
      
      const cravingLabel = cravingCategories.find(c => c.id === activeCraving)?.label || '';
      const matchesCraving = rest.cuisines.some(c => c.toLowerCase() === cravingLabel.toLowerCase());
      return matchesCraving && matchesSearch;
    });
  }, [activeCraving, searchTerm]);

  return (
    <div className={styles.page} id="main-app-container">
      
      {/* HEADER SECTION */}
     <SwadishttHeader />


      {/* MAIN CONTENT AREA */}
      <main className={styles.pageContent} id="main-content">
        
        {/* 1. HERO SECTION */}
       <section className={styles.heroSection} id="hero-section">

  <div className={styles.heroInner} id="hero-inner">
    <div className={styles.heroTextBlock} id="hero-text-block">
      <h1 className={styles.heroTitle} id="hero-headline">
        Ghar jaisa khaana,
        <span className={styles.heroTitleRed}>
          delivered in 30 minutes.
        </span>
      </h1>

      <p className={styles.heroDescription}>
        Experience premium, authentic regional recipes cooked with love,
        fresh ingredients, and home-style perfection.
      </p>
    </div>
    
  </div>
<section className={styles.featureRow} id="feature-row">
  {featureItems.map((item) => (
    <Link
      key={item.id}
      href={item.link}
      className={styles.featureCard}
    >
      <div className={styles.featureMedia}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className={styles.featureCardImage}
        />

        <div className={styles.featureImageTop}>
          <div className={styles.featureTags}>
            {item.tags.map((tag) => (
              <div className={styles.featureTag} key={tag}>
                {tag}
              </div>
            ))}
          </div>

          <div className={styles.featureRating}>
            ★ {item.rating}
          </div>
        </div>
      </div>

      <div className={styles.featureCardContent}>
        <h3>{item.title}</h3>

        <p>{item.description}</p>

        <div className={styles.featureExplore}>
          Explore
        </div>
      </div>
    </Link>
  ))}
</section>
 

  <section className={styles.statsBar} id="stats-bar">
    <div className={styles.statItem}>
      <span className={styles.statValue}>11+</span>
      <span className={styles.statLabel}>Restaurants</span>
    </div>

    <div className={styles.statItem}>
      <span className={styles.statValue}>200+</span>
      <span className={styles.statLabel}>Dishes</span>
    </div>

    <div className={styles.statItem}>
      <span className={styles.statValue}>30 min</span>
      <span className={styles.statLabel}>Avg Delivery</span>
    </div>

    <div className={styles.statItem}>
      <span className={styles.statValue}>₹0</span>
      <span className={styles.statLabel}>Delivery Fee</span>
    </div>
  </section>

</section>
        {/* 4. BROWSE BY CRAVINGS */}
        <section className={styles.cravingsSection} id="cravings-section">
          <h2 className={styles.cravingsHeading} id="cravings-heading">Browse by cravings</h2>
          <div className={styles.cravingsRow} id="cravings-row">
          {cravingCategories.map((cat) => (
  <Link
    key={cat.id}
    href={
      cat.id === "all"
        ? "/services/swadisht/categories"
        : `/services/swadisht/categories?category=${cat.id}`
    }
    className={styles.cravingItem}
  >
    <div className={styles.cravingImageWrapper}>
      <Image
        src={cat.image}
        alt={cat.label}
        width={110}
        height={110}
        className={styles.cravingImg}
      />
    </div>

    <span className={styles.cravingLabel}>
      {cat.label}
    </span>
  </Link>
))}
            
          </div>
        </section>

        {/* 5. WATCH FOOD STORIES */}
        <section className={styles.storiesSection} id="stories-section">
          <div className={styles.storiesContainer} id="stories-container">
            <div className={styles.storiesLeft} id="stories-left-panel">
              <div className={styles.storiesIcon} id="stories-sparkles-icon">
                <Sparkles size={36} id="sparkles-lucide" />
              </div>
              <h3 className={styles.storiesTitle} id="stories-panel-title">Watch Food Stories</h3>
              <p className={styles.storiesSubtitle} id="stories-panel-subtitle">
                Get a behind-the-scenes look at how your favorite dishes are curated, cooked, and packed perfectly.
              </p>
              <Link
  href="/services/swadisht/food-stories"
  className={styles.storiesBtn}
  id="stories-watch-all-btn"
>
  Watch All
</Link>
            </div>
            
            <div className={styles.storiesRight} id="stories-right-panel">
              <div className={styles.storyCardsTrack} ref={storiesTrackRef} id="story-cards-track">
                {storyItems.map(story => (
                  <div key={story.id} className={styles.storyCard} id={`story-card-${story.id}`}>
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      sizes="165px"
                      className={styles.storyImg}
                      id={`story-img-${story.id}`}
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/165x275/f7e8e8/861719?text=Story";
                      }}
                    />
                    <div className={styles.storyGradient} id={`story-gradient-${story.id}`}></div>
                    <div className={styles.storyView} id={`story-view-${story.id}`}>
                      <Eye size={12} id={`story-eye-icon-${story.id}`} />
                      <span id={`story-views-count-${story.id}`}>{story.views}</span>
                    </div>
                    <span className={styles.storyTitleText} id={`story-title-text-${story.id}`}>{story.title}</span>
                  </div>
                ))}
              </div>
              
              <button 
                className={styles.storyArrowBtn} 
                onClick={scrollStories}
                aria-label="Next stories"
                id="next-story-btn"
              >
                <ChevronRight size={20} id="chevron-right-lucide" />
              </button>
            </div>
          </div>
        </section>

        {/* 6. TRENDING NOW */}
        <section id="trending" className={styles.trendingSection}>
          <div className={styles.sectionHeader} id="trending-header">
            <div>
              <h2 className={styles.trendingTitle} id="trending-section-title">Trending now</h2>
              <span className={styles.trendingSubtitle} id="trending-section-subtitle">Highly rated favorites near you</span>
            </div>
            
          </div>
          
          <div className={styles.restaurantGrid} id="trending-grid">
  {filteredTrending.map((rest) => (
  <RestaurantCard
    key={rest.id}
    rest={rest}
    idPrefix="trending"
  />
))}
</div>
          </section>

        {/* 7. PURE VEG FAVOURITES */}
        <section className={styles.pureVegSection} id="pure-veg-section">
      
          <div className={styles.pureVegDecorLeaf} id="pure-veg-leaf">🍃</div>
          
          <div className={styles.pureVegContainer} id="pure-veg-container">
            <div className={styles.pureVegLeft} id="pure-veg-left-panel">
              <h2 className={styles.pureVegTitle} id="pure-veg-title">Pure veg favourites</h2>
              <p className={styles.pureVegSubtitle} id="pure-veg-subtitle">100% vegetarian kitchens offering wholesome, pristine preparations.</p>
              <a href="#pure-veg" className={styles.pureVegSeeAll} id="pure-veg-see-all-btn">See all →</a>
            </div>
            
            <div className={styles.pureVegGrid} id="pure-veg-grid">
              {pureVegRestaurants.slice(0, 4).map(rest => (
                <Link
  key={rest.id}
  href={`/services/swadisht/restaurant/${rest.slug}`}
  className={styles.vegCardHorizontal}
>
                  <img 
                    src={rest.coverImage}
                    alt={rest.name} 
                    className={styles.vegCardImg}
                    id={`veg-img-${rest.id}`}
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/100x100/f7e8e8/861719?text=PureVeg";
                    }}
                  />
                  <div className={styles.vegCardDetails} id={`veg-details-${rest.id}`}>
                    <h3 className={styles.vegCardTitle} id={`veg-title-${rest.id}`}>{rest.name}</h3>
                    <div className={styles.vegCardMeta} id={`veg-meta-${rest.id}`}>
                      <span className={styles.vegRating} id={`veg-rating-badge-${rest.id}`}>
                        <Star size={10} fill="currentColor" id={`veg-star-${rest.id}`} />
                        <span id={`veg-rating-val-${rest.id}`}>{rest.rating}</span>
                      </span>
                      <span id={`veg-time-${rest.id}`}>{rest.deliveryTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          
          </div>
        </section>

        {/* 8. QUICK BITES & CAFES */}
        <section className={styles.quickBitesSection} id="quick-bites-section">
          <div className={styles.quickBitesHeader} id="quick-bites-header">
            <div>
              <h2 className={styles.quickBitesTitle} id="quick-bites-title">Quick bites & cafes </h2>
              <span className={styles.quickBitesSubtitle} id="quick-bites-subtitle">Grab a fast, satisfying treat or refresh with hot brews</span>
            </div>
          
          </div>
          
          <div className={styles.quickBitesGrid} id="quick-bites-grid">
        {RESTAURANTS.map((rest) => (
  <RestaurantCard
    key={rest.id}
    rest={rest}
    idPrefix="quick"
  />
))}
            {filteredQuickBites.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--sw-muted)' }} id="no-quick-msg">
                No cafes match the craving or search filter.
              </div>
            )}
          </div>
        </section>

        {/* 9. DELIVERY MODE SECTION */}
        <section className={styles.deliverySection} id="delivery-section">
          <span className={styles.deliveryLabel} id="delivery-label">How you get it</span>
          <h2 className={styles.deliveryTitle} id="delivery-title">Delivery models built for how you eat</h2>
          
          <div className={styles.deliveryGrid} id="delivery-grid">
            <a href="#instant" className={styles.deliveryCard} id="delivery-card-instant">
              <div className={styles.deliveryCardText} id="delivery-card-text-instant">
                <h3 className={styles.deliveryCardTitle} id="delivery-card-title-instant">Instant Delivery</h3>
                <p className={styles.deliveryCardDesc} id="delivery-card-desc-instant">Hot, premium chef bowls prepared fresh and delivered in under 30 minutes straight to your desk or doorstep.</p>
              </div>
              <Image
                src="/images/bikerider.png"
                alt="Delivery Bike"
                width={90}
                height={90}
                className={styles.deliveryCardImg}
                id="delivery-img-instant"
              />
            </a>
            
            <a href="#scheduled" className={styles.deliveryCard} id="delivery-card-scheduled">
              <div className={styles.deliveryCardText} id="delivery-card-text-scheduled">
                <h3 className={styles.deliveryCardTitle} id="delivery-card-title-scheduled">Scheduled Catering</h3>
                <p className={styles.deliveryCardDesc} id="delivery-card-desc-scheduled">Planning an office team event or a family gathering? Pre-book customized catering setups with hot-case packaging.</p>
              </div>
              <Image
                src="/images/calendar.png"
                alt="Calendar Planner"
                width={90}
                height={90}
                className={styles.deliveryCardImg}
                id="delivery-img-scheduled"
              />
            </a>
          </div>
        </section>

        {/* 10. TESTIMONIALS */}
        <section className={styles.testimonialsSection} id="testimonials-section">
          <span className={styles.testimonialsLabel} id="testimonials-label">What people are saying</span>
          <h2 className={styles.testimonialsTitle} id="testimonials-title">Honest reviews from our Swadishtt family</h2>
          
          <div className={styles.testimonialsGrid} id="testimonials-grid">
            {testimonials.map((test) => (
              <div key={test.id} className={styles.testimonialCard} id={`testimonial-card-${test.id}`}>
                <div className={styles.starsRow} id={`stars-row-${test.id}`}>
                  {Array.from({ length: test.stars }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" id={`testimonial-star-${test.id}-${i}`} />
                  ))}
                </div>
                <p className={styles.reviewText} id={`review-text-${test.id}`}>{test.text}</p>
                <div className={styles.userInfoRow} id={`user-info-${test.id}`}>
                  <div className={styles.userAvatar} style={{ background: 'var(--sw-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: 'var(--sw-red)' }} id={`avatar-${test.id}`}>
                    {test.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={styles.userTextInfo} id={`user-text-info-${test.id}`}>
                    <span className={styles.userName} id={`user-name-${test.id}`}>{test.name}</span>
                    <span className={styles.userRole} id={`user-role-${test.id}`}>{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.paginationDots} id="pagination-dots">
            <span className={`${styles.dot} ${styles.dotActive}`} id="dot-1"></span>
            <span className={styles.dot} id="dot-2"></span>
            <span className={styles.dot} id="dot-3"></span>
            <span className={styles.dot} id="dot-4"></span>
          </div>
        </section>

      </main>

      {/* 11. FOOTER */}
      <footer className={styles.footer} id="main-footer">
  <div className={styles.footerContainer} id="footer-container">
    <div className={styles.footerGrid} id="footer-grid">

      {/* Brand Section */}
      <div className={styles.footerBrandCol} id="footer-brand-col">
        <Link href="/" className={styles.footerBrandLink}>
          <div className={styles.footerLogo} id="footer-logo-badge">
            S
          </div>

          <span
            className={styles.footerBrandName}
            id="footer-brand-title"
          >
            Swadishtt
          </span>
        </Link>

        <p className={styles.footerDesc} id="footer-description">
          Bringing authentic regional flavors, pristine vegetarian options,
          and specialized scheduled catering straight to your home.
        </p>

        <div className={styles.socialLinks} id="footer-socials">
          <a
            href="https://www.instagram.com/accescostore?utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
            aria-label="Instagram"
            id="social-inst"
          >
            <i className="ri-instagram-line" style={{ fontSize: 16 }}></i>
          </a>

          <a
            href="https://www.facebook.com/share/1BMyjWcU1B/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
            aria-label="Facebook"
            id="social-face"
          >
            <i className="ri-facebook-fill" style={{ fontSize: 16 }}></i>
          </a>

          <a
            href="https://x.com/accesco_living?s=11"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
            aria-label="X"
            id="social-twit"
          >
            <i className="ri-twitter-x-line" style={{ fontSize: 16 }}></i>
          </a>

          <a
            href="https://youtube.com/@accescoliving?si=Xzk9m4vzZqW6-lje"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
            aria-label="YouTube"
            id="social-yt"
          >
            <i className="ri-youtube-fill" style={{ fontSize: 16 }}></i>
          </a>
        </div>
      </div>

      {/* Services */}
      <div className={styles.footerLinksCol} id="footer-col-services">
        <h4
          className={styles.footerColTitle}
          id="footer-title-services"
        >
          Services
        </h4>

        <Link
          href="/services/grokly"
          className={styles.footerLink}
          id="link-grokly"
        >
          Grokly
        </Link>

        <Link
          href="/services/swadisht"
          className={styles.footerLink}
          id="link-swadisht"
        >
          Swadishtt
        </Link>

        <Link
          href="/services/instastyle"
          className={styles.footerLink}
          id="link-instastyle"
        >
          InstaStyle
        </Link>
      </div>

      {/* Company */}
      <div className={styles.footerLinksCol} id="footer-col-company">
        <h4
          className={styles.footerColTitle}
          id="footer-title-company"
        >
          Company
        </h4>

        <Link
          href="/about"
          className={styles.footerLink}
          id="link-about"
        >
          About Us
        </Link>

        <Link
          href="/accesco-library"
          className={styles.footerLink}
          id="link-library"
        >
          Accesco Library
        </Link>

        <Link
          href="/press"
          className={styles.footerLink}
          id="link-press"
        >
          Press &amp; Media
        </Link>

        <Link
          href="/blogs"
          className={styles.footerLink}
          id="link-blog"
        >
          Blogs
        </Link>
      </div>

      {/* Resources */}
      <div className={styles.footerLinksCol} id="footer-col-resources">
        <h4
          className={styles.footerColTitle}
          id="footer-title-resources"
        >
          Resources
        </h4>

        <Link
          href="/contact"
          className={styles.footerLink}
          id="link-contact"
        >
          Help &amp; Support
        </Link>

        <Link
          href="/faq"
          className={styles.footerLink}
          id="link-faq"
        >
          FAQ
        </Link>

        <Link
          href="/referral"
          className={styles.footerLink}
          id="link-referral"
        >
          Referral Program
        </Link>

        <Link
          href="/investor-relations"
          className={styles.footerLink}
          id="link-investors"
        >
          Investor Relations
        </Link>

        <Link
          href="/careers"
          className={styles.footerLink}
          id="link-careers"
        >
          Careers
        </Link>
      </div>

      {/* Legal */}
      <div className={styles.footerLinksCol} id="footer-col-legal">
        <h4
          className={styles.footerColTitle}
          id="footer-title-legal"
        >
          Legal
        </h4>

        <Link
          href="/terms"
          className={styles.footerLink}
          id="link-terms"
        >
          Terms of Service
        </Link>

        <Link
          href="/privacy"
          className={styles.footerLink}
          id="link-privacy"
        >
          Privacy Policy
        </Link>

        <Link
          href="/refund"
          className={styles.footerLink}
          id="link-refund"
        >
          Refund &amp; Cancellation
        </Link>

        <Link
          href="/partner"
          className={styles.footerLink}
          id="link-partner"
        >
          Partner with Us
        </Link>

        <Link
          href="/partner/delivery"
          className={styles.footerLink}
          id="link-delivery-app"
        >
          Delivery Partner App
        </Link>
      </div>
    </div>

    <div className={styles.footerDivider} id="footer-divider"></div>

    <div className={styles.footerBottom}>
      <p
        className={styles.footerCopyright}
        id="footer-copyright-text"
      >
        &copy; {new Date().getFullYear()} Swadishtt by Accesco Living. All
        rights reserved.
      </p>

      <p className={styles.footerLocation}>
        Bengaluru, Karnataka • India
      </p>
    </div>
  </div>
</footer>
    </div>
  );
}