import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDirector } from '../../context/DirectorContext';

const INTRO_SCENES = [
  { id: 'sc1', text: 'Every great story begins with a single, radiant smile...', dur: 2400 },
  { id: 'sc2', text: 'Some friendships shine brighter than all the stars in the night sky...', dur: 2400 },
  { id: 'sc3', text: 'Today, the world celebrates someone truly extraordinary...', dur: 2400 },
  { id: 'sc4', text: 'Happy Birthday, Dhanya ✨', dur: 2200 },
];

/* ── Bokeh canvas ─────────────────────────────────────────── */
const BokehCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Spawn bokeh circles
    const GOLD_PALETTE = [
      'rgba(232,184,75,',   // gold2
      'rgba(245,208,122,',  // gold3
      'rgba(201,146,42,',   // gold
      'rgba(245,200,216,',  // pink2
      'rgba(232,160,180,',  // pink
      'rgba(255,248,239,',  // white
    ];

    const orbs = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 55 + 8,
      a: Math.random() * 0.18 + 0.04,
      color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
      speedX: (Math.random() - 0.5) * 0.18,
      speedY: -(Math.random() * 0.25 + 0.08),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.012 + 0.004,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.008,
    }));

    // Floating dust specks
    const specks = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.3,
      a: Math.random() * 0.55 + 0.15,
      color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
      speedX: (Math.random() - 0.5) * 0.12,
      speedY: -(Math.random() * 0.18 + 0.04),
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;

      // Bokeh orbs
      orbs.forEach(o => {
        o.wobble += o.wobbleSpeed;
        o.pulse += o.pulseSpeed;
        o.x += o.speedX + Math.sin(o.wobble) * 0.08;
        o.y += o.speedY;
        if (o.y + o.r < 0) {
          o.y = canvas.height + o.r;
          o.x = Math.random() * canvas.width;
        }

        const pulseA = o.a + Math.sin(o.pulse) * 0.04;
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, o.color + (pulseA * 0.9).toFixed(3) + ')');
        grad.addColorStop(0.4, o.color + (pulseA * 0.45).toFixed(3) + ')');
        grad.addColorStop(1, o.color + '0)');
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Dust specks
      specks.forEach(s => {
        s.x += s.speedX;
        s.y += s.speedY;
        if (s.y + s.r < 0) {
          s.y = canvas.height + s.r;
          s.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color + s.a.toFixed(2) + ')';
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
};

/* ── Animated mandala ring ────────────────────────────────── */
const MandalaRing = ({ visible }) => (
  <div
    className="is2-mandala-wrap"
    style={{ opacity: visible ? 1 : 0, transition: 'opacity 1.8s ease 0.6s' }}
    aria-hidden="true"
  >
    {/* outer rotating ring */}
    <div className="is2-ring is2-ring-outer" />
    {/* inner counter-rotating ring */}
    <div className="is2-ring is2-ring-inner" />
    {/* static glow orb behind text */}
    <div className="is2-center-glow" />
    {/* decorative petals */}
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        className="is2-petal"
        style={{ transform: `rotate(${i * 30}deg)` }}
      />
    ))}
  </div>
);

/* ── Main Component ───────────────────────────────────────── */
export const IntroSequencer = ({ onEnterSite }) => {
  const { content, updateField, dirOn } = useDirector();
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [showTitle, setShowTitle] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);

  // Typewriter / scene sequencer
  useEffect(() => {
    if (currentSceneIdx >= INTRO_SCENES.length) {
      setShowTitle(true);
      setTimeout(() => setTitleVisible(true), 80);
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
        setTimeout(() => setCurrentSceneIdx(prev => prev + 1), scene.dur);
      }
    }, 38);

    return () => clearInterval(interval);
  }, [currentSceneIdx]);

  const handleEnter = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onEnterSite(), 1300);
  }, [onEnterSite]);

  return (
    <>
      <section
        id="intro"
        aria-label="Cinematic Intro Story"
        className={`is2-root${isExiting ? ' is2-exit' : ''}`}
      >
        {/* Animated bokeh background */}
        <BokehCanvas />

        {/* Radial vignette for depth */}
        <div className="is2-vignette" aria-hidden="true" />

        {/* Bottom atmospheric glow */}
        <div className="is2-floor-glow" aria-hidden="true" />

        {/* ── Typewriter scene phase ── */}
        {!showTitle && currentSceneIdx < INTRO_SCENES.length && (
          <div className="is2-scene" aria-live="polite">
            <div className="is2-scene-deco" aria-hidden="true">
              <span />
              <span />
            </div>
            <p className="is2-scene-text">{typedText}<span className="is2-cursor" /></p>
          </div>
        )}

        {/* ── Title reveal phase ── */}
        {showTitle && (
          <div
            className={`is2-title-wrap${titleVisible ? ' is2-title-in' : ''}`}
          >
            {/* Mandala ring backdrop */}
            <MandalaRing visible={titleVisible} />

            {/* Eyebrow */}
            <p className="is2-eyebrow">
              <span className="is2-diamond">◆</span>
              &nbsp;&nbsp;A Cinematic Birthday Experience&nbsp;&nbsp;
              <span className="is2-diamond">◆</span>
            </p>

            {/* Main title */}
            <h1
              className="is2-main-title"
              data-edit
              contentEditable={dirOn}
              suppressContentEditableWarning
              onBlur={e => updateField('intro_main_title', e.currentTarget.textContent)}
              tabIndex={dirOn ? 0 : -1}
              role={dirOn ? 'textbox' : undefined}
            >
              {content.intro_main_title}
            </h1>

            {/* Decorative divider with name */}
            <div className="is2-name-row" aria-hidden={!dirOn}>
              <div className="is2-rule" />
              <p
                className="is2-name-script"
                data-edit
                contentEditable={dirOn}
                suppressContentEditableWarning
                onBlur={e => updateField('intro_main_subtitle', e.currentTarget.textContent)}
                tabIndex={dirOn ? 0 : -1}
                role={dirOn ? 'textbox' : undefined}
              >
                {content.intro_main_subtitle}
              </p>
              <div className="is2-rule" />
            </div>

            {/* Subtle tagline */}
            <p className="is2-tagline">A story written with love, just for you</p>

            {/* CTA Button */}
            <button
              className="is2-btn"
              onClick={handleEnter}
              aria-label="Begin the Story"
            >
              <span className="is2-btn-shimmer" aria-hidden="true" />
              <span className="is2-btn-text">✦ &nbsp; Begin the Story &nbsp; ✦</span>
            </button>
          </div>
        )}
      </section>

      {/* Light rays behind everything */}
      <div
        id="light-rays"
        style={{ opacity: showTitle && !isExiting ? 1 : 0 }}
        aria-hidden="true"
      />
    </>
  );
};

export default IntroSequencer;
