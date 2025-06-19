// Declare Chart globally as it's loaded from a CDN
// In a module-based system, you'd import types from 'chart.js'
declare var Chart: any;

// ======== INTERFACES ========
interface MaintenanceHistoryItem {
    date: string;
    type: string;
    description: string;
    cost: number;
    supplier: string;
    os: string;
}

interface FuelingHistoryItem {
    date: string;
    liters: number;
    totalCost: number;
    station: string;
}

interface Vehicle {
    marca: string;
    modelo: string;
    ano: number;
    cor: string;
    placa: string;
    renavam: string; // Can be string if it has leading zeros or non-numeric chars
    chassi: string;
    status: 'Ativo' | 'Em Manutenção' | 'Inativo' | 'Vendido'; // Use string literal types for status
    km: number;
    maintenanceHistory: MaintenanceHistoryItem[];
    fuelingHistory: FuelingHistoryItem[];
}

interface User {
    nome: string;
    email: string;
    perfil: 'Master' | 'Avançado' | 'Solicitante' | 'Controle de OS'; // String literal types for profile
}

interface PendingOSItem {
    tipo: string;
    status: string;
}

function App(): void {
    // ======== DATA IN MEMORY ========
    let vehicles: Vehicle[] = [
        {
            marca: 'Volkswagen', modelo: 'Gol', ano: 2022, cor: 'Branco', placa: 'RKT-1A23', renavam: '12345678901', chassi: '9BWZZZ377VT123456', status: 'Ativo', km: 15000,
            maintenanceHistory: [
                { date: '2023-05-10', type: 'Troca de Óleo', description: 'Troca de óleo do motor e filtro.', cost: 150.00, supplier: 'Oficina do Zé', os: 'OS-001' },
                { date: '2023-11-20', type: 'Alinhamento', description: 'Alinhamento e balanceamento.', cost: 80.00, supplier: 'Centro Automotivo Speed', os: 'OS-002' }
            ],
            fuelingHistory: [
                { date: '2023-12-01', liters: 40, totalCost: 220.00, station: 'Posto Shell' },
                { date: '2023-12-15', liters: 38.5, totalCost: 211.75, station: 'Posto Ipiranga' }
            ]
        },
        {
            marca: 'Fiat', modelo: 'Strada', ano: 2023, cor: 'Prata', placa: 'BRZ-2B34', renavam: '12345678902', chassi: '9BDZZZ377VT123457', status: 'Ativo', km: 8000,
            maintenanceHistory: [],
            fuelingHistory: []
        },
        {
            marca: 'Chevrolet', modelo: 'Onix', ano: 2021, cor: 'Preto', placa: 'PBR-3C45', renavam: '12345678903', chassi: '9BGZZZ377VT123458', status: 'Em Manutenção', km: 32000,
            maintenanceHistory: [ { date: '2024-01-05', type: 'Troca de Pneus', description: 'Troca dos 4 pneus.', cost: 1200.00, supplier: 'Pneu Forte', os: 'OS-003' } ],
            fuelingHistory: []
        },
        {
            marca: 'Hyundai', modelo: 'HB20', ano: 2022, cor: 'Cinza', placa: 'ABC-4D56', renavam: '12345678904', chassi: '9BHZZZ377VT123459', status: 'Inativo', km: 21000,
            maintenanceHistory: [],
            fuelingHistory: []
        },
        {
            marca: 'Ford', modelo: 'Ranger', ano: 2020, cor: 'Azul', placa: 'XYZ-5E67', renavam: '12345678905', chassi: '9BFZZZ377VT123450', status: 'Ativo', km: 55000,
            maintenanceHistory: [],
            fuelingHistory: []
        },
    ];
    let users: User[] = [
        { nome: 'Admin Master', email: 'master@dcsys.com.br', perfil: 'Master' }
    ];
    let pendingOS: PendingOSItem[] = [
        { tipo: 'Mecânica', status: 'Aguardando Orçamento'},
        { tipo: 'Elétrica', status: 'Aguardando Aprovação'},
        { tipo: 'Funilaria', status: 'Aguardando Orçamento'},
        { tipo: 'Pneus', status: 'Aguardando Aprovação'},
        { tipo: 'Mecânica', status: 'Aguardando Aprovação'},
    ];

    let statusChart: any | null = null; // Using 'any' for Chart.js instance for now

    // ======== DOM ELEMENTS ========
    const loginPage = document.getElementById('login-page') as HTMLDivElement;
    const appPage = document.getElementById('app') as HTMLDivElement;
    const loginButton = document.getElementById('login-button') as HTMLButtonElement;
    const logoutButton = document.getElementById('logout-button') as HTMLButtonElement;

    const pageTitle = document.getElementById('page-title') as HTMLHeadingElement;

    const addVehicleModal = document.getElementById('add-vehicle-modal') as HTMLDivElement;
    const addUserModal = document.getElementById('add-user-modal') as HTMLDivElement;
    const addVehicleButton = document.getElementById('add-vehicle-button') as HTMLButtonElement;
    const addUserButton = document.getElementById('add-user-button') as HTMLButtonElement;
    const modalCancelButtons = document.querySelectorAll('.modal-cancel-button') as NodeListOf<HTMLButtonElement>;

    const addVehicleForm = document.getElementById('add-vehicle-form') as HTMLFormElement;
    const addUserForm = document.getElementById('add-user-form') as HTMLFormElement;

    const vehicleList = document.getElementById('vehicle-list') as HTMLTableSectionElement;
    const userList = document.getElementById('user-list') as HTMLTableSectionElement;
    const noVehiclesMsg = document.getElementById('no-vehicles') as HTMLDivElement;
    const noUsersMsg = document.getElementById('no-users') as HTMLDivElement;

    // Stats
    const statsTotalVehicles = document.getElementById('stats-total-vehicles') as HTMLParagraphElement;
    const statsActiveVehicles = document.getElementById('stats-active-vehicles') as HTMLParagraphElement;
    const statsMaintenanceVehicles = document.getElementById('stats-maintenance-vehicles') as HTMLParagraphElement;
    const statsPendingOs = document.getElementById('stats-pending-os') as HTMLParagraphElement;
    const statusCtx = (document.getElementById('statusChart') as HTMLCanvasElement).getContext('2d');

    // Filters
    const searchFilterInput = document.getElementById('search-filter') as HTMLInputElement;
    const statusFilterInput = document.getElementById('status-filter') as HTMLSelectElement;

    // ======== RENDER FUNCTIONS ========
    const updateDashboard = (): void => {
        if (statsTotalVehicles) statsTotalVehicles.textContent = vehicles.length.toString();
        if (statsActiveVehicles) statsActiveVehicles.textContent = vehicles.filter(v => v.status === 'Ativo').length.toString();
        if (statsMaintenanceVehicles) statsMaintenanceVehicles.textContent = vehicles.filter(v => v.status === 'Em Manutenção').length.toString();
        if (statsPendingOs) statsPendingOs.textContent = pendingOS.length.toString();
        updateStatusChart();
    };

    const updateStatusChart = (): void => {
        if (!statusCtx) return;

        const statusCounts = vehicles.reduce((acc, vehicle) => {
            acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
            return acc;
        }, {} as Record<Vehicle['status'], number>);

        const chartLabels: string[] = Object.keys(statusCounts);
        const chartData: number[] = Object.values(statusCounts);

        const colors: Record<string, string> = {
            'Ativo': 'rgba(13, 148, 136, 0.8)',
            'Em Manutenção': 'rgba(249, 115, 22, 0.8)',
            'Inativo': 'rgba(100, 116, 139, 0.8)',
            'Vendido': 'rgba(139, 92, 246, 0.8)',
        };
        const backgroundColors: string[] = chartLabels.map(label => colors[label] || '#475569');

        if (statusChart) {
            statusChart.data.labels = chartLabels;
            statusChart.data.datasets[0].data = chartData;
            statusChart.data.datasets[0].backgroundColor = backgroundColors;
            statusChart.update();
        } else {
             statusChart = new Chart(statusCtx, {
                type: 'doughnut',
                data: {
                    labels: chartLabels.length > 0 ? chartLabels : ['Sem Veículos'],
                    datasets: [{
                        data: chartData.length > 0 ? chartData : [1],
                        backgroundColor: chartLabels.length > 0 ? backgroundColors : ['#e2e8f0'],
                        borderColor: '#ffffff',
                        borderWidth: 4,
                        hoverOffset: 8
                    }]
                },
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
    };

    const renderVehicleList = (): void => {
        const searchTerm = searchFilterInput.value.toLowerCase();
        const statusTerm = statusFilterInput.value as Vehicle['status'] | "";

        const filteredVehicles = vehicles.filter(v => {
            const matchesSearch = v.marca.toLowerCase().includes(searchTerm) ||
                                  v.modelo.toLowerCase().includes(searchTerm) ||
                                  v.placa.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusTerm || v.status === statusTerm;
            return matchesSearch && matchesStatus;
        });

        vehicleList.innerHTML = '';
        if (filteredVehicles.length === 0) {
            noVehiclesMsg.style.display = 'block';
            vehicleList.style.display = 'none';
        } else {
            noVehiclesMsg.style.display = 'none';
            vehicleList.style.display = 'table-row-group'; // Or '' for default
            filteredVehicles.forEach(v => {
                const row = vehicleList.insertRow();
                row.className = 'hover:bg-slate-50 cursor-pointer';
                row.dataset.placa = v.placa;
                row.innerHTML = `
                    <td class="p-4 font-medium text-slate-800">${v.placa}</td>
                    <td class="p-4 text-slate-600">${v.modelo}</td>
                    <td class="p-4 text-slate-600">${v.marca}</td>
                    <td class="p-4 text-slate-600">${v.ano}</td>
                    <td class="p-4"><span class="px-2.5 py-1 text-xs font-semibold rounded-full ${
                        v.status === 'Ativo' ? 'bg-teal-100 text-teal-800' :
                        v.status === 'Em Manutenção' ? 'bg-orange-100 text-orange-800' :
                        'bg-slate-100 text-slate-800' // Default for Inativo/Vendido
                    }">${v.status}</span></td>
                `;
                // Note: Adding rows directly via innerHTML to tbody might not be ideal.
                // Consider creating <td> elements and appending them for better type safety and performance.
                // For this example, keeping it similar to original JS.
            });
        }
        updateDashboard();
    };

    const renderUserList = (): void => {
        userList.innerHTML = '';
        if (users.length === 0) {
            noUsersMsg.style.display = 'block';
        } else {
            noUsersMsg.style.display = 'none';
            users.forEach(u => {
                const row = userList.insertRow();
                row.className = 'hover:bg-slate-50';
                row.innerHTML = `
                    <td class="p-4 font-medium text-slate-800">${u.nome}</td>
                    <td class="p-4 text-slate-600">${u.email}</td>
                    <td class="p-4 text-slate-600">${u.perfil}</td>
                `;
            });
        }
    };

    // ======== UI & NAVIGATION ========
    const navigateTo = (pageId: string): void => {
        const titleMap: Record<string, string> = {
            'dashboard': 'Dashboard',
            'vehicles': 'Gerenciamento de Frota',
            'users': 'Gerenciamento de Usuários'
        };
        if (pageTitle) pageTitle.textContent = titleMap[pageId] || 'Dashboard';

        document.querySelectorAll('.page-section').forEach(section => (section as HTMLElement).classList.add('hidden'));
        const currentSection = document.getElementById(`${pageId}-section`);
        if (currentSection) currentSection.classList.remove('hidden');

        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    const openModal = (modal: HTMLDivElement): void => {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('opacity-100');
            const modalContent = modal.querySelector('.modal-content') as HTMLDivElement;
            if (modalContent) {
                modalContent.classList.add('opacity-100', 'scale-100');
                modalContent.classList.remove('opacity-0', 'scale-95');
            }
        }, 10);
    };

    const closeModal = (modal: HTMLDivElement): void => {
        const modalContent = modal.querySelector('.modal-content') as HTMLDivElement;
        if (modalContent) {
            modalContent.classList.remove('opacity-100', 'scale-100');
            modalContent.classList.add('opacity-0', 'scale-95');
        }
        modal.classList.remove('opacity-100');
        setTimeout(() => {
            modal.classList.add('hidden');
            const form = modal.querySelector('form');
            if (form) form.reset();
        }, 300);
    };

    // ======== EVENT LISTENERS SETUP ========
    const setupEventListeners = (): void => {
        document.body.addEventListener('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const navLink = target.closest('.nav-link');
            if (navLink && navLink.getAttribute('href')) {
                e.preventDefault();
                navigateTo(navLink.getAttribute('href')!.substring(1));
                return;
            }
        });

        if (loginButton) {
            loginButton.addEventListener('click', () => {
                if (loginPage) loginPage.style.display = 'none';
                if (appPage) appPage.style.display = 'flex';
                navigateTo('dashboard');
                renderVehicleList(); // Initial render
                renderUserList();   // Initial render
            });
        }

        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                if (appPage) appPage.style.display = 'none';
                if (loginPage) loginPage.style.display = 'flex';
            });
        }

        if (addVehicleButton) addVehicleButton.addEventListener('click', () => openModal(addVehicleModal));
        if (addUserButton) addUserButton.addEventListener('click', () => openModal(addUserModal));

        modalCancelButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal-backdrop') as HTMLDivElement | null;
                if (modal) closeModal(modal);
            });
        });

        if (addVehicleForm) {
            addVehicleForm.addEventListener('submit', (e: SubmitEvent) => {
                e.preventDefault();
                const newVehicle: Vehicle = {
                    marca: (document.getElementById('v-marca') as HTMLInputElement).value,
                    modelo: (document.getElementById('v-modelo') as HTMLInputElement).value,
                    ano: parseInt((document.getElementById('v-ano') as HTMLInputElement).value),
                    cor: (document.getElementById('v-cor') as HTMLInputElement).value,
                    placa: (document.getElementById('v-placa') as HTMLInputElement).value,
                    renavam: (document.getElementById('v-renavam') as HTMLInputElement).value,
                    chassi: (document.getElementById('v-chassi') as HTMLInputElement).value,
                    status: (document.getElementById('v-status') as HTMLSelectElement).value as Vehicle['status'],
                    km: parseInt((document.getElementById('v-km') as HTMLInputElement).value),
                    maintenanceHistory: [],
                    fuelingHistory: []
                };
                vehicles.push(newVehicle);
                renderVehicleList();
                closeModal(addVehicleModal);
            });
        }

        if (addUserForm) {
            addUserForm.addEventListener('submit', (e: SubmitEvent) => {
                e.preventDefault();
                const newUser: User = {
                    nome: (document.getElementById('u-nome') as HTMLInputElement).value,
                    email: (document.getElementById('u-email') as HTMLInputElement).value,
                    // Password is not stored in the User interface or array, so not read here
                    perfil: (document.getElementById('u-perfil') as HTMLSelectElement).value as User['perfil'],
                };
                users.push(newUser);
                renderUserList();
                closeModal(addUserModal);
            });
        }

        if (searchFilterInput) searchFilterInput.addEventListener('input', renderVehicleList);
        if (statusFilterInput) statusFilterInput.addEventListener('change', renderVehicleList);
    };

    // ======== INITIALIZATION ========
    setupEventListeners();
    // Initial navigation and rendering will be triggered by login button if login page is initially visible.
    // If app page is visible by default (e.g. for development), then:
    // navigateTo('dashboard');
    // renderUserList();
    // renderVehicleList();

    // Check initial state (login or app)
    if (loginPage && loginPage.style.display !== 'none') {
        // Currently on login page, do nothing until login
    } else if (appPage && appPage.style.display !== 'none') {
        // App page is visible, initialize dashboard
        navigateTo('dashboard');
        renderUserList();
        renderVehicleList();
    } else {
        // Default to login if neither is explicitly shown, or handle as error/default state
        if (loginPage) loginPage.style.display = 'flex';
        if (appPage) appPage.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', App);
