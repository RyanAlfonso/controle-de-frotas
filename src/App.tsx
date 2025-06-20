import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import MainApplication from './components/MainApplication';
import AddVehicleModal from './components/AddVehicleModal';
import AddUserModal from './components/AddUserModal';
import AddSupplierModal from './components/AddSupplierModal';
import EditSupplierModal from './components/EditSupplierModal';
import AddServiceOrderModal from './components/AddServiceOrderModal';
import AddOSBudgetModal from './components/AddOSBudgetModal';
import ViewOSBudgetsModal from './components/ViewOSBudgetsModal'; // Import ViewOSBudgetsModal
import {
  Vehicle, User, PendingOSItem, VehicleStatus, UserProfile, Supplier, SupplierStatus,
  ServiceOrder, ServiceOrderStatus, ServiceOrderBudget
} from './types';

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

const initialSuppliers: Supplier[] = [
  {
    id: 'sup1',
    nomeRazaoSocial: 'Oficina Mecânica AutoRápido Ltda.',
    nomeFantasia: 'AutoRápido Mecânica',
    cnpjCpf: '12.345.678/0001-99',
    tipoFornecedor: ['Oficina', 'Peças'],
    endereco: 'Rua das Palmeiras, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01000-000',
    telefone: '(11) 98765-4321',
    email: 'contato@autorapido.com.br',
    contatoPrincipal: 'Carlos Alberto',
    observacoes: 'Especialistas em motor e câmbio.',
    status: 'Ativo'
  },
  {
    id: 'sup2',
    nomeRazaoSocial: 'Borracharia Veloz Pneus EIRELI',
    nomeFantasia: 'Borracharia Veloz',
    cnpjCpf: '98.765.432/0001-11',
    tipoFornecedor: ['Borracharia'],
    endereco: 'Av. dos Pneus, 456',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    cep: '02000-000',
    telefone: '(21) 91234-5678',
    email: 'velozpneus@email.com',
    contatoPrincipal: 'Mariana Silva',
    observacoes: 'Atendimento 24 horas para emergências.',
    status: 'Ativo'
  },
  {
    id: 'sup3',
    nomeRazaoSocial: 'Peças e Acessórios Brasil Ltda.',
    nomeFantasia: 'Brasil Peças',
    cnpjCpf: '11.222.333/0001-44',
    tipoFornecedor: ['Peças', 'Outros'],
    endereco: 'Rodovia Principal, Km 789',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    cep: '03000-000',
    telefone: '(31) 99999-8888',
    email: 'vendas@brasilpecas.com.br',
    contatoPrincipal: 'Fernando Costa',
    observacoes: 'Amplo estoque de peças nacionais e importadas. Outros serviços: instalação de som.',
    status: 'Ativo'
  },
  {
    id: 'sup4',
    nomeRazaoSocial: 'Posto PetroSol Combustíveis SA',
    nomeFantasia: 'Posto PetroSol',
    cnpjCpf: '44.555.666/0001-77',
    tipoFornecedor: ['Abastecimento'],
    endereco: 'Rua da Gasolina, 789',
    cidade: 'Curitiba',
    estado: 'PR',
    cep: '04000-000',
    telefone: '(41) 98888-7777',
    email: 'gerencia@petrosol.com',
    contatoPrincipal: 'Ana Paula',
    observacoes: 'Combustível de alta qualidade e loja de conveniência.',
    status: 'Ativo'
  }
];

