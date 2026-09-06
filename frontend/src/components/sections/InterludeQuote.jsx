import React from 'react';
import { useDirector } from '../../context/DirectorContext';

export const InterludeQuote = ({ quoteKey, attrKey, isPink = false }) => {
  const { content, updateField, dirOn } = useDirector();

  return (
    <div
      className="interlude"
      role="region"
      aria-label="Quote Interlude"
      style={
        isPink
          ? {
              background:
                'radial-gradient(ellipse 70% 50% at center, rgba(201,146,42,.06) 0%, transparent 70%)',
            }
          : undefined
      }
    >
      <p
        className="interlude-quote rev in"
        style={
          isPink
            ? {
                color: 'var(--pink2)',
                textShadow: '0 0 40px rgba(232,160,180,.3)',
              }
            : undefined
        }
        data-edit
        contentEditable={dirOn}
        suppressContentEditableWarning
        onBlur={(e) => updateField(quoteKey, e.currentTarget.textContent)}
        tabIndex={dirOn ? 0 : -1}
        role={dirOn ? 'textbox' : undefined}
      >
        {content[quoteKey]}
      </p>
      <p
        className="interlude-attr rev in"
        style={{ transitionDelay: '.2s' }}
        data-edit
        contentEditable={dirOn}
        suppressContentEditableWarning
        onBlur={(e) => updateField(attrKey, e.currentTarget.textContent)}
        tabIndex={dirOn ? 0 : -1}
        role={dirOn ? 'textbox' : undefined}
      >
        {content[attrKey]}
      </p>
    </div>
  );
};

export default InterludeQuote;
