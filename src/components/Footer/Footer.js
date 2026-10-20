import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand-icon">⬡</span>
            <span>YA<span className="brand-accent">.</span></span>
          </div>

          <p className="footer-copy">
            © {new Date().getFullYear()} Yassir. Crafted with <span className="heart">♥</span> and lots of ☕
          </p>

          <a
            href="#home"
            className="back-to-top"
            aria-label="Back to top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <i className="ri-arrow-up-line" />
          </a>
        </div>
      </div>
    </footer>
  );
}
