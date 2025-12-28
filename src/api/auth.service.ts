import apiClient from './client';
import type { LoginRequest, RegisterRequest, AuthResponse, LogoutRequest } from '../types/auth.types';

export const authService = {
  /**
   * Inicia sesión en el sistema
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Registra un nuevo usuario
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  /**
   * Renueva el access token usando el refresh token
   */
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> => {
    const response = await apiClient.post<{ accessToken: string; refreshToken?: string }>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data;
  },

  /**
   * Cierra sesión
   */
  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refreshToken } as LogoutRequest);
  },

  /**
   * Obtiene la información del usuario autenticado
   */
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

