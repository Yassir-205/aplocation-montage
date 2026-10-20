import React, { createContext, useContext, useState, useCallback } from 'react';
import { thumbnailService } from '../services/thumbnailService';

const ThumbnailContext = createContext(null);

export function ThumbnailProvider({ children }) {
  const [thumbnails, setThumbnails] = useState(() => thumbnailService.getAll());

  const refresh = useCallback(() => {
    setThumbnails(thumbnailService.getAll());
  }, []);

  const createThumbnail = useCallback((data) => {
    const item = thumbnailService.create(data);
    refresh();
    return item;
  }, [refresh]);

  const deleteThumbnail = useCallback((id) => {
    thumbnailService.delete(id);
    refresh();
  }, [refresh]);

  return (
    <ThumbnailContext.Provider value={{ thumbnails, createThumbnail, deleteThumbnail }}>
      {children}
    </ThumbnailContext.Provider>
  );
}

export function useThumbnails() {
  const ctx = useContext(ThumbnailContext);
  if (!ctx) throw new Error('useThumbnails must be used inside ThumbnailProvider');
  return ctx;
}
