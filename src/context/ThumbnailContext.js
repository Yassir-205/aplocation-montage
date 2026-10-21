
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import { thumbnailService } from '../services/thumbnailService';

const ThumbnailContext = createContext(null);

export function ThumbnailProvider({ children }) {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const items = await thumbnailService.getAll();
      setThumbnails(items);
      return items;
    } catch (err) {
      console.error('Failed to load thumbnails:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  const createThumbnail = useCallback(async (data) => {
    const item = await thumbnailService.create(data);
    await refresh();
    return item;
  }, [refresh]);

  const deleteThumbnail = useCallback(async (id) => {
    await thumbnailService.delete(id);
    await refresh();
  }, [refresh]);

  return (
    <ThumbnailContext.Provider value={{
      thumbnails,
      loading,
      error,
      refresh,
      createThumbnail,
      deleteThumbnail
    }}>
      {children}
    </ThumbnailContext.Provider>
  );
}

export function useThumbnails() {
  const ctx = useContext(ThumbnailContext);

  if (!ctx) {
    throw new Error(
      'useThumbnails must be used inside ThumbnailProvider'
    );
  }

  return ctx;
}
