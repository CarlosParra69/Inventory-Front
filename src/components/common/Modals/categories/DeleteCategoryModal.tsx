import { Modal, Button } from '../../index';
import { FiAlertTriangle } from 'react-icons/fi';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  categoryName?: string;
}

export const DeleteCategoryModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  categoryName = 'esta categoría'
}: DeleteCategoryModalProps) => {
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
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            ¿Estás seguro de que deseas eliminar la categoría <strong>{categoryName}</strong>?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Esta acción no se puede deshacer.
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
          Eliminar
        </Button>
      </div>
    </Modal>
  );
};
