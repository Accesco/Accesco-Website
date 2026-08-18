import React from 'react';
import './blogs-navabar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">

        {/* Logo */}
        <div className="navbar-brand">
          <img
            src="/images/logo.png"
            alt="Accesco Living"
            className="navbar-logo"
          />

          <span className="brand-name">
            Accesco Living
          </span>
        </div>

        {/* Navigation */}
        <div className="navbar-links">
          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a href="/platforms">Platforms</a>
          <a href="/careers">Careers</a>
          <a href="/press">Press</a>
          <a href="/blogs">Blogs</a>
          <a href="/contact">Contact Us</a>
        </div>

      </div>

      {/* Right button */}
      <button className="waitlist-btn">
        Join Waitlist
      </button>
    </nav>
  );
};

export default Navbar;