import React, { useState, useEffect, useCallback } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ClienteModal from '../components/ClienteModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { Cliente, Empresa } from '../types';

const API_URL = '/api/clientes';

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  // Filters state
  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Ativo');
  const [busca, setBusca] = useState('');
  const [empresasFiltro, setEmpresasFiltro] = useState<Empresa[]>([]);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (filtroEmpresa) params.append('empresaId', filtroEmpresa);
    if (filtroStatus) params.append('status', filtroStatus);
    if (busca) params.append('busca', busca);
    const query = params.toString();

    try {
      const response = await fetch(`${API_URL}?${query}`);
      if (!response.ok) {
        let errorText = `Erro ${response.status}: ${response.statusText}`;
        if (response.status === 503) {
            errorText = 'Serviço indisponível (Service Unavailable). A API pode estar offline.';
        } else {
            try {
                const errorData = await response.json();
                errorText = errorData.message || errorText;
            } catch (e) {
                // Ignore JSON parsing error
            }
        }
        throw new Error(errorText);
      }
      const data = await response.json();
      setClientes(data);
    } catch (err: any) {
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError("Erro de comunicação com a API. Verifique se o servidor está no ar.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [filtroEmpresa, filtroStatus, busca]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await fetch('/api/empresas?status=Ativo');
        if (response.ok) {
          setEmpresasFiltro(await response.json());
        }
      } catch (err) {
        console.error("Failed to fetch empresas for filter", err);
      }
    };
    fetchEmpresas();
  }, []);
  
  const handleOpenAddModal = () => {
    setSelectedCliente(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setIsDeleteModalOpen(true);
  };
  
  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCliente(null);
  };

  const handleSave = async (clienteData: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt' | 'empresa'>) => {
    const method = selectedCliente ? 'PUT' : 'POST';
    const url = selectedCliente ? `${API_URL}/${selectedCliente.id}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Falha ao ${selectedCliente ? 'atualizar' : 'criar'} cliente.`);
      }
      handleCloseModals();
      fetchClientes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedCliente) return;
    try {
      const response = await fetch(`${API_URL}/${selectedCliente.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Falha ao inativar o cliente.');
      }
      handleCloseModals();
      fetchClientes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusClass = (status: string) => {
    return status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-slate-800">Clientes</h1>
          <p className="mt-2 text-sm text-gray-700">Gerencie os seus clientes cadastrados.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button type="button" onClick={handleOpenAddModal} className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto">
            Adicionar Cliente
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="filtroEmpresa" className="block text-sm font-medium text-gray-700">Filtrar por Empresa</label>
            <select id="filtroEmpresa" value={filtroEmpresa} onChange={(e) => setFiltroEmpresa(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
              <option value="">Todas</option>
              {empresasFiltro.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filtroStatus" className="block text-sm font-medium text-gray-700">Filtrar por Status</label>
            <select id="filtroStatus" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
              <option value="Ativo">Ativos</option>
              <option value="Inativo">Inativos</option>
            </select>
          </div>
          <div>
            <label htmlFor="busca" className="block text-sm font-medium text-gray-700">Buscar</label>
            <input type="text" name="busca" id="busca" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Nome, CNPJ, cidade..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
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
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Empresa Contratante</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">CNPJ</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cidade/Estado</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-4">Carregando...</td></tr>
                  ) : clientes.length === 0 && !error ? (
                    <tr><td colSpan={6} className="text-center py-4 text-gray-500">Nenhum cliente encontrado.</td></tr>
                  ) : clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{cliente.nome}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{cliente.empresa?.nome}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{cliente.cnpj || '-'}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{cliente.cidade && cliente.estado ? `${cliente.cidade}/${cliente.estado}` : '-'}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusClass(cliente.status)}`}>
                          {cliente.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                         <button onClick={() => handleOpenEditModal(cliente)} className="text-blue-600 hover:text-blue-900 mr-4" title="Editar"><PencilIcon className="h-5 w-5 inline-block"/></button>
                         <button onClick={() => handleOpenDeleteModal(cliente)} className="text-red-600 hover:text-red-900" title="Inativar"><TrashIcon className="h-5 w-5 inline-block"/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ClienteModal 
        isOpen={isModalOpen}
        onClose={handleCloseModals}
        onSave={handleSave}
        cliente={selectedCliente}
      />
      
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDelete}
        title="Inativar Cliente"
        message={`Tem certeza de que deseja inativar o cliente "${selectedCliente?.nome}"?`}
        confirmText="Inativar"
        variant="primary"
      />
    </div>
  );
};

export default Clientes;