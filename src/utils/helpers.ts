// Funciones auxiliares
import type { User } from '../types/auth.types';

/**
 * Formatea una fecha a formato legible
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Valida si un email es válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * @deprecated Usar tokenService en su lugar
 * Obtiene el token del localStorage (compatibilidad hacia atrás)
 */
export const getToken = (): string | null => {
  // Intentar obtener de sessionStorage primero (nuevo sistema)
  const accessToken = sessionStorage.getItem('accessToken');
  if (accessToken && accessToken !== 'undefined') {
    return accessToken;
  }
  // Fallback al sistema antiguo
  return localStorage.getItem('token');
};

/**
 * @deprecated Usar tokenService en su lugar
 * Guarda el token en el localStorage (compatibilidad hacia atrás)
 */
export const setToken = (token: string): void => {
  if (!token || token === 'undefined') {
    console.warn('Intento de guardar token inválido');
    return;
  }
  // Guardar en sessionStorage (nuevo sistema)
  sessionStorage.setItem('accessToken', token);
  // También guardar en localStorage para compatibilidad
  localStorage.setItem('token', token);
};

/**
 * @deprecated Usar tokenService en su lugar
 * Elimina el token del localStorage (compatibilidad hacia atrás)
 */
export const removeToken = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('user');
};

/**
 * Obtiene el usuario de sessionStorage o localStorage
 */
export const getUser = (): User | null => {
  try {
    // Intentar obtener de sessionStorage primero (nuevo sistema)
    let user = sessionStorage.getItem('user');
    if (!user || user === 'undefined' || user === 'null') {
      // Fallback a localStorage (sistema antiguo)
      user = localStorage.getItem('user');
    }
    if (!user || user === 'undefined' || user === 'null') {
      return null;
    }
    return JSON.parse(user) as User;
  } catch (error) {
    console.error('Error al parsear usuario:', error);
    // Limpiar el valor inválido
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    return null;
  }
};

/**
 * Guarda el usuario en sessionStorage (más seguro)
 */
export const setUser = (user: User): void => {
  // Guardar en sessionStorage (nuevo sistema)
  sessionStorage.setItem('user', JSON.stringify(user));
  // También guardar en localStorage para compatibilidad
  localStorage.setItem('user', JSON.stringify(user));
};

