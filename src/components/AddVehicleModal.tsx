import React, { useState } from 'react';
// import { Vehicle } from '../types'; // Assuming types are defined

// Dummy Vehicle type for now
interface VehicleFormData {
  marca: string;
  modelo: string;
  ano: string; // Or number, needs parsing
  cor: string;
  placa: string;
  renavam: string;
  chassi: string;
  status: string; // Should be VehicleStatus
  km: string; // Or number
}

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleData: VehicleFormData) => void;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<VehicleFormData>({
    marca: '',
    modelo: '',
    ano: '',
    cor: '',
    placa: '',
    renavam: '',
    chassi: '',
    status: 'Ativo', // Default status
    km: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    // Optionally reset form: setFormData({marca:'',...});
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 opacity-100"> {/* Assume visible if rendered */}
      <div className="modal-content bg-white border border-slate-200 w-full max-w-2xl rounded-xl shadow-2xl transform scale-100 opacity-100"> {/* Assume visible if rendered */}
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-5">Adicionar Novo Veículo</h3>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="v-marca" className="block text-xs font-medium text-slate-500">Marca</label>
                <input type="text" id="v-marca" value={formData.marca} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div>
                <label htmlFor="v-modelo" className="block text-xs font-medium text-slate-500">Modelo</label>
                <input type="text" id="v-modelo" value={formData.modelo} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div>
                <label htmlFor="v-ano" className="block text-xs font-medium text-slate-500">Ano</label>
                <input type="number" id="v-ano" value={formData.ano} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div>
                <label htmlFor="v-cor" className="block text-xs font-medium text-slate-500">Cor</label>
                <input type="text" id="v-cor" value={formData.cor} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div>
                <label htmlFor="v-placa" className="block text-xs font-medium text-slate-500">Placa</label>
                <input type="text" id="v-placa" value={formData.placa} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div>
                <label htmlFor="v-renavam" className="block text-xs font-medium text-slate-500">RENAVAM</label>
                <input type="number" id="v-renavam" value={formData.renavam} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="v-chassi" className="block text-xs font-medium text-slate-500">Chassi</label>
                <input type="text" id="v-chassi" value={formData.chassi} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div>
                <label htmlFor="v-status" className="block text-xs font-medium text-slate-500">Status</label>
                <select id="v-status" value={formData.status} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full">
                  <option>Ativo</option>
                  <option>Em Manutenção</option>
                  <option>Inativo</option>
                </select>
              </div>
              <div>
                <label htmlFor="v-km" className="block text-xs font-medium text-slate-500">Quilometragem Atual</label>
                <input type="number" id="v-km" value={formData.km} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
            <button type="button" onClick={onClose} className="modal-cancel-button px-5 py-2 text-sm font-semibold rounded-lg transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200">Cancelar</button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/10">Salvar Veículo</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;
