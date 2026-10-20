import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar/AdminSidebar';
import './AdminLayout.css';

const PAGE_TITLES = {
  '/admin':                  { title: 'Dashboard',   icon: 'ri-dashboard-line'  },
  '/admin/videos':           { title: 'All Videos',  icon: 'ri-film-line'       },
  '/admin/videos/create':    { title: 'Add Video',   icon: 'ri-add-circle-line' },
  '/admin/thumbnails':       { title: 'Thumbnails',  icon: 'ri-gallery-line'    },
};

export default function AdminLayout() {
  const [collapsed,    setCollapsed]    = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const location = useLocation();

  /* Close mobile drawer on route change */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  /* Lock body scroll when mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isEdit   = location.pathname.includes('/edit');
  const pageInfo = isEdit
    ? { title: 'Edit Video', icon: 'ri-edit-line' }
    : (PAGE_TITLES[location.pathname] || { title: 'Admin', icon: 'ri-settings-line' });

  return (
    <div className="admin-layout">

      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div className="admin-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* ── Main ── */}
      <div className="admin-main">

        {/* Top bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            {/* Mobile hamburger */}
            <button
              className="admin-mobile-menu-btn"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Open menu"
            >
              <i className="ri-menu-line" />
            </button>
            <i className={`${pageInfo.icon} admin-page-icon`} />
            <h1 className="admin-page-title">{pageInfo.title}</h1>
          </div>
          <div className="admin-topbar-right">
            <div className="admin-user-badge">
              <div className="admin-user-avatar"><i className="ri-user-line" /></div>
              <div className="admin-user-info">
                <span className="admin-user-name">Admin</span>
                <span className="admin-user-role">Video Manager</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
