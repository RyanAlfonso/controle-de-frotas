import React, { useState, useEffect } from 'react';
import { ServiceOrder } from '../types';

export interface CompletionData {
  completionDate: string;
  completionNotes?: string;
}

interface CompleteOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmComplete: (completionData: CompletionData) => void;
  serviceOrder: ServiceOrder | null;
}

const getInitialFormData = (): CompletionData => ({
  completionDate: new Date().toISOString().split('T')[0], // Defaults to today
  completionNotes: '',
});

const CompleteOSModal: React.FC<CompleteOSModalProps> = ({
  isOpen,
  onClose,
  onConfirmComplete,
  serviceOrder,
}) => {
  const [formData, setFormData] = useState<CompletionData>(getInitialFormData());

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData()); // Reset form with today's date when modal opens
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.completionDate) {
      alert('Por favor, preencha a Data de Conclusão.');
      return;
    }
    onConfirmComplete(formData);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="modal-content bg-white border border-slate-200 w-full max-w-lg rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">
            Concluir Ordem de Serviço: {serviceOrder?.id || 'N/A'}
          </h3>
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-3">

            <div>
              <label htmlFor="completionDate" className="block text-xs font-medium text-slate-500">Data de Conclusão*</label>
              <input
                type="date"
                name="completionDate"
                id="completionDate"
                value={formData.completionDate}
                onChange={handleChange}
                required
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>

            <div>
              <label htmlFor="completionNotes" className="block text-xs font-medium text-slate-500">Observações da Conclusão / Detalhes da Entrega</label>
              <textarea
                name="completionNotes"
                id="completionNotes"
                value={formData.completionNotes}
                onChange={handleChange}
                rows={4}
                placeholder="Descreva os serviços finais realizados, como o veículo foi entregue, etc."
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
              Confirmar Conclusão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteOSModal;
