import { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { categoriesService } from '../../api/categories.service';
import { Card, Button, Loading } from '../../components/common';
import { CategoryFormModal, DeleteCategoryModal } from '../../components/common/Modals';
import type { Category } from '../../types/category.types';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

export const CategoriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Error al cargar categorías');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewCategory = () => {
    setSelectedCategory(null);
    setShowFormModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowFormModal(true);
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedCategory) {
        await categoriesService.update(selectedCategory.id, data);
        await Swal.fire({
          icon: 'success',
          title: 'Categoría actualizada',
          text: 'La categoría ha sido actualizada exitosamente.',
          confirmButtonColor: '#2563eb',
        });
      } else {
        await categoriesService.create(data);
        await Swal.fire({
          icon: 'success',
          title: 'Categoría creada',
          text: 'La categoría ha sido creada exitosamente.',
          confirmButtonColor: '#2563eb',
        });
      }
      setShowFormModal(false);
      loadCategories();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Error al guardar categoría';
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#2563eb',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    setIsSubmitting(true);
    try {
      await categoriesService.delete(selectedCategory.id);
      await Swal.fire({
        icon: 'success',
        title: 'Categoría eliminada',
        text: 'La categoría ha sido eliminada exitosamente.',
        confirmButtonColor: '#2563eb',
      });
      setShowDeleteModal(false);
      loadCategories();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Error al eliminar categoría';
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#2563eb',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading text="Cargando categorías..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <Button onClick={loadCategories} variant="outline" className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categorías</h1>
        {isAdmin && (
          <Button variant="success" onClick={handleNewCategory}>
            <FiPlus /> Nueva Categoría
          </Button>
        )}
      </div>
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card 
            key={category.id} 
            title={category.name}
            actions={
              isAdmin && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                  >
                    <FiEdit2 />
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDeleteClick(category)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              )
            }
          >
            {category.description && (
              <p className="text-gray-600 mb-4">{category.description}</p>
            )}
          </Card>
        ))}
      </div>
      {categories.length === 0 && (
        <Card>
          <p className="text-center text-gray-500">No hay categorías registradas</p>
        </Card>
      )}

      <CategoryFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
        category={selectedCategory || undefined}
      />

      <DeleteCategoryModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isSubmitting}
        categoryName={selectedCategory?.name}
      />
    </div>
  );
};

