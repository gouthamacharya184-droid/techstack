import React, { useState, useRef } from 'react';
import { useDirector } from '../../context/DirectorContext';
import apiService from '../../services/api';

const DEFAULT_LETTER_TEXT = `Today, on your birthday, I want you to know something important — something I don't say nearly enough.

You have changed my life in ways that words can barely capture. Your kindness, your laughter, your incredible spirit... they make the world a genuinely better place. Every single day.

From the very first moment we became friends, I knew there was something extraordinary about you. And time has only confirmed what I suspected — you are one of the most beautiful souls I have ever had the privilege of knowing.

So on this special day, I want you to feel celebrated, cherished, and endlessly loved. Because you deserve every single bit of happiness the universe can offer.

Thank you for being exactly who you are. Happy Birthday, my dearest friend. 🌟`;

export const SecretLetter = ({ onTriggerAchievement }) => {
  const { content, updateField, dirOn } = useDirector();
  const [inputVal, setInputVal] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [typedLetter, setTypedLetter] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const letterSectionRef = useRef(null);

  const startTypewriter = (fullText) => {
    setIsTyping(true);
    setTypedLetter('');
    let i = 0;

    const typeNext = () => {
      if (i < fullText.length) {
        setTypedLetter(fullText.slice(0, i + 1));
        const delay = fullText[i] === '\n' ? 300 : 22;
        i++;
        setTimeout(typeNext, delay);
      } else {
        setIsTyping(false);
      }
    };

    typeNext();
  };

  const handleUnlock = async () => {
    const val = inputVal.trim();
    if (!val || isVerifying) return;

    setIsVerifying(true);
    setShowError(false);

    try {
      const res = await apiService.verifySecret(val);
      if (res && res.success) {
        setUnlocked(true);
        if (onTriggerAchievement) {
          onTriggerAchievement('🔓', 'Secret Unlocked!', 'The hidden love letter is revealed!');
        }

        setTimeout(() => {
          if (letterSectionRef.current) {
            letterSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          startTypewriter(res.letter_body || content.secret_letter_body || DEFAULT_LETTER_TEXT);
        }, 500);
      } else {
        // Fallback local check
        const allowed = ['birthday', 'happy birthday', 'love', 'friend', 'magic', 'dhanya'];
        if (allowed.some((w) => val.toLowerCase().includes(w))) {
          setUnlocked(true);
          if (onTriggerAchievement) {
            onTriggerAchievement('🔓', 'Secret Unlocked!', 'The hidden love letter is revealed!');
          }
          setTimeout(() => {
            if (letterSectionRef.current) {
              letterSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            startTypewriter(DEFAULT_LETTER_TEXT);
          }, 500);
        } else {
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        }
      }
    } catch (e) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <div className="scene-divider" aria-hidden="true" />
      <section className="secret-section" aria-label="Secret Passcode Message">
        <div className="sec-header rev in">
          <span className="sec-eyebrow">✦ &nbsp; A Hidden Message &nbsp; ✦</span>
          <h2 className="sec-h2">
            Unlock a Secret
            <span className="sec-h2-script">Type the magic word to reveal</span>
          </h2>
        </div>

        <div style={{ position: 'relative', zIndex: 1, marginTop: '1rem' }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }} aria-hidden="true">🔐</div>
          <div className="secret-row">
            <input
              type="text"
              id="sec-input"
              placeholder="Type the magic word..."
              maxLength={30}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUnlock();
              }}
              aria-label="Magic secret word"
            />
            <button id="sec-btn" onClick={handleUnlock} disabled={isVerifying} aria-label="Unlock Secret Letter">
              {isVerifying ? '✦ Verifying...' : '✦ Unlock'}
            </button>
          </div>
          <p className="sec-hint">Hint: it's what today is all about ✨</p>
          <p className={`sec-err ${showError ? 'on' : ''}`} id="sec-err" aria-live="polite">
            Not quite... try again, dear friend 💫
          </p>
        </div>
      </section>

      <section
        className={`letter-section ${unlocked ? 'show' : ''}`}
        id="letter-section"
        ref={letterSectionRef}
        aria-label="Secret Letter"
      >
        <div className="sec-header rev in">
          <span className="sec-eyebrow">✦ &nbsp; Unlocked ✦</span>
          <h2 className="sec-h2">
            A Letter From the Heart
            <span className="sec-h2-script">Written just for you</span>
          </h2>
        </div>

        <div className="letter-paper rev in">
          <div
            className="letter-head"
            data-edit
            contentEditable={dirOn}
            suppressContentEditableWarning
            onBlur={(e) => updateField('secret_letter_head', e.currentTarget.textContent)}
            tabIndex={dirOn ? 0 : -1}
            role={dirOn ? 'textbox' : undefined}
          >
            {content.secret_letter_head}
          </div>
          <div className="letter-rule" aria-hidden="true" />
          <div className="letter-body" id="letter-body" aria-live="polite">
            {typedLetter.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx < typedLetter.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
            {isTyping && <span className="l-cur" aria-hidden="true" />}
          </div>
          <div
            className="letter-sign"
            data-edit
            contentEditable={dirOn}
            suppressContentEditableWarning
            onBlur={(e) => updateField('secret_letter_sign', e.currentTarget.textContent)}
            tabIndex={dirOn ? 0 : -1}
            role={dirOn ? 'textbox' : undefined}
          >
            {content.secret_letter_sign}
          </div>
        </div>
      </section>
    </>
  );
};

export default SecretLetter;
