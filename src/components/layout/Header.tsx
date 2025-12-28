import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common';
import { LogoutModal } from '../common/Modals';
import { FiLogOut, FiUser, FiPackage } from 'react-icons/fi';
import { ROUTES } from '../../utils/constants';
import './styles/Header.css';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await logout();
    // Redirigir al login después de que logout se complete
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <h1 className="header-title">
            <FiPackage />
            Sistema de Inventario
          </h1>
          <div className="header-actions">
            {user && (
              <>
                <div className="header-user">
                  <FiUser className="header-user-icon" />
                  <div className="header-user-info">
                    <p className="header-user-name">{user.name}</p>
                    <p className="header-user-role">{user.role}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogoutClick}
                  className="header-logout-btn"
                >
                  <FiLogOut />
                  Cerrar Sesión
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        userName={user?.name}
      />
    </>
  );
};

