import { useState } from 'react';
import { Modal, Button } from '../../index';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
  product?: { id: string | number; name: string; sku: string; description?: string | null };
}

export interface ProductFormData {
  name: string;
  sku: string;
  description?: string;
}

export const ProductFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false,
  product 
}: ProductFormModalProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    sku: product?.sku || '',
    description: product?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.sku.trim()) newErrors.sku = 'El SKU es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      setFormData({ name: '', sku: '', description: '' });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={product ? 'Editar Producto' : 'Nuevo Producto'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">Nombre del Producto *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'form-input-error' : ''}`}
            placeholder="Ej: Laptop"
          />
          {errors.name && <p className="form-error-message">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">SKU *</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className={`form-input ${errors.sku ? 'form-input-error' : ''}`}
            placeholder="Ej: LAPTOP-001"
          />
          {errors.sku && <p className="form-error-message">{errors.sku}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Descripción del producto"
            rows={4}
          />
        </div>

        <div className="modal-footer">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {product ? 'Actualizar' : 'Crear'} Producto
          </Button>
        </div>
      </form>
    </Modal>
  );
};
