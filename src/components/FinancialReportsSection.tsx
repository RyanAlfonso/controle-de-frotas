import React, { useState, useMemo } from 'react';
import { ServiceOrder, Vehicle, Supplier, OSPaymentStatus, OS_PAYMENT_STATUSES } from '../types';

interface FinancialReportsSectionProps {
  serviceOrders: ServiceOrder[];
  vehicles: Vehicle[];
  suppliers: Supplier[];
}

const FinancialReportsSection: React.FC<FinancialReportsSectionProps> = ({
  serviceOrders,
  vehicles,
  suppliers,
}) => {
  const [completionDateStart, setCompletionDateStart] = useState('');
  const [completionDateEnd, setCompletionDateEnd] = useState('');
  const [selectedPaymentStatuses, setSelectedPaymentStatuses] = useState<OSPaymentStatus[]>([]);

  const getVehicleInfoStr = (vehicleId: string | undefined): string => {
    if (!vehicleId) return 'N/A';
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.marca} ${vehicle.modelo} (${vehicle.placa})` : 'Veículo não encontrado';
  };

  const getSupplierNameStr = (supplierId: string | undefined): string => {
    if (!supplierId) return 'N/A';
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? (supplier.nomeFantasia || supplier.nomeRazaoSocial) : 'Fornecedor Desconhecido';
  };

  const filteredReportData = useMemo(() => {
    return serviceOrders.filter(order => {
      // Filter by completionDate range
      if (completionDateStart && (!order.completionDate || order.completionDate < completionDateStart)) {
        return false;
      }
      if (completionDateEnd && (!order.completionDate || order.completionDate > completionDateEnd)) {
        return false;
      }

      // Filter by selectedPaymentStatuses
      if (selectedPaymentStatuses.length > 0 && (!order.paymentStatus || !selectedPaymentStatuses.includes(order.paymentStatus))) {
        return false;
      }

      // Only include OS that have a finalValue or cost defined (relevant for financial report)
      if (order.finalValue === undefined && order.cost === undefined) {
          return false;
      }
      if (order.status !== 'Concluída' && order.status !== 'Faturada' && order.status !== 'Cancelada') { // Consider only relevant OS statuses
        // For this report, typically only 'Concluída' and 'Faturada' are financially relevant.
        // 'Cancelada' might be included if it has a cost/fine associated, but for now let's assume not.
        // Let's restrict to Concluida and Faturada for now, or if payment status is set.
        if (!order.paymentStatus) return false; // If not Concluida/Faturada, must have paymentStatus to be financially relevant here.
      }


      return true;
    });
  }, [serviceOrders, completionDateStart, completionDateEnd, selectedPaymentStatuses]);

  const totalFilteredValue = useMemo(() => {
    return filteredReportData.reduce((sum, order) => sum + (order.finalValue ?? order.cost ?? 0), 0);
  }, [filteredReportData]);

  const handleClearFilters = () => {
    setCompletionDateStart('');
    setCompletionDateEnd('');
    setSelectedPaymentStatuses([]);
  };

  const hasActiveFilters =
    completionDateStart !== '' ||
    completionDateEnd !== '' ||
    selectedPaymentStatuses.length > 0;

  return (
    <section id="financialreports-section" className="page-section">
      <h2 className="text-xl font-semibold text-slate-800 mb-5">Relatórios Financeiros</h2>

      {/* Filter Controls Area */}
      <div className="mb-5 p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {/* Date Range Filter */}
          <div className="lg:col-span-1 space-y-2">
            <label className="text-sm font-medium text-slate-600 block">Período de Conclusão da OS</label>
            <div>
              <label htmlFor="completionDateStart" className="text-xs font-medium text-slate-500">De:</label>
              <input
                type="date"
                id="completionDateStart"
                value={completionDateStart}
                onChange={e => setCompletionDateStart(e.target.value)}
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>
            <div>
              <label htmlFor="completionDateEnd" className="text-xs font-medium text-slate-500">Até:</label>
              <input
                type="date"
                id="completionDateEnd"
                value={completionDateEnd}
                onChange={e => setCompletionDateEnd(e.target.value)}
                className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
              />
            </div>
          </div>

          {/* Payment Status Filter */}
          <div className="lg:col-span-1 md:col-span-2">
            <label className="text-sm font-medium text-slate-600 mb-1 block">Status de Pagamento da OS</label>
            <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {OS_PAYMENT_STATUSES.map((status) => (
                <label key={status} className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                    checked={selectedPaymentStatuses.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPaymentStatuses([...selectedPaymentStatuses, status]);
                      } else {
                        setSelectedPaymentStatuses(selectedPaymentStatuses.filter(s => s !== status));
                      }
                    }}
                  />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons for Filters */}
          <div className="lg:col-span-1 md:col-span-full flex items-end">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-slate-200 text-slate-700 hover:bg-slate-300"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Report Display Area */}
      {filteredReportData.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          {hasActiveFilters ?
            "Nenhum dado encontrado para os filtros selecionados." :
            "Nenhuma ordem de serviço processada (Concluída/Faturada com valor) para exibir no relatório."
          }
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold text-slate-600">OS ID</th>
                  <th className="p-3 font-semibold text-slate-600">Veículo</th>
                  <th className="p-3 font-semibold text-slate-600">Fornecedor</th>
                  <th className="p-3 font-semibold text-slate-600">Data Conclusão</th>
                  <th className="p-3 font-semibold text-slate-600">Data Venc. Fatura</th>
                  <th className="p-3 font-semibold text-slate-600 text-right">Valor Final (R$)</th>
                  <th className="p-3 font-semibold text-slate-600 text-center">Status Pagamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredReportData.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-700">{order.id}</td>
                    <td className="p-3 text-slate-600">{getVehicleInfoStr(order.vehicleId)}</td>
                    <td className="p-3 text-slate-600">{getSupplierNameStr(order.supplierId)}</td>
                    <td className="p-3 text-slate-600">{order.completionDate ? new Date(order.completionDate).toLocaleDateString('pt-BR') : 'N/A'}</td>
                    <td className="p-3 text-slate-600">{order.invoiceDueDate ? new Date(order.invoiceDueDate).toLocaleDateString('pt-BR') : 'N/A'}</td>
                    <td className="p-3 text-slate-600 text-right">{(order.finalValue ?? order.cost ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td className="p-3 text-center">
                      {order.paymentStatus ? (
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          order.paymentStatus === 'Pendente' ? 'bg-orange-100 text-orange-800' :
                          order.paymentStatus === 'Parcialmente Pago' ? 'bg-sky-100 text-sky-800' :
                          order.paymentStatus === 'Pago' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t border-slate-300">
                  <td colSpan={5} className="p-3 font-semibold text-slate-700 text-right">Total Geral (R$):</td>
                  <td className="p-3 font-semibold text-slate-700 text-right">
                    {totalFilteredValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="p-3"></td> {/* Empty cell for status pagto column */}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default FinancialReportsSection;
