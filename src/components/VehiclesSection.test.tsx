import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VehiclesSection from './VehiclesSection';
import { Vehicle } from '../types';

// Define props type for clarity in the mock, mirroring EditVehicleModalProps
interface MockEditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleData: { [key: string]: string }) => void; // Form data is string-based
  vehicleToEdit: Vehicle | null;
}

// Mock the EditVehicleModal component
jest.mock('../EditVehicleModal', () => {
  return jest.fn(({ isOpen, onClose, onSave, vehicleToEdit }: MockEditVehicleModalProps) => {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-edit-vehicle-modal">
        <button data-testid="mock-modal-save" onClick={() => onSave({ 
          // Simulate form data, which would be strings
          marca: vehicleToEdit?.marca || '', 
          modelo: 'TestSave', 
          ano: String(vehicleToEdit?.ano || ''), 
          km: String(vehicleToEdit?.km || ''),
          // Add other fields as strings if they were part of VehicleFormData
          cor: vehicleToEdit?.cor || '',
          placa: vehicleToEdit?.placa || '',
          renavam: vehicleToEdit?.renavam || '',
          chassi: vehicleToEdit?.chassi || '',
          status: vehicleToEdit?.status || 'Ativo',
        })}>Save</button>
        <button data-testid="mock-modal-close" onClick={onClose}>Close</button>
        <div data-testid="mock-modal-vehicle-placa">{vehicleToEdit?.placa}</div>
      </div>
    );
  });
});

const mockVehicles: Vehicle[] = [
  { id: 'v1', marca: 'Volkswagen', modelo: 'Gol', ano: 2022, cor: 'Branco', placa: 'ABC-1234', renavam: '12345678901', chassi: '9BWZZZ377VT123456', status: 'Ativo', km: 15000, maintenanceHistory: [], fuelingHistory: [] },
  { id: 'v2', marca: 'Fiat', modelo: 'Strada', ano: 2023, cor: 'Prata', placa: 'DEF-5678', renavam: '12345678902', chassi: '9BDZZZ377VT123457', status: 'Ativo', km: 8000, maintenanceHistory: [], fuelingHistory: [] },
];

describe('VehiclesSection', () => {
  const mockOnAddVehicle = jest.fn();
  const mockOnEditVehicle = jest.fn();

  beforeEach(() => {
    mockOnAddVehicle.mockClear();
    mockOnEditVehicle.mockClear();
    // Clear mock history for the modal itself if needed (it's a jest.fn())
    (require('../EditVehicleModal') as jest.Mock).mockClear();
  });

  test('opens EditModal with correct vehicle data when "Editar" is clicked', async () => {
    const user = userEvent.setup();
    render(
      <VehiclesSection
        vehicles={mockVehicles}
        onAddVehicle={mockOnAddVehicle}
        onEditVehicle={mockOnEditVehicle}
      />
    );

    // Find the "Editar" button for the first vehicle (placa ABC-1234)
    // Buttons are identified by "Editar". We need to find the one in the row of mockVehicles[0]
    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    // Assuming order in the table matches mockVehicles order
    await user.click(editButtons[0]); 

    // Check if our mock modal is rendered (which means isOpen became true)
    expect(screen.getByTestId('mock-edit-vehicle-modal')).toBeInTheDocument();
    
    // Check that EditVehicleModal was called with the correct props
    const MockEditVehicleModal = require('../EditVehicleModal') as jest.Mock;
    // The mock is called once on initial render (returning null) and once when opened.
    // So we check that it was called, and then inspect the props of the last call.
    expect(MockEditVehicleModal.mock.calls.length).toBeGreaterThanOrEqual(1); // Ensure it was called at least once after click

    const lastCallIndex = MockEditVehicleModal.mock.calls.length - 1;
    const lastCallProps = MockEditVehicleModal.mock.calls[lastCallIndex][0];

    expect(lastCallProps.isOpen).toBe(true);
    expect(lastCallProps.vehicleToEdit).toEqual(mockVehicles[0]);
    // Verify content rendered by the mock based on these props
    expect(screen.getByTestId('mock-modal-vehicle-placa')).toHaveTextContent(mockVehicles[0].placa);
  });

  test('calls onEditVehicle with processed data when modal save is triggered', async () => {
    const user = userEvent.setup();
    render(
      <VehiclesSection
        vehicles={mockVehicles}
        onAddVehicle={mockOnAddVehicle}
        onEditVehicle={mockOnEditVehicle}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    await user.click(editButtons[0]); // Open modal for the first vehicle

    // Modal is open, get the save button from our mock modal
    const saveButtonInModal = screen.getByTestId('mock-modal-save');
    await user.click(saveButtonInModal);

    expect(mockOnEditVehicle).toHaveBeenCalledTimes(1);
    
    // This is the data our mock EditVehicleModal's onSave callback will provide
    const formDataFromMockModal = {
      marca: mockVehicles[0].marca || '',
      modelo: 'TestSave', 
      ano: String(mockVehicles[0].ano || ''), 
      km: String(mockVehicles[0].km || ''),
      cor: mockVehicles[0].cor || '',
      placa: mockVehicles[0].placa || '',
      renavam: mockVehicles[0].renavam || '',
      chassi: mockVehicles[0].chassi || '',
      status: mockVehicles[0].status || 'Ativo',
    };

    // This is what we expect VehiclesSection's onEditVehicle to be called with
    const expectedVehicleArgument: Vehicle = {
      id: mockVehicles[0].id, // Preserved from original
      marca: formDataFromMockModal.marca,
      modelo: formDataFromMockModal.modelo,
      ano: parseInt(formDataFromMockModal.ano, 10), // Parsed by VehiclesSection
      km: parseInt(formDataFromMockModal.km, 10),   // Parsed by VehiclesSection
      cor: formDataFromMockModal.cor,
      placa: formDataFromMockModal.placa,
      renavam: formDataFromMockModal.renavam,
      chassi: formDataFromMockModal.chassi,
      status: formDataFromMockModal.status as Vehicle['status'],
      maintenanceHistory: mockVehicles[0].maintenanceHistory, // Preserved
      fuelingHistory: mockVehicles[0].fuelingHistory,       // Preserved
    };
    
    const actualArgument = mockOnEditVehicle.mock.calls[0][0];
    expect(actualArgument).toEqual(expectedVehicleArgument);

    // Check if modal was closed
    expect(screen.queryByTestId('mock-edit-vehicle-modal')).not.toBeInTheDocument();
  });
});
