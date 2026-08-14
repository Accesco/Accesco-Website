import Image from "next/image";
 

const footerSections = [
  {
    title: "Shop",
    links: [
      { label: "Fruits & Vegetables", href: "/services/grokly/category/vegetables-fruits" },
      { label: "Dairy & Eggs", href: "/services/grokly/category/dairy-breakfast" },
      { label: "Grains & Pulses", href: "/services/grokly/category/atta-rice-dal" },
      { label: "Oils & Masalas", href: "/services/grokly/category/masala-oil" },
      { label: "Snacks & Beverages", href: "/services/grokly/category/bakery-biscuits" },
      { label: "Frozen & Ready-to-Eat", href: "/services/grokly/category/instant-frozen" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Farms", href: "#" },
      { label: "Press & Media", href: "/press" },
      { label: "Blogs", href: "/blogs" },
      { label: "Careers", href: "/careers" },
      { label: "Investor Relations", href: "/investor-relations" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help & Support", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Referral Program", href: "/referral" },
      { label: "Accesco Library", href: "/accesco-library" },
      { label: "Delivery Partner App", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund & Cancellation", href: "/refund" },
      { label: "Partner with Us", href: "/partner" },
    ],
  },
];

const socialLinks = [
  {
    label: "Instagram",
    icon: "ri-instagram-line",
    href: "https://www.instagram.com/accescostore?igsh=MWNmOG43Mjl2c3c5cQ==",
  },
  {
    label: "Facebook",
    icon: "ri-facebook-fill",
    href: "https://www.facebook.com/share/1bW8rRTYvp/?mibextid=wwXIfr",
  },
  {
    label: "X",
    icon: "ri-twitter-x-line",
    href: "https://x.com/Accesco_Living",
  },
  {
    label: "YouTube",
    icon: "ri-youtube-fill",
    href: "https://youtube.com/@accescoliving?si=Xzk9m4vzZqW6-lje",
  },
];

export default function GroklyFooter() {
  return (
    <footer className="grokly-footer">
      <div className="grokly-footer-container">
        <div className="grokly-footer-main">
          <div className="grokly-footer-brand">
            <a
              href="#"
              className="grokly-footer-logo"
              aria-label="Grokly home"
            >
 <span className="grokly-footer-logo-box">
  <Image
    src="/images/grokly-icon.png"
    alt="Grokly logo"
    width={48}
    height={48}
    className="grokly-footer-logo-image"
  />
</span>

<span className="grokly-footer-logo-text">
  Grokly
</span>
            </a>

            <p className="grokly-footer-description">
              Farm-fresh essentials sourced directly from Karnataka farms.
              No middlemen. Full traceability.
            </p>

            <div className="grokly-footer-socials">
              {socialLinks.map((social) => (
               <a
  key={social.label}
  href={social.href}
  className="grokly-footer-social-link"
  aria-label={social.label}
>
                  <i className={social.icon} />
                </a>
              ))}
            </div>

            <div className="grokly-footer-apps">
              <a
                href="#"
                className="grokly-footer-app-button"
                aria-label="Get it on Google Play"
              >
                <i className="ri-google-play-fill" />

                <span className="grokly-footer-app-text">
                  <small>GET IT ON</small>
                  <strong>Google Play</strong>
                </span>
              </a>

              <a
                href="#"
                className="grokly-footer-app-button"
                aria-label="Download on the App Store"
              >
                <i className="ri-apple-fill" />

                <span className="grokly-footer-app-text">
                  <small>Download on the</small>
                  <strong>App Store</strong>
                </span>
              </a>
            </div>
          </div>

          <div className="grokly-footer-links">
            {footerSections.map((section) => (
              <div
                key={section.title}
                className="grokly-footer-column"
              >
                <h3 className="grokly-footer-heading">
                  {section.title}
                </h3>

                <ul className="grokly-footer-list">
                {section.links.map((link) => (
  <li key={link.label}>
    <a href={link.href}>{link.label}</a>
  </li>
))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="grokly-footer-divider" />

<div className="grokly-footer-bottom">
  <p className="grokly-footer-location">
    Bengaluru, Karnataka • India
  </p>

  <p className="grokly-footer-copyright">
    © 2026 Grokly by Accesco Living. All rights reserved.
  </p>

  <div
    className="grokly-footer-bottom-spacer"
    aria-hidden="true"
  />
</div>
      </div>
    </footer>
  );
}