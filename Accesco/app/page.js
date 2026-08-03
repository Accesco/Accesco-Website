'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import './homepage.css';
import AccescoHeader from '../components/AccescoHeader';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const AppShowcase = dynamic(() => import('../components/AppShowcase'), { ssr: true });
const XpenseIntro = dynamic(() => import('@/components/XpenseIntro'), { ssr: false });
const AccescoInlineChatbot = dynamic(() => import('@/app/components/AccescoInlineChatbot'), {
  ssr: false,
});

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const scrollRef = useRef(null);
  const deliveryRef = useRef(null);
  const [deliveryVisible, setDeliveryVisible] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      setDeliveryVisible(entry.isIntersecting);
    },
    { threshold: 0.35 }
  );

  if (deliveryRef.current) {
    observer.observe(deliveryRef.current);
  }

  return () => observer.disconnect();
}, []);

  const scroll = (direction) => {
  if (scrollRef.current) {
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth',
    });
  }
};

 return (
  <>
    <AccescoHeader />
      <main>
        {/* ——— Hero Section ——— */}
        <Hero />

        {/* ——— Services Section ——— */}
       <section
  id="services"
>

          <div className="intelligencePosterRow">

  {/* Intelligence Image */}
  <div className="intelligenceSection">
    
    <Image
  src="/images/intelligence-layer.png"
  alt="Accesco Intelligence Layer"
  width={1600}
  height={900}
  className="intelligenceImage"
  sizes="100vw"
  quality={80}
/>
  </div>

  {/* Poster */}
  <div className="postersSectionWrapper">
  
    <div
      className="postersTiltCard"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        e.currentTarget.style.transform =
          `perspective(800px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.03)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
      }}
    >
      <Image
        src="/images/poster-newspaper.jpeg"
        alt="Accesco Living - Something exciting is coming"
        className="postersTiltImg"
        width={800}
        height={1200}
        sizes="(max-width: 768px) 100vw, 340px"
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  </div>

</div>
          <div className="servicesRadialOverlay" />

  <div
    ref={deliveryRef}
    className={`deliveryHeadingFrame ${deliveryVisible ? "is-visible" : ""}`}
  >
<div className="floatingHeroItems">
  <Image src="/images/burger.png" className="popItem popBurger" alt="Burger" width={200} height={200} />
  <Image src="/images/pizza.png" className="popItem popPizza" alt="Pizza" width={200} height={200} />
  <Image src="/images/Grocery.png" className="popItem popGrocery" alt="Grocery Basket" width={200} height={200} />
  <Image src="/images/hoodie.png" className="popItem popHoodie" alt="Hoodie" width={200} height={200} />
  <Image src="/images/salad.png" className="popItem popSalad" alt="Salad" width={200} height={200} />
  <Image src="/images/Jeans.png" className="popItem popJeans" alt="Jeans" width={200} height={200} />
</div>
              <h2 className="deliveryHeadingTitle">
                India solved delivery in 10 minutes.<br />
                <span className="deliveryHeadingSubtitle">
  Nobody solved the household in 10 years.
</span>

              </h2>
              <p className="deliveryHeadingDesc">
                Groceries, food and fashion at your doorstep in minutes — sourced straight from producers, built to circulate, and engineered so the value of everything you buy keeps working for your household — Intelligent Hyperlocal delivery app that fits your life. </p>
            </div>   {/* deliveryHeadingFrame */}
          

            <div className="services-container-wrapper">
              <div className="servicesWrap">
                <button
                  type="button"
                  className="servicesArrow servicesArrowLeft"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    scroll('left');
                  }}
                  aria-label="Previous"
                >
                  ‹
                </button>

                <div ref={scrollRef} id="services-scroll-container" className="services-grid">
                  {/* Card 1: Grokly */}
                  <div className="serviceCardLinkWrap">
                    <div className="service-premium-card grokly-card">
                      <div className="service-card-visual">
                        <Image
  src="/images/grokly-new2.png"
  alt="Grokly Groceries"
  fill
  className="serviceCardVisualImage"
  sizes="(max-width: 768px) 100vw, 340px"
/>
                      </div>
                      <div className="service-icon-circle">
                        <Image src="/images/grokly-icon.png" alt="Grokly" width={40} height={40} className="serviceIconCircleImage" />
                      </div>
                      <div className="service-card-body">
                        <h3 className="service-card-name">Grokly</h3>
                        <p className="service-card-desc">Fresh groceries & curated essentials at your doorstep</p>
                        <Link href="/services/grokly" className="service-card-cta grokly-btn">Shop Groceries</Link>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Swadishtt */}
                  <div className="serviceCardLinkWrap">
                    <div className="service-premium-card swadisht-card">
                      <div className="service-card-visual">
                        <Image
  src="/images/swadisht/swadisht_logo1.JPG"
  alt="Swadishtt Meals"
  fill
  className="serviceCardVisualImage"
  sizes="(max-width: 768px) 100vw, 340px"
/>
                      </div>
                      <div className="service-icon-circle">
                        <Image src="/images/swadisht/swadisht_logo.JPG" alt="Swadishtt" width={40} height={40} className="serviceIconCircleImage" />
                      </div>
                      <div className="service-card-body">
                        <h3 className="service-card-name">Swadishtt</h3>
                        <p className="service-card-desc">Meals made only for you!</p>
                        <Link href="/services/swadisht" className="service-card-cta swadishtt-btn">Order Food</Link>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: InstaStyle */}
                  <div className="serviceCardLinkWrap">
                    <div className="service-premium-card instastyle-card">
                      <div className="service-card-visual">
                        <Image
  src="/images/fashion-new2.png"
  alt="InstaStyle Fashion"
  fill
  className="serviceCardVisualImage"
  sizes="(max-width: 768px) 100vw, 340px"
/>
                      </div>
                      <div className="service-icon-circle">
                        <Image src="/images/instastyle-logo.png" alt="InstaStyle" width={40} height={40} className="serviceIconCircleImage" />
                      </div>
                      <div className="service-card-body">
                        <h3 className="service-card-name">InstaStyle</h3>
                        <p className="service-card-desc">Outfit ready, before you are!</p>
                        <Link
  href="/services/instastyle"
  className="service-card-cta instastyle-btn"
>
  Explore Fashion
</Link>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="servicesArrow servicesArrowRight"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    scroll('right');
                  }}
                  aria-label="Next"
                >
                  ›
                </button>
              </div>
         
      </div>
        </section>
        {/* ——— Xpense Meter Section ——— */}
        <Suspense fallback={<div style={{ height: '800px', background: '#fff2eb' }} />}>
          <XpenseIntro />
        </Suspense>
        {/* ——— Waitlist / App Showcase ——— */}
        <Suspense fallback={<div style={{ height: '600px', background: '#fff2eb' }} />}>
          <AppShowcase />
        </Suspense>

        {/* ——— About Accesco Living (SEO copy) ——— */}
 <section className="about-accesco-section">
  <picture>
    <source
      media="(max-width: 640px)"
      srcSet="/images/final-design-mobile.png"
    />
    <Image
      src="/images/final-design.png"
      alt="Accesco Living"
      className="about-accesco-image"
      width={1200}
      height={800}
      style={{ width: '100%', height: 'auto' }}
    />
  </picture>
</section>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>

     {isClient && <AccescoInlineChatbot />}
      </>
  );
}
