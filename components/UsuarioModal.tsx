import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { User } from '../types';

interface UsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<User> & { password?: string }) => void;
  user: User | null;
}

const UsuarioModal: React.FC<UsuarioModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    papel: 'Operador',
    status: 'Ativo',
  });

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        password: '', // Password is not sent from API, so it's always empty on edit
        papel: user.papel || 'Operador',
        status: user.status || 'Ativo',
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        password: '',
        papel: 'Operador',
        status: 'Ativo',
      });
    }
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.email) {
      alert('Nome e Email são obrigatórios.');
      return;
    }
    if (!isEditing && !formData.password) {
        alert('Senha é obrigatória para novos usuários.');
        return;
    }
    
    const dataToSave: Partial<User> & { password?: string } = {
        nome: formData.nome,
        email: formData.email,
        papel: formData.papel as 'Admin' | 'Operador',
        status: formData.status as 'Ativo' | 'Inativo',
    };

    if (formData.password) {
        dataToSave.password = formData.password;
    }
    
    onSave(dataToSave);
  };
  
  const modalTitle = user ? 'Editar Usuário' : 'Adicionar Novo Usuário';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha {isEditing ? '(Deixe em branco para não alterar)' : ''}
            </label>
            <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required={!isEditing} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="papel" className="block text-sm font-medium text-gray-700">Papel</label>
            <select id="papel" name="papel" value={formData.papel} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
              <option>Operador</option>
              <option>Admin</option>
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

export default UsuarioModal;