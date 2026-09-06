import React, { useState, useEffect, useRef, useCallback } from 'react';
import apiService from '../../services/api';

const CARD_THEMES = [
  { bg1: '#03020a', bg2: '#1a1030', text: '#f5d07a', accent: '#c9922a', sub: '#f5c8d8' },
  { bg1: '#0a020a', bg2: '#2a0a20', text: '#f5c8d8', accent: '#c97a8a', sub: '#f5d07a' },
  { bg1: '#020514', bg2: '#0a1228', text: '#a8caff', accent: '#4a7abf', sub: '#c8e0ff' },
  { bg1: '#020f0a', bg2: '#072415', text: '#6de8be', accent: '#2a8a6a', sub: '#a0f0d8' },
];

export const ShareCardSection = ({ onTriggerAchievement }) => {
  const [recipientName, setRecipientName] = useState('My Best Friend');
  const [themeIdx, setThemeIdx] = useState(0);
  const canvasRef = useRef(null);

  const renderCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 600;
    const h = 340;
    const th = CARD_THEMES[themeIdx];
    const name = recipientName.trim() || 'My Best Friend';

    ctx.clearRect(0, 0, w, h);

    // Background gradient
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, th.bg1);
    g.addColorStop(1, th.bg2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Border
    ctx.strokeStyle = th.accent;
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    // Corner ornaments
    [[16, 16], [w - 16, 16], [16, h - 16], [w - 16, h - 16]].forEach(([x, y], i) => {
      ctx.strokeStyle = th.accent;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const sx = i % 2 === 0 ? 1 : -1;
      const sy = i < 2 ? 1 : -1;
      ctx.moveTo(x, y + sy * 20);
      ctx.lineTo(x, y);
      ctx.lineTo(x + sx * 20, y);
      ctx.stroke();
    });

    // Stars
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(245,208,122,${Math.random() * 0.4 + 0.1})`;
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 0.8 + 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Title
    ctx.fillStyle = th.accent;
    ctx.font = 'italic 11px serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦  A CINEMATIC BIRTHDAY EXPERIENCE  ✦', w / 2, 55);

    // Divider 1
    ctx.strokeStyle = th.accent;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(80, 68);
    ctx.lineTo(w - 80, 68);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Main text
    ctx.fillStyle = th.text;
    ctx.font = 'bold italic 48px serif';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 20;
    ctx.shadowColor = th.accent;
    ctx.fillText('Happy Birthday', w / 2, 135);
    ctx.shadowBlur = 0;

    // Recipient Name
    ctx.fillStyle = th.sub;
    ctx.font = 'italic 26px serif';
    ctx.fillText(name, w / 2, 175);

    // Divider 2
    ctx.strokeStyle = th.accent;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(150, 192);
    ctx.lineTo(w - 150, 192);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Quote
    ctx.fillStyle = 'rgba(240,230,208,.75)';
    ctx.font = 'italic 13px serif';
    ctx.fillText('"May this year be as extraordinary as you are."', w / 2, 220);

    // Bottom
    ctx.fillStyle = th.accent;
    ctx.font = '10px serif';
    ctx.fillText('✦  MADE WITH LOVE  ✦', w / 2, h - 30);
  }, [recipientName, themeIdx]);

  useEffect(() => {
    renderCard();
  }, [renderCard]);

  const cycleTheme = () => {
    setThemeIdx((prev) => (prev + 1) % CARD_THEMES.length);
    if (onTriggerAchievement) {
      onTriggerAchievement('🎨', 'Card Style', 'New birthday card design generated!');
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderCard();
    const dataUrl = canvas.toDataURL('image/png');
    const safeName = (recipientName.trim() || 'card').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const link = document.createElement('a');
    link.download = `happy-birthday-${safeName}.png`;
    link.href = dataUrl;
    link.click();

    // Save to database
    try {
      apiService.saveCard({
        recipient_name: recipientName.trim() || 'My Best Friend',
        theme_index: themeIdx,
        message: 'May this year be as extraordinary as you are.',
        image_preview: dataUrl,
      });
    } catch (e) {
      console.warn('Could not save card to DB:', e);
    }

    if (onTriggerAchievement) {
      onTriggerAchievement('⬇️', 'Card Downloaded!', 'Share the love with your birthday person');
    }
  };

  return (
    <>
      <div className="scene-divider" aria-hidden="true" />
      <section className="share-section" id="share-section" aria-label="Birthday Card Generator">
        <div className="sec-header rev in">
          <span className="sec-eyebrow">✦ &nbsp; Share the Love &nbsp; ✦</span>
          <h2 className="sec-h2">
            Create a Birthday Card
            <span className="sec-h2-script">Generate &amp; download a card to share</span>
          </h2>
        </div>

        <div className="share-panel">
          <input
            type="text"
            className="share-inp"
            id="share-name"
            placeholder="Type their name here..."
            maxLength={40}
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            aria-label="Birthday Card Recipient Name"
          />
          <div className="share-canvas-wrap">
            <canvas id="share-canvas" ref={canvasRef} width={600} height={340} aria-label="Generated Birthday Card Preview" />
          </div>
          <div className="share-ctrls" role="group" aria-label="Card Actions">
            <button className="s-btn" onClick={renderCard} type="button">
              ✦ Refresh Card
            </button>
            <button className="s-btn" onClick={handleDownload} type="button">
              ⬇ Download PNG
            </button>
            <button className="s-btn" onClick={cycleTheme} type="button">
              🎨 Change Style
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShareCardSection;
