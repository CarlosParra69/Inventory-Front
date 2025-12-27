import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const navigationItems = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: ROUTES.PRODUCTS, label: 'Productos', icon: '📦' },
  { path: ROUTES.CATEGORIES, label: 'Categorías', icon: '🏷️' },
  { path: ROUTES.INVENTORY, label: 'Inventario', icon: '📋' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
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

