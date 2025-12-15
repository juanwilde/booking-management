import { BookingStatus, PaymentStatus, ExpenseCategory, ExpenseStatus, PaymentMethod } from '../types';
import { format as dateFnsFormat } from 'date-fns';
import { es } from 'date-fns/locale';

// Translation helpers for displaying values in Spanish

// Helper to format dates in Spanish with capitalized month
export const formatDate = (date: Date | string, formatStr: string): string => {
  const formatted = dateFnsFormat(new Date(date), formatStr, { locale: es });
  // Capitalize first letter of the formatted string (for month names)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const translateBookingStatus = (status: BookingStatus): string => {
  const translations: Record<BookingStatus, string> = {
    confirmed: 'Confirmada',
    checked_in: 'Registrado',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };
  return translations[status];
};

export const translatePaymentStatus = (status: PaymentStatus): string => {
  const translations: Record<PaymentStatus, string> = {
    paid: 'Pagado',
    partial: 'Parcial',
    pending: 'Pendiente',
  };
  return translations[status];
};

export const translatePaymentMethod = (method: PaymentMethod): string => {
  const translations: Record<PaymentMethod, string> = {
    credit_card: 'Tarjeta de Crédito',
    bank_transfer: 'Transferencia Bancaria',
    cash: 'Efectivo',
  };
  return translations[method];
};

export const translateExpenseCategory = (category: ExpenseCategory): string => {
  const translations: Record<ExpenseCategory, string> = {
    Cleaning: 'Limpieza',
    Maintenance: 'Mantenimiento',
    Fees: 'Comisiones',
    Supplies: 'Suministros',
    BedSheets: 'Ropa de Cama',
    Others: 'Otros',
  };
  return translations[category];
};

export const translateExpenseStatus = (status: ExpenseStatus): string => {
  const translations: Record<ExpenseStatus, string> = {
    paid: 'Pagado',
    pending: 'Pendiente',
  };
  return translations[status];
};
