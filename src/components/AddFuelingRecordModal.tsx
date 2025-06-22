import React, { useState, useEffect, useCallback } from 'react';
import { FuelingHistoryItem } from '../types';

// Local type for form state, allowing string for number inputs initially
interface FuelingRecordFormData {
  date: string;
  fuelType: string;
  liters: string | number;
  pricePerLiter: string | number;
  totalCost: string | number;
  mileage: string | number;
  stationName: string;
}

interface AddFuelingRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSave expects the final data structure with numbers
  onSave: (record: Omit<FuelingHistoryItem, 'id'>) => void;
}

const initialFormData: FuelingRecordFormData = {
  date: new Date().toISOString().split('T')[0],
  fuelType: '',
  liters: '', // Keep as string for input, parse on save
  pricePerLiter: '', // Keep as string for input, parse on save
  totalCost: '', // Keep as string for input, parse on save
  mileage: '', // Keep as string for input, parse on save
  stationName: '',
};

const AddFuelingRecordModal: React.FC<AddFuelingRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<FuelingRecordFormData>(initialFormData);
  const [isTotalCostManuallyEdited, setIsTotalCostManuallyEdited] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setIsTotalCostManuallyEdited(false);
    }
  }, [isOpen]);

  const calculateTotal = useCallback(() => {
    const litersNum = parseFloat(String(formData.liters));
    const pricePerLiterNum = parseFloat(String(formData.pricePerLiter));
    if (!isNaN(litersNum) && !isNaN(pricePerLiterNum) && litersNum > 0 && pricePerLiterNum > 0) {
      return parseFloat((litersNum * pricePerLiterNum).toFixed(2));
    }
    return '';
  }, [formData.liters, formData.pricePerLiter]);

  useEffect(() => {
    if (!isTotalCostManuallyEdited) {
      const calculatedTotal = calculateTotal();
      if (calculatedTotal !== '' || String(formData.liters) === '' || String(formData.pricePerLiter) === '') {
        // Update if calculated value is valid OR if inputs are cleared (to clear totalCost too)
         setFormData(prev => ({ ...prev, totalCost: calculatedTotal === '' ? '' : String(calculatedTotal) }));
      }
    }
  }, [formData.liters, formData.pricePerLiter, isTotalCostManuallyEdited, calculateTotal]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'totalCost') {
      setIsTotalCostManuallyEdited(true);
    } else if (name === 'liters' || name === 'pricePerLiter') {
      setIsTotalCostManuallyEdited(false); // Allow auto-calculation to resume if these change
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const litersNum = parseFloat(String(formData.liters));
    const pricePerLiterNum = parseFloat(String(formData.pricePerLiter));
    const totalCostNum = parseFloat(String(formData.totalCost));
    const mileageNum = parseFloat(String(formData.mileage));

    if (!formData.date || !formData.fuelType || isNaN(litersNum) || litersNum <= 0 ||
        isNaN(pricePerLiterNum) || pricePerLiterNum <= 0 || isNaN(totalCostNum) || totalCostNum <= 0 ||
        isNaN(mileageNum) || mileageNum < 0 || !formData.stationName) {
      alert('Por favor, preencha todos os campos obrigatórios com valores válidos. Litros, Preço/L, Valor Total e Quilometragem devem ser números positivos (KM pode ser 0).');
      return;
    }

    // Final check for totalCost consistency if not manually edited
    if (!isTotalCostManuallyEdited) {
        const calculated = litersNum * pricePerLiterNum;
        // Allow small tolerance for floating point issues
        if (Math.abs(calculated - totalCostNum) > 0.011) {
            if(!window.confirm(`O valor total (R$ ${totalCostNum.toFixed(2)}) não corresponde ao cálculo de Litros x Preço/L (R$ ${calculated.toFixed(2)}). Deseja continuar?`)) {
                return;
            }
        }
    }


    onSave({
      date: formData.date,
      fuelType: formData.fuelType,
      liters: litersNum,
      pricePerLiter: pricePerLiterNum,
      totalCost: totalCostNum,
      mileage: mileageNum,
      stationName: formData.stationName,
    });
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="modal-content bg-white border border-slate-200 w-full max-w-lg rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Adicionar Registro de Abastecimento</h3>
          <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-3">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-xs font-medium text-slate-500">Data*</label>
                    <input
                        type="date"
                        name="date"
                        id="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
                    />
                </div>
                <div>
                    <label htmlFor="mileage" className="block text-xs font-medium text-slate-500">Quilometragem*</label>
                    <input
                        type="number"
                        name="mileage"
                        id="mileage"
                        value={formData.mileage}
                        onChange={handleChange}
                        required
                        min="0"
                        placeholder="KM no painel"
                        className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
                    />
                </div>
            </div>

            <div>
              <label htmlFor="fuelType" className="block text-xs font-medium text-slate-500">Tipo de Combustível*</label>
              <input // Could be a select later: "Gasolina Comum", "Gasolina Aditivada", "Etanol", "Diesel S10", "Diesel S500", "GNV"
                type="text"
                name="fuelType"
                id="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                required
                placeholder="Ex: Gasolina Comum, Etanol"
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="liters" className="block text-xs font-medium text-slate-500">Litros*</label>
                    <input
                        type="number"
                        name="liters"
                        id="liters"
                        value={formData.liters}
                        onChange={handleChange}
                        required
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
                    />
                </div>
                <div>
                    <label htmlFor="pricePerLiter" className="block text-xs font-medium text-slate-500">Preço/Litro (R$)*</label>
                    <input
                        type="number"
                        name="pricePerLiter"
                        id="pricePerLiter"
                        value={formData.pricePerLiter}
                        onChange={handleChange}
                        required
                        step="0.001"
                        min="0.001"
                        placeholder="0.000"
                        className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
                    />
                </div>
            </div>

            <div>
              <label htmlFor="totalCost" className="block text-xs font-medium text-slate-500">Valor Total (R$)*</label>
              <input
                type="number"
                name="totalCost"
                id="totalCost"
                value={formData.totalCost}
                onChange={handleChange}
                required
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>

            <div>
              <label htmlFor="stationName" className="block text-xs font-medium text-slate-500">Posto de Combustível*</label>
              <input
                type="text"
                name="stationName"
                id="stationName"
                value={formData.stationName}
                onChange={handleChange}
                required
                placeholder="Nome do posto"
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
              Salvar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFuelingRecordModal;
