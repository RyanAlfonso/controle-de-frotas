import React, { useEffect, useRef } from 'react';
import { ChartData } from '../types'; // Assuming types are defined

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
  totalVehicles: number;
  activeVehicles: number;
  maintenanceVehicles: number;
  pendingOS: number;
  // fleetStatusData: ChartData; // This can be derived or passed
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  totalVehicles,
  activeVehicles,
  maintenanceVehicles,
  pendingOS,
  // fleetStatusData // This would be used if passed directly
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  // Example: Derive fleetStatusData from props or internal state if not passed directly
  // This is a simplified version based on the counts passed
  const derivedFleetStatusData: ChartData = {
    labels: ['Ativos', 'Em Manutenção', 'Outros (Total - Ativos - Manut.)'],
    datasets: [{
        data: [
            activeVehicles,
            maintenanceVehicles,
            Math.max(0, totalVehicles - activeVehicles - maintenanceVehicles) // Ensure non-negative
        ],
        backgroundColor: ['rgba(13, 148, 136, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(100, 116, 139, 0.8)'],
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

  return (
    <section id="dashboard-section" className="page-section">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI_Card title="Frota Total" value={totalVehicles} bgColorClass="bg-blue-500" />
        <KPI_Card title="Veículos Ativos" value={activeVehicles} bgColorClass="bg-teal-500" />
        <KPI_Card title="Em Manutenção" value={maintenanceVehicles} bgColorClass="bg-orange-500" />
        <KPI_Card title="OS Pendentes" value={pendingOS} bgColorClass="bg-yellow-500" />
      </div>
      <div className="mt-8">
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Status da Frota</h3>
          <div className="chart-container">
            <canvas ref={chartRef} id="statusChart"></canvas>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
