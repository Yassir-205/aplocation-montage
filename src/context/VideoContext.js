import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { videoService } from '../services/videoService';

const VideoContext = createContext(null);

export function VideoProvider({ children }) {
  const [videos,  setVideos]  = useState([]);
  const [stats,   setStats]   = useState(null);
  const loading = false; // synchronous service — never in a loading state

  /* Re-read everything from storage into state */
  const refresh = useCallback(async () => {
    const [allVideos, videoStats] = await Promise.all([
      videoService.getAll(),
      Promise.resolve(videoService.getStats())
    ]);
    setVideos(allVideos);
    setStats(videoStats);
  }, []);

  const loadVideos = refresh;
  const loadStats  = refresh;

  /**
   * createVideo — returns { video, storageError }.
   * storageError is null on success, or a string message if storage failed.
   */
  const createVideo = useCallback(async (data) => {
    const result = await videoService.create(data);
    await refresh();
    return result;
  }, [refresh]);

  /**
   * updateVideo — returns { video, storageError }.
   */
  const updateVideo = useCallback(async (id, data) => {
    const result = await videoService.update(id, data);
    await refresh();
    return result;
  }, [refresh]);

  const deleteVideo = useCallback(async (id) => {
    await videoService.delete(id);
    await refresh();
  }, [refresh]);

  const toggleStatus = useCallback((id) => {
    const video = videoService.toggleStatus(id);
    refresh();
    return video;
  }, [refresh]);

  /* Initial load */
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <VideoContext.Provider value={{
      videos, stats, loading,
      loadVideos, loadStats,
      createVideo, updateVideo, deleteVideo, toggleStatus,
    }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideos() {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error('useVideos must be used inside VideoProvider');
  return ctx;
}
