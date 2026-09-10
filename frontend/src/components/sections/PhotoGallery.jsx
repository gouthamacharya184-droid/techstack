import React, { useState, useRef, useMemo } from 'react';
import { compressImageFile } from '../../utils/imageCompressor';
import { DHANYA_PHOTOS, getPhotoForSlot } from '../../utils/dhanyaPhotos';

const GALLERY_CAPTIONS = [
  'Radiant smile that brightens up every room ✨',
  'Unfiltered laughter and pure golden joy.',
  'One of the happiest, most unforgettable days.',
  'Every single picture tells our beautiful story.',
  'That signature Dhanya sparkle in your eyes 🌟',
  'Adventures are always ten times better with you.',
  'A chapter I will happily re-read a thousand times.',
  'Turning ordinary moments into lifelong treasures.',
  'Nothing in this world compares to memories like these.',
  'Living our very best lives, one candid smile at a time.',
  'Pure magic captured in a single frame.',
  'Time stood still — just for this unforgettable moment.',
  'Your laughter is the soundtrack to my happiest days.',
  'Golden memories with a truly golden best friend.',
  'The kind of memory that forever warms the soul.',
  'A snapshot of someone genuinely extraordinary.',
  'Candid moments of pure joy and effortless grace.',
  'Spontaneous adventures and non-stop giggles.',
  'Your positive energy is completely contagious 💫',
  'Looking absolutely gorgeous as always 👑',
  'A heart of gold and a smile that never fades.',
  'Through every season, our bond only grows stronger.',
  'The sweetest memory from an unforgettable chapter.',
  'Creating stories we will laugh about for decades.',
  'That effortless charm and beautiful spirit.',
  'Every snapshot captures a piece of your sunshine.',
  'Unmatched vibes and memories to cherish forever.',
  'The brightest star in every room you enter ⭐',
  'Celebrating the wonderful person that you are.',
  'So grateful for every laugh we have shared.',
  'Moments that make you stop and smile with gratitude.',
  'True friendship that time and distance cannot change.',
  'Forever young, forever vibrant, forever Dhanya ✨',
  'Crazy fun times and priceless memories.',
  'A timeless portrait of grace and happiness.',
  'Nothing but smiles and good vibes all day long.',
  'Cherished snapshot from a picture-perfect day.',
  'Your kindness makes this world a sweeter place.',
  'The beauty of genuine friendship in one frame.',
  'Here is to a lifetime of adventures waiting ahead!',
  'Unforgettable milestones with my favorite person.',
  'Always bringing warmth and joy wherever you go.',
  'Capturing the sparkle of your wonderful personality.',
  'A snapshot of true happiness and peace 🌸',
  'Candid perfection — pure, real, and unforgettable.',
  'Celebrating the queen of our hearts 👑',
  'Golden hour glow and an even brighter smile.',
  'The memories we treasure most are made with you.',
  'Treasured forever in the archives of my heart.',
  'Happy Birthday to the most amazing Dhanya!',
  'Forever blessed to have you in my life 💛'
];

const CATEGORIES = [
  { id: 'all', label: 'All Photos (51)' },
  { id: 'favorites', label: '⭐ Favorites' },
  { id: 'candid', label: '✨ Candids' },
  { id: 'portraits', label: '👑 Portraits' },
  { id: 'adventures', label: '🌟 Adventures' }
];

