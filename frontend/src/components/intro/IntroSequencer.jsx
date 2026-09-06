import React, { useState, useEffect } from 'react';
import { useDirector } from '../../context/DirectorContext';

const INTRO_SCENES = [
  { id: 'sc1', text: 'Every great story begins with a single, radiant smile...', dur: 2400 },
  { id: 'sc2', text: 'Some friendships shine brighter than all the stars in the night sky...', dur: 2400 },
  { id: 'sc3', text: 'Today, the world celebrates someone truly extraordinary...', dur: 2400 },
  { id: 'sc4', text: 'Happy Birthday, Dhanya ✨', dur: 2200 },
];

export const IntroSequencer = ({ onEnterSite }) => {
  const { content, updateField, dirOn } = useDirector();
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [showTitle, setShowTitle] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (currentSceneIdx >= INTRO_SCENES.length) {
      setShowTitle(true);
      // Spawn title particles
      const newParticles = Array.from({ length: 45 }, (_, i) => {
        const sz = Math.random() * 2.5 + 0.5;
        const isGold = Math.random() > 0.5;
        return {
          id: i,
          style: {
            width: `${sz}px`,
            height: `${sz}px`,
            background: isGold ? 'var(--gold2)' : 'var(--pink2)',
            boxShadow: `0 0 ${sz * 4}px ${isGold ? 'var(--gold)' : 'var(--pink)'}`,
            left: `${Math.random() * 100}%`,
            bottom: 0,
            animationDuration: `${Math.random() * 8 + 6}s`,
            animationDelay: `${Math.random() * 4}s`,
          },
        };
      });
      setParticles(newParticles);
      return;
    }

    const scene = INTRO_SCENES[currentSceneIdx];
    let i = 0;
    setTypedText('');

    const interval = setInterval(() => {
      if (i < scene.text.length) {
        setTypedText(scene.text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentSceneIdx((prev) => prev + 1);
        }, scene.dur);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [currentSceneIdx]);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnterSite();
    }, 1200);
  };

  return (
    <>
      <section
        id="intro"
        aria-label="Cinematic Intro Story"
        style={{
          opacity: isExiting ? 0 : 1,
          transform: isExiting ? 'scale(1.06)' : 'scale(1)',
          transition: 'opacity 1.2s ease, transform 1.8s cubic-bezier(.77,0,.18,1)',
          display: isExiting ? 'none' : 'flex',
        }}
      >
        {!showTitle && currentSceneIdx < INTRO_SCENES.length && (
          <div className="intro-scene" style={{ opacity: 1 }}>
            <p className="scene-tagline" aria-live="polite">{typedText}</p>
            {currentSceneIdx === 0 && (
              <div
                className="scene-rule"
                style={{ width: typedText.length > 5 ? 'min(300px, 80vw)' : '0px', transition: 'width 1s' }}
                aria-hidden="true"
              />
            )}
          </div>
        )}

        {showTitle && (
          <div
            id="intro-title-wrap"
            style={{
              opacity: 1,
              transform: 'scale(1)',
              transition: 'opacity 1.2s ease, transform 1.5s cubic-bezier(.25,.46,.45,.94)',
            }}
          >
            <p className="title-eyebrow">✦ &nbsp; A Cinematic Birthday Experience &nbsp; ✦</p>
            <h1
              className="main-title"
              data-edit
              contentEditable={dirOn}
              suppressContentEditableWarning
              onBlur={(e) => updateField('intro_main_title', e.currentTarget.textContent)}
              tabIndex={dirOn ? 0 : -1}
              role={dirOn ? 'textbox' : undefined}
            >
              {content.intro_main_title}
            </h1>
            <p
              className="main-title-script"
              data-edit
              contentEditable={dirOn}
              suppressContentEditableWarning
              onBlur={(e) => updateField('intro_main_subtitle', e.currentTarget.textContent)}
              tabIndex={dirOn ? 0 : -1}
              role={dirOn ? 'textbox' : undefined}
            >
              {content.intro_main_subtitle}
            </p>
            <div
              style={{
                width: 'min(250px, 70vw)',
                height: '1px',
                background: 'linear-gradient(90deg,transparent,var(--gold2),transparent)',
                margin: '1.5rem auto',
              }}
              aria-hidden="true"
            />
            <button className="intro-enter-btn" onClick={handleEnter} aria-label="Begin the Story">
              <span>✦ &nbsp; Begin the Story &nbsp; ✦</span>
            </button>
          </div>
        )}

        {particles.map((p) => (
          <div key={p.id} className="ipart" style={p.style} aria-hidden="true" />
        ))}
      </section>

      <div id="light-rays" style={{ opacity: showTitle && !isExiting ? 1 : 0 }} aria-hidden="true" />
    </>
  );
};

export default IntroSequencer;
