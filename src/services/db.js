/**
 * IndexedDB wrapper for storing video files in the browser.
 * 
 * Unlike localStorage (5-10MB limit), IndexedDB can store hundreds of MB.
 * Videos persist across page reloads and deployments.
 */

const DB_NAME = 'neditiw_videos_db';
const DB_VERSION = 1;
const STORE_NAME = 'video_files';

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      dbPromise = null;
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });

  return dbPromise;
}

export const videoFileDB = {
  /** Store a video file (Blob/File) with the given ID */
  async saveFile(id, file) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put({ id, file, savedAt: Date.now() });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save video file'));
    });
  },

  /** Retrieve a video file by ID, returns null if not found */
  async getFile(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);
      
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.file : null);
      };
      request.onerror = () => reject(new Error('Failed to retrieve video file'));
    });
  },

  /** Delete a video file by ID */
  async deleteFile(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete video file'));
    });
  },

  /** Get all stored video file IDs */
  async getAllFileIds() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAllKeys();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get file IDs'));
    });
  }
};
