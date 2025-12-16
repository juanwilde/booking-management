import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { usersAPI } from '../services/api';
import { Manager } from '../types';

interface UserFormProps {
  manager: Manager | null;
  onSave: () => void;
  onCancel: () => void;
}

type ManagerFormData = {
  name: string;
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof ManagerFormData, string>>;

export const UserForm = ({ manager, onSave, onCancel }: UserFormProps) => {
  const [formData, setFormData] = useState<ManagerFormData>({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (manager) {
      setFormData({
        name: manager.name,
        email: manager.email,
        password: '', // Don't populate password when editing
      });
    }
  }, [manager]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name as keyof ManagerFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El correo electrónico es obligatorio';

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido';
    }

    // Password is required for new managers, optional for editing
    if (!manager && !formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    // If password is provided, validate minimum length
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const dataToSend: Partial<Manager> = {
        name: formData.name,
        email: formData.email,
      };

      // Only include password if it's been provided
      if (formData.password) {
        dataToSend.password = formData.password;
      }

      if (manager) {
        await usersAPI.update(manager.id, dataToSend);
      } else {
        await usersAPI.create(dataToSend as Omit<Manager, 'id' | 'createdAt'>);
      }
      onSave();
    } catch (error) {
      console.error('Error saving manager:', error);
      alert('Error al guardar gestor. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre *"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Nombre completo"
      />

      <Input
        label="Correo Electrónico *"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="correo@ejemplo.com"
      />

      <Input
        label={manager ? 'Nueva Contraseña (dejar en blanco para no cambiar)' : 'Contraseña *'}
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="Mínimo 6 caracteres"
      />

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : manager ? 'Actualizar Gestor' : 'Crear Gestor'}
        </Button>
      </div>
    </form>
  );
};
