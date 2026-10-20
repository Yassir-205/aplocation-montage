import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './PublicNavbar.css';

const NAV_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'Work',       to: '/work' },
  { label: 'Thumbnails', to: '/thumbnails' },
];

export default function PublicNavbar() {
  const [scrolled, setScrolled]  = useState(false);
  const [menuOpen, setMenuOpen]  = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header className="pnav-wrapper">
        <nav className={`pnav${scrolled ? ' scrolled' : ''}`}>
          {/* Brand */}
          <Link to="/" className="pnav-brand" onClick={() => setMenuOpen(false)}>
            <span className="pnav-brand-icon">▶</span>
            <span className="pnav-brand-text">Neditiw<span className="pnav-accent">.</span></span>
          </Link>

          {/* Links */}
          <ul className="pnav-links">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `pnav-link${isActive ? ' active' : ''}`}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Admin CTA */}
          <div className="pnav-actions">
            <button className="btn btn-primary pnav-admin-btn" onClick={() => navigate('/admin')}>
              <i className="ri-dashboard-line" /> Admin
            </button>
            <button
              className={`pnav-hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div className={`pnav-mobile${menuOpen ? ' open' : ''}`}>
        <button className="pnav-mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close">
          <i className="ri-close-line" />
        </button>
        <ul className="pnav-mobile-links">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => `pnav-mobile-link${isActive ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
              onClick={() => { setMenuOpen(false); navigate('/admin'); }}>
              <i className="ri-dashboard-line" /> Admin Dashboard
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
