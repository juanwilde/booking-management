import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Bookings } from './pages/Bookings';
import { Expenses } from './pages/Expenses';
import { Reminders } from './pages/Reminders';
import { Users } from './pages/Users';
import { UserRole } from './types';

interface RouteWrapperProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

// Protected Route wrapper with role-based access control
const ProtectedRoute = ({ children, allowedRoles }: RouteWrapperProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to bookings (which managers can access)
    return <Navigate to="/bookings" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Public Route wrapper (redirects based on role if already logged in)
const PublicRoute = ({ children }: RouteWrapperProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (user) {
    // Redirect based on role
    const redirectTo = user.role === 'admin' ? '/dashboard' : '/bookings';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Home redirect component based on role
const HomeRedirect = () => {
  const { user } = useAuth();
  const redirectTo = user?.role === 'admin' ? '/dashboard' : '/bookings';
  return <Navigate to={redirectTo} replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Expenses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reminders"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Reminders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
