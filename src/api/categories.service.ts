import apiClient from './client';
import type { Category, CategoryRequest, CategoryUpdateRequest } from '../types/category.types';

export const categoriesService = {
  /**
   * Obtiene todas las categorías
   */
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  /**
   * Obtiene una categoría por ID
   */
  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  /**
   * Crea una nueva categoría
   */
  create: async (category: CategoryRequest): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories', category);
    return response.data;
  },

  /**
   * Actualiza una categoría existente
   */
  update: async (id: string, category: CategoryUpdateRequest): Promise<Category> => {
    const response = await apiClient.put<Category>(`/categories/${id}`, category);
    return response.data;
  },

  /**
   * Elimina una categoría
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};

