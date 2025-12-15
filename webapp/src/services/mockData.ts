import { addDays, subDays, format } from 'date-fns';
import { Booking, Expense, DashboardStats } from '../types';

// Generate mock bookings
export const mockBookings: Booking[] = [
  {
    id: '1',
    guestName: 'John Smith',
    guestEmail: 'john.smith@email.com',
    guestPhone: '+1 234-567-8901',
    checkIn: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    guests: 2,
    totalPrice: 450,
    paidAmount: 450,
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    status: 'confirmed',
    propertyName: 'Caiño',
    notes: 'Early check-in requested',
  },
  {
    id: '2',
    guestName: 'Maria Garcia',
    guestEmail: 'maria.garcia@email.com',
    guestPhone: '+34 612-345-678',
    checkIn: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 22), 'yyyy-MM-dd'),
    guests: 4,
    totalPrice: 980,
    paidAmount: 0,
    paymentStatus: 'pending',
    paymentMethod: 'credit_card',
    status: 'confirmed',
    propertyName: 'Loureira',
    notes: '',
  },
  {
    id: '3',
    guestName: 'David Johnson',
    guestEmail: 'david.j@email.com',
    guestPhone: '+44 7700-900123',
    checkIn: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    guests: 3,
    totalPrice: 650,
    paidAmount: 650,
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    status: 'checked_in',
    propertyName: 'Treixadura',
    notes: 'Vegetarian guests',
  },
  {
    id: '4',
    guestName: 'Sophie Martin',
    guestEmail: 'sophie.martin@email.com',
    guestPhone: '+33 6-12-34-56-78',
    checkIn: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 37), 'yyyy-MM-dd'),
    guests: 2,
    totalPrice: 770,
    paidAmount: 200,
    paymentStatus: 'partial',
    paymentMethod: 'credit_card',
    status: 'confirmed',
    propertyName: 'Caiño',
    notes: 'Anniversary trip',
  },
  {
    id: '5',
    guestName: 'Robert Brown',
    guestEmail: 'robert.brown@email.com',
    guestPhone: '+1 555-123-4567',
    checkIn: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    checkOut: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    guests: 5,
    totalPrice: 800,
    paidAmount: 800,
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    status: 'completed',
    propertyName: 'Loureira',
    notes: '',
  },
];

// Generate mock expenses
export const mockExpenses: Expense[] = [
  {
    id: '1',
    date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    category: 'Maintenance',
    description: 'Reparación de fontanería - fregadero de cocina',
    amount: 120,
    paymentMethod: 'cash',
    vendor: 'Fontanería Local',
    status: 'paid',
  },
  {
    id: '2',
    date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    category: 'Fees',
    description: 'Comisión de plataforma - Booking.com',
    amount: 85,
    paymentMethod: 'bank_transfer',
    vendor: 'Booking.com',
    status: 'paid',
  },
  {
    id: '3',
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    category: 'Cleaning',
    description: 'Limpieza profunda profesional',
    amount: 150,
    paymentMethod: 'credit_card',
    vendor: 'Servicios de Limpieza',
    status: 'paid',
  },
  {
    id: '4',
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    category: 'BedSheets',
    description: 'Sábanas y toallas nuevas',
    amount: 280,
    paymentMethod: 'credit_card',
    vendor: 'Tienda de Ropa de Hogar',
    status: 'pending',
  },
  {
    id: '5',
    date: format(new Date(), 'yyyy-MM-dd'),
    category: 'Supplies',
    description: 'Productos de limpieza y amenidades',
    amount: 45,
    paymentMethod: 'bank_transfer',
    vendor: 'Proveedor de Suministros',
    status: 'pending',
  },
];

interface PaymentReminder {
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

// Generate reminders based on bookings (5 days before check-in for unpaid/partial)
export const generateReminders = (): PaymentReminder[] => {
  return mockBookings
    .filter(booking => {
      const checkInDate = new Date(booking.checkIn);
      const reminderDate = subDays(checkInDate, 5);
      const today = new Date();

      // Include if reminder date is within +/- 10 days and payment is not complete
      return (
        (booking.paymentStatus === 'pending' || booking.paymentStatus === 'partial') &&
        Math.abs(reminderDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 10
      );
    })
    .map(booking => ({
      id: `reminder-${booking.id}`,
      bookingId: booking.id,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      checkIn: booking.checkIn,
      reminderDate: format(subDays(new Date(booking.checkIn), 5), 'yyyy-MM-dd'),
      amountDue: booking.totalPrice - booking.paidAmount,
      totalAmount: booking.totalPrice,
      status: 'pending',
      type: 'payment_reminder',
      message: `Reminder to charge ${booking.guestName} for booking (Check-in: ${booking.checkIn})`,
    }));
};

export const mockReminders = generateReminders();

// Stats calculation
export const calculateStats = (): DashboardStats => {
  const totalRevenue = mockBookings.reduce((sum, b) => sum + b.paidAmount, 0);
  const totalExpenses = mockExpenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const pendingPayments = mockBookings
    .filter(b => b.paymentStatus !== 'paid')
    .reduce((sum, b) => sum + (b.totalPrice - b.paidAmount), 0);

  const today = new Date();
  const upcomingBookings = mockBookings.filter(b => {
    const checkIn = new Date(b.checkIn);
    return checkIn >= today && b.status !== 'cancelled' && b.status !== 'completed';
  }).length;

  const activeBookings = mockBookings.filter(b => b.status === 'checked_in').length;

  return {
    totalRevenue,
    totalExpenses,
    netIncome: totalRevenue - totalExpenses,
    pendingPayments,
    upcomingBookings,
    activeBookings,
    totalBookings: mockBookings.length,
    occupancyRate: 75, // Mock occupancy rate
  };
};
