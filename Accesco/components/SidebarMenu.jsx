'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../app/components/AuthProvider';
import AuthModal from '../app/components/AuthModal';

export default function SidebarMenu({ onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut, signIn } = useAuth();

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(prev => !prev);

  const openAuth = () => {
    if (onLoginClick) onLoginClick();
    else setIsAuthOpen(true);
  };

  const handleAuthSuccess = (userData) => {
    signIn(userData);
    setIsAuthOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
  };

  // Initials for avatar
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '';

  return (
    <>
      <style>{`
        /* ── Top-right nav ── */
        .nav-top-right {
          position: fixed; top: 24px; right: 24px;
          z-index: 10002; display: flex; gap: 10px; align-items: center;
        }
        .nav-top-btn {
          padding: 10px 18px; border-radius: 999px; border: none;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #fff; font-weight: 700; font-size: 13px; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          text-transform: uppercase; letter-spacing: 0.5px;
          transition: all 0.3s ease; white-space: nowrap;
        }
        .nav-top-btn:hover { background: rgba(0,0,0,0.75); }
        .nav-top-btn .btn-label { display: inline; }

        /* Avatar pill shown when logged in */
        .nav-avatar-btn {
          padding: 6px 14px 6px 6px; border-radius: 999px; border: none;
          background: rgba(0,0,0,0.55); backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #fff; font-weight: 700; font-size: 13px; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: all 0.3s ease; white-space: nowrap;
          text-decoration: none;
        }
        .nav-avatar-btn:hover { background: rgba(139,10,20,0.85); }
        .nav-avatar-circle {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #7A0042, #9d0054);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 900; color: #fff; flex-shrink: 0;
        }

        /* ── Sidebar profile card ── */
        .sm-user-card {
          margin: 0 0 24px;
          padding: 16px;
          background: rgba(139,10,20,0.08);
          border: 1px solid rgba(139,10,20,0.15);
          border-radius: 16px;
        }
        .sm-user-card-top {
          display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
        }
        .sm-user-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          background: linear-gradient(135deg, #7A0042, #9d0054);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 900; color: #fff; flex-shrink: 0;
        }
        .sm-user-info { flex: 1; min-width: 0; }
        .sm-user-name {
          font-size: 15px; font-weight: 800; color: #fff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sm-user-phone {
          font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 2px;
        }
        .sm-user-email {
          font-size: 11px; color: rgba(255,255,255,0.4);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sm-signout-btn {
          width: 100%; padding: 8px;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px; color: rgba(255,255,255,0.65);
          font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
          text-transform: uppercase; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.2s;
        }
        .sm-signout-btn:hover { background: rgba(255,255,255,0.14); color: #fff; }

        /* Login prompt in sidebar */
        .sm-login-card {
          margin: 0 0 24px; padding: 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; text-align: center;
        }
        .sm-login-card p {
          font-size: 13px; color: rgba(255,255,255,0.5);
          margin: 0 0 10px;
        }
        .sm-login-card-btn {
          width: 100%; padding: 10px;
          background: linear-gradient(135deg, #7A0042, #9d0054);
          color: #fff; border: none; border-radius: 10px;
          font-size: 13px; font-weight: 800; letter-spacing: 0.5px;
          text-transform: uppercase; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.2s;
        }
        .sm-login-card-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        @media (max-width: 480px) {
          .nav-top-right { top: 16px; right: 14px; gap: 8px; }
          .nav-top-btn { padding: 10px; width: 40px; height: 40px; justify-content: center; }
          .nav-top-btn .btn-label { display: none; }
          .nav-avatar-btn .btn-label { display: none; }
          .nav-avatar-btn { padding: 6px; }
        }
      `}</style>

      {/* ── Top-right nav ── */}
      <div className="nav-top-right">
        <button className="nav-top-btn">
          <i className="ri-map-pin-line"></i>
          <span className="btn-label">LOCATION</span>
        </button>

        {user ? (
          <Link href="/profile" className="nav-avatar-btn">
            <div className="nav-avatar-circle">{initials}</div>
            <span className="btn-label">{user.name.split(' ')[0]}</span>
          </Link>
        ) : (
          <button className="nav-top-btn" onClick={openAuth}>
            <i className="ri-user-line"></i>
            <span className="btn-label">LOGIN</span>
          </button>
        )}
      </div>

      {/* ── Hamburger Toggle ── */}
      <button
        className={`sm-toggle-custom ${isOpen ? 'menu-open' : ''}`}
        onClick={toggleMenu}
        style={{ width: 'fit-content' }}
      >
        <div className="sm-icon-custom">
          <div className="sm-line line-1"></div>
          <div className="sm-line line-2"></div>
          <div className="sm-line line-3"></div>
        </div>
        <span>{isOpen ? 'CLOSE' : 'MENU'}</span>
      </button>

      {isOpen && <div className="sidebar-backdrop" onClick={toggleMenu} />}

      {/* ── Sidebar Panel ── */}
      <aside className={`staggered-menu-panel ${isOpen ? 'open' : ''}`}>
        <div className="sm-panel-inner">

          {/* User card or login prompt */}
          {user ? (
            <div className="sm-user-card">
              <div className="sm-user-card-top">
                <div className="sm-user-avatar">{initials}</div>
                <div className="sm-user-info">
                  <div className="sm-user-name">{user.name}</div>
                  <div className="sm-user-phone">{user.phone}</div>
                  {user.email && <div className="sm-user-email">{user.email}</div>}
                </div>
              </div>
              <button className="sm-signout-btn" onClick={handleSignOut}>
                <i className="ri-logout-box-r-line"></i> Sign Out
              </button>
            </div>
          ) : (
            <div className="sm-login-card">
              <p>Sign in to access your profile</p>
              <button className="sm-login-card-btn" onClick={() => { setIsOpen(false); openAuth(); }}>
                <i className="ri-user-line"></i> Login / Sign Up
              </button>
            </div>
          )}

          <ul className="sm-panel-list">
            <li><Link href="/#home" className="sm-panel-item" onClick={toggleMenu}>Home</Link></li>
            <li><Link href="/#services" className="sm-panel-item" onClick={toggleMenu}>Services</Link></li>
            <li><Link href="/about" className="sm-panel-item" onClick={toggleMenu}>About</Link></li>
            <li><Link href="/qtcvideos" className="sm-panel-item" onClick={toggleMenu}>QTC Videos</Link></li>
            <li><Link href="/partner" className="sm-panel-item" onClick={toggleMenu}>Partner with Us</Link></li>
            <li><Link href="/#contact" className="sm-panel-item" onClick={toggleMenu}>Contact</Link></li>
            <li><Link href="/profile" className="sm-panel-item" onClick={toggleMenu}>Profile</Link></li>
          </ul>

          <div className="sm-preferences">
            <h3 className="sm-preferences-title">YOUR PREFERENCES</h3>
            <ul className="sm-panel-list sm-preferences-list">
              <li><Link href="#veg-mode" className="sm-panel-item sm-pref-item" onClick={toggleMenu}>Veg Mode</Link></li>
              <li><Link href="#healthy-mode" className="sm-panel-item sm-pref-item" onClick={toggleMenu}>Healthy Mode</Link></li>
              <li><Link href="#health-passport" className="sm-panel-item sm-pref-item" onClick={toggleMenu}>Health Passport</Link></li>
            </ul>
          </div>

          <div className="sm-socials">
            <h3>Follow Accesco</h3>
            <div className="sm-social-icons">
              <a href="https://www.instagram.com/accescoliving" target="_blank" rel="noopener noreferrer"><i className="ri-instagram-line"></i></a>
              <a href="https://www.linkedin.com/company/acceso-living/" target="_blank" rel="noopener noreferrer"><i className="ri-linkedin-box-line"></i></a>
              <a href="https://x.com/accesco_living" target="_blank" rel="noopener noreferrer"><i className="ri-twitter-x-line"></i></a>
              <a href="https://www.facebook.com/accescoliving" target="_blank" rel="noopener noreferrer"><i className="ri-facebook-box-line"></i></a>
              <a href="https://www.youtube.com/@accescoliving" target="_blank" rel="noopener noreferrer"><i className="ri-youtube-line"></i></a>
              <a href="https://www.threads.net/@accescoliving" target="_blank" rel="noopener noreferrer"><i className="ri-threads-line"></i></a>
            </div>
          </div>
        </div>
      </aside>

      {/* Auth Modal — self-contained here */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
