export default function SectionHeader({ eyebrow, title, description, light = false }) {
  return (
    <div className={`section-header ${light ? "section-header-light" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
