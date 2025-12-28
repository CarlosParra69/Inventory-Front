import { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { inventoryService } from '../../api/inventory.service';
import { Card, Button, Loading } from '../../components/common';
import { StockEntryModal, StockExitModal} from '../../components/common/Modals';
import type { StockItem } from '../../types/inventory.types';
import { FiPlus, FiMinus} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

export const InventoryView = () => {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    try {
      setIsLoading(true);
      const data = await inventoryService.getStock();
      setStock(data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Error al cargar inventario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEntryClick = (item: StockItem) => {
    setSelectedItem(item);
    setShowEntryModal(true);
  };

  const handleExitClick = (item: StockItem) => {
    setSelectedItem(item);
    setShowExitModal(true);
  };

  const handleEntrySubmit = async (data: any) => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      await inventoryService.registerEntry({
        productId: selectedItem.product_id,
        quantity: data.quantity,
        reason: data.reason,
      });
      setShowEntryModal(false);
      loadStock();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Error al registrar entrada');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExitSubmit = async (data: any) => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      await inventoryService.registerExit({
        productId: selectedItem.product_id,
        quantity: data.quantity,
        reason: data.reason,
      });
      setShowExitModal(false);
      loadStock();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Error al registrar salida');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading text="Cargando inventario..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <Button onClick={loadStock} variant="outline" className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Stock del Inventario</h1>
      </div>
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stock.map((item) => (
          <Card 
            key={item.product_id} 
            title={item.product_name}
            actions={
              isAdmin && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEntryClick(item)}
                    title="Entrada de stock"
                  >
                    <FiPlus />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExitClick(item)}
                    title="Salida de stock"
                  >
                    <FiMinus />
                  </Button>
                </div>
              )
            }
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-dark-600">{item.stock}</p>
                <p className="text-sm text-gray-500">unidades en stock</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {stock.length === 0 && (
        <Card>
          <p className="text-center text-gray-500">No hay productos en inventario</p>
        </Card>
      )}

      <StockEntryModal
        isOpen={showEntryModal}
        onClose={() => setShowEntryModal(false)}
        onSubmit={handleEntrySubmit}
        isLoading={isSubmitting}
        productName={selectedItem?.product_name}
      />

      <StockExitModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onSubmit={handleExitSubmit}
        isLoading={isSubmitting}
        productName={selectedItem?.product_name}
        availableStock={selectedItem?.stock}
      />
    </div>
  );
};

