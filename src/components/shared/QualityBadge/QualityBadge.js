import React from 'react';
import './QualityBadge.css';

export default function QualityBadge({ quality, size = 'sm' }) {
  const q = (quality || 'BASIC').toUpperCase();
  return (
    <span className={`quality-badge quality-${q.toLowerCase()} quality-${size}`}>
      {q === 'PREMIUM' && <span className="badge-star">★</span>}
      {q}
    </span>
  );
}
