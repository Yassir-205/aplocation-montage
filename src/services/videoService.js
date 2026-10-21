
import { supabase } from '../lib/supabase';

const VIDEO_BUCKET = 'videos';
const THUMB_BUCKET = 'thumbnails';
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

function getYouTubeThumbnail(videoUrl) {
  if (!videoUrl) return null;

  try {
    const url = new URL(videoUrl);
    const host = url.hostname.toLowerCase();
    let videoId = null;

    if (host === 'youtu.be') {
      videoId = url.pathname.split('/')[1];
    } else if (
      ['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)
    ) {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v');
      } else if (
        url.pathname.startsWith('/shorts/') ||
        url.pathname.startsWith('/embed/') ||
        url.pathname.startsWith('/live/')
      ) {
        videoId = url.pathname.split('/')[2];
      }
    }

    if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return null;
    }

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  } catch {
    return null;
  }
}

function formatVideo(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    category: row.category || 'Commercial',
    quality: row.quality || 'STANDARD',
    status: row.status,
    sourceType: row.source_type || 'upload',
    externalUrl: row.external_url || '',
    videoUrl: row.video_url || '',
    videoPath: row.video_path,

thumbnail:
  row.thumbnail_url ||
  (row.source_type === 'youtube'
    ? getYouTubeThumbnail(row.external_url)
    : null),

    thumbnailPath: row.thumbnail_path,
    duration: row.duration || '',
    featured: row.featured || false,
    views: row.views || 0,
    createdAt: row.created_at?.split('T')[0] || '',
  };
}

function validateExternalUrl(type, value) {
  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error('Please enter a valid video URL.');
  }

  const host = url.hostname.toLowerCase();

  if (url.protocol !== 'https:') {
    throw new Error('Video URL must use HTTPS.');
  }

  if (type === 'youtube' &&
      !['youtube.com', 'www.youtube.com',
        'm.youtube.com', 'youtu.be'].includes(host)) {
    throw new Error('Please enter a YouTube URL.');
  }

  if (type === 'instagram' &&
      !['instagram.com', 'www.instagram.com'].includes(host)) {
    throw new Error('Please enter an Instagram URL.');
  }

  return url.href;
}

