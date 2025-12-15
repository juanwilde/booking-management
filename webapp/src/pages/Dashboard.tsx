import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  AlertCircle,
} from 'lucide-react';
import { StatCard } from '../components/common/Card';
import { dashboardAPI, bookingsAPI } from '../services/api';
import { translatePaymentStatus, formatDate } from '../utils/translations';
import { DashboardStats, Booking } from '../types';

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, bookingsData] = await Promise.all([
        dashboardAPI.getStats(),
        bookingsAPI.getAll({ status: 'confirmed' }),
      ]);

      setStats(statsData);

      // Get next 5 upcoming bookings
      const upcoming = bookingsData.data
        .filter(b => new Date(b.checkIn) >= new Date())
        .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
        .slice(0, 5);

      setUpcomingBookings(upcoming);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">No se pudieron cargar las estadísticas</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
        <p className="text-gray-600 mt-1">Vista general de tus operaciones de reserva</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ingresos Totales"
          value={`€${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ direction: 'up', value: '12%', label: 'vs mes anterior' }}
        />
        <StatCard
          title="Ingreso Neto"
          value={`€${stats.netIncome.toLocaleString()}`}
          icon={TrendingUp}
          subtitle={`Gastos: €${stats.totalExpenses.toLocaleString()}`}
        />
        <StatCard
          title="Reservas Próximas"
          value={stats.upcomingBookings}
          icon={Calendar}
          subtitle={`${stats.activeBookings} actualmente activas`}
        />
        <StatCard
          title="Pagos Pendientes"
          value={`€${stats.pendingPayments.toLocaleString()}`}
          icon={AlertCircle}
          subtitle="Esperando pago"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Occupancy Rate */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tasa de Ocupación
          </h3>
          <div className="flex items-end space-x-2">
            <span className="text-4xl font-bold text-blue-600">
              {stats.occupancyRate}%
            </span>
            <span className="text-gray-600 mb-2">este mes</span>
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${stats.occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estadísticas Rápidas
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Reservas Totales</span>
              <span className="font-semibold text-gray-900">
                {stats.totalBookings}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Reservas Activas</span>
              <span className="font-semibold text-gray-900">
                {stats.activeBookings}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Promedio de Reserva</span>
              <span className="font-semibold text-gray-900">
                €{Math.round(stats.totalRevenue / stats.totalBookings)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Reservas Próximas
          </h3>
          <Link
            to="/bookings"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Ver todas →
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay reservas próximas
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Huésped
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entrada
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salida
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Huéspedes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pago
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.guestName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.guestEmail}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(booking.checkIn, 'MMM dd, yyyy')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(booking.checkOut, 'MMM dd, yyyy')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {booking.guests}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : booking.paymentStatus === 'partial'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {translatePaymentStatus(booking.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      €{booking.totalPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
