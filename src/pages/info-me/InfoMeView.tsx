import { useState, useEffect } from 'react';
import { authService } from '../../api/auth.service';
import { Card, Loading } from '../../components/common';
import { FiUser, FiMail, FiShield, FiCopy, FiCheck } from 'react-icons/fi';
import Swal from 'sweetalert2';
import './InfoMeView.css';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const InfoMeView = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      const data = await authService.getMe();
      setUser(data);
    } catch (error: any) {
      Swal.fire('Error', error.response?.data?.message || 'Error al cargar información del usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getRoleBadgeColor = (role: string): string => {
    return role === 'ADMIN' ? '#ef4444' : '#3b82f6';
  };

  const getRoleLabel = (role: string): string => {
    return role === 'ADMIN' ? 'Administrador' : 'Usuario';
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="info-me-container">
        <div className="info-me-header">
          <h1>Mi Información</h1>
        </div>
        <Card>
          <div className="empty-state">
            <p>No se pudo cargar la información del usuario</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="info-me-container">
      <div className="info-me-header">
        <h1>Mi Información</h1>
        <p className="info-me-subtitle">Datos de tu perfil de usuario</p>
      </div>

      <div className="info-me-content">
        {/* Avatar y Nombre */}
        <Card>
          <div className="user-avatar-section">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-name-info">
              <h2>{user.name}</h2>
              <span
                className="role-badge"
                style={{ backgroundColor: getRoleBadgeColor(user.role) }}
              >
                {getRoleLabel(user.role)}
              </span>
            </div>
          </div>
        </Card>

        {/* Detalles de la cuenta */}
        <Card>
          <h3 className="card-title">Detalles de la Cuenta</h3>
          
          <div className="info-field">
            <div className="field-header">
              <FiUser className="field-icon" />
              <label>Nombre Completo</label>
            </div>
            <div className="field-content">
              <span className="field-value">{user.name}</span>
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(user.name, 'name')}
                title="Copiar nombre"
              >
                {copiedField === 'name' ? <FiCheck size={16} /> : <FiCopy size={16} />}
              </button>
            </div>
          </div>

          <div className="info-field">
            <div className="field-header">
              <FiMail className="field-icon" />
              <label>Correo Electrónico</label>
            </div>
            <div className="field-content">
              <span className="field-value">{user.email}</span>
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(user.email, 'email')}
                title="Copiar correo"
              >
                {copiedField === 'email' ? <FiCheck size={16} /> : <FiCopy size={16} />}
              </button>
            </div>
          </div>

          <div className="info-field">
            <div className="field-header">
              <FiShield className="field-icon" />
              <label>Rol de Acceso</label>
            </div>
            <div className="field-content">
              <span
                className="role-badge badge-large"
                style={{ backgroundColor: getRoleBadgeColor(user.role) }}
              >
                {getRoleLabel(user.role)}
              </span>
            </div>
          </div>

          <div className="info-field">
            <div className="field-header">
              <FiCopy className="field-icon" />
              <label>ID de Usuario</label>
            </div>
            <div className="field-content">
              <span className="field-value field-mono">{user.id}</span>
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(user.id, 'id')}
                title="Copiar ID"
              >
                {copiedField === 'id' ? <FiCheck size={16} /> : <FiCopy size={16} />}
              </button>
            </div>
          </div>
        </Card>

        {/* Información adicional */}
        <Card>
          <h3 className="card-title">Información del Perfil</h3>
          <div className="info-summary">
            <div className="summary-item">
              <span className="summary-label">Tipo de Cuenta:</span>
              <span className="summary-value">{getRoleLabel(user.role)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Estado:</span>
              <span className="summary-value active">Activo</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
