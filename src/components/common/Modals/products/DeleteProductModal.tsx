import { Modal, Button } from '../../index';
import { FiAlertTriangle } from 'react-icons/fi';

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  productName?: string;
}

export const DeleteProductModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  productName = 'este producto'
}: DeleteProductModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      title="Confirmar eliminación"
      onClose={onClose}
      size="sm"
    >
      <div className="flex flex-col items-center gap-4">
        <FiAlertTriangle className="text-4xl text-red-500" />
        <div className="text-center">
          <p className="text-dark-700 dark:text-dark-300 mb-2">
            ¿Estás seguro de que deseas eliminar <strong>{productName}</strong>?
          </p>
          <p className="text-sm text-dark-500 dark:text-dark-400">
            Esta acción no se puede deshacer.
          </p>
          <br />
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
          Eliminar
        </Button>
      </div>
    </Modal>
  );
};
