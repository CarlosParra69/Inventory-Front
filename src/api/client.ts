import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { tokenService } from '../services/token.service';
import { authService } from './auth.service';

// URL base de la API 
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Crear instancia de axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag para evitar múltiples llamadas simultáneas de refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenService.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta y refresh token automático
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si el error es 401 y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // No intentar refrescar token si es una petición de login o registro
      // Dejar que el error se propague para que el componente lo maneje
      const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                             originalRequest.url?.includes('/auth/register');
      
      if (isAuthEndpoint) {
        // Para login/register, simplemente rechazar el error sin redirigir
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Si ya hay un refresh en proceso, encolar la petición
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenService.getRefreshToken();

      if (!refreshToken) {
        // No hay refresh token, limpiar todo y redirigir a login
        // Solo redirigir si no estamos ya en la página de login
        tokenService.clearTokens();
        processQueue(error, null);
        isRefreshing = false;
        
        // Verificar si ya estamos en la página de login para evitar redirecciones innecesarias
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken);
        
        // Guardar los nuevos tokens
        tokenService.setAccessToken(accessToken);
        if (newRefreshToken) {
          tokenService.setRefreshToken(newRefreshToken);
        }

        // Actualizar el header de la petición original
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Procesar la cola de peticiones pendientes
        processQueue(null, accessToken);
        isRefreshing = false;

        // Reintentar la petición original
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Error al refrescar el token, limpiar todo y redirigir a login
        tokenService.clearTokens();
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Para otros errores, simplemente rechazar
    return Promise.reject(error);
  }
);

export default apiClient;
