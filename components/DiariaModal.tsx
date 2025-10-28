import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Diaria, Funcionario, Cliente } from '../types';

interface DiariaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (diaria: Omit<Diaria, 'id' | 'createdAt' | 'updatedAt' | 'funcionario' | 'cliente'>) => void;
  diaria: Diaria | null;
}

const DiariaModal: React.FC<DiariaModalProps> = ({ isOpen, onClose, onSave, diaria }) => {
  const [formData, setFormData] = useState({
    data: '',
    valor: '',
    status: 'Pendente',
    observacao: '',
    funcionarioId: '',
    clienteId: '',
  });

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [funcRes, cliRes] = await Promise.all([
          fetch('/api/funcionarios?status=Ativo'),
          fetch('/api/clientes?status=Ativo')
        ]);
        if (funcRes.ok) setFuncionarios(await funcRes.json());
        if (cliRes.ok) setClientes(await cliRes.json());
      } catch (error) {
        console.error('Failed to fetch data for modal', error);
      }
    };
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (diaria) {
      setFormData({
        data: diaria.data.split('T')[0], // format for input type="date"
        valor: diaria.valor.toString(),
        status: diaria.status,
        observacao: diaria.observacao || '',
        funcionarioId: diaria.funcionarioId.toString(),
        clienteId: diaria.clienteId.toString(),
      });
    } else {
      setFormData({
        data: new Date().toISOString().split('T')[0],
        valor: '',
        status: 'Pendente',
        observacao: '',
        funcionarioId: '',
        clienteId: '',
      });
    }
  }, [diaria, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.data || !formData.valor || !formData.funcionarioId || !formData.clienteId) {
      alert('Todos os campos, exceto observação, são obrigatórios.');
      return;
    }
    onSave({
      ...formData,
      valor: parseFloat(formData.valor),
      funcionarioId: parseInt(formData.funcionarioId, 10),
      clienteId: parseInt(formData.clienteId, 10),
      status: formData.status as 'Pendente' | 'Aprovado' | 'Cancelado',
      observacao: formData.observacao || null,
    });
  };

  const modalTitle = diaria ? 'Editar Diária' : 'Lançar Nova Diária';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="data" className="block text-sm font-medium text-gray-700">Data</label>
            <input type="date" name="data" id="data" value={formData.data} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="funcionarioId" className="block text-sm font-medium text-gray-700">Funcionário</label>
            <select id="funcionarioId" name="funcionarioId" value={formData.funcionarioId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
              <option value="" disabled>Selecione um funcionário</option>
              {funcionarios.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="clienteId" className="block text-sm font-medium text-gray-700">Cliente / Obra</label>
            <select id="clienteId" name="clienteId" value={formData.clienteId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
              <option value="" disabled>Selecione um cliente</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="valor" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
            <input type="number" step="0.01" name="valor" id="valor" value={formData.valor} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
              <option>Pendente</option>
              <option>Aprovado</option>
              <option>Cancelado</option>
            </select>
          </div>
           <div>
            <label htmlFor="observacao" className="block text-sm font-medium text-gray-700">Observação</label>
            <textarea name="observacao" id="observacao" rows={3} value={formData.observacao} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
        </div>
        <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
          <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
            Salvar
          </button>
          <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DiariaModal;