import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole } from '../types'
import { usersAPI } from '../services/api'

interface AuthUser extends User {
  id: number;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
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

// Store mock users at module level so password changes persist
const mockUsers: Array<{ id: number; email: string; password: string; role: UserRole; name: string }> = [
  { id: 1, email: 'admin@example.com', password: 'admin123', role: 'admin', name: 'Admin' },
  { id: 2, email: 'manager@example.com', password: 'manager123', role: 'manager', name: 'Manager' },
]

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
    const foundUser = mockUsers.find(u => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      return { success: true }
    }

    return { success: false, error: 'Correo electrónico o contraseña incorrectos' }
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    if (!user) {
      throw new Error('No user logged in')
    }

    // Try to change password for current user
    if (user.role === 'admin') {
      // Handle admin password change
      const adminUser = mockUsers.find(u => u.email === user.email)
      if (!adminUser) {
        throw new Error('User not found')
      }

      if (adminUser.password !== currentPassword) {
        throw new Error('Current password is incorrect')
      }

      adminUser.password = newPassword
    } else {
      // Handle manager password change via API
      await usersAPI.changePassword(user.email, currentPassword, newPassword)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    changePassword,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
