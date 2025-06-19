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
