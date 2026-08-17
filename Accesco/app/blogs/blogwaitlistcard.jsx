import "./blogwaitlistcard.css";

function blogwaitlistcard() {
  return (
    <section className="waitlist-card">
      <div className="waitlist-content">
        <h2 className="waitlist-title">
          Experience India's Everyday Living App
        </h2>

        <p className="waitlist-description">
          Be among the first to explore Grokly, Swadisht & InstaStyle before the Bengaluru launch.
        </p>
      </div>

      <div className="waitlist-actions">
        <button className="waitlist-primary-button">
          Join Waitlist <span>→</span>
        </button>

        <button className="waitlist-secondary-button">
          Visit Website <span>↗</span>
        </button>
      </div>
    </section>
  );
}

export { blogwaitlistcard as default };
