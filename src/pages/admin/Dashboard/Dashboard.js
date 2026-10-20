import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideos } from '../../../context/VideoContext';
import DashboardStats from '../../../components/admin/DashboardStats/DashboardStats';
import VideoTable from '../../../components/admin/VideoTable/VideoTable';
import './Dashboard.css';

export default function Dashboard() {
  const navigate        = useNavigate();
  const { videos, stats, loading } = useVideos();

  const recent = videos.slice(0, 5);

  return (
    <div className="dash-page">

      {/* Welcome */}
      <div className="dash-welcome">
        <div>
          <h2 className="dash-welcome-title">Welcome back <span className="gradient-text">Admin</span> 👋</h2>
          <p className="dash-welcome-sub">Here's an overview of your video portfolio.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/videos/create')}>
          <i className="ri-add-circle-line" /> Add New Video
        </button>
      </div>

      {/* Stats */}
      <DashboardStats stats={stats} />

      {/* Recent videos */}
      <div className="dash-section">
        <div className="dash-section-header">
          <h3 className="dash-section-title">Recent Videos</h3>
          <button className="btn btn-ghost dash-view-all" onClick={() => navigate('/admin/videos')}>
            View All <i className="ri-arrow-right-line" />
          </button>
        </div>
        {loading
          ? <div className="dash-loading"><i className="ri-loader-4-line dash-spin" /> Loading…</div>
          : <VideoTable videos={recent} />
        }
      </div>

    </div>
  );
}
