import React, { useState } from 'react';
import { Supplier, SUPPLIER_TYPES, SupplierTypeOption, SupplierStatus } from '../types'; // Import SupplierStatus
import ConfirmDeleteSupplierModal from './ConfirmDeleteSupplierModal';

interface SuppliersSectionProps {
  suppliers: Supplier[];
  onOpenAddSupplierModal: () => void;
  onOpenEditSupplierModal: (supplier: Supplier) => void;
  onSetSupplierStatus: (supplierId: string, status: SupplierStatus) => void; // Added new prop
}

const SuppliersSection: React.FC<SuppliersSectionProps> = ({
  suppliers,
  onOpenAddSupplierModal,
  onOpenEditSupplierModal,
  onSetSupplierStatus, // Destructure new prop
}) => {
  // const noSuppliers = suppliers.length === 0; // Will use suppliers.length directly or filteredSuppliers.length
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplierTypes, setSelectedSupplierTypes] = useState<SupplierTypeOption[]>([]);

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);
  const [deleteDependencyWarning, setDeleteDependencyWarning] = useState<string | undefined>(undefined);

  const handleOpenConfirmDeleteModal = (supplier: Supplier) => {
    setDeletingSupplier(supplier);
    // Placeholder for dependency check logic
    setDeleteDependencyWarning("Verifique as Ordens de Serviço associadas antes de inativar. Esta é uma mensagem de exemplo."); // Generic placeholder
    setIsConfirmDeleteModalOpen(true);
  };

  const handleCloseConfirmDeleteModal = () => {
    setIsConfirmDeleteModalOpen(false);
    setDeletingSupplier(null);
    setDeleteDependencyWarning(undefined);
  };

  const handleActualConfirmDelete = () => {
    if (deletingSupplier && deletingSupplier.id) {
      onSetSupplierStatus(deletingSupplier.id, "Inativo" as SupplierStatus);
      // The 'as SupplierStatus' cast assumes "Inativo" is a valid member of SupplierStatus.
    }
    handleCloseConfirmDeleteModal();
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    // Filter by searchTerm (Nome/Razão Social or Nome Fantasia)
    const nameMatches = searchTerm.trim() === '' ||
                        supplier.nomeRazaoSocial.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                        (supplier.nomeFantasia && supplier.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase().trim()));

    // Filter by selectedSupplierTypes
    const typeMatches = selectedSupplierTypes.length === 0 ||
                        selectedSupplierTypes.some(selectedType => supplier.tipoFornecedor.includes(selectedType));

    return nameMatches && typeMatches;
  });

  return (
    <section id="suppliers-section" className="page-section">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-slate-800">Gerenciamento de Fornecedores</h2>
        <button
          onClick={onOpenAddSupplierModal}
          className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/10"
        >
          Adicionar Fornecedor
        </button>
      </div>

      {/* Filter Controls Section */}
      <div className="mb-5 p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <label htmlFor="supplier-search-filter" className="text-sm font-medium text-slate-600">Pesquisar por Nome/Razão Social</label>
            <input
              type="text"
              id="supplier-search-filter"
              placeholder="Nome ou Razão Social..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition w-full"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-slate-600 block mb-1">Filtrar por Tipo de Fornecedor</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
              {SUPPLIER_TYPES.map((type) => (
                <label key={type} className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                    checked={selectedSupplierTypes.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSupplierTypes([...selectedSupplierTypes, type]);
                      } else {
                        setSelectedSupplierTypes(selectedSupplierTypes.filter(t => t !== type));
                      }
                    }}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* End of Filter Controls Section */}

      {filteredSuppliers.length > 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold text-slate-600">Nome Fantasia</th>
                  <th className="p-4 font-semibold text-slate-600">CNPJ/CPF</th>
                  <th className="p-4 font-semibold text-slate-600">Tipo(s)</th>
                  <th className="p-4 font-semibold text-slate-600">Telefone</th>
                  <th className="p-4 font-semibold text-slate-600">Cidade/Estado</th>
                  <th className="p-4 font-semibold text-slate-600">Status</th> {/* Added Status header */}
                  <th className="p-4 font-semibold text-slate-600">Ações</th>
                </tr>
              </thead>
              <tbody id="supplier-list" className="divide-y divide-slate-200">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className={`hover:bg-slate-100 ${supplier.status === 'Inativo' ? 'bg-slate-50 text-slate-500' : 'bg-white'}`}>
                    <td className="p-4 font-medium">{supplier.nomeFantasia || supplier.nomeRazaoSocial}</td> {/* Removed text-slate-800 for inactive row style to take over */}
                    <td className="p-4">{supplier.cnpjCpf}</td>
                    <td className="p-4">{supplier.tipoFornecedor.join(', ')}</td>
                    <td className="p-4">{supplier.telefone}</td>
                    <td className="p-4">{`${supplier.cidade}/${supplier.estado}`}</td>
                    <td className="p-4"> {/* Added Status cell */}
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        supplier.status === 'Ativo' ? 'bg-teal-100 text-teal-800' :
                        supplier.status === 'Inativo' ? 'bg-slate-200 text-slate-800' : // Slightly different Inactive badge
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {supplier.status}
                      </span>
                    </td>
                    <td className="p-4 space-x-2"> {/* Added space-x-2 for button spacing */}
                      <button
                        onClick={() => onOpenEditSupplierModal(supplier)}
                        className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-sky-700 bg-sky-100 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
                      >
                        Editar
                      </button>
                      {supplier.status === 'Ativo' && (
                        <button
                          onClick={() => handleOpenConfirmDeleteModal(supplier)}
                          className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 ml-2"
                        >
                          Inativar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div id="no-suppliers" className="p-8 text-center text-slate-500">
          Nenhum fornecedor encontrado com os filtros aplicados.
        </div>
      )}
      <ConfirmDeleteSupplierModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={handleCloseConfirmDeleteModal}
        onConfirm={handleActualConfirmDelete}
        supplierName={deletingSupplier ? `${deletingSupplier.nomeFantasia || deletingSupplier.nomeRazaoSocial} (${deletingSupplier.cnpjCpf || 'N/A'})` : ''}
        dependencyWarningMessage={deleteDependencyWarning}
      />
    </section>
  );
};

export default SuppliersSection;
