import React, { useState } from 'react';

const REASONS = [
  {
    icon: '✨',
    num: 'Reason One',
    text: 'Your laugh is absolutely contagious — it lights up every room and makes the whole world feel warmer.',
    script: 'Pure sunshine',
  },
  {
    icon: '💛',
    num: 'Reason Two',
    text: 'You always know exactly what to say when I need it most. Your words heal like nothing else.',
    script: 'My safe place',
  },
  {
    icon: '🌟',
    num: 'Reason Three',
    text: 'You turn the most ordinary moments into adventures I\'ll treasure forever.',
    script: 'My adventure',
  },
  {
    icon: '🎂',
    num: 'Reason Four',
    text: 'Your loyalty is unshakeable. Through every storm, you\'ve always shown up. That means everything.',
    script: 'Forever loyal',
  },
  {
    icon: '💫',
    num: 'Reason Five',
    text: 'You believe in me even when I don\'t believe in myself. You see the best in people — especially me.',
    script: 'My believer',
  },
  {
    icon: '🌸',
    num: 'Reason Six',
    text: 'You simply make my life better in every possible way. I am endlessly grateful you exist in my world.',
    script: 'My everything',
  },
];

export const FlipCardsGrid = () => {
  const [flippedMap, setFlippedMap] = useState({});

  const handleCardClick = (index) => {
    setFlippedMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(index);
    }
  };

  return (
    <>
      <div className="scene-divider" aria-hidden="true" />
      <section className="amazing-section" aria-label="Why You Are Amazing">
        <div className="sec-header rev in">
          <span className="sec-eyebrow">✦ &nbsp; A Love Letter &nbsp; ✦</span>
          <h2 className="sec-h2">
            Why You're Amazing
            <span className="sec-h2-script">Six reasons among a thousand</span>
          </h2>
        </div>
        <div className="flip-grid">
          {REASONS.map((item, idx) => (
            <div
              key={idx}
              className={`flip-card rev in ${flippedMap[idx] ? 'flipped' : ''}`}
              style={{ transitionDelay: `${0.05 * (idx + 1)}s` }}
              onClick={() => handleCardClick(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              role="button"
              tabIndex={0}
              aria-label={`${item.num}: ${item.script}. Press Enter or tap to flip card`}
              aria-pressed={!!flippedMap[idx]}
            >
              <div className="flip-card-inner">
                <div className="flip-front">
                  <div className="flip-front-icon" aria-hidden="true">{item.icon}</div>
                  <div className="flip-front-num">{item.num}</div>
                  <div className="flip-front-hint">tap to reveal</div>
                </div>
                <div className="flip-back">
                  <div className="flip-back-text">{item.text}</div>
                  <div className="flip-back-script">{item.script}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default FlipCardsGrid;
