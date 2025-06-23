import React, { useState, useEffect } from 'react';
import { ServiceOrder } from '../types';

interface InvoiceOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmInvoice: (invoiceData: {
    invoiceNumber: string;
    invoiceDueDate: string;
    finalValue: number;
    valueJustification?: string
  }) => void;
  serviceOrder: ServiceOrder | null;
}

interface InvoiceFormData {
  invoiceNumber: string;
  invoiceDueDate: string;
  finalValue: number | string; // Allow string for input flexibility, parse on save
  valueJustification: string;
}

const getInitialFormData = (): InvoiceFormData => ({
  invoiceNumber: '',
  invoiceDueDate: new Date().toISOString().split('T')[0], // Defaults to today
  finalValue: '', // Initialize as empty string
  valueJustification: '',
});

const InvoiceOSModal: React.FC<InvoiceOSModalProps> = ({
  isOpen,
  onClose,
  onConfirmInvoice,
  serviceOrder,
}) => {
  const [formData, setFormData] = useState<InvoiceFormData>(getInitialFormData());
  const [showJustification, setShowJustification] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const initialData = getInitialFormData();
      if (serviceOrder && serviceOrder.cost !== undefined) {
        initialData.finalValue = String(serviceOrder.cost);
      }
      setFormData(initialData);
      setShowJustification(false); // Reset justification visibility
    }
  }, [isOpen, serviceOrder]);

  useEffect(() => {
    // Check if justification should be shown
    if (serviceOrder && serviceOrder.cost !== undefined) {
      const formFinalValue = parseFloat(String(formData.finalValue));
      if (!isNaN(formFinalValue) && formFinalValue !== serviceOrder.cost) {
        setShowJustification(true);
      } else {
        setShowJustification(false);
      }
    } else if (String(formData.finalValue).trim() !== '') {
      // If there's no original cost, but a final value is entered, justification might not be strictly needed
      // Or, treat any value as needing justification if original cost is unknown. For now, only if different from known cost.
      setShowJustification(false);
    }
  }, [formData.finalValue, serviceOrder]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' && name === 'finalValue'
               ? (value === '' ? '' : parseFloat(value)) // Keep empty string for empty input, else parse
               : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalValueParsed = parseFloat(String(formData.finalValue));

    if (!formData.invoiceNumber || !formData.invoiceDueDate || isNaN(finalValueParsed) || finalValueParsed <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios: Número da NF/Fatura, Data de Vencimento e Valor Final (deve ser maior que zero).');
      return;
    }

    if (showJustification && !formData.valueJustification.trim()) {
        alert('Por favor, preencha a justificativa para o valor divergente do orçamento aprovado.');
        return;
    }

    onConfirmInvoice({
      invoiceNumber: formData.invoiceNumber,
      invoiceDueDate: formData.invoiceDueDate,
      finalValue: finalValueParsed,
      valueJustification: showJustification ? formData.valueJustification : undefined,
    });
    onClose();
  };

  if (!isOpen || !serviceOrder) {
    return null;
  }

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="modal-content bg-white border border-slate-200 w-full max-w-lg rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">
            Registrar Faturamento da OS: {serviceOrder.id}
          </h3>
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-3">

            <div>
              <label htmlFor="invoiceNumber" className="block text-xs font-medium text-slate-500">Número da NF/Fatura*</label>
              <input
                type="text"
                name="invoiceNumber"
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                required
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>

            <div>
              <label htmlFor="invoiceDueDate" className="block text-xs font-medium text-slate-500">Data de Vencimento*</label>
              <input
                type="date"
                name="invoiceDueDate"
                id="invoiceDueDate"
                value={formData.invoiceDueDate}
                onChange={handleChange}
                required
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>

            <div>
              <label htmlFor="finalValue" className="block text-xs font-medium text-slate-500">Valor Final (R$)*</label>
              <input
                type="number"
                name="finalValue"
                id="finalValue"
                value={formData.finalValue}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
              {serviceOrder.cost !== undefined && parseFloat(String(formData.finalValue)) !== serviceOrder.cost && (
                 <p className="text-xs text-amber-600 mt-1">Valor diferente do custo aprovado ({serviceOrder.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}). Justificativa obrigatória.</p>
              )}
            </div>

            {showJustification && (
              <div>
                <label htmlFor="valueJustification" className="block text-xs font-medium text-slate-500">Justificativa (para valor divergente)*</label>
                <textarea
                  name="valueJustification"
                  id="valueJustification"
                  value={formData.valueJustification}
                  onChange={handleChange}
                  required={showJustification} // Required only if shown
                  rows={3}
                  placeholder="Explique o motivo da diferença entre o valor orçado/aprovado e o valor final faturado."
                  className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
                />
              </div>
            )}

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
              Confirmar Faturamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceOSModal;
