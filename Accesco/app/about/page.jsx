'use client';

import AccescoHeader from '../../components/AccescoHeader';
import Footer from '../../components/Footer';
import { AccescoHero } from '../../components/HeroBanners';
import './about.css';

export default function AboutPage() {
  return (
    <>
      <AccescoHeader />
      <main className="about-page">
        
        {/* Premium Brand Hero — replaces old image-based hero */}
        <AccescoHero />

        {/* Mission Statement */}
        <section className="about-mission-section">
          <div className="about-container">
            <div className="mission-content">
              <h2 className="mission-title">
                Making everyday commerce transparent, intelligent, and circular
              </h2>
              <p className="mission-description">
                For the household, the local producer, and the planet — simultaneously.
              </p>
            </div>
            
            {/* Mission Image */}
            <div className="mission-image">
              <img src="/images/about-mission.PNG" alt="Our Mission - Transparent and Circular Commerce" />
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="about-content-section">
          <div className="about-container">
            <div className="content-grid">
              <div className="content-sidebar">
                <h2 className="section-heading">The problem we're solving</h2>
              </div>
              <div className="content-main">
                <div className="content-text">
                  <p>
                    Every day, the average urban Indian household opens five different apps to manage 
                    daily needs — one for groceries, one for food, one for fashion, one for medicines, 
                    one for dining. Five separate carts. Five different budgets. Five delivery windows. 
                    Zero coordination. Zero intelligence.
                  </p>
                  <p>
                    The average Bengaluru household spends approximately ₹17,500 per month across these 
                    fragmented platforms — on services that don't know their name, don't remember what 
                    they bought last week, and have never once predicted what they would need tomorrow.
                  </p>
                  
                  {/* Problem Illustration */}
                  <div className="content-image">
                    <img src="/images/about-problem.jpeg" alt="The Problem We're Solving" />
                  </div>
                  
                  <p>
                    At the same time, a Karnataka farmer harvests tomatoes at 4 AM and sells them at 
                    the mandi for ₹6 per kilogram — while the same tomatoes arrive at a Bengaluru 
                    household for ₹40, with ₹34 collected by six middlemen who added no value to the 
                    produce and no traceability to the journey.
                  </p>
                  <p className="highlight-text">
                    Accesco Living is the correction to both of these problems simultaneously.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ventures Section */}
        <section className="about-ventures-section">
          <div className="about-container">
            <div className="ventures-header">
              <h2 className="section-heading-center">Three ventures. One ecosystem.</h2>
            </div>
            <div className="ventures-grid">
              <div className="venture-card">
                <div className="venture-number">01</div>
                <h3 className="venture-title">Grokly</h3>
                <p className="venture-description">
                  Daily essentials and grocery delivery, sourced directly from Karnataka farms through 
                  our FarmChain network. Every product carries a live QR identity — producer name, 
                  source region, harvest date and quality certificate. Also houses LocalMeds, our 
                  pharmaceutical and health management sub-category.
                </p>
              </div>
              
              <div className="venture-card">
                <div className="venture-number">02</div>
                <h3 className="venture-title">Swadishtt</h3>
                <p className="venture-description">
                  Food delivery and cloud kitchen platform, powered by Swadishtt Cafe micro-kitchens 
                  inside our dark stores. Also powers DineX — smart savings dining, assured table 
                  reservations and hosted dining events.
                </p>
              </div>
              
              <div className="venture-card">
                <div className="venture-number">03</div>
                <h3 className="venture-title">InstaStyle</h3>
                <p className="venture-description">
                  Instant fashion delivery in 15–20 minutes, a trial-at-doorstep model, virtual try-on, 
                  a thrift marketplace, and a full Reverse Fashion Loop that collects worn garments and 
                  converts them into circular value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="about-content-section dark-section">
          <div className="about-container">
            <div className="content-grid">
              <div className="content-sidebar">
                <h2 className="section-heading">What makes us different</h2>
              </div>
              <div className="content-main">
                <div className="features-list">
                  <div className="feature-item-block">
                    <h3>FarmChain Direct Sourcing</h3>
                    <p>
                      We operate FarmChain, a direct sourcing network that removes six commercial 
                      middlemen between Karnataka farms and Bengaluru households. Farmers earn 2-3× 
                      what they receive at the mandi. Consumers pay 20-30% less than on other platforms.
                    </p>
                  </div>
                  
                  <div className="feature-item-block">
                    <h3>Household Intelligence Layer</h3>
                    <p>
                      Our platform is not a catalogue. It's a learning system. Through My Home Profile, 
                      it absorbs your household size, dietary habits, cooking frequency, monthly budget 
                      and consumption patterns. Over 60 days, it reaches 85% prediction accuracy on what 
                      you need before you need it.
                    </p>
                  </div>
                  
                  <div className="feature-item-block">
                    <h3>Budget-First Commerce</h3>
                    <p>
                      Every product across every venture is tagged in real time against your household's 
                      selected budget. For the first time in Indian commerce, financial clarity is a 
                      default — not a filter.
                    </p>
                  </div>
                  
                  <div className="feature-item-block">
                    <h3>Reverse Commerce Loop</h3>
                    <p>
                      Every delivery creates a return flow of value. Packaging collected. Carbon credits 
                      earned. Grade B FarmChain produce routed to cloud kitchens instead of waste. Organic 
                      material returned to farms as compost. Sustainability as a commercial operating model 
                      — not a marketing claim.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

   

        {/* Principles Section */}
        <section className="about-principles-section">
          <div className="about-container">
            <h2 className="section-heading-center">Built on three principles</h2>
            <div className="principles-grid">
              <div className="principle-card">
                <h3>Trusted</h3>
                <p>
                  Every product verified at source. Every price fair and published. Every delivery 
                  traceable from farm to door — with live QR identity on every FarmChain product.
                </p>
              </div>
              
              <div className="principle-card">
                <h3>Intelligent</h3>
                <p>
                  A household intelligence layer that learns how you live, predicts what you need, 
                  and makes every order smarter than the last — not just faster.
                </p>
              </div>
              
              <div className="principle-card">
                <h3>Circular</h3>
                <p>
                  Every delivery creates return value. No produce wasted. No packaging discarded. 
                  Every transaction closes a loop that earns money for every participant in the chain.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="about-team-section">
          <div className="about-container">
            <h2 className="section-heading-center">Our founding team</h2>

            {/* Founders photo */}
            <div style={{
              maxWidth: 960,
              margin: '0 auto 56px',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 24px 72px rgba(122,0,66,0.15)',
              position: 'relative',
            }}>
              <img
                src="/images/foundersteam.jpg"
                alt="Accesco Living founding team"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover',
                }}
              />
              {/* Subtle bottom gradient for branding */}
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: 80,
                background: 'linear-gradient(to top, rgba(26,10,15,0.55), transparent)',
                pointerEvents: 'none',
              }} />
            </div>


          </div>
        </section>

        {/* Vision Section */}
        <section className="about-vision-section">
          <div className="about-container">
            <div className="vision-content">
              <h2 className="vision-title">
                India's most trusted daily-life commerce infrastructure
              </h2>
              <p className="vision-description">
                We believe access to products is solved. Clarity in consumption is not. We believe 
                the farmer who grows your food deserves to know who ate it — and to be paid fairly. 
                We believe the household of tomorrow doesn't open five apps. It trusts one ecosystem 
                that already knows.
              </p>
              <div className="vision-cta-buttons">
                <a href="/contact" className="vision-cta-button primary">Get in Touch</a>
                <a href="/partner" className="vision-cta-button secondary">Become a Partner</a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
