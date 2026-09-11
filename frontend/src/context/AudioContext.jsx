import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const AudioContextState = createContext(null);

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const musicNodesRef = useRef([]);

  const initAudio = useCallback(() => {
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      return audioCtxRef.current;
    }
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const reverb = ctx.createConvolver();
      const rLen = Math.min(ctx.sampleRate * 2, 88200);
      const rBuf = ctx.createBuffer(2, rLen, ctx.sampleRate);
      [0, 1].forEach((ch) => {
        const d = rBuf.getChannelData(ch);
        for (let i = 0; i < rLen; i++) {
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / rLen, 2);
        }
      });
      reverb.buffer = rBuf;
      reverb.connect(masterGain);

      // Cinematic chord notes (Cm add9: C3, Eb3, F#3, A3, C4, G3, F3)
      const notes = [130.81, 155.56, 185, 220, 261.63, 196, 174.61];
      const types = ['sine', 'triangle', 'sine', 'sine', 'triangle', 'sine', 'sine'];
      const nodes = [];

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = types[i];
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        g.gain.setValueAtTime(0, ctx.currentTime);
        osc.connect(g);
        g.connect(reverb);
        try {
          osc.start();
        } catch (err) {
          // ignore already started
        }
        nodes.push({ osc, gain: g, baseFreq: freq });
      });

      // Gentle LFO tremolo
      const lfo = ctx.createOscillator();
      const lfoG = ctx.createGain();
      lfo.frequency.value = 0.08;
      lfoG.gain.value = 0.025;
      lfo.connect(lfoG);
      lfoG.connect(masterGain.gain);
      try {
        lfo.start();
      } catch (err) {
        // ignore
      }
      nodes.push({ lfo, lfoG, masterGain });

      musicNodesRef.current = nodes;
      return ctx;
    } catch (e) {
      console.warn('AudioContext initialization error:', e);
      return null;
    }
  }, []);

  const toggleMusic = useCallback(() => {
    try {
      const ctx = initAudio();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      setIsPlaying((prev) => {
        const nextState = !prev;
        const t = ctx.currentTime;
        const targetGains = [0.45, 0.35, 0.4, 0.25, 0.2, 0.3, 0.22];

        musicNodesRef.current.forEach((n, i) => {
          if (n.gain) {
            n.gain.gain.cancelScheduledValues(t);
            if (nextState) {
              n.gain.gain.linearRampToValueAtTime(targetGains[i] || 0.25, t + 2);
            } else {
              n.gain.gain.linearRampToValueAtTime(0, t + 1.2);
            }
          }
        });

        return nextState;
      });
    } catch (e) {
      console.warn('Audio toggle error:', e);
    }
  }, [initAudio]);

  // Clean cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <AudioContextState.Provider value={{ isPlaying, toggleMusic, initAudio }}>
      {children}
    </AudioContextState.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContextState);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
};

export default AudioProvider;
