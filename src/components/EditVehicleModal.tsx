import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleStatus, MaintenanceHistoryItem } from '../types';
import AddMaintenanceRecordModal from './AddMaintenanceRecordModal'; // Import AddMaintenanceRecordModal

// Using VehicleFormData to represent the editable fields in the form
interface VehicleFormData {
  marca: string;
  modelo: string;
  ano: string;
  cor: string;
  placa: string;
  renavam: string;
  chassi: string;
  status: string; // Stays string for form input, VehicleStatus is used in Vehicle type
  km: string;
  maintenanceHistory: MaintenanceHistoryItem[]; // Add maintenance history
}

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleData: VehicleFormData) => void; // Stays as VehicleFormData
  vehicleToEdit?: Vehicle | null; // Use imported Vehicle type
}

const EditVehicleModal: React.FC<EditVehicleModalProps> = ({ isOpen, onClose, onSave, vehicleToEdit }) => {
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
    maintenanceHistory: [], // Initialize maintenance history
  });

  const [isAddMaintenanceModalOpen, setIsAddMaintenanceModalOpen] = useState(false);

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        marca: vehicleToEdit.marca || '',
        modelo: vehicleToEdit.modelo || '',
        ano: String(vehicleToEdit.ano || ''),
        cor: vehicleToEdit.cor || '',
        placa: vehicleToEdit.placa || '',
        renavam: vehicleToEdit.renavam || '',
        chassi: vehicleToEdit.chassi || '',
        status: vehicleToEdit.status || 'Ativo',
        km: String(vehicleToEdit.km || ''),
        maintenanceHistory: vehicleToEdit.maintenanceHistory || [], // Populate history
      });
    } else {
      // Reset form if no vehicle is being edited or if it's cleared
      setFormData({
        marca: '',
        modelo: '',
        ano: '',
        cor: '',
        placa: '',
        renavam: '',
        chassi: '',
        status: 'Ativo',
        km: '',
        maintenanceHistory: [], // Reset history
      });
    }
  }, [vehicleToEdit, isOpen]); // Re-run if vehicleToEdit changes or modal opens

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleOpenAddMaintenanceModal = () => {
    setIsAddMaintenanceModalOpen(true);
  };

  const handleCloseAddMaintenanceModal = () => {
    setIsAddMaintenanceModalOpen(false);
  };

  const handleSaveMaintenanceRecord = (newRecord: Omit<MaintenanceHistoryItem, 'id'>) => {
    // Assuming MaintenanceHistoryItem from types.ts does not have 'id' or it's optional.
    // If 'id' is mandatory in MaintenanceHistoryItem, this newRecord needs one,
    // possibly a temporary one like `Date.now().toString()` or a UUID.
    // For now, we directly use the newRecord as is from AddMaintenanceRecordModal.
    const newRecordWithIdIfNecessary = { ...newRecord, id: `temp-${Date.now()}` }; // Example temporary ID

    setFormData(prev => ({
      ...prev,
      maintenanceHistory: [...prev.maintenanceHistory, newRecordWithIdIfNecessary],
    }));
    handleCloseAddMaintenanceModal();
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
          <h3 className="text-lg font-semibold text-slate-800 mb-5">Editar Veículo</h3>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="marca" className="block text-xs font-medium text-slate-500">Marca</label>
                <input type="text" id="marca" value={formData.marca} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div>
                <label htmlFor="modelo" className="block text-xs font-medium text-slate-500">Modelo</label>
                <input type="text" id="modelo" value={formData.modelo} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div>
                <label htmlFor="ano" className="block text-xs font-medium text-slate-500">Ano</label>
                <input type="number" id="ano" value={formData.ano} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div>
                <label htmlFor="cor" className="block text-xs font-medium text-slate-500">Cor</label>
                <input type="text" id="cor" value={formData.cor} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div>
                <label htmlFor="placa" className="block text-xs font-medium text-slate-500">Placa</label>
                <input type="text" id="placa" value={formData.placa} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div>
                <label htmlFor="renavam" className="block text-xs font-medium text-slate-500">RENAVAM</label>
                <input type="number" id="renavam" value={formData.renavam} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="chassi" className="block text-xs font-medium text-slate-500">Chassi</label>
                <input type="text" id="chassi" value={formData.chassi} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
              <div>
                <label htmlFor="status" className="block text-xs font-medium text-slate-500">Status</label>
                <select id="status" value={formData.status} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full">
                  <option>Ativo</option>
                  <option>Em Manutenção</option>
                  <option>Inativo</option>
                  <option>Vendido</option>
                </select>
              </div>
              <div>
                <label htmlFor="km" className="block text-xs font-medium text-slate-500">Quilometragem Atual</label>
                <input type="number" id="km" value={formData.km} onChange={handleChange} required className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full" />
              </div>
            </div>

            {/* Maintenance History Section */}
            <h4 className="text-md font-semibold text-slate-700 mt-6 mb-3 pt-4 border-t border-slate-200">Histórico de Manutenção</h4>
            {formData.maintenanceHistory && formData.maintenanceHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-3 font-semibold text-slate-600">Data</th>
                      <th className="p-3 font-semibold text-slate-600">Tipo</th>
                      <th className="p-3 font-semibold text-slate-600">Descrição</th>
                      <th className="p-3 font-semibold text-slate-600">Custo</th>
                      <th className="p-3 font-semibold text-slate-600">Fornecedor</th>
                      <th className="p-3 font-semibold text-slate-600">OS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {formData.maintenanceHistory.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="p-3 text-slate-600">{item.date}</td>
                        <td className="p-3 text-slate-600">{item.type}</td>
                        <td className="p-3 text-slate-600">{item.description}</td>
                        <td className="p-3 text-slate-600">
                          {item.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="p-3 text-slate-600">{item.supplier}</td>
                        <td className="p-3 text-slate-600">{item.serviceOrderNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Nenhum registro de manutenção encontrado.</p>
            )}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleOpenAddMaintenanceModal}
                className="px-4 py-2 text-xs font-semibold rounded-lg transition-colors bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-500/20"
              >
                Adicionar Novo Registro
              </button>
            </div>
            {/* End of Maintenance History Section */}

          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
            <button type="button" onClick={onClose} className="modal-cancel-button px-5 py-2 text-sm font-semibold rounded-lg transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200">Cancelar</button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/10">Salvar Veículo</button>
          </div>
        </form>
      </div>
      <AddMaintenanceRecordModal
        isOpen={isAddMaintenanceModalOpen}
        onClose={handleCloseAddMaintenanceModal}
        onSave={handleSaveMaintenanceRecord}
      />
    </div>
  );
};

export default EditVehicleModal;
