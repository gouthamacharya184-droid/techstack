import React, { useState, useEffect } from 'react';
import { DHANYA_PHOTOS } from '../../utils/dhanyaPhotos';

export const MemoryCarousel3D = ({ onOpenModal, onTriggerAchievement }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Pick 12 curated highlights
  const items = DHANYA_PHOTOS.slice(0, 12).map((src, i) => ({
    id: i,
    src,
    title: [
      'Radiant Energy ✨',
      'The Best Smiles 💛',
      'Unmatched Vibes 🌸',
      'Pure Elegance 👑',
      'Endless Laughs 🎉',
      'Golden Chapter 🌟',
      'Adventure Seeker 🚀',
      'Precious Memories 💖',
      'Iconic Looks 💫',
      'Heart of Gold 🍯',
      'Forever Cherished 💐',
      'Living Her Best Life 🎈'
    ][i % 12],
    caption: `Dhanya Highlight #${i + 1} — A moment of absolute wonder.`
  }));

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isAutoPlaying, items.length]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleCardClick = (idx, item) => {
    if (idx === activeIndex) {
      if (onOpenModal) {
        onOpenModal(item.src, item.caption, `carousel_${item.id}`);
        if (onTriggerAchievement) {
          onTriggerAchievement('✨', 'Deep Memory', 'Expanded Dhanya\'s 3D Memory Card');
        }
      }
    } else {
      setIsAutoPlaying(false);
      setActiveIndex(idx);
    }
  };

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const stepX = isMobile ? 130 : isTablet ? 180 : 220;

  return (
    <>
      <div className="scene-divider" aria-hidden="true" />
      <section className="carousel-3d-section" aria-label="3D Memory Showcase">
        <div className="sec-header rev in">
          <span className="sec-eyebrow">✦ 3D Memory Showcase ✦</span>
          <h2 className="sec-h2">
            Dhanya's Hall of Memories
            <span className="sec-h2-script">Glide through the golden moments</span>
          </h2>
        </div>

        <div
          className="carousel-3d-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            className="c3d-nav-btn c3d-prev"
            onClick={handlePrev}
            aria-label="Previous memory"
          >
            &#10094;
          </button>

          <div className="c3d-stage">
            {items.map((item, idx) => {
              const offset = idx - activeIndex;
              const absOffset = Math.abs(offset);
              const isActive = idx === activeIndex;

              // Compute transform for 3D coverflow effect
              const translateX = offset * stepX;
              const translateZ = isActive ? (isMobile ? 50 : 100) : (isMobile ? -90 : -150) * absOffset;
              const rotateY = offset * (isMobile ? -18 : -25);
              const opacity = absOffset > 3 ? 0 : Math.max(0.2, 1 - absOffset * 0.25);
              const zIndex = 50 - absOffset;

              return (
                <div
                  key={item.id}
                  className={`c3d-card ${isActive ? 'active' : ''}`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                    opacity,
                    zIndex,
                    pointerEvents: absOffset > (isMobile ? 1 : 2) ? 'none' : 'auto',
                  }}
                  onClick={() => handleCardClick(idx, item)}
                  role="button"
                  tabIndex={0}
                  aria-label={item.title}
                >
                  <div className="c3d-img-wrap">
                    <img src={item.src} alt={item.title} loading="lazy" />
                    <div className="c3d-shine" />
                  </div>
                  <div className="c3d-info">
                    <h3 className="c3d-title">{item.title}</h3>
                    <p className="c3d-caption">{item.caption}</p>
                    {isActive && <span className="c3d-tap-hint">Tap to expand 🔍</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="c3d-nav-btn c3d-next"
            onClick={handleNext}
            aria-label="Next memory"
          >
            &#10095;
          </button>
        </div>

        {/* Carousel indicators */}
        <div className="c3d-dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`c3d-dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveIndex(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default MemoryCarousel3D;
