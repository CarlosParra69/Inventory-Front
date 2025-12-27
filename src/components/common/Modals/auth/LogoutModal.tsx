import { Modal, Button } from '../../index';
import { FiLogOut } from 'react-icons/fi';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  userName?: string;
}

export const LogoutModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  userName = 'Usuario'
}: LogoutModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      title="Cerrar Sesión"
      onClose={onClose}
      size="sm"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
          <FiLogOut className="text-2xl text-blue-600 dark:text-blue-400" />
        </div>
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            ¿Estás seguro de que deseas cerrar sesión?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sesión de: <strong>{userName}</strong>
          </p>
        </div>
      </div>

      <div className="modal-footer">
        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button 
          type="button" 
          variant="danger" 
          onClick={onConfirm} 
          isLoading={isLoading}
        >
          Cerrar Sesión
        </Button>
      </div>
    </Modal>
  );
};
