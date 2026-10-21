
import React, { useRef, useState } from 'react';
import './VideoPlayer.css';

function getYouTubeId(url) {
  try {
    const parsed = new URL(url);

    const host = parsed.hostname.toLowerCase();

    if (host === 'youtu.be') {
      return parsed.pathname.split('/')[1];
    }

    if (
      host === 'youtube.com' ||
      host === 'www.youtube.com' ||
      host === 'm.youtube.com'
    ) {
      if (parsed.pathname === '/watch') {
        return parsed.searchParams.get('v');
      }

      const match = parsed.pathname.match(
        /^\/(shorts|embed|live)\/([^/]+)/
      );

      return match ? match[2] : null;
    }

    return null;
  } catch {
    return null;
  }
}

export default function VideoPlayer({
  src,
  poster,
  title,
  sourceType = 'upload'
}) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  if (sourceType === 'youtube') {
    const videoId = getYouTubeId(src);

    if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return (
        <div className="vp-placeholder">
          Invalid YouTube URL
        </div>
      );
    }

    return (
      <div className="vp-wrapper">
        <iframe
          title={title || 'YouTube video'}
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          width="100%"
          height="100%"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: 0, aspectRatio: '16 / 9' }}
        />
      </div>
    );
  }

  if (sourceType === 'instagram') {
    let validUrl = null;

    try {
      const parsed = new URL(src);

      if (
        ['instagram.com', 'www.instagram.com'].includes(
          parsed.hostname.toLowerCase()
        ) &&
        /^\/(reel|p|tv)\/[^/]+/.test(parsed.pathname)
      ) {
        validUrl = parsed.href;
      }
    } catch {
      // Invalid URL
    }

    return (
      <div className="vp-placeholder">
        <i className="ri-instagram-line" />

        {validUrl ? (
          <a
            href={validUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Watch on Instagram
            <i className="ri-external-link-line" />
          </a>
        ) : (
          <p>Invalid Instagram URL</p>
        )}
      </div>
    );
  }

  if (!src) {
    return (
      <div className="vp-placeholder">
        <i className="ri-film-line" />
        <p>No video available</p>
      </div>
    );
  }

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  };

  return (
    <div className="vp-wrapper">
      <video
        ref={videoRef}
        className="vp-video"
        src={src}
        poster={poster}
        controls
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {!playing && (
        <button
          className="vp-big-play"
          onClick={toggle}
          aria-label={`Play ${title}`}
        >
          <i className="ri-play-fill" />
        </button>
      )}
    </div>
  );
}
