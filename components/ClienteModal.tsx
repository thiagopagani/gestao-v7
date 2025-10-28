import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Cliente, Empresa } from '../types';

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cliente: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt' | 'empresa'>) => void;
  cliente: Cliente | null;
}

const ClienteModal: React.FC<ClienteModalProps> = ({ isOpen, onClose, onSave, cliente }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    status: 'Ativo' as 'Ativo' | 'Inativo',
    empresaId: '',
  });

  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    // Fetch active empresas for the dropdown
    const fetchEmpresas = async () => {
      try {
        const response = await fetch('/api/empresas?status=Ativo');
        if (response.ok) {
          const data = await response.json();
          setEmpresas(data);
        }
      } catch (error) {
        console.error('Failed to fetch empresas', error);
      }
    };
    if (isOpen) {
        fetchEmpresas();
    }
  }, [isOpen]);

  useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome || '',
        cnpj: cliente.cnpj || '',
        endereco: cliente.endereco || '',
        telefone: cliente.telefone || '',
        status: cliente.status || 'Ativo',
        empresaId: cliente.empresaId?.toString() || '',
      });
    } else {
      // Reset form for new entry
      setFormData({
        nome: '',
        cnpj: '',
        endereco: '',
        telefone: '',
        status: 'Ativo',
        empresaId: '',
      });
    }
  }, [cliente, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.empresaId) {
      alert('Nome e Empresa são obrigatórios.');
      return;
    }
    onSave({
        ...formData,
        cnpj: formData.cnpj || null,
        endereco: formData.endereco || null,
        telefone: formData.telefone || null,
        empresaId: parseInt(formData.empresaId, 10),
    });
  };

  const modalTitle = cliente ? 'Editar Cliente / Obra' : 'Adicionar Novo Cliente / Obra';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome do Cliente / Obra</label>
            <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="empresaId" className="block text-sm font-medium text-gray-700">Empresa (Contratante)</label>
            <select id="empresaId" name="empresaId" value={formData.empresaId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
                <option value="" disabled>Selecione uma empresa</option>
                {empresas.map(empresa => (
                    <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ (Opcional)</label>
            <input type="text" name="cnpj" id="cnpj" value={formData.cnpj} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">Endereço (Opcional)</label>
            <input type="text" name="endereco" id="endereco" value={formData.endereco} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone (Opcional)</label>
            <input type="text" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Salvar
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ClienteModal;
