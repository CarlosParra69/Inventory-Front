import type { ReactNode } from 'react';
import { FiX } from 'react-icons/fi';
import './styles/Modal.css';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal = ({ 
  isOpen, 
  title, 
  onClose, 
  children, 
  footer,
  size = 'md' 
}: ModalProps) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClass = `modal-content-${size}`;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-content ${sizeClass}`}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <FiX />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};
