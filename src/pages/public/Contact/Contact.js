import React, { useState, useEffect, useRef } from 'react';
import {
  EMAIL, MAILTO_HREF,
  PHONE_DISPLAY, TEL_HREF,
  WHATSAPP_URL,
  AVAILABLE, AVAILABILITY_TEXT, RESPONSE_TIME, LOCATION_TEXT,
  SOCIALS,
} from '../../../config/siteConfig';
import './Contact.css';

const SERVICES_LIST = [
  'Commercial Editing',
  'Music Video',
  'Wedding Film',
  'Corporate Video',
  'Social Media Content',
  'Motion Graphics',
  'Short Film / Documentary',
  'Other',
];

export default function Contact() {
  const rootRef = useRef(null);
  const [form, setForm]       = useState({ name: '', email: '', service: '', budget: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.animate-on-scroll,.animate-left,.animate-right').forEach((el, i) =>
            setTimeout(() => el.classList.add('visible'), i * 100));
        }
      });
    }, { threshold: 0.1 });
    if (rootRef.current) obs.observe(rootRef.current);
    return () => obs.disconnect();
  }, []);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in your name, email and message.');
      return;
    }
    setError('');
    setSending(true);
    // Swap this setTimeout for a real fetch/axios call when backend is ready
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: '', email: '', service: '', budget: '', message: '' });
      setTimeout(() => setSent(false), 6000);
    }, 1200);
  };

  return (
    <div className="contact-page" ref={rootRef}>

      {/* Hero */}
      <section className="ct-hero">
        <div className="container ct-hero-inner">
          <span className="section-tag animate-on-scroll">Let's Talk</span>
          <h1 className="section-title animate-on-scroll">
            Start Your <span className="gradient-text">Project</span>
          </h1>
          <p className="section-subtitle animate-on-scroll">
            Tell me about your video project and I'll get back to you within 24 hours with a custom quote.
          </p>
        </div>
      </section>

      {/* Main grid */}
      <section className="ct-body">
        <div className="container ct-grid">

          {/* ── Info column ── */}
          <div className="ct-info animate-left">

            <div className="ct-info-card glass-card">
              <div className="ct-info-icon"><i className="ri-mail-line" /></div>
              <div>
                <p className="ct-info-label">Email</p>
                <a href={MAILTO_HREF} className="ct-info-value">{EMAIL}</a>
              </div>
            </div>

            <div className="ct-info-card glass-card">
              <div className="ct-info-icon"><i className="ri-phone-line" /></div>
              <div>
                <p className="ct-info-label">Phone</p>
                <a href={TEL_HREF} className="ct-info-value ct-phone-link">{PHONE_DISPLAY}</a>
              </div>
            </div>

            <div className="ct-info-card glass-card">
              <div className="ct-info-icon ct-wa-icon"><i className="ri-whatsapp-line" /></div>
              <div>
                <p className="ct-info-label">WhatsApp</p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="ct-info-value ct-wa-link"
                >
                  {PHONE_DISPLAY}
                  <span className="ct-wa-badge">Chat now</span>
                </a>
              </div>
            </div>

            <div className="ct-info-card glass-card">
              <div className="ct-info-icon"><i className="ri-map-pin-line" /></div>
              <div>
                <p className="ct-info-label">Location</p>
                <p className="ct-info-value">{LOCATION_TEXT}</p>
              </div>
            </div>

            <div className="ct-info-card glass-card">
              <div className="ct-info-icon"><i className="ri-time-line" /></div>
              <div>
                <p className="ct-info-label">Response Time</p>
                <p className="ct-info-value">{RESPONSE_TIME}</p>
              </div>
            </div>

            <div className="ct-info-card glass-card">
              <div className="ct-info-icon"><i className="ri-calendar-check-line" /></div>
              <div>
                <p className="ct-info-label">Availability</p>
                <p className={`ct-info-value ${AVAILABLE ? 'ct-available' : ''}`}>
                  {AVAILABLE && <span className="ct-dot" />}
                  {AVAILABLE ? AVAILABILITY_TEXT : 'Not currently available'}
                </p>
              </div>
            </div>

            <div className="ct-socials">
              {SOCIALS.map(({ icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"
                  className="social-btn" aria-label={label}>
                  <i className={icon} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Form column ── */}
          <div className="ct-form-wrap animate-right">
            <form className="ct-form glass-card" onSubmit={handleSubmit} noValidate>
              <h2 className="ct-form-title">Send a Message</h2>

              <div className="ct-form-row">
                <div className="ct-field">
                  <label htmlFor="name">Full Name *</label>
                  <input id="name" name="name" type="text" placeholder="Your name"
                    value={form.name} onChange={handleChange} required />
                </div>
                <div className="ct-field">
                  <label htmlFor="email">Email Address *</label>
                  <input id="email" name="email" type="email" placeholder="your@email.com"
                    value={form.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="ct-form-row">
                <div className="ct-field">
                  <label htmlFor="service">Service Needed</label>
                  <select id="service" name="service" value={form.service} onChange={handleChange}>
                    <option value="">Select a service…</option>
                    {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="ct-field">
                  <label htmlFor="budget">Estimated Budget</label>
                  <select id="budget" name="budget" value={form.budget} onChange={handleChange}>
                    <option value="">Select range…</option>
                    <option value="<500">Under $500</option>
                    <option value="500-1500">$500 – $1,500</option>
                    <option value="1500-5000">$1,500 – $5,000</option>
                    <option value="5000+">$5,000+</option>
                    <option value="discuss">Let's discuss</option>
                  </select>
                </div>
              </div>

              <div className="ct-field">
                <label htmlFor="message">Project Details *</label>
                <textarea id="message" name="message" rows={5}
                  placeholder="Tell me about your project — what you need, timeline, style references…"
                  value={form.message} onChange={handleChange} required />
              </div>

              {error && (
                <div className="ct-toast ct-toast-error">
                  <i className="ri-error-warning-line" /> {error}
                </div>
              )}
              {sent && (
                <div className="ct-toast ct-toast-success">
                  <i className="ri-check-double-line" /> Message sent! I'll reply within 24 hours.
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-full" disabled={sending}>
                {sending
                  ? <><i className="ri-loader-4-line ct-spin" /> Sending…</>
                  : <><i className="ri-send-plane-line" /> Send Message</>}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
