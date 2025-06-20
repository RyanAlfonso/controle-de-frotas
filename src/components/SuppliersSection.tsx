import React from 'react';
import { Supplier } from '../types';

interface SuppliersSectionProps {
  suppliers: Supplier[];
  onOpenAddSupplierModal: () => void;
}

const SuppliersSection: React.FC<SuppliersSectionProps> = ({
  suppliers,
  onOpenAddSupplierModal,
}) => {
  const noSuppliers = suppliers.length === 0;

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

      {suppliers.length > 0 ? (
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
                  <th className="p-4 font-semibold text-slate-600">Ações</th>
                </tr>
              </thead>
              <tbody id="supplier-list" className="divide-y divide-slate-200">
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-800">{supplier.nomeFantasia || supplier.nomeRazaoSocial}</td>
                    <td className="p-4 text-slate-600">{supplier.cnpjCpf}</td>
                    <td className="p-4 text-slate-600">{supplier.tipoFornecedor.join(', ')}</td>
                    <td className="p-4 text-slate-600">{supplier.telefone}</td>
                    <td className="p-4 text-slate-600">{`${supplier.cidade}/${supplier.estado}`}</td>
                    <td className="p-4 text-slate-600">{/* Actions placeholder */}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div id="no-suppliers" className="p-8 text-center text-slate-500">
          Nenhum fornecedor cadastrado.
        </div>
      )}
    </section>
  );
};

export default SuppliersSection;
