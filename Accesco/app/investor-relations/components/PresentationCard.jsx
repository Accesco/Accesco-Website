/*export default function PresentationCard({ title, href }) {
  return (
    <article className="presentation-card">
      <div>
        <span className="pdf-label">PDF</span>
        <h3>{title}</h3>
      </div>
      <a href={href} target="_blank" rel="noopener noreferrer" className="outline-button">
        View Presentation
      </a>
    </article>
  );
}*/
export default function PresentationCard({ title, href }) {
  return (
    <article className="presentation-card deck-card">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="deck-link"
      >
        <div className="deck-preview-wrapper">
          <img
            src="/images/corporate-deck-cover.png"
            alt={`${title} preview`}
            className="deck-cover"
          />

          <div className="deck-overlay">
            <span>View Full Deck</span>
          </div>
        </div>
      </a>

      <h3>{title}</h3>
    </article>
  );
}