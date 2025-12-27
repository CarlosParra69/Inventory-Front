import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../utils/constants';
import { validators } from '../../../utils/validators';
import './LoginPage.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    const emailError = validators.email(formData.email) || validators.required(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validators.required(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'Por favor, completa todos los campos correctamente',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(formData);
      // Pequeño delay para asegurar que los tokens se guarden antes de navegar
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 100);
    } catch (error) {
      setIsLoading(false);
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Error al iniciar sesión';
      
      // Mensajes específicos según el tipo de error
      let title = 'Error al iniciar sesión';
      let text = errorMessage;

      if (errorMessage.toLowerCase().includes('contraseña') || errorMessage.toLowerCase().includes('password')) {
        title = 'Contraseña incorrecta';
        text = 'La contraseña ingresada no es correcta. Por favor, intenta nuevamente.';
      } else if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('usuario') || errorMessage.toLowerCase().includes('user')) {
        title = 'Credenciales inválidas';
        text = 'El email o usuario no existe. Por favor, verifica tus datos.';
      } else if (axiosError.response?.status === 401) {
        title = 'Credenciales inválidas';
        text = 'El email o contraseña son incorrectos. Por favor, verifica tus datos.';
      } else if (axiosError.response?.status === 404) {
        title = 'Usuario no encontrado';
        text = 'No existe una cuenta con este email. Por favor, verifica tu email o regístrate.';
      } else if (axiosError.response?.status === 403) {
        title = 'Acceso denegado';
        text = 'Tu cuenta ha sido bloqueada o no tienes permisos para acceder.';
      } else if (axiosError.response?.status && axiosError.response.status >= 500) {
        title = 'Error del servidor';
        text = 'Ocurrió un error en el servidor. Por favor, intenta más tarde.';
      }

      Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        confirmButtonColor: '#2563eb',
      });
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <div className="login-card">
          <div className="login-card-content">
            <h1 className="login-title">
              Iniciar Sesión
            </h1>
            <form
              className="login-form"
              onSubmit={handleSubmit}
            >
              <div className="login-form-group">
                <label
                  htmlFor="email"
                  className="login-label"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`login-input ${errors.email ? 'login-input-error' : ''}`}
                  placeholder="usuario@email.com"
                  required
                />
                {errors.email && (
                  <p className="login-error-message">{errors.email}</p>
                )}
              </div>
              <div className="login-form-group">
                <label
                  htmlFor="password"
                  className="login-label"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`login-input ${errors.password ? 'login-input-error' : ''}`}
                  placeholder="••••••••"
                  required
                />
                {errors.password && (
                  <p className="login-error-message">{errors.password}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="login-button"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
              <p className="login-link-text">
                ¿No tienes cuenta?{' '}
                <Link
                  to={ROUTES.REGISTER}
                  className="login-link"
                >
                  Regístrate
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

