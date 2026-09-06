import React, { useEffect, useRef } from 'react';

export const StarCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let isRunning = true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const starCount = Math.min(160, Math.floor((window.innerWidth * window.innerHeight) / 9000));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random(),
      s: Math.random() * 0.006 + 0.002,
      twinkle: Math.random() * Math.PI * 2,
    }));

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    const loop = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!prefersReducedMotion) {
          s.twinkle += s.s * 2.5;
          s.a = 0.25 + Math.sin(s.twinkle) * 0.45;
        }

        const dx = (mouseX - window.innerWidth / 2) * 0.006;
        const dy = (mouseY - window.innerHeight / 2) * 0.006;

        ctx.save();
        ctx.globalAlpha = Math.max(0.08, Math.min(1, s.a));
        ctx.fillStyle = i % 8 === 0 ? '#f5c8d8' : '#f5d07a';
        ctx.shadowBlur = s.r * 2.5;
        ctx.shadowColor = 'rgba(245,208,122,.5)';
        ctx.beginPath();
        ctx.arc(s.x + dx, s.y + dy, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
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

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="star-canvas" ref={canvasRef} aria-hidden="true" />;
};

export default StarCanvas;
