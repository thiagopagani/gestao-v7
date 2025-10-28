import React, { useState, useEffect, useCallback } from 'react';
import { PencilIcon, TrashIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import EmpresaModal from '../components/EmpresaModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { Empresa } from '../types';

const API_URL = '/api/empresas';

type ActionType = 'inactivate' | 'forceDelete' | 'restore';

const Empresas: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [filtroStatus, setFiltroStatus] = useState('Ativo');

  const fetchEmpresas = useCallback(async () => {
    setLoading(true);
    setError(null);
    const query = new URLSearchParams({ status: filtroStatus }).toString();
    try {
      const response = await fetch(`${API_URL}?${query}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao buscar dados das empresas.');
      }
      const data = await response.json();
      setEmpresas(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filtroStatus]);

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);
  
  const handleOpenAddModal = () => {
    setSelectedEmpresa(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setIsModalOpen(true);
  };

  const handleOpenConfirmModal = (empresa: Empresa, type: ActionType) => {
    setSelectedEmpresa(empresa);
    setActionType(type);
    setIsConfirmModalOpen(true);
  };
  
  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsConfirmModalOpen(false);
    setSelectedEmpresa(null);
    setActionType(null);
  };

  const handleSave = async (empresaData: Omit<Empresa, 'id' | 'createdAt' | 'updatedAt'>) => {
    const method = selectedEmpresa ? 'PUT' : 'POST';
    const url = selectedEmpresa ? `${API_URL}/${selectedEmpresa.id}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empresaData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Falha ao ${selectedEmpresa ? 'atualizar' : 'criar'} empresa.`);
      }
      handleCloseModals();
      fetchEmpresas();
    } catch (err: any) {
      setError(err.message); // Show API error to user
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedEmpresa || !actionType) return;

    let url = `${API_URL}/${selectedEmpresa.id}`;
    let method = 'DELETE';

    if (actionType === 'forceDelete') {
      url = `${API_URL}/${selectedEmpresa.id}/force`;
    } else if (actionType === 'restore') {
      url = `${API_URL}/${selectedEmpresa.id}/restore`;
      method = 'PUT';
    }

    try {
      const response = await fetch(url, { method });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao executar a ação.');
      }
      handleCloseModals();
      fetchEmpresas();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusClass = (status: string) => {
    return status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };
  
  const getModalProps = () => {
    if (!actionType || !selectedEmpresa) return undefined;
    switch (actionType) {
      case 'inactivate':
        return {
          title: "Inativar Empresa",
          message: `Tem certeza de que deseja inativar a empresa "${selectedEmpresa.nome}"?`,
          confirmText: "Inativar",
          variant: 'primary' as const,
        };
      case 'forceDelete':
        return {
          title: "Excluir Permanentemente",
          message: `Atenção! Esta ação irá excluir permanentemente a empresa "${selectedEmpresa.nome}". Esta ação não pode ser desfeita.`,
          confirmText: "Excluir Permanentemente",
          variant: 'danger' as const,
        };
      case 'restore':
        return {
          title: "Reativar Empresa",
          message: `Tem certeza de que deseja reativar a empresa "${selectedEmpresa.nome}"?`,
          confirmText: "Reativar",
          variant: 'primary' as const,
        };
    }
  };
  
  const modalProps = getModalProps();

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-slate-800">Empresas</h1>
          <p className="mt-2 text-sm text-gray-700">Gerencie as empresas contratantes dos seus serviços.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button type="button" onClick={handleOpenAddModal} className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto">
            Adicionar Empresa
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white rounded-lg shadow max-w-xs">
          <div>
              <label htmlFor="filtroStatus" className="block text-sm font-medium text-gray-700">Filtrar por Status</label>
              <select id="filtroStatus" name="filtroStatus" className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                  <option value="Ativo">Ativos</option>
                  <option value="Inativo">Inativos</option>
              </select>
          </div>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 p-4"><p className="text-sm font-medium text-red-800">{error}</p></div>}
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nome</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">CNPJ</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Telefone</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-4">Carregando...</td></tr>
                  ) : empresas.length === 0 ? (
                     <tr><td colSpan={5} className="text-center py-4 text-gray-500">Nenhuma empresa encontrada.</td></tr>
                  ) : empresas.map((empresa) => (
                    <tr key={empresa.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{empresa.nome}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{empresa.cnpj}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{empresa.telefone || '-'}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusClass(empresa.status)}`}>
                          {empresa.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {empresa.status === 'Ativo' ? (
                          <>
                            <button onClick={() => handleOpenEditModal(empresa)} className="text-blue-600 hover:text-blue-900 mr-4" title="Editar"><PencilIcon className="h-5 w-5 inline-block"/></button>
                            <button onClick={() => handleOpenConfirmModal(empresa, 'inactivate')} className="text-red-600 hover:text-red-900" title="Inativar"><TrashIcon className="h-5 w-5 inline-block"/></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleOpenConfirmModal(empresa, 'restore')} className="text-green-600 hover:text-green-900 mr-4" title="Reativar"><ArrowUturnLeftIcon className="h-5 w-5 inline-block"/></button>
                            <button onClick={() => handleOpenConfirmModal(empresa, 'forceDelete')} className="text-red-800 hover:text-red-900" title="Excluir Permanentemente"><TrashIcon className="h-5 w-5 inline-block"/></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <EmpresaModal 
        isOpen={isModalOpen}
        onClose={handleCloseModals}
        onSave={handleSave}
        empresa={selectedEmpresa}
      />
      {isConfirmModalOpen && modalProps && (
        <ConfirmDeleteModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseModals}
          onConfirm={handleConfirmAction}
          {...modalProps}
        />
      )}
    </div>
  );
};

export default Empresas;
