import { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  Bell,
  Users,
  LogOut,
  Menu,
  X,
  LucideIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ChangePasswordModal } from '../ChangePasswordModal';

interface LayoutProps {
  children: ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  roles?: string[]; // Optional: if not specified, available to all roles
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, changePassword } = useAuth();

  const allNavigation: NavigationItem[] = [
    { name: 'Panel de Control', href: '/dashboard', icon: LayoutDashboard, roles: ['admin'] },
    { name: 'Reservas', href: '/bookings', icon: Calendar }, // Available to all roles
    { name: 'Gastos', href: '/expenses', icon: DollarSign, roles: ['admin'] },
    { name: 'Recordatorios', href: '/reminders', icon: Bell, roles: ['admin'] },
    { name: 'Gestores', href: '/users', icon: Users, roles: ['admin'] },
  ];

  // Filter navigation based on user role
  const navigation = allNavigation.filter(
    item => !item.roles || item.roles.includes(user?.role || '')
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    await changePassword(currentPassword, newPassword);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Gestor de Reservas</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info & logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setChangePasswordModalOpen(true)}
              className="flex items-center mb-3 w-full hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3 flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center h-16 px-4 bg-white border-b border-gray-200 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
        onPasswordChanged={handlePasswordChange}
        userName={user?.name || ''}
      />
    </div>
  );
};
