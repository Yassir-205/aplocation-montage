import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layouts
import PublicLayout from './layouts/PublicLayout/PublicLayout';
import AdminLayout  from './layouts/AdminLayout/AdminLayout';

// Public pages
import Home         from './pages/public/Home/Home';
import Portfolio    from './pages/public/Portfolio/Portfolio';
import VideoDetail  from './pages/public/VideoDetail/VideoDetail';
import Services     from './pages/public/Services/Services';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin/AdminLogin';
import ProtectedAdmin from './components/auth/ProtectedAdmin';
import Dashboard         from './pages/admin/Dashboard/Dashboard';
import VideosList        from './pages/admin/VideosList/VideosList';
import VideoCreate       from './pages/admin/VideoCreate/VideoCreate';
import VideoEdit         from './pages/admin/VideoEdit/VideoEdit';
import ThumbnailsManager from './pages/admin/ThumbnailsManager/ThumbnailsManager';

// Public pages (additional)
import Thumbnails from './pages/public/Thumbnails/Thumbnails';

export default function App() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route element={<PublicLayout />}>
        <Route path="/"           element={<Home />} />
        <Route path="/work"       element={<Portfolio />} />
        <Route path="/work/:id"   element={<VideoDetail />} />
        <Route path="/services"   element={<Services />} />
        <Route path="/thumbnails" element={<Thumbnails />} />
        {/* Legacy aliases */}
        <Route path="/portfolio"     element={<Navigate to="/work" replace />} />
        <Route path="/portfolio/:id" element={<Navigate to="/work/:id" replace />} />
        {/* Redirect any old /about links to home */}
        <Route path="/about" element={<Navigate to="/" replace />} />
      </Route>


{/* Admin Login */}
<Route path="/admin/login" element={<AdminLogin />} />

{/* Protected Admin */}
<Route element={<ProtectedAdmin />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="videos" element={<VideosList />} />
    <Route path="videos/create" element={<VideoCreate />} />
    <Route path="videos/:id/edit" element={<VideoEdit />} />
    <Route path="thumbnails" element={<ThumbnailsManager />} />
  </Route>
</Route>


      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
