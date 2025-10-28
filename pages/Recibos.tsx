import React, { useState, useEffect, useCallback } from 'react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { Diaria, Cliente, Funcionario } from '../types';

const API_URL = '/api/diarias';

const Recibos: React.FC = () => {
  const [recibos, setRecibos] = useState<Diaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [clientesFiltro, setClientesFiltro] = useState<Cliente[]>([]);
  const [funcionariosFiltro, setFuncionariosFiltro] = useState<Funcionario[]>([]);
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroFuncionario, setFiltroFuncionario] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');

  const fetchRecibos = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append('status', 'Aprovado'); // Always filter for "Aprovado" status
    if (filtroCliente) params.append('clienteId', filtroCliente);
    if (filtroFuncionario) params.append('funcionarioId', filtroFuncionario);
    if (filtroDataInicio) params.append('dataInicio', filtroDataInicio);
    if (filtroDataFim) params.append('dataFim', filtroDataFim);
    const query = params.toString();

    try {
      const response = await fetch(`${API_URL}?${query}`);
      if (!response.ok) {
        throw new Error('Falha ao buscar dados dos recibos.');
      }
      const data = await response.json();
      setRecibos(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filtroCliente, filtroFuncionario, filtroDataInicio, filtroDataFim]);

  useEffect(() => {
    fetchRecibos();
  }, [fetchRecibos]);
  
  useEffect(() => {
    const fetchFiltroData = async () => {
        try {
            const [cliRes, funcRes] = await Promise.all([
                fetch('/api/clientes?status=Ativo'),
                fetch('/api/funcionarios?status=Ativo')
            ]);
            if (cliRes.ok) setClientesFiltro(await cliRes.json());
            if (funcRes.ok) setFuncionariosFiltro(await funcRes.json());
        } catch (err) {
            console.error("Failed to fetch filter data", err);
        }
    };
    fetchFiltroData();
  }, []);

  const handleGerarPdf = (diariaId: number) => {
    alert(`Funcionalidade de gerar PDF para o recibo ${diariaId} ainda não implementada.`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-slate-800">Recibos / Aprovados</h1>
          <p className="mt-2 text-sm text-gray-700">
            Consulte as diárias que já foram aprovadas para pagamento.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr><td colSpan={7} className="text-center py-4">Carregando...</td></tr>
                  ) : recibos.map((recibo) => (
                    <tr key={recibo.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">{formatDate(recibo.data)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{recibo.funcionario?.nome}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{recibo.cliente?.nome}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{recibo.cliente?.empresa?.nome || '-'}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(recibo.valor)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 max-w-[200px] truncate" title={recibo.observacao || ''}>{recibo.observacao || '-'}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button onClick={() => handleGerarPdf(recibo.id)} className="text-blue-600 hover:text-blue-900" title="Gerar PDF">
                          <DocumentArrowDownIcon className="h-5 w-5 inline-block"/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recibos;