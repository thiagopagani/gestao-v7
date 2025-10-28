import React, { useState, useEffect, useCallback } from 'react';
import { Empresa, Cliente, Diaria } from '../types';

const Relatorios: React.FC = () => {
  // State for filters
  const [empresasFiltro, setEmpresasFiltro] = useState<Empresa[]>([]);
  const [clientesFiltro, setClientesFiltro] = useState<Cliente[]>([]);
  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');

  // State for data
  const [diarias, setDiarias] = useState<Diaria[]>([]);
  const [summary, setSummary] = useState<{ totalValor: number; totalDiarias: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch filter options (empresas, clientes)
  useEffect(() => {
    const fetchFiltroData = async () => {
      try {
        const [empresaRes, cliRes] = await Promise.all([
          fetch('/api/empresas?status=Ativo'),
          fetch('/api/clientes?status=Ativo')
        ]);
        if (empresaRes.ok) setEmpresasFiltro(await empresaRes.json());
        if (cliRes.ok) setClientesFiltro(await cliRes.json());
      } catch (err) {
        console.error("Failed to fetch filter data", err);
      }
    };
    fetchFiltroData();
  }, []);

  const handleGenerateReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDiarias([]);
    setSummary(null);

    const params = new URLSearchParams();
    if (filtroEmpresa) params.append('empresaId', filtroEmpresa);
    if (filtroCliente) params.append('clienteId', filtroCliente);
    if (filtroStatus) params.append('status', filtroStatus);
    if (filtroDataInicio) params.append('dataInicio', filtroDataInicio);
    if (filtroDataFim) params.append('dataFim', filtroDataFim);
    
    const query = params.toString();

    try {
      const [diariasRes, summaryRes] = await Promise.all([
        fetch(`/api/diarias?${query}`),
        fetch(`/api/relatorios?${query}`)
      ]);

      if (!diariasRes.ok || !summaryRes.ok) {
        throw new Error('Falha ao buscar dados para o relatório.');
      }

      const diariasData = await diariasRes.json();
      const summaryData = await summaryRes.json();

      setDiarias(diariasData);
      setSummary(summaryData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filtroEmpresa, filtroCliente, filtroStatus, filtroDataInicio, filtroDataFim]);
  
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
          <h1 className="text-3xl font-bold text-slate-800">Relatórios</h1>
          <p className="mt-2 text-sm text-gray-700">Gere relatórios de diárias com filtros.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div>
                <label htmlFor="filtroDataInicio" className="block text-sm font-medium text-gray-700">De</label>
                <input type="date" name="filtroDataInicio" id="filtroDataInicio" value={filtroDataInicio} onChange={(e) => setFiltroDataInicio(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="filtroDataFim" className="block text-sm font-medium text-gray-700">Até</label>
                <input type="date" name="filtroDataFim" id="filtroDataFim" value={filtroDataFim} onChange={(e) => setFiltroDataFim(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="filtroEmpresa" className="block text-sm font-medium text-gray-700">Empresa</label>
                <select id="filtroEmpresa" value={filtroEmpresa} onChange={(e) => setFiltroEmpresa(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
                    <option value="">Todas</option>
                    {empresasFiltro.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
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
            <div className="flex items-end">
                 <button
                    type="button"
                    onClick={handleGenerateReport}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
                >
                    {loading ? 'Gerando...' : 'Gerar Relatório'}
                </button>
            </div>
        </div>
      </div>
      
      {error && <div className="mt-4 rounded-md bg-red-50 p-4"><p className="text-sm font-medium text-red-800">{error}</p></div>}
      
      {summary && !loading && (
        <div className="mt-8">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Valor Total</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{formatCurrency(summary.totalValor)}</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Total de Diárias</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{summary.totalDiarias}</dd>
                </div>
            </dl>
        </div>
      )}

      {diarias.length > 0 && !loading && (
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
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {diarias.map((diaria) => (
                      <tr key={diaria.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">{formatDate(diaria.data)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{diaria.funcionario?.nome}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{diaria.cliente?.nome}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{diaria.cliente?.empresa?.nome || '-'}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(diaria.valor)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusClass(diaria.status)}`}>
                            {diaria.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {summary && diarias.length === 0 && !loading && (
        <div className="mt-8 text-center text-gray-500">
          <p>Nenhum registro encontrado para os filtros selecionados.</p>
        </div>
      )}

    </div>
  );
};

export default Relatorios;