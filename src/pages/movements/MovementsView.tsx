import { useState, useEffect } from 'react';
import { movementsService } from '../../api/movements.service';
import type { InventoryMovement } from '../../api/movements.service';
import { Card, Loading } from '../../components/common';
import { FiChevronLeft, FiChevronRight, FiArrowDown, FiArrowUp } from 'react-icons/fi';
import Swal from 'sweetalert2';
import './MovementsView.css';

export const MovementsView = () => {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

  useEffect(() => {
    loadMovements(pagination.page);
  }, [filterType]);

  const loadMovements = async (page: number) => {
    try {
      setLoading(true);
      let result;
      
      if (filterType === 'IN') {
        result = await movementsService.getEntries(page);
      } else if (filterType === 'OUT') {
        result = await movementsService.getExits(page);
      } else {
        result = await movementsService.getAll(page);
      }
      
      setMovements(result.data);
      setPagination(result.pagination);
    } catch (error: any) {
      Swal.fire('Error', error.response?.data?.message || 'Error al cargar movimientos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      loadMovements(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      loadMovements(pagination.page + 1);
    }
  };

  // Normalizar el tipo de movimiento eliminando espacios
  const normalizeMovementType = (type: string): 'IN' | 'OUT' => {
    const normalized = type?.trim().toUpperCase();
    return normalized === 'IN' ? 'IN' : 'OUT';
  };

  const getMovementColor = (type: string): string => {
    const normalized = normalizeMovementType(type);
    return normalized === 'IN' ? '#10b981' : '#ef4444';
  };

  const getMovementLabel = (type: string): string => {
    const normalized = normalizeMovementType(type);
    return normalized === 'IN' ? 'Entrada' : 'Salida';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="movements-container">
      <div className="movements-header">
        <h1>Movimientos de Inventario</h1>
        <p className="movements-subtitle">Registro de entradas y salidas de stock</p>
      </div>

      {/* Filtros */}
      <div className="movements-filters">
        <button
          className={`filter-btn ${filterType === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilterType('ALL')}
        >
          Todos los movimientos
        </button>
        <button
          className={`filter-btn ${filterType === 'IN' ? 'active' : ''}`}
          onClick={() => setFilterType('IN')}
        >
          <FiArrowDown className="filter-icon" /> Entradas
        </button>
        <button
          className={`filter-btn ${filterType === 'OUT' ? 'active' : ''}`}
          onClick={() => setFilterType('OUT')}
        >
          <FiArrowUp className="filter-icon" /> Salidas
        </button>
      </div>

      <Card>
        <div className="table-responsive">
          <table className="movements-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Razón</th>
              </tr>
            </thead>
            <tbody>
              {movements.length > 0 ? (
                movements.map((movement) => (
                  <tr key={movement.id} className="movement-row">
                    <td className="movement-date">{formatDate(movement.created_at)}</td>
                    <td className="movement-product">{movement.productName || 'Producto desconocido'}</td>
                    <td>
                      <div className="movement-type-badge">
                        {normalizeMovementType(movement.movement_type) === 'IN' ? (
                          <FiArrowDown className="type-icon" style={{ color: '#10b981' }} />
                        ) : (
                          <FiArrowUp className="type-icon" style={{ color: '#ef4444' }} />
                        )}
                        <span
                          className="badge badge-movement"
                          style={{ backgroundColor: getMovementColor(movement.movement_type) }}
                        >
                          {getMovementLabel(movement.movement_type)}
                        </span>
                      </div>
                    </td>
                    <td className="movement-quantity">
                      <span className={`quantity ${normalizeMovementType(movement.movement_type)}`}>
                        {normalizeMovementType(movement.movement_type) === 'OUT' ? '-' : ''}
                        {movement.quantity}
                      </span>
                    </td>
                    <td className="movement-reason">{movement.reason}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="empty-state">
                    No hay movimientos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="pagination-container">
          <div className="pagination-info">
            Página {pagination.page} de {pagination.totalPages} ({pagination.total} registros)
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={handlePrevPage}
              disabled={pagination.page === 1}
              title="Página anterior"
            >
              <FiChevronLeft />
            </button>
            <span className="pagination-number">{pagination.page}</span>
            <button
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={pagination.page === pagination.totalPages}
              title="Siguiente página"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
