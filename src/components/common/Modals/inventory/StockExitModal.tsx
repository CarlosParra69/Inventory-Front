import { useState } from 'react';
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
  const [formData, setFormData] = useState<StockExitData>({
    quantity: 0,
    reason: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'quantity' ? parseInt(value) || 0 : value 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.quantity <= 0) newErrors.quantity = 'La cantidad debe ser mayor a 0';
    if (formData.quantity > availableStock) newErrors.quantity = `No hay suficiente stock (disponible: ${availableStock})`;
    if (!formData.reason.trim()) newErrors.reason = 'La razón es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      setFormData({ quantity: 0, reason: '' });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={`Salida de Stock - ${productName}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">
            Cantidad disponible: {availableStock}
          </label>
          <div>
            <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className={`form-input ${errors.quantity ? 'form-input-error' : ''}`}
            placeholder="Cantidad a retirar"
            min="1"
            max={availableStock}
            />
          </div>
          
          {errors.quantity && <p className="form-error-message">{errors.quantity}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Razón: </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className={`form-textarea ${errors.reason ? 'form-textarea-error' : ''}`}
            placeholder="Ej: Venta a cliente, Pérdida/Daño, Devolución"
            rows={3}
          />
          {errors.reason && <p className="form-error-message">{errors.reason}</p>}
        </div>

        <div className="modal-footer">
          <Button type="button" variant="ghost" onClick={onClose}>
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
