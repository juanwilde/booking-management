import { mockBookings, mockExpenses, mockReminders, calculateStats } from './mockData';
import { Booking, Expense, ApiResponse, DashboardStats, BookingStatus, PaymentStatus, ExpenseCategory, ExpenseStatus } from '../types';

// Simulate API delay
const delay = (ms = 500): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

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
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    await delay();
    return calculateStats();
  },
};
