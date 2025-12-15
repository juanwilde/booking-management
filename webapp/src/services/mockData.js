import { addDays, subDays, format } from 'date-fns';

// Generate mock bookings
export const mockBookings = [
  {
    id: 1,
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
    propertyName: 'Casa do Barqueiro',
    notes: 'Early check-in requested',
    createdAt: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
  },
  {
    id: 2,
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
    propertyName: 'Casa do Barqueiro',
    notes: '',
    createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
  },
  {
    id: 3,
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
    propertyName: 'Casa do Barqueiro',
    notes: 'Vegetarian guests',
    createdAt: format(subDays(new Date(), 20), 'yyyy-MM-dd'),
  },
  {
    id: 4,
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
    propertyName: 'Casa do Barqueiro',
    notes: 'Anniversary trip',
    createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
  },
  {
    id: 5,
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
    propertyName: 'Casa do Barqueiro',
    notes: '',
    createdAt: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
  },
];

// Generate mock expenses
export const mockExpenses = [
  {
    id: 1,
    date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    category: 'Maintenance',
    description: 'Plumber service - kitchen sink repair',
    amount: 120,
    paymentMethod: 'cash',
    vendor: 'Local Plumbing Co.',
    status: 'paid',
  },
  {
    id: 2,
    date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    category: 'Utilities',
    description: 'Electricity bill - November',
    amount: 85,
    paymentMethod: 'bank_transfer',
    vendor: 'Energy Company',
    status: 'paid',
  },
  {
    id: 3,
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    category: 'Cleaning',
    description: 'Professional deep cleaning',
    amount: 150,
    paymentMethod: 'credit_card',
    vendor: 'Clean & Shine Services',
    status: 'paid',
  },
  {
    id: 4,
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    category: 'Supplies',
    description: 'Linens and towels replacement',
    amount: 280,
    paymentMethod: 'credit_card',
    vendor: 'Home Essentials Store',
    status: 'pending',
  },
  {
    id: 5,
    date: format(new Date(), 'yyyy-MM-dd'),
    category: 'Utilities',
    description: 'Water bill - November',
    amount: 45,
    paymentMethod: 'bank_transfer',
    vendor: 'Water Utility',
    status: 'pending',
  },
];

// Generate reminders based on bookings (5 days before check-in for unpaid/partial)
export const generateReminders = () => {
  return mockBookings
    .filter(booking => {
      const checkInDate = new Date(booking.checkIn);
      const reminderDate = subDays(checkInDate, 5);
      const today = new Date();

      // Include if reminder date is within +/- 10 days and payment is not complete
      return (
        (booking.paymentStatus === 'pending' || booking.paymentStatus === 'partial') &&
        Math.abs(reminderDate - today) / (1000 * 60 * 60 * 24) <= 10
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
export const calculateStats = () => {
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
