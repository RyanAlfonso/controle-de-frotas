import React from 'react';

interface ThemeToggleButtonProps {
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ currentTheme, onToggleTheme }) => {
  const isDarkMode = currentTheme === 'dark';

  return (
    <button
      onClick={onToggleTheme}
      className={`
        p-2 rounded-full
        text-slate-700 hover:bg-slate-200
        dark:text-slate-300 dark:hover:bg-slate-700
        focus:outline-none focus:ring-2 focus:ring-offset-2
        focus:ring-slate-500 dark:focus:ring-slate-400
        dark:focus:ring-offset-slate-900
        transition-colors duration-200
      `}
      aria-label={isDarkMode ? "Mudar para tema claro" : "Mudar para tema escuro"}
      title={isDarkMode ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {isDarkMode ? (
        <span role="img" aria-label="Sol">☀️</span> // Sun icon for switching to light
      ) : (
        <span role="img" aria-label="Lua">🌙</span> // Moon icon for switching to dark
      )}
    </button>
  );
};

export default ThemeToggleButton;
