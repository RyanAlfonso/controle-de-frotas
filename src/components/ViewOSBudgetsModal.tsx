import React from 'react';
import { ServiceOrder, ServiceOrderBudget, Supplier, Vehicle } from '../types'; // Assuming Vehicle might be needed if we pass vehicles list for info

interface ViewOSBudgetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceOrder: ServiceOrder | null;
  onApproveBudget: (budgetId: string) => void;
  suppliers: Supplier[];
  vehicles: Vehicle[]; // Added to get vehicle info
}

const ViewOSBudgetsModal: React.FC<ViewOSBudgetsModalProps> = ({
  isOpen,
  onClose,
  serviceOrder,
  onApproveBudget,
  suppliers,
  vehicles,
}) => {
  if (!isOpen || !serviceOrder) {
    return null;
  }

  const getSupplierName = (supplierId: string): string => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? (supplier.nomeFantasia || supplier.nomeRazaoSocial) : 'Fornecedor não encontrado';
  };

  const getVehicleInfo = (vehicleId: string): string => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.marca} ${vehicle.modelo} (${vehicle.placa})` : 'Veículo não encontrado';
  };

  const hasApprovedBudget = serviceOrder.budgets?.some(b => b.isApproved);
  const canApproveBudget = serviceOrder.status === 'Pendente de Orçamento' || serviceOrder.status === 'Aguardando Aprovação';

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="modal-content bg-white border border-slate-200 w-full max-w-2xl rounded-xl shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-xl font-semibold text-slate-800">Orçamentos para OS: {serviceOrder.id}</h3>
                <p className="text-sm text-slate-500 mt-1">
                    Veículo: {getVehicleInfo(serviceOrder.vehicleId)} <br/>
                    Serviço Solicitado: {serviceOrder.serviceType}
                </p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {serviceOrder.budgets && serviceOrder.budgets.length > 0 ? (
              serviceOrder.budgets.map(budget => (
                <div key={budget.id} className={`p-4 rounded-lg border ${budget.isApproved ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50/50'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <p className="text-sm"><strong className="text-slate-600">Fornecedor:</strong> {getSupplierName(budget.supplierId)}</p>
                    <p className="text-sm"><strong className="text-slate-600">Valor:</strong> {budget.budgetValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <p className="text-sm md:col-span-2"><strong className="text-slate-600">Prazo Estimado:</strong> {budget.estimatedDeadline}</p>
                    {budget.budgetNotes && (
                      <p className="text-sm md:col-span-2"><strong className="text-slate-600">Observações:</strong> {budget.budgetNotes}</p>
                    )}
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <div>
                      {budget.isApproved ? (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-800">Aprovado</span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendente</span>
                      )}
                    </div>
                    {!budget.isApproved && !hasApprovedBudget && canApproveBudget && (
                      <button
                        onClick={() => onApproveBudget(budget.id)}
                        className="px-4 py-1.5 text-xs font-semibold rounded-md transition-colors text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
                      >
                        Aprovar este Orçamento
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 py-4 text-center">Nenhum orçamento cadastrado para esta OS.</p>
            )}
          </div>

          {serviceOrder.status === "Aprovada - Aguardando Execução" && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-200">
              Um orçamento já foi aprovado para esta OS e está aguardando execução.
            </div>
          )}
           {serviceOrder.status === "Em Andamento" && (
            <div className="mt-4 p-3 bg-indigo-50 text-indigo-700 text-sm rounded-md border border-indigo-200">
              Esta OS está em andamento.
            </div>
          )}
           {serviceOrder.status === "Concluída" && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-200">
              Esta OS foi concluída.
            </div>
          )}
            {serviceOrder.status === "Cancelada" && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
              Esta OS foi cancelada.
            </div>
          )}


          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOSBudgetsModal;
