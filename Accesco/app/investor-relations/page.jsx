import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SectionHeader from "./components/SectionHeader";
import ReportCard from "./components/ReportCard";
import PresentationCard from "./components/PresentationCard";
import GovernanceCard from "./components/GovernanceCard";
import Footer from "./components/Footer";
const mediaLogos = [
  { name: "Pioneer Entrepreneur", src: "/logos/pioneer-entrepreneur.png" },
  { name: "Fox Story India", src: "/logos/fox-story.png" },
  { name: "Entrepreneur Street", src: "/logos/entrepreneur-street.webp" },
  { name: "Business Pressline", src: "/logos/business-pressline.png" },
  { name: "Orbit Entrepreneur", src: "/logos/orbit-entrepreneur.webp" },
  { name: "Hindustan Metro", src: "/logos/hindustan-metro.jpeg" },
  { name: "The Weekly Mail", src: "/logos/weekly-mail.jpeg" },
  { name: "Achieve Times", src: "/logos/achieve-times.jpeg" },
  { name: "Achieve Times", src: "/logos/Successaga.jpeg" },
    { name: "Buisness Insider Daily", src: "/logos/BID.jpeg" },
  { name: "BBBusinessNews", src: "/logos/BBB.jpeg" },
  { name: "Buisnessscope", src: "/logos/BSC.jpeg" },
  { name: "Express_visionary", src: "/logos/Express_visionary.jpeg" },
];
const ecosystemLogos = [
  { name: "AWS Startups", src: "/logos/aws-startups.png" },
  { name: "India Startup Club", src: "/logos/india-startup-club.png" },
  { name: "NVIDIA Inception Program", src: "/logos/nvidia-inception.png" },
  { name: "Zoho for Startups", src: "/logos/zoho-startups.png" },
  { name: "Google for Startups", src: "/logos/google-startups.png" },
  { name: "Microsoft for Startups", src: "/logos/microsoft-startups.png" },
];

const certificationLogos = [
  { name: "ISO 9001:2015", src: "/logos/iso-9001.png" },
  { name: "ISO 27001:2022", src: "/logos/iso-27001.png" },
];

const reports = [
  {
    title: "Annual Reports",
    description:
      "Access audited annual reports, financial statements and business performance highlights.",
  },
  {
    title: "Quarterly Results",
    description:
      "Review quarterly earnings, investor updates and operational performance summaries.",
  },
  {
    title: "Shareholding Pattern",
    description:
      "View the latest shareholding distribution and regulatory disclosures.",
  },
  {
    title: "Earnings Call Transcripts",
    description:
      "Read management commentary, analyst Q&A and quarterly call transcripts.",
  },
];

const presentations = [
  {
    title: "Presentation",
    href: "/pdfs/Accesco_deck.pdf",
  },
];

const governanceItems = [
  "Board of Directors",
  "ESG",
  "Corporate Policies",
  "Compliance Documents",
];

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />

      <section id="about" className="section about-section">
        <div className="container two-column">
          <div>
            <SectionHeader
              eyebrow="About Us"
              title="A responsible business focused on sustainable growth"
              description="We are committed to transparent communication, disciplined capital allocation and long-term value creation for our stakeholders."
            />
          </div>

          <div className="about-panel">
            <p>
              Our Investor Relations platform provides shareholders, analysts
              and institutional investors with easy access to financial reports,
              presentations, governance documents and key company information.
            </p>

            <div className="metrics-grid">
              <div>
                <strong>10+</strong>
                <span>Years of Growth</span>
              </div>
              <div>
                <strong>₹500 Cr+</strong>
                <span>Revenue Scale</span>
              </div>
              <div>
                <strong>1M+</strong>
                <span>Customers Served</span>
              </div>
            </div>

            <div className="integrity-section">
              <p>We uphold the highest standardsof ethics and transparency across all our operations.</p>
              <a
                href="./pledge.jpeg"
                target="_blank"
                rel="noopener noreferrer"
                className="outline-button"
              > View Integrity Pledge </a>
            </div>
          </div>
        </div>
      </section>
      <section className="section ecosystem-section">
  <div className="container">
    <SectionHeader
      eyebrow="Ecosystem Support"
      title="Supported by Global Startup Ecosystems & Accelerator"
      description="We are supported by leading startup ecosystems, technology platforms and accelerator networks."
    />
    <div className="media-heading">
  Featured In • Media Mentions
