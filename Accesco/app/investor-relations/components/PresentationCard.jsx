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
import Image from 'next/image';

export default function PresentationCard({ title, href, cover }) {
  const coverSrc = cover?.src || '/images/corporate-deck-cover.png';
  const coverWidth = cover?.width || 1742;
  const coverHeight = cover?.height || 931;

  return (
    <article className="presentation-card deck-card">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="deck-link"
      >
        <div className="deck-preview-wrapper">
          <Image
            src={coverSrc}
            alt={`${title} preview`}
            className="deck-cover"
            width={coverWidth}
            height={coverHeight}
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