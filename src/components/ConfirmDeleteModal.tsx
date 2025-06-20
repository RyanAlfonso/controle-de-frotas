import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vehicleName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  vehicleName,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose(); // As per requirement, close after confirm
  };

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="modal-content bg-white border border-slate-200 w-full max-w-md rounded-xl shadow-2xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Confirmar Exclusão</h3>
          <p className="text-sm text-slate-600 mb-6">
            Tem certeza que deseja marcar o veículo <strong>{vehicleName}</strong> como Inativo?
            Esta ação não poderá ser desfeita diretamente por esta interface.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/10"
            >
              Confirmar Inativação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
