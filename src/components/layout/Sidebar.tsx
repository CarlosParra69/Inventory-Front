import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { FiBarChart2, FiPackage, FiTag, FiInfo, FiClipboard, FiArrowRightCircle, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoutModal } from '../common/Modals';
import './styles/Sidebar.css';

const navigationItems = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: FiBarChart2 },
  { path: ROUTES.PRODUCTS, label: 'Productos', icon: FiPackage },
  { path: ROUTES.CATEGORIES, label: 'Categorías', icon: FiTag },
  { path: ROUTES.INVENTORY, label: 'Stock', icon: FiInfo },
  { path: ROUTES.MOVEMENTS, label: 'Movimientos', icon: FiArrowRightCircle },
  { path: ROUTES.AUDITS, label: 'Auditorías', icon: FiClipboard },
  { path: ROUTES.INFO_ME, label: 'Perfil', icon: FiUser },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <>
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <ul className="sidebar-list">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                  >
                    <IconComponent className="sidebar-icon" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sección de logout */}
        <div className="sidebar-footer">
          {user && (
            <Button
              variant="ghost"
              size="sm"
              className="sidebar-logout-btn"
              onClick={() => setShowLogoutModal(true)}
            >
              <FiLogOut />
              Cerrar Sesión
            </Button>
          )}
        </div>
      </aside>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        userName={user?.name}
      />
    </>
  );
};