async function uploadThumbnail(dataUri) {
  if (!dataUri) return null;

  const response = await fetch(dataUri);
  const blob = await response.blob();


const formats = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const extension = formats[blob.type];

if (!extension) {
  throw new Error('Unsupported thumbnail format.');
}

if (blob.size > 10 * 1024 * 1024) {
  throw new Error('Thumbnail must be smaller than 10 MB.');
}

const path = `${crypto.randomUUID()}.${extension}`;


  const { error } = await supabase.storage
    .from(THUMB_BUCKET)
    .upload(path, blob, {
     contentType: blob.type,
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(THUMB_BUCKET)
    .getPublicUrl(path);

  return { path, url: data.publicUrl };
}

async function uploadVideo(file) {
  if (!file) {
    throw new Error('Please select a video.');
  }

  if (file.type !== 'video/mp4') {
    throw new Error('Only MP4 files are supported.');
  }

  if (file.size > MAX_VIDEO_SIZE) {
    throw new Error('Video must be 50 MB or smaller.');
  }

  const path = `${crypto.randomUUID()}.mp4`;

  const { error } = await supabase.storage
    .from(VIDEO_BUCKET)
    .upload(path, file, {
      contentType: 'video/mp4',
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(VIDEO_BUCKET)
    .getPublicUrl(path);

  return { path, url: data.publicUrl };
}

async function removeFiles(video) {
  if (video.videoPath) {
    const { error } = await supabase.storage
      .from(VIDEO_BUCKET)
      .remove([video.videoPath]);
    if (error) console.error('Video cleanup:', error);
  }

  if (video.thumbnailPath) {
    const { error } = await supabase.storage
      .from(THUMB_BUCKET)
      .remove([video.thumbnailPath]);
    if (error) console.error('Thumbnail cleanup:', error);
  }
}

export const videoService = {
  async getAll() {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(formatVideo);
  },

  async getPublished() {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(formatVideo);
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? formatVideo(data) : null;
  },

  async create(input) {
    let uploadedVideo = null;
    let uploadedThumb = null;

    try {
      const type = input.sourceType || 'upload';

      let externalUrl = null;

      if (type !== 'upload') {
        externalUrl = validateExternalUrl(
          type,
          input.externalUrl
        );
      } else if (!input.videoFile) {
        throw new Error('Please select an MP4 file.');
      }

      if (type === 'upload') {
        uploadedVideo = await uploadVideo(input.videoFile);
      }

      if (input.thumbnail?.startsWith('data:image/')) {
        uploadedThumb = await uploadThumbnail(input.thumbnail);
      }

      const payload = {
        title: input.title.trim(),
        description: input.description || '',
        category: input.category || 'Commercial',
        quality: input.quality || 'STANDARD',
        status: input.status || 'draft',
        source_type: type,
        external_url: externalUrl,
        video_url: uploadedVideo?.url || null,
        video_path: uploadedVideo?.path || null,
        thumbnail_url: uploadedThumb?.url || null,
        thumbnail_path: uploadedThumb?.path || null,
        duration: input.duration || '',
        featured: input.featured || false,
        views: 0,
      };

      const { data, error } = await supabase
        .from('videos')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      return {
        video: formatVideo(data),
        storageError: null,
      };
    } catch (error) {
      await removeFiles({
        videoPath: uploadedVideo?.path,
        thumbnailPath: uploadedThumb?.path,
      });

      return {
        video: null,
        storageError: error.message,
      };
    }
  },

  async update(id, input) {
    try {
      const old = await this.getById(id);
      if (!old) throw new Error('Video not found.');

      const payload = {};

      const fields = [
        'title', 'description', 'category',
        'quality', 'status', 'duration',
        'featured', 'views'
      ];

      fields.forEach(key => {
        if (input[key] !== undefined) {
          payload[key] = input[key];
        }
      });

      if (input.externalUrl !== undefined &&
          old.sourceType !== 'upload') {
        payload.external_url = validateExternalUrl(
          old.sourceType,
          input.externalUrl
        );
      }

      let newVideo = null;
      let newThumb = null;

      try {
        if (input.videoFile) {
          newVideo = await uploadVideo(input.videoFile);
          payload.video_url = newVideo.url;
          payload.video_path = newVideo.path;
        }

        if (input.thumbnail?.startsWith('data:image/')) {
          newThumb = await uploadThumbnail(input.thumbnail);
          payload.thumbnail_url = newThumb.url;
          payload.thumbnail_path = newThumb.path;
        }

        const { data, error } = await supabase
          .from('videos')
          .update(payload)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        await removeFiles({
          videoPath: newVideo ? old.videoPath : null,
          thumbnailPath: newThumb ? old.thumbnailPath : null,
        });

        return {
          video: formatVideo(data),
          storageError: null,
        };
      } catch (error) {
        await removeFiles({
          videoPath: newVideo?.path,
          thumbnailPath: newThumb?.path,
        });
        throw error;
      }
    } catch (error) {
      return { video: null, storageError: error.message };
    }
  },

  async delete(id) {
    const old = await this.getById(id);
    if (!old) return true;

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await removeFiles(old);
    return true;
  },

  async toggleStatus(id) {
    const old = await this.getById(id);
    if (!old) throw new Error('Video not found.');

    const status =
      old.status === 'published' ? 'draft' : 'published';

    const { data, error } = await supabase
      .from('videos')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return formatVideo(data);
  },

  async getStats() {
    const videos = await this.getAll();

    return {
      total: videos.length,
      published: videos.filter(v => v.status === 'published').length,
      draft: videos.filter(v => v.status === 'draft').length,
      premium: videos.filter(v => v.quality === 'PREMIUM').length,
      standard: videos.filter(v => v.quality === 'STANDARD').length,
      basic: videos.filter(v => v.quality === 'BASIC').length,
    };
  },
};
