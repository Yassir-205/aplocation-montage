import React, { useRef, useState } from 'react';
import './VideoPlayer.css';

export default function VideoPlayer({ src, poster, title }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else          { v.pause(); setPlaying(false); }
  };

  if (!src) {
    return (
      <div className="vp-placeholder">
        <i className="ri-film-line" />
        <p>No video available</p>
      </div>
    );
  }

  return (
    <div className="vp-wrapper">
      <video
        ref={videoRef}
        className="vp-video"
        src={src}
        poster={poster}
        controls
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        preload="metadata"
      />
      {!playing && (
        <button className="vp-big-play" onClick={toggle} aria-label={`Play ${title}`}>
          <i className="ri-play-fill" />
        </button>
      )}
    </div>
  );
}
