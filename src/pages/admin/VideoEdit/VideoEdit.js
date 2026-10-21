
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVideos } from '../../../context/VideoContext';
import VideoUploadForm from '../../../components/admin/VideoUploadForm/VideoUploadForm';
import VideoPlayer from '../../../components/shared/VideoPlayer/VideoPlayer';
import '../VideoCreate/VideoCreate.css';
import './VideoEdit.css';

export default function VideoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { videos, loading, updateVideo, loadVideos } = useVideos();

  const [form, setForm] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [autoThumb, setAutoThumb] = useState(null);
  const [sourceType, setSourceType] = useState('upload');
  const [externalUrl, setExternalUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState(null);

  const video = videos.find(v => v.id === id);

  useEffect(() => {
    if (video) {
      setForm({
        title: video.title || '',
        description: video.description || '',
        quality: video.quality || 'STANDARD',
        status: video.status || 'draft',
        category: video.category || 'Commercial',
        duration: video.duration || '',
        thumbnail: video.thumbnail || '',
        videoUrl: video.videoUrl || '',
      });

      setSourceType(video.sourceType || 'upload');
      setExternalUrl(video.externalUrl || '');
    }
  }, [video]);

  useEffect(() => {
    if (!video && !loading) {
      loadVideos().catch(console.error);
    }
    // Initial load is normally handled by VideoProvider
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const result = {};

    if (!form?.title?.trim()) {
      result.title = 'Title is required.';
    }

    if (sourceType !== 'upload') {
      try {
        const url = new URL(externalUrl);
        const host = url.hostname.toLowerCase();

        const allowed = sourceType === 'youtube'
          ? ['youtube.com', 'www.youtube.com',
             'm.youtube.com', 'youtu.be']
          : ['instagram.com', 'www.instagram.com'];

        if (url.protocol !== 'https:' || !allowed.includes(host)) {
          throw new Error('Invalid URL');
        }
      } catch {
        result.video = 'Please enter a valid video URL.';
      }
    }

    return result;
  };

  const submit = async (status) => {
    if (saving || !form) return;

    setSaveError(null);
    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);

    try {
      const data = {
        title: form.title.trim(),
        description: form.description,
        quality: form.quality,
        category: form.category,
        duration: form.duration,
        status,
        sourceType,
        externalUrl: sourceType === 'upload'
          ? null
          : externalUrl.trim(),
      };

      if (sourceType === 'upload' && videoFile) {
        data.videoFile = videoFile;
        data.thumbnail = autoThumb;
      }

      const { storageError } = await updateVideo(id, data);

      if (storageError) {
        setSaveError(storageError);
        return;
      }

      navigate('/admin/videos');
    } catch (err) {
      console.error('Update failed:', err);
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !form) {
    return <div className="ve-loading">Loading video data...</div>;
  }

  if (!video && !form) {
    return (
      <div className="ve-not-found">
        <p>Video not found.</p>
        <button
          className="btn btn-ghost"
          onClick={() => navigate('/admin/videos')}
        >
          Back to Videos
        </button>
      </div>
    );
  }

  if (!form) {
    return <div className="ve-loading">Loading...</div>;
  }

  return (
    <div className="vc-page ve-page">
      <div className="vc-header">
        <button
          className="btn btn-ghost vc-back"
          onClick={() => navigate('/admin/videos')}
          disabled={saving}
        >
          <i className="ri-arrow-left-line" /> Back
        </button>

        <div className="vc-header-actions">
          <button
            className="btn btn-ghost"
            onClick={() => submit('draft')}
            disabled={saving}
          >
            <i className="ri-save-line" /> Save Draft
          </button>
        </div>
      </div>

      {saveError && (
        <div className="vc-error-banner" role="alert">
          <span>{saveError}</span>
        </div>
      )}

      <div className="vc-body">
        <div className="vc-section glass-card ve-preview-section">
          <h3 className="vc-section-title">Current Video</h3>

          <div className="ve-player-wrap">
            <VideoPlayer
              src={
                sourceType === 'upload'
                  ? form.videoUrl
                  : externalUrl
              }
              poster={form.thumbnail}
              title={form.title}
              sourceType={sourceType}
            />
          </div>
        </div>

        <div className="vc-section glass-card">
          <h3 className="vc-section-title">
            Replace Video (optional)
          </h3>

          <VideoUploadForm
            videoFile={videoFile}
            onFileSelect={setVideoFile}
            onFrameCapture={setAutoThumb}
            sourceType={sourceType}
            onSourceTypeChange={setSourceType}
            externalUrl={externalUrl}
            onExternalUrlChange={setExternalUrl}
          />

          {errors.video && (
            <p className="vc-error">{errors.video}</p>
          )}

          {videoFile && autoThumb && (
            <div className="vc-auto-thumb-preview">
              <span className="vc-auto-thumb-label">
                New preview frame
              </span>
              <img
                src={autoThumb}
                alt="New preview"
                className="vc-auto-thumb-img"
              />
            </div>
          )}

          {!videoFile && form.thumbnail && (
            <div className="vc-auto-thumb-preview">
              <span className="vc-auto-thumb-label">
                Current preview frame
              </span>
              <img
                src={form.thumbnail}
                alt="Current preview"
                className="vc-auto-thumb-img"
              />
            </div>
          )}
        </div>

        <div className="vc-section glass-card">
          <h3 className="vc-section-title">Video Details</h3>

          <div className="vc-form-grid">
            <div className="vc-field vc-field-full">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
              />
              {errors.title && (
                <span className="vc-error">{errors.title}</span>
              )}
            </div>

            <div className="vc-field vc-field-full">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="vc-field vc-field-full">
              <label htmlFor="quality">Quality / Package</label>
              <select
                id="quality"
                name="quality"
                value={form.quality}
                onChange={handleChange}
              >
                <option value="BASIC">Basic</option>
                <option value="STANDARD">Standard</option>
                <option value="PREMIUM">Premium</option>
              </select>
            </div>

            <div className="vc-field vc-field-full">
              <button
                className="btn btn-primary vc-publish-btn"
                onClick={() => submit('published')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save & Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
