import { useState } from 'react';
import { Modal, Button } from '../../index';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  isLoading?: boolean;
  category?: { id: string | number; name: string; description?: string | null };
}

export interface CategoryFormData {
  name: string;
  description?: string;
}

export const CategoryFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false,
  category 
}: CategoryFormModalProps) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || '',
    description: category?.description || '',
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      setFormData({ name: '', description: '' });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={category ? 'Editar Categoría' : 'Nueva Categoría'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">Nombre de la Categoría</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'form-input-error' : ''}`}
            placeholder="Ej: Electrónica"
          />
          {errors.name && <p className="form-error-message">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Descripción de la categoría"
            rows={4}
          />
        </div>

        <div className="modal-footer">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="success" isLoading={isLoading}>
            {category ? 'Actualizar' : 'Crear'} Categoría
          </Button>
        </div>
      </form>
    </Modal>
  );
};
