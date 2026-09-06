import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const AuroraCanvas = () => {
  const canvasRef = useRef(null);
  const { auroraOn } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let isRunning = auroraOn;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    let t = 0;
    const bands = [
      { y: 0.3, hue: 280, amp: 70 },
      { y: 0.45, hue: 200, amp: 55 },
      { y: 0.35, hue: 120, amp: 65 },
    ];

    const loop = () => {
      if (!isRunning) return;
      t += 0.006;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bands.forEach((b) => {
        const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
        g.addColorStop(0, 'transparent');
        g.addColorStop(0.3, `hsla(${b.hue}, 80%, 50%, 0.12)`);
        g.addColorStop(0.7, `hsla(${b.hue + 30}, 70%, 60%, 0.08)`);
        g.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x += 12) {
          const y =
            canvas.height * b.y +
            Math.sin(x * 0.004 + t) * b.amp +
            Math.sin(x * 0.008 - t * 0.7) * b.amp * 0.5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fillStyle = g;
        ctx.fill();
      });

      if (auroraOn) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else if (auroraOn) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    if (auroraOn) {
      isRunning = true;
      loop();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, [auroraOn]);

  return (
    <canvas
      id="aurora-canvas"
      ref={canvasRef}
      className={auroraOn ? 'on' : ''}
      aria-hidden="true"
    />
  );
};

export default AuroraCanvas;
