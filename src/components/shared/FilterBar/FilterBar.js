import React from 'react';
import './FilterBar.css';

export default function FilterBar({
  search, onSearchChange,
  activeQuality, onQualityChange,
  activeCategory, onCategoryChange,
  categories = [],
}) {
  const qualities = ['ALL', 'BASIC', 'STANDARD', 'PREMIUM'];

  return (
    <div className="filter-bar">
      {/* Search */}
      <div className="filter-search">
        <i className="ri-search-line filter-search-icon" />
        <input
          type="text"
          placeholder="Search projects…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="filter-search-input"
        />
        {search && (
          <button className="filter-search-clear" onClick={() => onSearchChange('')} aria-label="Clear search">
            <i className="ri-close-line" />
          </button>
        )}
      </div>

      {/* Quality pills */}
      <div className="filter-pills">
        {qualities.map((q) => (
          <button
            key={q}
            className={`filter-pill${activeQuality === q ? ' active' : ''}${q !== 'ALL' ? ` pill-${q.toLowerCase()}` : ''}`}
            onClick={() => onQualityChange(q)}
          >
            {q === 'PREMIUM' && <span className="pill-star">★</span>}
            {q}
          </button>
        ))}
      </div>

      {/* Category dropdown */}
      {categories.length > 0 && (
        <select
          className="filter-select"
          value={activeCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}
    </div>
  );
}
