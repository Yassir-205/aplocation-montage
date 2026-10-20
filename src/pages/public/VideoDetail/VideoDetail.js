import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVideos } from '../../../context/VideoContext';
import VideoPlayer from '../../../components/shared/VideoPlayer/VideoPlayer';
import VideoCard from '../../../components/shared/VideoCard/VideoCard';
import QualityBadge from '../../../components/shared/QualityBadge/QualityBadge';
import './VideoDetail.css';

export default function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { videos } = useVideos();
  const [video,   setVideo]   = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const found = videos.find(v => v.id === id);
    if (found) {
      setVideo(found);
      setRelated(
        videos
          .filter(v => v.id !== id && v.status === 'published' && v.category === found.category)
          .slice(0, 3)
      );
    }
  }, [id, videos]);

  if (!video) {
    return (
      <div className="vd-not-found">
        <div className="container">
          <i className="ri-film-line" />
          <h2>Video not found</h2>
          <button className="btn btn-ghost" onClick={() => navigate('/work')}>
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-detail-page">
      <div className="vd-hero-bg" />
      <div className="container">
        {/* Back */}
        <button className="vd-back btn btn-ghost" onClick={() => navigate(-1)}>
          <i className="ri-arrow-left-line" /> Back
        </button>

        <div className="vd-grid">
          {/* Player */}
          <div className="vd-player-col">
            <VideoPlayer src={video.videoUrl} poster={video.thumbnail} title={video.title} />
          </div>

          {/* Info */}
          <div className="vd-info-col">
            <div className="vd-badges">
              <QualityBadge quality={video.quality} size="md" />
              <span className="vd-category-pill">{video.category}</span>
            </div>
            <h1 className="vd-title">{video.title}</h1>
            <p className="vd-desc">{video.description}</p>

            <div className="vd-meta-grid">
              <div className="vd-meta-item">
                <span className="vd-meta-label"><i className="ri-time-line" /> Duration</span>
                <span className="vd-meta-value">{video.duration || '—'}</span>
              </div>
              <div className="vd-meta-item">
                <span className="vd-meta-label"><i className="ri-calendar-line" /> Date</span>
                <span className="vd-meta-value">{video.createdAt}</span>
              </div>
              <div className="vd-meta-item">
                <span className="vd-meta-label"><i className="ri-eye-line" /> Views</span>
                <span className="vd-meta-value">{video.views?.toLocaleString() || '0'}</span>
              </div>
              <div className="vd-meta-item">
                <span className="vd-meta-label"><i className="ri-star-line" /> Quality</span>
                <span className="vd-meta-value">{video.quality}</span>
              </div>
            </div>

            <div className="vd-cta-row">
              <button className="btn btn-primary" onClick={() => navigate('/contact')}>
                <i className="ri-send-plane-line" /> Order Similar
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('/work')}>
                Browse More Work
              </button>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="vd-related">
            <h2 className="vd-related-title">More <span className="gradient-text">from {video.category}</span></h2>
            <div className="vd-related-grid">
              {related.map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
