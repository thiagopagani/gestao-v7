// FIX: This file had invalid content. Created a new modal component for adding and editing employee information.
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Funcionario, Empresa } from '../types';

interface FuncionarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (funcionario: Omit<Funcionario, 'id' | 'createdAt' | 'updatedAt' | 'empresa'>) => void;
  funcionario: Funcionario | null;
}

const FuncionarioModal: React.FC<FuncionarioModalProps> = ({ isOpen, onClose, onSave, funcionario }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    empresaId: '',
    telefone: '',
    tipo: 'Treinamento',
    status: 'Ativo',
  });
  
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  
  useEffect(() => {
    // Fetch empresas for the dropdown
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
    if (funcionario) {
      setFormData({
        nome: funcionario.nome || '',
        cpf: funcionario.cpf || '',
        email: funcionario.email || '',
        empresaId: funcionario.empresaId?.toString() || '',
        telefone: funcionario.telefone || '',
        tipo: funcionario.tipo || 'Treinamento',
        status: funcionario.status || 'Ativo',
      });
    } else {
      setFormData({
        nome: '',
        cpf: '',
        email: '',
        empresaId: '',
        telefone: '',
        tipo: 'Treinamento',
        status: 'Ativo',
      });
    }
  }, [funcionario, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.cpf || !formData.empresaId) {
      alert('Nome, CPF e Empresa são obrigatórios.');
      return;
    }
    onSave({ 
        ...formData,
        email: formData.email || null,
        empresaId: parseInt(formData.empresaId, 10),
        tipo: formData.tipo as 'Autônomo' | 'Treinamento',
        status: formData.status as 'Ativo' | 'Inativo',
    });
  };
  
  const modalTitle = funcionario ? 'Editar Funcionário' : 'Adicionar Novo Funcionário';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
            <input type="text" name="cpf" id="cpf" value={formData.cpf} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="empresaId" className="block text-sm font-medium text-gray-700">Empresa (Vínculo)</label>
            <select id="empresaId" name="empresaId" value={formData.empresaId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
                <option value="" disabled>Selecione uma empresa</option>
                {empresas.map(empresa => (
                    <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
            <input type="text" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo</label>
            <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
              <option>Treinamento</option>
              <option>Autônomo</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
              <option>Ativo</option>
              <option>Inativo</option>
            </select>
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

export default FuncionarioModal;