import { useState, FormEvent, ChangeEvent } from 'react';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { Button } from './common/Button';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordChanged: (currentPassword: string, newPassword: string) => Promise<void>;
  userName: string;
}

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

export const ChangePasswordModal = ({
  isOpen,
  onClose,
  onPasswordChanged,
  userName
}: ChangePasswordModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es obligatoria';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es obligatoria';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu nueva contraseña';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (formData.currentPassword && formData.newPassword &&
        formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await onPasswordChanged(formData.currentPassword, formData.newPassword);
      setSuccessMessage('Contraseña cambiada correctamente');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Auto-close after success
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 1500);
    } catch (error) {
      setErrors({ currentPassword: 'Contraseña actual incorrecta' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
    setSuccessMessage('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Cambiar Contraseña"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Cambiando contraseña para: <span className="font-semibold">{userName}</span>
          </p>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        <Input
          label="Contraseña Actual *"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
          error={errors.currentPassword}
          placeholder="Introduce tu contraseña actual"
        />

        <Input
          label="Nueva Contraseña *"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          placeholder="Mínimo 6 caracteres"
        />

        <Input
          label="Confirmar Nueva Contraseña *"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Repite la nueva contraseña"
        />

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Cambiar Contraseña'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
