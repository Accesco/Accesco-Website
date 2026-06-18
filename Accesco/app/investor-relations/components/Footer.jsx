export default function Footer() {
  const year = new Date().getFullYear();

  return (
  <footer className="footer">
    <div className="container footer-grid">
      
      <div>
        <h3>Accesco Living</h3>
        <p>Corporate Office, Bengaluru, Karnataka, India</p>
      </div>

      <div>
        <h4>Investor Relations</h4>
        <a href="mailto:investors@accescoliving.com">
          investors@accescoliving.com
        </a>
      </div>

    </div>

    <div className="container footer-bottom">
      <p suppressHydrationWarning>© {year} Accesco Living . All rights reserved.</p>
    </div>
  </footer>
);
}