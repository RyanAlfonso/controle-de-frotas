import React, { useEffect, useRef } from 'react';
import {
  ChartData,
  ServiceOrder,
  Vehicle,
  VehicleStatus,
  VEHICLE_STATUSES,
  ServiceOrderStatus,
  SERVICE_ORDER_STATUSES,
  Supplier, // Added Supplier
  SupplierStatus // Added SupplierStatus
} from '../types';

// Placeholder for Chart.js type
declare var Chart: any;

interface KPIProps {
  title: string;
  value: string | number;
  bgColorClass: string;
}

const KPI_Card: React.FC<KPIProps> = ({ title, value, bgColorClass }) => (
  <div className="bg-white border border-slate-200/80 rounded-lg shadow-sm flex overflow-hidden">
    <div className={`w-2 ${bgColorClass}`}></div>
    <div className="p-5 flex-1">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-4xl font-bold text-slate-900 mt-2">{value}</p>
    </div>
  </div>
);

interface DashboardSectionProps {
  vehicles: Vehicle[];
  serviceOrders: ServiceOrder[];
  suppliers: Supplier[]; // Added suppliers prop
  // fleetStatusData: ChartData;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  vehicles,
  serviceOrders,
  suppliers, // Destructure suppliers
  // fleetStatusData
}) => {
  const totalVehicles = vehicles.length;
  const vehicleStatusCounts = VEHICLE_STATUSES.reduce((acc, status) => {
    acc[status] = vehicles.filter(v => v.status === status).length;
    return acc;
  }, {} as Record<VehicleStatus, number>);

  const activeOSStatuses: ServiceOrderStatus[] = [
    'Pendente de Orçamento',
    'Aguardando Aprovação',
    'Aprovada - Aguardando Execução',
    'Em Andamento'
  ];
  const totalActiveServiceOrders = serviceOrders.filter(os => activeOSStatuses.includes(os.status)).length;

  const osStatusCounts = SERVICE_ORDER_STATUSES.reduce((acc, status) => {
    acc[status] = serviceOrders.filter(os => os.status === status).length;
    return acc;
  }, {} as Record<ServiceOrderStatus, number>);

  // Ensure all statuses have a count, default to 0
  const completeOsStatusCounts = SERVICE_ORDER_STATUSES.reduce((acc, status) => {
    acc[status] = osStatusCounts[status] || 0;
    return acc;
  }, {} as Record<ServiceOrderStatus, number>);

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  const osChartRef = useRef<HTMLCanvasElement>(null); // New ref for OS chart
  const osChartInstanceRef = useRef<any>(null); // New ref for OS chart instance

  const supplierChartRef = useRef<HTMLCanvasElement>(null); // New ref for Supplier chart
  const supplierChartInstanceRef = useRef<any>(null); // New ref for Supplier chart instance

  // --- Data Derivation for Charts ---

  // Vehicle Status Data
  const derivedFleetStatusData: ChartData = {
    labels: ['Ativos', 'Em Manutenção', 'Inativos', 'Vendidos'], // Updated labels
    datasets: [{
        data: [
            vehicleStatusCounts['Ativo'] || 0,
            vehicleStatusCounts['Em Manutenção'] || 0,
            vehicleStatusCounts['Inativo'] || 0,
            // vehicleStatusCounts['Vendido'] || 0, // Removed
        ],
        backgroundColor: [
            'rgba(13, 148, 136, 0.8)', // Ativo - Teal
            'rgba(249, 115, 22, 0.8)',  // Em Manutenção - Orange
            'rgba(100, 116, 139, 0.8)', // Inativo - Slate
            // 'rgba(239, 68, 68, 0.8)'    // Vendido - Red (example) // Removed

            'rgba(239, 68, 68, 0.8)'    // Vendido - Red (example)
        ],
        borderColor: '#ffffff',
        borderWidth: 4,
        hoverOffset: 8
    }]
  };

  // OS Status Data
  const derivedOSStatusData: ChartData = {
    labels: SERVICE_ORDER_STATUSES as unknown as string[], // Keep as is, Chart.js handles labels
    datasets: [{
      data: SERVICE_ORDER_STATUSES.map(status => completeOsStatusCounts[status]), // Use completeOsStatusCounts
      backgroundColor: [
        'rgba(251, 191, 36, 0.8)', // Pendente de Orçamento - Amber
        'rgba(59, 130, 246, 0.8)',  // Aguardando Aprovação - Blue
        'rgba(14, 165, 233, 0.8)', // Aprovada - Aguardando Execução - Sky
        'rgba(99, 102, 241, 0.8)',  // Em Andamento - Indigo
        'rgba(16, 185, 129, 0.8)', // Concluída - Emerald/Green
        'rgba(168, 85, 247, 0.8)',  // Faturada - Purple
        'rgba(239, 68, 68, 0.8)'    // Cancelada - Red
      ],
      borderColor: '#ffffff',
      borderWidth: 4,
      hoverOffset: 8
    }]
  };

  // Supplier Status Data
  const activeSuppliers = suppliers.filter(s => s.status === 'Ativo').length;
  const inactiveSuppliers = suppliers.filter(s => s.status === 'Inativo').length;

  const derivedSupplierStatusData: ChartData = {
    labels: ['Fornecedores Ativos', 'Fornecedores Inativos'],
    datasets: [{
      data: [activeSuppliers, inactiveSuppliers],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)', // Ativo - Green-500
        'rgba(100, 116, 139, 0.8)', // Inativo - Slate-500
      ],
      borderColor: '#ffffff',
      borderWidth: 4,
      hoverOffset: 8
    }]
  };


  useEffect(() => {
    if (chartRef.current && derivedFleetStatusData) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
        chartInstanceRef.current = new Chart(ctx, {
          type: 'doughnut',
          data: derivedFleetStatusData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: '#475569',
                  padding: 20,
                  font: { size: 12 }
                }
              }
            }
          }
        });
      }
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [derivedFleetStatusData]); // Re-run effect if data changes

  // useEffect for OS Status Doughnut Chart
  useEffect(() => {
    if (osChartRef.current && derivedOSStatusData) {
      const ctx = osChartRef.current.getContext('2d');
      if (ctx) {
        if (osChartInstanceRef.current) {
          osChartInstanceRef.current.destroy();
        }
        osChartInstanceRef.current = new Chart(ctx, {
          type: 'doughnut', // Changed to 'doughnut'
          data: derivedOSStatusData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%', // Same as vehicle chart
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: '#475569',
                  padding: 20,
                  font: { size: 12 }
                }
              },
              title: { // Optional: Add a title if desired, or remove if redundant with card title
                display: true,
                text: 'Ordens de Serviço por Status', // Title for the chart
                color: '#334155', // slate-700
                font: { size: 14, weight: '500' as '500' }, // Adjusted font
                padding: { top: 5, bottom: 15 }
              }
            }
          }
        });
      }
    }
    return () => {
      if (osChartInstanceRef.current) {
        osChartInstanceRef.current.destroy();
        osChartInstanceRef.current = null;
      }
    };
  }, [derivedOSStatusData]); // Re-run if OS data changes

  // useEffect for Supplier Status Doughnut Chart
  useEffect(() => {
    if (supplierChartRef.current && derivedSupplierStatusData) {
      const ctx = supplierChartRef.current.getContext('2d');
      if (ctx) {
        if (supplierChartInstanceRef.current) {
          supplierChartInstanceRef.current.destroy();
        }
        supplierChartInstanceRef.current = new Chart(ctx, {
          type: 'doughnut',
          data: derivedSupplierStatusData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: '#475569',
                  padding: 20,
                  font: { size: 12 }
                }
              },
              title: {
                display: true,
                text: 'Status dos Fornecedores',
                color: '#334155',
                font: { size: 14, weight: '500' as '500' },
                padding: { top: 5, bottom: 15 }
              }
            }
          }
        });
      }
    }
    return () => {
      if (supplierChartInstanceRef.current) {
        supplierChartInstanceRef.current.destroy();
        supplierChartInstanceRef.current = null;
      }
    };
  }, [derivedSupplierStatusData]); // Re-run if supplier data changes


  return (
    <section id="dashboard-section" className="page-section">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI_Card title="Frota Total" value={totalVehicles} bgColorClass="bg-blue-500" />
        <KPI_Card title="Veículos Ativos" value={vehicleStatusCounts['Ativo'] || 0} bgColorClass="bg-teal-500" />
        <KPI_Card title="Em Manutenção" value={vehicleStatusCounts['Em Manutenção'] || 0} bgColorClass="bg-orange-500" />
        <KPI_Card title="Total de OS" value={serviceOrders.length} bgColorClass="bg-yellow-500" /> {/* Changed title and value */}
      </div>

      {/* Charts Section - Updated Grid Wrapper for 3 charts */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Fleet Chart Card - Item 1 */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Status da Frota</h3>
          <div className="chart-container" style={{ height: '300px' }}>
            <canvas ref={chartRef} id="statusChart"></canvas>
          </div>
        </div>

        {/* OS Status Chart Card - Item 2 */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-6">
          {/* Title is now part of chart options */}
          <div className="chart-container" style={{ height: '300px' }}>
            <canvas ref={osChartRef} id="osStatusChart"></canvas>
          </div>
        </div>

        {/* Supplier Status Chart Card - Item 3 */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-6">
          {/* Title is part of chart options */}
          <div className="chart-container" style={{ height: '300px' }}>
            <canvas ref={supplierChartRef} id="supplierStatusChart"></canvas>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DashboardSection;
