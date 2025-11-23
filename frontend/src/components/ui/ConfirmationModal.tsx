import React from 'react';
import Modal from './Modal';
import { AlertTriangleIcon } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
}
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-blue-600 hover:bg-blue-700'
}) => {
  return <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangleIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-700">{message}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm text-white rounded-md ${confirmButtonClass}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>;
};
export default ConfirmationModal;