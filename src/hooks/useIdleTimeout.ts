import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

/**
 * Hook que monitorea la inactividad del usuario y lo desconecta automáticamente
 * 
 * Características:
 * - Detecta actividad del usuario (clicks, teclado, movimiento de mouse)
 * - Reinicia el temporizador con cada actividad
 * - Desconecta automáticamente cuando se agota el tiempo
 * - Se puede configurar el tiempo de inactividad
 * 
 * @param timeoutMinutes - Minutos de inactividad antes de desconectar (default: 15 minutos)
 */
export const useIdleTimeout = (timeoutMinutes: number = 15) => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Convertir minutos a milisegundos
  const timeoutMs = timeoutMinutes * 60 * 1000;

  /**
   * Limpia los temporizadores existentes
   */
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
      activityTimeoutRef.current = null;
    }
  }, []);

  /**
   * Realiza el logout automático por inactividad
   */
  const handleInactivityLogout = useCallback(async () => {
    console.warn('Sesión expirada por inactividad');
    try {
      await logout();
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error) {
      console.error('Error durante logout por inactividad:', error);
      // Navegar al login de todas formas
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [logout, navigate]);

  /**
   * Inicia el temporizador de inactividad
   */
  const startInactivityTimer = useCallback(() => {
    clearTimers();

    timeoutRef.current = setTimeout(() => {
      handleInactivityLogout();
    }, timeoutMs);
  }, [timeoutMs, clearTimers, handleInactivityLogout]);

  /**
   * Detecta actividad del usuario y reinicia el temporizador
   */
  const handleUserActivity = useCallback(() => {
    if (!isAuthenticated) return;

    // Para evitar spam de eventos, usamos un timeout para reiniciar
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }

    activityTimeoutRef.current = setTimeout(() => {
      startInactivityTimer();
    }, 500); // Esperar 500ms después de la última actividad
  }, [isAuthenticated, startInactivityTimer]);

  // Configurar listeners de actividad
  useEffect(() => {
    if (!isAuthenticated) {
      clearTimers();
      return;
    }

    // Eventos que indican actividad del usuario
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Iniciar el temporizador al montar
    startInactivityTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity);
      });
      clearTimers();
    };
  }, [isAuthenticated, handleUserActivity, startInactivityTimer, clearTimers]);
};
