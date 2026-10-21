import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideos } from '../../../context/VideoContext';
import VideoTable from '../../../components/admin/VideoTable/VideoTable';
import { CATEGORIES } from '../../../data/mockData';
import './VideosList.css';

export default function VideosList() {
  const navigate = useNavigate();
  const { videos, loading, loadVideos } = useVideos();

  const [search,   setSearch]   = useState('');
  const [quality,  setQuality]  = useState('ALL');
  const [status,   setStatus]   = useState('ALL');
  const [category, setCategory] = useState('ALL');

  /* Always re-fetch from service when this page mounts */
  useEffect(() => {
    loadVideos().catch(console.error);
  }, [loadVideos]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return videos
      .filter(v => quality  === 'ALL' || v.quality.toUpperCase() === quality)
      .filter(v => status   === 'ALL' || v.status === status)
      .filter(v => category === 'ALL' || v.category === category)
      .filter(v => !q || v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q));
  }, [videos, search, quality, status, category]);

  return (
    <div className="vl-page">

      {/* Toolbar */}
      <div className="vl-toolbar">
        <div className="vl-search-wrap">
          <i className="ri-search-line vl-search-icon" />
          <input
            className="vl-search"
            type="text"
            placeholder="Search videos…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="vl-search-clear" onClick={() => setSearch('')} aria-label="Clear">
              <i className="ri-close-line" />
            </button>
          )}
        </div>

        <div className="vl-filters">
          <select className="vl-select" value={quality} onChange={e => setQuality(e.target.value)}>
            <option value="ALL">All Quality</option>
            <option value="BASIC">Basic</option>
            <option value="STANDARD">Standard</option>
            <option value="PREMIUM">Premium</option>
          </select>
          <select className="vl-select" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <select className="vl-select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="ALL">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button className="btn btn-primary vl-add-btn" onClick={() => navigate('/admin/videos/create')}>
          <i className="ri-add-circle-line" /> Add Video
        </button>
      </div>

      {/* Count */}
      <p className="vl-count">{filtered.length} video{filtered.length !== 1 ? 's' : ''}</p>

      {loading
        ? <div className="vl-loading"><i className="ri-loader-4-line vl-spin" /> Loading videos…</div>
        : <VideoTable videos={filtered} />
      }
    </div>
  );
}
