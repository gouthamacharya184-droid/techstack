import React, { useState, useRef, useEffect, useCallback } from 'react';
import { compressImageFile } from '../../utils/imageCompressor';
import { getPhotoForSlot } from '../../utils/dhanyaPhotos';

const POLAROID_DEFAULTS = [
  { caption: 'That golden day 🌟', rx: 0.08, ry: 0.08, rot: -6 },
  { caption: 'Forever laughing 💛', rx: 0.28, ry: 0.15, rot: 4 },
  { caption: 'Our favourite place ✨', rx: 0.48, ry: 0.05, rot: -3 },
  { caption: 'Pure magic 🌸', rx: 0.68, ry: 0.12, rot: 6 },
  { caption: 'Better together 🎉', rx: 0.12, ry: 0.52, rot: 3 },
  { caption: 'Unforgettable ⭐', rx: 0.38, ry: 0.48, rot: -4 },
  { caption: 'Just us 💝', rx: 0.62, ry: 0.44, rot: 5 },
  { caption: 'The best adventure 💫', rx: 0.80, ry: 0.35, rot: -5 },
];

export const PolaroidWall = ({ photos = {}, onUploadPhoto, onTriggerAchievement }) => {
  const arenaRef = useRef(null);
  const fileInputRef = useRef(null);
  const activeUploadSlot = useRef(null);

  const [positions, setPositions] = useState([]);

  // Calculate layout based on arena dimensions
  const updateLayout = useCallback(() => {
    if (!arenaRef.current) return;
    const w = arenaRef.current.offsetWidth || 800;
    const h = arenaRef.current.offsetHeight || 500;
    const isMobile = w < 600;

    const polW = isMobile ? 150 : 185;
    const polH = isMobile ? 190 : 230;

    setPositions((prev) => {
      // If already initialized and not empty, maintain relative positions
      if (prev.length === POLAROID_DEFAULTS.length) {
        return prev.map((pos) => ({
          ...pos,
          x: Math.max(5, Math.min(pos.x, w - polW - 10)),
          y: Math.max(5, Math.min(pos.y, h - polH - 10)),
        }));
      }

      return POLAROID_DEFAULTS.map((p, idx) => {
        let x, y;
        if (isMobile) {
          // Staggered grid on mobile
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          x = 10 + col * (w / 2 - 10);
          y = 15 + row * 115;
        } else {
          x = Math.max(10, Math.min(p.rx * w, w - polW - 15));
          y = Math.max(10, Math.min(p.ry * h, h - polH - 15));
        }

        return {
          x,
          y,
          rot: p.rot,
          zIndex: idx + 1,
        };
      });
    });
  }, []);

  useEffect(() => {
    updateLayout();
    window.addEventListener('resize', updateLayout, { passive: true });
    return () => window.removeEventListener('resize', updateLayout);
  }, [updateLayout]);

  const draggingIdx = useRef(null);
  const dragStartPos = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const handleDragStart = (e, index) => {
    if (e.target.tagName === 'INPUT') return;
    draggingIdx.current = index;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const currentPos = positions[index] || { x: 0, y: 0 };
    dragStartPos.current = {
      startX: clientX,
      startY: clientY,
      initialX: currentPos.x,
      initialY: currentPos.y,
    };

    setPositions((prev) =>
      prev.map((pos, i) => (i === index ? { ...pos, zIndex: 100 } : pos))
    );
  };

  useEffect(() => {
    const onMove = (e) => {
      if (draggingIdx.current === null || !arenaRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const dx = clientX - dragStartPos.current.startX;
      const dy = clientY - dragStartPos.current.startY;

      const arenaW = arenaRef.current.offsetWidth;
      const arenaH = arenaRef.current.offsetHeight;
      const cardW = window.innerWidth < 600 ? 150 : 185;
      const cardH = window.innerWidth < 600 ? 190 : 230;

      const newX = Math.max(0, Math.min(dragStartPos.current.initialX + dx, arenaW - cardW));
      const newY = Math.max(0, Math.min(dragStartPos.current.initialY + dy, arenaH - cardH));

      setPositions((prev) =>
        prev.map((pos, i) =>
          i === draggingIdx.current
            ? {
                ...pos,
                x: newX,
                y: newY,
              }
            : pos
        )
      );
    };

    const onEnd = () => {
      draggingIdx.current = null;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, []);

  const handleUploadClick = (index) => {
    activeUploadSlot.current = `polaroid_${index}`;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadSlot.current) return;

    try {
      const compressed = await compressImageFile(file, 1000, 1000, 0.85);
      if (compressed && onUploadPhoto) {
        const slot = activeUploadSlot.current;
        const idx = parseInt(slot.replace('polaroid_', ''), 10);
        onUploadPhoto(slot, compressed, POLAROID_DEFAULTS[idx]?.caption);
        if (onTriggerAchievement) {
          onTriggerAchievement('🖼️', 'Polaroid Pinned!', 'A memory added to the wall');
        }
      }
    } catch (err) {
      console.warn('Polaroid upload error:', err);
    }
  };

  return (
    <>
      <div className="scene-divider" aria-hidden="true" />
      <section className="polaroid-section" aria-label="Polaroid Wall of Memories">
        <div className="sec-header rev in">
          <span className="sec-eyebrow">✦ &nbsp; Drag &amp; Drop &nbsp; ✦</span>
          <h2 className="sec-h2">
            Our Polaroid Wall
            <span className="sec-h2-script">Drag the memories — tap to add photos</span>
          </h2>
        </div>
        <div className="polaroid-arena" id="polaroid-arena" ref={arenaRef}>
          {POLAROID_DEFAULTS.map((p, i) => {
            const slotId = `polaroid_${i}`;
            const photoUrl = photos[slotId]?.image_url || getPhotoForSlot(slotId, photos);
            const pos = positions[i] || { x: 20, y: 20, rot: p.rot, zIndex: i + 1 };

            return (
              <div
                key={i}
                className="polaroid"
                style={{
                  transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.rot}deg)`,
                  zIndex: pos.zIndex,
                }}
                onMouseDown={(e) => handleDragStart(e, i)}
                onTouchStart={(e) => handleDragStart(e, i)}
                role="region"
                aria-label={`Polaroid memory: ${p.caption}`}
              >
                <div
                  className="polaroid-img"
                  id={`polimg${i}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUploadClick(i);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      handleUploadClick(i);
                    }
                  }}
                  aria-label={photoUrl ? 'Change photo' : 'Add photo'}
                >
                  {photoUrl ? (
                    <img src={photoUrl} alt={p.caption} loading="lazy" />
                  ) : (
                    <>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span style={{ fontSize: '.5rem', letterSpacing: '.2em', textTransform: 'uppercase' }}>
                        click to add
                      </span>
                    </>
                  )}
                </div>
                <div className="polaroid-caption">{p.caption}</div>
              </div>
            );
          })}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          aria-label="Upload polaroid memory photo"
        />
      </section>
    </>
  );
};

export default PolaroidWall;
