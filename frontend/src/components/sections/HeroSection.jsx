import React from 'react';
import { useDirector } from '../../context/DirectorContext';

export const HeroSection = () => {
  const { content, updateField, dirOn } = useDirector();

  return (
    <section className="hero" aria-label="Hero Introduction">
      <div className="hero-bg-grad" aria-hidden="true" />
      <div className="hero-content">
        <div className="eyebrow-pill rev in">✦ &nbsp; A Story of Two Souls &nbsp; ✦</div>
        <h1
          className="hero-h1 rev in"
          style={{ transitionDelay: '.15s' }}
          data-edit
          contentEditable={dirOn}
          suppressContentEditableWarning
          onBlur={(e) => updateField('hero_title', e.currentTarget.textContent)}
          tabIndex={dirOn ? 0 : -1}
          role={dirOn ? 'textbox' : undefined}
        >
          {content.hero_title}
        </h1>
        <p
          className="hero-script rev in"
          style={{ transitionDelay: '.25s' }}
          data-edit
          contentEditable={dirOn}
          suppressContentEditableWarning
          onBlur={(e) => updateField('hero_subtitle', e.currentTarget.textContent)}
          tabIndex={dirOn ? 0 : -1}
          role={dirOn ? 'textbox' : undefined}
        >
          {content.hero_subtitle}
        </p>
        <div className="hero-rule rev in" style={{ transitionDelay: '.35s' }} aria-hidden="true" />
        <p
          className="hero-body rev in"
          style={{ transitionDelay: '.45s' }}
          data-edit
          contentEditable={dirOn}
          suppressContentEditableWarning
          onBlur={(e) => updateField('hero_body', e.currentTarget.textContent)}
          tabIndex={dirOn ? 0 : -1}
          role={dirOn ? 'textbox' : undefined}
        >
          {content.hero_body}
        </p>
        <div className="rev in" style={{ transitionDelay: '.55s', marginTop: '28px' }}>
          <button
            type="button"
            className="hero-video-btn"
            onClick={() => {
              const el = document.getElementById('cinema-video');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: 'linear-gradient(135deg, rgba(232, 184, 75, 0.15), rgba(201, 146, 42, 0.25))',
              border: '1px solid rgba(232, 184, 75, 0.6)',
              color: 'var(--gold2)',
              padding: '10px 24px',
              borderRadius: '30px',
              fontSize: '0.82rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(232, 184, 75, 0.15)',
              transition: 'all 0.3s ease',
            }}
          >
            <span>🎬</span>
            <span>Watch Premiere Video</span>
          </button>
        </div>
      </div>
      <div className="scroll-hint" aria-hidden="true">
        <span>Scroll to begin</span>
        <div className="scroll-arrow" />
      </div>
    </section>
  );
};

export default HeroSection;
