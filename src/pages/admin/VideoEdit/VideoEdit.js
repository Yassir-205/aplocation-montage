import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVideos } from '../../../context/VideoContext';
import VideoUploadForm from '../../../components/admin/VideoUploadForm/VideoUploadForm';
import VideoPlayer from '../../../components/shared/VideoPlayer/VideoPlayer';
import '../VideoCreate/VideoCreate.css';
import './VideoEdit.css';

/**
 * Convert a File object to a base64 data URI so it survives localStorage.
 */
function fileToDataUri(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = (e) => resolve(e.target.result);
    reader.onerror = ()  => reject(new Error('Failed to read video file.'));
    reader.readAsDataURL(file);
  });
}

export default function VideoEdit() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { videos, updateVideo } = useVideos();

  const [form,       setForm]       = useState(null);
  const [videoFile,  setVideoFile]  = useState(null);
  const [autoThumb,  setAutoThumb]  = useState(null); // data URI from newly selected video
  const [saving,     setSaving]     = useState(false);
  const [converting, setConverting] = useState(false);
  const [errors,     setErrors]     = useState({});
  const [saveError,  setSaveError]  = useState(null);
  const [notFound,   setNotFound]   = useState(false);

  /* Load existing video into form */
  useEffect(() => {
    const video = videos.find(v => v.id === id);
    if (video) {
      setForm({
        title:       video.title       || '',
        description: video.description || '',
        quality:     video.quality     || 'STANDARD',
        category:    video.category    || '',
        duration:    video.duration    || '',
        status:      video.status      || 'draft',
        videoUrl:    video.videoUrl    || '',
        thumbnail:   video.thumbnail   || '',
      });
    } else if (videos.length > 0) {
      setNotFound(true);
    }
  }, [id, videos]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    return e;
  };

  const submit = async (statusOverride) => {
    setSaveError(null);
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const updateData = {
        ...form,
        status: statusOverride ?? form.status,
      };

      // If a new video file was selected, include it
      if (videoFile) {
        updateData.videoFile = videoFile;
        updateData.thumbnail = autoThumb ?? null;
      }

      const { storageError } = await updateVideo(id, updateData);

      if (storageError) {
        setSaveError(storageError);
        return;
      }

      navigate('/admin/videos');
    } catch (err) {
      console.error(err);
      setSaveError(`Unexpected error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const isBusy = saving || converting;

  if (notFound) return (
    <div className="ve-not-found">
      <i className="ri-error-warning-line" />
      <p>Video not found.</p>
      <button className="btn btn-ghost" onClick={() => navigate('/admin/videos')}>
        Back to Videos
      </button>
    </div>
  );

  if (!form) return (
    <div className="ve-loading">
      <i className="ri-loader-4-line vc-spin" /> Loading video data…
    </div>
  );

  return (
    <div className="vc-page ve-page">

      {/* Header */}
      <div className="vc-header">
        <button className="btn btn-ghost vc-back" onClick={() => navigate('/admin/videos')} disabled={isBusy}>
          <i className="ri-arrow-left-line" /> Back
        </button>
        <div className="vc-header-actions">
          <button className="btn btn-ghost" onClick={() => submit('draft')} disabled={isBusy}>
            <i className="ri-save-line" /> Save Draft
          </button>
        </div>
      </div>

      {/* Storage / conversion error banner */}
      {saveError && (
        <div className="vc-error-banner" role="alert">
          <i className="ri-error-warning-line" />
          <span>{saveError}</span>
          <button className="vc-error-dismiss" onClick={() => setSaveError(null)} aria-label="Dismiss">
            <i className="ri-close-line" />
          </button>
        </div>
      )}

      <div className="vc-body">

        {/* Current video preview — only show if we have a playable URL */}
        {form.videoUrl && (
          <div className="vc-section glass-card ve-preview-section">
            <h3 className="vc-section-title"><i className="ri-eye-line" /> Current Video</h3>
            <div className="ve-player-wrap">
              <VideoPlayer src={form.videoUrl} poster={form.thumbnail} title={form.title} />
            </div>
          </div>
        )}

        {/* Replace video */}
        <div className="vc-section glass-card">
          <h3 className="vc-section-title">
            <i className="ri-upload-2-line" /> Replace Video
            <span className="ve-optional"> (optional)</span>
          </h3>
          <VideoUploadForm
            videoFile={videoFile}
            onFileSelect={setVideoFile}
            onFrameCapture={setAutoThumb}
          />

          {/* Show auto-generated frame when a new video is selected */}
          {videoFile && autoThumb && (
            <div className="vc-auto-thumb-preview">
              <span className="vc-auto-thumb-label">
                <i className="ri-magic-line" /> New auto-generated preview frame
              </span>
              <img src={autoThumb} alt="New preview" className="vc-auto-thumb-img" />
            </div>
          )}

          {/* Show existing thumbnail when no new video selected */}
          {!videoFile && form.thumbnail && (
            <div className="vc-auto-thumb-preview">
              <span className="vc-auto-thumb-label" style={{ color: 'var(--text-secondary)' }}>
                <i className="ri-image-line" /> Current preview frame
              </span>
              <img src={form.thumbnail} alt="Current preview" className="vc-auto-thumb-img" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="vc-section glass-card">
          <h3 className="vc-section-title"><i className="ri-information-line" /> Video Details</h3>
          <div className="vc-form-grid">

            <div className="vc-field vc-field-full">
              <label htmlFor="title">Title *</label>
              <input id="title" name="title" type="text" placeholder="Enter video title…"
                value={form.title} onChange={handleChange} className={errors.title ? 'err' : ''} />
              {errors.title && <span className="vc-error">{errors.title}</span>}
            </div>

            <div className="vc-field vc-field-full">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows={4}
                placeholder="Describe this video project…"
                value={form.description} onChange={handleChange} />
            </div>

            <div className="vc-field vc-field-full">
              <label htmlFor="quality">Quality / Package</label>
              <select id="quality" name="quality" value={form.quality} onChange={handleChange}>
                <option value="BASIC">Basic</option>
                <option value="STANDARD">Standard</option>
                <option value="PREMIUM">Premium</option>
              </select>
            </div>

            <div className="vc-field vc-field-full">
              <button className="btn btn-primary vc-publish-btn" onClick={() => submit('published')} disabled={isBusy}>
                {converting
                  ? <><i className="ri-loader-4-line vc-spin" /> Encoding video…</>
                  : saving
                    ? <><i className="ri-loader-4-line vc-spin" /> Saving…</>
                    : <><i className="ri-check-line" /> Save &amp; Publish</>}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
