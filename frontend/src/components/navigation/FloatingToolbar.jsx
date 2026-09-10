import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { useDirector } from '../../context/DirectorContext';

export const FloatingToolbar = ({ visible, onAction }) => {
  const { auroraOn, toggleAurora, cineOn, toggleCine, showEndCredits } = useTheme();
  const { isPlaying, toggleMusic } = useAudio();
  const { dirOn, toggleDir, hasChanges, saveToServer, isSaving, saveStatus } = useDirector();

  const handleAurora = () => {
    toggleAurora();
    if (onAction) onAction('aurora', !auroraOn);
  };

  const handleCine = () => {
    toggleCine();
    if (onAction) onAction('cine', !cineOn);
  };

  const handleDir = () => {
    toggleDir();
    if (onAction) onAction('dir', !dirOn);
  };

  const handleMusic = () => {
    toggleMusic();
    if (onAction) onAction('music', !isPlaying);
  };

  const scrollToVideo = () => {
    const el = document.getElementById('cinema-video');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToShare = () => {
    const el = document.getElementById('share-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCredits = () => {
    showEndCredits();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    if (onAction) onAction('credits');
  };

  return (
    <>
      {dirOn && (
        <div className="dir-banner" role="status" aria-live="polite">
          <span>✦ Director Mode Active — Click any text to edit ✦</span>
          {hasChanges && (
            <button
              onClick={saveToServer}
              disabled={isSaving}
              aria-label="Save changes to database"
              style={{
                background: '#000',
                color: 'var(--gold2)',
                border: '1px solid var(--gold2)',
                padding: '4px 12px',
                borderRadius: '2px',
                cursor: 'pointer',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              {isSaving ? 'Saving...' : '💾 Save to Database'}
            </button>
          )}
          {saveStatus && (
            <span style={{ fontSize: '0.6rem', color: '#111', fontWeight: 600 }}>{saveStatus}</span>
          )}
        </div>
      )}

      <nav
        id="floating-toolbar"
        className={visible ? 'show' : ''}
        aria-label="Floating Controls Toolbar"
      >
        <button
          className={`tb-btn ${auroraOn ? 'tb-active' : ''}`}
          id="tb-aurora"
          onClick={handleAurora}
          aria-label="Toggle Aurora Borealis"
          aria-pressed={auroraOn}
          title="Toggle Aurora"
        >
          <span className="tb-tip" aria-hidden="true">Aurora</span>
          <span aria-hidden="true">🌌</span>
        </button>
        <button
          className={`tb-btn ${cineOn ? 'tb-active' : ''}`}
          id="tb-cine"
          onClick={handleCine}
          aria-label="Toggle Cinematic Letterbox Mode"
          aria-pressed={cineOn}
          title="Toggle Cinematic Mode"
        >
          <span className="tb-tip" aria-hidden="true">Cinematic</span>
          <span aria-hidden="true">🎬</span>
        </button>
        <button
          className={`tb-btn ${dirOn ? 'tb-active' : ''}`}
          id="tb-dir"
          onClick={handleDir}
          aria-label="Toggle Director Mode"
          aria-pressed={dirOn}
          title="Toggle Director Mode"
        >
          <span className="tb-tip" aria-hidden="true">Director Mode</span>
          <span aria-hidden="true">✏️</span>
        </button>
        <div className="tb-div" aria-hidden="true" />
        <button
          className={`tb-btn ${isPlaying ? 'tb-active' : ''}`}
          id="tb-music"
          onClick={handleMusic}
          aria-label={isPlaying ? 'Pause ambient music' : 'Play ambient music'}
          aria-pressed={isPlaying}
          title="Music Player"
        >
          <span className="tb-tip" aria-hidden="true">Music</span>
          <span aria-hidden="true">🎵</span>
        </button>
        <button
          className="tb-btn"
          onClick={scrollToVideo}
          aria-label="Scroll to Cinematic Video"
          title="Watch Video"
        >
          <span className="tb-tip" aria-hidden="true">Watch Video</span>
          <span aria-hidden="true">🎥</span>
        </button>
        <button
          className="tb-btn"
          onClick={scrollToShare}
          aria-label="Scroll to Share Card Generator"
          title="Share Card"
        >
          <span className="tb-tip" aria-hidden="true">Share Card</span>
          <span aria-hidden="true">🪄</span>
        </button>
        <button
          className="tb-btn"
          onClick={handleCredits}
          aria-label="Roll End Credits"
          title="End Credits"
        >
          <span className="tb-tip" aria-hidden="true">End Credits</span>
          <span aria-hidden="true">🎞️</span>
        </button>
      </nav>
    </>
  );
};

export default FloatingToolbar;
