import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../api/auth.service';
import type { User, LoginRequest, RegisterRequest } from '../types/auth.types';
import { tokenService } from '../services/token.service';
import { getUser, setUser } from '../utils/helpers';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado al cargar la app
    const accessToken = tokenService.getAccessToken();
    const savedUser = getUser();
    if (accessToken && savedUser) {
      setUserState(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    
    // Validar que el accessToken existe antes de guardarlo
    if (!response.accessToken || response.accessToken === 'undefined') {
      console.error('Error: El servidor no devolvió un accessToken válido', response);
      throw new Error('El servidor no devolvió un token válido');
    }

    // Guardar tokens de forma segura
    tokenService.setAccessToken(response.accessToken);
    if (response.refreshToken) {
      tokenService.setRefreshToken(response.refreshToken);
    }
    
    // Guardar usuario
    setUser(response.user);
    setUserState(response.user);
    
    // Verificar que los tokens se guardaron correctamente
    const savedAccessToken = tokenService.getAccessToken();
    if (!savedAccessToken) {
      console.error('Error: El accessToken no se guardó correctamente');
      throw new Error('Error al guardar el token de acceso');
    }
  };

  const register = async (userData: RegisterRequest) => {
    const response = await authService.register(userData);
    
    // Validar que el accessToken existe antes de guardarlo
    if (!response.accessToken || response.accessToken === 'undefined') {
      throw new Error('El servidor no devolvió un token válido');
    }

    // Guardar tokens de forma segura
    tokenService.setAccessToken(response.accessToken);
    if (response.refreshToken) {
      tokenService.setRefreshToken(response.refreshToken);
    }
    
    // Guardar usuario
    setUser(response.user);
    setUserState(response.user);
  };

  const logout = async () => {
    try {
      const refreshToken = tokenService.getRefreshToken();
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      tokenService.clearTokens();
      setUserState(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

