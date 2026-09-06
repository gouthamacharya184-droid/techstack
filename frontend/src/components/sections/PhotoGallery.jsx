import React, { useState, useRef } from 'react';
import { compressImageFile } from '../../utils/imageCompressor';
import { getPhotoForSlot } from '../../utils/dhanyaPhotos';

const GALLERY_CAPTIONS = [
  'One of the happiest moments of my life.',
  'Every smile of yours is a beautiful story.',
  'Memories with you are priceless.',
  'This moment lives in my heart forever.',
  'Pure joy, captured in time.',
  'Adventures are better with you by my side.',
  'A chapter I\'ll re-read a thousand times.',
  'You make ordinary days extraordinary.',
  'Nothing compares to moments like these.',
  'Here we were living our very best lives.',
  'Every picture tells our golden story.',
  'Time stood still — just for us.',
  'This smile is the reason I believe in magic.',
  'Golden memories, golden friendship.',
  'The kind of memory that warms the soul.',
  'A snapshot of something truly beautiful.',
];

export const PhotoGallery = ({ photos = {}, onUploadPhoto, onOpenModal, onTriggerAchievement }) => {
  const fileInputRef = useRef(null);
  const activeUploadSlot = useRef(null);

  const handleMouseMove = (e, cardEl) => {
    if (!cardEl || window.matchMedia('(pointer: coarse)').matches) return;
    const r = cardEl.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 2;
    cardEl.style.transform = `perspective(900px) rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg) scale(1.03)`;
  };

  const handleMouseLeave = (cardEl) => {
    if (!cardEl) return;
    cardEl.style.transform = 'perspective(900px) rotateY(0) rotateX(0) scale(1)';
  };

  const handleCardClick = (index) => {
    const slotId = `gallery_${index}`;
    const photoData = photos[slotId];
    if (photoData?.image_url) {
      onOpenModal(photoData.image_url, GALLERY_CAPTIONS[index]);
    } else {
      activeUploadSlot.current = slotId;
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(index);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadSlot.current) return;

    try {
      const compressed = await compressImageFile(file, 1200, 1200, 0.84);
      if (compressed && onUploadPhoto) {
        const slot = activeUploadSlot.current;
        const idx = parseInt(slot.replace('gallery_', ''), 10);
        onUploadPhoto(slot, compressed, GALLERY_CAPTIONS[idx], 'none');
        if (onTriggerAchievement) {
          onTriggerAchievement('📸', 'Memory Added', 'A beautiful moment captured forever');
        }
      }
    } catch (err) {
      console.warn('Gallery upload error:', err);
    }
  };

  return (
    <>
      <div className="scene-divider" aria-hidden="true" />
      <section className="gallery-section" aria-label="Photo Gallery">
        <div className="sec-header rev in">
          <span className="sec-eyebrow">✦ &nbsp; The Film Reel &nbsp; ✦</span>
          <h2 className="sec-h2">
            Every Frame a Memory
            <span className="sec-h2-script">A collection of golden moments</span>
          </h2>
        </div>

        <div className="gallery-grid" id="galleryGrid">
          {Array.from({ length: 16 }, (_, i) => {
            const slotId = `gallery_${i}`;
            const photoUrl = photos[slotId]?.image_url || getPhotoForSlot(slotId, photos);
            const caption = GALLERY_CAPTIONS[i];

            return (
              <div
                key={i}
                className="gcard rev in"
                style={{ transitionDelay: `${(i % 4) * 0.05}s` }}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                onClick={() => {
                  if (photoUrl) {
                    onOpenModal(photoUrl, caption, slotId);
                  } else {
                    handleCardClick(i);
                  }
                }}
                onKeyDown={(e) => handleKeyDown(e, i)}
                role="button"
                tabIndex={0}
                aria-label={photoUrl ? `View ${caption}` : `Upload photo for frame ${i + 1}`}
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={caption}
                    style={{ filter: photos[slotId]?.filter_style || 'none' }}
                    loading="lazy"
                  />
                ) : (
                  <div className="gph">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>Photo {i + 1}</span>
                  </div>
                )}
                <div className="gcard-overlay">
                  <p className="gcard-cap">{caption}</p>
                  <div className="gcard-act-row">
                    <button
                      type="button"
                      className="gcard-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (photoUrl) {
                          onOpenModal(photoUrl, caption, slotId);
                        } else {
                          handleCardClick(i);
                        }
                      }}
                    >
                      🔍 View
                    </button>
                    <button
                      type="button"
                      className="gcard-btn change-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        activeUploadSlot.current = slotId;
                        fileInputRef.current?.click();
                      }}
                    >
                      📷 Change
                    </button>
                  </div>
                </div>
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
          aria-label="Upload gallery photo"
        />
      </section>
    </>
  );
};

export default PhotoGallery;
