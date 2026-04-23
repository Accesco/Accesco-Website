'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './FAQSection.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const faqData = [
  {
    category: "Brand & Concept Understanding",
    questions: [
      { q: "What is Accesco Living?", a: "Accesco Living is an intelligent commerce ecosystem built for urban Indian households. It combines grocery, food, fashion, healthcare, and dining into one unified super-app powered by AI-driven budget intelligence and a circular logistics model." },
      { q: "How is Accesco Living different from Zepto or Blinkit?", a: "Unlike single-category apps, Accesco Living offers a multi-vertical super-app experience connected through Xpense Meter, a salary-linked budget intelligence layer." },
      { q: "What problem does Accesco Living solve?", a: "It eliminates app fatigue by consolidating household commerce needs into one platform, helping users make smarter spending decisions through real-time tracking." },
      { q: "What is 'Intelligent Commerce'?", a: "AI-powered commerce that learns household patterns, anticipates needs, and tracks budgets against salary cycles." },
      { q: "Is Accesco Living a super app?", a: "Yes. It combines quick commerce, food delivery, fashion, pharmacy, and analytics under a single integrated platform." },
      { q: "Who should use Accesco Living?", a: "Salaried urban professionals in Tier 1 and Tier 2 cities managing multi-category household spending." },
      { q: "What is the vision?", a: "A future where every household's daily consumption is managed intelligently by one platform respecting wallet and time." },
    ]
  },
  {
    category: "Grokly — Grocery & Essentials",
    questions: [
      { q: "What is Grokly?", a: "Grokly is the smart grocery arm offering fast delivery of staples and fresh produce personalised to consumption patterns." },
      { q: "Does Grokly offer 10-minute delivery?", a: "Yes, our infrastructure is designed for delivery within minutes through micro dark stores." },
      { q: "How does it predict patterns?", a: "AI analyses order history and seasonal trends to suggest replenishments before you run out." },
      { q: "Are prices competitive?", a: "Direct-to-producer sourcing minimizes costs, matching or beating local kirana stores." },
    ]
  },
  {
    category: "LocalMeds — Healthcare Layer",
    questions: [
      { q: "What is LocalMeds?", a: "A pharmacy vertical enabling fast delivery of medicines and wellness products from verified local pharmacies." },
      { q: "Do I need a prescription?", a: "Prescription medicines require a valid upload at checkout. OTC products can be ordered without one." },
      { q: "How fast is delivery?", a: "We leverage our quick commerce infrastructure to prioritise urgent healthcare needs." },
    ]
  },
  {
    category: "Swadishtt & DineX — Food & Dining",
    questions: [
      { q: "What is Swadishtt?", a: "A food vertical offering curated delivery and a network of cafes aligned with your lifestyle." },
      { q: "What is DineX?", a: "A discovery and reservation vertical helping users find and book curated restaurant outings." },
      { q: "Can I order food and groceries together?", a: "Yes, our unified cart allows combining orders from different verticals in a single checkout." },
    ]
  },
  {
    category: "Instastyle — Fashion & Lifestyle",
    questions: [
      { q: "What is Instastyle?", a: "An instant fashion vertical bringing quick commerce speed to curated clothing and accessories." },
      { q: "How does it curate outfits?", a: "AI uses your style profile and occasion context to surface personal recommendations." },
    ]
  },
  {
    category: "Reverse Commerce & Sustainability",
    questions: [
      { q: "What is reverse commerce?", a: "A circular logistics model where delivery partners bring back used packaging and recyclables from your home." },
      { q: "Are there rewards for returning packaging?", a: "Yes, users earn reward points or credits for every return, incentivising sustainable actions." },
    ]
  },
  {
    category: "Supply Chain & Pricing",
    questions: [
      { q: "What is direct sourcing?", a: "Procuring products directly from farmers and producers to ensure freshness and lower prices." },
      { q: "Does Accesco work with Indian farmers?", a: "Yes, through our FarmChain initiative, we source ethically and ensure fair pricing." },
    ]
  },
  {
    category: "User Experience & Smart Commerce",
    questions: [
      { q: "How does AI personalize my shopping?", a: "By analysing purchase history and budget cycles to deliver hyper-relevant recommendations." },
      { q: "How do I contact support?", a: "Via in-app chat or call-back options for order issues, refunds, or account queries." },
    ]
  }
];

export default function FAQSection() {
  // Only one topic open at a time as requested
  const [openCategory, setOpenCategory] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleCategory = (index) => {
    setOpenCategory(openCategory === index ? null : index);
    setOpenQuestion(null);
    // Refresh ScrollTrigger because height changed
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400); // Wait for transition to finish
  };

  const sectionRef = useRef(null);
  const sideHeaderRef = useRef(null);

  useEffect(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 960px)", () => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80px",
        end: "bottom bottom",
        pin: sideHeaderRef.current,
        pinSpacing: false,
        scrub: true,
        invalidateOnRefresh: true,
      });
    });

    return () => mm.revert();
  }, []);

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenQuestion(openQuestion === key ? null : key);
  };

  return (
    <section className="faq-section" id="faq" ref={sectionRef}>
      <div className="faq-container">
        <div className="faq-grid">

          {/* ── Left: sticky header (Pinned via GSAP) ── */}
          <div className="faq-side-header" ref={sideHeaderRef}>
            <div className="ac-chip ac-chip-maroon" style={{ marginBottom: '24px' }}>
              Knowledge Hub
            </div>
            <h2 style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800, fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: '#1A0A0F', letterSpacing: '-0.04em',
              lineHeight: 1.05, marginBottom: '24px'
            }}>
              Curated<br />
              <span className="ac-gradient-text">Answers</span>
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.1rem', color: '#6B5B65',
              lineHeight: 1.7, maxWidth: '400px'
            }}>
              Everything you need to know about India's first intelligent commerce ecosystem.
            </p>

            {/* Category progress dots */}
            <div className="faq-progress-wrap">
              {faqData.map((cat, i) => (
                <button
                  key={i}
                  className={`faq-progress-dot ${openCategory === i ? 'active' : ''}`}
                  onClick={() => toggleCategory(i)}
                  title={cat.category}
                  aria-label={cat.category}
                />
              ))}
            </div>
          </div>

          {/* ── Right: accordion ── */}
          <div className="faq-accordion-wrap">
            {faqData.map((category, catIdx) => {
              const isCatOpen = openCategory === catIdx;
              return (
                <div key={catIdx} className={`faq-cat-group ${isCatOpen ? 'cat-open' : ''}`}>
                  <button
                    className="faq-cat-trigger"
                    onClick={() => toggleCategory(catIdx)}
                  >
                    <span className="cat-num">{String(catIdx + 1).padStart(2, '0')}</span>
                    <span className="cat-name">{category.category}</span>
                    <div className="cat-arrow">↓</div>
                  </button>

                <div className="faq-questions-dropdown">
                  <div className="faq-questions-list">
                    {category.questions.map((item, qIdx) => {
                      const isOpen = openQuestion === `${catIdx}-${qIdx}`;
                      return (
                        <div key={qIdx} className={`faq-row ${isOpen ? 'active' : ''}`}>
                          <button
                            className="faq-q-trigger"
                            onClick={() => toggleQuestion(catIdx, qIdx)}
                          >
                            <span>{item.q}</span>
                            <div className="faq-q-plus">
                              <div className="plus-line" />
                              <div className="plus-line vertical" />
                            </div>
                          </button>
                          <div className="faq-a-panel">
                            <div className="faq-a-inner">
                              <p>{item.a}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
