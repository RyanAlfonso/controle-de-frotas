import React from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-4xl font-bold text-teal-600 mb-2">Teste</h1>
        <p className="text-slate-500 mb-8">Sistema de Gestão de Frota</p>
        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-lg text-center space-y-4">
          <h2 className="text-lg font-semibold text-center text-slate-800">Bem-vindo</h2>
          <button
            id="login-button" // ID might not be needed in React if onClick is handled directly
            onClick={onLogin}
            className="w-full mt-4 px-4 py-2.5 font-semibold rounded-lg transition-colors text-sm bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/20 hover:shadow-md transform hover:-translate-y-px"
          >
            Acessar Painel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
