import React, { useEffect, useRef } from 'react';
import {
  ChartData,
  ServiceOrder,
  Vehicle,
  VehicleStatus,
  VEHICLE_STATUSES,
  ServiceOrderStatus, // Import ServiceOrderStatus
  SERVICE_ORDER_STATUSES // Import SERVICE_ORDER_STATUSES
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
  vehicles: Vehicle[]; // Changed to receive full vehicles array
  serviceOrders: ServiceOrder[];
  // fleetStatusData: ChartData;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  vehicles, // Destructure vehicles
  serviceOrders,
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

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  const osChartRef = useRef<HTMLCanvasElement>(null); // New ref for OS chart
  const osChartInstanceRef = useRef<any>(null); // New ref for OS chart instance

  // Example: Derive fleetStatusData from props or internal state if not passed directly
  // This is a simplified version based on the counts passed
  const derivedFleetStatusData: ChartData = {
    labels: ['Ativos', 'Em Manutenção', 'Inativos', 'Vendidos'], // Updated labels
    datasets: [{
        data: [
            vehicleStatusCounts['Ativo'] || 0,
            vehicleStatusCounts['Em Manutenção'] || 0,
            vehicleStatusCounts['Inativo'] || 0,
            vehicleStatusCounts['Vendido'] || 0,
        ],
        backgroundColor: [
            'rgba(13, 148, 136, 0.8)', // Ativo - Teal
            'rgba(249, 115, 22, 0.8)',  // Em Manutenção - Orange
            'rgba(100, 116, 139, 0.8)', // Inativo - Slate
            'rgba(239, 68, 68, 0.8)'    // Vendido - Red (example)
        ],
        borderColor: '#ffffff',
        borderWidth: 4,
        hoverOffset: 8
    }]
  };

  // Prepare data for the OS Status Doughnut Chart
  const derivedOSStatusData: ChartData = {
    labels: SERVICE_ORDER_STATUSES as unknown as string[],
    datasets: [{
      data: SERVICE_ORDER_STATUSES.map(status => osStatusCounts[status] || 0),
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
          type: 'doughnut',
          data: derivedOSStatusData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: { color: '#475569', padding: 20, font: { size: 12 } }
              },
              title: {
                display: true,
                text: 'Distribuição de OS por Status',
                color: '#334155',
                font: { size: 16, weight: '600' as '600' }, // Added 'as any' for type compatibility
                padding: { top: 10, bottom: 20 }
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

  return (
    <section id="dashboard-section" className="page-section">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI_Card title="Frota Total" value={totalVehicles} bgColorClass="bg-blue-500" />
        <KPI_Card title="Veículos Ativos" value={vehicleStatusCounts['Ativo'] || 0} bgColorClass="bg-teal-500" />
        <KPI_Card title="Em Manutenção" value={vehicleStatusCounts['Em Manutenção'] || 0} bgColorClass="bg-orange-500" />
        <KPI_Card title="OS Ativas" value={totalActiveServiceOrders} bgColorClass="bg-yellow-500" />
      </div>
      <div className="mt-8">
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Status da Frota</h3>
          <div className="chart-container">
            <canvas ref={chartRef} id="statusChart"></canvas>
          </div>
        </div>
      </div>

      {/* Service Order Status Summary Section */}
      <div className="mt-8 bg-white p-6 border border-slate-200/80 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Ordens de Serviço por Status</h3>
        {/* Remove or comment out the existing grid display for osStatusCounts */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4"> ... </div> */}

        {/* Add new chart section */}
        <div className="chart-container mt-4"> {/* Add margin if needed */}
          <canvas ref={osChartRef} id="osStatusChart"></canvas> {/* Give it a unique ID and assign ref */}
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
