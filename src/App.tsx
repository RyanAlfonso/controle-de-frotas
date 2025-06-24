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

// Define Theme type - REMOVING
// type Theme = 'light' | 'dark';

// Placeholder for Chart.js type, if not globally declared elsewhere accessible
// declare var Chart: any;

// Initial Dummy Data (similar to original script)
const initialVehicles: Vehicle[] = [
    {
      id: 'v1', marca: 'Volkswagen', modelo: 'Gol', ano: 2022, cor: 'Branco', placa: 'RKT-1A23', renavam: '12345678901', chassi: '9BWZZZ377VT123456', status: 'Ativo', km: 15000, initialMileage: 100, maintenanceHistory: [],
      fuelingHistory: [
        { id: 'fh1_v1', date: new Date(Date.now() - 86400000 * 30).toISOString(), fuelType: 'Gasolina Comum', liters: 30, pricePerLiter: 5.50, totalCost: 165.00, mileage: 13500, stationName: 'Posto Central' },
        { id: 'fh2_v1', date: new Date(Date.now() - 86400000 * 15).toISOString(), fuelType: 'Etanol', liters: 35, pricePerLiter: 4.20, totalCost: 147.00, mileage: 14200, stationName: 'Posto PetroSol' },
        { id: 'fh3_v1', date: new Date(Date.now() - 86400000 * 2).toISOString(), fuelType: 'Gasolina Aditivada', liters: 32, pricePerLiter: 5.80, totalCost: 185.60, mileage: 14850, stationName: 'Posto Shell Star' }
      ]
    },
    {
      id: 'v2', marca: 'Fiat', modelo: 'Strada', ano: 2023, cor: 'Prata', placa: 'BRZ-2B34', renavam: '12345678902', chassi: '9BDZZZ377VT123457', status: 'Ativo', km: 8000, initialMileage: 0, maintenanceHistory: [],
      fuelingHistory: [
        { id: 'fh1_v2', date: new Date(Date.now() - 86400000 * 20).toISOString(), fuelType: 'Diesel S10', liters: 50, pricePerLiter: 6.10, totalCost: 305.00, mileage: 6500, stationName: 'Posto RodoRede' },
        { id: 'fh2_v2', date: new Date(Date.now() - 86400000 * 5).toISOString(), fuelType: 'Diesel S10', liters: 55, pricePerLiter: 6.15, totalCost: 338.25, mileage: 7300, stationName: 'Posto PetroSol' }
      ]
    },
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
  },
  {
    id: 'sup5',
    nomeRazaoSocial: 'Lanternagem & Pintura Express Ltda',
    nomeFantasia: 'LP Express',
    cnpjCpf: '55.666.777/0001-00',
    tipoFornecedor: ['Lanternagem', 'Oficina'],
    endereco: 'Rua da Funilaria, 789',
    cidade: 'Porto Alegre',
    estado: 'RS',
    cep: '90000-000',
    telefone: '(51) 97654-3210',
    email: 'contato@lpexpress.com.br',
    contatoPrincipal: 'Ricardo Mendes',
    observacoes: 'Serviços rápidos de lanternagem e pintura automotiva.',
    status: 'Ativo'
  },
  {
    id: 'sup6',
    nomeRazaoSocial: 'Auto Elétrica Voltagem Certa ME',
    nomeFantasia: 'Voltagem Certa',
    cnpjCpf: '66.777.888/0001-22',
    tipoFornecedor: ['Oficina', 'Outros'], // 'Outros' for specialized electrical
    endereco: 'Av. dos Alternadores, 101',
    cidade: 'Salvador',
    estado: 'BA',
    cep: '40000-000',
    telefone: '(71) 96543-2109',
    email: 'atendimento@voltagemcerta.com',
    contatoPrincipal: 'Juliana Paes',
    observacoes: 'Especializada em parte elétrica e ar condicionado. Venda de baterias.',
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
    vehicleId: 'v3', // Assuming v3 exists
    serviceType: 'Lanternagem Porta Direita',
    problemDescription: 'Amassado na porta dianteira direita e risco no para-lama.',
    requestDate: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    requesterId: 'user_placeholder_id_123',
    status: 'Faturada',
    budgets: [{ id: 'bud1_os3', supplierId: 'sup5', budgetValue: 750.00, estimatedDeadline: '3 dias', budgetNotes: 'Pintura inclusa', isApproved: true }],
    supplierId: 'sup5', // From approved budget
    cost: 750.00,      // From approved budget
    finalValue: 750.00, // Assuming same as budget
    approvalDate: new Date(Date.now() - 86400000 * 8).toISOString(),
    startDate: new Date(Date.now() - 86400000 * 7).toISOString(),
    completionDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    completionNotes: 'Serviço finalizado, pintura ficou ótima.',
    invoiceNumber: 'NF-00123',
    invoiceDueDate: new Date(Date.now() + 86400000 * 25).toISOString(), // Due in 25 days
    payments: [
      { id: 'pay1_os3', paymentDate: new Date(Date.now() - 86400000 * 2).toISOString(), paidAmount: 750.00, paymentMethod: 'PIX', notes: 'Pagamento integral via PIX.' }
    ],
    paymentStatus: 'Pago'
  },
  {
    id: 'os_sample_4',
    vehicleId: 'v1',
    serviceType: 'Problema Elétrico - Farol',
    problemDescription: 'Farol baixo esquerdo não acende. Verificar fiação e lâmpada.',
    requestDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    requesterId: 'user_placeholder_id_456',
    status: 'Aprovada - Aguardando Execução',
    budgets: [
      { id: 'bud1_os4', supplierId: 'sup6', budgetValue: 120.00, estimatedDeadline: '2 horas', isApproved: true },
      { id: 'bud2_os4', supplierId: 'sup1', budgetValue: 150.00, estimatedDeadline: '3 horas', isApproved: false }
    ],
    supplierId: 'sup6', // From approved budget
    cost: 120.00,      // From approved budget
    approvalDate: new Date(Date.now() - 86400000 * 3).toISOString()
    // payments and paymentStatus will be undefined or default
  },
  {
    id: 'os_sample_5',
    vehicleId: 'v2',
    serviceType: 'Manutenção Preventiva',
    problemDescription: 'Revisão dos 20.000km conforme manual.',
    requestDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    requesterId: 'user_placeholder_id_123',
    status: 'Pendente de Orçamento',
    budgets: [],
    payments: [],
  },
  {
    id: 'os_sample_6_faturada_pendente',
    vehicleId: 'v2',
    serviceType: 'Alinhamento e Balanceamento',
    problemDescription: 'Veículo puxando para a direita.',
    requestDate: new Date(Date.now() - 86400000 * 12).toISOString(),
    requesterId: 'user_placeholder_id_456',
    status: 'Faturada', // Directly Faturada
    budgets: [{ id: 'bud1_os6', supplierId: 'sup2', budgetValue: 250.00, estimatedDeadline: '1 dia', isApproved: true }],
    supplierId: 'sup2',
    cost: 250.00,
    finalValue: 250.00,
    approvalDate: new Date(Date.now() - 86400000 * 11).toISOString(),
    startDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    completionDate: new Date(Date.now() - 86400000 * 9).toISOString(),
    invoiceNumber: 'NF-00456',
    invoiceDueDate: new Date(Date.now() + 86400000 * 20).toISOString(),
    payments: [], // No payments made yet
    paymentStatus: 'Pendente' as OSPaymentStatus // Explicitly Pendente
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

  // Theme state and logic REMOVED
  // const [theme, setTheme] = useState<Theme>(() => {
  //   const storedTheme = localStorage.getItem('theme') as Theme | null;
  //   if (storedTheme === 'light' || storedTheme === 'dark') {
  //     return storedTheme;
  //   }
  //   // Optional: Check system preference
  //   // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  //   //   return 'dark';
  //   // }
  //   return 'light'; // Default theme
  // });

  // Effect to apply theme class and update localStorage - REMOVED
  // useEffect(() => {
  //   const root = document.documentElement; // <html> tag
  //   if (theme === 'dark') {
  //     root.classList.add('dark');
  //   } else {
  //     root.classList.remove('dark');
  //   }
  //   localStorage.setItem('theme', theme);
  // }, [theme]);

  // Toggle theme function - REMOVED
  // const toggleTheme = () => {
  //   setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  // };

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
    orderData: Omit<ServiceOrder, 'id' | 'requestDate' | 'requesterId' | 'status' | 'budgets' | 'payments' | 'paymentStatus'>
  ) => {
    const newServiceOrder: ServiceOrder = {
      ...orderData,
      id: `os${serviceOrders.length + 1 + Math.random().toString(36).substring(2, 7)}`,
      requestDate: new Date().toISOString(),
      requesterId: 'user_placeholder_id_123',
      status: 'Pendente de Orçamento' as ServiceOrderStatus,
      budgets: [],
      payments: [], // Initialize with empty array
      // paymentStatus will be undefined initially
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

  const handleStartOSExecution = (serviceOrderId: string) => {
    setServiceOrders(prevServiceOrders =>
      prevServiceOrders.map(order => {
        if (order.id === serviceOrderId && order.status === 'Aprovada - Aguardando Execução') {
          return {
            ...order,
            status: 'Em Andamento' as ServiceOrderStatus, // Corrected to use existing status "Em Andamento"
            startDate: new Date().toISOString(), // Set current date as execution start date
          };
        }
        return order;
      })
    );
    // No modal to close for this direct action
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

    // Update Service Order
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

    // Generate and Add Maintenance History Item to the Vehicle
    const supplierForHistory = suppliers.find(s => s.id === currentOSToComplete.supplierId);
    const supplierNameForHistory = supplierForHistory ? (supplierForHistory.nomeFantasia || supplierForHistory.nomeRazaoSocial) : 'Fornecedor não especificado';

    const newMaintenanceItem: MaintenanceHistoryItem = {
      // id will be generated if needed by a backend or a more robust local ID strategy
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

    handleCloseCompleteOSModal(); // Close the modal
  };

  const handleOpenInvoiceOSModalPlaceholder = (serviceOrderId: string) => {
    console.log("Request to open Invoice OS Modal for OS ID:", serviceOrderId);
    // Actual state and modal opening logic will be implemented in a later step
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
          // Ensure payments array exists and set initial payment status
          const existingPayments = order.payments || [];
          let paymentStatusOnInvoice: OSPaymentStatus = 'Pendente';

          // This logic is more for handleRecordPayment, but if an OS could somehow be Faturada
          // with pre-existing payments (e.g. an advance payment before invoicing), this would catch it.
          // For a standard flow, Faturada implies no payments have been made against this invoice yet.
          if (existingPayments.length > 0) {
            const totalPaid = existingPayments.reduce((sum, p) => sum + p.paidAmount, 0);
            if (totalPaid >= (invoiceData.finalValue || 0) - 0.001) {
              paymentStatusOnInvoice = 'Pago';
            } else {
              paymentStatusOnInvoice = 'Parcialmente Pago';
            }
          }

          return {
            ...order,
            status: 'Faturada' as ServiceOrderStatus,
            invoiceNumber: invoiceData.invoiceNumber,
            invoiceDueDate: invoiceData.invoiceDueDate,
            finalValue: invoiceData.finalValue,
            valueJustification: invoiceData.valueJustification || order.valueJustification,
            payments: existingPayments,
            paymentStatus: paymentStatusOnInvoice,
          };
        }
        return order;
      })
    );
    handleCloseInvoiceOSModal(); // Close the modal
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
        // theme={theme} // Removed theme prop
        // onToggleTheme={toggleTheme} // Removed onToggleTheme prop
        // Pass data and modal controls down
        vehicles={vehicles}
        users={users}
        suppliers={suppliers} // Pass suppliers for Dashboard
        serviceOrders={serviceOrders} // Pass serviceOrders for Dashboard
        pendingOSCount={pendingOS.length} // This might be derived from serviceOrders later
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
        onOpenRecordPaymentModal={handleOpenRecordPaymentModal} // Updated prop
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
