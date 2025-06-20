import React from 'react';

interface ConfirmDeleteSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  supplierName: string;
  dependencyWarningMessage?: string;
}

const ConfirmDeleteSupplierModal: React.FC<ConfirmDeleteSupplierModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  supplierName,
  dependencyWarningMessage,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose(); // Close modal after confirm
  };

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="modal-content bg-white border border-slate-200 w-full max-w-md rounded-xl shadow-2xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Confirmar Inativação de Fornecedor</h3>
          <p className="text-sm text-slate-600 mb-3">
            Tem certeza que deseja marcar o fornecedor <strong>{supplierName}</strong> como Inativo?
          </p>
          {dependencyWarningMessage && (
            <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-md mb-6">
              {dependencyWarningMessage}
            </p>
          )}
          {!dependencyWarningMessage && (
             <p className="text-sm text-slate-500 mb-6">
                Esta ação poderá ser revertida posteriormente.
             </p>
          )}
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

export default ConfirmDeleteSupplierModal;
