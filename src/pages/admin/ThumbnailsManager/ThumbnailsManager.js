import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useThumbnails } from '../../../context/ThumbnailContext';
import './ThumbnailsManager.css';

/* ─────────────────────────────────────────────
   Lightbox — portalled to document.body so it
   always renders above the admin sidebar/topbar
───────────────────────────────────────────── */
function AdminLightbox({ item, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <div
      className="tm-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <div className="tm-lb-inner" onClick={(e) => e.stopPropagation()}>
        <div className="tm-lb-toolbar">
          <span className="tm-lb-title">{item.title}</span>
          <button className="tm-lb-close" onClick={onClose} aria-label="Close">
            <i className="ri-close-line" />
          </button>
        </div>
        <img src={item.dataUri} alt={item.title} className="tm-lb-img" />
        <p className="tm-lb-meta">{item.createdAt}{item.size ? ` · ${fmtSize(item.size)}` : ''}</p>
      </div>
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function fmtSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function ThumbnailsManager() {
  const { thumbnails, createThumbnail, deleteThumbnail } = useThumbnails();

  /* Upload state */
  const [drag,       setDrag]       = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [preview,    setPreview]    = useState(null);
  const [saving,     setSaving]     = useState(false);
  const fileInputRef = useRef(null);

  /* History state */
  const [lightboxItem, setLightboxItem] = useState(null);
  const [confirmId,    setConfirmId]    = useState(null);

  /* ── File handling ── */
  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP, GIF).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreview({ dataUri: e.target.result, file });
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const clearPreview = () => {
    setPreview(null);
    setTitleInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ── Save ── */


const handleSave = async () => {
  if (!preview || saving) return;

  setSaving(true);

  try {
    await createThumbnail({
      title: titleInput.trim() || preview.file.name,
      file: preview.file,
    });

    clearPreview();
    alert('Thumbnail published successfully!');
  } catch (error) {
    console.error('Upload failed:', error);
    alert('Upload failed: ' + error.message);
  } finally {
    setSaving(false);
  }
};



  /* ── Delete ── */

const handleDelete = async (id) => {
  try {
    await deleteThumbnail(id);
    setConfirmId(null);

    if (lightboxItem?.id === id) {
      setLightboxItem(null);
    }
  } catch (error) {
    console.error('Delete failed:', error);
    alert('Delete failed: ' + error.message);
  }
};


  return (
    <div className="tm-page">

      {/* ══ UPLOAD PANEL ══════════════════════════════════════ */}
      <div className="tm-upload-panel glass-card">
        <h3 className="tm-panel-title">
          <i className="ri-image-add-line" /> Upload New Thumbnail
        </h3>

        {!preview ? (
          <div
            className={`tm-dropzone${drag ? ' drag-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          >
            <div className="tm-dz-icon"><i className="ri-image-add-line" /></div>
            <p className="tm-dz-title">Drag &amp; drop an image here</p>
            <p className="tm-dz-sub">or</p>
            <span className="tm-dz-btn">Choose Image</span>
            <p className="tm-dz-hint">JPG, PNG, WEBP, GIF · Max 10 MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="tm-hidden-input"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="tm-preview-area">
            <div className="tm-preview-img-wrap">
              <img src={preview.dataUri} alt="Preview" className="tm-preview-img" />
              <button className="tm-remove-preview" onClick={clearPreview} aria-label="Remove">
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="tm-preview-meta">
              <span className="tm-file-name">{preview.file.name}</span>
              <span className="tm-file-size">{fmtSize(preview.file.size)}</span>
            </div>
            <div className="tm-title-row">
              <input
                type="text"
                className="tm-title-input"
                placeholder="Title (optional — defaults to filename)"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                maxLength={120}
              />
              <button
                className="btn btn-primary tm-save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? <><i className="ri-loader-4-line tm-spin" /> Saving…</>
                  : <><i className="ri-check-line" /> Save Thumbnail</>}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ══ HISTORY SECTION ═══════════════════════════════════ */}
      <div className="tm-history-section">

        {/* Header */}
        <div className="tm-history-header">
          <div className="tm-history-header-left">
            <h3 className="tm-panel-title">
              <i className="ri-history-line" /> Thumbnail History
            </h3>
            <p className="tm-history-sub">
              All uploaded thumbnails are preserved here. Nothing is replaced.
            </p>
          </div>
          <span className="tm-count">
            <i className="ri-image-line" />
            {thumbnails.length} image{thumbnails.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Empty state */}
        {thumbnails.length === 0 ? (
          <div className="tm-empty glass-card">
            <div className="tm-empty-icon"><i className="ri-image-2-line" /></div>
            <p className="tm-empty-title">No thumbnails yet</p>
            <p className="tm-empty-sub">Uploaded thumbnails will appear here with their full history.</p>
          </div>
        ) : (
          <div className="tm-history-list">
            {thumbnails.map((item, index) => (
              <div key={item.id} className="tm-history-row glass-card">

                {/* Index badge */}
                <div className="tm-row-index">
                  <span className="tm-index-num">{thumbnails.length - index}</span>
                </div>

                {/* Thumbnail preview */}
                <div className="tm-row-thumb">
                  <img
                    src={item.dataUri}
                    alt={item.title}
                    className="tm-row-img"
                  />
                </div>

                {/* Info */}
                <div className="tm-row-info">
                  <p className="tm-row-title">{item.title}</p>
                  <div className="tm-row-tags">
                    <span className="tm-tag tm-tag-date">
                      <i className="ri-calendar-line" /> {item.createdAt}
                    </span>
                    {item.fileName && (
                      <span className="tm-tag">
                        <i className="ri-file-image-line" /> {item.fileName}
                      </span>
                    )}
                    {item.size && (
                      <span className="tm-tag">
                        <i className="ri-hard-drive-line" /> {fmtSize(item.size)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="tm-row-actions">
                  <button
                    className="tm-row-btn tm-btn-view"
                    onClick={() => setLightboxItem(item)}
                    aria-label="View full size"
                    title="View full size"
                  >
                    <i className="ri-fullscreen-line" />
                    <span>View</span>
                  </button>

                  {confirmId === item.id ? (
                    <div className="tm-row-confirm">
                      <span className="tm-confirm-label">Delete?</span>
                      <button
                        className="tm-row-btn tm-btn-danger-solid"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="ri-check-line" /> Yes
                      </button>
                      <button
                        className="tm-row-btn"
                        onClick={() => setConfirmId(null)}
                      >
                        <i className="ri-close-line" /> No
                      </button>
                    </div>
                  ) : (
                    <button
                      className="tm-row-btn tm-btn-danger"
                      onClick={() => setConfirmId(item.id)}
                      aria-label="Delete"
                      title="Delete thumbnail"
                    >
                      <i className="ri-delete-bin-line" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ LIGHTBOX (portalled) ══════════════════════════════ */}
      {lightboxItem && (
        <AdminLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}
    </div>
  );
}
