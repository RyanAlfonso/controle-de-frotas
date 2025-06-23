import React from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-150">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-4xl font-bold text-teal-600 dark:text-teal-500 mb-2">Teste</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Sistema de Gestão de Frota</p>
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 p-8 rounded-2xl shadow-xl dark:shadow-slate-900/50 text-center space-y-4">
          <h2 className="text-lg font-semibold text-center text-slate-800 dark:text-slate-200">Bem-vindo</h2>
          <button
            id="login-button" // ID might not be needed in React if onClick is handled directly
            onClick={onLogin}
            className="w-full mt-4 px-4 py-2.5 font-semibold rounded-lg transition-colors text-sm bg-teal-600 dark:bg-teal-500 text-white hover:bg-teal-700 dark:hover:bg-teal-600 shadow-lg shadow-teal-600/20 dark:shadow-teal-500/30 hover:shadow-md transform hover:-translate-y-px"
          >
            Acessar Painel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
