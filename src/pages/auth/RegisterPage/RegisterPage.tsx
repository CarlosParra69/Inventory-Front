import { useState} from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../utils/constants';
import { validators } from '../../../utils/validators';
import './RegisterPage.css';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    const nameError = validators.required(formData.name) || validators.minLength(3)(formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validators.email(formData.email) || validators.required(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validators.required(formData.password) || validators.minLength(6)(formData.password);
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
      await register(formData);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      setIsLoading(false);
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Error al registrar usuario';
      
      // Mensajes específicos según el tipo de error
      let title = 'Error al registrar';
      let text = errorMessage;

      if (errorMessage.toLowerCase().includes('email') && (errorMessage.toLowerCase().includes('existe') || errorMessage.toLowerCase().includes('ya está'))) {
        title = 'Email ya registrado';
        text = 'Este email ya está registrado. Por favor, inicia sesión o usa otro email.';
      } else if (errorMessage.toLowerCase().includes('contraseña') || errorMessage.toLowerCase().includes('password')) {
        if (errorMessage.toLowerCase().includes('débil') || errorMessage.toLowerCase().includes('weak')) {
          title = 'Contraseña débil';
          text = 'La contraseña debe tener al menos 6 caracteres y ser más segura.';
        } else {
          title = 'Error en la contraseña';
          text = errorMessage;
        }
      } else if (errorMessage.toLowerCase().includes('nombre') || errorMessage.toLowerCase().includes('name')) {
        title = 'Error en el nombre';
        text = 'El nombre debe tener al menos 3 caracteres.';
      } else if (axiosError.response?.status === 409) {
        title = 'Usuario ya existe';
        text = 'Ya existe una cuenta con este email. Por favor, inicia sesión.';
      } else if (axiosError.response?.status === 400) {
        title = 'Datos inválidos';
        text = 'Por favor, verifica que todos los campos sean correctos.';
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
    <section className="register-section">
      <div className="register-container">
        <div className="register-card">
          <div className="register-card-content">
            <h1 className="register-title">
              Crear una cuenta
            </h1>
            <form
              className="register-form"
              onSubmit={handleSubmit}
            >
              <div className="register-form-group">
                <label
                  htmlFor="name"
                  className="register-label"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`register-input ${errors.name ? 'register-input-error' : ''}`}
                  placeholder="Tu nombre completo"
                  required
                />
                {errors.name && (
                  <p className="register-error-message">{errors.name}</p>
                )}
              </div>
              <div className="register-form-group">
                <label
                  htmlFor="email"
                  className="register-label"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`register-input ${errors.email ? 'register-input-error' : ''}`}
                  placeholder="tu@email.com"
                  required
                />
                {errors.email && (
                  <p className="register-error-message">{errors.email}</p>
                )}
              </div>
              <div className="register-form-group">
                <label
                  htmlFor="password"
                  className="register-label"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`register-input ${errors.password ? 'register-input-error' : ''}`}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                {errors.password && (
                  <p className="register-error-message">{errors.password}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="register-button"
              >
                {isLoading ? 'Registrando...' : 'Registrarse'}
              </button>
              <p className="register-link-text">
                ¿Ya tienes cuenta?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className="register-link"
                >
                  Inicia sesión
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

