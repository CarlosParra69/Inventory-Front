import apiClient from './client';
import type { Product, ProductRequest, ProductUpdateRequest } from '../types/product.types';

export const productsService = {
  /**
   * Obtiene todos los productos
   */
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  },

  /**
   * Obtiene un producto por ID
   */
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Crea un nuevo producto
   */
  create: async (product: ProductRequest): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', product);
    return response.data;
  },

  /**
   * Actualiza un producto existente
   */
  update: async (id: string, product: ProductUpdateRequest): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  /**
   * Elimina un producto
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};

