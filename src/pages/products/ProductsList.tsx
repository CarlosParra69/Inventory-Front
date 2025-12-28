import { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { productsService } from '../../api/products.service';
import { Card, Button, Loading } from '../../components/common';
import { ProductFormModal, DeleteProductModal } from '../../components/common/Modals';
import type { Product } from '../../types/product.types';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

export const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

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

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setShowFormModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowFormModal(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedProduct) {
        await productsService.update(selectedProduct.id, data);
      } else {
        await productsService.create(data);
      }
      setShowFormModal(false);
      loadProducts();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Error al guardar producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    try {
      await productsService.delete(selectedProduct.id);
      setShowDeleteModal(false);
      loadProducts();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Error al eliminar producto');
    } finally {
      setIsSubmitting(false);
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
        <h1 className="text-3xl font-bold gap-6">Productos</h1>
        {isAdmin && (
          <Button variant="success" onClick={handleNewProduct}>
            <FiPlus /> Nuevo Producto
          </Button>
        )}
        
      </div>
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card 
            key={product.id} 
            title={product.name}
            actions={
              isAdmin && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                  >
                    <FiEdit2 />
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              )
            }
          >
            <p className="text-gray-600 mb-2">SKU: {product.sku}</p>
            {product.description && (
              <p className="text-gray-600 mb-4">{product.description}</p>
            )}
          </Card>
        ))}
      </div>
      {products.length === 0 && (
        <Card>
          <p className="text-center text-gray-500">No hay productos registrados</p>
        </Card>
      )}

      <ProductFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
        product={selectedProduct || undefined}
      />

      <DeleteProductModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isSubmitting}
        productName={selectedProduct?.name}
      />
    </div>
  );
};

