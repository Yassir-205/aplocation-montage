import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.css';

const SERVICES = [
  {
    icon: 'ri-film-line',
    title: 'Commercial Editing',
    quality: 'PREMIUM',
    desc: 'Brand stories, product ads, and launch videos with cinema-grade color grading, sound design, and motion graphics that drive results.',
    features: ['4K / 6K export', 'Pro color grading', 'Custom motion graphics', 'Full sound mix', 'Unlimited revisions'],
  },
  {
    icon: 'ri-music-2-line',
    title: 'Music Video Editing',
    quality: 'STANDARD',
    desc: 'Beat-synced dynamic edits, creative effects, and visual storytelling that matches the energy of any genre — from hip-hop to cinematic ballads.',
    features: ['Beat-sync cuts', 'Color-matched palette', 'Transition effects', 'Multi-cam sync', '4K export'],
  },
  {
    icon: 'ri-heart-line',
    title: 'Wedding Films',
    quality: 'PREMIUM',
    desc: 'Timeless cinematic highlights that relive your most precious moments with soft color grades, gentle transitions, and an emotional narrative arc.',
    features: ['Cinematic grade', 'Highlight reel', 'Full ceremony edit', 'Custom soundtrack', 'Same-day preview'],
  },
  {
    icon: 'ri-building-line',
    title: 'Corporate Videos',
    quality: 'STANDARD',
    desc: 'Professional company profiles, event coverage, training content and investor decks that communicate your brand message with authority.',
    features: ['Brand-aligned style', 'Interview editing', 'Lower thirds & titles', 'B-roll integration', 'Fast turnaround'],
  },
  {
    icon: 'ri-smartphone-line',
    title: 'Social Media Content',
    quality: 'BASIC',
    desc: 'Reels, TikToks, and YouTube Shorts optimised for maximum watch-time and engagement. Trend-driven edits tuned for every algorithm.',
    features: ['Vertical & square formats', 'Captions & subtitles', 'On-beat transitions', 'Hook-first structure', 'Quick delivery'],
  },
  {
    icon: 'ri-magic-line',
    title: 'Motion Graphics',
    quality: 'PREMIUM',
    desc: 'Animated intros, kinetic typography, logo reveals, lower thirds, and custom VFX that elevate any video from ordinary to extraordinary.',
    features: ['Custom animations', 'Logo reveals', 'Kinetic typography', 'Particle effects', 'After Effects VFX'],
  },
  {
    icon: 'ri-camera-lens-line',
    title: 'Short Film Editing',
    quality: 'PREMIUM',
    desc: 'Festival-ready narrative editing with intentional pacing, subtle sound design, and deeply crafted storytelling that respects your creative vision.',
    features: ['Narrative structure', 'Pacing & rhythm', 'Dialogue editing', 'Foley & SFX', 'DCP / festival export'],
  },
  {
    icon: 'ri-file-video-line',
    title: 'Documentary Editing',
    quality: 'STANDARD',
    desc: 'Long-form documentary editing with strong narrative spine, archival integration, voiceover sync, and the emotional arc your story deserves.',
    features: ['Story architecture', 'Interview weaving', 'Archival footage', 'Voiceover sync', 'Full grade'],
  },
];

const PROCESS = [
  { step: '01', icon: 'ri-upload-cloud-line',   title: 'Send Footage',     desc: 'Upload your raw footage via a shared drive link or direct upload.' },
  { step: '02', icon: 'ri-discuss-line',         title: 'Brief & Vision',   desc: 'We align on style, pace, references, and the story you want to tell.' },
  { step: '03', icon: 'ri-scissors-cut-line',    title: 'Editing & Grade',  desc: 'I cut, colour-grade, and add audio to bring your vision to life.' },
  { step: '04', icon: 'ri-send-plane-line',      title: 'Review & Deliver', desc: 'You review, request changes, and receive the final file in any format.' },
];

const BADGE_CLASSES = { BASIC: 'pkg-badge-basic', STANDARD: 'pkg-badge-standard', PREMIUM: 'pkg-badge-premium' };

export default function Services() {
  const navigate   = useNavigate();
  const sectRef    = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.anim').forEach((el, i) =>
            setTimeout(() => el.classList.add('visible'), i * 80)
          );
        }
      });
    }, { threshold: 0.1 });
    if (sectRef.current) obs.observe(sectRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="services-page" ref={sectRef}>

      {/* Hero */}
      <section className="sv-hero">
        <div className="container sv-hero-inner">
          <span className="section-tag anim animate-on-scroll">What I Offer</span>
          <h1 className="section-title anim animate-on-scroll">Video Editing <span className="gradient-text">Services</span></h1>
          <p className="section-subtitle anim animate-on-scroll">
            End-to-end post-production for every type of video. Every project receives premium attention to craft, story, and technical quality.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="sv-grid-section">
        <div className="container">
          <div className="sv-grid">
            {SERVICES.map((s, i) => (
              <div className="sv-card glass-card anim animate-on-scroll" key={s.title} style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="sv-card-top">
                  <div className="sv-icon"><i className={s.icon} /></div>
                  <span className={`pkg-badge ${BADGE_CLASSES[s.quality]}`}>{s.quality}</span>
                </div>
                <h3 className="sv-card-title">{s.title}</h3>
                <p className="sv-card-desc">{s.desc}</p>
                <ul className="sv-features">
                  {s.features.map(f => (
                    <li key={f}><i className="ri-check-line" />{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="sv-process-section">
        <div className="container">
          <div className="section-header anim animate-on-scroll">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">Simple <span className="gradient-text">Process</span></h2>
          </div>
          <div className="sv-process-grid">
            {PROCESS.map((p, i) => (
              <div className="sv-process-card glass-card anim animate-on-scroll" key={p.step} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="sv-step-num">{p.step}</div>
                <div className="sv-step-icon"><i className={p.icon} /></div>
                <h4 className="sv-step-title">{p.title}</h4>
                <p className="sv-step-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sv-cta">
        <div className="container">
          <div className="sv-cta-inner glass-card anim animate-on-scroll">
            <div className="sv-cta-glow" />
            <h2>Ready to Get Started?</h2>
            <p>Tell me about your project and let's create something cinematic together.</p>
            <div className="sv-cta-btns">
              <button className="btn btn-primary" onClick={() => navigate('/contact')}>
                <i className="ri-send-plane-line" /> Start a Project
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('/work')}>
                See My Work <i className="ri-arrow-right-line" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
