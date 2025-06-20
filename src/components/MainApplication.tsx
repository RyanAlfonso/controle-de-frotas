import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardSection from './DashboardSection';
import VehiclesSection from './VehiclesSection';
import UsersSection from './UsersSection';
import SuppliersSection from './SuppliersSection';
import ServiceOrdersSection from './ServiceOrdersSection'; // Import ServiceOrdersSection
import { Vehicle, User, VehicleStatus, Supplier, SupplierStatus, ServiceOrder } from '../types';

interface MainApplicationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  pageTitle: string;
  onLogout: () => void;

  // Data props
  vehicles: Vehicle[]; // Already present, ensure it's passed for OS modal
  users: User[];
  suppliers: Supplier[];
  serviceOrders: ServiceOrder[]; // Add serviceOrders prop
  pendingOSCount: number;

  // Modal control props
  onOpenVehicleModal: () => void;
  onOpenUserModal: () => void;
  onOpenSupplierModal: () => void;
  onOpenEditSupplierModal: (supplier: Supplier) => void;
  onOpenAddServiceOrderModal: () => void;
  onOpenAddOSBudgetModal: (serviceOrderId: string) => void;
  onOpenViewOSBudgetsModal: (serviceOrder: ServiceOrder) => void;
  onStartOSExecution: (serviceOrderId: string) => void;
  onOpenCompleteOSModal: (serviceOrderId: string) => void; // Added new prop
  onEditVehicle: (updatedVehicleData: Vehicle) => void;
  onSetVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;
  onSetSupplierStatus: (supplierId: string, status: SupplierStatus) => void;
}

const MainApplication: React.FC<MainApplicationProps> = ({
  activeSection,
  setActiveSection,
  pageTitle,
  onLogout,
  vehicles,
  users,
  suppliers,
  serviceOrders, // Destructure serviceOrders
  pendingOSCount,
  onOpenVehicleModal,
  onOpenUserModal,
  onOpenSupplierModal,
  onOpenEditSupplierModal,
  onOpenAddServiceOrderModal,
  onOpenAddOSBudgetModal,
  onOpenViewOSBudgetsModal,
  onStartOSExecution,
  onOpenCompleteOSModal, // Destructure new prop
  onEditVehicle,
  onSetVehicleStatus,
  onSetSupplierStatus
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
            onEditVehicle={onEditVehicle}
            onSetVehicleStatus={onSetVehicleStatus} // Pass it down
            // onFilterChange will be added
          />
        );
      case 'suppliers': // Add case for suppliers
        return (
          <SuppliersSection
            suppliers={suppliers}
            onOpenAddSupplierModal={onOpenSupplierModal}
            onOpenEditSupplierModal={onOpenEditSupplierModal}
            onSetSupplierStatus={onSetSupplierStatus}
          />
        );
      case 'serviceOrders': // Add case for service orders
        return (
          // <ServiceOrdersSection
          //   serviceOrders={serviceOrders}
          //   vehicles={vehicles}
          <ServiceOrdersSection
            serviceOrders={serviceOrders}
            vehicles={vehicles}
            users={users}
            onOpenAddServiceOrderModal={onOpenAddServiceOrderModal}
            onOpenAddOSBudgetModal={onOpenAddOSBudgetModal}
            onOpenViewOSBudgetsModal={onOpenViewOSBudgetsModal}
            onStartOSExecution={onStartOSExecution}
            onOpenCompleteOSModal={onOpenCompleteOSModal} // Pass new prop
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
