import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

const DEFAULT_CONTENT = {
  now_playing_title: 'Happy Birthday Dhanya — A Cinematic Experience',
  intro_main_title: 'Happy Birthday',
  intro_main_subtitle: 'Dhanya 👑✨',
  hero_title: 'Celebrating Our',
  hero_subtitle: 'Dearest Dhanya',
  hero_body: 'Some people bring a light so bright to the world that everything around them sparkles. Dhanya, your laughter, your kindness, and your unstoppable energy make every day an extraordinary story. Today is all about celebrating you!',
  scene_1_title: 'The Beginning of Our Story',
  scene_1_body: 'Every unforgettable story starts with a simple hello. Little did we know that day would spark a bond filled with endless smiles, spontaneous laughs, and memories that last a lifetime.',
  scene_1_caption: '"And just like that, you made life a million times brighter..."',
  interlude_1_quote: '"Not all treasures are made of gold — the purest ones are made of your laughter, loyalty, and heart of gold."',
  interlude_1_attr: '— Written with endless love for Dhanya',
  scene_2_title: 'Endless Laughs & Crazy Fun',
  scene_2_body: 'You have that rare, magical superpower of turning the simplest ordinary day into a cinematic comedy adventure. No one makes me laugh harder than you do!',
  scene_2_caption: '"Every candid snapshot tells a thousand happy stories..."',
  scene_3_title: 'Adventures with Dhanya',
  scene_3_body: 'Every journey, every unplanned detour, and every late-night conversation is ten times better with you. You make every milestone an unforgettable memory.',
  scene_3_caption: '"Here is to all our past adventures... and the countless ones waiting ahead!"',
  scene_4_title: 'Cherished Forever',
  scene_4_body: 'Through every twist and turn of life, you have remained a true, constant ray of sunshine. Thank you for being such an extraordinary friend and genuine inspiration.',
  scene_4_caption: '"Dhanya — a truly rare, golden soul in this world."',
  timeline_1_title: 'The Spark of Friendship',
  timeline_1_desc: 'A simple conversation that bloomed into a lifelong bond of smiles and trust.',
  timeline_2_title: 'Unstoppable Duo',
  timeline_2_desc: 'Sharing secrets, endless jokes, and moments where words were not even needed.',
  timeline_3_title: 'Epic Journeys & Memories',
  timeline_3_desc: 'Exploring, capturing memories, taking thousands of pictures, and laughing till our stomachs hurt.',
  timeline_4_title: 'True Pillar of Support',
  timeline_4_desc: 'Always having each other\'s back through thick and thin with unconditional warmth.',
  timeline_5_title: 'Today & Forever After',
  timeline_5_desc: 'Wishing Dhanya the happiest birthday, abundant blessings, and a year full of dreams coming true!',
  interlude_2_quote: '"May your life be filled with everlasting melodies and joy."',
  interlude_2_attr: '— Always with you, today and forever',
  finale_script: 'Happy Birthday to the most amazing, radiant Dhanya!\nThank you for every smile, every memory,\nand every golden moment you bring into our lives.',
  finale_sub: 'You are an absolute superstar ✨👑',
  credits_presenter: 'A Very Proud & Grateful Best Friend',
  credits_star: 'Dhanya — The Birthday Queen 👑',
  credits_director: 'Crafted with Love for Dhanya',
  secret_letter_head: 'Dearest Dhanya,',
  secret_letter_sign: '— Forever your best friend & biggest cheerleader ✨',
};

const DirectorContext = createContext(null);

export const DirectorProvider = ({ children }) => {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [dirOn, setDirOn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Fetch initial content from backend
  useEffect(() => {
    let isMounted = true;
    apiService.getContent().then((data) => {
      if (data && isMounted) {
        setContent((prev) => ({ ...prev, ...data }));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync body class for director mode
  useEffect(() => {
    document.body.classList.toggle('dir-on', dirOn);
  }, [dirOn]);

  const toggleDir = useCallback(() => {
    setDirOn((prev) => !prev);
  }, []);

  const updateField = useCallback((key, rawValue) => {
    // Sanitize string to prevent tag injection while preserving linebreaks
    const sanitized = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
    setContent((prev) => {
      if (prev[key] === sanitized) return prev;
      return { ...prev, [key]: sanitized };
    });
    setHasChanges(true);
  }, []);

  const saveToServer = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus('Saving changes...');
    try {
      await apiService.updateContent(content);
      setHasChanges(false);
      setSaveStatus('All changes saved to database ✨');
      setTimeout(() => setSaveStatus(''), 3500);
    } catch (err) {
      setSaveStatus('Failed to save changes. Check connection.');
      setTimeout(() => setSaveStatus(''), 4000);
    } finally {
      setIsSaving(false);
    }
  }, [content]);

  return (
    <DirectorContext.Provider
      value={{
        content,
        dirOn,
        toggleDir,
        setDirOn,
        updateField,
        saveToServer,
        isSaving,
        hasChanges,
        saveStatus,
      }}
    >
      {children}
    </DirectorContext.Provider>
  );
};

export const useDirector = () => {
  const ctx = useContext(DirectorContext);
  if (!ctx) throw new Error('useDirector must be used within DirectorProvider');
  return ctx;
};

export default DirectorContext;
