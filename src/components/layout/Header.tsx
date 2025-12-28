import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiUser, FiPackage } from 'react-icons/fi';
import { ROUTES } from '../../utils/constants';
import './styles/Header.css';

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="header">
        <div className="header-container">
          <h1 className="header-title">
            <FiPackage />
            Online Shopping Inventory
          </h1>
          <div className="header-actions">
            {user && (
              <button 
                className="header-user-btn"
                onClick={() => navigate(ROUTES.INFO_ME)}
                title="Ver mi perfil"
              >
                <FiUser className="header-user-icon" />
                <div className="header-user-info">
                  <p className="header-user-name">{user.name}</p>
                  <p className="header-user-role">{user.role}</p>
                </div>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

