import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardSection from './DashboardSection';
import VehiclesSection from './VehiclesSection';
import UsersSection from './UsersSection';
import SuppliersSection from './SuppliersSection';
import ServiceOrdersSection from './ServiceOrdersSection';
import FinancialReportsSection from './FinancialReportsSection';
import { Vehicle, User, VehicleStatus, Supplier, SupplierStatus, ServiceOrder } from '../types';

interface MainApplicationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  pageTitle: string;
  onLogout: () => void;
  vehicles: Vehicle[];
  users: User[];
  suppliers: Supplier[];
  serviceOrders: ServiceOrder[];
  pendingOSCount: number;
  onOpenVehicleModal: () => void;
  onOpenUserModal: () => void;
  onOpenSupplierModal: () => void;
  onOpenEditSupplierModal: (supplier: Supplier) => void;
  onOpenAddServiceOrderModal: () => void;
  onOpenAddOSBudgetModal: (serviceOrderId: string) => void;
  onOpenViewOSBudgetsModal: (serviceOrder: ServiceOrder) => void;
  onStartOSExecution: (serviceOrderId: string) => void;
  onOpenCompleteOSModal: (serviceOrderId: string) => void;
  onOpenInvoiceOSModal: (serviceOrderId: string) => void;
  onOpenRecordPaymentModal: (serviceOrderId: string) => void;
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
  serviceOrders,
  pendingOSCount,
  onOpenVehicleModal,
  onOpenUserModal,
  onOpenSupplierModal,
  onOpenEditSupplierModal,
  onOpenAddServiceOrderModal,
  onOpenAddOSBudgetModal,
  onOpenViewOSBudgetsModal,
  onStartOSExecution,
  onOpenCompleteOSModal,
  onOpenInvoiceOSModal,
  onOpenRecordPaymentModal,
  onEditVehicle,
  onSetVehicleStatus,
  onSetSupplierStatus
}) => {

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardSection
            vehicles={vehicles}
            serviceOrders={serviceOrders}
            suppliers={suppliers}
          />
        );
      case 'vehicles':
        return (
          <VehiclesSection
            vehicles={vehicles}
            onAddVehicle={onOpenVehicleModal}
            onEditVehicle={onEditVehicle}
            onSetVehicleStatus={onSetVehicleStatus}
          />
        );
      case 'suppliers':
        return (
          <SuppliersSection
            suppliers={suppliers}
            onOpenAddSupplierModal={onOpenSupplierModal}
            onOpenEditSupplierModal={onOpenEditSupplierModal}
            onSetSupplierStatus={onSetSupplierStatus}
          />
        );
      case 'serviceOrders':
        return (
          <ServiceOrdersSection
            serviceOrders={serviceOrders}
            vehicles={vehicles}
            users={users}
            suppliers={suppliers}
            onOpenAddServiceOrderModal={onOpenAddServiceOrderModal}
            onOpenAddOSBudgetModal={onOpenAddOSBudgetModal}
            onOpenViewOSBudgetsModal={onOpenViewOSBudgetsModal}
            onStartOSExecution={onStartOSExecution}
            onOpenCompleteOSModal={onOpenCompleteOSModal}
            onOpenInvoiceOSModal={onOpenInvoiceOSModal}
            onOpenRecordPaymentModal={onOpenRecordPaymentModal}
          />
        );
      case 'financialReports':
        return (
          <FinancialReportsSection
            serviceOrders={serviceOrders}
            vehicles={vehicles}
            suppliers={suppliers}
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
        return <DashboardSection
            vehicles={vehicles}
            serviceOrders={serviceOrders}
            suppliers={suppliers}
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
        <Header
          pageTitle={pageTitle}
          onLogout={onLogout}
        />
        <main className="flex-1 p-6 overflow-y-auto bg-slate-100 transition-colors duration-150">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default MainApplication;
