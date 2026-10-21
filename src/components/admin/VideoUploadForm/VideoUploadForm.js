
import React, { useState, useRef, useEffect } from 'react';
import './VideoUploadForm.css';

export default function VideoUploadForm({
  videoFile,
  onFileSelect,
  onFrameCapture,
  sourceType = 'upload',
  onSourceTypeChange = () => {},
  externalUrl = '',
  onExternalUrlChange = () => {},
}) {
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!videoFile) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(videoFile);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const handleFile = (file) => {
    if (!file) return;

    if (file.type !== 'video/mp4') {
      alert('Please select an MP4 video.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('Max 50 MB. Use YouTube for larger videos.');
      return;
    }

    onFileSelect(file);
    onFrameCapture?.(null);
  };

  const captureThumbnail = (event) => {
    const video = event.currentTarget;
    setCapturing(true);

    const capture = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        canvas.getContext('2d').drawImage(
          video, 0, 0, canvas.width, canvas.height
        );

        onFrameCapture?.(canvas.toDataURL('image/jpeg', 0.8));
      } catch (error) {
        console.error('Thumbnail capture failed:', error);
        onFrameCapture?.(null);
      } finally {
        setCapturing(false);
      }
    };

    video.addEventListener('seeked', capture, { once: true });
    video.currentTime = Math.min(
      1,
      Number.isFinite(video.duration) ? video.duration / 2 : 1
    );
  };

  const chooseSource = (type) => {
    onSourceTypeChange(type);
    onFileSelect(null);
    onFrameCapture?.(null);
    onExternalUrlChange('');
  };

  return (
    <div className="vuf-single">
      <div className="vuf-section">
        <label className="vuf-label">Video Source</label>

        <div className="vuf-source-options">
          {[
            ['upload', 'Upload MP4'],
            ['youtube', 'YouTube'],
            ['instagram', 'Instagram Reel'],
          ].map(([type, label]) => (
            <button
              key={type}
              type="button"
              className={`btn ${
                sourceType === type ? 'btn-primary' : 'btn-ghost'
              }`}
              onClick={() => chooseSource(type)}
            >
              {label}
            </button>
          ))}
        </div>

        {sourceType === 'upload' ? (
          <>
            {!videoFile ? (
              <div
                className={`vuf-dropzone${drag ? ' drag-over' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDrag(false);
                  handleFile(e.dataTransfer.files[0]);
                }}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') inputRef.current?.click();
                }}
              >
                <div className="vuf-dz-icon">
                  <i className="ri-upload-cloud-2-line" />
                </div>
                <p className="vuf-dz-title">
                  Drag & Drop your video here
                </p>
                <span className="vuf-dz-btn">Choose Video</span>
                <p className="vuf-dz-hint">MP4 · Max 50 MB</p>

                <input
                  ref={inputRef}
                  type="file"
                  accept="video/mp4"
                  className="vuf-hidden-input"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            ) : (
              <div className="vuf-preview-card glass-card">
                <video
                  src={preview || undefined}
                  className="vuf-video-preview"
                  controls
                  preload="metadata"
                  onLoadedMetadata={captureThumbnail}
                />

                {capturing && <p>Generating preview frame...</p>}

                <div className="vuf-file-info">
                  <span>{videoFile.name}</span>
                  <button
                    type="button"
                    className="vuf-remove-btn"
                    onClick={() => {
                      onFileSelect(null);
                      onFrameCapture?.(null);
                    }}
                  >
                    <i className="ri-close-line" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="vuf-section">
            <label className="vuf-label">
              {sourceType === 'youtube'
                ? 'YouTube URL'
                : 'Instagram Reel URL'}
            </label>

            <input
              type="url"
              className="vc-field-input"
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 12,
                border: '1px solid #ddd0ff',
              }}
              placeholder={
                sourceType === 'youtube'
                  ? 'https://www.youtube.com/watch?v=...'
                  : 'https://www.instagram.com/reel/...'
              }
              value={externalUrl}
              onChange={(e) => onExternalUrlChange(e.target.value)}
            />

            <p className="vuf-dz-hint">
              {sourceType === 'youtube'
                ? 'Video will be displayed using YouTube player.'
                : 'Visitors will open the original Instagram Reel.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
