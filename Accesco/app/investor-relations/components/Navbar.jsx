export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a href="/" className="brand" aria-label="Accesco home">
          {/* Logo Instructions:
             1. Create a folder called "public" inside your Next.js project.
             2. Place your logo file inside it as "logo.png".
             3. Supported formats: PNG, JPG, SVG.
             4. If the file name changes, update the src path below accordingly.
          */}
          <img src="/logo.png" alt="Company Logo" className="logo" />
          <span>Accesco Living</span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#financial-reports">Financial Reports</a>
          <a href="#presentations">Presentations</a>
          <a href="#governance">Governance</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}