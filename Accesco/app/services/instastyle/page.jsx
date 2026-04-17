'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { categories, getFeaturedProducts, products } from '@/lib/mockData';
import styles from './landing.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import FeatureAccordion from '@/components/instastyle/FeatureAccordion';
import FashionCollections from '@/components/instastyle/FashionCollections';
import SwipeStyleShowcase from '@/components/instastyle/SwipeStyleShowcase';
import DeliveryHero from '@/components/instastyle/DeliveryHero';

// ── Register GSAP Plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Marquee content (doubled for seamless loop)
const MARQUEE_ITEMS = [
  'Free Delivery', 'Try Before You Buy', '200+ Brands',
  '15 Min Delivery', 'AI Styled', 'Squad Vibe Check', 'Zero Wrong Sizes',
];

export default function InstaStyleLanding() {
  const pageRef    = useRef(null);
  const heroRef    = useRef(null);
  const progressRef = useRef(null);
  const stepsSliderRef = useRef(null);
  const reviewsSliderRef = useRef(null);

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const featuredProducts = getFeaturedProducts().slice(0, 4);
  const brandSet = Array.from(new Set(products.map(p => p.brand))).slice(0, 8);
  const loopingBrands = [...brandSet, ...brandSet];

  const styleNotes = [
    {
      title: 'Monsoon Edit',
      description: 'Breathable layers and weather-ready essentials for long city days.',
      cta: 'Read Edit',
      href: '/services/instastyle/catalog?sort=newest',
    },
    {
      title: 'Workwear Reframed',
      description: 'Sharp silhouettes with softer fabrics for office-to-evening looks.',
      cta: 'Shop Workwear',
      href: '/services/instastyle/catalog?category=women',
    },
    {
      title: 'Street Utility',
      description: 'Relaxed fits and utility pieces made for everyday movement.',
      cta: 'Explore Drop',
      href: '/services/instastyle/catalog?category=men',
    },
  ];

  const spotlightFeatures = [
    {
      title: 'Stylist-approved capsules',
      description: 'Build polished looks faster with pre-paired outfits curated by category, fit, and occasion.',
      tag: 'Curated',
      cta: 'View Capsules',
      href: '/services/instastyle/catalog?sort=popular',
    },
    {
      title: 'Premium fabric finder',
      description: 'Filter by fabric feel, drape, and seasonality so every purchase matches comfort and quality.',
      tag: 'Smart Filter',
      cta: 'Try Finder',
      href: '/services/instastyle/catalog',
    },
    {
      title: 'Express style support',
      description: 'Get quick outfit guidance from look experts for events, office days, and weekend edits.',
      tag: 'Assisted',
      cta: 'Start Session',
      href: '/services/instastyle/profile',
    },
  ];

  const howItWorksSteps = [
    { number: '01', title: 'Browse & Select', description: 'Explore top brands and pick your favourites.' },
    { number: '02', title: 'Virtual Try-On', description: 'Preview looks instantly before ordering.' },
    { number: '03', title: 'Quick Delivery', description: 'Get your order in 15–20 minutes at your door.' },
    { number: '04', title: 'Try & Keep', description: 'Keep what you love and return the rest easily.' },
  ];

  const categoryCards = categories.map(cat => {
    const catProducts = products.filter(p => p.category === cat.id);
    return {
      id: cat.id,
      name: cat.name,
      image: catProducts[0]?.images?.[0]?.url || '',
      count: catProducts.length,
    };
  });

  const reviews = [
    { text: 'The 15-minute delivery is a game changer! Ordered a dress for a party and it arrived before I finished my makeup.', name: 'Priya Sharma', location: 'Mumbai', initial: 'P' },
    { text: 'Virtual try-on feature is incredible — no more wrong sizes. The quality of products is top-notch too.', name: 'Rahul Verma', location: 'Delhi', initial: 'R' },
    { text: 'Love the thrift marketplace! Sold my old clothes and bought new ones. Sustainable and affordable fashion.', name: 'Ananya Patel', location: 'Bangalore', initial: 'A' },
    { text: 'Best fashion shopping experience ever! The try before you buy option saved me from so many returns.', name: 'Karan Singh', location: 'Pune', initial: 'K' },
    { text: 'Lightning fast delivery and amazing quality. InstaStyle has become my go-to for all fashion needs!', name: 'Sneha Reddy', location: 'Hyderabad', initial: 'S' },
  ];

  // ── GSAP Reveal Animations
  useGSAP(() => {
    // 0. Theme Configuration
    const themeChapters = [
      { trigger: '#instastyle-hero', bg: '#f2f1ef', text: '#0D0D0D' },
      { trigger: '#why-instastyle', bg: '#0D0D0D', text: '#FAF9F6' },
      { trigger: '#collections', bg: '#FAF9F6', text: '#0D0D0D' },
      { trigger: '#instastyle-categories', bg: '#0D0D0D', text: '#FAF9F6' },
      { trigger: '#swipe-showcase', bg: '#0D0D0D', text: '#FAF9F6' },
      { trigger: '#instastyle-featured', bg: '#FAF9F6', text: '#0D0D0D' },
      { trigger: '#delivery', bg: '#0D0D0D', text: '#FAF9F6' },
      { trigger: '#instastyle-how-it-works', bg: '#FAF9F6', text: '#0D0D0D' }
    ];

    // 1. Text Splitting for Hero
    const heroTitle = new SplitType(`.${styles.heroTitle}`, { types: 'chars,words' });
    
    // 2. Timeline for Hero Entrance
    const heroTl = gsap.timeline();
    heroTl
      .from(heroTitle.chars, {
        opacity: 0,
        y: 40, // Reduced from 80 to prevent excessive gap
        rotateX: -30,
        stagger: 0.02,
        duration: 0.8,
        ease: 'power3.out',
      })
      .from(`.${styles.heroSubtitle}`, {
        opacity: 0,
        y: 15,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.5')
      .from(`.${styles.heroButtons} > *`, {
        opacity: 0,
        y: 10,
        stagger: 0.08,
        duration: 0.6,
        ease: 'back.out(1.5)',
      }, '-=0.3');

    // 3. ScrollTrigger for reveal items
    const revealItems = pageRef.current.querySelectorAll('[data-reveal]');
    revealItems.forEach((item) => {
      gsap.from(item, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // 3.5 RevealText Character Animations (Awwwards staple)
    const sectionTitles = pageRef.current.querySelectorAll(`.${styles.sectionTitle}`);
    sectionTitles.forEach((title) => {
      const split = new SplitType(title, { types: 'chars' });
      gsap.from(split.chars, {
        opacity: 0,
        y: 25,
        stagger: 0.02,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 90%',
        }
      });
    });

    // 4. Parquee logic
    gsap.to(`.${styles.marqueeTrack}`, {
      xPercent: -50,
      repeat: -1,
      duration: 20,
      ease: 'none',
    });

    // 5. Hero Parallax
    gsap.to(`.${styles.hero}`, {
      '--hero-video-shift': '15%',
      ease: 'none',
      scrollTrigger: {
        trigger: `.${styles.hero}`,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // 6. VARIABLE TYPOGRAPHY PHYSICS (High-Fidelity)
    // Headline "breathes" with scroll velocity
    ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity());
        const weight = gsap.utils.interpolate(400, 800, gsap.utils.clamp(0, 1, velocity / 1000));
        gsap.to(`.${styles.heroTitle}`, {
          '--font-weight': weight,
          fontWeight: weight,
          duration: 0.5,
          overwrite: 'auto',
          ease: 'power2.out'
        });
      }
    });

    // 7. CONTEXTUAL THEME SWITCHING (Elite Layer)
    themeChapters.forEach((chapter) => {
      const el = pageRef.current.querySelector(chapter.trigger);
      if (el) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          onEnter: () => {
            gsap.to(pageRef.current, {
              backgroundColor: chapter.bg,
              color: chapter.text,
              duration: 1.2,
              ease: 'power2.inOut'
            });
          },
          onEnterBack: () => {
            gsap.to(pageRef.current, {
              backgroundColor: chapter.bg,
              color: chapter.text,
              duration: 1.2,
              ease: 'power2.inOut'
            });
          }
        });
      }
    });

    return () => {
      heroTitle.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: pageRef });


  // ── Mobile step auto-scroll
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;
    const t = window.setInterval(
      () => setActiveStepIndex(c => (c + 1) % howItWorksSteps.length),
      4200
    );
    return () => window.clearInterval(t);
  }, [howItWorksSteps.length]);

  // ── Mobile review auto-scroll
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;
    const t = window.setInterval(
      () => setActiveReviewIndex(c => (c + 1) % reviews.length),
      5000
    );
    return () => window.clearInterval(t);
  }, [reviews.length]);

  const goToStep   = dir => setActiveStepIndex(c => dir === 'next' ? (c + 1) % howItWorksSteps.length : (c - 1 + howItWorksSteps.length) % howItWorksSteps.length);
  const goToReview = dir => setActiveReviewIndex(c => dir === 'next' ? (c + 1) % reviews.length : (c - 1 + reviews.length) % reviews.length);

  const handleNewsletterSubmit = useCallback(e => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 4000);
    setEmail('');
  }, [email]);

  // ── MAGNETIC BUTTON LOGIC (Awwwards staple)
  const handleMagneticMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(btn, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const resetMagneticMove = (e) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.3)'
    });
  };

  return (
    <div ref={pageRef} className={styles.landingPage}>
      {/* ── Scroll Progress Bar ── */}
      <div ref={progressRef} className={styles.progressBar} aria-hidden="true" />

      {/* ── Announcement Bar ── */}
      <div className={styles.announcementBar} role="marquee">
        Accesco InstaStyle is live in preview — faster discovery, curated edits, try before you buy.
      </div>

      {/* ══════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════ */}
      <section
        id="instastyle-hero"
        className={`${styles.hero} ${styles.revealItem} w-full overflow-x-hidden`}
        ref={heroRef}
        data-reveal
        aria-label="Hero"
      >
        {/* Video background — DO NOT CHANGE */}
        <video
          className={styles.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          <source src="/images/instastyle.mp4" type="video/mp4" />
        </video>
        <div className={styles.heroOverlay} aria-hidden="true" />

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Define your look
          </div>

          <h1 className={styles.heroTitle}>
            INSTA<span className={styles.heroTitleAccent}>STYLE</span>
          </h1>

          <p className={styles.heroSubtitle}>
            AI-curated fashion from 200+ brands. Delivered in 15–20 minutes.
            Try before you buy — keep what you love.
          </p>

          <div className={styles.heroButtons}>
            <Link 
              href="/services/instastyle/catalog" 
              className={styles.btnPrimary}
              onMouseMove={handleMagneticMove}
              onMouseLeave={resetMagneticMove}
              data-magnetic
            >
              Explore Collection
            </Link>
            <Link 
              href="/services/instastyle/swipestyle" 
              className={styles.btnSecondary}
              onMouseMove={handleMagneticMove}
              onMouseLeave={resetMagneticMove}
              data-magnetic
            >
              SwipeStyle
            </Link>
          </div>

          <div className={styles.heroChips}>
            <span className={styles.heroChip}>⚡ 15 min delivery</span>
            <span className={styles.heroChip}>🪞 Try before you buy</span>
            <span className={styles.heroChip}>♻️ Thrift marketplace</span>
          </div>
        </div>
      </section>

      {/* ── Marquee Ticker ── */}
      <div className={styles.marqueeStrip} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className={styles.marqueeItem}>
              <span className={styles.marqueeDot} />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div id="why-instastyle" className="w-full overflow-x-hidden">
        <FeatureAccordion />
      </div>

      {/* ── 3. FASHION COLLECTIONS (NEW) ── */}
      <FashionCollections />

      {/* ── 4. TRENDING PRODUCTS (SHOP THE EDIT) ── */}
      <section id="instastyle-featured" className={`${styles.trending} ${styles.revealItem}`} data-reveal>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Shop the edit</h2>
            </div>
            <Link href="/services/instastyle/catalog" className={styles.viewAll}>
              View All →
            </Link>
          </div>

          <div className={styles.trendingGrid}>
            {featuredProducts.map((product, i) => (
              <Link
                key={product.id}
                href={`/services/instastyle/products/${product.id}`}
                className={`${styles.trendingCard}`}
               
                style={{ '--reveal-delay': `${i * 80}ms` }}
              >
                <div className={styles.trendingImage}>
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className={styles.trendingPhoto}
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src={`https://images.unsplash.com/photo-${i % 2 === 0 ? '1515886657613-9f3515b0c78f' : '1539109136881-3be0616acf4b'}?q=80&w=600&auto=format&fit=crop`}
                      alt={product.name}
                      className={styles.trendingPhoto}
                      loading="lazy"
                    />
                  )}
                  <div className={styles.trendingBadge}>New</div>
                  <div className={styles.quickAdd}>Quick Add</div>
                </div>
                <div className={styles.trendingInfo}>
                  <p className={styles.trendingBrand}>{product.brand}</p>
                  <h3 className={styles.trendingName}>{product.name}</h3>
                  <div className={styles.trendingPrice}>
                    <span className={styles.currentPrice}>
                      ₹{(product.discountedPrice || product.price).toLocaleString()}
                    </span>
                    {product.discountedPrice && (
                      <>
                        <span className={styles.originalPrice}>₹{product.price.toLocaleString()}</span>
                        <span className={styles.discount}>{product.discountPercentage}% OFF</span>
                      </>
                    )}
                  </div>
                  <div className={styles.rating}>
                    <span>{product.rating}</span>
                    <span>({product.reviewCount} reviews)</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. DELIVERY HERO (NEW) ── */}
      <DeliveryHero />

      {/* ══════════════════════════════════════════
          SECTION 4 — CATEGORIES
      ══════════════════════════════════════════ */}
      <section id="categories" className={`${styles.categories} ${styles.revealItem}`} data-reveal>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Shop by Category</h2>
              <p className={styles.sectionSubtitle}>
                Explore curated collections for every look and occasion.
              </p>
            </div>
          </div>

          <div className={styles.categoriesGrid}>
            {categoryCards.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/services/instastyle/catalog?category=${cat.id}`}
                className={`${styles.categoryCard}`}
               
                style={{ '--reveal-delay': `${i * 70}ms` }}
              >
                {cat.image ? (
                  <img src={cat.image} alt={`${cat.name} fashion`} className={styles.categoryImage} loading="lazy" />
                ) : (
                  <img src={`https://images.unsplash.com/photo-${i % 2 === 0 ? '1469334031218-e382a71b716b' : '1529139574466-a303027c028b'}?q=80&w=800&auto=format&fit=crop`} alt={`${cat.name} fashion`} className={styles.categoryImage} loading="lazy" />
                )}
                <div className={styles.categoryOverlay}>
                  <h3 className={styles.categoryName}>{cat.name}</h3>
                  <p className={styles.categoryCount}>{cat.count} Items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section id="instastyle-how-it-works" className={`${styles.howItWorks} ${styles.revealItem} w-full overflow-x-hidden`} data-reveal>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>How InstaStyle works</h2>
              <p className={styles.sectionSubtitle}>One clean flow from browse to doorstep.</p>
            </div>
          </div>

          {/* Desktop version (4-column grid) — hide on mobile */}
          <div className={`${styles.stepsDesktopGrid} hidden md:grid`}>
            {howItWorksSteps.map((step, i) => (
              <div
                key={step.number}
                className={`${styles.step}`}
               
                style={{ '--reveal-delay': `${(i + 1) * 70}ms` }}
              >
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>

          {/* Mobile slider — hide on desktop */}
          <div className={`${styles.stepsMobileSlider} block md:hidden`}>
            <button type="button" className={styles.sliderArrow} onClick={() => goToStep('prev')} aria-label="Previous step">‹</button>
            <div className={styles.sliderViewport} ref={stepsSliderRef}>
              <div className={styles.sliderTrack} style={{ transform: `translateX(-${activeStepIndex * 100}%)` }}>
                {howItWorksSteps.map(step => (
                  <div key={step.number} className={`${styles.step} ${styles.stepCompact}`}>
                    <span className={styles.stepNumber}>{step.number}</span>
                    <div>
                      <h3 className={styles.stepTitle}>{step.title}</h3>
                      <p className={styles.stepDescription}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button type="button" className={styles.sliderArrow} onClick={() => goToStep('next')} aria-label="Next step">›</button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 6 — TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section className={`${styles.socialProof} ${styles.revealItem}`} data-reveal>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>What our customers say</h2>
              <p className={styles.sectionSubtitle}>Join thousands of happy fashion lovers.</p>
            </div>
          </div>

          {/* Desktop auto-scroll */}
          <div className={styles.reviewsDesktopCarousel}>
            <div className={styles.reviewsTrack}>
              {[...reviews, ...reviews].map((r, i) => (
                <div key={i} className={styles.reviewCard}>
                  <span className={styles.reviewQuoteMark}>"</span>
                  <div className={styles.reviewStars}>★★★★★</div>
                  <p className={styles.reviewText}>{r.text}</p>
                  <div className={styles.reviewer}>
                    <div className={styles.reviewerAvatar}>{r.initial}</div>
                    <div>
                      <p className={styles.reviewerName}>{r.name}</p>
                      <p className={styles.reviewerLocation}>{r.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile slider */}
          <div className={styles.reviewsMobileSlider}>
            <button type="button" className={styles.sliderArrow} onClick={() => goToReview('prev')} aria-label="Previous review">‹</button>
            <div className={styles.sliderViewport} ref={reviewsSliderRef}>
              <div className={styles.sliderTrack} style={{ transform: `translateX(-${activeReviewIndex * 100}%)` }}>
                {reviews.map((r, i) => (
                  <article key={i} className={`${styles.reviewCard} ${styles.reviewCompact}`}>
                    <span className={styles.reviewQuoteMark}>"</span>
                    <div className={styles.reviewStars}>★★★★★</div>
                    <p className={styles.reviewText}>{r.text}</p>
                    <div className={styles.reviewer}>
                      <div className={styles.reviewerAvatar}>{r.initial}</div>
                      <div>
                        <p className={styles.reviewerName}>{r.name}</p>
                        <p className={styles.reviewerLocation}>{r.location}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <button type="button" className={styles.sliderArrow} onClick={() => goToReview('next')} aria-label="Next review">›</button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 7 — BRAND LABELS
      ══════════════════════════════════════════ */}
      <section className={`${styles.brands}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Featured labels</h2>
              <p className={styles.sectionSubtitle}>
                A curated mix of popular and premium labels in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Full-width marquee — intentionally outside container */}
        <div className={styles.brandsCarousel}>
          <div className={styles.brandsTrack}>
            {[...loopingBrands, ...loopingBrands].map((brand, i) => (
              <div key={`${brand}-${i}`} className={styles.brandCard}>
                <span className={styles.brandPlaceholder}>{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. WHY PREMIUM SHOPPERS STAY (SPOTLIGHT) ── */}
      <section className={`${styles.editorialSpotlight} ${styles.revealItem}`} data-reveal>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Why premium shoppers stay</h2>
              <p className={styles.sectionSubtitle}>
                Built for people who care about fit, finish, and fast decision-making.
              </p>
            </div>
          </div>

          <div className={styles.editorialGrid}>
            {spotlightFeatures.map((item, i) => (
              <article
                key={item.title}
                className={`${styles.editorialCard}`}
               
                style={{ '--reveal-delay': `${i * 80}ms` }}
              >
                <span className={styles.editorialTag}>{item.tag}</span>
                <h3 className={styles.editorialTitle}>{item.title}</h3>
                <p className={styles.editorialDescription}>{item.description}</p>
                <Link href={item.href} className={styles.editorialCta}>
                  {item.cta} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. SWIPESTYLE SHOWCASE (NEW) ── */}
      <SwipeStyleShowcase />

      {/* ══════════════════════════════════════════
          SECTION 9 — JOURNAL / STYLE NOTES
      ══════════════════════════════════════════ */}
      <section className={`${styles.newsletter}`}>
        <div className={styles.container}>
          <div className={styles.newsletterContent}>
            <h2 className={styles.newsletterTitle}>InstaStyle Journal</h2>
            <p className={styles.newsletterDescription}>
              Weekly style edits, trend notes, and curated drops.
            </p>

            <div className={styles.notesGrid}>
              {styleNotes.map((note, i) => (
                <article
                  key={note.title}
                  className={`${styles.noteCard}`}
                 
                  style={{ '--reveal-delay': `${i * 90}ms` }}
                >
                  <h3 className={styles.noteTitle}>{note.title}</h3>
                  <p className={styles.noteDescription}>{note.description}</p>
                  <Link href={note.href} className={styles.noteLink}>{note.cta}</Link>
                </article>
              ))}
            </div>

            <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm} noValidate>
              <input
                type="email"
                placeholder="Get launch notes by email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={styles.newsletterInput}
                required
                aria-label="Email address"
              />
              <button type="submit" className={styles.newsletterButton}>
                {isSubscribed ? 'Done ✓' : 'Subscribe'}
              </button>
            </form>

            {isSubscribed && (
              <p className={styles.successMessage}>
                ✓ Thanks! Style drops incoming.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 10 — FINAL CTA
      ══════════════════════════════════════════ */}
      <section className={`${styles.cta}`}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              OPEN<br /><span className={styles.ctaTitleAccent}>THE<br />EDIT.</span>
            </h2>
            <p className={styles.ctaDescription}>
              Step into Accesco's fashion marketplace with a sharper structure
              and a stronger point of view. Your wardrobe, curated.
            </p>
            <Link href="/services/instastyle/catalog" className={styles.ctaButton}>
              Explore InstaStyle
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