const initialServiceOrders: ServiceOrder[] = [
  {
    id: 'os_sample_1',
    vehicleId: 'v1',
    serviceType: 'Revisão Completa',
    problemDescription: 'Veículo com barulho estranho no motor e falha na aceleração. Realizar diagnóstico completo e orçamento.',
    requestDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    requesterId: 'user_placeholder_id_123',
    status: 'Pendente de Orçamento',
    budgets: []
  },
  {
    id: 'os_sample_2',
    vehicleId: 'v2',
    serviceType: 'Troca de Pneu',
    problemDescription: 'Pneu dianteiro direito furado. Necessita troca e verificação do estepe.',
    requestDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    requesterId: 'user_placeholder_id_456',
    status: 'Aguardando Aprovação',
    budgets: []
  }
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard'); // Default section after login
  const [pageTitle, setPageTitle] = useState('Dashboard');

  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [pendingOS, setPendingOS] = useState<PendingOSItem[]>(initialPendingOS); // This might be replaced by serviceOrders later
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(initialServiceOrders); // Add serviceOrders state

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isEditSupplierModalOpen, setIsEditSupplierModalOpen] = useState(false);
  const [currentEditingSupplier, setCurrentEditingSupplier] = useState<Supplier | null>(null);
  const [isAddServiceOrderModalOpen, setIsAddServiceOrderModalOpen] = useState(false);
  const [isAddOSBudgetModalOpen, setIsAddOSBudgetModalOpen] = useState(false);
  const [currentServiceOrderForBudgetingId, setCurrentServiceOrderForBudgetingId] = useState<string | null>(null);
  const [isViewOSBudgetsModalOpen, setIsViewOSBudgetsModalOpen] = useState(false); // State for ViewOSBudgetsModal
  const [currentServiceOrderForViewingBudgets, setCurrentServiceOrderForViewingBudgets] = useState<ServiceOrder | null>(null); // State for current OS for viewing budgets

  const titleMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'vehicles': 'Gerenciamento de Frota',
    'suppliers': 'Gerenciamento de Fornecedores',
    'serviceOrders': 'Gerenciamento de Ordens de Serviço', // Added title for service orders
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
      status: 'Ativo', // Ensure new suppliers default to 'Ativo'
    };
    setSuppliers(prevSuppliers => [...prevSuppliers, newSupplier]);
    setIsSupplierModalOpen(false); // Close modal on save
  };

  const handleOpenEditSupplierModal = (supplier: Supplier) => {
    setCurrentEditingSupplier(supplier);
    setIsEditSupplierModalOpen(true);
  };

  const handleCloseEditSupplierModal = () => {
    setCurrentEditingSupplier(null);
    setIsEditSupplierModalOpen(false);
  };

  const handleEditSupplier = (updatedSupplierData: Supplier) => {
    setSuppliers(prevSuppliers =>
      prevSuppliers.map(supplier =>
        supplier.id === updatedSupplierData.id ? updatedSupplierData : supplier
      )
    );
    handleCloseEditSupplierModal(); // Close the modal after saving
  };

  const handleSetSupplierStatus = (supplierId: string, status: SupplierStatus) => {
    setSuppliers(prevSuppliers =>
      prevSuppliers.map(supplier =>
        supplier.id === supplierId ? { ...supplier, status: status } : supplier
      )
    );
  };

  const handleAddServiceOrder = (
    orderData: Omit<ServiceOrder, 'id' | 'requestDate' | 'requesterId' | 'status' | 'budgets'>
  ) => {
    const newServiceOrder: ServiceOrder = {
      ...orderData,
      id: `os${serviceOrders.length + 1 + Math.random().toString(36).substring(2, 7)}`,
      requestDate: new Date().toISOString(),
      requesterId: 'user_placeholder_id_123',
      status: 'Pendente de Orçamento' as ServiceOrderStatus,
      budgets: [], // Explicitly initialize with empty array
    };
    setServiceOrders(prevServiceOrders => [...prevServiceOrders, newServiceOrder]);
    setIsAddServiceOrderModalOpen(false); // Close modal on save
  };

  const handleOpenAddOSBudgetModal = (serviceOrderId: string) => {
    setCurrentServiceOrderForBudgetingId(serviceOrderId);
    setIsAddOSBudgetModalOpen(true);
  };

  const handleCloseAddOSBudgetModal = () => {
    setCurrentServiceOrderForBudgetingId(null);
    setIsAddOSBudgetModalOpen(false);
  };

  const handleAddOSBudget = (budgetData: Omit<ServiceOrderBudget, 'id'>) => {
    if (!currentServiceOrderForBudgetingId) {
      console.error("Error: No service order selected for adding budget.");
      return;
    }

    setServiceOrders(prevServiceOrders =>
      prevServiceOrders.map(order => {
        if (order.id === currentServiceOrderForBudgetingId) {
          const newBudget: ServiceOrderBudget = {
            ...budgetData,
            id: `bud${(order.budgets?.length || 0) + 1}_${order.id.substring(0,4)}_${Math.random().toString(36).substring(2, 7)}`, // Unique budget ID
          };
          return {
            ...order,
            budgets: [...(order.budgets || []), newBudget],
          };
        }
        return order;
      })
    );
    handleCloseAddOSBudgetModal(); // Close the modal after saving
  };

  const handleOpenViewOSBudgetsModal = (serviceOrder: ServiceOrder) => {
    setCurrentServiceOrderForViewingBudgets(serviceOrder);
    setIsViewOSBudgetsModalOpen(true);
  };

  const handleCloseViewOSBudgetsModal = () => {
    setCurrentServiceOrderForViewingBudgets(null);
    setIsViewOSBudgetsModalOpen(false);
  };

  const handleApproveOSBudget = (budgetId: string) => {
    if (!currentServiceOrderForViewingBudgets) {
      console.error("Error: No service order context for approving budget.");
      return;
    }

    const osId = currentServiceOrderForViewingBudgets.id;
    let approvedSupplierId: string | undefined = undefined;
    let approvedBudgetValue: number | undefined = undefined;

    setServiceOrders(prevServiceOrders =>
      prevServiceOrders.map(order => {
        if (order.id === osId) {
          const updatedBudgets = order.budgets?.map(budget => {
            if (budget.id === budgetId) {
              approvedSupplierId = budget.supplierId;
              approvedBudgetValue = budget.budgetValue;
              return { ...budget, isApproved: true };
            }
            return { ...budget, isApproved: false }; // Ensure others are not approved
          });
          return {
            ...order,
            budgets: updatedBudgets || [],
            status: 'Aprovada - Aguardando Execução' as ServiceOrderStatus,
            supplierId: approvedSupplierId || order.supplierId,
            cost: approvedBudgetValue || order.cost,
          };
        }
        return order;
      })
    );
    handleCloseViewOSBudgetsModal(); // Close the modal after approval
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
        vehicles={vehicles} // Pass vehicles for AddServiceOrderModal
        users={users}
        suppliers={suppliers}
        serviceOrders={serviceOrders} // Pass serviceOrders
        pendingOSCount={pendingOS.length} // This might be derived from serviceOrders later
        onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenSupplierModal={() => setIsSupplierModalOpen(true)}
        onOpenEditSupplierModal={handleOpenEditSupplierModal}
        onOpenAddServiceOrderModal={() => setIsAddServiceOrderModalOpen(true)}
        onOpenAddOSBudgetModal={handleOpenAddOSBudgetModal}
        onOpenViewOSBudgetsModal={handleOpenViewOSBudgetsModal} // Updated prop
        onEditVehicle={handleEditVehicle}
        onSetVehicleStatus={handleSetVehicleStatus}
        onSetSupplierStatus={handleSetSupplierStatus}
      />
      <AddServiceOrderModal
        isOpen={isAddServiceOrderModalOpen}
        onClose={() => setIsAddServiceOrderModalOpen(false)}
        onSave={handleAddServiceOrder}
        vehicles={vehicles}
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
      <EditSupplierModal
        isOpen={isEditSupplierModalOpen}
        onClose={handleCloseEditSupplierModal}
        onSave={handleEditSupplier}
        supplierToEdit={currentEditingSupplier}
      />
      <AddOSBudgetModal
        isOpen={isAddOSBudgetModalOpen}
        onClose={handleCloseAddOSBudgetModal}
        onSave={handleAddOSBudget}
        suppliers={suppliers}
      />
      <ViewOSBudgetsModal
        isOpen={isViewOSBudgetsModalOpen}
        onClose={handleCloseViewOSBudgetsModal}
        serviceOrder={currentServiceOrderForViewingBudgets}
        onApproveBudget={handleApproveOSBudget}
        suppliers={suppliers}
        vehicles={vehicles}
      />
    </>
  );
}

export default App;
