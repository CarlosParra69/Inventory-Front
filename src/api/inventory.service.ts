import apiClient from './client';
import type {
  InventoryMovement,
  InventoryEntryRequest,
  InventoryExitRequest,
  StockItem,
} from '../types/inventory.types';

export const inventoryService = {
  /**
   * Registra una entrada de inventario (aumenta stock)
   */
  registerEntry: async (entry: InventoryEntryRequest): Promise<InventoryMovement> => {
    const response = await apiClient.post<InventoryMovement>('/inventory/in', entry);
    return response.data;
  },

  /**
   * Registra una salida de inventario (disminuye stock)
   */
  registerExit: async (exit: InventoryExitRequest): Promise<InventoryMovement> => {
    const response = await apiClient.post<InventoryMovement>('/inventory/out', exit);
    return response.data;
  },

  /**
   * Obtiene el stock actual de todos los productos
   */
  getStock: async (): Promise<StockItem[]> => {
    const response = await apiClient.get<StockItem[]>('/inventory/stock');
    return response.data;
  },
};

