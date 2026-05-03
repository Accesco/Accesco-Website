export default function ReportCard({ title, description }) {
  return (
    <article className="info-card">
      <div className="card-icon">↗</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <a href="#contact" className="text-link">Request details</a>
    </article>
  );
}