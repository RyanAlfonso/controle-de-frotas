import React from 'react';

interface HeaderProps {
  pageTitle: string;
  userName?: string; // Optional user name
  userInitials?: string; // Optional user initials
}

const Header: React.FC<HeaderProps> = ({ pageTitle, userName = "Admin Master", userInitials = "AM" }) => {
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
        </div>
      </div>
    </header>
  );
};

export default Header;
