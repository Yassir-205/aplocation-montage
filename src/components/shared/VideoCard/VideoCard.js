import React, { useState } from 'react';
import QualityBadge from '../QualityBadge/QualityBadge';
import './VideoCard.css';

export default function VideoCard({ video, style, onVideoClick }) {
  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    if (onVideoClick) {
      onVideoClick(video);
    }
  };

  return (
    <article
      className="video-card glass-card"
      onClick={handleClick}
      style={style}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`View ${video.title}`}
    >
      {/* Thumbnail */}
      <div className="vc-thumb">
        {video.thumbnail && !imgError ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="vc-thumb-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="vc-thumb-placeholder">
            <i className="ri-film-line" />
          </div>
        )}

        {/* Overlay */}
        <div className="vc-overlay">
          <div className="vc-play-btn" aria-hidden="true">
            <i className="ri-play-fill" />
          </div>
        </div>

        {/* Duration */}
        {video.duration && (
          <span className="vc-duration">{video.duration}</span>
        )}

        {/* Quality badge on thumbnail */}
        <div className="vc-badge-pos">
          <QualityBadge quality={video.quality} />
        </div>
      </div>

      {/* Info */}
      <div className="vc-info">
        <div className="vc-meta">
          <span className="vc-category">{video.category}</span>
          {video.views > 0 && (
            <span className="vc-views">
              <i className="ri-eye-line" /> {video.views.toLocaleString()}
            </span>
          )}
        </div>
        <h3 className="vc-title">{video.title}</h3>
        <p className="vc-desc">{video.description}</p>
      </div>
    </article>
  );
}
