import React, { useState, useRef, useCallback } from 'react';
import './VideoUploadForm.css';

/**
 * VideoUploadForm — video-only upload.
 * Thumbnail is no longer uploaded manually; it is auto-generated from the video.
 *
 * Props:
 *   videoFile        File | null   – currently selected video file
 *   onFileSelect     (File|null) => void
 *   onFrameCapture   (dataUri: string | null) => void  – called once a frame is extracted
 */
export default function VideoUploadForm({ onFileSelect, videoFile, onFrameCapture }) {
  const [videoDrag,    setVideoDrag]    = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [capturing,    setCapturing]    = useState(false);
  const videoInputRef = useRef(null);
  const videoElRef    = useRef(null);

  /* ── Extract a frame at ~1 s via canvas ── */
  const captureFrame = useCallback((videoEl) => {
    return new Promise((resolve) => {
      const doCapture = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width  = videoEl.videoWidth  || 1280;
          canvas.height = videoEl.videoHeight || 720;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.80));
        } catch (_) {
          resolve(null);
        }
      };

      if (videoEl.readyState >= 2) {
        // Metadata already loaded — seek to capture point
        videoEl.currentTime = Math.min(1, videoEl.duration * 0.1 || 1);
      }

      videoEl.addEventListener('seeked', doCapture, { once: true });

      // Fallback: if seeked never fires within 4 s, capture whatever frame is available
      setTimeout(() => {
        videoEl.removeEventListener('seeked', doCapture);
        doCapture();
      }, 4000);
    });
  }, []);

  const handleVideoLoaded = useCallback(async (e) => {
    const videoEl = e.currentTarget;
    setCapturing(true);
    // Seek to 1 s (or 10 % of duration) to get a meaningful frame
    videoEl.currentTime = Math.min(1, (videoEl.duration || 10) * 0.1);
    const dataUri = await captureFrame(videoEl);
    setCapturing(false);
    onFrameCapture?.(dataUri);
  }, [captureFrame, onFrameCapture]);

  /* ── File selection ── */
  const handleVideoFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file.');
      return;
    }
    onFileSelect(file);
    onFrameCapture?.(null); // reset previous capture
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  }, [onFileSelect, onFrameCapture]);

  const handleVideoDrop = (e) => {
    e.preventDefault();
    setVideoDrag(false);
    handleVideoFile(e.dataTransfer.files[0]);
  };

  const removeVideo = () => {
    onFileSelect(null);
    onFrameCapture?.(null);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const fmtSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="vuf-single">
      {/* ── VIDEO UPLOAD ── */}
      <div className="vuf-section">
        <label className="vuf-label">
          <i className="ri-film-line" /> Video File
          <span className="vuf-label-hint">
            <i className="ri-magic-line" /> Preview frame auto-generated
          </span>
        </label>

        {!videoFile ? (
          <div
            className={`vuf-dropzone${videoDrag ? ' drag-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setVideoDrag(true); }}
            onDragLeave={() => setVideoDrag(false)}
            onDrop={handleVideoDrop}
            onClick={() => videoInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && videoInputRef.current?.click()}
          >
            <div className="vuf-dz-icon">
              <i className="ri-upload-cloud-2-line" />
            </div>
            <p className="vuf-dz-title">Drag &amp; Drop your video here</p>
            <p className="vuf-dz-sub">or</p>
            <span className="vuf-dz-btn">Choose Video</span>
            <p className="vuf-dz-hint">MP4, MOV, AVI, MKV · Max 2 GB</p>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="vuf-hidden-input"
              onChange={(e) => handleVideoFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="vuf-preview-card glass-card">
            {videoPreview && (
              <video
                ref={videoElRef}
                className="vuf-video-preview"
                src={videoPreview}
                controls
                preload="metadata"
                onLoadedMetadata={handleVideoLoaded}
              />
            )}
            {capturing && (
              <div className="vuf-capture-banner">
                <i className="ri-loader-4-line vuf-spin" /> Generating preview frame…
              </div>
            )}
            <div className="vuf-file-info">
              <div className="vuf-file-icon"><i className="ri-film-line" /></div>
              <div className="vuf-file-meta">
                <p className="vuf-file-name">{videoFile.name}</p>
                <p className="vuf-file-size">{fmtSize(videoFile.size)}</p>
              </div>
              <button className="vuf-remove-btn" onClick={removeVideo} aria-label="Remove video">
                <i className="ri-close-line" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
