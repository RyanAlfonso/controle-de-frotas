import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditVehicleModal from './EditVehicleModal';
import { Vehicle } from '../types';

// Mock VehicleFormData, assuming it's similar to Vehicle for form fields
// This is defined in EditVehicleModal.tsx, but we might need it for mocks here
interface VehicleFormData {
  marca: string;
  modelo: string;
  ano: string;
  cor: string;
  placa: string;
  renavam: string;
  chassi: string;
  status: string;
  km: string;
}


const mockVehicleToEdit: Vehicle = {
  id: 'v1',
  marca: 'Volkswagen',
  modelo: 'Gol',
  ano: 2022,
  cor: 'Branco',
  placa: 'RKT-1A23',
  renavam: '12345678901',
  chassi: '9BWZZZ377VT123456',
  status: 'Ativo',
  km: 15000,
  maintenanceHistory: [],
  fuelingHistory: [],
};

// Helper to convert Vehicle to VehicleFormData (strings for ano/km)
const vehicleToFormData = (vehicle: Vehicle): VehicleFormData => ({
    marca: vehicle.marca,
    modelo: vehicle.modelo,
    ano: String(vehicle.ano),
    cor: vehicle.cor,
    placa: vehicle.placa,
    renavam: vehicle.renavam,
    chassi: vehicle.chassi,
    status: vehicle.status,
    km: String(vehicle.km),
});


describe('EditVehicleModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    // Clear mock call counts before each test
    mockOnClose.mockClear();
    mockOnSave.mockClear();
  });

  test('renders and pre-fills data when vehicleToEdit is provided', () => {
    render(
      <EditVehicleModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        vehicleToEdit={mockVehicleToEdit}
      />
    );

    expect(screen.getByLabelText(/marca/i)).toHaveValue(mockVehicleToEdit.marca);
    expect(screen.getByLabelText(/modelo/i)).toHaveValue(mockVehicleToEdit.modelo);
    expect(screen.getByLabelText(/placa/i)).toHaveValue(mockVehicleToEdit.placa);
    expect(screen.getByLabelText(/ano/i)).toHaveValue(mockVehicleToEdit.ano); // For type="number", expect a number
    expect(screen.getByLabelText(/quilometragem atual/i)).toHaveValue(mockVehicleToEdit.km); // For type="number", expect a number
    expect(screen.getByLabelText(/status/i)).toHaveValue(mockVehicleToEdit.status);
  });

  test('updates form data on input change', async () => {
    render(
      <EditVehicleModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        vehicleToEdit={null} // Start with an empty form for this test
      />
    );

    const marcaInput = screen.getByLabelText(/marca/i);
    await userEvent.type(marcaInput, 'Toyota');
    expect(marcaInput).toHaveValue('Toyota');

    const modeloInput = screen.getByLabelText(/modelo/i);
    await userEvent.clear(modeloInput); // Clear if there's any default/previous value
    await userEvent.type(modeloInput, 'Corolla');
    expect(modeloInput).toHaveValue('Corolla');
  });

  test('calls onSave with updated data when form is submitted', async () => {
    const user = userEvent.setup();
    render(
      <EditVehicleModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        vehicleToEdit={mockVehicleToEdit}
      />
    );

    const modeloInput = screen.getByLabelText(/modelo/i);
    const kmInput = screen.getByLabelText(/quilometragem atual/i);

    await user.clear(modeloInput);
    await user.type(modeloInput, 'Polo');
    await user.clear(kmInput);
    await user.type(kmInput, '25000');
    
    const submitButton = screen.getByRole('button', { name: /salvar veículo/i });
    await user.click(submitButton);

    const expectedFormData = vehicleToFormData(mockVehicleToEdit); // Start with original
    expectedFormData.modelo = 'Polo'; // Apply changes
    expectedFormData.km = '25000';

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(expectedFormData);
  });
  
  test('calls onSave with initial data if no changes are made', async () => {
    const user = userEvent.setup();
    render(
      <EditVehicleModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        vehicleToEdit={mockVehicleToEdit}
      />
    );
    
    const submitButton = screen.getByRole('button', { name: /salvar veículo/i });
    await user.click(submitButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(vehicleToFormData(mockVehicleToEdit));
  });

  test('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <EditVehicleModal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        vehicleToEdit={mockVehicleToEdit}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
