import React, { useState, useEffect, useCallback } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import UsuarioModal from '../components/UsuarioModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { User } from '../types';

const API_URL = '/api/users';

const Usuarios: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Falha ao buscar dados dos usuários.');
      }
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  const handleOpenAddModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  
  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleSave = async (userData: Partial<User> & { password?: string }) => {
    const method = selectedUser ? 'PUT' : 'POST';
    const url = selectedUser ? `${API_URL}/${selectedUser.id}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error(`Falha ao ${selectedUser ? 'atualizar' : 'criar'} usuário.`);
      }
      handleCloseModals();
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      const response = await fetch(`${API_URL}/${selectedUser.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Falha ao desativar usuário.');
      }
      handleCloseModals();
      fetchUsers();
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
          <h1 className="text-3xl font-bold text-slate-800">Usuários do Sistema</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie os usuários que podem acessar o sistema.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Adicionar Usuário
          </button>
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
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Papel</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-4">Carregando...</td></tr>
                  ) : users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{user.nome}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                       <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.papel}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusClass(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button onClick={() => handleOpenEditModal(user)} className="text-blue-600 hover:text-blue-900 mr-4"><PencilIcon className="h-5 w-5 inline-block"/></button>
                        <button onClick={() => handleOpenDeleteModal(user)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5 inline-block"/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <UsuarioModal
        isOpen={isModalOpen}
        onClose={handleCloseModals}
        onSave={handleSave}
        user={selectedUser}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDelete}
        title="Desativar Usuário"
        message={`Tem certeza de que deseja desativar o usuário "${selectedUser?.nome}"? Ele não poderá mais acessar o sistema.`}
        confirmText="Desativar"
        variant="primary"
      />
    </div>
  );
};

export default Usuarios;
