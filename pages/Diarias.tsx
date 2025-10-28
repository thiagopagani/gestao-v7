import React, { useState, useEffect, useCallback } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DiariaModal from '../components/DiariaModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { Diaria, Empresa, Cliente, Funcionario } from '../types';

const API_URL = '/api/diarias';

const Diarias: React.FC = () => {
  const [diarias, setDiarias] = useState<Diaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedDiaria, setSelectedDiaria] = useState<Diaria | null>(null);

  // State for filters
  const [empresasFiltro, setEmpresasFiltro] = useState<Empresa[]>([]);
  const [clientesFiltro, setClientesFiltro] = useState<Cliente[]>([]);
  const [funcionariosFiltro, setFuncionariosFiltro] = useState<Funcionario[]>([]);
  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroFuncionario, setFiltroFuncionario] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');

  const fetchDiarias = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filtroEmpresa) params.append('empresaId', filtroEmpresa);
    if (filtroCliente) params.append('clienteId', filtroCliente);
    if (filtroFuncionario) params.append('funcionarioId', filtroFuncionario);
    if (filtroStatus) params.append('status', filtroStatus);
    if (filtroDataInicio) params.append('dataInicio', filtroDataInicio);
    if (filtroDataFim) params.append('dataFim', filtroDataFim);
    const query = params.toString();

    try {
      const response = await fetch(`${API_URL}?${query}`);
      if (!response.ok) {
        throw new Error('Falha ao buscar dados das diárias.');
      }
      const data = await response.json();
      setDiarias(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filtroEmpresa, filtroCliente, filtroFuncionario, filtroStatus, filtroDataInicio, filtroDataFim]);

  useEffect(() => {
    fetchDiarias();
  }, [fetchDiarias]);
  
  useEffect(() => {
    const fetchFiltroData = async () => {
        try {
            const [empresaRes, cliRes, funcRes] = await Promise.all([
                fetch('/api/empresas?status=Ativo'),
                fetch('/api/clientes?status=Ativo'),
                fetch('/api/funcionarios?status=Ativo')
            ]);
            if (empresaRes.ok) setEmpresasFiltro(await empresaRes.json());
            if (cliRes.ok) setClientesFiltro(await cliRes.json());
            if (funcRes.ok) setFuncionariosFiltro(await funcRes.json());
        } catch (err) {
            console.error("Failed to fetch filter data", err);
        }
    };
    fetchFiltroData();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedDiaria(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (diaria: Diaria) => {
    setSelectedDiaria(diaria);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (diaria: Diaria) => {
    setSelectedDiaria(diaria);
    setIsDeleteModalOpen(true);
  };
  
  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedDiaria(null);
  };

  const handleSave = async (diariaData: Omit<Diaria, 'id' | 'createdAt' | 'updatedAt' | 'funcionario' | 'cliente'>) => {
    const method = selectedDiaria ? 'PUT' : 'POST';
    const url = selectedDiaria ? `${API_URL}/${selectedDiaria.id}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diariaData),
      });
      if (!response.ok) {
        throw new Error(`Falha ao ${selectedDiaria ? 'atualizar' : 'criar'} diária.`);
      }
      handleCloseModals();
      fetchDiarias();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedDiaria) return;
    try {
      const response = await fetch(`${API_URL}/${selectedDiaria.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Falha ao cancelar diária.');
      }
      handleCloseModals();
      fetchDiarias();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Aprovado': return 'bg-green-100 text-green-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-slate-800">Lançamento de Diárias</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie as diárias dos funcionários.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Lançar Diária
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <div>
                <label htmlFor="filtroDataInicio" className="block text-sm font-medium text-gray-700">De</label>
                <input type="date" name="filtroDataInicio" id="filtroDataInicio" value={filtroDataInicio} onChange={(e) => setFiltroDataInicio(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="filtroDataFim" className="block text-sm font-medium text-gray-700">Até</label>
                <input type="date" name="filtroDataFim" id="filtroDataFim" value={filtroDataFim} onChange={(e) => setFiltroDataFim(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="filtroFuncionario" className="block text-sm font-medium text-gray-700">Funcionário</label>
                <select id="filtroFuncionario" value={filtroFuncionario} onChange={(e) => setFiltroFuncionario(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
                    <option value="">Todos</option>
                    {funcionariosFiltro.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="filtroCliente" className="block text-sm font-medium text-gray-700">Cliente</label>
                <select id="filtroCliente" value={filtroCliente} onChange={(e) => setFiltroCliente(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
                    <option value="">Todos</option>
                    {clientesFiltro.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="filtroStatus" className="block text-sm font-medium text-gray-700">Status</label>
                <select id="filtroStatus" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
                    <option value="">Todos</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
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
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Data</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Funcionário</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cliente / Obra</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Empresa</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Valor</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Observação</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr><td colSpan={8} className="text-center py-4">Carregando...</td></tr>
                  ) : diarias.map((diaria) => (
                    <tr key={diaria.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">{formatDate(diaria.data)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{diaria.funcionario?.nome}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{diaria.cliente?.nome}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{diaria.cliente?.empresa?.nome || '-'}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(diaria.valor)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 max-w-[200px] truncate" title={diaria.observacao || ''}>{diaria.observacao || '-'}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusClass(diaria.status)}`}>
                          {diaria.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button onClick={() => handleOpenEditModal(diaria)} className="text-blue-600 hover:text-blue-900 mr-4"><PencilIcon className="h-5 w-5 inline-block"/></button>
                        <button onClick={() => handleOpenDeleteModal(diaria)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5 inline-block"/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <DiariaModal 
        isOpen={isModalOpen}
        onClose={handleCloseModals}
        onSave={handleSave}
        diaria={selectedDiaria}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDelete}
        title="Cancelar Diária"
        message={`Tem certeza de que deseja cancelar esta diária? O status será alterado para "Cancelado".`}
      />
    </div>
  );
};

export default Diarias;