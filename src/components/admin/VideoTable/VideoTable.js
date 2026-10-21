import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QualityBadge from '../../shared/QualityBadge/QualityBadge';
import Modal from '../../shared/Modal/Modal';
import VideoPlayer from '../../shared/VideoPlayer/VideoPlayer';
import { useVideos } from '../../../context/VideoContext';
import './VideoTable.css';

export default function VideoTable({ videos }) {
  const navigate                        = useNavigate();
  const { deleteVideo, toggleStatus }   = useVideos();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  const [changingStatus, setChangingStatus] = useState(null);
const confirmDelete = async () => {
  if (!deleteTarget || deleting) return;

  setDeleting(true);

  try {
    await deleteVideo(deleteTarget.id);
    setDeleteTarget(null);
  } catch (error) {
    console.error('Delete failed:', error);
    alert('Delete failed: ' + error.message);
  } finally {
    setDeleting(false);
  }
};


  if (!videos || videos.length === 0) {
    return (
      <div className="vt-empty">
        <i className="ri-film-line" />
        <p>No videos yet.</p>
        <button className="btn btn-primary" onClick={() => navigate('/admin/videos/create')}>
          <i className="ri-add-circle-line" /> Add First Video
        </button>
      </div>
    );
  }



const handleToggleStatus = async (id) => {
  if (changingStatus) return;

  setChangingStatus(id);

  try {
    await toggleStatus(id);
  } catch (error) {
    console.error('Status update failed:', error);
    alert('Failed to change status: ' + error.message);
  } finally {
    setChangingStatus(null);
  }
};

  return (
    <>
      <div className="vt-wrap">
        <table className="vt-table">
          <thead>
            <tr>
              <th>Video</th>
              <th>Category</th>
              <th>Quality</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map(v => (
              <tr key={v.id} className="vt-row">

                {/* Thumbnail + title */}
                <td className="vt-td-video">
                  <div className="vt-video-cell">
                    <div className="vt-thumb">
                      {v.thumbnail
                        ? <img src={v.thumbnail} alt={v.title} />
                        : <div className="vt-thumb-placeholder"><i className="ri-film-line" /></div>
                      }
                    </div>
                    <div className="vt-video-info">
                      <p className="vt-title">{v.title}</p>
                      {v.duration && (
                        <p className="vt-duration"><i className="ri-time-line" /> {v.duration}</p>
                      )}
                    </div>
                  </div>
                </td>

                <td data-label="Category">
                  <span className="vt-category">{v.category}</span>
                </td>

                <td data-label="Quality">
                  <QualityBadge quality={v.quality} />
                </td>

                <td data-label="Status">
                  <button
                    className={`vt-status-btn${v.status === 'published' ? ' published' : ' draft'}`}
                    onClick={() => handleToggleStatus(v.id)}
disabled={changingStatus !== null}
                    title="Click to toggle"
                  >
                    <span className="vt-status-dot" />
                    {v.status === 'published' ? 'Published' : 'Draft'}
                  </button>
                </td>

                <td data-label="Date">
                  <span className="vt-date">{v.createdAt}</span>
                </td>

                <td data-label="Actions">
                  <div className="vt-actions">
                    <button className="vt-action-btn vt-preview" title="Preview"
                      onClick={() => setPreviewVideo(v)}>
                      <i className="ri-play-circle-line" />
                    </button>
                    <button className="vt-action-btn vt-edit" title="Edit"
                      onClick={() => navigate(`/admin/videos/${v.id}/edit`)}>
                      <i className="ri-edit-line" />
                    </button>
                    <button className="vt-action-btn vt-delete" title="Delete"
                      onClick={() => setDeleteTarget(v)}>
                      <i className="ri-delete-bin-line" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirm modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Video" size="sm">
        <div className="vt-delete-modal">
          <div className="vt-delete-icon"><i className="ri-delete-bin-2-line" /></div>
          <p>Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>?</p>
          <p className="vt-delete-sub">This action cannot be undone.</p>
          <div className="vt-delete-btns">
            <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
            <button className="btn vt-btn-danger" onClick={confirmDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Preview modal */}
      <Modal isOpen={!!previewVideo} onClose={() => setPreviewVideo(null)}
        title={previewVideo?.title} size="lg">
        {previewVideo && (

<VideoPlayer
  src={
    previewVideo.sourceType === 'upload'
      ? previewVideo.videoUrl
      : previewVideo.externalUrl
  }
  poster={previewVideo.thumbnail}
  title={previewVideo.title}
  sourceType={previewVideo.sourceType || 'upload'}
/>

        )}
      </Modal>
    </>
  );
}
