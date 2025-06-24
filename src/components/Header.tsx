import React from 'react';

// import ThemeToggleButton from './ThemeToggleButton'; // Removed ThemeToggleButton import

interface HeaderProps {
  pageTitle: string;
  onLogout: () => void; // Added onLogout
  userName?: string;
  userInitials?: string;
}

const Header: React.FC<HeaderProps> = ({
  pageTitle,
  onLogout, // Added onLogout
  userName = "Admin Master",
  userInitials = "AM"
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-6">
        <h2 id="page-title" className="text-xl font-semibold text-slate-800">
          {pageTitle}
        </h2>
        <div className="flex items-center">
          <span className="mr-3 hidden sm:inline text-sm text-slate-500">{userName}</span>
          <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm ring-2 ring-white">
            {userInitials}
          </div>
          <button
            onClick={onLogout} // Use onLogout prop
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
