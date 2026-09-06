import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const THEMES = {
  gold: { id: 'gold', name: 'Gold Classic', class: '' },
  rose: { id: 'rose', name: 'Rose Garden', class: 'theme-rose' },
  blue: { id: 'blue', name: 'Midnight Blue', class: 'theme-blue' },
  emerald: { id: 'emerald', name: 'Emerald Isle', class: 'theme-emerald' },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('gold');
  const [auroraOn, setAuroraOn] = useState(false);
  const [cineOn, setCineOn] = useState(false);
  const [dirOn, setDirOn] = useState(false);
  const [endCreditsOn, setEndCreditsOn] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-rose', 'theme-blue', 'theme-emerald');
    if (currentTheme !== 'gold' && THEMES[currentTheme]?.class) {
      root.classList.add(THEMES[currentTheme].class);
    }
  }, [currentTheme]);

  // Apply cinematic class to body
  useEffect(() => {
    document.body.classList.toggle('cine-on', cineOn);
  }, [cineOn]);

  // Apply director mode class to body
  useEffect(() => {
    document.body.classList.toggle('dir-on', dirOn);
  }, [dirOn]);

  const toggleTheme = (themeName) => {
    if (THEMES[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const toggleAurora = () => setAuroraOn((prev) => !prev);
  const toggleCine = () => setCineOn((prev) => !prev);
  const toggleDir = () => setDirOn((prev) => !prev);
  const showEndCredits = () => setEndCreditsOn(true);
  const hideEndCredits = () => setEndCreditsOn(false);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme: toggleTheme,
        auroraOn,
        toggleAurora,
        cineOn,
        toggleCine,
        dirOn,
        toggleDir,
        endCreditsOn,
        showEndCredits,
        hideEndCredits,
        introFinished,
        setIntroFinished,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