</div>
<div className="media-marquee">
  <div className="media-track">
    {[...mediaLogos, ...mediaLogos].map((logo, index) => (
      <div className="media-logo" key={`${logo.name}-${index}`}>
        <img src={logo.src} alt={logo.name} />
      </div>
    ))}
  </div>
</div>
<div className="media-heading">
  Startup Ecosystem • Accelerator Network
</div>
    <div className="logo-marquee">
      <div className="logo-track">
        {[...ecosystemLogos, ...ecosystemLogos].map((logo, index) => (
          <div className="floating-logo" key={`${logo.name}-${index}`}>
            <img src={logo.src} alt={logo.name} />
          </div>
        ))}
      </div>
    </div>

    <div className="certification-box">
      <h3>We are certified with</h3>

      <div className="certification-grid">
        {certificationLogos.map((cert) => (
          <div className="certification-card" key={cert.name}>
            <img src={cert.src} alt={cert.name} />
            <strong>{cert.name}</strong>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      <section id="financial-reports" className="section soft-bg">
        <div className="container">
          <SectionHeader
            eyebrow="Financial Reports"
            title="Timely disclosures and financial performance"
            description="Access key financial and statutory documents in a simple, structured format."
          />

          <div className="card-grid">
            {reports.map((item) => (
              <ReportCard
                key={item.title}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="presentations" className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Presentations"
            title="Investor presentations and business updates"
            description="Download or open investor presentations in PDF format. Links open in a new browser tab."
          />

          <div className="presentation-grid">
            {presentations.map((item) => (
              <PresentationCard
                key={item.title}
                title={item.title}
                href={item.href}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="governance" className="section dark-section">
        <div className="container">
          <SectionHeader
            eyebrow="Governance"
            title="Strong governance and responsible oversight"
            description="Our governance framework is built around transparency, accountability and ethical conduct."
            light
          />

          <div className="governance-grid">
            {governanceItems.map((item) => (
              <GovernanceCard key={item} title={item} />
            ))}
          </div>
          <div className="board-section">
  <h3>Board of Directors</h3>

  <div className="board-grid">
    <div className="board-card">
      <strong>Argha Sengupta</strong>
      <span>Managing Director</span>
    </div>

    <div className="board-card">
      <strong>Ayushman Saha</strong>
      <span>Director II</span>
    </div>
  </div>

  <p className="incorporation-date">
    <strong>Date of Incorporation:</strong> 23/12/2025
  </p>
</div>
          
          <div className="dpiit-section">
  <div className="dpiit-card unified">
    <img src="/logos/startup-india.png" alt="Startup India DPIIT" />

    <div className="dpiit-content">
      <h3>DPIIT-Recognised Startup</h3>

      <p>
        Recognised by Startup India under the Department for Promotion of Industry and Internal Trade (DPIIT), Government of India.
      </p>

      <a
        href="/pdfs/certificate-of-recognition.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="primary-button"
      >
        View Recognition Certificate
      </a>
    </div>
  </div>
</div>
 </div>
      </section>
      <section id="contact" className="section contact-section">
        <div className="container contact-card">
          <div>
            <span className="eyebrow">Contact</span>
            <h2>Investor Relations</h2>
            <p>
              For investor queries, financial information or statutory
              communications, please contact our Investor Relations team.
            </p>
          </div>

          <div className="contact-details">
            <p>
              <strong>Email:</strong> info@accescoliving.com 
            </p>
            <p>
              <strong>Phone:</strong> +919972706940
            </p>
            <p>
              <strong>Address:</strong> Accesco living,Jaladarshini Layout, Bengaluru -560094, Karnataka, India
            </p>
            <p>
  <strong>GSTIN:</strong> 19ABECA4405B1Z6
</p>
<p className="business-card-link">
  <a
    href="/accesco-business-card.pdf"
    target="_blank"
    rel="noopener noreferrer"
  >
    Download Digital Business Card
  </a>
</p>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}