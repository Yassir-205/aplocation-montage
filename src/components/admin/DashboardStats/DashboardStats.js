import React from 'react';
import './DashboardStats.css';

const STAT_CONFIG = [
  { key: 'total',     label: 'Total Videos',     icon: 'ri-film-line',          color: 'violet'  },
  { key: 'published', label: 'Published',         icon: 'ri-eye-line',           color: 'green'   },
  { key: 'draft',     label: 'Drafts',            icon: 'ri-draft-line',         color: 'amber'   },
  { key: 'premium',   label: 'Premium Videos',    icon: 'ri-vip-crown-line',     color: 'premium' },
  { key: 'standard',  label: 'Standard Videos',   icon: 'ri-honour-line',        color: 'standard'},
  { key: 'basic',     label: 'Basic Videos',      icon: 'ri-video-line',         color: 'basic'   },
];

export default function DashboardStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="dash-stats-grid">
      {STAT_CONFIG.map(({ key, label, icon, color }) => (
        <div className={`dash-stat-card glass-card ds-${color}`} key={key}>
          <div className="ds-icon-wrap">
            <i className={icon} />
          </div>
          <div className="ds-body">
            <span className="ds-value">{stats[key] ?? 0}</span>
            <span className="ds-label">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
