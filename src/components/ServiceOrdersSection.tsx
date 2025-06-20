import React from 'react';
import { ServiceOrder, Vehicle, User } from '../types';

interface ServiceOrdersSectionProps {
  serviceOrders: ServiceOrder[];
  vehicles: Vehicle[];
  users: User[];
  onOpenAddServiceOrderModal: () => void;
  onOpenAddOSBudgetModal: (serviceOrderId: string) => void;
  onOpenViewOSBudgetsModal: (serviceOrder: ServiceOrder) => void;
  onStartOSExecution: (serviceOrderId: string) => void;
  onOpenCompleteOSModal: (serviceOrderId: string) => void;
  onOpenInvoiceOSModal: (serviceOrderId: string) => void; // Added new prop
}

const ServiceOrdersSection: React.FC<ServiceOrdersSectionProps> = ({
  serviceOrders,
  vehicles,
  users,
  onOpenAddServiceOrderModal,
  onOpenAddOSBudgetModal,
  onOpenViewOSBudgetsModal,
  onStartOSExecution,
  onOpenCompleteOSModal,
  onOpenInvoiceOSModal, // Destructure new prop
}) => {
  const noServiceOrders = serviceOrders.length === 0;

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

      {noServiceOrders ? (
        <div id="no-service-orders" className="p-8 text-center text-slate-500">
          Nenhuma ordem de serviço encontrada.
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
                  <th className="p-4 font-semibold text-slate-600 text-center">Orçamentos</th> {/* Added Orçamentos header */}
                  <th className="p-4 font-semibold text-slate-600">Status</th>
                  <th className="p-4 font-semibold text-slate-600">Ações</th>
                </tr>
              </thead>
              <tbody id="serviceorder-list" className="divide-y divide-slate-200">
                {serviceOrders.map((order) => (
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
