export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>Company Name</h3>
          <p>Corporate Office, Bengaluru, Karnataka, India</p>
        </div>

        <div>
          <h4>Investor Relations</h4>
          <a href="mailto:investors@company.com">investors@company.com</a>
        </div>

        <div>
          <h4>Social</h4>
          <div className="social-links">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://www.x.com" target="_blank" rel="noopener noreferrer">X</a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {year} Company Name. All rights reserved.</p>
      </div>
    </footer>
  );
}
