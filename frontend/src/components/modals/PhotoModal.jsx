import React, { useEffect, useRef, useState } from 'react';
import { compressImageFile } from '../../utils/imageCompressor';

export const PhotoModal = ({
  isOpen,
  photoSrc,
  caption,
  slotId,
  onPhotoUpload,
  onTriggerAchievement,
  onClose,
}) => {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const fileInputRef = useRef(null);
  const [currentSrc, setCurrentSrc] = useState(photoSrc);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setCurrentSrc(photoSrc);
  }, [photoSrc]);

  useEffect(() => {
    if (!isOpen) return;

    // Lock background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    const timer = setTimeout(() => {
      if (closeBtnRef.current) {
        closeBtnRef.current.focus();
      }
    }, 100);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsChanging(true);
    try {
      const compressed = await compressImageFile(file, 1280, 1280, 0.86);
      if (compressed) {
        setCurrentSrc(compressed);
        const targetSlot = slotId || 'modal_photo';
        if (onPhotoUpload) {
          await onPhotoUpload(targetSlot, compressed, caption || 'Special Memory');
        }
        if (onTriggerAchievement) {
          onTriggerAchievement('📸', 'Photo Replaced', 'Updated the memory with a brand new picture!');
        }
      }
    } catch (err) {
      console.warn('Error replacing modal photo:', err);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div
      id="popup"
      className="open"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-sub"
      ref={modalRef}
    >
      <div className="popup-box">
        <div className="popup-frame" id="popup-frame">
          {currentSrc ? (
            <img src={currentSrc} alt={caption || 'Cinematic Memory'} />
          ) : (
            <div
              className="pop-ph"
              id="popup-ph"
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: 'pointer' }}
            >
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Click here to upload your photo
            </div>
          )}
          <div className="popup-sub-bar">
            <p className="popup-sub" id="popup-sub">
              {caption || 'One of the happiest moments of my life.'}
            </p>
          </div>
        </div>

        <div className="popup-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="popup-change-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={isChanging}
            aria-label="Change photo"
          >
            {isChanging ? '⏳ Updating...' : '📷 Change Photo'}
          </button>
          <button
            type="button"
            className="popup-close"
            onClick={onClose}
            ref={closeBtnRef}
            aria-label="Close memory modal"
          >
            ✕ Close
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          aria-label="Upload replacement photo"
        />
      </div>
    </div>
  );
};

export default PhotoModal;

