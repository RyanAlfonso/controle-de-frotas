import React, { useState } from 'react';
import { ServiceOrder, Vehicle, User, SERVICE_ORDER_STATUSES, ServiceOrderStatus, Supplier } from '../types'; // Import Supplier

interface ServiceOrdersSectionProps {
  serviceOrders: ServiceOrder[];
  vehicles: Vehicle[];
  users: User[];
  suppliers: Supplier[]; // Added suppliers prop
  onOpenAddServiceOrderModal: () => void;
  onOpenAddOSBudgetModal: (serviceOrderId: string) => void;
  onOpenViewOSBudgetsModal: (serviceOrder: ServiceOrder) => void;
  onStartOSExecution: (serviceOrderId: string) => void;
  onOpenCompleteOSModal: (serviceOrderId: string) => void;
  onOpenInvoiceOSModal: (serviceOrderId: string) => void;
}

const ServiceOrdersSection: React.FC<ServiceOrdersSectionProps> = ({
  serviceOrders,
  vehicles,
  users,
  suppliers, // Destructure suppliers
  onOpenAddServiceOrderModal,
  onOpenAddOSBudgetModal,
  onOpenViewOSBudgetsModal,
  onStartOSExecution,
  onOpenCompleteOSModal,
  onOpenInvoiceOSModal,
}) => {
  const [selectedStatuses, setSelectedStatuses] = useState<ServiceOrderStatus[]>([]);
  const [searchOsId, setSearchOsId] = useState('');
  const [searchVehicleInfo, setSearchVehicleInfo] = useState('');
  const [searchSupplierInfo, setSearchSupplierInfo] = useState('');
  const [searchServiceType, setSearchServiceType] = useState('');

  // const noServiceOrders = serviceOrders.length === 0; // Will be based on filteredServiceOrders.length

  const filteredServiceOrders = serviceOrders.filter(order => {
    // Status Filter
    const statusMatches = selectedStatuses.length === 0 || selectedStatuses.includes(order.status);

    // OS ID Filter
    const osIdMatches = searchOsId.trim() === '' ||
                        order.id.toLowerCase().includes(searchOsId.toLowerCase().trim());

    // Vehicle Info Filter
    const vehicleInfoString = getVehicleInfo(order.vehicleId);
    const vehicleMatches = searchVehicleInfo.trim() === '' ||
                           vehicleInfoString.toLowerCase().includes(searchVehicleInfo.toLowerCase().trim());

    // Service Type Filter
    const serviceTypeMatches = searchServiceType.trim() === '' ||
                               order.serviceType.toLowerCase().includes(searchServiceType.toLowerCase().trim());

    // Supplier Info Filter
    let supplierMatches = true;
    if (searchSupplierInfo.trim() !== '') {
      if (order.supplierId) {
        const supplierName = getSupplierName(order.supplierId);
        supplierMatches = supplierName.toLowerCase().includes(searchSupplierInfo.toLowerCase().trim());
      } else {
        supplierMatches = false;
      }
    }

    return statusMatches && osIdMatches && vehicleMatches && serviceTypeMatches && supplierMatches;
  });

  const getVehicleInfo = (vehicleId: string): string => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.marca} ${vehicle.modelo} (${vehicle.placa})` : 'Veículo não encontrado';
  };

  const getUserName = (userId: string): string => {
    // For placeholder IDs, return a generic name or the ID itself
    if (userId.includes('placeholder')) return 'Usuário Solicitante';
    const user = users.find(u => u.id === userId);
    return user ? user.nome : 'Usuário desconhecido';
  };

  const getSupplierName = (supplierId: string | undefined): string => {
    if (!supplierId) return '';
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? (supplier.nomeFantasia || supplier.nomeRazaoSocial) : 'Fornecedor Desconhecido';
  };

  const hasActiveFilters =
      selectedStatuses.length > 0 ||
      searchOsId.trim() !== '' ||
      searchVehicleInfo.trim() !== '' ||
      searchSupplierInfo.trim() !== '' ||
      searchServiceType.trim() !== '';

  return (
    <section id="serviceorders-section" className="page-section">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-slate-800">Gerenciamento de Ordens de Serviço</h2>
        <button
          onClick={onOpenAddServiceOrderModal}
          className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/10"
        >
          Abrir Solicitação de OS
        </button>
      </div>

      {/* Filter Controls Section */}
      <div className="mb-5 p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {/* Column 1: Text/ID based filters */}
          <div className="space-y-4">
            <div>
              <label htmlFor="os-id-filter" className="text-sm font-medium text-slate-600">Pesquisar por Nº OS</label>
              <input
                type="text"
                id="os-id-filter"
                placeholder="Número da OS..."
                value={searchOsId}
                onChange={(e) => setSearchOsId(e.target.value)}
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>
            <div>
              <label htmlFor="vehicle-info-filter" className="text-sm font-medium text-slate-600">Pesquisar por Veículo</label>
              <input
                type="text"
                id="vehicle-info-filter"
                placeholder="Marca, Modelo, Placa..."
                value={searchVehicleInfo}
                onChange={(e) => setSearchVehicleInfo(e.target.value)}
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>
          </div>

          {/* Column 2: More Text based filters */}
          <div className="space-y-4">
            <div>
              <label htmlFor="supplier-info-filter" className="text-sm font-medium text-slate-600">Pesquisar por Fornecedor (OS Aprovada)</label>
              <input
                type="text"
                id="supplier-info-filter"
                placeholder="Nome do Fornecedor..."
                value={searchSupplierInfo}
                onChange={(e) => setSearchSupplierInfo(e.target.value)}
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>
            <div>
              <label htmlFor="service-type-filter" className="text-sm font-medium text-slate-600">Pesquisar por Tipo de Serviço</label>
              <input
                type="text"
                id="service-type-filter"
                placeholder="Tipo de serviço..."
                value={searchServiceType}
                onChange={(e) => setSearchServiceType(e.target.value)}
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>
          </div>

          {/* Column 3: Status Filter Checkboxes (can take more vertical space) */}
          <div className="lg:col-span-1 md:col-span-2"> {/* Spans 1 on lg, 2 on md to allow text filters to take 2/3 width on lg */}
            <label className="text-sm font-medium text-slate-600 mb-1 block">Filtrar por Status da OS</label>
            <div className="mt-1 grid grid-cols-2 sm:grid-cols-2 gap-x-4 gap-y-2"> {/* Adjusted grid for statuses */}
              {SERVICE_ORDER_STATUSES.map((status) => (
                <label key={status} className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                    checked={selectedStatuses.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStatuses([...selectedStatuses, status]);
                      } else {
                        setSelectedStatuses(selectedStatuses.filter(s => s !== status));
                      }
                    }}
                  />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* End of Filter Controls Section */}

      {filteredServiceOrders.length === 0 ? (
        <div id="no-service-orders" className="p-8 text-center text-slate-500">
          {hasActiveFilters ?
            "Nenhuma ordem de serviço encontrada com os filtros aplicados." :
            "Nenhuma ordem de serviço cadastrada."
          }
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold text-slate-600">Nº OS</th>
                  <th className="p-4 font-semibold text-slate-600">Veículo</th>
                  <th className="p-4 font-semibold text-slate-600">Tipo de Serviço</th>
                  <th className="p-4 font-semibold text-slate-600">Data Solicitação</th>
                  <th className="p-4 font-semibold text-slate-600">Solicitante</th>
                  <th className="p-4 font-semibold text-slate-600 text-center">Orçamentos</th>
                  <th className="p-4 font-semibold text-slate-600">Status</th>
                  <th className="p-4 font-semibold text-slate-600">Ações</th>
                </tr>
              </thead>
              <tbody id="serviceorder-list" className="divide-y divide-slate-200">
                {filteredServiceOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-800">{order.id}</td>
                    <td className="p-4 text-slate-600">{getVehicleInfo(order.vehicleId)}</td>
                    <td className="p-4 text-slate-600">{order.serviceType}</td>
                    <td className="p-4 text-slate-600">
                      {new Date(order.requestDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4 text-slate-600">{getUserName(order.requesterId)}</td>
                    <td className="p-4 text-center text-slate-600">{order.budgets?.length || 0}</td> {/* Added budget count cell */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'Pendente de Orçamento' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Aguardando Aprovação' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Aprovada - Aguardando Execução' ? 'bg-sky-100 text-sky-800' :
                        order.status === 'Em Andamento' ? 'bg-indigo-100 text-indigo-800' :
                        order.status === 'Concluída' ? 'bg-green-100 text-green-800' :
                        order.status === 'Faturada' ? 'bg-purple-100 text-purple-800' : // Added Faturada style
                        order.status === 'Cancelada' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800' // Fallback
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 space-x-1">
                      {((order.status === 'Pendente de Orçamento' || order.status === 'Aguardando Aprovação') && !order.budgets?.some(b => b.isApproved)) && (
                        <button
                          onClick={() => onOpenAddOSBudgetModal(order.id)}
                          title="Adicionar Orçamento"
                          className="px-2 py-1 text-xs font-medium rounded-md transition-colors text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                        >
                          Orçamento+
                        </button>
                      )}
                      {((order.budgets && order.budgets.length > 0) || ['Pendente de Orçamento', 'Aguardando Aprovação', 'Aprovada - Aguardando Execução', 'Em Andamento', 'Concluída', 'Faturada'].includes(order.status)) && (
                        <button
                          onClick={() => onOpenViewOSBudgetsModal(order)}
                          title="Ver/Gerenciar Orçamentos"
                          className="px-2 py-1 text-xs font-medium rounded-md transition-colors text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                          Ver Orçamentos
                        </button>
                      )}
                      {order.status === 'Aprovada - Aguardando Execução' && (
                        <button
                          onClick={() => onStartOSExecution(order.id)}
                          title="Iniciar Execução da OS"
                          className="px-2 py-1 text-xs font-medium rounded-md transition-colors text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
                        >
                          Iniciar Exec.
                        </button>
                      )}
                      {order.status === 'Em Andamento' && (
                        <button
                          onClick={() => onOpenCompleteOSModal(order.id)}
                          title="Concluir Ordem de Serviço"
                          className="px-2 py-1 text-xs font-medium rounded-md transition-colors text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                        >
                          Concluir OS
                        </button>
                      )}
                      {order.status === 'Concluída' && (
                        <button
                          onClick={() => onOpenInvoiceOSModal(order.id)}
                          title="Registrar Faturamento da OS"
                          className="px-2 py-1 text-xs font-medium rounded-md transition-colors text-cyan-700 bg-cyan-100 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
                        >
                          Faturar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiceOrdersSection;
