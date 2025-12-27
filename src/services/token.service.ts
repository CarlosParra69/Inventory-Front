/**
 * Servicio para gestión segura de tokens
 * 
 * Estrategia de seguridad:
 * - accessToken: Se guarda en sessionStorage (se elimina al cerrar el navegador)
 * - refreshToken: Se guarda en localStorage (persiste entre sesiones)
 * - user: Se guarda en sessionStorage (datos del usuario)
 */

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const tokenService = {
  /**
   * Guarda el access token en sessionStorage
   */
  setAccessToken: (token: string): void => {
    if (!token || token === 'undefined') {
      console.warn('Intento de guardar token inválido');
      return;
    }
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  /**
   * Obtiene el access token de sessionStorage
   */
  getAccessToken: (): string | null => {
    const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token || token === 'undefined' || token === 'null') {
      return null;
    }
    return token;
  },

  /**
   * Guarda el refresh token en localStorage
   */
  setRefreshToken: (token: string): void => {
    if (!token || token === 'undefined') {
      console.warn('Intento de guardar refresh token inválido');
      return;
    }
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  /**
   * Obtiene el refresh token de localStorage
   */
  getRefreshToken: (): string | null => {
    const token = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!token || token === 'undefined' || token === 'null') {
      return null;
    }
    return token;
  },

  /**
   * Guarda ambos tokens
   */
  setTokens: (accessToken: string, refreshToken?: string): void => {
    if (accessToken) {
      tokenService.setAccessToken(accessToken);
    }
    if (refreshToken) {
      tokenService.setRefreshToken(refreshToken);
    }
  },

  /**
   * Elimina todos los tokens del almacenamiento
   */
  clearTokens: (): void => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Verifica si hay un access token válido
   */
  hasAccessToken: (): boolean => {
    return !!tokenService.getAccessToken();
  },

  /**
   * Verifica si hay un refresh token válido
   */
  hasRefreshToken: (): boolean => {
    return !!tokenService.getRefreshToken();
  },
};
