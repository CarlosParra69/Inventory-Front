import { useState, useEffect } from 'react';
import { Modal, Button } from '../../index';
import { categoriesService } from '../../../../api/categories.service';
import type { Category } from '../../../../types/category.types';
import "../../../../styles/shared.css"

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
  product?: { id: string | number; name: string; sku: string; description?: string | null; category_id: string };
}

export interface ProductFormData {
  name: string;
  sku: string;
  description?: string;
  category_id: string;
}

export const ProductFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false,
  product 
}: ProductFormModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    description: '',
    category_id: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar categorías cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  // Actualizar formData cuando cambia la prop product o cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          description: product.description || '',
          category_id: product.category_id || '',
        });
      } else {
        setFormData({
          name: '',
          sku: '',
          description: '',
          category_id: '',
        });
      }
      setErrors({});
    }
  }, [product, isOpen]);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    if (!formData.category_id) newErrors.category_id = 'La categoría es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      // No resetear aquí, se reseteará cuando se cierre el modal
    }
  };

  const handleClose = () => {
    setFormData({ name: '', sku: '', description: '', category_id: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={product ? 'Editar Producto' : 'Nuevo Producto'}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">Nombre del Producto </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Ej: Laptop"
          />
          {errors.name && <p className="form-error-message">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">SKU</label>
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
          <label className="form-label">Descripción </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Descripción del producto"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Categoría</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className={`form-input ${errors.category_id ? 'form-input-error' : ''}`}
            disabled={categoriesLoading}
          >
            <option value="">Seleccionar una categoría</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p className="form-error-message">{errors.category_id}</p>}
        </div>

        <div className="modal-footer">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="success" isLoading={isLoading}>
            {product ? 'Actualizar' : 'Crear'} Producto
          </Button>
        </div>
      </form>
    </Modal>
  );
};
