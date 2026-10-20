import React from 'react';
import './Hero.css';

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="home">
      <div className="hero-container">

        {/* ── LEFT ── */}
        <div className="hero-left">
          <div className="hero-badge">
            <span className="badge-dot" />
            Available for work
          </div>

          <p className="hero-greeting">HI, I'M YASSIR</p>

          <h1 className="hero-title">
            Full-Stack<br />
            <span className="gradient-text">Developer</span>
          </h1>

          <p className="hero-description">
            I craft high-performance web applications with modern technologies.
            Turning complex ideas into elegant, scalable digital experiences —
            from pixel-perfect UIs to robust backend architectures.
          </p>

          <div className="hero-actions">
            <a href="/cv.pdf" className="btn btn-primary" download>
              <i className="ri-download-2-line" />
              DOWNLOAD CV
            </a>
            <button className="btn btn-ghost" onClick={() => scrollTo('portfolio')}>
              View Work
              <i className="ri-arrow-right-line" />
            </button>
          </div>

          <div className="hero-socials">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="GitHub">
              <i className="ri-github-fill" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="LinkedIn">
              <i className="ri-linkedin-box-fill" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram">
              <i className="ri-instagram-line" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Twitter/X">
              <i className="ri-twitter-x-line" />
            </a>
            <a href="mailto:yassir@email.com" className="social-btn" aria-label="Email">
              <i className="ri-mail-line" />
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">3+</span>
              <span className="stat-label">Years Exp.</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">40+</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">20+</span>
              <span className="stat-label">Clients</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="hero-right">
          <div className="portrait-wrapper">
            {/* Orbital rings */}
            <div className="orbit orbit-1" />
            <div className="orbit orbit-2" />

            {/* Glow */}
            <div className="portrait-glow" />

            {/* Portrait */}
            <div className="portrait-frame">
              {/*
                To use a real photo:
                1. Place your image at frontend/public/portrait.jpg
                2. Replace the placeholder below with:
                   <img src="/portrait.jpg" alt="Yassir" className="portrait-img" />
              */}
              <div className="portrait-placeholder">
                <div className="portrait-silhouette">
                  <div className="silhouette-head" />
                  <div className="silhouette-body" />
                </div>
                <p className="portrait-hint">Add portrait.jpg to public/</p>
              </div>
            </div>

            {/* Floating badges */}
            <div className="float-badge badge-js">
              <span className="badge-code">{'{ JS }'}</span>
            </div>
            <div className="float-badge badge-html">
              <span className="badge-code">{'</>'}</span>
            </div>
            <div className="float-badge badge-fe">
              <i className="ri-layout-3-line" />
              <span>FRONT-END</span>
            </div>
            <div className="float-badge badge-node">
              <i className="ri-nodejs-line" />
              <span>Node.js</span>
            </div>
            <div className="float-badge badge-react">
              <i className="ri-reactjs-line" />
              <span>React</span>
            </div>

            {/* Geometric decorations */}
            <div className="geo geo-1" />
            <div className="geo geo-2" />
            <div className="geo geo-3" />
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
