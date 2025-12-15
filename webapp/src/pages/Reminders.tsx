import { useState, useEffect } from 'react';
import { Bell, CheckCircle, Calendar, DollarSign, Mail } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { Button } from '../components/common/Button';
import { remindersAPI } from '../services/api';
import { formatDate } from '../utils/translations';
import { PaymentReminder } from '../types';

export const Reminders = () => {
  const [reminders, setReminders] = useState<PaymentReminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const data = await remindersAPI.getAll();
      setReminders(data.data);
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (id: string) => {
    try {
      await remindersAPI.markAsCompleted(id);
      loadReminders();
    } catch (error) {
      console.error('Error marking reminder as completed:', error);
    }
  };

  const getDaysUntilReminder = (reminderDate: string) => {
    return differenceInDays(new Date(reminderDate), new Date());
  };

  const getUrgencyColor = (reminderDate: string) => {
    const days = getDaysUntilReminder(reminderDate);
    if (days < 0) return 'bg-red-100 border-red-300 text-red-800';
    if (days === 0) return 'bg-orange-100 border-orange-300 text-orange-800';
    if (days <= 2) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    return 'bg-blue-100 border-blue-300 text-blue-800';
  };

  const getUrgencyText = (reminderDate: string) => {
    const days = getDaysUntilReminder(reminderDate);
    if (days < 0) return 'Vencido';
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Mañana';
    return `En ${days} días`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  const pendingReminders = reminders.filter(r => r.status === 'pending');
  const completedReminders = reminders.filter(r => r.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recordatorios de Pago</h1>
        <p className="text-gray-600 mt-1">
          Recordatorios para cobrar a los huéspedes 5 días antes del check-in
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recordatorios Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{pendingReminders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completados</p>
              <p className="text-2xl font-bold text-gray-900">{completedReminders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cantidad Total Pendiente</p>
              <p className="text-2xl font-bold text-gray-900">
                €{pendingReminders.reduce((sum, r) => sum + r.amountDue, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-900">
              Acerca de los Recordatorios de Pago
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Estos recordatorios se sincronizarán automáticamente con Google Calendar 5 días antes
              de la fecha de entrada de cada reserva para huéspedes con pagos pendientes o parciales.
              El backend manejará la integración real del calendario y las notificaciones por correo electrónico.
            </p>
          </div>
        </div>
      </div>

      {/* Pending Reminders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recordatorios Pendientes ({pendingReminders.length})
        </h3>

        {pendingReminders.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No hay recordatorios de pago pendientes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingReminders
              .sort((a, b) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime())
              .map(reminder => (
                <div
                  key={reminder.id}
                  className={`border-2 rounded-lg p-4 ${getUrgencyColor(
                    reminder.reminderDate
                  )}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-white bg-opacity-50">
                          {getUrgencyText(reminder.reminderDate)}
                        </span>
                        <span className="text-sm font-medium">
                          Recordatorio: {formatDate(reminder.reminderDate, 'MMM dd, yyyy')}
                        </span>
                      </div>

                      <h4 className="text-lg font-semibold mb-1">
                        {reminder.guestName}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          <span>{reminder.guestEmail}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            Entrada: {formatDate(reminder.checkIn, 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span className="font-semibold">
                            Cantidad Pendiente: €{reminder.amountDue}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <span>
                            Total: €{reminder.totalAmount}
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 text-sm italic">{reminder.message}</p>
                    </div>

                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleMarkCompleted(reminder.id)}
                      className="ml-4"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Marcar Cobrado
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recordatorios Completados ({completedReminders.length})
          </h3>

          <div className="space-y-3">
            {completedReminders.map(reminder => (
              <div
                key={reminder.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{reminder.guestName}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Entrada: {formatDate(reminder.checkIn, 'MMM dd, yyyy')} •
                      Cobrado: €{reminder.amountDue}
                    </p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-1" />
                    <span className="text-sm font-medium">Completado</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
