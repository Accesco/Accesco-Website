'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { categories, getFeaturedProducts, products } from '@/lib/mockData';
import styles from './landing.module.css';

export default function InstaStyleLanding() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const stepsSliderRef = useRef(null);
  const reviewsSliderRef = useRef(null);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const featuredProducts = getFeaturedProducts().slice(0, 4);
  const brandSet = Array.from(new Set(products.map((product) => product.brand))).slice(0, 10);
  const loopingBrands = [...brandSet, ...brandSet, ...brandSet];
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
  const advantages = [
    {
      metric: '15-20 min',
      title: 'Express delivery',
      detail: 'Priority dispatch for urgent plans and last-minute outfit needs.',
    },
    {
      metric: '98%',
      title: 'Fit confidence',
      detail: 'Smart sizing cues and style guidance reduce mismatch and returns.',
    },
    {
      metric: '24/7',
      title: 'Style support',
      detail: 'On-demand outfit suggestions for workdays, events, and daily wear.',
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
      description: 'Filter by fabric feel, drape, and seasonality so every purchase matches comfort and quality expectations.',
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
    {
      number: '01',
      title: 'Browse & Select',
      description: 'Explore top brands and pick your favourites.',
    },
    {
      number: '02',
      title: 'Virtual Try-On',
      description: 'Preview looks quickly before ordering.',
    },
    {
      number: '03',
      title: 'Quick Delivery',
      description: 'Get your order in 15-20 minutes at your door.',
    },
    {
      number: '04',
      title: 'Try & Keep',
      description: 'Keep what you love and return the rest easily.',
    },
  ];
  const categoryCards = categories.map((category) => {
    const categoryProducts = products.filter((product) => product.category === category.id);
    return {
      id: category.id,
      name: category.name,
      image: categoryProducts[0]?.images?.[0]?.url || '',
      count: categoryProducts.length,
    };
  });

  // Reviews data
  const reviews = [
    {
      text: "The 15-minute delivery is a game changer! I ordered a dress for a party and it arrived before I finished my makeup. Amazing service!",
      name: "Priya Sharma",
      location: "Mumbai",
      initial: "P"
    },
    {
      text: "Virtual try-on feature is incredible! No more ordering wrong sizes. The quality of products is top-notch too.",
      name: "Rahul Verma",
      location: "Delhi",
      initial: "R"
    },
    {
      text: "Love the thrift marketplace! I sold my old clothes and bought new ones. Sustainable and affordable fashion at its best.",
      name: "Ananya Patel",
      location: "Bangalore",
      initial: "A"
    },
    {
      text: "Best fashion shopping experience ever! The try before you buy option saved me from so many returns.",
      name: "Karan Singh",
      location: "Pune",
      initial: "K"
    },
    {
      text: "Lightning fast delivery and amazing quality. InstaStyle has become my go-to for all fashion needs!",
      name: "Sneha Reddy",
      location: "Hyderabad",
      initial: "S"
    }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealNodes = pageRef.current?.querySelectorAll('[data-reveal]') || [];

    if (!prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.setAttribute('data-visible', 'true');
            }
          });
        },
        {
          threshold: 0.18,
          rootMargin: '0px 0px -12% 0px',
        }
      );

      revealNodes.forEach((node) => observer.observe(node));

      let rafId = null;
      const onScroll = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const shift = Math.min(42, scrollY * 0.06);
          const videoShift = Math.min(24, scrollY * 0.035);

          if (heroRef.current) {
            heroRef.current.style.setProperty('--hero-shift', `${shift}px`);
            heroRef.current.style.setProperty('--hero-video-shift', `${videoShift}px`);
          }
          rafId = null;
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
        if (rafId) cancelAnimationFrame(rafId);
      };
    }

    revealNodes.forEach((node) => node.setAttribute('data-visible', 'true'));
    return undefined;
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || window.innerWidth > 768) return undefined;

    const stepTimer = window.setInterval(() => {
      setActiveStepIndex((current) => (current + 1) % howItWorksSteps.length);
    }, 4200);

    return () => window.clearInterval(stepTimer);
  }, [howItWorksSteps.length]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || window.innerWidth > 768) return undefined;

    const reviewTimer = window.setInterval(() => {
      setActiveReviewIndex((current) => (current + 1) % reviews.length);
    }, 5200);

    return () => window.clearInterval(reviewTimer);
  }, [reviews.length]);

  const goToStep = (direction) => {
    setActiveStepIndex((current) => {
      if (direction === 'next') return (current + 1) % howItWorksSteps.length;
      return (current - 1 + howItWorksSteps.length) % howItWorksSteps.length;
    });
  };

  const goToReview = (direction) => {
    setActiveReviewIndex((current) => {
      if (direction === 'next') return (current + 1) % reviews.length;
      return (current - 1 + reviews.length) % reviews.length;
    });
  };

  return (
    <div ref={pageRef} className={styles.landingPage}>
      {/* Announcement Bar */}
      <div className={styles.announcementBar}>
        <p>Accesco Instastyle is live in preview. Faster discovery, cleaner checkout, and fashion-first browsing.</p>
      </div>

      {/* Hero Section */}
      <section id="instastyle-hero" className={`${styles.hero} ${styles.revealItem}`} ref={heroRef} data-reveal>
        <video 
          className={`${styles.heroVideo} ${styles.heroParallaxVideo}`}
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="/images/instastyle.mp4" type="video/mp4" />
        </video>
        <div className={styles.heroOverlay}></div>
        
        <div className={`${styles.heroContent} ${styles.heroParallaxContent}`}>
          <div className={styles.heroBadge}>
            <span>Define your look</span>
          </div>
          
          <h1 className={styles.heroTitle}>
            INSTASTYLE
          </h1>
          
          <p className={styles.heroSubtitle}>
            A new wave of clothing and self-expression designed to elevate your style.
          </p>
          
          <div className={styles.heroButtons}>
            <Link href="/services/instastyle/catalog" className={styles.btnPrimary}>
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Advantage Section */}
      <section className={`${styles.advantage} ${styles.revealItem}`} data-reveal>
        <div className={styles.container}>
          <div className={styles.advantageTop}>
            <div>
              <p className={styles.advantageEyebrow}>InstaStyle Advantage</p>
              <h2 className={styles.advantageTitle}>Premium style, built for faster decisions.</h2>
            </div>
            <Link href="/services/instastyle/catalog" className={styles.advantageCta}>
              Explore Collection
            </Link>
          </div>

          <div className={styles.advantageGrid}>
            {advantages.map((item, index) => (
              <article
                key={item.title}
                className={`${styles.advantageCard} ${styles.revealItem}`}
                data-reveal
                style={{ '--reveal-delay': `${index * 80}ms` }}
              >
                <p className={styles.advantageMetric}>{item.metric}</p>
                <h3 className={styles.advantageCardTitle}>{item.title}</h3>
                <p className={styles.advantageDetail}>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section id="trending" className={`${styles.trending} ${styles.revealItem}`} data-reveal>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Shop the edit</h2>
            <Link href="/services/instastyle/catalog" className={styles.viewAll}>
              View All →
            </Link>
          </div>
          
          <div className={styles.trendingGrid}>
            {featuredProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/services/instastyle/products/${product.id}`}
                className={`${styles.trendingCard} ${styles.revealItem}`}
                data-reveal
                style={{ '--reveal-delay': `${index * 80}ms` }}
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
                    <div className={styles.imagePlaceholder}>
                      <span>{product.name}</span>
                    </div>
                  )}
                  <div className={styles.trendingBadge}>Hot</div>
                </div>
                <div className={styles.trendingInfo}>
                  <h3 className={styles.trendingName}>{product.name}</h3>
                  <p className={styles.trendingBrand}>{product.brand}</p>
                  <div className={styles.trendingPrice}>
                    <span className={styles.currentPrice}>₹{(product.discountedPrice || product.price).toLocaleString()}</span>
                    {product.discountedPrice && (
                      <>
                        <span className={styles.originalPrice}>₹{product.price.toLocaleString()}</span>
                        <span className={styles.discount}>{product.discountPercentage}% OFF</span>
                      </>
                    )}
                  </div>
                  <div className={styles.rating}>
                    <span>⭐ {product.rating}</span>
                    <span>({product.reviewCount} reviews)</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className={`${styles.categories} ${styles.revealItem}`} data-reveal>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <p className={styles.sectionSubtitle}>
            Explore curated category collections for everyday looks and occasions.
          </p>
          
          <div className={styles.categoriesGrid}>
            {categoryCards.map((category, index) => (
              <Link
                key={category.id}
                href={`/services/instastyle/catalog?category=${category.id}`}
                className={`${styles.categoryCard} ${styles.revealItem}`}
                data-reveal
                style={{ '--reveal-delay': `${index * 70}ms` }}
              >
                {category.image ? (
                  <img src={category.image} alt={`${category.name} fashion`} className={styles.categoryImage} loading="lazy" />
                ) : (
                  <div className={styles.categoryImagePlaceholder}>
                    <span>{category.name}</span>
                  </div>
                )}
                <div className={styles.categoryOverlay}>
                  <h3 className={styles.categoryName}>{category.name}</h3>
                  <p className={styles.categoryCount}>{category.count} Items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`${styles.howItWorks} ${styles.revealItem}`} data-reveal>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How InstaStyle works</h2>
          <p className={styles.sectionSubtitle}>
            One clean flow from browse to doorstep.
          </p>

          <div className={styles.stepsDesktopGrid}>
            {howItWorksSteps.map((step, index) => (
              <div key={step.number} className={`${styles.step} ${styles.revealItem}`} data-reveal style={{ '--reveal-delay': `${(index + 1) * 60}ms` }}>
                <div className={styles.stepNumber}>{step.number}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>

          <div className={styles.stepsMobileSlider}>
            <button type="button" className={styles.sliderArrow} onClick={() => goToStep('prev')} aria-label="Previous step">
              ‹
            </button>
            <div className={styles.sliderViewport} ref={stepsSliderRef}>
              <div
                className={styles.sliderTrack}
                style={{ transform: `translateX(-${activeStepIndex * 100}%)` }}
              >
                {howItWorksSteps.map((step) => (
                  <div key={step.number} className={`${styles.step} ${styles.stepCompact}`}>
                    <div className={styles.stepNumber}>{step.number}</div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDescription}>{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <button type="button" className={styles.sliderArrow} onClick={() => goToStep('next')} aria-label="Next step">
              ›
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className={`${styles.socialProof} ${styles.revealItem}`} data-reveal>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
          <p className={styles.sectionSubtitle}>
            Join thousands of happy fashion lovers
          </p>
          
          <div className={styles.reviewsDesktopCarousel}>
            <div className={styles.reviewsTrack}>
              {[...reviews, ...reviews].map((review, index) => (
                <div key={index} className={styles.reviewCard}>
                  <div className={styles.reviewStars}>★★★★★</div>
                  <p className={styles.reviewText}>"{review.text}"</p>
                  <div className={styles.reviewer}>
                    <div className={styles.reviewerAvatar}>{review.initial}</div>
                    <div>
                      <p className={styles.reviewerName}>{review.name}</p>
                      <p className={styles.reviewerLocation}>{review.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.reviewsMobileSlider}>
            <button type="button" className={styles.sliderArrow} onClick={() => goToReview('prev')} aria-label="Previous review">
              ‹
            </button>
            <div className={styles.sliderViewport} ref={reviewsSliderRef}>
              <div
                className={styles.sliderTrack}
                style={{ transform: `translateX(-${activeReviewIndex * 100}%)` }}
              >
                {reviews.map((review, index) => (
                  <article key={index} className={`${styles.reviewCard} ${styles.reviewCompact}`}>
                    <div className={styles.reviewStars}>★★★★★</div>
                    <p className={styles.reviewText}>"{review.text}"</p>
                    <div className={styles.reviewer}>
                      <div className={styles.reviewerAvatar}>{review.initial}</div>
                      <div>
                        <p className={styles.reviewerName}>{review.name}</p>
                        <p className={styles.reviewerLocation}>{review.location}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <button type="button" className={styles.sliderArrow} onClick={() => goToReview('next')} aria-label="Next review">
              ›
            </button>
          </div>
        </div>
      </section>

      {/* Brand Partners Section */}
      <section className={`${styles.brands} ${styles.revealItem}`} data-reveal>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Featured labels</h2>
          <p className={styles.sectionSubtitle}>
            Discover a mix of popular and premium labels in one place.
          </p>
          
          <div className={styles.brandsCarousel}>
            <div className={styles.brandsTrack}>
              {loopingBrands.map((brand, index) => (
                <div
                  key={`${brand}-${index}`}
                  className={`${styles.brandCard} ${styles.revealItem}`}
                  data-reveal
                  style={{ '--reveal-delay': `${index * 55}ms` }}
                >
                  <div className={styles.brandPlaceholder}>{brand}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Spotlight Section */}
      <section className={`${styles.editorialSpotlight} ${styles.revealItem}`} data-reveal>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why premium shoppers stay</h2>
          <p className={styles.sectionSubtitle}>
            Built for people who care about fit, finish, and fast decision-making.
          </p>

          <div className={styles.editorialGrid}>
            {spotlightFeatures.map((item, index) => (
              <article
                key={item.title}
                className={`${styles.editorialCard} ${styles.revealItem}`}
                data-reveal
                style={{ '--reveal-delay': `${index * 80}ms` }}
              >
                <span className={styles.editorialTag}>{item.tag}</span>
                <h3 className={styles.editorialTitle}>{item.title}</h3>
                <p className={styles.editorialDescription}>{item.description}</p>
                <Link href={item.href} className={styles.editorialCta}>
                  {item.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Style Notes Section */}
      <section className={`${styles.newsletter} ${styles.revealItem}`} data-reveal>
        <div className={styles.container}>
          <div className={styles.newsletterContent}>
            <h2 className={styles.newsletterTitle}>InstaStyle Journal</h2>
            <p className={styles.newsletterDescription}>
              Weekly style edits, trend notes, and curated drops.
            </p>

            <div className={styles.notesGrid}>
              {styleNotes.map((note, index) => (
                <article
                  key={note.title}
                  className={`${styles.noteCard} ${styles.revealItem}`}
                  data-reveal
                  style={{ '--reveal-delay': `${index * 90}ms` }}
                >
                  <h3 className={styles.noteTitle}>{note.title}</h3>
                  <p className={styles.noteDescription}>{note.description}</p>
                  <Link href={note.href} className={styles.noteLink}>
                    {note.cta}
                  </Link>
                </article>
              ))}
            </div>

            <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Get launch notes by email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.newsletterInput}
                required
              />
              <button type="submit" className={styles.newsletterButton}>
                Join
              </button>
            </form>

            {isSubscribed && <p className={styles.successMessage}>Thanks for subscribing.</p>}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`${styles.cta} ${styles.revealItem}`} data-reveal>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to open the edit?
            </h2>
            <p className={styles.ctaDescription}>
              Step into the first version of Accesco's fashion marketplace with a sharper structure and a stronger point of view.
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
