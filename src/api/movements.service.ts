import  apiClient  from './client';

export interface InventoryMovement {
  id: string;
  product_id: string;
  movement_type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  productName?: string;
  created_at: string;
}

export interface PaginatedMovements {
  data: InventoryMovement[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const movementsService = {
  // Obtener todos los movimientos con paginación
  async getAll(page: number = 1): Promise<PaginatedMovements> {
    const response = await apiClient.get(`/movements?page=${page}`);
    return response.data;
  },

  // Obtener movimientos de entrada (IN)
  async getEntries(page: number = 1): Promise<PaginatedMovements> {
    const response = await apiClient.get(`/movements/entries?page=${page}`);
    return response.data;
  },

  // Obtener movimientos de salida (OUT)
  async getExits(page: number = 1): Promise<PaginatedMovements> {
    const response = await apiClient.get(`/movements/exits?page=${page}`);
    return response.data;
  },

  // Obtener movimientos por producto
  async getByProductId(productId: string, page: number = 1): Promise<PaginatedMovements> {
    const response = await apiClient.get(`/movements/product/${productId}?page=${page}`);
    return response.data;
  },
};
