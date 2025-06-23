import React from 'react';

interface SidebarProps {
  onNavigate: (section: string) => void;
  onLogout: () => void;
  activeSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, onLogout, activeSection }) => {
  const navItems = [
    { id: 'dashboard', title: 'Dashboard' },
    { id: 'vehicles', title: 'Veículos' },
    { id: 'suppliers', title: 'Fornecedores' },
    { id: 'serviceOrders', title: 'Ordens de Serviço' },
    { id: 'financialReports', title: 'Relatórios Financeiros' }, // Added Financial Reports
    { id: 'users', title: 'Usuários' },
  ];

  return (
    <aside className="bg-white dark:bg-slate-800 flex flex-col py-4 w-56 border-r border-slate-200 dark:border-slate-700 transition-colors duration-150">
      <div className="h-16 flex items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-500">Teste</h1>
      </div>
      <nav id="main-nav" className="mt-4 space-y-2 w-full px-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`} // Consider using React Router for real routing
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.id);
            }}
            className={`nav-link flex items-center h-12 px-4 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150 ${
              activeSection === item.id ? 'active bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 font-semibold' : 'font-medium hover:font-semibold'
            }`}
            title={item.title}
          >
            {/* Example: Add icons later if needed */}
            {/* <item.icon className="w-5 h-5 mr-3" /> */}
            <span>{item.title}</span>
          </a>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <button
          id="logout-button" // ID might not be needed
          onClick={onLogout}
          className="flex items-center justify-center w-full h-12 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-150 group"
          title="Sair"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-500 dark:text-slate-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-150">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span className="ml-2 font-medium group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-150">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
