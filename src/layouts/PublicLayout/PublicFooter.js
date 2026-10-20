import React from 'react';
import { Link } from 'react-router-dom';
import {
  BRAND_NAME, EMAIL, MAILTO_HREF,
  PHONE_DISPLAY, TEL_HREF,
  WHATSAPP_URL, SOCIALS,
} from '../../config/siteConfig';
import './PublicFooter.css';

export default function PublicFooter() {
  return (
    <footer className="pub-footer">
      <div className="container">
        <div className="pf-grid">

          {/* Brand */}
          <div className="pf-brand-col">
            <Link to="/" className="pf-brand">
              <span className="pf-brand-icon">▶</span>
              <span>{BRAND_NAME}<span className="pf-accent">.</span></span>
            </Link>
            <p className="pf-tagline">
              Professional video editing that transforms your vision into cinematic reality.
            </p>
            <div className="pf-socials">
              {SOCIALS.map(({ icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"
                  className="social-btn" aria-label={label}>
                  <i className={icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="pf-col">
            <h4 className="pf-col-title">Navigation</h4>
            <ul className="pf-col-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/work">Work</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/thumbnails">Thumbnails</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="pf-col">
            <h4 className="pf-col-title">Services</h4>
            <ul className="pf-col-links">
              <li><span>Commercial Editing</span></li>
              <li><span>Music Videos</span></li>
              <li><span>Wedding Films</span></li>
              <li><span>Corporate Videos</span></li>
              <li><span>Motion Graphics</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="pf-col">
            <h4 className="pf-col-title">Get In Touch</h4>
            <ul className="pf-col-links pf-contact-links">
              <li>
                <a href={TEL_HREF} className="pf-phone-link">
                  <i className="ri-phone-line" /> {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={MAILTO_HREF} className="pf-email-link">
                  <i className="ri-mail-line" /> {EMAIL}
                </a>
              </li>
            </ul>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary pf-wa-btn"
            >
              <i className="ri-whatsapp-line" /> Chat on WhatsApp
            </a>
          </div>

        </div>

        <div className="pf-bottom">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
          <a
            href="#top"
            className="pf-top-btn"
            aria-label="Back to top"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <i className="ri-arrow-up-line" />
          </a>
        </div>
      </div>
    </footer>
  );
}
