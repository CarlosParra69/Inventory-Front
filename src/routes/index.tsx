import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Layout } from '../components/layout';
import { Dashboard } from '../pages/Dashboard';
import { LoginPage } from '../pages/auth/LoginPage/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage/RegisterPage';
import { ProductsList } from '../pages/products/ProductsList';
import { CategoriesList } from '../pages/categories/CategoriesList';
import { InventoryView } from '../pages/inventory/InventoryView';
import { AuditsView } from '../pages/audits/AuditsView';
import { MovementsView } from '../pages/movements/MovementsView';
import { InfoMeView } from '../pages/info-me/InfoMeView';
import { ROUTES } from '../utils/constants';
import { tokenService } from '../services/token.service';

// Componente para proteger rutas privadas
// eslint-disable-next-line react-refresh/only-export-components
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = tokenService.getAccessToken();
  return accessToken ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
};

// Componente para rutas públicas (redirige si ya está autenticado)
// eslint-disable-next-line react-refresh/only-export-components
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = tokenService.getAccessToken();
  return !accessToken ? <>{children}</> : <Navigate to={ROUTES.DASHBOARD} replace />;
};

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <Layout>
          <Outlet />
        </Layout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: ROUTES.PRODUCTS,
        element: <ProductsList />,
      },
      {
        path: ROUTES.CATEGORIES,
        element: <CategoriesList />,
      },
      {
        path: ROUTES.INVENTORY,
        element: <InventoryView />,
      },
      {
        path: ROUTES.AUDITS,
        element: <AuditsView />,
      },
      {
        path: ROUTES.MOVEMENTS,
        element: <MovementsView />,
      },
      {
        path: ROUTES.INFO_ME,
        element: <InfoMeView />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);

