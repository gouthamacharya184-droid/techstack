import React from 'react';
import { useAudio } from '../../context/AudioContext';

export const MusicPlayer = ({ visible, onPlayToggle }) => {
  const { isPlaying, toggleMusic } = useAudio();

  const handleToggle = () => {
    toggleMusic();
    if (onPlayToggle) onPlayToggle(!isPlaying);
  };

  return (
    <div
      id="music-player"
      className={visible ? 'show' : ''}
      role="region"
      aria-label="Ambient Synthesizer Player"
    >
      <button
        id="music-btn"
        onClick={handleToggle}
        aria-label={isPlaying ? 'Pause Ambient Synthesizer' : 'Play Ambient Synthesizer'}
        aria-pressed={isPlaying}
        title={isPlaying ? 'Pause Ambient Music' : 'Play Ambient Music'}
      >
        {!isPlaying ? (
          <svg id="mic-play" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg id="mic-pause" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        )}
      </button>
      <div className="music-info">
        <div className="music-track-name">✦ Cinematic Memories ✦</div>
        <div className="music-bars" id="music-bars" aria-hidden="true">
          {[0.35, 0.28, 0.45, 0.32, 0.38, 0.25, 0.42, 0.30].map((dur, i) => (
            <div
              key={i}
              className={`music-bar ${isPlaying ? 'playing' : ''}`}
              style={{ height: isPlaying ? undefined : '3px', '--d': `${dur}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
