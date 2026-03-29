'use client';


import SidebarMenu from '../../components/SidebarMenu';
import Footer from '../../components/Footer';
import './about.css';

export default function AboutPage() {

  return (
    <>
      <SidebarMenu />
      <main className="about-main">

        {/* Hero */}
        <section className="about-hero">
          <div className="about-hero-noise" />
          <div className="about-hero-glow" />
          <div className="about-hero-content">
            <div className="about-hero-brand">
              <img
                src="/images/accesco_white.png"
                alt="Accesco Living Logo"
                className="about-hero-logo"
              />
              <span className="about-hero-company">Accesco Living</span>
            </div>
            <p className="about-eyebrow">ISO 9001:2015 Certified · Founded 2025 · Bengaluru, India</p>
            <h1 className="about-hero-title">
              India's first intelligent<br />
              <span className="about-hero-accent">circular commerce ecosystem.</span>
            </h1>
            <p className="about-hero-sub">
              One app. One cart. One ecosystem that learns how your household lives —
              and makes every order smarter than the last.
            </p>
          </div>
          <div className="about-scroll-hint">
            <span>Scroll</span>
            <div className="about-scroll-line" />
          </div>
        </section>

        {/* Belief statement */}
        <section className="about-belief">
          <div className="about-belief-inner">
            <div className="about-belief-label">Our Mission</div>
            <blockquote className="about-belief-quote">
              To make everyday commerce transparent, intelligent, affordable and circular —
              for the household, the local producer and the planet simultaneously.
            </blockquote>
          </div>
        </section>

        {/* The Problem */}
        <section className="about-story">
          <div className="about-container">
            <div className="about-story-grid">
              <div className="about-story-left">
                <h2 className="about-section-title">The problem<br />we are solving</h2>
                <div className="about-title-bar" />
              </div>
              <div className="about-story-right">
                <p>
                  Every day, the average urban Indian household opens five different apps to manage
                  daily needs — one for groceries, one for food, one for fashion, one for medicines,
                  one for dining. Five separate carts. Five different budgets. Five delivery windows.
                  Zero coordination. Zero intelligence.
                </p>
                <p>
                  The average Bengaluru household spends approximately{' '}
                  <em>Rs 17,500 per month</em> across these fragmented platforms — on services that
                  do not know their name, do not remember what they bought last week, and have never
                  once predicted what they would need tomorrow.
                </p>
                <p>
                  At the same time, a Karnataka farmer harvests tomatoes at 4 AM and sells them at
                  the mandi for Rs 6 per kilogram — while the same tomatoes arrive at a Bengaluru
                  household for Rs 40, with Rs 34 collected by six middlemen who added no value to
                  the produce and no traceability to the journey.
                </p>
                <p>
                  <em>Accesco Living is the correction to both of these problems simultaneously.</em>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We've Built */}
        <section className="about-pillars">
          <div className="about-container">
            <p className="about-pillar-overline">What we have built</p>
            <h2 className="about-section-title about-section-title--center">
              Three ventures. One ecosystem.
            </h2>
            <div className="about-pillars-grid">
              <div className="about-pillar-card">
                <div className="about-pillar-number">01</div>
                <div className="about-pillar-icon">◈</div>
                <h3>Grokly</h3>
                <p>
                  Daily essentials and grocery delivery, sourced directly from Karnataka farms
                  through our FarmChain network. Every product carries a live QR identity — producer
                  name, source region, harvest date and quality certificate. Also houses{' '}
                  <em style={{color:'#c084d0'}}>LocalMeds</em>, our pharmaceutical and health
                  management sub-category.
                </p>
              </div>
              <div className="about-pillar-card">
                <div className="about-pillar-number">02</div>
                <div className="about-pillar-icon">⬡</div>
                <h3>Swadishtt</h3>
                <p>
                  Food delivery and cloud kitchen platform, powered by Swadishtt Cafe micro-kitchens
                  inside our dark stores. Also powers{' '}
                  <em style={{color:'#c084d0'}}>DineX</em> — smart savings dining, assured table
                  reservations and hosted dining events.
                </p>
              </div>
              <div className="about-pillar-card">
                <div className="about-pillar-number">03</div>
                <div className="about-pillar-icon">◎</div>
                <h3>InstaStyle</h3>
                <p>
                  Instant fashion delivery in 15–20 minutes, a trial-at-doorstep model, virtual
                  try-on, a thrift marketplace, and a full Reverse Fashion Loop that collects worn
                  garments and converts them into circular value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="about-story" style={{background:'#111013', borderTop:'1px solid #1e1a22'}}>
          <div className="about-container">
            <div className="about-story-grid">
              <div className="about-story-left">
                <h2 className="about-section-title">What makes<br />us different</h2>
                <div className="about-title-bar" />
              </div>
              <div className="about-story-right">
                <p>
                  <em>FarmChain Direct Sourcing</em> — We operate FarmChain, a direct sourcing
                  network that removes six commercial middlemen between Karnataka farms and Bengaluru
                  households. Farmers in Kolar, Chikkaballapur, Hassan, Bidar and beyond earn two to
                  three times what they receive at the mandi. Consumers pay 20–30% less than on other
                  platforms.
                </p>
                <p>
                  <em>Household Intelligence Layer</em> — Our platform is not a catalogue. It is a
                  learning system. Through My Home Profile, it absorbs your household size, dietary
                  habits, cooking frequency, monthly budget and consumption patterns. Over 60 days, it
                  reaches 85% prediction accuracy on what you need before you need it. One tap
                  confirms your week. You never rebuild the same grocery list again.
                </p>
                <p>
                  <em>Budget-First Commerce</em> — Every product across every venture is tagged in
                  real time against your household's selected budget. For the first time in Indian
                  commerce, financial clarity is a default — not a filter.
                </p>
                <p>
                  <em>Reverse Commerce Loop</em> — Every delivery creates a return flow of value.
                  Packaging collected. Carbon credits earned. Grade B FarmChain produce routed to
                  cloud kitchens instead of waste. Organic material returned to farms as compost.
                  Sustainability as a commercial operating model — not a marketing claim.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Three Pillars */}
        <section className="about-pillars">
          <div className="about-container">
            <p className="about-pillar-overline">What we stand for</p>
            <h2 className="about-section-title about-section-title--center">
              Built on three principles
            </h2>
            <div className="about-pillars-grid">
              <div className="about-pillar-card">
                <div className="about-pillar-number">01</div>
                <div className="about-pillar-icon">◈</div>
                <h3>Trusted</h3>
                <p>
                  Every product verified at source. Every price fair and published. Every delivery
                  traceable from farm to door — with live QR identity on every FarmChain product.
                </p>
              </div>
              <div className="about-pillar-card">
                <div className="about-pillar-number">02</div>
                <div className="about-pillar-icon">⬡</div>
                <h3>Intelligent</h3>
                <p>
                  A household intelligence layer that learns how you live, predicts what you need,
                  and makes every order smarter than the last — not just faster.
                </p>
              </div>
              <div className="about-pillar-card">
                <div className="about-pillar-number">03</div>
                <div className="about-pillar-icon">◎</div>
                <h3>Circular</h3>
                <p>
                  Every delivery creates return value. No produce wasted. No packaging discarded.
                  Every transaction closes a loop that earns money for every participant in the chain.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="about-stats">
          <div className="about-container">
            <div className="about-stats-grid">
              <div className="about-stat">
                <span className="about-stat-value">20+</span>
                <span className="about-stat-label">Team Members</span>
              </div>
              <div className="about-stat-divider" />
              <div className="about-stat">
                <span className="about-stat-value">3</span>
                <span className="about-stat-label">Consumer Ventures</span>
              </div>
              <div className="about-stat-divider" />
              <div className="about-stat">
                <span className="about-stat-value">85%</span>
                <span className="about-stat-label">Prediction Accuracy at 60 days</span>
              </div>
              <div className="about-stat-divider" />
              <div className="about-stat">
                <span className="about-stat-value">6×</span>
                <span className="about-stat-label">Middlemen Removed</span>
              </div>
            </div>
          </div>
        </section>

        {/* Vision band */}
        <section className="about-vision">
          <div className="about-vision-inner">
            <div className="about-vision-tag">Our Vision</div>
            <h2>
              India's most trusted daily-life<br />commerce infrastructure.
            </h2>
            <p>
              We believe access to products is solved. Clarity in consumption is not. We believe
              the farmer who grows your food deserves to know who ate it — and to be paid fairly.
              We believe the household of tomorrow does not open five apps. It trusts one ecosystem
              that already knows.
            </p>
          </div>
        </section>

        {/* Founding Team */}
        <section className="about-story" style={{background:'#0d0d0f'}}>
          <div className="about-container">
            <div style={{textAlign:'center', marginBottom:'64px'}}>
              <p className="about-pillar-overline">The people behind it</p>
              <h2 className="about-section-title about-section-title--center">Our founding team</h2>
            </div>
            <div className="about-pillars-grid" style={{gridTemplateColumns:'repeat(2, 1fr)'}}>
              <div className="about-pillar-card">
                <h3>Argha Sengupta</h3>
                <p style={{color:'#c084d0', fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'12px'}}>
                  Managing Director &amp; CEO
                </p>
                <p>Leads strategy, fundraising and ecosystem partnerships.</p>
              </div>
              <div className="about-pillar-card">
                <h3>Ayushman Saha</h3>
                <p style={{color:'#c084d0', fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'12px'}}>
                  Executive Director &amp; CBO
                </p>
                <p>Leads operations, growth and business development.</p>
              </div>
              <div className="about-pillar-card">
                <h3>Aanushka Saha</h3>
                <p style={{color:'#c084d0', fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'12px'}}>
                  CTO &amp; Co-Founder
                </p>
                <p>Leads technology architecture, product development and the intelligence layer.</p>
              </div>
              <div className="about-pillar-card">
                <h3>Md. Asif</h3>
                <p style={{color:'#c084d0', fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'12px'}}>
                  Chief Operating Officer
                </p>
                <p>Leads supply chain, dark store operations and FarmChain sourcing.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <div className="about-container">
            <div className="about-cta-card">
              <div className="about-cta-glow" />
              <h2>Be part of what comes next.</h2>
              <p>
                Accesco Living is preparing for Beta launch in Bengaluru. Join our waitlist and
                shape the platform before it launches — or speak with us if you believe the next
                wave of Indian commerce will be defined by trust and intelligence, not just speed.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
