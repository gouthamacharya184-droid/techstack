import React, { useState } from 'react';

export const GiftBoxSection = ({ onTriggerConfetti, onTriggerAchievement }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenGift = () => {
    if (isOpen) return;
    setIsOpen(true);
    if (onTriggerConfetti) onTriggerConfetti();
    if (onTriggerAchievement) {
      onTriggerAchievement('🎁', 'Gift Opened!', 'A surprise revealed with love');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpenGift();
    }
  };

  return (
    <>
      <div className="scene-divider" aria-hidden="true" />
      <section className="gift-section" aria-label="Birthday Surprise Gift">
        <div className="sec-header rev in">
          <span className="sec-eyebrow">✦ &nbsp; A Surprise &nbsp; ✦</span>
          <h2 className="sec-h2">
            Open Your Gift
            <span className="sec-h2-script">Something special waits inside</span>
          </h2>
        </div>

        <div
          className={`gift-scene rev in ${isOpen ? 'open' : ''}`}
          id="gift-scene"
          onClick={handleOpenGift}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label={isOpen ? 'Gift opened: Happy Birthday! You are loved beyond words.' : 'Tap or press Enter to open birthday gift box'}
          aria-expanded={isOpen}
        >
          <div className="g-bow" aria-hidden="true">
            <div className="g-loop" />
            <div className="g-knot" />
            <div className="g-loop" />
          </div>
          <div className="g-lid" aria-hidden="true" />
          <div className="g-box">
            <div className="g-msg">
              <div className="g-msg-text">
                Happy Birthday!
                <br />
                You are loved
                <br />
                beyond words 💛
              </div>
            </div>
          </div>
        </div>

        <p className="gift-hint rev in">Click or tap the gift to open it ✨</p>
        <p className={`gift-reveal ${isOpen ? 'on' : ''}`} id="gift-reveal" aria-live="polite">
          🎁 Today is YOUR day — make it magical! 🎁
        </p>
      </section>
    </>
  );
};

export default GiftBoxSection;
