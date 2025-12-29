import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useIdleTimeout } from '../../hooks';
import './styles/Layout.css';

interface LayoutProps {
  children: ReactNode;
  idleTimeoutMinutes?: number;
}

export const Layout = ({ children, idleTimeoutMinutes = 15 }: LayoutProps) => {
  // Activar monitoreo de inactividad (15 minutos por defecto)
  useIdleTimeout(idleTimeoutMinutes);

  return (
    <div className="layout-container">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-main">{children}</main>
      </div>
    </div>
  );
};

