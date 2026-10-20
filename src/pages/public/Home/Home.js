import React from 'react';
import './Home.css';

// ── Replace with your real WhatsApp number (digits only, with country code) ──
const WHATSAPP_NUMBER = '212600000000'; // e.g. 212 = Morocco +212
const WHATSAPP_MESSAGE = encodeURIComponent("Hi! I'd like to discuss a video editing project.");
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const SOCIALS = [
  { icon: 'ri-instagram-line',     href: 'https://instagram.com',  label: 'Instagram' },
  { icon: 'ri-youtube-line',       href: 'https://youtube.com',    label: 'YouTube'   },
  { icon: 'ri-twitter-x-line',     href: 'https://twitter.com',    label: 'Twitter'   },
  { icon: 'ri-linkedin-box-fill',  href: 'https://linkedin.com',   label: 'LinkedIn'  },
  { icon: 'ri-tiktok-line',        href: 'https://tiktok.com',     label: 'TikTok'    },
];

export default function Home() {
  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="home-hero-bg">
          <div className="hero-glow hero-glow-1" />
          <div className="hero-glow hero-glow-2" />
        </div>

        <div className="container home-hero-content">

          {/* LEFT */}
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="hero-dot" />
              <span>Available for Projects</span>
            </div>

            <h1 className="hero-headline">
              Creative Video<br />
              <span className="gradient-text">Editing That</span><br />
              Brings Ideas To Life
            </h1>

            <p className="hero-sub">
              Professional video editing for brands, artists, and creators.
              From cinematic commercials to dynamic social content — I transform
              raw footage into stories that captivate and convert.
            </p>

            {/* Social links — above CTA */}
            <div className="hero-socials">
              {SOCIALS.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="social-btn"
                  aria-label={label}
                  title={label}
                >
                  <i className={icon} />
                </a>
              ))}
            </div>

            {/* CTA — WhatsApp only */}
            <div className="hero-ctas">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary hero-cta-main"
              >
                <i className="ri-whatsapp-line" /> VIEW MY WORK
              </a>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="hstat">
                <span className="hstat-num">120+</span>
                <span className="hstat-lbl">Projects</span>
              </div>
              <div className="hstat-div" />
              <div className="hstat">
                <span className="hstat-num">5★</span>
                <span className="hstat-lbl">Rated</span>
              </div>
              <div className="hstat-div" />
              <div className="hstat">
                <span className="hstat-num">4yr</span>
                <span className="hstat-lbl">Experience</span>
              </div>
            </div>
          </div>

          {/* RIGHT — image placeholder (drop your image at public/hero-image.png) */}
          <div className="hero-right">
            <div className="hero-img-placeholder">
              <img
                src="/IMG_2896.PNG"
                alt=""
                className="hero-img"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="hero-img-empty">
                
              </div>
            </div>
          </div>

        </div>

        {/* no scroll cue — nothing below */}
      </section>

    </div>
  );
}
