const KEY = 'neditiw_thumbnails';

// ── Helpers ───────────────────────────────────────────────
function writeToStorage(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch (_) {
    // Ignore quota errors — thumbnails are still kept in memory
  }
}

function readFromStorage() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

// ── In-memory store ───────────────────────────────────────
let _thumbnails = readFromStorage();

// ── Service ───────────────────────────────────────────────
export const thumbnailService = {

  getAll() {
    return [..._thumbnails];
  },

  getById(id) {
    return _thumbnails.find(t => t.id === id) || null;
  },

  /**
   * data:
   *  { title: string, dataUri: string (base64 image), fileName: string, size: number }
   */
  create(data) {
    const item = {
      ...data,
      id:        String(Date.now()),
      createdAt: new Date().toISOString().split('T')[0],
    };
    _thumbnails = [item, ..._thumbnails];
    writeToStorage(_thumbnails);
    return item;
  },

  delete(id) {
    _thumbnails = _thumbnails.filter(t => t.id !== id);
    writeToStorage(_thumbnails);
    return true;
  },

  getStats() {
    return { total: _thumbnails.length };
  },
};
