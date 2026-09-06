import React, { useRef } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { compressImageFile } from '../../utils/imageCompressor';
import { getPhotoForSlot } from '../../utils/dhanyaPhotos';

export const StoryScene = ({
  sceneNumber,
  sceneLabel,
  reverse = false,
  titleKey,
  bodyKey,
  captionKey,
  slotId,
  photo,
  onPhotoUpload,
  onOpenModal,
}) => {
  const { content, updateField, dirOn } = useDirector();
  const fileInputRef = useRef(null);

  const defaultCaptions = {
    scene_1: 'The moment that started it all — our beautiful beginning.',
    scene_2: 'Pure, unfiltered joy — our laughter is something I\'ll always treasure.',
    scene_3: 'An adventure we\'ll talk about forever.',
    scene_4: 'Memories with you are the most precious things I own.',
  };

  const currentCaption = content[captionKey] || defaultCaptions[slotId] || 'A memory worth a thousand words.';
  const effectiveImageUrl = photo?.image_url || getPhotoForSlot(slotId, { [slotId]: photo });

  const handleFrameClick = () => {
    if (effectiveImageUrl) {
      onOpenModal(effectiveImageUrl, currentCaption, slotId);
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFrameClick();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedDataUrl = await compressImageFile(file, 1280, 1280, 0.84);
      if (compressedDataUrl && onPhotoUpload) {
        onPhotoUpload(slotId, compressedDataUrl, currentCaption);
      }
    } catch (err) {
      console.warn('Image compression fallback error:', err);
    }
  };

  return (
    <>
      <div className="scene-divider" aria-hidden="true" />
      <section className="scene-section" aria-label={`Scene ${sceneNumber}: ${sceneLabel}`}>
        <div className={`scene-inner ${reverse ? 'reverse' : ''}`}>
          <div>
            <div className={reverse ? 'scene-badge rev-right' : 'scene-badge rev-left'}>
              <span className="scene-num" aria-hidden="true">{sceneNumber}</span>
              <span className="scene-label">{sceneLabel}</span>
            </div>
            <h2
              className={reverse ? 'scene-h2 rev-right' : 'scene-h2 rev-left'}
              style={{ transitionDelay: '.1s' }}
              data-edit
              contentEditable={dirOn}
              suppressContentEditableWarning
              onBlur={(e) => updateField(titleKey, e.currentTarget.textContent)}
              tabIndex={dirOn ? 0 : -1}
              role={dirOn ? 'textbox' : undefined}
            >
              {content[titleKey]}
            </h2>
            <p
              className={reverse ? 'scene-body rev-right' : 'scene-body rev-left'}
              style={{ transitionDelay: '.2s' }}
              data-edit
              contentEditable={dirOn}
              suppressContentEditableWarning
              onBlur={(e) => updateField(bodyKey, e.currentTarget.textContent)}
              tabIndex={dirOn ? 0 : -1}
              role={dirOn ? 'textbox' : undefined}
            >
              {content[bodyKey]}
            </p>
            <p
              className={reverse ? 'scene-caption-script rev-right' : 'scene-caption-script rev-left'}
              style={{ transitionDelay: '.3s' }}
              data-edit
              contentEditable={dirOn}
              suppressContentEditableWarning
              onBlur={(e) => updateField(captionKey, e.currentTarget.textContent)}
              tabIndex={dirOn ? 0 : -1}
              role={dirOn ? 'textbox' : undefined}
            >
              {content[captionKey]}
            </p>
          </div>

          <div className={reverse ? 'photo-frame-wrap rev-left' : 'photo-frame-wrap rev-right'}>
            <div className="frame-glow" aria-hidden="true" />
            <div
              className="photo-frame"
              onClick={handleFrameClick}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={0}
              aria-label={photo?.image_url ? `View memory for ${sceneLabel}` : `Upload photo for ${sceneLabel}`}
            >
              {effectiveImageUrl ? (
                <>
                  <img
                    src={effectiveImageUrl}
                    alt={currentCaption}
                    style={{ filter: photo?.filter_style || 'none' }}
                    loading="lazy"
                  />
                  <div className="photo-frame-overlay">
                    <button
                      type="button"
                      className="frame-act-btn view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenModal(effectiveImageUrl, currentCaption, slotId);
                      }}
                    >
                      🔍 View
                    </button>
                    <button
                      type="button"
                      className="frame-act-btn change-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      📷 Change Photo
                    </button>
                  </div>
                </>
              ) : (
                <div className="frame-placeholder">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p>Click to add your photo</p>
                </div>
              )}
              <div className="corner tl" aria-hidden="true" />
              <div className="corner tr" aria-hidden="true" />
              <div className="corner bl" aria-hidden="true" />
              <div className="corner br" aria-hidden="true" />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              aria-label={`Upload photo file for ${sceneLabel}`}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default StoryScene;
