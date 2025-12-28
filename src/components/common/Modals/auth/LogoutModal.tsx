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
        <div className="p-3 bg-white-100 dark:bg-dark-900 rounded-full">
          <FiLogOut className="text-2xl text-white-600 dark:text-white-400" />
        </div>
        <div className="text-center">
          <p className="text-dark-700 dark:text-dark-300 mb-2">
            ¿Estás seguro de que deseas cerrar sesión?
          </p>
          <p className="text-sm text-dark-500 dark:text-dark-400">
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
