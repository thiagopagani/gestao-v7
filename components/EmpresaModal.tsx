import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Empresa } from '../types';

interface EmpresaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (empresa: Omit<Empresa, 'id' | 'createdAt' | 'updatedAt'>) => void;
  empresa: Empresa | null;
}

const EmpresaModal: React.FC<EmpresaModalProps> = ({ isOpen, onClose, onSave, empresa }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    cidade: '',
    estado: '',
    telefone: '',
    status: 'Ativo' as 'Ativo' | 'Inativo',
  });

  useEffect(() => {
    if (empresa) {
      setFormData({
        nome: empresa.nome || '',
        cnpj: empresa.cnpj || '',
        endereco: empresa.endereco || '',
        cidade: empresa.cidade || '',
        estado: empresa.estado || '',
        telefone: empresa.telefone || '',
        status: empresa.status || 'Ativo',
      });
    } else {
      // Reset form for new entry
      setFormData({
        nome: '',
        cnpj: '',
        endereco: '',
        cidade: '',
        estado: '',
        telefone: '',
        status: 'Ativo',
      });
    }
  }, [empresa, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome) {
      alert('Nome é obrigatório.');
      return;
    }
    onSave({
      ...formData,
      cnpj: formData.cnpj || null,
      endereco: formData.endereco || null,
      cidade: formData.cidade || null,
      estado: formData.estado || null,
      telefone: formData.telefone || null,
    });
  };

  const modalTitle = empresa ? 'Editar Empresa' : 'Adicionar Nova Empresa';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
            <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ (Opcional)</label>
            <input type="text" name="cnpj" id="cnpj" value={formData.cnpj} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">Endereço (Opcional)</label>
            <input type="text" name="endereco" id="endereco" value={formData.endereco} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade (Opcional)</label>
              <input type="text" name="cidade" id="cidade" value={formData.cidade} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado (Opcional)</label>
              <input type="text" name="estado" id="estado" value={formData.estado} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
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

export default EmpresaModal;
