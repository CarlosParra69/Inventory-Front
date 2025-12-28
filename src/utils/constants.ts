// Constantes de la aplicación

export const APP_NAME = 'Sistema de Inventarios';

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  INVENTORY: '/inventory',
  AUDITS: '/audits'
} as const;

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export const INVENTORY_MOVEMENT_TYPES = {
  IN: 'IN',
  OUT: 'OUT',
} as const;

