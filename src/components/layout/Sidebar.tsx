import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { FiBarChart2, FiPackage, FiTag, FiInfo, FiClipboard } from 'react-icons/fi';
import './styles/Sidebar.css';

const navigationItems = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: FiBarChart2 },
  { path: ROUTES.PRODUCTS, label: 'Productos', icon: FiPackage },
  { path: ROUTES.CATEGORIES, label: 'Categorías', icon: FiTag },
  { path: ROUTES.INVENTORY, label: 'Stock', icon: FiInfo },
  { path: ROUTES.AUDITS, label: 'Auditorías', icon: FiClipboard },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
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
    </aside>
  );
};

