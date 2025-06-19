import React from 'react';
import { Vehicle } from '../types';

interface VehiclesSectionProps {
  vehicles: Vehicle[];
  onAddVehicle: () => void;
  // onFilterChange: (filters: any) => void;
}

const VehiclesSection: React.FC<VehiclesSectionProps> = ({ vehicles, onAddVehicle }) => {
  const noVehicles = vehicles.length === 0;

  // TODO: Implement filter state and logic
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.placa.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  return (
    <section id="vehicles-section" className="page-section">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-slate-800">Gerenciamento de Frota</h2>
        <button
          onClick={onAddVehicle}
          className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/10"
        >
          Adicionar Veículo
        </button>
      </div>

      <div className="mb-5 p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label htmlFor="search-filter" className="text-sm font-medium text-slate-600">Pesquisar</label>
            <input
              type="text"
              id="search-filter"
              placeholder="Marca, modelo, placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
            />
          </div>
          <div>
            <label htmlFor="status-filter" className="text-sm font-medium text-slate-600">Status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
            >
              <option value="">Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Em Manutenção">Em Manutenção</option>
              <option value="Inativo">Inativo</option>
              <option value="Vendido">Vendido</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600">Placa</th>
                <th className="p-4 font-semibold text-slate-600">Modelo</th>
                <th className="p-4 font-semibold text-slate-600">Marca</th>
                <th className="p-4 font-semibold text-slate-600">Ano</th>
                <th className="p-4 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody id="vehicle-list" className="divide-y divide-slate-200">
              {filteredVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 cursor-pointer">
                  <td className="p-4 font-medium text-slate-800">{v.placa}</td>
                  <td className="p-4 text-slate-600">{v.modelo}</td>
                  <td className="p-4 text-slate-600">{v.marca}</td>
                  <td className="p-4 text-slate-600">{v.ano}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      v.status === 'Ativo' ? 'bg-teal-100 text-teal-800' :
                      v.status === 'Em Manutenção' ? 'bg-orange-100 text-orange-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredVehicles.length === 0 && (
          <div id="no-vehicles" className="p-8 text-center text-slate-500">
            Nenhum veículo encontrado.
          </div>
        )}
      </div>
    </section>
  );
};

export default VehiclesSection;
