import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Sistema de Inventarios</h1>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-gray-700">
                {user.name} ({user.role})
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Cerrar Sesión
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

