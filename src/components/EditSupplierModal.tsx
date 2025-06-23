import React, { useState, useEffect } from 'react';
import { Supplier, SupplierTypeOption, SUPPLIER_TYPES } from '../types';

interface EditSupplierModalProps { // Renamed
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplierData: Supplier) => void; // Changed signature
  supplierToEdit?: Supplier | null; // Added new prop
}

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

type FormData = Omit<Supplier, 'id'>;

const initialFormData: FormData = {
  nomeRazaoSocial: '',
  nomeFantasia: '',
  cnpjCpf: '',
  tipoFornecedor: [],
  endereco: '',
  cidade: '',
  estado: '',
  cep: '',
  telefone: '',
  email: '',
  contatoPrincipal: '',
  observacoes: '',
  status: 'Ativo', // Added default status
};

const EditSupplierModal: React.FC<EditSupplierModalProps> = ({ isOpen, onClose, onSave, supplierToEdit }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    if (isOpen) {
      if (supplierToEdit) {
        setFormData({
          nomeRazaoSocial: supplierToEdit.nomeRazaoSocial || '',
          nomeFantasia: supplierToEdit.nomeFantasia || '',
          cnpjCpf: supplierToEdit.cnpjCpf || '',
          tipoFornecedor: supplierToEdit.tipoFornecedor || [],
          endereco: supplierToEdit.endereco || '',
          cidade: supplierToEdit.cidade || '',
          estado: supplierToEdit.estado || '',
          cep: supplierToEdit.cep || '',
          telefone: supplierToEdit.telefone || '',
          email: supplierToEdit.email || '',
          contatoPrincipal: supplierToEdit.contatoPrincipal || '',
          observacoes: supplierToEdit.observacoes || '',
          status: supplierToEdit.status || 'Ativo', // Ensure status is populated
        });
      } else {
        // If modal is opened to create (though this is Edit modal, good practice) or supplierToEdit is null
        setFormData(initialFormData);
      }
    } else {
      // Optionally reset form when modal is closed, or leave data as is
      // setFormData(initialFormData);
    }
  }, [isOpen, supplierToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const type = value as SupplierTypeOption;
    setFormData(prev => {
      const currentTypes = prev.tipoFornecedor;
      if (checked) {
        return { ...prev, tipoFornecedor: [...currentTypes, type] };
      } else {
        return { ...prev, tipoFornecedor: currentTypes.filter(t => t !== type) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation example (can be expanded)
    if (!formData.nomeRazaoSocial || formData.tipoFornecedor.length === 0 || !formData.estado ) {
        alert('Por favor, preencha os campos obrigatórios: Razão Social, Tipo de Fornecedor e Estado.');
        return;
    }

    if (supplierToEdit && supplierToEdit.id) {
      onSave({ ...formData, id: supplierToEdit.id });
    } else {
      // This case should ideally not be reached if the modal is opened correctly for editing.
      // If it were an "AddOrEdit" modal, here you might call a different onSave for new items.
      console.error("EditSupplierModal: supplierToEdit or its ID is missing. Cannot save.");
      // Optionally, still call onSave without ID if your backend/logic can handle it as a new item
      // onSave(formData as Omit<Supplier, 'id'>); // This would require onSave to handle both types or be more generic
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="modal-content bg-white border border-slate-200 w-full max-w-3xl rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Editar Fornecedor</h3>
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nomeRazaoSocial" className="block text-xs font-medium text-slate-500">Nome / Razão Social*</label>
                <input type="text" name="nomeRazaoSocial" id="nomeRazaoSocial" value={formData.nomeRazaoSocial} onChange={handleChange} required className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div>
                <label htmlFor="nomeFantasia" className="block text-xs font-medium text-slate-500">Nome Fantasia</label>
                <input type="text" name="nomeFantasia" id="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
            </div>

            <div>
              <label htmlFor="cnpjCpf" className="block text-xs font-medium text-slate-500">CNPJ / CPF</label>
              <input type="text" name="cnpjCpf" id="cnpjCpf" value={formData.cnpjCpf} onChange={handleChange} placeholder="XX.XXX.XXX/XXXX-XX ou XXX.XXX.XXX-XX" className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Tipo de Fornecedor*</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SUPPLIER_TYPES.map(type => (
                  <div key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`type-${type}`}
                      name="tipoFornecedor"
                      value={type}
                      checked={formData.tipoFornecedor.includes(type)}
                      onChange={handleCheckboxChange}
                      className="form-checkbox h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor={`type-${type}`} className="ml-2 text-sm text-slate-700">{type}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label htmlFor="endereco" className="block text-xs font-medium text-slate-500">Endereço</label>
                <input type="text" name="endereco" id="endereco" value={formData.endereco} onChange={handleChange} className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div>
                <label htmlFor="cidade" className="block text-xs font-medium text-slate-500">Cidade</label>
                <input type="text" name="cidade" id="cidade" value={formData.cidade} onChange={handleChange} className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="estado" className="block text-xs font-medium text-slate-500">Estado*</label>
                <select name="estado" id="estado" value={formData.estado} onChange={handleChange} required className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full">
                  <option value="">Selecione...</option>
                  {BRAZILIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="cep" className="block text-xs font-medium text-slate-500">CEP</label>
                <input type="text" name="cep" id="cep" value={formData.cep} onChange={handleChange} placeholder="XXXXX-XXX" className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="telefone" className="block text-xs font-medium text-slate-500">Telefone</label>
                <input type="tel" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} placeholder="(XX) XXXXX-XXXX" className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-slate-500">E-mail</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
            </div>

            <div>
              <label htmlFor="contatoPrincipal" className="block text-xs font-medium text-slate-500">Contato Principal</label>
              <input type="text" name="contatoPrincipal" id="contatoPrincipal" value={formData.contatoPrincipal} onChange={handleChange} className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
            </div>

            <div>
              <label htmlFor="observacoes" className="block text-xs font-medium text-slate-500">Observações</label>
              <textarea name="observacoes" id="observacoes" value={formData.observacoes} onChange={handleChange} rows={3} className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/10"
            >
              Salvar Fornecedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplierModal; // Renamed default export
