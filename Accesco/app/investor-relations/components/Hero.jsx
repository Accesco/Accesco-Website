export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-content">
        <div className="hero-copy">
          <span className="eyebrow">Investor Relations</span>
          <h1>Building Long-Term Value for Stakeholders</h1>
          <p>
            Transparent disclosures, disciplined growth and a commitment to creating enduring value for shareholders, customers and communities.
          </p>
          <a href="/pdfs/investor-presentation-q1.pdf" target="_blank" rel="noopener noreferrer" className="primary-button">
            View Investor Deck
          </a>
        </div>

        <div className="hero-card" aria-label="Company highlights">
          <div className="hero-card-topline">FY 2025 Highlights</div>
          <div className="hero-stat">
            <strong>24%</strong>
            <span>Revenue Growth</span>
          </div>
          <div className="hero-stat">
            <strong>18%</strong>
            <span>EBITDA Margin</span>
          </div>
          <div className="hero-stat">
            <strong>AAA</strong>
            <span>Governance Focus</span>
          </div>
        </div>
      </div>
    </section>
  );
}

