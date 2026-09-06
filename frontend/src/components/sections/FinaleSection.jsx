import React, { useEffect, useRef, useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { useTheme } from '../../context/ThemeContext';

export const FinaleSection = ({ onTriggerAchievement }) => {
  const { content, updateField, dirOn } = useDirector();
  const { showEndCredits } = useTheme();
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [triggered, setTriggered] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [confetti, setConfetti] = useState([]);

  // Fireworks animation
  useEffect(() => {
    if (!triggered) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId;
    let isRunning = true;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const parts = [];
    const cols = ['#e8b84b', '#f5d07a', '#c9922a', '#e8a0b4', '#f5c8d8', '#fff8ef', '#d4a843', '#ffffff'];

    const explode = (x, y) => {
      for (let i = 0; i < 70; i++) {
        const ang = (Math.PI * 2 / 70) * i + Math.random() * 0.15;
        const spd = Math.random() * 4.5 + 2;
        parts.push({
          x,
          y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          al: 1,
          sz: Math.random() * 2.2 + 0.5,
          col: cols[Math.floor(Math.random() * cols.length)],
          grav: 0.06 + Math.random() * 0.03,
        });
      }
    };

    let t = 0;
    const loop = () => {
      if (!isRunning) return;
      ctx.fillStyle = 'rgba(3,2,10,.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.grav;
        p.vx *= 0.99;
        p.al -= 0.014;
        if (p.al <= 0) {
          parts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.al;
        ctx.fillStyle = p.col;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.col;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      t++;
      if (t % 50 === 0 && parts.length < 250) {
        explode(canvas.width * (0.15 + Math.random() * 0.7), canvas.height * (0.05 + Math.random() * 0.55));
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isRunning) {
          isRunning = true;
          animationFrameId = requestAnimationFrame(loop);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    loop();

    setTimeout(() => explode(canvas.width * 0.5, canvas.height * 0.3), 200);
    setTimeout(() => explode(canvas.width * 0.25, canvas.height * 0.4), 600);
    setTimeout(() => explode(canvas.width * 0.75, canvas.height * 0.25), 1000);

    return () => {
      isRunning = false;
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, [triggered]);

  // Observer to trigger finale on scroll
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !triggered) {
            setTriggered(true);
            obs.disconnect();

            // Spawn hearts
            const em = ['💛', '✨', '🌟', '💫', '⭐', '💝', '🎂', '🎉', '🌸', '💖'];
            const newHearts = Array.from({ length: 45 }, (_, i) => ({
              id: i,
              emoji: em[Math.floor(Math.random() * em.length)],
              style: {
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 10}%`,
                fontSize: `${Math.random() * 1.3 + 0.8}rem`,
                animationDuration: `${Math.random() * 3 + 4}s`,
                animationDelay: `${Math.random() * 2}s`,
              },
            }));
            setHearts(newHearts);

            // Spawn confetti
            const colors = ['#e8b84b', '#f5d07a', '#c9922a', '#e8a0b4', '#f5c8d8', '#fff8ef'];
            const newConfetti = Array.from({ length: 80 }, (_, i) => ({
              id: i,
              style: {
                left: `${Math.random() * 100}%`,
                background: colors[Math.floor(Math.random() * colors.length)],
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                width: `${Math.random() * 7 + 3}px`,
                height: `${Math.random() * 9 + 4}px`,
                animationDuration: `${Math.random() * 2.5 + 2.5}s`,
                animationDelay: `${Math.random() * 1.5}s`,
              },
            }));
            setConfetti(newConfetti);

            if (onTriggerAchievement) {
              onTriggerAchievement('🎇', 'The Grand Finale!', 'You reached the end of the story!');
            }

            // Auto-show end credits
            setTimeout(() => {
              showEndCredits();
            }, 38000);
          }
        });
      },
      { threshold: 0.2 }
    );

    obs.observe(section);
    return () => obs.disconnect();
  }, [triggered, onTriggerAchievement, showEndCredits]);

  return (
    <section id="finale" ref={sectionRef} aria-label="Grand Finale">
      <canvas id="finale-canvas" ref={canvasRef} aria-hidden="true" />
      <div className={`finale-overlay ${triggered ? 'gone' : ''}`} id="finale-overlay" aria-hidden="true" />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 2 }} id="hearts-wrap" aria-hidden="true">
        {hearts.map((h) => (
          <div key={h.id} className="fheart" style={h.style}>
            {h.emoji}
          </div>
        ))}
      </div>

      {confetti.map((c) => (
        <div key={c.id} className="cpiece" style={c.style} aria-hidden="true" />
      ))}

      <div className="finale-content">
        <p
          className={`finale-script ${triggered ? 'on' : ''}`}
          id="fscript"
          data-edit
          contentEditable={dirOn}
          suppressContentEditableWarning
          onBlur={(e) => updateField('finale_script', e.currentTarget.textContent)}
          tabIndex={dirOn ? 0 : -1}
          role={dirOn ? 'textbox' : undefined}
        >
          {content.finale_script.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < content.finale_script.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
        <h2 className={`finale-big ${triggered ? 'on' : ''}`} id="fbig">
          Happy Birthday!
        </h2>
        <p
          className={`finale-big-sub ${triggered ? 'on' : ''}`}
          id="fbsub"
          data-edit
          contentEditable={dirOn}
          suppressContentEditableWarning
          onBlur={(e) => updateField('finale_sub', e.currentTarget.textContent)}
          tabIndex={dirOn ? 0 : -1}
          role={dirOn ? 'textbox' : undefined}
        >
          {content.finale_sub}
        </p>
      </div>
    </section>
  );
};

export default FinaleSection;
