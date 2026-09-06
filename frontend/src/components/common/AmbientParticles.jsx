import React, { useEffect, useState } from 'react';

export const AmbientParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const sz = Math.random() * 2 + 0.4;
      const isGold = Math.random() > 0.4;
      const left = Math.random() * 100;
      const duration = Math.random() * 14 + 9;

      const newParticle = {
        id,
        style: {
          width: `${sz}px`,
          height: `${sz}px`,
          background: isGold ? 'var(--gold2)' : 'var(--pink2)',
          boxShadow: `0 0 ${sz * 5}px ${isGold ? 'var(--gold)' : 'var(--pink)'}`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
        },
      };

      setParticles((prev) => [...prev.slice(-35), newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, duration * 1000);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {particles.map((p) => (
        <div key={p.id} className="apar" style={p.style} />
      ))}
    </>
  );
};

export default AmbientParticles;
