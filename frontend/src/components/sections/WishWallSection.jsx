import React, { useState, useEffect, useRef, useCallback } from 'react';
import apiService from '../../services/api';

const DEFAULT_WISHES = [
  'Happy Birthday! 🎉',
  'Wishing you all the joy! ✨',
  'You deserve the world! 🌟',
  'May all your dreams come true! 💫',
  'Celebrating you today! 🎂',
  'You are simply wonderful! 💛',
  'Wishing you joy! ✨',
  'Celebrate today! 🎉',
  'All the love! 💛',
];

export const WishWallSection = ({ onTriggerAchievement }) => {
  const [inputText, setInputText] = useState('');
  const [bubbles, setBubbles] = useState([]);
  const [wishesPool, setWishesPool] = useState(DEFAULT_WISHES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const arenaRef = useRef(null);

  // Fetch wishes from DB
  useEffect(() => {
    let isMounted = true;
    apiService.getWishes().then((data) => {
      if (data && data.length && isMounted) {
        setWishesPool((prev) => [...new Set([...data.map((w) => w.message), ...prev])]);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const spawnBubble = useCallback((text, isPink = false) => {
    const id = Date.now() + Math.random();
    const arenaW = arenaRef.current?.offsetWidth || 800;
    const maxLeft = Math.max(10, arenaW - 200);
    const left = Math.max(10, Math.random() * maxLeft);
    const duration = 6 + Math.random() * 4;

    const newBubble = {
      id,
      text,
      isPink,
      style: {
        left: `${left}px`,
        animationDuration: `${duration}s`,
      },
    };

    setBubbles((prev) => [...prev.slice(-14), newBubble]);

    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    }, duration * 1000);
  }, []);

  // Periodic automatic floating wishes
  useEffect(() => {
    const timer = setTimeout(() => {
      wishesPool.slice(0, 4).forEach((w, i) => {
        setTimeout(() => {
          spawnBubble(w, i % 2 === 0);
        }, i * 1400);
      });
    }, 1000);

    const interval = setInterval(() => {
      if (wishesPool.length > 0 && !document.hidden) {
        const randomWish = wishesPool[Math.floor(Math.random() * wishesPool.length)];
        spawnBubble(randomWish, Math.random() > 0.5);
      }
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [wishesPool, spawnBubble]);

  const handleSendWish = async (e) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isSubmitting) return;

    const isPink = Math.random() > 0.5;
    spawnBubble(trimmed, isPink);
    setInputText('');
    setIsSubmitting(true);

    try {
      await apiService.createWish({
        author: 'Visitor',
        message: trimmed,
        is_pink: isPink,
      });
      setWishesPool((prev) => [trimmed, ...prev]);
    } catch (err) {
      console.warn('Could not persist wish to server:', err);
    } finally {
      setIsSubmitting(false);
    }

    if (onTriggerAchievement) {
      onTriggerAchievement('💌', 'Wish Sent!', 'Your wish floats toward the stars');
    }
  };

  return (
    <>
      <div className="scene-divider" aria-hidden="true" />
      <section className="wish-section" aria-label="Birthday Wishes Wall">
        <div className="sec-header rev in">
          <span className="sec-eyebrow">✦ &nbsp; Birthday Wishes &nbsp; ✦</span>
          <h2 className="sec-h2">
            Send a Wish
            <span className="sec-h2-script">Watch your words float away</span>
          </h2>
        </div>

        <div className="wish-arena" id="wish-arena" ref={arenaRef} aria-live="polite">
          {bubbles.map((b) => (
            <div
              key={b.id}
              className={`wish-bubble ${b.isPink ? 'pink' : ''}`}
              style={b.style}
            >
              {b.text}
            </div>
          ))}
        </div>

        <form className="wish-input-row" onSubmit={handleSendWish}>
          <input
            type="text"
            id="wish-input"
            placeholder="Type your birthday wish here..."
            maxLength={80}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            aria-label="Birthday wish text"
          />
          <button type="submit" id="wish-send-btn" disabled={isSubmitting || !inputText.trim()} aria-label="Send birthday wish">
            ✦ Send
          </button>
        </form>
      </section>
    </>
  );
};

export default WishWallSection;
