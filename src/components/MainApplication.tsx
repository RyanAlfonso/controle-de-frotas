import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardSection from './DashboardSection';
import VehiclesSection from './VehiclesSection';
import UsersSection from './UsersSection';
import { Vehicle, User } from '../types'; // Assuming types.ts is populated

interface MainApplicationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  pageTitle: string;
  onLogout: () => void;

  // Data props
  vehicles: Vehicle[];
  users: User[];
  pendingOSCount: number;

  // Modal control props
  onOpenVehicleModal: () => void;
  onOpenUserModal: () => void;
  onEditVehicle: (updatedVehicleData: Vehicle) => void; // Add new prop for editing
}

const MainApplication: React.FC<MainApplicationProps> = ({
  activeSection,
  setActiveSection,
  pageTitle,
  onLogout,
  vehicles,
  users,
  pendingOSCount,
  onOpenVehicleModal,
  onOpenUserModal,
  onEditVehicle // Destructure the new prop
}) => {

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardSection
            totalVehicles={vehicles.length}
            activeVehicles={vehicles.filter(v => v.status === 'Ativo').length}
            maintenanceVehicles={vehicles.filter(v => v.status === 'Em Manutenção').length}
            pendingOS={pendingOSCount}
            // fleetStatusData will be derived or passed if more complex
          />
        );
      case 'vehicles':
        return (
          <VehiclesSection
            vehicles={vehicles}
            onAddVehicle={onOpenVehicleModal}
            onEditVehicle={onEditVehicle} // Pass it down
            // onFilterChange will be added
          />
        );
      case 'users':
        return (
          <UsersSection
            users={users}
            onAddUser={onOpenUserModal}
          />
        );
      default:
        return <DashboardSection /* Default to dashboard or a placeholder */
            totalVehicles={vehicles.length}
            activeVehicles={vehicles.filter(v => v.status === 'Ativo').length}
            maintenanceVehicles={vehicles.filter(v => v.status === 'Em Manutenção').length}
            pendingOS={pendingOSCount}
        />;
    }
  };

  return (
    <div className="h-screen flex">
      <Sidebar
        onNavigate={setActiveSection}
        onLogout={onLogout}
        activeSection={activeSection}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pageTitle={pageTitle} />
        <main className="flex-1 p-6 overflow-y-auto bg-slate-100">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default MainApplication;
