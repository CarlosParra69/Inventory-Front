import { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { productsService } from '../../api/products.service';
import { Card, Button, Loading } from '../../components/common';
import type { Product } from '../../types/product.types';

export const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productsService.getAll();
      setProducts(data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading text="Cargando productos..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <Button onClick={loadProducts} variant="outline" className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Button variant="primary">Nuevo Producto</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} title={product.name}>
            <p className="text-gray-600 mb-2">SKU: {product.sku}</p>
            {product.description && (
              <p className="text-gray-600 mb-4">{product.description}</p>
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
      {products.length === 0 && (
        <Card>
          <p className="text-center text-gray-500">No hay productos registrados</p>
        </Card>
      )}
    </div>
  );
};

