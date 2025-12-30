import { useState, useEffect } from 'react';
import { Modal, Button } from '../../index';

interface StockExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StockExitData) => void;
  isLoading?: boolean;
  productName?: string;
  availableStock?: number;
}

export interface StockExitData {
  quantity: number;
  reason: string;
}

export const StockExitModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false,
  productName = 'Producto',
  availableStock = 0
}: StockExitModalProps) => {
  const [quantityInput, setQuantityInput] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setQuantityInput('');
      setReason('');
      setErrors({});
    }
  }, [isOpen]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir campo vacío o solo números
    if (value === '' || /^\d+$/.test(value)) {
      setQuantityInput(value);
      if (errors.quantity) {
        setErrors(prev => ({ ...prev, quantity: '' }));
      }
    }
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setReason(value);
    if (errors.reason) {
      setErrors(prev => ({ ...prev, reason: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const quantity = parseInt(quantityInput) || 0;
    if (quantity <= 0) newErrors.quantity = 'La cantidad debe ser mayor a 0';
    if (quantity > availableStock) newErrors.quantity = `No hay suficiente stock (disponible: ${availableStock})`;
    if (!reason.trim()) newErrors.reason = 'La razón es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        quantity: parseInt(quantityInput) || 0,
        reason: reason.trim(),
      });
    }
  };

  const handleClose = () => {
    setQuantityInput('');
    setReason('');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={`Salida de Stock - ${productName}`}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">
            Cantidad disponible: {availableStock}
          </label>
          <div>
            <input
              type="text"
              inputMode="numeric"
              value={quantityInput}
              onChange={handleQuantityChange}
              className={`form-input ${errors.quantity ? 'form-input-error' : ''}`}
              placeholder="Cantidad a retirar"
            />
          </div>
          
          {errors.quantity && <p className="form-error-message">{errors.quantity}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Razón: </label>
          <textarea
            name="reason"
            value={reason}
            onChange={handleReasonChange}
            className={`form-textarea ${errors.reason ? 'form-textarea-error' : ''}`}
            placeholder="Ej: Venta a cliente, Pérdida/Daño, Devolución"
            rows={3}
          />
          {errors.reason && <p className="form-error-message">{errors.reason}</p>}
        </div>

        <div className="modal-footer">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="danger" isLoading={isLoading}>
            Registrar Salida
          </Button>
        </div>
      </form>
    </Modal>
  );
};
