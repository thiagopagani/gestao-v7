import React from 'react';
import Modal from './Modal';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  variant?: 'danger' | 'primary';
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = "Confirmar",
  variant = 'danger'
}) => {
  
  const buttonColorClass = variant === 'danger' 
    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';

  const iconColorClass = variant === 'danger' ? 'text-red-600' : 'text-blue-600';
  const iconBgColorClass = variant === 'danger' ? 'bg-red-100' : 'bg-blue-100';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="sm:flex sm:items-start">
        <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${iconBgColorClass} sm:mx-0 sm:h-10 sm:w-10`}>
          <ExclamationTriangleIcon className={`h-6 w-6 ${iconColorClass}`} aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <p className="text-sm text-gray-500">
            {message}
          </p>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${buttonColorClass}`}
          onClick={onConfirm}
        >
          {confirmText}
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

export default ConfirmDeleteModal;