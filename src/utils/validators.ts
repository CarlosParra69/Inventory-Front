// Validadores de formularios

export const validators = {
  required: (value: string): string | null => {
    if (!value || value.trim().length === 0) {
      return 'Este campo es requerido';
    }
    return null;
  },

  email: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'El email no es válido';
    }
    return null;
  },

  minLength: (min: number) => (value: string): string | null => {
    if (value.length < min) {
      return `Debe tener al menos ${min} caracteres`;
    }
    return null;
  },

  maxLength: (max: number) => (value: string): string | null => {
    if (value.length > max) {
      return `No debe exceder ${max} caracteres`;
    }
    return null;
  },

  number: (value: string | number): string | null => {
    if (isNaN(Number(value))) {
      return 'Debe ser un número válido';
    }
    return null;
  },

  positiveNumber: (value: string | number): string | null => {
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      return 'Debe ser un número mayor a cero';
    }
    return null;
  },
};

