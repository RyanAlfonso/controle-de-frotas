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
  type ReportView = 'osCosts' | 'costPerKm';
  const [activeReportView, setActiveReportView] = useState<ReportView>('osCosts');

  // Interface for the calculated Custo/KM data
  interface CostPerKmData {
    vehicleId: string;
    vehicleName: string;
    initialKmDisplay: string;
    currentKm: number;
    kmDriven: number;
    totalFuelingCost: number;
    totalMaintenanceCost: number;
    grandTotalCost: number;
    costPerKm: number | null;
  }

  const [completionDateStart, setCompletionDateStart] = useState('');
  const [completionDateEnd, setCompletionDateEnd] = useState('');
  const [selectedPaymentStatuses, setSelectedPaymentStatuses] = useState<OSPaymentStatus[]>([]);

  const getVehicleInfoStr = React.useCallback((vehicleId: string | undefined): string => {
    if (!vehicleId) return 'N/A';
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.marca} ${vehicle.modelo} (${vehicle.placa})` : 'Veículo não encontrado';
  }, [vehicles]);

  const getSupplierNameStr = React.useCallback((supplierId: string | undefined): string => {
    if (!supplierId) return 'N/A';
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? (supplier.nomeFantasia || supplier.nomeRazaoSocial) : 'Fornecedor Desconhecido';
  }, [suppliers]);

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

  const costPerKmReportData: CostPerKmData[] = useMemo(() => {
    if (!vehicles || !serviceOrders) return [];

    return vehicles.map(vehicle => {
      const totalFuelingCost = (vehicle.fuelingHistory || []).reduce((sum, item) => sum + item.totalCost, 0);

      const vehicleServiceOrders = serviceOrders.filter(
        os => os.vehicleId === vehicle.id &&
              (os.status === 'Concluída' || os.status === 'Faturada') &&
              (os.finalValue !== undefined || os.cost !== undefined)
      );
      const totalMaintenanceCost = vehicleServiceOrders.reduce((sum, os) => sum + (os.finalValue ?? os.cost ?? 0), 0);

      let startMileage = vehicle.initialMileage ?? 0;
      let initialKmDisplay = String(startMileage);

      if (vehicle.fuelingHistory && vehicle.fuelingHistory.length > 0) {
        const sortedFuelings = [...vehicle.fuelingHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const firstFuelingWithMileage = sortedFuelings.find(f => f.mileage !== undefined && f.mileage !== null);

        if (vehicle.initialMileage === undefined && firstFuelingWithMileage) {
          startMileage = firstFuelingWithMileage.mileage;
          initialKmDisplay = String(startMileage) + " (1º Abast.)";
        }
      }

      const kmDriven = vehicle.km - startMileage;
      const grandTotalCost = totalFuelingCost + totalMaintenanceCost;
      const costPerKm = (kmDriven > 0) ? grandTotalCost / kmDriven : null;

      return {
        vehicleId: vehicle.id,
        vehicleName: getVehicleInfoStr(vehicle.id),
        initialKmDisplay: initialKmDisplay,
        currentKm: vehicle.km,
        kmDriven: kmDriven < 0 ? 0 : kmDriven,
        totalFuelingCost,
        totalMaintenanceCost,
        grandTotalCost,
        costPerKm,
      };
    });
  }, [vehicles, serviceOrders, getVehicleInfoStr]); // getVehicleInfoStr dependency

  const fleetMetrics = useMemo(() => {
    if (!costPerKmReportData || costPerKmReportData.length === 0) {
      return { totalFleetCost: 0, totalFleetKmDriven: 0, avgFleetCostPerKm: null };
    }
    const totalFleetCost = costPerKmReportData.reduce((sum, data) => sum + data.grandTotalCost, 0);
    const totalFleetKmDriven = costPerKmReportData.reduce((sum, data) => sum + data.kmDriven, 0);
    const avgFleetCostPerKm = totalFleetKmDriven > 0 ? totalFleetCost / totalFleetKmDriven : null;
    return { totalFleetCost, totalFleetKmDriven, avgFleetCostPerKm };
  }, [costPerKmReportData]);

  return (
    <section id="financialreports-section" className="page-section">
      <h2 className="text-xl font-semibold text-slate-800 mb-5">Relatórios Financeiros</h2>

      {/* Tab Navigation */}
      <div className="mb-4 border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveReportView('osCosts')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeReportView === 'osCosts'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Custos de OS
          </button>
          <button
            onClick={() => setActiveReportView('costPerKm')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeReportView === 'costPerKm'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Custo por KM
          </button>
        </nav>
      </div>

      {activeReportView === 'osCosts' && (
        <>
          {/* Filter Controls Area for OS Costs */}
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

      {/* Report Display Area for OS Costs */}
      {/* Removed redundant activeReportView === 'osCosts' check here, it's handled by the parent <> wrapper */}
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
                  <td className="p-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
        </>
      )} {/* This closes the outer activeReportView === 'osCosts' block */}

      {activeReportView === 'costPerKm' && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Relatório de Custo por KM</h3>
          <div className="mb-4 p-3 bg-slate-50 rounded-md">
            <p className="text-sm text-slate-600">Este relatório considera todos os veículos e seus históricos de abastecimento e manutenção (OS Concluídas/Faturadas com valor definido) para calcular os custos.</p>
          </div>

          {costPerKmReportData.length === 0 ? (
            <p className="text-slate-500 text-center py-4">Nenhum dado de veículo para calcular Custo/KM.</p>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <caption className="p-4 text-lg font-semibold text-left text-slate-700 bg-slate-50">Custo por KM por Veículo</caption>
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-3 font-semibold text-slate-600">Veículo</th>
                      <th className="p-3 font-semibold text-slate-600 text-right">KM Inicial</th>
                      <th className="p-3 font-semibold text-slate-600 text-right">KM Atual</th>
                      <th className="p-3 font-semibold text-slate-600 text-right">KM Rodados</th>
                      <th className="p-3 font-semibold text-slate-600 text-right">Custo Abastec. (R$)</th>
                      <th className="p-3 font-semibold text-slate-600 text-right">Custo Manut. (R$)</th>
                      <th className="p-3 font-semibold text-slate-600 text-right">Custo Total (R$)</th>
                      <th className="p-3 font-semibold text-slate-600 text-right">Custo/KM (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {costPerKmReportData.map((item) => (
                      <tr key={item.vehicleId} className="hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-800">{item.vehicleName}</td>
                        <td className="p-3 text-slate-600 text-right">{item.initialKmDisplay}</td>
                        <td className="p-3 text-slate-600 text-right">{item.currentKm.toLocaleString('pt-BR')}</td>
                        <td className="p-3 text-slate-600 text-right">{item.kmDriven.toLocaleString('pt-BR')}</td>
                        <td className="p-3 text-slate-600 text-right">{item.totalFuelingCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td className="p-3 text-slate-600 text-right">{item.totalMaintenanceCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td className="p-3 text-slate-600 text-right">{item.grandTotalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td className="p-3 text-slate-600 text-right">
                          {item.costPerKm !== null ? item.costPerKm.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Fleet Metrics Display */}
          <div className="mt-8 p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm">
            <h4 className="text-md font-semibold text-slate-700 mb-3">Métricas Consolidadas da Frota</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Custo Total da Frota (R$):</p>
                <p className="text-slate-800 font-semibold text-lg">
                  {fleetMetrics.totalFleetCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Total KM Rodados da Frota:</p>
                <p className="text-slate-800 font-semibold text-lg">
                  {fleetMetrics.totalFleetKmDriven.toLocaleString('pt-BR')} km
                </p>
              </div>
              <div>
                <p className="text-slate-500">Custo Médio/KM da Frota (R$):</p>
                <p className="text-slate-800 font-semibold text-lg">
                  {fleetMetrics.avgFleetCostPerKm !== null
                    ? fleetMetrics.avgFleetCostPerKm.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FinancialReportsSection;
