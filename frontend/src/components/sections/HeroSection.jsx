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
      </div>
      <div className="scroll-hint" aria-hidden="true">
        <span>Scroll to begin</span>
        <div className="scroll-arrow" />
      </div>
    </section>
  );
};

export default HeroSection;
