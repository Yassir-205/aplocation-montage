import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useVideos } from '../../../context/VideoContext';
import './AdminSidebar.css';

const NAV = [
  { icon: 'ri-dashboard-line',  label: 'Dashboard',   to: '/admin',                  end: true  },
  { icon: 'ri-add-circle-line', label: 'Add Video',   to: '/admin/videos/create',     end: true  },
  { icon: 'ri-gallery-line',    label: 'Thumbnails',  to: '/admin/thumbnails',        end: true  },
];

export default function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const navigate  = useNavigate();
  const { stats } = useVideos();

  return (
    <aside className={`admin-sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>

      {/* Brand + toggle */}
      <div className="asb-brand">
        {!collapsed && (
          <button className="asb-brand-logo" onClick={() => { navigate('/'); onMobileClose?.(); }}>
            <span className="asb-brand-icon">▶</span>
            <span className="asb-brand-name">Neditiw<span className="asb-accent">.</span></span>
          </button>
        )}
        <div className="asb-brand-btns">
          {/* Close button — mobile only */}
          <button className="asb-mobile-close" onClick={onMobileClose} aria-label="Close menu">
            <i className="ri-close-line" />
          </button>
          {/* Collapse toggle — desktop only */}
          <button className="asb-toggle" onClick={onToggle} aria-label="Toggle sidebar">
            <i className={`ri-${collapsed ? 'menu-unfold' : 'menu-fold'}-line`} />
          </button>
        </div>
      </div>

      {/* Nav links */}
      <nav className="asb-nav">
        {!collapsed && <span className="asb-nav-label">Management</span>}
        {NAV.map(({ icon, label, to, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `asb-link${isActive ? ' active' : ''}`}
            title={collapsed ? label : undefined}
            onClick={onMobileClose}
          >
            <i className={icon} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Quick stats */}
      {!collapsed && stats && (
        <div className="asb-stats">
          <span className="asb-nav-label">Quick Stats</span>
          <div className="asb-stat-row">
            <span className="asb-stat-label">Total</span>
            <span className="asb-stat-val">{stats.total}</span>
          </div>
          <div className="asb-stat-row">
            <span className="asb-stat-label">Published</span>
            <span className="asb-stat-val asb-stat-pub">{stats.published}</span>
          </div>
          <div className="asb-stat-row">
            <span className="asb-stat-label">Drafts</span>
            <span className="asb-stat-val asb-stat-draft">{stats.draft}</span>
          </div>
        </div>
      )}

      {/* Back to site */}
      <div className="asb-footer">
        <button
          className="asb-link asb-back"
          onClick={() => { navigate('/'); onMobileClose?.(); }}
          title="Back to site"
        >
          <i className="ri-arrow-left-line" />
          {!collapsed && <span>Back to Site</span>}
        </button>
      </div>

    </aside>
  );
}
