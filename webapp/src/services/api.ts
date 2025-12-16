import { format } from 'date-fns';
import { mockBookings, mockExpenses, mockReminders, mockManagers, calculateStats } from './mockData';
import { Booking, Expense, Manager, ApiResponse, DashboardStats, BookingStatus, PaymentStatus, ExpenseCategory, ExpenseStatus } from '../types';

// Simulate API delay
const delay = (ms = 50): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

interface BookingFilters {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
}

interface ExpenseFilters {
  category?: ExpenseCategory;
  status?: ExpenseStatus;
}

// Bookings API
export const bookingsAPI = {
  getAll: async (filters: BookingFilters = {}): Promise<ApiResponse<Booking[]>> => {
    await delay();
    let filtered = [...mockBookings];

    if (filters.status) {
      filtered = filtered.filter(b => b.status === filters.status);
    }
    if (filters.paymentStatus) {
      filtered = filtered.filter(b => b.paymentStatus === filters.paymentStatus);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        b =>
          b.guestName.toLowerCase().includes(search) ||
          b.guestEmail.toLowerCase().includes(search)
      );
    }

    return { data: filtered };
  },

  getById: async (id: string): Promise<Booking> => {
    await delay();
    const booking = mockBookings.find(b => b.id === id);
    if (!booking) throw new Error('Booking not found');
    return booking;
  },

  create: async (bookingData: Omit<Booking, 'id'>): Promise<Booking> => {
    await delay();
    const newBooking: Booking = {
      id: String(Math.max(...mockBookings.map(b => Number(b.id))) + 1),
      ...bookingData,
    };
    mockBookings.push(newBooking);
    return newBooking;
  },

  update: async (id: string, bookingData: Partial<Booking>): Promise<Booking> => {
    await delay();
    const index = mockBookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    const updatedBooking = { ...mockBookings[index], ...bookingData } as Booking;
    mockBookings[index] = updatedBooking;
    return updatedBooking;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    await delay();
    const index = mockBookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    mockBookings.splice(index, 1);
    return { success: true };
  },
};

// Expenses API
export const expensesAPI = {
  getAll: async (filters: ExpenseFilters = {}): Promise<ApiResponse<Expense[]>> => {
    await delay();
    let filtered = [...mockExpenses];

    if (filters.category) {
      filtered = filtered.filter(e => e.category === filters.category);
    }
    if (filters.status) {
      filtered = filtered.filter(e => e.status === filters.status);
    }

    return { data: filtered };
  },

  getById: async (id: string): Promise<Expense> => {
    await delay();
    const expense = mockExpenses.find(e => e.id === id);
    if (!expense) throw new Error('Expense not found');
    return expense;
  },

  create: async (expenseData: Omit<Expense, 'id'>): Promise<Expense> => {
    await delay();
    const newExpense: Expense = {
      id: String(Math.max(...mockExpenses.map(e => Number(e.id))) + 1),
      ...expenseData,
    };
    mockExpenses.push(newExpense);
    return newExpense;
  },

  update: async (id: string, expenseData: Partial<Expense>): Promise<Expense> => {
    await delay();
    const index = mockExpenses.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Expense not found');
    const updatedExpense = { ...mockExpenses[index], ...expenseData } as Expense;
    mockExpenses[index] = updatedExpense;
    return updatedExpense;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    await delay();
    const index = mockExpenses.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Expense not found');
    mockExpenses.splice(index, 1);
    return { success: true };
  },
};

// Reminders API
export const remindersAPI = {
  getAll: async (): Promise<ApiResponse<typeof mockReminders>> => {
    await delay();
    return { data: mockReminders };
  },

  markAsCompleted: async (id: string): Promise<typeof mockReminders[0]> => {
    await delay();
    const reminder = mockReminders.find(r => r.id === id);
    if (!reminder) throw new Error('Reminder not found');
    reminder.status = 'completed';
    return reminder;
  },
};

// Dashboard/Stats API
interface DashboardFilters {
  propertyName?: string;
  startDate?: string;
  endDate?: string;
}

export const dashboardAPI = {
  getStats: async (filters?: DashboardFilters): Promise<DashboardStats> => {
    await delay();
    return calculateStats(filters);
  },
};

// Users/Managers API
export const usersAPI = {
  getAll: async (): Promise<ApiResponse<Manager[]>> => {
    await delay();
    // Return managers without passwords
    const managersWithoutPasswords = mockManagers.map(({ password, ...manager }) => manager);
    return { data: managersWithoutPasswords as Manager[] };
  },

  getById: async (id: string): Promise<Manager> => {
    await delay();
    const manager = mockManagers.find(m => m.id === id);
    if (!manager) throw new Error('Manager not found');
    const { password, ...managerWithoutPassword } = manager;
    return managerWithoutPassword as Manager;
  },

  create: async (managerData: Omit<Manager, 'id' | 'createdAt'>): Promise<Manager> => {
    await delay();
    const newManager: Manager = {
      id: Date.now().toString(),
      ...managerData,
      role: 'manager',
      createdAt: format(new Date(), 'yyyy-MM-dd'),
    };
    mockManagers.push(newManager);
    const { password, ...managerWithoutPassword } = newManager;
    return managerWithoutPassword as Manager;
  },

  update: async (id: string, managerData: Partial<Manager>): Promise<Manager> => {
    await delay();
    const index = mockManagers.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Manager not found');
    const updatedManager = { ...mockManagers[index], ...managerData } as Manager;
    mockManagers[index] = updatedManager;
    const { password, ...managerWithoutPassword } = updatedManager;
    return managerWithoutPassword as Manager;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    await delay();
    const index = mockManagers.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Manager not found');
    mockManagers.splice(index, 1);
    return { success: true };
  },

  changePassword: async (email: string, currentPassword: string, newPassword: string): Promise<{ success: boolean }> => {
    await delay();

    // Check both admin (in AuthContext mockUsers) and managers
    const manager = mockManagers.find(m => m.email === email);

    if (manager) {
      if (manager.password !== currentPassword) {
        throw new Error('Current password is incorrect');
      }
      manager.password = newPassword;
      return { success: true };
    }

    // If not a manager, might be admin - handle in AuthContext
    throw new Error('User not found');
  },
};
