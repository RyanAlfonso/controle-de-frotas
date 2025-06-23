import React, { useState, useEffect } from 'react';
import { ServiceOrder, Vehicle } from '../types';

type ServiceOrderRequestData = Omit<ServiceOrder, 'id' | 'requestDate' | 'requesterId' | 'status'>;

interface AddServiceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ServiceOrderRequestData) => void;
  vehicles: Vehicle[];
}

const initialFormData: ServiceOrderRequestData = {
  vehicleId: '',
  serviceType: '',
  problemDescription: '',
  // Optional fields from ServiceOrder that might be part of the form's data payload
  // but are not strictly required by Omit for this initial creation step.
  // If they were, they'd need to be in initialFormData and the form.
  // e.g. supplierId: undefined, cost: undefined, etc.
};

const AddServiceOrderModal: React.FC<AddServiceOrderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicles,
}) => {
  const [formData, setFormData] = useState<ServiceOrderRequestData>(initialFormData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData); // Reset form when modal opens
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleId || !formData.serviceType || !formData.problemDescription) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const activeVehicles = vehicles.filter(v => v.status === 'Ativo');

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="modal-content bg-white border border-slate-200 w-full max-w-lg rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Abrir Solicitação de Ordem de Serviço</h3>
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-3">

            <div>
              <label htmlFor="vehicleId" className="block text-xs font-medium text-slate-500">Veículo*</label>
              <select
                name="vehicleId"
                id="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                required
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              >
                <option value="">Selecione um veículo...</option>
                {activeVehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {`${vehicle.marca} ${vehicle.modelo} (${vehicle.placa})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="serviceType" className="block text-xs font-medium text-slate-500">Tipo de Serviço/Manutenção*</label>
              <input
                type="text"
                name="serviceType"
                id="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                placeholder="Ex: Troca de óleo, Reparo de freio, Diagnóstico"
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>

            <div>
              <label htmlFor="problemDescription" className="block text-xs font-medium text-slate-500">Descrição Detalhada do Problema ou Serviço Solicitado*</label>
              <textarea
                name="problemDescription"
                id="problemDescription"
                value={formData.problemDescription}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Descreva o problema observado, o serviço necessário, ou qualquer detalhe relevante."
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
              Enviar Solicitação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceOrderModal;
