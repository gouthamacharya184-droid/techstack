import React, { useState, useRef, useEffect } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { useAudio } from '../../context/AudioContext';

export const CinematicVideoSection = ({ onTriggerAchievement }) => {
  const { content, updateField, dirOn } = useDirector();
  const { isPlaying: isBgAudioPlaying, toggleMusic: toggleBgAudio } = useAudio();
  
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const scrubberRef = useRef(null);
  const timeDisplayRef = useRef(null);
  const lastSecondRef = useRef(-1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  // Default to known video length (222s = 3:42) so mobile never displays 0:00 / 0:00
  const [duration, setDuration] = useState(222);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  // Video URL pointing to uploaded video song with fallbacks
  // Normalize InShot video to Vite's local /media static path to avoid dev server proxy stalling
  const rawUrl = content.video_url || '';
  const resolvedVideoSrc = (rawUrl && !rawUrl.includes('InShot_20260906_183316810.mp4') && !rawUrl.includes('/uploads/'))
    ? rawUrl
    : '/media/InShot_20260906_183316810.mp4';

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayPause = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      // If background ambient audio is currently on, pause it so video sound is clear
      if (isBgAudioPlaying && typeof toggleBgAudio === 'function') {
        try {
          toggleBgAudio();
        } catch (_) {}
      }

      try {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        setIsPlaying(true);
        if (!hasStarted) {
          setHasStarted(true);
          if (onTriggerAchievement) {
            onTriggerAchievement('🎬', 'Feature Premiere', "Watching Dhanya's special cinematic video!");
          }
        }
      } catch (err) {
        console.warn('Video play blocked or interrupted by mobile policy, retrying muted:', err);
        // Mobile iOS Safari / Chrome restriction: allow playback if muted
        try {
          videoRef.current.muted = true;
          setIsMuted(true);
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (retryErr) {
          console.error('Mobile playback retry failed:', retryErr);
        }
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleMuteToggle = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreenToggle = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!videoRef.current) return;
    
    // iOS Safari does not support container.requestFullscreen, uses video.webkitEnterFullscreen
    if (videoRef.current.webkitEnterFullscreen && typeof videoRef.current.webkitEnterFullscreen === 'function') {
      videoRef.current.webkitEnterFullscreen();
      return;
    }

    const container = videoRef.current.closest('.cinema-screen-wrap');
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleTheaterToggle = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setIsTheater((prev) => !prev);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || duration || 222;

    if (dur > 0) {
      const pct = Math.min(100, (cur / dur) * 100);
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pct}%`;
      }
      if (scrubberRef.current) {
        scrubberRef.current.style.left = `${pct}%`;
      }
    }

    const curSec = Math.floor(cur);
    if (curSec !== lastSecondRef.current) {
      lastSecondRef.current = curSec;
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration;
    if (dur && !isNaN(dur) && dur > 0) {
      setDuration(dur);
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = `${formatTime(videoRef.current.currentTime || 0)} / ${formatTime(dur)}`;
      }
    }
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration || duration || 222;
    if (!dur) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clickX = clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = newPercent * dur;
    videoRef.current.currentTime = newTime;
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${newPercent * 100}%`;
    }
    if (scrubberRef.current) {
      scrubberRef.current.style.left = `${newPercent * 100}%`;
    }
    if (timeDisplayRef.current) {
      timeDisplayRef.current.textContent = `${formatTime(newTime)} / ${formatTime(dur)}`;
    }
  };

  const triggerControlsVisibility = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Check if metadata already available
    if (vid.readyState >= 1 && vid.duration && !isNaN(vid.duration) && vid.duration > 0) {
      handleLoadedMetadata();
    }

    vid.addEventListener('loadedmetadata', handleLoadedMetadata);
    vid.addEventListener('durationchange', handleLoadedMetadata);
    vid.addEventListener('canplay', handleLoadedMetadata);
    vid.addEventListener('loadeddata', handleLoadedMetadata);

    return () => {
      vid.removeEventListener('loadedmetadata', handleLoadedMetadata);
      vid.removeEventListener('durationchange', handleLoadedMetadata);
      vid.removeEventListener('canplay', handleLoadedMetadata);
      vid.removeEventListener('loadeddata', handleLoadedMetadata);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [resolvedVideoSrc]);

  return (
    <>
      <div className="scene-divider" aria-hidden="true" />
      <section
        className={`cinema-video-section ${isTheater ? 'theater-mode' : ''}`}
        id="cinema-video"
        aria-label="Cinematic Video Spotlight"
      >
        <div className="sec-header rev in">
          <span className="sec-eyebrow">✦ &nbsp; The Motion Picture &nbsp; ✦</span>
          <h2
            className="sec-h2"
            data-edit
            contentEditable={dirOn}
            suppressContentEditableWarning
            onBlur={(e) => updateField('video_title', e.currentTarget.textContent)}
            tabIndex={dirOn ? 0 : -1}
          >
            {content.video_title || 'A Cinematic Premiere for Dhanya'}
            <span
              className="sec-h2-script"
              data-edit
              contentEditable={dirOn}
              suppressContentEditableWarning
              onBlur={(e) => updateField('video_subtitle', e.currentTarget.textContent)}
              tabIndex={dirOn ? 0 : -1}
            >
              {content.video_subtitle || 'Every frame a cherished treasure, every moment unforgettable'}
            </span>
          </h2>
        </div>

        <div className="cinema-video-container rev in">
          {/* Ambient Video Backlight */}
          <div className={`cinema-glow-aura ${isPlaying ? 'active' : ''}`} aria-hidden="true" />

          {/* Golden Theater Frame */}
          <div
            className="cinema-screen-wrap"
            onMouseMove={triggerControlsVisibility}
            onTouchStart={triggerControlsVisibility}
            onClick={triggerControlsVisibility}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {/* Film leader corner accents */}
            <div className="cinema-corner top-left" aria-hidden="true" />
            <div className="cinema-corner top-right" aria-hidden="true" />
            <div className="cinema-corner bottom-left" aria-hidden="true" />
            <div className="cinema-corner bottom-right" aria-hidden="true" />

            {/* Video Element */}
            <video
              ref={videoRef}
              src={resolvedVideoSrc}
              className="cinema-video-player"
              playsInline
              webkit-playsinline="true"
              x5-playsinline="true"
              x5-video-player-type="h5"
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onDurationChange={handleLoadedMetadata}
              onCanPlay={handleLoadedMetadata}
              onLoadedData={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onClick={handlePlayPause}
            >
              Your browser does not support the video tag.
            </video>

            {/* Center Big Play Button Overlay */}
            {!isPlaying && (
              <button
                type="button"
                className="cinema-play-overlay"
                onClick={handlePlayPause}
                onTouchEnd={handlePlayPause}
                aria-label="Play Cinematic Video"
              >
                <div className="cinema-play-ripple" />
                <div className="cinema-play-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="cinema-play-text">PLAY PREMIERE</span>
              </button>
            )}

            {/* Custom Control Bar Overlay */}
            <div className={`cinema-custom-controls ${showControls || !isPlaying ? 'visible' : ''}`}>
              {/* Progress Seek Bar */}
              <div
                className="cinema-progress-bar"
                onClick={handleSeek}
                onTouchStart={handleSeek}
                onTouchMove={handleSeek}
                role="slider"
                aria-label="Video Progress"
                tabIndex={0}
              >
                <div className="cinema-progress-filled" ref={progressBarRef} style={{ width: '0%' }} />
                <div className="cinema-progress-scrubber" ref={scrubberRef} style={{ left: '0%' }} />
              </div>

              {/* Bottom Controls Row */}
              <div className="cinema-controls-row">
                <div className="cinema-ctrl-group left">
                  <button
                    type="button"
                    className="cinema-btn"
                    onClick={handlePlayPause}
                    onTouchEnd={handlePlayPause}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  <button
                    type="button"
                    className="cinema-btn"
                    onClick={handleMuteToggle}
                    onTouchEnd={handleMuteToggle}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>

                  <span className="cinema-time" ref={timeDisplayRef}>
                    0:00 / {formatTime(duration)}
                  </span>
                </div>

                <div className="cinema-ctrl-group right">
                  <span className="cinema-badge">✦ 4K CINEMA MASTER ✦</span>

                  <button
                    type="button"
                    className={`cinema-btn ${isTheater ? 'active' : ''}`}
                    onClick={handleTheaterToggle}
                    onTouchEnd={handleTheaterToggle}
                    title={isTheater ? 'Exit Theater Mode' : 'Theater Mode'}
                    aria-label="Toggle Theater Mode"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="cinema-btn"
                    onClick={handleFullscreenToggle}
                    onTouchEnd={handleFullscreenToggle}
                    title="Fullscreen"
                    aria-label="Toggle Fullscreen"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Film Reel Details Strip */}
          <div className="cinema-info-strip">
            <div className="cinema-tag-pill">
              <span className="cinema-dot" /> STARRING DHANYA
            </div>
            <div className="cinema-tag-pill">
              <span className="cinema-dot" /> DIRECTED WITH LOVE
            </div>
            <div className="cinema-tag-pill">
              <span className="cinema-dot" /> SPECIAL EDITION
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CinematicVideoSection;
