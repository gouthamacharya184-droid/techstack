import React, { useState, useEffect } from 'react';

export const FilmCountdown = ({ onComplete, onSkip }) => {
  const [cdNum, setCdNum] = useState(5);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const skipTimer = setTimeout(() => setShowSkip(true), 300);

    const interval = setInterval(() => {
      setCdNum((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 450);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        onSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(skipTimer);
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete, onSkip]);

  if (cdNum === 0) return null;

  return (
    <>
      <div id="film-countdown" role="region" aria-label="Cinematic Film Countdown">
        <div className="countdown-reel" aria-hidden="true" />
        <div className="countdown-scratch" aria-hidden="true" />
        <div className="countdown-frame" aria-hidden="true">
          <div className="countdown-circle" />
          <div className="countdown-cross-h" />
          <div className="countdown-cross-v" />
          <span key={cdNum} className="countdown-num" id="cd-num" aria-live="assertive">
            {cdNum}
          </span>
        </div>
        <p className="countdown-label" id="cd-label">
          A Cinematic Birthday Experience
        </p>
      </div>

      <button
        id="skip-intro-btn"
        className={showSkip ? 'visible' : ''}
        onClick={onSkip}
        aria-label="Skip countdown and intro sequence"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
        Skip Intro
      </button>
    </>
  );
};

export default FilmCountdown;
