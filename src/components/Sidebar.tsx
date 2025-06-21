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
    <aside className="bg-white flex flex-col py-4 w-56 border-r border-slate-200">
      <div className="h-16 flex items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-teal-600">Teste</h1>
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
            className={`nav-link flex items-center h-12 px-4 rounded-lg text-slate-600 hover:bg-slate-100 ${
              activeSection === item.id ? 'active bg-teal-50 text-teal-600' : ''
            }`}
            title={item.title}
          >
            <span>{item.title}</span>
          </a>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <button
          id="logout-button" // ID might not be needed
          onClick={onLogout}
          className="flex items-center justify-center w-full h-12 text-slate-500 hover:bg-slate-100 rounded-lg"
          title="Sair"
        >
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
