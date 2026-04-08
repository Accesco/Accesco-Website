'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categories, getFeaturedProducts, products } from '@/lib/mockData';
import styles from './landing.module.css';

export default function InstaStyleLanding() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const featuredProducts = getFeaturedProducts().slice(0, 4);
  const brandSet = Array.from(new Set(products.map((product) => product.brand))).slice(0, 10);
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

  return (
    <div className={styles.landingPage}>
      {/* Announcement Bar */}
      <div className={styles.announcementBar}>
        <p>Accesco Instastyle is live in preview. Faster discovery, cleaner checkout, and fashion-first browsing.</p>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <video 
          className={styles.heroVideo}
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="/images/instastyle.mp4" type="video/mp4" />
        </video>
        <div className={styles.heroOverlay}></div>
        
        <div className={styles.heroContent}>
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

      {/* Trending Now Section */}
      <section id="trending" className={styles.trending}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Shop the edit</h2>
            <Link href="/services/instastyle/catalog" className={styles.viewAll}>
              View All →
            </Link>
          </div>
          
          <div className={styles.trendingGrid}>
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/services/instastyle/products/${product.id}`} className={styles.trendingCard}>
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

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why InstaStyle feels different</h2>
          <p className={styles.sectionSubtitle}>
            Practical shopping features focused on discovery, delivery, and smooth checkout.
          </p>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureNumber}>01</div>
              <h3 className={styles.featureTitle}>Lightning Fast Delivery</h3>
              <p className={styles.featureDescription}>
                Get your fashion delivered in just 15-20 minutes. No more waiting days for your style fix.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureNumber}>02</div>
              <h3 className={styles.featureTitle}>Try Before You Buy</h3>
              <p className={styles.featureDescription}>
                Try items at your doorstep before making a purchase. Return what doesn't fit instantly.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureNumber}>03</div>
              <h3 className={styles.featureTitle}>Curated Styling</h3>
              <p className={styles.featureDescription}>
                Get edited recommendations based on browsing, category, and product interest.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureNumber}>04</div>
              <h3 className={styles.featureTitle}>Sustainable Fashion</h3>
              <p className={styles.featureDescription}>
                Shop thrift, sell your pre-loved items, and join our circular fashion economy.
              </p>
            </div>

            <Link href="/services/instastyle/virtual-tryon" className={styles.featureCard}>
              <div className={styles.featureNumber}>05</div>
              <h3 className={styles.featureTitle}>Virtual Try-On</h3>
              <p className={styles.featureDescription}>
                Preview looks quickly in a simple camera-based fitting room before checkout.
              </p>
            </Link>

            <div className={styles.featureCard}>
              <div className={styles.featureNumber}>06</div>
              <h3 className={styles.featureTitle}>Secure Payments</h3>
              <p className={styles.featureDescription}>
                Multiple payment options with bank-level security. Pay how you want, when you want.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className={styles.categories}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <p className={styles.sectionSubtitle}>
            Explore curated category collections for everyday looks and occasions.
          </p>
          
          <div className={styles.categoriesGrid}>
            {categoryCards.map((category) => (
              <Link key={category.id} href={`/services/instastyle/catalog?category=${category.id}`} className={styles.categoryCard}>
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
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How the flow works</h2>
          <p className={styles.sectionSubtitle}>
            Get your fashion fix in 4 simple steps
          </p>
          
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>01</div>
              <h3 className={styles.stepTitle}>Browse & Select</h3>
              <p className={styles.stepDescription}>
                Explore thousands of products from top brands and select your favorites
              </p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>02</div>
              <h3 className={styles.stepTitle}>Virtual Try-On</h3>
              <p className={styles.stepDescription}>
                Use our camera preview flow to compare looks before ordering
              </p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>03</div>
              <h3 className={styles.stepTitle}>Quick Delivery</h3>
              <p className={styles.stepDescription}>
                Get your order delivered in just 15-20 minutes to your doorstep
              </p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>04</div>
              <h3 className={styles.stepTitle}>Try & Keep</h3>
              <p className={styles.stepDescription}>
                Try at home and keep what you love. Free returns on everything else
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className={styles.socialProof}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
          <p className={styles.sectionSubtitle}>
            Join thousands of happy fashion lovers
          </p>
          
          <div className={styles.reviewsCarousel}>
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
        </div>
      </section>

      {/* Brand Partners Section */}
      <section className={styles.brands}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Featured labels</h2>
          <p className={styles.sectionSubtitle}>
            Discover a mix of popular and premium labels in one place.
          </p>
          
          <div className={styles.brandsCarousel}>
            <div className={styles.brandsTrack}>
              {[...brandSet, ...brandSet, ...brandSet].map((brand, index) => (
                <div key={index} className={styles.brandCard}>
                  <div className={styles.brandPlaceholder}>{brand}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletter}>
        <div className={styles.container}>
          <div className={styles.newsletterContent}>
            <h2 className={styles.newsletterTitle}>Stay in the loop</h2>
            <p className={styles.newsletterDescription}>
              Get launch updates, curated drops, and early access to the next InstaStyle edits.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.newsletterInput}
                required
              />
              <button type="submit" className={styles.newsletterButton}>
                Subscribe
              </button>
            </form>
            
            {isSubscribed && (
              <p className={styles.successMessage}>✓ Thanks for subscribing!</p>
            )}
            
            <p className={styles.newsletterDisclaimer}>
              By subscribing, you agree to our Privacy Policy and consent to receive updates
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
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
