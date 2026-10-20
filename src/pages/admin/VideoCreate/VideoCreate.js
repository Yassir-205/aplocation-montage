import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideos } from '../../../context/VideoContext';
import VideoUploadForm from '../../../components/admin/VideoUploadForm/VideoUploadForm';
import './VideoCreate.css';

const EMPTY_FORM = {
  title:       '',
  description: '',
  quality:     'STANDARD',
};

/**
 * Convert a File object to a base64 data URI.
 * This is the only way to persist binary files through localStorage.
 */
function fileToDataUri(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = (e) => resolve(e.target.result);
    reader.onerror = ()  => reject(new Error('Failed to read video file.'));
    reader.readAsDataURL(file);
  });
}

export default function VideoCreate() {
  const navigate = useNavigate();
  const { createVideo } = useVideos();

  const [form,        setForm]        = useState(EMPTY_FORM);
  const [videoFile,   setVideoFile]   = useState(null);
  const [autoThumb,   setAutoThumb]   = useState(null); // data URI captured from video
  const [saving,      setSaving]      = useState(false);
  const [converting,  setConverting]  = useState(false); // true while FileReader encodes video
  const [errors,      setErrors]      = useState({});
  const [saveError,   setSaveError]   = useState(null); // storage quota / IO errors

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
      const { storageError } = await createVideo({
        ...form,
        status:        statusOverride,
        category:      'Commercial',
        duration:      '',
        videoFile:     videoFile,  // Pass the File object directly
        thumbnail:     autoThumb ?? null,
        videoFileName: videoFile ? videoFile.name : null,
        featured:      false,
        views:         0,
      });

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

  return (
    <div className="vc-page">

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

        <div className="vc-section glass-card">
          <h3 className="vc-section-title"><i className="ri-upload-2-line" /> Upload Video</h3>
          <VideoUploadForm
            videoFile={videoFile}
            onFileSelect={setVideoFile}
            onFrameCapture={setAutoThumb}
          />

          {/* Auto-thumbnail preview */}
          {autoThumb && (
            <div className="vc-auto-thumb-preview">
              <span className="vc-auto-thumb-label">
                <i className="ri-magic-line" /> Auto-generated preview frame
              </span>
              <img src={autoThumb} alt="Auto preview" className="vc-auto-thumb-img" />
            </div>
          )}
        </div>

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
              <label htmlFor="quality">Quality / Package *</label>
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
                    : <><i className="ri-upload-cloud-line" /> Publish Video</>}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
