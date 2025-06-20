import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import MainApplication from './components/MainApplication';
import AddVehicleModal from './components/AddVehicleModal';
import AddUserModal from './components/AddUserModal';
import AddSupplierModal from './components/AddSupplierModal'; // Import AddSupplierModal
import { Vehicle, User, PendingOSItem, VehicleStatus, UserProfile, Supplier } from './types';

// Placeholder for Chart.js type, if not globally declared elsewhere accessible
// declare var Chart: any;

// Initial Dummy Data (similar to original script)
const initialVehicles: Vehicle[] = [
    { id: 'v1', marca: 'Volkswagen', modelo: 'Gol', ano: 2022, cor: 'Branco', placa: 'RKT-1A23', renavam: '12345678901', chassi: '9BWZZZ377VT123456', status: 'Ativo', km: 15000, maintenanceHistory: [], fuelingHistory: [] },
    { id: 'v2', marca: 'Fiat', modelo: 'Strada', ano: 2023, cor: 'Prata', placa: 'BRZ-2B34', renavam: '12345678902', chassi: '9BDZZZ377VT123457', status: 'Ativo', km: 8000, maintenanceHistory: [], fuelingHistory: [] },
    { id: 'v3', marca: 'Chevrolet', modelo: 'Onix', ano: 2021, cor: 'Preto', placa: 'PBR-3C45', renavam: '12345678903', chassi: '9BGZZZ377VT123458', status: 'Em Manutenção', km: 32000, maintenanceHistory: [], fuelingHistory: [] },
];

const initialUsers: User[] = [
    { id: 'u1', nome: 'Admin Master', email: 'master@dcsys.com.br', perfil: 'Master' }
];

const initialPendingOS: PendingOSItem[] = [
    { id: 'os1', tipo: 'Mecânica', status: 'Aguardando Orçamento'},
    { id: 'os2', tipo: 'Elétrica', status: 'Aguardando Aprovação'},
];


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard'); // Default section after login
  const [pageTitle, setPageTitle] = useState('Dashboard');

  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [pendingOS, setPendingOS] = useState<PendingOSItem[]>(initialPendingOS);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]); // Add suppliers state

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false); // State for supplier modal

  const titleMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'vehicles': 'Gerenciamento de Frota',
    'suppliers': 'Gerenciamento de Fornecedores', // Added title for suppliers
    'users': 'Gerenciamento de Usuários'
  };

  useEffect(() => {
    setPageTitle(titleMap[activeSection] || 'Dashboard');
  }, [activeSection]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setActiveSection('dashboard'); // Reset to dashboard on login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  const handleSaveVehicle = (vehicleData: any) => {
    // Type assertion for vehicleData, or ensure AddVehicleModal returns strongly typed data
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `v${vehicles.length + 1}`, // Simple ID generation
      ano: parseInt(vehicleData.ano), // Ensure year is number
      km: parseInt(vehicleData.km),   // Ensure km is number
      maintenanceHistory: [],
      fuelingHistory: []
    };
    setVehicles(prev => [...prev, newVehicle]);
    setIsVehicleModalOpen(false);
  };

  const handleEditVehicle = (updatedVehicleData: Vehicle) => {
    setVehicles(prevVehicles =>
      prevVehicles.map(vehicle =>
        vehicle.id === updatedVehicleData.id ? { ...vehicle, ...updatedVehicleData } : vehicle
      )
    );
    // No modal to close here as EditVehicleModal has its own close mechanism
  };

  const handleSetVehicleStatus = (vehicleId: string, status: VehicleStatus) => {
    setVehicles(prevVehicles =>
      prevVehicles.map(vehicle =>
        vehicle.id === vehicleId ? { ...vehicle, status: status } : vehicle
      )
    );
  };

  const handleSaveUser = (userData: any) => {
    // Type assertion for userData
    const newUser: User = {
      ...userData,
      id: `u${users.length + 1}` // Simple ID generation
    };
    setUsers(prev => [...prev, newUser]);
    setIsUserModalOpen(false);
  };

  const actualHandleAddSupplierLogic = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      id: `sup${suppliers.length + 1}`, // Simple ID generation
      ...supplierData,
    };
    setSuppliers(prevSuppliers => [...prevSuppliers, newSupplier]);
    setIsSupplierModalOpen(false); // Close modal on save
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      <MainApplication
        activeSection={activeSection}
        setActiveSection={handleNavigate}
        pageTitle={pageTitle}
        onLogout={handleLogout}
        // Pass data and modal controls down
        vehicles={vehicles}
        users={users}
        suppliers={suppliers} // Pass suppliers state
        pendingOSCount={pendingOS.length}
        onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenSupplierModal={() => setIsSupplierModalOpen(true)} // Pass handler to open modal
        onEditVehicle={handleEditVehicle}
        onSetVehicleStatus={handleSetVehicleStatus}
      />
      <AddSupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        onSave={actualHandleAddSupplierLogic}
      />
      <AddVehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSave={handleSaveVehicle}
      />
      <AddUserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
      />
    </>
  );
}

export default App;
