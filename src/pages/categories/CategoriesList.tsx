import { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { categoriesService } from '../../api/categories.service';
import { Card, Button, Loading } from '../../components/common';
import type { Category } from '../../types/category.types';

export const CategoriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <Button variant="primary">Nueva Categoría</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} title={category.name}>
            {category.description && (
              <p className="text-gray-600 mb-4">{category.description}</p>
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Editar
              </Button>
              <Button variant="danger" size="sm">
                Eliminar
              </Button>
            </div>
          </Card>
        ))}
      </div>
      {categories.length === 0 && (
        <Card>
          <p className="text-center text-gray-500">No hay categorías registradas</p>
        </Card>
      )}
    </div>
  );
};

