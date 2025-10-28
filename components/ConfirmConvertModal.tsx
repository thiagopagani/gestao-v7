// FIX: This file had invalid content. Creating a confirmation modal for converting an employee's type from 'Treinamento' to 'Autônomo'.

import React from 'react';
import Modal from './Modal';
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';

interface ConfirmConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  funcionarioNome: string;
}

const ConfirmConvertModal: React.FC<ConfirmConvertModalProps> = ({ isOpen, onClose, onConfirm, funcionarioNome }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Converter Funcionário">
      <div className="flex items-start">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
          <ArrowUpOnSquareIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <p className="text-sm text-gray-500">
            Tem certeza que deseja converter o funcionário "{funcionarioNome}" de 'Treinamento' para 'Autônomo'?
          </p>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={onConfirm}
        >
          Converter
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmConvertModal;
