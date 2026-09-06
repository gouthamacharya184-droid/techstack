import { useEffect } from 'react';

export const useIntersectionRev = (dependencies = []) => {
  useEffect(() => {
    const elements = document.querySelectorAll('.rev, .rev-left, .rev-right');
    if (!elements.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => obs.observe(el));

    return () => {
      obs.disconnect();
    };
  }, dependencies);
};

export default useIntersectionRev;
