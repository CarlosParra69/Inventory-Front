import { Card } from '../components/common';

export const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Productos">
          <p className="text-gray-600">Gestiona tus productos aquí</p>
        </Card>
        <Card title="Categorías">
          <p className="text-gray-600">Administra las categorías</p>
        </Card>
        <Card title="Inventario">
          <p className="text-gray-600">Controla el inventario</p>
        </Card>
      </div>
    </div>
  );
};

