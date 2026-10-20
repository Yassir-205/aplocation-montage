import React, { useEffect, useRef, useState } from 'react';
import './Contact.css';

export default function Contact() {
  const sectionRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg: string }
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 150);
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setToast({ type: 'error', msg: 'Please fill in all required fields.' });
      return;
    }
    setSending(true);
    // Simulate send — replace with real API call
    setTimeout(() => {
      setSending(false);
      setToast({ type: 'success', msg: 'Message sent! I\'ll get back to you soon.' });
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setToast(null), 5000);
    }, 1200);
  };

  return (
    <section className="section contact-section" id="contact" ref={sectionRef}>
      <div className="container">

        <div className="section-header animate-on-scroll">
          <span className="section-tag">Get In Touch</span>
          <h2 className="section-title">Let's <span className="gradient-text">Work Together</span></h2>
          <p className="section-subtitle">
            Have a project in mind? I'd love to hear about it. Send me a message and let's build something great.
          </p>
        </div>

        <div className="contact-grid">

          {/* Info */}
          <div className="contact-info animate-left">
            <div className="contact-item glass-card">
              <div className="contact-icon"><i className="ri-mail-line" /></div>
              <div className="contact-detail">
                <span className="contact-label">Email</span>
                <a href="mailto:yassir@email.com" className="contact-value">yassir@email.com</a>
              </div>
            </div>
            <div className="contact-item glass-card">
              <div className="contact-icon"><i className="ri-map-pin-line" /></div>
              <div className="contact-detail">
                <span className="contact-label">Location</span>
                <span className="contact-value">Available Worldwide</span>
              </div>
            </div>
            <div className="contact-item glass-card">
              <div className="contact-icon"><i className="ri-time-line" /></div>
              <div className="contact-detail">
                <span className="contact-label">Response Time</span>
                <span className="contact-value">Within 24 hours</span>
              </div>
            </div>

            <div className="contact-socials">
              <a href="https://github.com"    target="_blank" rel="noreferrer" className="social-btn" aria-label="GitHub"><i className="ri-github-fill" /></a>
              <a href="https://linkedin.com"  target="_blank" rel="noreferrer" className="social-btn" aria-label="LinkedIn"><i className="ri-linkedin-box-fill" /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram"><i className="ri-instagram-line" /></a>
              <a href="https://twitter.com"   target="_blank" rel="noreferrer" className="social-btn" aria-label="Twitter/X"><i className="ri-twitter-x-line" /></a>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-wrapper animate-right">
            <form className="contact-form glass-card" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Project inquiry"
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {toast && (
                <div className={`form-toast ${toast.type}`}>
                  <i className={toast.type === 'success' ? 'ri-check-line' : 'ri-error-warning-line'} />
                  {toast.msg}
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-full" disabled={sending}>
                {sending
                  ? <><i className="ri-loader-4-line" /> Sending…</>
                  : <><i className="ri-send-plane-line" /> Send Message</>
                }
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
