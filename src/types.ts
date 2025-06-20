// Placeholder for Chart.js type - ideally import from @types/chart.js
// declare var Chart: any; // This is already in App.tsx, consider a global declaration file if needed

export interface MaintenanceHistoryItem {
    date: string;
    type: string;
    description: string;
    cost: number;
    supplier: string;
    os: string;
}

export interface FuelingHistoryItem {
    date: string;
    liters: number;
    totalCost: number;
    station: string;
}

export type VehicleStatus = 'Ativo' | 'Em Manutenção' | 'Inativo' | 'Vendido';

export interface Vehicle {
    id: string; // Add an ID for keying in React lists
    marca: string;
    modelo: string;
    ano: number;
    cor: string;
    placa: string;
    renavam: string;
    chassi: string;
    status: VehicleStatus;
    km: number;
    maintenanceHistory: MaintenanceHistoryItem[];
    fuelingHistory: FuelingHistoryItem[];
}

export type UserProfile = 'Master' | 'Avançado' | 'Solicitante' | 'Controle de OS';

export interface User {
    id: string; // Add an ID
    nome: string;
    email: string;
    perfil: UserProfile;
}

export interface PendingOSItem {
    id: string; // Add an ID
    tipo: string;
    status: string;
}

// Example for Chart.js data structure, can be more specific
export interface ChartData {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string[];
        borderColor?: string;
        borderWidth?: number;
        hoverOffset?: number;
    }[];
}

// Supplier Types
export const SUPPLIER_TYPES = [
  "Oficina",
  "Lanternagem",
  "Abastecimento",
  "Borracharia",
  "Peças",
  "Outros"
] as const;

export type SupplierTypeOption = typeof SUPPLIER_TYPES[number];

export type SupplierStatus = "Ativo" | "Inativo"; // Added SupplierStatus

export interface Supplier {
  id: string;
  nomeRazaoSocial: string;
  nomeFantasia: string;
  cnpjCpf: string;
  tipoFornecedor: SupplierTypeOption[];
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  email: string;
  contatoPrincipal: string;
  observacoes: string;
  status: SupplierStatus; // Added status field
}

// Service Order Types
export const SERVICE_ORDER_STATUSES = [
  "Pendente de Orçamento",
  "Aguardando Aprovação",
  "Aprovada - Aguardando Execução",
  "Em Andamento",
  "Concluída",
  "Faturada", // Added new status
  "Cancelada"
] as const;

export type ServiceOrderStatus = typeof SERVICE_ORDER_STATUSES[number];

export interface ServiceOrderBudget {
  id: string;
  supplierId: string;
  budgetValue: number;
  estimatedDeadline: string;
  budgetNotes?: string;
  isApproved?: boolean; // Added this line
}

export interface ServiceOrder {
  id: string;
  vehicleId: string;
  serviceType: string;
  problemDescription: string;
  requestDate: string;
  requesterId: string;
  status: ServiceOrderStatus;

  budgets?: ServiceOrderBudget[]; // Added this line

  // Optional fields from before
  budgetDetails?: string;
  approvalDate?: string;
  approvedByUserId?: string;
  startDate?: string;
  completionDate?: string;
  supplierId?: string;
  cost?: number;
  notes?: string;

  completionNotes?: string;

  // Fields for RF016: Invoicing
  invoiceNumber?: string;
  invoiceDueDate?: string;
  finalValue?: number;
  valueJustification?: string;
}
