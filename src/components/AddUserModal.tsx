import React, { useState } from 'react';
// import { User } from '../types'; // Assuming types are defined

// Dummy User type for now
interface UserFormData {
  nome: string;
  email: string;
  senha?: string; // Password might not be part of User display type
  perfil: string; // Should be UserProfile
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UserFormData) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<UserFormData>({
    nome: '',
    email: '',
    senha: '',
    perfil: 'Solicitante', // Default profile
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Don't pass password directly if it's not part of the main User type for display
    const { senha, ...userDataToSave } = formData;
    onSave(userDataToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 opacity-100">
      <div className="modal-content bg-white border border-slate-200 w-full max-w-md rounded-xl shadow-2xl transform scale-100 opacity-100">
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-5">Adicionar Novo Usuário</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="u-nome" className="block text-xs font-medium text-slate-500">Nome Completo</label>
              <input type="text" id="u-nome" value={formData.nome} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
            </div>
            <div>
              <label htmlFor="u-email" className="block text-xs font-medium text-slate-500">Email</label>
              <input type="email" id="u-email" value={formData.email} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
            </div>
            <div>
              <label htmlFor="u-senha" className="block text-xs font-medium text-slate-500">Senha</label>
              <input type="password" id="u-senha" value={formData.senha} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
            </div>
            <div>
              <label htmlFor="u-perfil" className="block text-xs font-medium text-slate-500">Perfil de Acesso</label>
              <select id="u-perfil" value={formData.perfil} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full">
                <option>Master</option>
                <option>Avançado</option>
                <option>Solicitante</option>
                <option>Controle de OS</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
            <button type="button" onClick={onClose} className="modal-cancel-button px-5 py-2 text-sm font-semibold rounded-lg transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200">Cancelar</button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/10">Salvar Usuário</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
