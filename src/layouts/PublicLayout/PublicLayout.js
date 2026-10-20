import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import Particles from '../../components/Particles/Particles';

export default function PublicLayout() {
  return (
    <div className="app">
      <Particles />
      <div className="app-blob-center" aria-hidden="true" />
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
