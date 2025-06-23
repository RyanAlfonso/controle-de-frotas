import React, { useState, useEffect } from 'react';
import { ServiceOrderBudget, Supplier } from '../types';

type BudgetFormData = Omit<ServiceOrderBudget, 'id'>;

interface AddOSBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BudgetFormData) => void;
  suppliers: Supplier[];
}

const initialFormData: BudgetFormData = {
  supplierId: '',
  budgetValue: 0,
  estimatedDeadline: '',
  budgetNotes: '',
};

const AddOSBudgetModal: React.FC<AddOSBudgetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  suppliers,
}) => {
  const [formData, setFormData] = useState<BudgetFormData>(initialFormData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData); // Reset form when modal opens
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    // Check if the input is a number type and parse it, otherwise use the value directly
    const processedValue = type === 'number' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplierId || formData.budgetValue <= 0 || !formData.estimatedDeadline) {
      alert('Por favor, preencha todos os campos obrigatórios: Fornecedor, Valor do Orçamento e Prazo Estimado.');
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const activeSuppliers = suppliers.filter(s => s.status === 'Ativo');

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="modal-content bg-white border border-slate-200 w-full max-w-lg rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Adicionar Orçamento à Ordem de Serviço</h3>
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-3">

            <div>
              <label htmlFor="supplierId" className="block text-xs font-medium text-slate-500">Fornecedor*</label>
              <select
                name="supplierId"
                id="supplierId"
                value={formData.supplierId}
                onChange={handleChange}
                required
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              >
                <option value="">Selecione um fornecedor...</option>
                {activeSuppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {`${supplier.nomeFantasia || supplier.nomeRazaoSocial} (${supplier.cnpjCpf || 'N/A'})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="budgetValue" className="block text-xs font-medium text-slate-500">Valor do Orçamento (R$)*</label>
              <input
                type="number"
                name="budgetValue"
                id="budgetValue"
                value={formData.budgetValue}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>

            <div>
              <label htmlFor="estimatedDeadline" className="block text-xs font-medium text-slate-500">Prazo Estimado*</label>
              <input
                type="text"
                name="estimatedDeadline"
                id="estimatedDeadline"
                value={formData.estimatedDeadline}
                onChange={handleChange}
                required
                placeholder="Ex: 5 dias úteis, 24/12/2024"
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>

            <div>
              <label htmlFor="budgetNotes" className="block text-xs font-medium text-slate-500">Observações/Detalhes do Orçamento</label>
              <textarea
                name="budgetNotes"
                id="budgetNotes"
                value={formData.budgetNotes || ''} // Ensure controlled component even if undefined
                onChange={handleChange}
                rows={3}
                placeholder="Detalhes sobre o orçamento, condições, etc."
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
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
              Salvar Orçamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOSBudgetModal;
