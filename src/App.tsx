import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import MainApplication from './components/MainApplication';
import AddVehicleModal from './components/AddVehicleModal';
import AddUserModal from './components/AddUserModal';
import AddSupplierModal from './components/AddSupplierModal';
import EditSupplierModal from './components/EditSupplierModal';
import AddServiceOrderModal from './components/AddServiceOrderModal';
import AddOSBudgetModal from './components/AddOSBudgetModal';
import ViewOSBudgetsModal from './components/ViewOSBudgetsModal';
import CompleteOSModal from './components/CompleteOSModal';
import InvoiceOSModal from './components/InvoiceOSModal';
import RecordPaymentModal from './components/RecordPaymentModal'; // Import RecordPaymentModal
import {
  Vehicle, User, PendingOSItem, VehicleStatus, UserProfile, Supplier, SupplierStatus,
  ServiceOrder, ServiceOrderStatus, ServiceOrderBudget, MaintenanceHistoryItem, OSPayment, OSPaymentStatus // Import OSPayment types
} from './types';

// Initial Dummy Data (similar to original script)
const initialVehicles: Vehicle[] = [
    { id: 'v1', marca: 'Volkswagen', modelo: 'Gol', ano: 2022, cor: 'Branco', placa: 'RKT-1A23', renavam: '12345678901', chassi: '9BWZZZ377VT123456', status: 'Ativo', km: 15000, initialMileage: 100, maintenanceHistory: [], fuelingHistory: [] },
    { id: 'v2', marca: 'Fiat', modelo: 'Strada', ano: 2023, cor: 'Prata', placa: 'BRZ-2B34', renavam: '12345678902', chassi: '9BDZZZ377VT123457', status: 'Ativo', km: 8000, initialMileage: 0, maintenanceHistory: [], fuelingHistory: [] },
    { id: 'v3', marca: 'Chevrolet', modelo: 'Onix', ano: 2021, cor: 'Preto', placa: 'PBR-3C45', renavam: '12345678903', chassi: '9BGZZZ377VT123458', status: 'Em Manutenção', km: 32000, initialMileage: 15000, maintenanceHistory: [], fuelingHistory: [] },
    {
      id: 'v4',
      marca: 'Honda',
      modelo: 'Civic',
      ano: 2020,
      cor: 'Cinza Grafite',
      placa: 'XYZ-1D23',
      renavam: '23456789012',
      chassi: '8AHFB2F57L312345',
      status: 'Ativo',
      km: 45000,
      initialMileage: 500,
      maintenanceHistory: [
        { date: new Date(Date.now() - 86400000 * 180).toISOString(), type: 'Revisão', description: 'Revisão de 40.000km, troca de óleo e filtros.', cost: 750, supplier: 'Honda Serviços Avançados', os: 'os_m_v4_1' },
      ],
      fuelingHistory: [
        { id: 'fh1_v4', date: new Date(Date.now() - 86400000 * 25).toISOString(), fuelType: 'Gasolina Aditivada', liters: 40, pricePerLiter: 5.90, totalCost: 236.00, mileage: 44500, stationName: 'Posto Ipiranga Prime' },
        { id: 'fh2_v4', date: new Date(Date.now() - 86400000 * 10).toISOString(), fuelType: 'Gasolina Comum', liters: 38, pricePerLiter: 5.60, totalCost: 212.80, mileage: 44900, stationName: 'Posto Shell Select' },
      ]
    },
    {
      id: 'v5',
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2022,
      cor: 'Prata Metálico',
      placa: 'QWE-2E34',
      renavam: '34567890123',
      chassi: '7JTDX11R2N012345',
      status: 'Ativo',
      km: 22000,
      initialMileage: 150,
      maintenanceHistory: [],
      fuelingHistory: [
        { id: 'fh1_v5', date: new Date(Date.now() - 86400000 * 5).toISOString(), fuelType: 'Gasolina Comum', liters: 42, pricePerLiter: 5.55, totalCost: 233.10, mileage: 21500, stationName: 'Posto Petrobras Grid' },
      ]
    },
    {
      id: 'v6',
      marca: 'Ford',
      modelo: 'Ranger',
      ano: 2019,
      cor: 'Azul Belize',
      placa: 'RTY-3F45',
      renavam: '45678901234',
      chassi: '6MEFD2XG5K012345',
      status: 'Em Manutenção',
      km: 78000,
      initialMileage: 10000,
      maintenanceHistory: [
        { date: new Date(Date.now() - 86400000 * 30).toISOString(), type: 'Troca de Suspensão', description: 'Substituição dos amortecedores dianteiros.', cost: 1200, supplier: 'Oficina do Zé - Pesados', os: 'os_m_v6_1' },
      ],
      fuelingHistory: [
        { id: 'fh1_v6', date: new Date(Date.now() - 86400000 * 40).toISOString(), fuelType: 'Diesel S10', liters: 60, pricePerLiter: 6.00, totalCost: 360.00, mileage: 77500, stationName: 'Posto Agricola' },
      ]
    },
    {
      id: 'v7',
      marca: 'Hyundai',
      modelo: 'HB20',
      ano: 2023,
      cor: 'Vermelho Apple',
      placa: 'UIO-4G56',
      renavam: '56789012345',
      chassi: '5NMHCA1ABPH12345',
      status: 'Ativo',
      km: 5500,
      initialMileage: 50,
      maintenanceHistory: [],
      fuelingHistory: []
    },
    {
      id: 'v8',
      marca: 'Renault',
      modelo: 'Kwid',
      ano: 2021,
      cor: 'Laranja Ocre',
      placa: 'PAS-5H67',
      renavam: '67890123456',
      chassi: '4LVLBA1AAXM12345',
      status: 'Inativo',
      km: 33000,
      initialMileage: 200,
      maintenanceHistory: [],
      fuelingHistory: [
          { id: 'fh1_v8', date: new Date(Date.now() - 86400000 * 90).toISOString(), fuelType: 'Gasolina Comum', liters: 30, pricePerLiter: 5.20, totalCost: 156.00, mileage: 32500, stationName: 'Posto Esquina' },
      ]
    },
    {
      id: 'v9',
      marca: 'Jeep',
      modelo: 'Renegade',
      ano: 2022,
      cor: 'Verde Recon',
      placa: 'DFG-6J78',
      renavam: '78901234567',
      chassi: '3C4NJDBT1NT12345',
      status: 'Ativo',
      km: 28000,
      initialMileage: 300,
      maintenanceHistory: [
          { date: new Date(Date.now() - 86400000 * 60).toISOString(), type: 'Alinhamento e Balanceamento', description: 'Serviço realizado após troca de pneus.', cost: 250, supplier: 'Pneu Forte Centro Automotivo', os: 'os_m_v9_1' },
      ],
      fuelingHistory: [
          { id: 'fh1_v9', date: new Date(Date.now() - 86400000 * 10).toISOString(), fuelType: 'Gasolina Aditivada', liters: 45, pricePerLiter: 5.99, totalCost: 269.55, mileage: 27500, stationName: 'BR Mania' },
      ]
    }
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
    budgets: [],
    payments: [],
    // paymentStatus: 'Pendente' // Example if it was Faturada
  },
  {
    id: 'os_sample_2',
    vehicleId: 'v2',
    serviceType: 'Troca de Pneu',
    problemDescription: 'Pneu dianteiro direito furado. Necessita troca e verificação do estepe.',
    requestDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    requesterId: 'user_placeholder_id_456',
    status: 'Aguardando Aprovação',
    budgets: [],
    payments: []
  },
  {
    id: 'os_sample_3',
    vehicleId: 'v3', // Onix Em Manutenção
    serviceType: 'Reparo Elétrico',
    problemDescription: 'Sistema de som parou de funcionar e luzes do painel piscando.',
    requestDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    requesterId: 'u1', // Admin Master
    status: 'Aprovada - Aguardando Execução',
    budgets: [
      { id: 'bud_s3_1', supplierId: 'sup1', budgetValue: 450.00, estimatedDeadline: new Date(Date.now() + 86400000 * 2).toISOString(), budgetNotes: 'Diagnóstico e reparo do chicote.', isApproved: true }
    ],
    supplierId: 'sup1',
    cost: 450.00,
    payments: []
  },
  {
    id: 'os_sample_4',
    vehicleId: 'v4', // Civic Ativo
    serviceType: 'Funilaria e Pintura',
    problemDescription: 'Arranhão profundo na porta traseira direita e para-choque amassado.',
    requestDate: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    requesterId: 'u1',
    status: 'Em Andamento',
    budgets: [
      { id: 'bud_s4_1', supplierId: 'sup3', budgetValue: 1200.00, estimatedDeadline: new Date(Date.now() + 86400000 * 7).toISOString(), budgetNotes: 'Reparo e pintura da porta e para-choque.', isApproved: true }
    ],
    supplierId: 'sup3',
    cost: 1200.00,
    startDate: new Date(Date.now() - 86400000 * 2).toISOString(), // Started 2 days ago
    payments: []
  },
  {
    id: 'os_sample_5',
    vehicleId: 'v5', // Corolla Ativo
    serviceType: 'Troca de Pneus',
    problemDescription: 'Dois pneus dianteiros gastos, necessitando substituição e alinhamento.',
    requestDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    requesterId: 'u1',
    status: 'Concluída',
    budgets: [
      { id: 'bud_s5_1', supplierId: 'sup2', budgetValue: 850.00, estimatedDeadline: new Date(Date.now() - 86400000 * 1).toISOString(), budgetNotes: '2 pneus novos + alinhamento e balanceamento.', isApproved: true }
    ],
    supplierId: 'sup2',
    cost: 850.00,
    startDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    completionDate: new Date(Date.now() - 86400000 * 1).toISOString(), // Completed 1 day ago
    completionNotes: 'Serviço realizado conforme solicitado. Cliente satisfeito.',
    payments: []
  },
  {
    id: 'os_sample_6',
    vehicleId: 'v1', // Gol Ativo
    serviceType: 'Revisão Programada 20.000km',
    problemDescription: 'Revisão de rotina, troca de óleo, filtros e verificação de itens de segurança.',
    requestDate: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    requesterId: 'u1',
    status: 'Faturada',
    budgets: [
       { id: 'bud_s6_1', supplierId: 'sup1', budgetValue: 550.00, estimatedDeadline: new Date(Date.now() - 86400000 * 2).toISOString(), isApproved: true }
    ],
    supplierId: 'sup1',
    cost: 550.00,
    startDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    completionDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    invoiceNumber: 'NF-00123',
    invoiceDueDate: new Date(Date.now() + 86400000 * 28).toISOString(), // Due in 28 days
    finalValue: 550.00,
    paymentStatus: 'Pendente',
    payments: []
  },
  {
    id: 'os_sample_7',
    vehicleId: 'v6', // Ranger Em Manutenção
    serviceType: 'Manutenção Corretiva - Suspensão',
    problemDescription: 'Barulho excessivo na suspensão traseira e instabilidade.',
    requestDate: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
    requesterId: 'u1',
    status: 'Faturada',
    budgets: [
       { id: 'bud_s7_1', supplierId: 'sup1', budgetValue: 1350.00, estimatedDeadline: new Date(Date.now() - 86400000 * 5).toISOString(), isApproved: true }
    ],
    supplierId: 'sup1',
    cost: 1350.00,
    startDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    completionDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    invoiceNumber: 'NF-00124',
    invoiceDueDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    finalValue: 1350.00,
    paymentStatus: 'Pago',
    payments: [
        { id: 'pay_s7_1', paymentDate: new Date(Date.now() - 86400000 * 2).toISOString(), paidAmount: 1350.00, paymentMethod: 'PIX', notes: 'Pagamento integral via PIX.'}
    ]
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
  const [isViewOSBudgetsModalOpen, setIsViewOSBudgetsModalOpen] = useState(false);
  const [currentServiceOrderForViewingBudgets, setCurrentServiceOrderForViewingBudgets] = useState<ServiceOrder | null>(null);
  const [isCompleteOSModalOpen, setIsCompleteOSModalOpen] = useState(false);
  const [currentOSToComplete, setCurrentOSToComplete] = useState<ServiceOrder | null>(null);
  const [isInvoiceOSModalOpen, setIsInvoiceOSModalOpen] = useState(false);
  const [currentOSToInvoice, setCurrentOSToInvoice] = useState<ServiceOrder | null>(null);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false); // State for RecordPaymentModal
  const [currentOSToRecordPayment, setCurrentOSToRecordPayment] = useState<ServiceOrder | null>(null); // State for OS to record payment

  const titleMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'vehicles': 'Gerenciamento de Frota',
    'suppliers': 'Gerenciamento de Fornecedores',
    'serviceOrders': 'Gerenciamento de Ordens de Serviço',
    'financialReports': 'Relatórios Financeiros', // Added title for financial reports
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
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `v${vehicles.length + 1}`,
      ano: parseInt(vehicleData.ano),
      km: parseInt(vehicleData.km),
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
  };

  const handleSetVehicleStatus = (vehicleId: string, status: VehicleStatus) => {
    setVehicles(prevVehicles =>
      prevVehicles.map(vehicle =>
        vehicle.id === vehicleId ? { ...vehicle, status: status } : vehicle
      )
    );
  };

  const handleSaveUser = (userData: any) => {
    const newUser: User = {
      ...userData,
      id: `u${users.length + 1}`
    };
    setUsers(prev => [...prev, newUser]);
    setIsUserModalOpen(false);
  };

  const actualHandleAddSupplierLogic = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      id: `sup${suppliers.length + 1}`,
      ...supplierData,
      status: 'Ativo',
    };
    setSuppliers(prevSuppliers => [...prevSuppliers, newSupplier]);
    setIsSupplierModalOpen(false);
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
    handleCloseEditSupplierModal();
  };

  const handleSetSupplierStatus = (supplierId: string, status: SupplierStatus) => {
    setSuppliers(prevSuppliers =>
      prevSuppliers.map(supplier =>
        supplier.id === supplierId ? { ...supplier, status: status } : supplier
      )
    );
  };

  const handleAddServiceOrder = (
    orderData: Omit<ServiceOrder, 'id' | 'requestDate' | 'requesterId' | 'status' | 'budgets' | 'payments' | 'paymentStatus'>
  ) => {
    const newServiceOrder: ServiceOrder = {
      ...orderData,
      id: `os${serviceOrders.length + 1 + Math.random().toString(36).substring(2, 7)}`,
      requestDate: new Date().toISOString(),
      requesterId: 'user_placeholder_id_123',
      status: 'Pendente de Orçamento' as ServiceOrderStatus,
      budgets: [],
      payments: [],
    };
    setServiceOrders(prevServiceOrders => [...prevServiceOrders, newServiceOrder]);
    setIsAddServiceOrderModalOpen(false);
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
            id: `bud${(order.budgets?.length || 0) + 1}_${order.id.substring(0,4)}_${Math.random().toString(36).substring(2, 7)}`,
          };
          return {
            ...order,
            budgets: [...(order.budgets || []), newBudget],
          };
        }
        return order;
      })
    );
    handleCloseAddOSBudgetModal();
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
            return { ...budget, isApproved: false };
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
    handleCloseViewOSBudgetsModal();
  };

  const handleStartOSExecution = (serviceOrderId: string) => {
    setServiceOrders(prevServiceOrders =>
      prevServiceOrders.map(order => {
        if (order.id === serviceOrderId && order.status === 'Aprovada - Aguardando Execução') {
          return {
            ...order,
            status: 'Em Andamento' as ServiceOrderStatus,
            startDate: new Date().toISOString(),
          };
        }
        return order;
      })
    );
  };

  const handleOpenCompleteOSModal = (serviceOrderId: string) => {
    const orderToComplete = serviceOrders.find(os => os.id === serviceOrderId);
    if (orderToComplete) {
      setCurrentOSToComplete(orderToComplete);
      setIsCompleteOSModalOpen(true);
    } else {
      console.error("Service Order not found for completion:", serviceOrderId);
    }
  };

  const handleCloseCompleteOSModal = () => {
    setCurrentOSToComplete(null);
    setIsCompleteOSModalOpen(false);
  };

  const handleCompleteOS = (completionData: { completionDate: string; completionNotes?: string }) => {
    if (!currentOSToComplete) {
      console.error("Error: No service order selected for completion.");
      return;
    }

    const osId = currentOSToComplete.id;
    const vehicleId = currentOSToComplete.vehicleId;

    setServiceOrders(prevServiceOrders =>
      prevServiceOrders.map(order => {
        if (order.id === osId) {
          return {
            ...order,
            status: 'Concluída' as ServiceOrderStatus,
            completionDate: completionData.completionDate,
            completionNotes: completionData.completionNotes || order.completionNotes,
          };
        }
        return order;
      })
    );

    const supplierForHistory = suppliers.find(s => s.id === currentOSToComplete.supplierId);
    const supplierNameForHistory = supplierForHistory ? (supplierForHistory.nomeFantasia || supplierForHistory.nomeRazaoSocial) : 'Fornecedor não especificado';

    const newMaintenanceItem: MaintenanceHistoryItem = {
      date: completionData.completionDate,
      type: currentOSToComplete.serviceType,
      description: `OS Concluída: ${currentOSToComplete.problemDescription}${completionData.completionNotes ? ` - Obs. Conclusão: ${completionData.completionNotes}` : ''}`,
      cost: currentOSToComplete.cost || 0,
      supplier: supplierNameForHistory,
      os: osId,
    };

    setVehicles(prevVehicles =>
      prevVehicles.map(vehicle => {
        if (vehicle.id === vehicleId) {
          return {
            ...vehicle,
            maintenanceHistory: [...vehicle.maintenanceHistory, newMaintenanceItem],
          };
        }
        return vehicle;
      })
    );

    handleCloseCompleteOSModal();
  };

  const handleOpenInvoiceOSModal = (serviceOrderId: string) => {
    const orderToInvoice = serviceOrders.find(os => os.id === serviceOrderId);
    if (orderToInvoice) {
      setCurrentOSToInvoice(orderToInvoice);
      setIsInvoiceOSModalOpen(true);
    } else {
      console.error("Service Order not found for invoicing:", serviceOrderId);
    }
  };

  const handleCloseInvoiceOSModal = () => {
    setCurrentOSToInvoice(null);
    setIsInvoiceOSModalOpen(false);
  };

  const handleInvoiceOS = (invoiceData: {
    invoiceNumber: string;
    invoiceDueDate: string;
    finalValue: number;
    valueJustification?: string
  }) => {
    if (!currentOSToInvoice) {
      console.error("Error: No service order selected for invoicing.");
      return;
    }

    const osId = currentOSToInvoice.id;

    setServiceOrders(prevServiceOrders =>
      prevServiceOrders.map(order => {
        if (order.id === osId) {
          return {
            ...order,
            status: 'Faturada' as ServiceOrderStatus,
            invoiceNumber: invoiceData.invoiceNumber,
            invoiceDueDate: invoiceData.invoiceDueDate,
            finalValue: invoiceData.finalValue,
            valueJustification: invoiceData.valueJustification || order.valueJustification,
            payments: order.payments || [],
            paymentStatus: 'Pendente' as OSPaymentStatus,
          };
        }
        return order;
      })
    );
    handleCloseInvoiceOSModal();
  };

  const handleOpenRecordPaymentModal = (serviceOrderId: string) => {
    const orderToRecordPayment = serviceOrders.find(os => os.id === serviceOrderId);
    if (orderToRecordPayment) {
      setCurrentOSToRecordPayment(orderToRecordPayment);
      setIsRecordPaymentModalOpen(true);
    } else {
      console.error("Service Order not found for recording payment:", serviceOrderId);
    }
  };

  const handleCloseRecordPaymentModal = () => {
    setCurrentOSToRecordPayment(null);
    setIsRecordPaymentModalOpen(false);
  };

  const handleRecordPayment = (paymentData: Omit<OSPayment, 'id'>) => {
    if (!currentOSToRecordPayment) {
      console.error("Error: No service order selected for recording payment.");
      return;
    }

    const osId = currentOSToRecordPayment.id;

    setServiceOrders(prevServiceOrders =>
      prevServiceOrders.map(order => {
        if (order.id === osId) {
          const newPayment: OSPayment = {
            ...paymentData,
            id: `pay_${order.id.substring(0,4)}_${(order.payments?.length || 0) + 1}_${Math.random().toString(36).substring(2, 7)}`,
          };
          const updatedPayments = [...(order.payments || []), newPayment];
          const totalPaid = updatedPayments.reduce((sum, p) => sum + p.paidAmount, 0);

          let newPaymentStatus: OSPaymentStatus = 'Parcialmente Pago';
          if (totalPaid >= (order.finalValue || 0) - 0.001) {
            newPaymentStatus = 'Pago';
          } else if (totalPaid === 0) {
            newPaymentStatus = 'Pendente';
          }

          return {
            ...order,
            payments: updatedPayments,
            paymentStatus: newPaymentStatus,
          };
        }
        return order;
      })
    );
    handleCloseRecordPaymentModal();
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
        vehicles={vehicles}
        users={users}
        suppliers={suppliers}
        serviceOrders={serviceOrders}
        pendingOSCount={pendingOS.length}
        onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenSupplierModal={() => setIsSupplierModalOpen(true)}
        onOpenEditSupplierModal={handleOpenEditSupplierModal}
        onOpenAddServiceOrderModal={() => setIsAddServiceOrderModalOpen(true)}
        onOpenAddOSBudgetModal={handleOpenAddOSBudgetModal}
        onOpenViewOSBudgetsModal={handleOpenViewOSBudgetsModal}
        onStartOSExecution={handleStartOSExecution}
        onOpenCompleteOSModal={handleOpenCompleteOSModal}
        onOpenInvoiceOSModal={handleOpenInvoiceOSModal}
        onOpenRecordPaymentModal={handleOpenRecordPaymentModal}
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
      <CompleteOSModal
        isOpen={isCompleteOSModalOpen}
        onClose={handleCloseCompleteOSModal}
        onConfirmComplete={handleCompleteOS}
        serviceOrder={currentOSToComplete}
      />
      <InvoiceOSModal
        isOpen={isInvoiceOSModalOpen}
        onClose={handleCloseInvoiceOSModal}
        onConfirmInvoice={handleInvoiceOS}
        serviceOrder={currentOSToInvoice}
      />
      <RecordPaymentModal
        isOpen={isRecordPaymentModalOpen}
        onClose={handleCloseRecordPaymentModal}
        onSavePayment={handleRecordPayment}
        serviceOrder={currentOSToRecordPayment}
      />
    </>
  );
}

export default App;
