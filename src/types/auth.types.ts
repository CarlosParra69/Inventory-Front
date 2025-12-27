// Tipos relacionados con autenticación

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface LogoutRequest {
  refreshToken: string;
}

