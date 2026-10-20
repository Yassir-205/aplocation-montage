import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useThumbnails } from '../../../context/ThumbnailContext';
import './Thumbnails.css';

/* ── Lightbox rendered via portal so it escapes the layout stacking context ── */
function Lightbox({ item, onClose }) {
  /* Lock body scroll while open */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="tg-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <div className="tg-lb-inner" onClick={(e) => e.stopPropagation()}>
        <button
          className="tg-lb-close"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <i className="ri-close-line" />
        </button>
        <img
          src={item.dataUri}
          alt={item.title}
          className="tg-lb-img"
        />
        <p className="tg-lb-caption">{item.title}</p>
      </div>
    </div>,
    document.body   // ← mounted directly on body, above every layout layer
  );
}

export default function Thumbnails() {
  const { thumbnails } = useThumbnails();
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="tg-page">

      {/* Hero */}
      <section className="tg-hero">
        <h1 className="tg-hero-title">Thumbnails</h1>
        <p className="tg-hero-sub">
          A curated collection of visual assets from our projects.
        </p>
      </section>

      {/* Gallery */}
      <section className="tg-section container">
        {thumbnails.length === 0 ? (
          <div className="tg-empty">
            <i className="ri-image-2-line" />
            <p>No thumbnails have been published yet.</p>
          </div>
        ) : (
          <div className="tg-grid">
            {thumbnails.map((item) => (
              <button
                key={item.id}
                className="tg-card"
                onClick={() => setLightbox(item)}
                aria-label={`View ${item.title}`}
              >
                <div className="tg-card-img-wrap">
                  <img src={item.dataUri} alt={item.title} className="tg-card-img" loading="lazy" />
                  <div className="tg-card-overlay">
                    <i className="ri-zoom-in-line" />
                  </div>
                </div>
                <div className="tg-card-info">
                  <span className="tg-card-title">{item.title}</span>
                  <span className="tg-card-date">{item.createdAt}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox — portalled to document.body to escape layout stacking context */}
      {lightbox && <Lightbox item={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}
