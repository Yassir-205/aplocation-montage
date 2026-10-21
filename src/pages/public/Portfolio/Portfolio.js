import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useVideos } from '../../../context/VideoContext';
import VideoCard from '../../../components/shared/VideoCard/VideoCard';
import VideoPlayer from '../../../components/shared/VideoPlayer/VideoPlayer';
import QualityBadge from '../../../components/shared/QualityBadge/QualityBadge';
import './Portfolio.css';

const QUALITIES = ['ALL', 'BASIC', 'STANDARD', 'PREMIUM'];

export default function Portfolio() {
  const { videos, loading } = useVideos();
  const [quality, setQuality] = useState('ALL');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null); // For modal
  const triggerRef = useRef(null);

  /* Desktop: show sidebar once inline bar scrolls out of view */
  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Lock body scroll when mobile drawer is open OR modal is open */
  useEffect(() => {
    document.body.style.overflow = (mobileOpen || selectedVideo) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, selectedVideo]);

  const filtered = useMemo(() => {
    return videos
      .filter(v => v.status === 'published')
      .filter(v => quality === 'ALL' || v.quality.toUpperCase() === quality);
  }, [videos, quality]);

  /* Active filter count for mobile badge */
  const activeCount = quality !== 'ALL' ? 1 : 0;

  /* Sidebar content — shared by desktop & mobile */
  const SidebarContent = ({ onClose }) => (
    <>
      <div className="pf-sidebar-header">
        <span className="pf-sidebar-title">
          <i className="ri-filter-3-line" /> Filters
        </span>
        {onClose && (
          <button className="pf-sidebar-close" onClick={onClose} aria-label="Close filters">
            <i className="ri-close-line" />
          </button>
        )}
      </div>

      {/* Quality pills */}
      <div className="pf-section">
        <p className="pf-group-label">Quality</p>
        <div className="pf-pills pf-pills--vertical">
          {QUALITIES.map(q => (
            <button
              key={q}
              className={`pf-pill${quality === q ? ' active' : ''}`}
              onClick={() => setQuality(q)}
            >
              {q === 'PREMIUM' && <span className="pf-star">★</span>} {q}
            </button>
          ))}
        </div>
      </div>

      {/* Clear all */}
      {activeCount > 0 && (
        <button
          className="pf-clear-btn"
          onClick={() => { setQuality('ALL'); }}
        >
          <i className="ri-refresh-line" /> Clear all
        </button>
      )}
    </>
  );

  return (
    <div className="portfolio-page">

      {/* Inline bar — desktop top */}
      <div className="pf-inline-bar" ref={triggerRef}>
        <div className="container">
          <div className="pf-controls">
            <div className="pf-pills">
              {QUALITIES.map(q => (
                <button key={q} className={`pf-pill${quality === q ? ' active' : ''}`}
                  onClick={() => setQuality(q)}>
                  {q === 'PREMIUM' && <span className="pf-star">★</span>} {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className={`pf-sidebar pf-sidebar--desktop${scrolled ? ' pf-sidebar--visible' : ''}`}>
        <SidebarContent />
      </aside>

      {/* Mobile FAB */}
      <button className="pf-mobile-fab" onClick={() => setMobileOpen(true)} aria-label="Open filters">
        <i className="ri-filter-3-line" />
        {activeCount > 0 && <span className="pf-fab-badge">{activeCount}</span>}
      </button>

      {/* Mobile backdrop + drawer */}
      {mobileOpen && (
        <div className="pf-mobile-backdrop" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`pf-sidebar pf-sidebar--mobile${mobileOpen ? ' pf-sidebar--visible' : ''}`}>
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Video grid */}
      <div className={`pf-main${scrolled ? ' pf-main--shifted' : ''}`}>
        <div className="container">
          {loading ? (
            <div className="port-loading">
              <i className="ri-loader-4-line spin" /> Loading projects…
            </div>
          ) : filtered.length === 0 ? (
            <div className="port-empty">
              <i className="ri-film-line" />
              <h3>No projects found</h3>
              <p>Try adjusting your filters</p>
              <button className="btn btn-ghost" onClick={() => { setQuality('ALL'); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <p className="port-count">{filtered.length} project{filtered.length !== 1 ? 's' : ''}</p>
              <div className="port-grid">
                {filtered.map((v, i) => (
                  <VideoCard
                    key={v.id}
                    video={v}
                    style={{ animationDelay: `${i * 0.06}s` }}
                    onVideoClick={setSelectedVideo}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Video Details Modal */}
      {selectedVideo && (
        <div className="port-modal-backdrop" onClick={() => setSelectedVideo(null)}>
          <div className="port-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="port-modal-close"
              onClick={() => setSelectedVideo(null)}
              aria-label="Close"
            >
              <i className="ri-close-line" />
            </button>

            <div className="port-modal-video">
              <VideoPlayer
                src={
                  selectedVideo.sourceType === 'upload'
                    ? selectedVideo.videoUrl
                    : selectedVideo.externalUrl
                }
                poster={selectedVideo.thumbnail}
                title={selectedVideo.title}
                sourceType={selectedVideo.sourceType || 'upload'}
              />

            </div>

            <div className="port-modal-details">
              <div className="port-modal-header">
                <h2 className="port-modal-title">{selectedVideo.title}</h2>
                <QualityBadge quality={selectedVideo.quality} size="md" />
              </div>

              {selectedVideo.description && (
                <p className="port-modal-description">{selectedVideo.description}</p>
              )}

              <div className="port-modal-meta">
                {selectedVideo.duration && (
                  <div className="port-modal-meta-item">
                    <i className="ri-time-line" />
                    <span>{selectedVideo.duration}</span>
                  </div>
                )}
                <div className="port-modal-meta-item">
                  <i className="ri-calendar-line" />
                  <span>{selectedVideo.createdAt}</span>
                </div>
                <div className="port-modal-meta-item">
                  <i className="ri-eye-line" />
                  <span>{selectedVideo.views?.toLocaleString() || '0'} views</span>
                </div>
                <div className="port-modal-meta-item">
                  <i className="ri-star-line" />
                  <span>{selectedVideo.quality}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
