import React from 'react';

import ThemeToggleButton from './ThemeToggleButton'; // Import ThemeToggleButton

interface HeaderProps {
  pageTitle: string;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  userName?: string;
  userInitials?: string;
}

const Header: React.FC<HeaderProps> = ({
  pageTitle,
  onLogout,
  theme,
  onToggleTheme,
  userName = "Admin Master",
  userInitials = "AM"
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-700 transition-colors duration-150">
      <div className="flex items-center justify-between h-16 px-6">
        <h2 id="page-title" className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          {pageTitle}
        </h2>
        <div className="flex items-center space-x-4">
          {/* User Info */}
          <div className="flex items-center">
            <span className="mr-3 hidden sm:inline text-sm text-slate-500 dark:text-slate-400">{userName}</span>
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm ring-2 ring-white dark:ring-slate-500">
              {userInitials}
            </div>
          </div>

          <ThemeToggleButton currentTheme={theme} onToggleTheme={onToggleTheme} />

          <button
            onClick={onLogout}
            className="p-2 rounded-full text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-red-400 dark:focus:ring-offset-slate-900 transition-colors duration-150 group"
            aria-label="Sair do sistema"
            title="Sair"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-500 dark:text-slate-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-150">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
