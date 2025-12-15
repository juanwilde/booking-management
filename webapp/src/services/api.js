import { mockBookings, mockExpenses, mockReminders, calculateStats } from './mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Bookings API
export const bookingsAPI = {
  getAll: async (filters = {}) => {
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

    return { data: filtered, total: filtered.length };
  },

  getById: async id => {
    await delay();
    const booking = mockBookings.find(b => b.id === parseInt(id));
    if (!booking) throw new Error('Booking not found');
    return booking;
  },

  create: async bookingData => {
    await delay();
    const newBooking = {
      id: Math.max(...mockBookings.map(b => b.id)) + 1,
      ...bookingData,
      createdAt: new Date().toISOString(),
    };
    mockBookings.push(newBooking);
    return newBooking;
  },

  update: async (id, bookingData) => {
    await delay();
    const index = mockBookings.findIndex(b => b.id === parseInt(id));
    if (index === -1) throw new Error('Booking not found');
    mockBookings[index] = { ...mockBookings[index], ...bookingData };
    return mockBookings[index];
  },

  delete: async id => {
    await delay();
    const index = mockBookings.findIndex(b => b.id === parseInt(id));
    if (index === -1) throw new Error('Booking not found');
    mockBookings.splice(index, 1);
    return { success: true };
  },
};

// Expenses API
export const expensesAPI = {
  getAll: async (filters = {}) => {
    await delay();
    let filtered = [...mockExpenses];

    if (filters.category) {
      filtered = filtered.filter(e => e.category === filters.category);
    }
    if (filters.status) {
      filtered = filtered.filter(e => e.status === filters.status);
    }

    return { data: filtered, total: filtered.length };
  },

  getById: async id => {
    await delay();
    const expense = mockExpenses.find(e => e.id === parseInt(id));
    if (!expense) throw new Error('Expense not found');
    return expense;
  },

  create: async expenseData => {
    await delay();
    const newExpense = {
      id: Math.max(...mockExpenses.map(e => e.id)) + 1,
      ...expenseData,
    };
    mockExpenses.push(newExpense);
    return newExpense;
  },

  update: async (id, expenseData) => {
    await delay();
    const index = mockExpenses.findIndex(e => e.id === parseInt(id));
    if (index === -1) throw new Error('Expense not found');
    mockExpenses[index] = { ...mockExpenses[index], ...expenseData };
    return mockExpenses[index];
  },

  delete: async id => {
    await delay();
    const index = mockExpenses.findIndex(e => e.id === parseInt(id));
    if (index === -1) throw new Error('Expense not found');
    mockExpenses.splice(index, 1);
    return { success: true };
  },
};

// Reminders API
export const remindersAPI = {
  getAll: async () => {
    await delay();
    return { data: mockReminders, total: mockReminders.length };
  },

  markAsCompleted: async id => {
    await delay();
    const reminder = mockReminders.find(r => r.id === id);
    if (!reminder) throw new Error('Reminder not found');
    reminder.status = 'completed';
    return reminder;
  },
};

// Dashboard/Stats API
export const dashboardAPI = {
  getStats: async () => {
    await delay();
    return calculateStats();
  },
};
