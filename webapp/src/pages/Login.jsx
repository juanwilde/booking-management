import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestor de Reservas</h1>
          <p className="text-gray-600 mt-2">Inicia sesión para gestionar tus reservas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Introduce tu correo electrónico"
            required
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Introduce tu contraseña"
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Credenciales de Demostración:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p><strong>Administrador:</strong> admin@example.com / admin123</p>
            <p><strong>Gerente:</strong> manager@example.com / manager123</p>
            <p><strong>Personal:</strong> staff@example.com / staff123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
