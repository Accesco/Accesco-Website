'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './landing.module.css';

export default function InstaStyleLanding() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

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

  // Brands data
  const brands = ['Zara', 'H&M', 'Nike', 'Adidas', 'Levi\'s', 'Puma', 'Forever 21', 'Mango', 'Gucci', 'Versace'];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <div className={styles.landingPage}>
      {/* Announcement Bar */}
      <div className={styles.announcementBar}>
        <p>🎉 New Customer? Get 30% OFF on your first order! Use code: WELCOME30</p>
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
            <span>⚡</span>
            <span>15-20 Min Delivery</span>
          </div>
          
          <h1 className={styles.heroTitle}>
            Fashion at Lightning Speed
          </h1>
          
          <p className={styles.heroSubtitle}>
            Discover the latest trends and get them delivered to your doorstep in just 15-20 minutes. 
            Try before you buy, shop sustainably, and express yourself.
          </p>
          
          <div className={styles.heroButtons}>
            <Link href="/services/instastyle/catalog" className={styles.btnPrimary}>
              Shop Now
            </Link>
            <Link href="/services/instastyle/virtual-tryon" className={styles.btnSecondary}>
              Try Virtual Try-On
            </Link>
          </div>

          {/* Trust Badges */}
          <div className={styles.trustBadges}>
            <div className={styles.trustBadge}>
              <span>✓</span>
              <span>Free Returns</span>
            </div>
            <div className={styles.trustBadge}>
              <span>✓</span>
              <span>Secure Payment</span>
            </div>
            <div className={styles.trustBadge}>
              <span>✓</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className={styles.trending}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Trending Now</h2>
            <Link href="/services/instastyle/catalog" className={styles.viewAll}>
              View All →
            </Link>
          </div>
          
          <div className={styles.trendingGrid}>
            {[1, 2, 3, 4].map((item) => (
              <Link key={item} href={`/services/instastyle/products/${item}`} className={styles.trendingCard}>
                <div className={styles.trendingImage}>
                  <div className={styles.imagePlaceholder}>
                    <span>Product Image</span>
                  </div>
                  <div className={styles.trendingBadge}>Hot</div>
                </div>
                <div className={styles.trendingInfo}>
                  <h3 className={styles.trendingName}>Trending Product {item}</h3>
                  <p className={styles.trendingBrand}>Premium Brand</p>
                  <div className={styles.trendingPrice}>
                    <span className={styles.currentPrice}>₹1,299</span>
                    <span className={styles.originalPrice}>₹2,499</span>
                    <span className={styles.discount}>48% OFF</span>
                  </div>
                  <div className={styles.rating}>
                    <span>⭐ 4.5</span>
                    <span>(2.3k reviews)</span>
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
          <h2 className={styles.sectionTitle}>Why InstaStyle?</h2>
          <p className={styles.sectionSubtitle}>
            Experience fashion shopping like never before with our innovative features
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
              <h3 className={styles.featureTitle}>AI-Powered Styling</h3>
              <p className={styles.featureDescription}>
                Get personalized recommendations based on your style preferences and body type.
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
                See how clothes look on you with our AR-powered virtual fitting room.
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
      <section className={styles.categories}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <p className={styles.sectionSubtitle}>
            Explore our curated collections for every style and occasion
          </p>
          
          <div className={styles.categoriesGrid}>
            <Link href="/services/instastyle/catalog?category=men" className={styles.categoryCard}>
              <div className={styles.categoryImagePlaceholder}>
                <span>Men's Fashion</span>
              </div>
              <div className={styles.categoryOverlay}>
                <h3 className={styles.categoryName}>Men</h3>
                <p className={styles.categoryCount}>2,500+ Items</p>
              </div>
            </Link>

            <Link href="/services/instastyle/catalog?category=women" className={styles.categoryCard}>
              <div className={styles.categoryImagePlaceholder}>
                <span>Women's Fashion</span>
              </div>
              <div className={styles.categoryOverlay}>
                <h3 className={styles.categoryName}>Women</h3>
                <p className={styles.categoryCount}>3,200+ Items</p>
              </div>
            </Link>

            <Link href="/services/instastyle/catalog?category=kids" className={styles.categoryCard}>
              <div className={styles.categoryImagePlaceholder}>
                <span>Kids Fashion</span>
              </div>
              <div className={styles.categoryOverlay}>
                <h3 className={styles.categoryName}>Kids</h3>
                <p className={styles.categoryCount}>1,800+ Items</p>
              </div>
            </Link>

            <Link href="/services/instastyle/catalog?category=accessories" className={styles.categoryCard}>
              <div className={styles.categoryImagePlaceholder}>
                <span>Accessories</span>
              </div>
              <div className={styles.categoryOverlay}>
                <h3 className={styles.categoryName}>Accessories</h3>
                <p className={styles.categoryCount}>1,200+ Items</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
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
                Use our AR technology to see how items look on you before ordering
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
          <h2 className={styles.sectionTitle}>Featured Brands</h2>
          <p className={styles.sectionSubtitle}>
            Shop from your favorite brands
          </p>
          
          <div className={styles.brandsCarousel}>
            <div className={styles.brandsTrack}>
              {[...brands, ...brands, ...brands].map((brand, index) => (
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
            <h2 className={styles.newsletterTitle}>Stay in Style</h2>
            <p className={styles.newsletterDescription}>
              Subscribe to get exclusive deals, style tips, and early access to new collections
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
              Ready to Experience Fast Fashion?
            </h2>
            <p className={styles.ctaDescription}>
              Join thousands of happy customers. Get your favorite styles delivered in 15-20 minutes.
            </p>
            <Link href="/services/instastyle/catalog" className={styles.ctaButton}>
              Start Shopping Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
