// Domain Models

export type BookingStatus = 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid' | 'partial' | 'pending';
export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'cash';

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  status: BookingStatus;
  propertyName: string;
  notes?: string;
}

export type ExpenseCategory = 'Cleaning' | 'Maintenance' | 'Fees' | 'Supplies' | 'BedSheets' | 'Others';
export type ExpenseStatus = 'paid' | 'pending';

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  vendor: string;
  status: ExpenseStatus;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  bookingId?: string;
}

export interface PaymentReminder {
  id: string;
  bookingId: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  reminderDate: string;
  amountDue: number;
  totalAmount: number;
  status: string;
  type: string;
  message: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalRevenue: number;
  netIncome: number;
  totalExpenses: number;
  upcomingBookings: number;
  activeBookings: number;
  pendingPayments: number;
  occupancyRate: number;
  totalBookings: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Auth Types
export type UserRole = 'admin' | 'manager';

export interface User {
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
