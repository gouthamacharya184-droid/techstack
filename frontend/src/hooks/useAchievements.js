import { useState, useCallback, useRef } from 'react';

export const useAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const shownRef = useRef(new Set());

  const triggerAchievement = useCallback((icon, title, desc) => {
    if (shownRef.current.has(title)) return;
    shownRef.current.add(title);

    const id = Date.now() + Math.random();
    const newAch = { id, icon, title, desc };

    setAchievements((prev) => [...prev, newAch]);

    setTimeout(() => {
      setAchievements((prev) => prev.filter((a) => a.id !== id));
    }, 4200);
  }, []);

  return { achievements, triggerAchievement };
};

export default useAchievements;
