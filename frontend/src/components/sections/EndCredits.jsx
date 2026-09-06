import React from 'react';
import { useDirector } from '../../context/DirectorContext';
import { useTheme } from '../../context/ThemeContext';

export const EndCredits = () => {
  const { content, updateField, dirOn } = useDirector();
  const { endCreditsOn, hideEndCredits } = useTheme();

  return (
    <div
      id="end-credits"
      className={endCreditsOn ? 'show' : ''}
      role="region"
      aria-label="Movie End Credits Roll"
    >
      <div className="credits-grain" aria-hidden="true" />
      <div className="credits-vignette" aria-hidden="true" />
      
      {endCreditsOn && (
        <button
          onClick={hideEndCredits}
          aria-label="Close end credits roll"
          style={{
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            zIndex: 9999,
            background: 'rgba(3,2,10,0.85)',
            border: '1px solid rgba(201,146,42,0.5)',
            color: 'var(--gold2)',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '0.8rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            padding: '0.5rem 1.2rem',
            cursor: 'pointer',
            borderRadius: '2px',
            transition: 'all 0.3s',
          }}
        >
          ✕ &nbsp; Close Credits
        </button>
      )}

      <div className="credits-scroll">
        <div className="credit-block">
          <div className="credit-title-big">The End</div>
          <div className="credit-fin">A Cinematic Birthday Experience</div>
        </div>
        <div className="credit-divider" aria-hidden="true" />
        <div className="credit-block">
          <div className="credit-role">Presented by</div>
          <div
            className="credit-name"
            data-edit
            contentEditable={dirOn}
            suppressContentEditableWarning
            onBlur={(e) => updateField('credits_presenter', e.currentTarget.textContent)}
            tabIndex={dirOn ? 0 : -1}
            role={dirOn ? 'textbox' : undefined}
          >
            {content.credits_presenter}
          </div>
        </div>
        <div className="credit-divider" aria-hidden="true" />
        <div className="credit-block">
          <div className="credit-role">The Star of This Film</div>
          <div
            className="credit-name"
            data-edit
            contentEditable={dirOn}
            suppressContentEditableWarning
            onBlur={(e) => updateField('credits_star', e.currentTarget.textContent)}
            tabIndex={dirOn ? 0 : -1}
            role={dirOn ? 'textbox' : undefined}
          >
            {content.credits_star}
          </div>
        </div>
        <div className="credit-block">
          <div className="credit-role">Best Supporting Role</div>
          <div className="credit-name">Your Incredible Smile</div>
        </div>
        <div className="credit-divider" aria-hidden="true" />
        <div className="credit-block">
          <div className="credit-role">Directed with Love by</div>
          <div
            className="credit-name"
            data-edit
            contentEditable={dirOn}
            suppressContentEditableWarning
            onBlur={(e) => updateField('credits_director', e.currentTarget.textContent)}
            tabIndex={dirOn ? 0 : -1}
            role={dirOn ? 'textbox' : undefined}
          >
            {content.credits_director}
          </div>
        </div>
        <div className="credit-block">
          <div className="credit-role">Written from the Heart by</div>
          <div className="credit-name">Someone Who Treasures Every Moment with You</div>
        </div>
        <div className="credit-divider" aria-hidden="true" />
        <div className="credit-block">
          <div className="credit-title-big">Happy Birthday</div>
          <div className="credit-fin">"May this year be as extraordinary as you are."</div>
        </div>
        <div className="credit-divider" aria-hidden="true" />
        <div className="credit-block">
          <div className="credit-fin" style={{ fontSize: '.7rem', letterSpacing: '.3em' }}>
            No memories were harmed in the making of this film.
            <br />
            All laughter is 100% genuine.
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndCredits;
