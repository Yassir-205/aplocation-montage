
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideos } from '../../../context/VideoContext';
import VideoUploadForm from '../../../components/admin/VideoUploadForm/VideoUploadForm';
import './VideoCreate.css';

const EMPTY_FORM = {
  title: '',
  description: '',
  quality: 'STANDARD',
};

export default function VideoCreate() {
  const navigate = useNavigate();
  const { createVideo } = useVideos();

  const [form, setForm] = useState(EMPTY_FORM);
  const [videoFile, setVideoFile] = useState(null);
  const [autoThumb, setAutoThumb] = useState(null);
  const [customThumb, setCustomThumb] = useState(null);
  const [sourceType, setSourceType] = useState('upload');
  const [externalUrl, setExternalUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = 'Title is required.';
    }

    if (sourceType === 'upload' && !videoFile) {
      newErrors.video = 'Please select an MP4 video.';
    }

    if (sourceType !== 'upload') {
      try {
        const url = new URL(externalUrl.trim());
        const host = url.hostname.toLowerCase();

        const allowed =
          sourceType === 'youtube'
            ? ['youtube.com', 'www.youtube.com',
              'm.youtube.com', 'youtu.be']
            : ['instagram.com', 'www.instagram.com'];

        if (url.protocol !== 'https:' || !allowed.includes(host)) {
          throw new Error('Invalid host');
        }
      } catch {
        newErrors.video = `Please enter a valid ${sourceType} URL.`;
      }
    }

    return newErrors;
  };

  const submit = async (status) => {
    if (saving) return;

    setSaveError(null);

    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);

    try {
      const { storageError } = await createVideo({
        ...form,
        title: form.title.trim(),
        status,
        category: 'Commercial',
        duration: '',
        sourceType,
        externalUrl:
          sourceType === 'upload' ? null : externalUrl.trim(),
        videoFile:
          sourceType === 'upload' ? videoFile : null,
        thumbnail:
          sourceType === 'upload' ? autoThumb : customThumb,
        featured: false,
        views: 0,
      });

      if (storageError) {
        setSaveError(storageError);
        return;
      }

      navigate('/admin/videos');
    } catch (error) {
      console.error('Publish failed:', error);
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="vc-page">
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
          <i className="ri-error-warning-line" />
          <span>{saveError}</span>
          <button
            className="vc-error-dismiss"
            onClick={() => setSaveError(null)}
            aria-label="Dismiss"
          >
            <i className="ri-close-line" />
          </button>
        </div>
      )}

      <div className="vc-body">
        <div className="vc-section glass-card">
          <h3 className="vc-section-title">
            <i className="ri-upload-2-line" /> Upload Video
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

          {sourceType !== 'upload' && (
            <div className="vc-auto-thumb-preview">
              <label
                htmlFor="customThumbnail"
                className="vc-auto-thumb-label"
              >
                <i className="ri-image-add-line" />
                Choose Custom Thumbnail (JPG, PNG, WebP)
              </label>

              <input
                id="customThumbnail"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (file.size > 10 * 1024 * 1024) {
                    alert('Maximum thumbnail size is 10 MB.');
                    e.target.value = '';
                    return;
                  }

                  const reader = new FileReader();
                  reader.onload = () => {
                    setCustomThumb(reader.result);
                  };
                  reader.readAsDataURL(file);
                }}
              />

              {customThumb && (
                <img
                  src={customThumb}
                  alt="Custom thumbnail preview"
                  className="vc-auto-thumb-img"
                />
              )}
            </div>
          )}

          {errors.video && (
            <p className="vc-error" role="alert">
              {errors.video}
            </p>
          )}

          {autoThumb && sourceType === 'upload' && (
            <div className="vc-auto-thumb-preview">
              <span className="vc-auto-thumb-label">
                <i className="ri-magic-line" />
                Auto-generated preview frame
              </span>
              <img
                src={autoThumb}
                alt="Auto preview"
                className="vc-auto-thumb-img"
              />
            </div>
          )}
        </div>

        <div className="vc-section glass-card">
          <h3 className="vc-section-title">
            <i className="ri-information-line" /> Video Details
          </h3>

          <div className="vc-form-grid">
            <div className="vc-field vc-field-full">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter video title..."
                value={form.title}
                onChange={handleChange}
                className={errors.title ? 'err' : ''}
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
                placeholder="Describe this video project..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="vc-field vc-field-full">
              <label htmlFor="quality">Quality / Package *</label>
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
                {saving ? (
                  <>
                    <i className="ri-loader-4-line vc-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <i className="ri-upload-cloud-line" />
                    Publish Video
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