export const PhotoGallery = ({ photos = {}, onUploadPhoto, onOpenModal, onTriggerAchievement }) => {
  const fileInputRef = useRef(null);
  const activeUploadSlot = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [displayLimit, setDisplayLimit] = useState(51);

  // Map all 51 photos into items
  const allItems = useMemo(() => {
    return DHANYA_PHOTOS.map((defaultSrc, index) => {
      const slotId = `gallery_${index}`;
      const photoUrl = photos[slotId]?.image_url || defaultSrc;
      const caption = photos[slotId]?.caption || GALLERY_CAPTIONS[index] || `Treasured Memory #${index + 1}`;
      
      // Categorize items
      let category = 'favorites';
      if (index % 4 === 1) category = 'candid';
      else if (index % 4 === 2) category = 'portraits';
      else if (index % 4 === 3) category = 'adventures';

      return {
        index,
        slotId,
        photoUrl,
        caption,
        category,
        filterStyle: photos[slotId]?.filter_style || 'none'
      };
    });
  }, [photos]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return allItems;
    return allItems.filter(item => item.category === selectedCategory);
  }, [allItems, selectedCategory]);

  const visibleItems = filteredItems.slice(0, displayLimit);

  const handleMouseMove = (e, cardEl) => {
    if (!cardEl || window.matchMedia('(pointer: coarse)').matches) return;
    const r = cardEl.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 2;
    cardEl.style.transform = `perspective(900px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) scale(1.02)`;
  };

  const handleMouseLeave = (cardEl) => {
    if (!cardEl) return;
    cardEl.style.transform = 'perspective(900px) rotateY(0) rotateX(0) scale(1)';
  };

  const handleCardClick = (item) => {
    if (onOpenModal && item.photoUrl) {
      onOpenModal(item.photoUrl, item.caption, item.slotId);
      if (onTriggerAchievement) {
        onTriggerAchievement('📸', 'Memory Explorer', `Viewing "${item.caption.slice(0, 30)}..."`);
      }
    }
  };

  const handleUploadClick = (e, slotId) => {
    e.stopPropagation();
    activeUploadSlot.current = slotId;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadSlot.current) return;

    try {
      const compressed = await compressImageFile(file, 1200, 1200, 0.84);
      if (compressed && onUploadPhoto) {
        const slot = activeUploadSlot.current;
        const idx = parseInt(slot.replace('gallery_', ''), 10) || 0;
        onUploadPhoto(slot, compressed, GALLERY_CAPTIONS[idx] || 'Custom Photo', 'none');
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
      <section className="gallery-section" id="photo-gallery" aria-label="Dhanya Photo Gallery">
        <div className="sec-header rev in">
          <span className="sec-eyebrow">✦ &nbsp; The Grand Film Reel &nbsp; ✦</span>
          <h2 className="sec-h2">
            Every Frame a Treasured Memory
            <span className="sec-h2-script">A showcase of all 51 golden moments with Dhanya</span>
          </h2>
          <div style={{ marginTop: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', background: 'rgba(232, 184, 75, 0.1)', border: '1px solid rgba(232, 184, 75, 0.3)', borderRadius: '30px', fontSize: '0.78rem', color: 'var(--gold2)', letterSpacing: '0.1em' }}>
            <span>📸</span>
            <span>Displaying <strong>{filteredItems.length}</strong> Captured Memories</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="gallery-filters" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', margin: '2rem auto 2.5rem', maxWidth: '800px', padding: '0 1rem' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setDisplayLimit(51);
              }}
              style={{
                background: selectedCategory === cat.id ? 'linear-gradient(135deg, var(--gold2), var(--gold))' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat.id ? '#07050f' : 'var(--cream)',
                border: selectedCategory === cat.id ? 'none' : '1px solid rgba(232, 184, 75, 0.25)',
                padding: '8px 18px',
                borderRadius: '24px',
                fontSize: '0.82rem',
                fontWeight: selectedCategory === cat.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: selectedCategory === cat.id ? '0 4px 15px rgba(201, 146, 42, 0.4)' : 'none'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 51-Photo Grid */}
        <div className="gallery-grid" id="galleryGrid">
          {visibleItems.map((item) => (
            <div
              key={item.slotId}
              className="gcard rev in"
              onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
              onClick={() => handleCardClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(item);
                }
              }}
              aria-label={`View photo ${item.index + 1}: ${item.caption}`}
            >
              <img
                src={item.photoUrl}
                alt={item.caption}
                style={{ filter: item.filterStyle }}
                loading="lazy"
              />
              <div className="gcard-overlay">
                <span style={{ fontSize: '0.68rem', color: 'var(--gold2)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
                  Memory #{item.index + 1}
                </span>
                <p className="gcard-cap" style={{ fontSize: '0.84rem', marginTop: '4px', lineHeight: 1.3 }}>
                  {item.caption}
                </p>
                <div className="gcard-act-row">
                  <button
                    type="button"
                    className="gcard-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(item);
                    }}
                  >
                    🔍 View Full
                  </button>
                  <button
                    type="button"
                    className="gcard-btn change-btn"
                    onClick={(e) => handleUploadClick(e, item.slotId)}
                  >
                    📷 Change
                  </button>
                </div>
              </div>
            </div>
          ))}
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
