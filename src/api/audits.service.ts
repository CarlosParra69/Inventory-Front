import  apiClient from './client';

export interface AuditLog {
  id: string;
  user_id: string;
  role: string;
  action: string;
  resource: string;
  resource_id: string;
  ip: string;
  userName?: string;
  resourceName?: string;
  created_at: string;
}

export interface PaginatedAudits {
  data: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const auditsService = {
  // Obtener todas las auditorías con paginación
  async getAll(page: number = 1): Promise<PaginatedAudits> {
    const response = await apiClient.get(`/audits?page=${page}`);
    return response.data;
  },

  // Obtener auditorías por usuario
  async getByUserId(userId: string, page: number = 1): Promise<PaginatedAudits> {
    const response = await apiClient.get(`/audits/user/${userId}?page=${page}`);
    return response.data;
  },

  // Obtener auditorías por recurso
  async getByResourceId(resourceId: string, page: number = 1): Promise<PaginatedAudits> {
    const response = await apiClient.get(`/audits/resource/${resourceId}?page=${page}`);
    return response.data;
  },
};
