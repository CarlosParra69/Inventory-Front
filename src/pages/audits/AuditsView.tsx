import { useState, useEffect } from 'react';
import { auditsService} from '../../api/audits.service';
import type {  AuditLog } from "../../api/audits.service";
import { Card, Loading } from '../../components/common';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Swal from 'sweetalert2';
import './AuditsView.css';

export const AuditsView = () => {
  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAudits(pagination.page);
  }, []);

  const loadAudits = async (page: number) => {
    try {
      setLoading(true);
      const result = await auditsService.getAll(page);
      setAudits(result.data);
      setPagination(result.pagination);
    } catch (error: any) {
      Swal.fire('Error', error.response?.data?.message || 'Error al cargar auditorías', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      loadAudits(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      loadAudits(pagination.page + 1);
    }
  };

  const getActionColor = (action: string): string => {
    switch (action) {
      case 'CREATE':
        return '#10b981';
      case 'UPDATE':
        return '#3b82f6';
      case 'SOFT_DELETE':
        return '#ef4444';
      case 'RESTORE': // Implementaremos Restauracion a Categorias y Productos Eliminados Mas Adelante
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
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
    <div className="audits-container">
      <div className="audits-header">
        <h1>Auditorías del Sistema</h1>
        <p className="audits-subtitle">Registro de todas las acciones realizadas en el sistema</p>
      </div>

      <Card>
        <div className="table-responsive">
          <table className="audits-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acción</th>
                <th>Recurso</th>
                <th>Nombre del Recurso</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {audits.length > 0 ? (
                audits.map((audit) => (
                  <tr key={audit.id} className="audit-row">
                    <td className="audit-date">{formatDate(audit.created_at)}</td>
                    <td className="audit-user">{audit.userName || 'Usuario desconocido'}</td>
                    <td>
                      <span className={`badge badge-role badge-${audit.role.toLowerCase()}`}>
                        {audit.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge badge-action"
                        style={{ backgroundColor: getActionColor(audit.action) }}
                      >
                        {audit.action === 'SOFT_DELETE' ? 'ELIMINAR' : audit.action}
                        
                      </span>
                    </td>
                    <td className="audit-resource">{audit.resource}</td>
                    <td className="audit-resource-name">{audit.resourceName || '-'}</td>
                    <td className="audit-ip">
                      <code>{audit.ip}</code>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="empty-state">
                    No hay auditorías registradas
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
