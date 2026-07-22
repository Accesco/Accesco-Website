'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import styles from './landing.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import FeatureAccordion from '@/components/instastyle/FeatureAccordion';
import FashionCollections from '@/components/instastyle/FashionCollections';
import SwipeStyleShowcase from '@/components/instastyle/SwipeStyleShowcase';
import DeliveryHero from '@/components/instastyle/DeliveryHero';
import JsonLd from '../../../components/JsonLd';
import StyleStories from './components/StyleStories';

// ── Register GSAP Plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Fashion Delivery",
  name: "InstaStyle by Accesco Living",
  description:
    "Fashion discovery, styling, try-at-home experiences, curated collections and premium apparel delivery.",
  url: "https://accescoliving.com/services/instastyle",
  provider: {
    "@type": "Organization",
    name: "Accesco Living",
    url: "https://accescoliving.com",
  },
  areaServed: {
    "@type": "City",
    name: "Bengaluru",
  },
};

export default function InstaStyleLanding({ featuredProducts, brandSet, categoryCards }) {
  const pageRef    = useRef(null);
  const heroRef    = useRef(null);
  const progressRef = useRef(null);
  const stepsSliderRef = useRef(null);
  const reviewsSliderRef = useRef(null);
  const introVideoRef = useRef(null);
  const introTimersRef = useRef([]);

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const [introVisible, setIntroVisible] = useState(true);
  const [introRendered, setIntroRendered] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoStarted, setVideoStarted] = useState(false);

  // 1. Autoplay attempt on mount
  useEffect(() => {
    const video = introVideoRef.current;
    if (video) {
      const attemptPlay = () => {
        video.muted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('[InstaStyle] Intro video autoplay blocked.', err);
            // If blocked, start the intro experience fallback
            setVideoStarted(true);
            setVideoLoading(false);
          });
        }
      };

      if (video.readyState >= 3) {
        attemptPlay();
      } else {
        video.addEventListener('canplay', attemptPlay, { once: true });
      }
    }

    // Safety fallback: if video doesn't start in 4 seconds, force start
    const fallbackTimer = setTimeout(() => {
      setVideoStarted((started) => {
        if (!started) {
          setVideoLoading(false);
          return true;
        }
        return started;
      });
    }, 4000);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, []);

  // 2. Start progress and dismiss timers only after video starts playing
  useEffect(() => {
    if (!videoStarted) return;

    // Fade out at exactly 9s, unmount after fade completes
    const t1 = setTimeout(() => setIntroVisible(false), 9000);
    const t2 = setTimeout(() => setIntroRendered(false), 9800);
    introTimersRef.current = [t1, t2];

    const totalDuration = 9000;
    const tickInterval = 90;
    let elapsed = 0;
    const progressTimer = setInterval(() => {
      elapsed += tickInterval;
      setVideoProgress(Math.min((elapsed / totalDuration) * 100, 100));
    }, tickInterval);
    introTimersRef.current.push(progressTimer);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(progressTimer);
    };
  }, [videoStarted]);

  // Pause video at 9s so it never plays beyond the intro window
  const handleVideoTimeUpdate = () => {
    if (introVideoRef.current && introVideoRef.current.currentTime >= 9) {
      introVideoRef.current.pause();
    }
  };

  const handleSkipIntro = () => {
    // Clear auto-dismiss timers and progress interval
    introTimersRef.current.forEach((t) => { clearTimeout(t); clearInterval(t); });
    // Pause video immediately
    if (introVideoRef.current) introVideoRef.current.pause();
    // Fade out, then unmount after animation
    setIntroVisible(false);
    setVideoProgress(100);
    setTimeout(() => setIntroRendered(false), 800);
  };

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
  const instastyleFeatures = [
    {
      title: 'Curated Delivery',
      description: 'High-demand outfits delivered to your doorstep with precision and care, ensuring you have the perfect look for any occasion.',
    },
    {
      title: 'Trial at Home',
      description: 'Experience the perfect fit in the comfort of your home. Keep only what you love and feel confident in.',
    },
    {
      title: 'THE STYLE COUNCIL',
      description: 'Share your finds with friends and get immediate feedback on your looks. Elevate your shopping experience into a collaborative journey.',
    },
    {
      title: 'Outfit Curator',
      description: 'Select an occasion and receive a hand-picked, ready-to-wear outfit set curated for your specific style and event.',
    },
    {
      title: 'Fit Perfection',
      description: 'Our engine learns your fit preferences across all brands to ensure every order is perfectly sized for you.',
    },
    {
      title: 'Thrift Marketplace',
      description: 'A dedicated space for pre-owned luxury, promoting a circular economy and sustainable fashion choices.',
    },
    {
      title: 'Virtual Try-On',
      description: 'Digital body-mapping previews that let users visualise fit, fall, and proportions before ordering, reducing size confusion and returns.',
    },
    {
      title: 'SwipeStyle Discovery',
      description: 'Swipe-based fashion exploration that learns style preferences instantly and builds a personalised SwipeStyle Cart.',
    }
  ];

  const reviews = [
    { text: 'The delivery speed is incredible. Ordered a dress for a dinner and it arrived perfectly on time.', name: 'Priya Sharma', location: 'Mumbai', initial: 'P' },
    { text: 'The fit recommendations are spot on — no more returns due to sizing issues. The quality is exceptional.', name: 'Rahul Verma', location: 'Delhi', initial: 'R' },
    { text: 'I love the thrift marketplace! A sustainable way to refresh my wardrobe with authenticated luxury.', name: 'Ananya Patel', location: 'Bangalore', initial: 'A' },
    { text: 'The try-on experience is seamless. It takes the guesswork out of online shopping.', name: 'Karan Singh', location: 'Pune', initial: 'K' },
    { text: 'A premium fashion destination with impeccable service and a curated selection of brands.', name: 'Sneha Reddy', location: 'Hyderabad', initial: 'S' },
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

    // 2. Hero Entrance Timeline
    const heroTl = gsap.timeline();
    heroTl
      .from(`.${styles.heroTitle}`, {
        opacity: 0,
        y: 40,
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

    // 3.5 RevealText Animations
    const sectionTitles = pageRef.current.querySelectorAll(`.${styles.sectionTitle}`);
    sectionTitles.forEach((title) => {
      gsap.from(title, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 90%',
        }
      });
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
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: pageRef, dependencies: [] });


  // ── Mobile auto-scroll logic removed since grid is static now

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
  <>
    <JsonLd data={serviceSchema} />

    {introRendered && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#0d0d0d',
        zIndex: 99999,
        overflow: 'hidden',
        opacity: introVisible ? 1 : 0,
        transition: 'opacity 0.8s ease-in-out',
        pointerEvents: introVisible ? 'all' : 'none',
      }}>
        {/* Sleek loading spinner while video buffers */}
        {videoLoading && (
          <div className={styles.videoSpinnerContainer}>
            <div className={styles.videoSpinner} />
          </div>
        )}

        {/* Fullscreen video — no black bars, capped at 9s via onTimeUpdate */}
        <video
          ref={introVideoRef}
          autoPlay
          muted={true}
          playsInline
          preload="auto"
          disablePictureInPicture
          onTimeUpdate={handleVideoTimeUpdate}
          onPlay={() => {
            setVideoStarted(true);
            setVideoLoading(false);
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            zIndex: 0,
            opacity: videoLoading ? 0 : 1,
            transition: 'opacity 0.4s ease-in-out',
            willChange: 'opacity',
          }}
        >
          <source src="/images/instastylevideo.mp4" type="video/mp4" />
        </video>

        {/* Dark gradient overlay so branding/controls are always readable */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.55) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }} />

        {/* Skip button — high zIndex ensures it is always clickable above video */}
        <button
          onClick={handleSkipIntro}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            color: '#111',
            padding: '10px 22px',
            borderRadius: '30px',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.5px',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            transition: 'background 0.2s ease, transform 0.2s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: 100000,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Skip Intro
        </button>

        {/* Branding label */}
        <div style={{
          position: 'absolute',
          bottom: '52px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#fff',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          zIndex: 100000,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          InstaStyle by Accesco Living
        </div>

        {/* Progress bar — shows auto-dismiss countdown */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '3px',
          background: 'rgba(255,255,255,0.2)',
          zIndex: 100000,
        }}>
          <div style={{
            height: '100%',
            width: `${videoProgress}%`,
            background: 'rgba(255,255,255,0.9)',
            transition: 'width 0.09s linear',
            borderRadius: '0 2px 2px 0',
          }} />
        </div>
      </div>
    )}

      <div ref={pageRef} className={styles.landingPage}>
      {/* ── Scroll Progress Bar ── */}
      <div ref={progressRef} className={styles.progressBar} aria-hidden="true" />

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
          preload="auto"
          disablePictureInPicture
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

          <h1 className={styles.heroTitle}>
            INSTA<span className={styles.heroTitleAccent}>STYLE</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Curated fashion from global and local labels. 
            Impeccable service, refined discovery, and quality that speaks for itself.
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
        </div>
      </section>

<div id="why-instastyle" className="w-full overflow-x-hidden">
  <FeatureAccordion />
</div>

{/* ── STYLE STORIES PREVIEW ── */}
<StyleStories />

{/* ── 3. FASHION COLLECTIONS ── */}
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
                  <div className={styles.reviewStars} style={{ display: 'flex', gap: '2px', color: '#1a1108' }}>
                    {[...Array(5)].map((_, idx) => (
                      <svg key={idx} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
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
                    <div className={styles.reviewStars} style={{ display: 'flex', gap: '2px', color: '#1a1108' }}>
                      {[...Array(5)].map((_, idx) => (
                        <svg key={idx} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
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


      {/* ── SWIPE STYLE DISCOVERY ── */}
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
                {isSubscribed ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Done
                  </span>
                ) : 'Subscribe'}
              </button>
            </form>

            {isSubscribed && (
              <p className={styles.successMessage}>
                Thanks! Style drops incoming.
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
    </>
  );
}