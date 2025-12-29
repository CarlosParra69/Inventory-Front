import { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { productsService } from '../../api/products.service';
import { categoriesService } from '../../api/categories.service';
import { inventoryService } from '../../api/inventory.service';
import { Card, Button, Loading } from '../../components/common';
import { ProductFormModal, DeleteProductModal } from '../../components/common/Modals';
import type { Product } from '../../types/product.types';
import type { Category } from '../../types/category.types';
import type { StockItem } from '../../types/inventory.types';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

export const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, categoriesData, stockData] = await Promise.all([
        productsService.getAll(),
        categoriesService.getAll(),
        inventoryService.getStock(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setStockItems(stockData);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || 'Sin categoría';
  };

  const getProductStock = (productId: string): number | null => {
    const stockItem = stockItems.find((item) => item.product_id === productId);
    return stockItem?.stock ?? null;
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
      loadData();
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
      loadData();
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
        <Button onClick={loadData} variant="outline" className="mt-4">
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
              <p className="text-gray-600 mb-2">{product.description}</p>
            )}
            {(() => {
              const stock = getProductStock(product.id);
              return stock !== null ? (
                <p className="text-gray-600 mb-2">
                  Unidades en stock: <strong>{stock}</strong>
                </p>
              ) : null;
            })()}
            <p className="text-gray-600">
              Categoría: <strong>{getCategoryName(product.category_id)}</strong>
            </p>
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

