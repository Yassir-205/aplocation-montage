import React, { useState, useEffect, useCallback } from 'react';
import './Navbar.css';

const NAV_ITEMS = [
  { label: 'Home',      href: '#home' },
  { label: 'Skills',    href: '#skills' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact',   href: '#contact' },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [activeLink, setActiveLink] = useState('#home');

  /* ── Scroll / active section tracking ── */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      // Determine active section
      const sections = NAV_ITEMS.map(n => n.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveLink(`#${sections[i]}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Lock body scroll when menu open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = useCallback((href) => {
    setActiveLink(href);
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      {/* ── Desktop Navbar ── */}
      <header className="navbar-wrapper">
        <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
          {/* Brand */}
          <div className="navbar-brand">
            <span className="brand-logo" onClick={() => handleNavClick('#home')} style={{ cursor: 'pointer' }}>
              <span className="brand-icon">⬡</span>
              <span className="brand-text">YA<span className="brand-accent">.</span></span>
            </span>
          </div>

          {/* Links */}
          <ul className="nav-links">
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className={`nav-link${activeLink === href ? ' active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Hire Me CTA */}
          <button className="nav-cta" onClick={() => handleNavClick('#contact')}>
            Hire Me
          </button>

          {/* Hamburger */}
          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </nav>
      </header>

      {/* ── Mobile Overlay ── */}
      <div className={`mobile-nav-overlay${menuOpen ? ' open' : ''}`} role="dialog" aria-modal="true">
        <button className="mobile-nav-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <i className="ri-close-line" />
        </button>
        <ul className="mobile-nav-links">
          {NAV_ITEMS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className={`mobile-nav-link${activeLink === href ? ' active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
