
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import { videoService } from '../services/videoService';

const VideoContext = createContext(null);

export function VideoProvider({ children }) {
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [allVideos, videoStats] = await Promise.all([
        videoService.getAll(),
        videoService.getStats()
      ]);

      setVideos(allVideos);
      setStats(videoStats);

      return allVideos;
    } catch (err) {
      console.error('Failed to load videos:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadVideos = refresh;
  const loadStats = refresh;

  const createVideo = useCallback(async (data) => {
    const result = await videoService.create(data);

    if (!result.storageError) {
      await refresh();
    }

    return result;
  }, [refresh]);

  const updateVideo = useCallback(async (id, data) => {
    const result = await videoService.update(id, data);

    if (!result.storageError) {
      await refresh();
    }

    return result;
  }, [refresh]);

  const deleteVideo = useCallback(async (id) => {
    await videoService.delete(id);
    await refresh();
  }, [refresh]);

  const toggleStatus = useCallback(async (id) => {
    const video = await videoService.toggleStatus(id);
    await refresh();
    return video;
  }, [refresh]);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  return (
    <VideoContext.Provider
      value={{
        videos,
        stats,
        loading,
        error,
        loadVideos,
        loadStats,
        createVideo,
        updateVideo,
        deleteVideo,
        toggleStatus
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideos() {
  const context = useContext(VideoContext);

  if (!context) {
    throw new Error(
      'useVideos must be used inside VideoProvider'
    );
  }

  return context;
}
