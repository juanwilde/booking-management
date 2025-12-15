import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole } from '../types'

interface AuthUser extends User {
  id: number;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Mock login - in production this would call your Cloudflare Workers API
    const mockUsers: Array<{ id: number; email: string; password: string; role: UserRole; name: string }> = [
      { id: 1, email: 'admin@example.com', password: 'admin123', role: 'admin', name: 'Admin User' },
      { id: 2, email: 'manager@example.com', password: 'manager123', role: 'manager', name: 'Manager User' },
    ]

    const foundUser = mockUsers.find(u => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      return { success: true }
    }

    return { success: false, error: 'Correo electrónico o contraseña incorrectos' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
