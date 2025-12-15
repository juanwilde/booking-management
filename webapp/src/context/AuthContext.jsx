import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login - in production this would call your Cloudflare Workers API
    const mockUsers = [
      { id: 1, email: 'admin@example.com', password: 'admin123', role: 'admin', name: 'Admin User' },
      { id: 2, email: 'manager@example.com', password: 'manager123', role: 'manager', name: 'Manager User' },
      { id: 3, email: 'staff@example.com', password: 'staff123', role: 'staff', name: 'Staff User' },
    ];

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }

    return { success: false, error: 'Correo electrónico o contraseña incorrectos' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
