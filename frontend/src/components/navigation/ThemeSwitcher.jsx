import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeSwitcher = ({ visible, onThemeChange }) => {
  const { currentTheme, setTheme } = useTheme();

  const themes = [
    { id: 'gold', name: 'Gold Classic' },
    { id: 'rose', name: 'Rose Garden' },
    { id: 'blue', name: 'Midnight Blue' },
    { id: 'emerald', name: 'Emerald Isle' },
  ];

  const handleSelect = (themeName) => {
    setTheme(themeName);
    if (onThemeChange) onThemeChange(themeName);
  };

  const handleKeyDown = (e, themeName) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(themeName);
    }
  };

  return (
    <div
      id="theme-switcher"
      className={visible ? 'show' : ''}
      role="group"
      aria-label="Color Theme Switcher"
    >
      {themes.map((t) => (
        <button
          key={t.id}
          className={`theme-btn ${currentTheme === t.id ? 'active' : ''}`}
          data-theme={t.id}
          onClick={() => handleSelect(t.id)}
          onKeyDown={(e) => handleKeyDown(e, t.id)}
          title={t.name}
          aria-label={`Switch to ${t.name} theme`}
          aria-pressed={currentTheme === t.id}
          type="button"
        />
      ))}
    </div>
  );
};

export default ThemeSwitcher;
