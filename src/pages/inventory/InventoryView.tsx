import { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { inventoryService } from '../../api/inventory.service';
import { Card, Button, Loading } from '../../components/common';
import type { StockItem } from '../../types/inventory.types';

export const InventoryView = () => {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <h1 className="text-3xl font-bold">Inventario</h1>
        <div className="flex gap-2">
          <Button variant="primary">Entrada</Button>
          <Button variant="secondary">Salida</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stock.map((item) => (
          <Card key={item.product_id} title={item.product_name}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{item.stock}</p>
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
    </div>
  );
};

