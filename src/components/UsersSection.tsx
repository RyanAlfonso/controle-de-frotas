import React from 'react';
import { User } from '../types';

interface UsersSectionProps {
  users: User[];
  onAddUser: () => void;
}

const UsersSection: React.FC<UsersSectionProps> = ({ users, onAddUser }) => {
  const noUsers = users.length === 0;

  return (
    <section id="users-section" className="page-section">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-slate-800">Gerenciamento de Usuários</h2>
        <button
          onClick={onAddUser}
          className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/10"
        >
          Adicionar Usuário
        </button>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600">Nome</th>
                <th className="p-4 font-semibold text-slate-600">Email</th>
                <th className="p-4 font-semibold text-slate-600">Perfil</th>
              </tr>
            </thead>
            <tbody id="user-list" className="divide-y divide-slate-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">{u.nome}</td>
                  <td className="p-4 text-slate-600">{u.email}</td>
                  <td className="p-4 text-slate-600">{u.perfil}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {noUsers && (
          <div id="no-users" className="p-8 text-center text-slate-500">
            Nenhum usuário cadastrado.
          </div>
        )}
      </div>
    </section>
  );
};

export default UsersSection;
