import React, { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_CANDLES = 6;
const CANDLE_COLORS = ['#e84040', '#40a0e8', '#40e860', '#e8c040', '#e840c0', '#40e8e0'];

export const CakeSection = ({ onTriggerConfetti, onTriggerAchievement }) => {
  const canvasRef = useRef(null);
  const [candlesOut, setCandlesOut] = useState(new Array(TOTAL_CANDLES).fill(false));
  const [allBlown, setAllBlown] = useState(false);

  const drawCake = useCallback((currentCandlesOut) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext('2d');
    if (!c) return;

    const w = 340;
    const h = 360;
    c.clearRect(0, 0, w, h);

    // Plate
    c.save();
    c.shadowBlur = 20;
    c.shadowColor = 'rgba(201,146,42,.3)';
    c.fillStyle = '#2a1a3a';
    c.beginPath();
    c.ellipse(170, 310, 140, 20, 0, 0, Math.PI * 2);
    c.fill();

    // Cake layers
    const layers = [
      { y: 290, h: 40, col: '#7a2040' },
      { y: 252, h: 42, col: '#922850' },
      { y: 212, h: 44, col: '#aa3060' },
    ];
    layers.forEach((l) => {
      c.fillStyle = l.col;
      c.beginPath();
      c.ellipse(170, l.y, 120, 16, 0, 0, Math.PI * 2);
      c.fill();
      c.fillRect(50, l.y, 240, l.h);
      c.beginPath();
      c.ellipse(170, l.y + l.h, 120, 16, 0, 0, Math.PI * 2);
      c.fill();
    });

    // Frosting drips
    c.fillStyle = '#f0e0f0';
    c.beginPath();
    c.ellipse(170, 212, 120, 16, 0, 0, Math.PI * 2);
    c.fill();
    [75, 110, 145, 180, 215, 250, 285].forEach((x) => {
      c.beginPath();
      c.moveTo(x, 212);
      c.quadraticCurveTo(x + 8, 228, x + 3, 240);
      c.quadraticCurveTo(x - 5, 232, x, 212);
      c.fill();
    });
    c.restore();

    // Candles
    for (let i = 0; i < TOTAL_CANDLES; i++) {
      const cx = 55 + i * 42;
      const cy = 200;
      c.fillStyle = CANDLE_COLORS[i];
      c.fillRect(cx - 5, cy - 55, 10, 55);

      if (!currentCandlesOut[i]) {
        // Flame
        c.save();
        c.shadowBlur = 15;
        c.shadowColor = '#f5d07a';
        const g = c.createRadialGradient(cx, cy - 60, 0, cx, cy - 68, 12);
        g.addColorStop(0, '#fff8d0');
        g.addColorStop(0.4, '#f5a020');
        g.addColorStop(1, 'transparent');
        c.fillStyle = g;
        c.beginPath();
        c.ellipse(cx, cy - 65, 7, 13, 0, 0, Math.PI * 2);
        c.fill();
        c.restore();
      } else {
        // Smoke
        c.fillStyle = 'rgba(200,200,200,.35)';
        c.beginPath();
        c.ellipse(cx, cy - 60, 3, 8, 0, 0, Math.PI * 2);
        c.fill();
      }
    }

    // Text on base
    c.fillStyle = 'rgba(245,208,122,.85)';
    c.font = 'bold 13px serif';
    c.textAlign = 'center';
    c.fillText('Happy Birthday!', 170, 350);
  }, []);

  useEffect(() => {
    drawCake(candlesOut);
  }, [candlesOut, drawCake]);

  const extinguishCandleAt = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    const x = (clientX - r.left) * (canvas.width / r.width);
    const y = (clientY - r.top) * (canvas.height / r.height);

    let newlyBlown = false;
    const nextCandles = [...candlesOut];

    for (let i = 0; i < TOTAL_CANDLES; i++) {
      const cx = 55 + i * 42;
      const cy = 160;
      if (Math.abs(x - cx) < 25 && y > cy - 80 && y < cy + 20 && !nextCandles[i]) {
        nextCandles[i] = true;
        newlyBlown = true;
      }
    }

    if (newlyBlown) {
      setCandlesOut(nextCandles);
      const totalOut = nextCandles.filter(Boolean).length;
      if (totalOut === TOTAL_CANDLES) {
        setAllBlown(true);
        if (onTriggerConfetti) onTriggerConfetti();
        if (onTriggerAchievement) {
          onTriggerAchievement('🎂', 'Wish Granted!', 'All candles blown — magic is happening!');
        }
      }
    }
  };

  const handleCanvasClick = (e) => {
    extinguishCandleAt(e.clientX, e.clientY);
  };

  const handleBlowAll = () => {
    setCandlesOut(new Array(TOTAL_CANDLES).fill(true));
    setAllBlown(true);
    if (onTriggerConfetti) onTriggerConfetti();
    if (onTriggerAchievement) {
      onTriggerAchievement('🎂', 'Wish Granted!', 'All candles blown — magic is happening!');
    }
  };

  return (
    <>
      <div className="scene-divider" aria-hidden="true" />
      <section className="cake-section" aria-label="Birthday Cake Candle Interaction">
        <div className="sec-header rev in">
          <span className="sec-eyebrow">✦ &nbsp; Make a Wish &nbsp; ✦</span>
          <h2 className="sec-h2">
            Blow Out the Candles
            <span className="sec-h2-script">Tap or click candles to blow them out</span>
          </h2>
        </div>
        <canvas
          id="cake-canvas"
          ref={canvasRef}
          width={340}
          height={360}
          onClick={handleCanvasClick}
          onTouchStart={(e) => {
            if (e.touches && e.touches.length > 0) {
              extinguishCandleAt(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          role="img"
          aria-label="Interactive birthday cake with 6 candles. Tap candles to extinguish."
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleBlowAll();
            }
          }}
        />
        <p className="cake-instruction" id="cake-instruction" aria-live="polite">
          {allBlown ? '✨ All candles blown! Your wish is granted! ✨' : 'Click or tap the candles to blow them out ✨'}
        </p>
        <p className={`cake-wish ${allBlown ? 'show' : ''}`} id="cake-wish">
          🌟 Your wish has been made — may it come true! 🌟
        </p>
      </section>
    </>
  );
};

export default CakeSection;
