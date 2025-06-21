import React, { useState, useEffect } from 'react';
import { ServiceOrder, OSPayment } from '../types';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePayment: (paymentData: Omit<OSPayment, 'id'>) => void;
  serviceOrder: ServiceOrder | null;
}

interface PaymentFormData {
  paymentDate: string;
  paidAmount: number | string; // Allow string for input, parse on save
  paymentMethod: string;
  bankAccountInfo: string;
  notes: string;
}

const PAYMENT_METHODS = [
  "Boleto",
  "Transferência Bancária",
  "Cartão de Crédito",
  "PIX",
  "Dinheiro",
  "Outro"
] as const;

const calculateTotalPaid = (payments: OSPayment[] | undefined): number => {
  if (!payments || payments.length === 0) return 0;
  return payments.reduce((sum, payment) => sum + payment.paidAmount, 0);
};

const getInitialFormData = (os: ServiceOrder | null): PaymentFormData => {
  let initialPaidAmount: number | string = '';
  if (os && os.finalValue !== undefined) {
    const totalPaid = calculateTotalPaid(os.payments);
    const remainingBalance = os.finalValue - totalPaid;
    if (remainingBalance > 0) {
      initialPaidAmount = String(parseFloat(remainingBalance.toFixed(2)));
    }
  }
  return {
    paymentDate: new Date().toISOString().split('T')[0],
    paidAmount: initialPaidAmount,
    paymentMethod: '',
    bankAccountInfo: '',
    notes: '',
  };
};

const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  onSavePayment,
  serviceOrder,
}) => {
  const [formData, setFormData] = useState<PaymentFormData>(getInitialFormData(serviceOrder));

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(serviceOrder));
    }
  }, [isOpen, serviceOrder]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'paidAmount') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : value })); // Keep as string for controlled input
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paidAmountParsed = parseFloat(String(formData.paidAmount));

    if (!formData.paymentDate || isNaN(paidAmountParsed) || paidAmountParsed <= 0 || !formData.paymentMethod) {
      alert('Por favor, preencha todos os campos obrigatórios: Data do Pagamento, Valor Pago (maior que zero) e Forma de Pagamento.');
      return;
    }

    const totalPreviouslyPaid = calculateTotalPaid(serviceOrder?.payments);
    const currentFinalValue = serviceOrder?.finalValue || 0;

    if (paidAmountParsed > (currentFinalValue - totalPreviouslyPaid + 0.001)) { // Add small tolerance for float issues
        if (!window.confirm(`O valor pago (R$ ${paidAmountParsed.toFixed(2)}) é maior que o saldo devedor (R$ ${(currentFinalValue - totalPreviouslyPaid).toFixed(2)}). Deseja continuar?`)) {
            return;
        }
    }


    onSavePayment({
      paymentDate: formData.paymentDate,
      paidAmount: paidAmountParsed,
      paymentMethod: formData.paymentMethod,
      bankAccountInfo: formData.bankAccountInfo,
      notes: formData.notes,
    });
    onClose();
  };

  if (!isOpen || !serviceOrder) {
    return null;
  }

  const totalPaid = calculateTotalPaid(serviceOrder.payments);
  const finalValue = serviceOrder.finalValue || 0;
  const balanceDue = finalValue - totalPaid;

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="modal-content bg-white border border-slate-200 w-full max-w-lg rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Registrar Pagamento para OS: {serviceOrder.id}
          </h3>
          <div className="mb-4 text-sm space-y-1 p-3 bg-slate-50 rounded-md">
            <p><strong>Valor Faturado:</strong> {finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <p><strong>Pago Anteriormente:</strong> {totalPaid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <p className="font-semibold"><strong>Saldo Devedor:</strong> {balanceDue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-3">
            <div>
              <label htmlFor="paymentDate" className="block text-xs font-medium text-slate-500">Data do Pagamento*</label>
              <input
                type="date"
                name="paymentDate"
                id="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                required
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>

            <div>
              <label htmlFor="paidAmount" className="block text-xs font-medium text-slate-500">Valor Pago (R$)*</label>
              <input
                type="number"
                name="paidAmount"
                id="paidAmount"
                value={formData.paidAmount}
                onChange={handleChange}
                required
                step="0.01"
                min="0.01"
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>

            <div>
              <label htmlFor="paymentMethod" className="block text-xs font-medium text-slate-500">Forma de Pagamento*</label>
              <select
                name="paymentMethod"
                id="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              >
                <option value="">Selecione...</option>
                {PAYMENT_METHODS.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="bankAccountInfo" className="block text-xs font-medium text-slate-500">Informações Bancárias (Opcional)</label>
              <input
                type="text"
                name="bankAccountInfo"
                id="bankAccountInfo"
                value={formData.bankAccountInfo}
                onChange={handleChange}
                placeholder="Ex: Banco X, Ag Y, CC Z"
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-xs font-medium text-slate-500">Observações do Pagamento (Opcional)</label>
              <textarea
                name="notes"
                id="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Detalhes adicionais sobre o pagamento..."
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
              Salvar Pagamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordPaymentModal;
