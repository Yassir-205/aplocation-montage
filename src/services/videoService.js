import { videoFileDB } from './db';

const KEY = 'neditiw_videos';

// Cache of blob URLs created this session (to avoid recreating them)
const _blobUrlCache = new Map();

// ── Storage helpers ───────────────────────────────────────

function readFromStorage() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

/**
 * Save video metadata to localStorage (without blob URLs).
 * Actual video files are stored in IndexedDB separately.
 */
function writeToStorage(videos) {
  try {
    // Only save metadata, never blob URLs
    const safe = videos.map(v => ({
      ...v,
      videoUrl: v.videoUrl && v.videoUrl.startsWith('blob:') ? null : v.videoUrl,
    }));
    localStorage.setItem(KEY, JSON.stringify(safe));
    return null;
  } catch (err) {
    if (
      err instanceof DOMException &&
      (err.code === 22 ||
        err.code === 1014 ||
        err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    ) {
      return 'Storage quota exceeded. Try clearing some data.';
    }
    return `Storage error: ${err.message}`;
  }
}

// ── In-memory store (source of truth during the session) ──
let _videos = readFromStorage();

/**
 * Load a video's blob URL from IndexedDB if it was stored there.
 * Creates a new blob: URL from the stored File/Blob.
 */
async function loadVideoUrl(video) {
  // If there's already a valid external URL, use it
  if (video.videoUrl && !video.videoUrl.startsWith('blob:')) {
    return video.videoUrl;
  }

  // Check cache first
  if (_blobUrlCache.has(video.id)) {
    return _blobUrlCache.get(video.id);
  }

  // Try to load from IndexedDB
  try {
    const file = await videoFileDB.getFile(video.id);
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      _blobUrlCache.set(video.id, blobUrl);
      return blobUrl;
    }
  } catch (err) {
    console.error('Failed to load video from IndexedDB:', err);
  }

  return null;
}

export const videoService = {

  async getAll() {
    // Load blob URLs from IndexedDB for all videos
    const videosWithUrls = await Promise.all(
      _videos.map(async (v) => ({
        ...v,
        videoUrl: await loadVideoUrl(v)
      }))
    );
    return videosWithUrls;
  },

  async getPublished() {
    const all = await this.getAll();
    return all.filter(v => v.status === 'published');
  },

  getById(id) {
    return _videos.find(v => v.id === id) || null;
  },

  async create(data) {
    const newVideo = {
      ...data,
      id:        String(Date.now()),
      createdAt: new Date().toISOString().split('T')[0],
      views:     data.views ?? 0,
    };

    // If there's a video file, store it in IndexedDB
    if (data.videoFile) {
      try {
        await videoFileDB.saveFile(newVideo.id, data.videoFile);
        // Create blob URL for immediate playback
        const blobUrl = URL.createObjectURL(data.videoFile);
        _blobUrlCache.set(newVideo.id, blobUrl);
        newVideo.videoUrl = blobUrl;
      } catch (err) {
        console.error('Failed to save video file:', err);
        return { video: null, storageError: 'Failed to save video file. Your browser may not support large file storage.' };
      }
    }

    _videos = [newVideo, ..._videos];
    const storageError = writeToStorage(_videos);
    if (storageError) {
      // Clean up
      _videos = _videos.filter(v => v.id !== newVideo.id);
      if (data.videoFile) {
        await videoFileDB.deleteFile(newVideo.id);
        if (_blobUrlCache.has(newVideo.id)) {
          URL.revokeObjectURL(_blobUrlCache.get(newVideo.id));
          _blobUrlCache.delete(newVideo.id);
        }
      }
      return { video: null, storageError };
    }
    return { video: newVideo, storageError: null };
  },

  async update(id, data) {
    const prev = _videos;
    _videos = _videos.map(v => v.id === id ? { ...v, ...data } : v);

    // If there's a new video file, store it in IndexedDB
    if (data.videoFile) {
      try {
        await videoFileDB.saveFile(id, data.videoFile);
        // Create blob URL for immediate playback
        const blobUrl = URL.createObjectURL(data.videoFile);
        if (_blobUrlCache.has(id)) {
          URL.revokeObjectURL(_blobUrlCache.get(id));
        }
        _blobUrlCache.set(id, blobUrl);
        // Update the video URL in memory
        _videos = _videos.map(v => v.id === id ? { ...v, videoUrl: blobUrl } : v);
      } catch (err) {
        console.error('Failed to save video file:', err);
        _videos = prev;
        return { video: null, storageError: 'Failed to save video file.' };
      }
    }

    const storageError = writeToStorage(_videos);
    if (storageError) {
      _videos = prev;
      return { video: null, storageError };
    }
    return { video: _videos.find(v => v.id === id), storageError: null };
  },

  async delete(id) {
    _videos = _videos.filter(v => v.id !== id);
    writeToStorage(_videos);

    // Clean up IndexedDB and blob URL cache
    try {
      await videoFileDB.deleteFile(id);
    } catch (err) {
      console.error('Failed to delete video file:', err);
    }

    if (_blobUrlCache.has(id)) {
      URL.revokeObjectURL(_blobUrlCache.get(id));
      _blobUrlCache.delete(id);
    }

    return true;
  },

  toggleStatus(id) {
    _videos = _videos.map(v =>
      v.id === id
        ? { ...v, status: v.status === 'published' ? 'draft' : 'published' }
        : v
    );
    writeToStorage(_videos);
    return _videos.find(v => v.id === id);
  },

  getStats() {
    return {
      total:     _videos.length,
      published: _videos.filter(v => v.status === 'published').length,
      draft:     _videos.filter(v => v.status === 'draft').length,
      premium:   _videos.filter(v => v.quality === 'PREMIUM').length,
      standard:  _videos.filter(v => v.quality === 'STANDARD').length,
      basic:     _videos.filter(v => v.quality === 'BASIC').length,
    };
  },
};
