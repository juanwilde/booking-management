import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { StatCard } from '../components/common/Card';
import { Input, Select } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { PropertyMetrics } from '../components/PropertyMetrics';
import { dashboardAPI, bookingsAPI } from '../services/api';
import { translatePaymentStatus, formatDate } from '../utils/translations';
import { DashboardStats, Booking } from '../types';

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyFilter, setPropertyFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [propertyFilter, startDate, endDate]);

  const handleResetFilters = () => {
    setPropertyFilter('');
    setStartDate('');
    setEndDate('');
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const filters = {
        ...(propertyFilter && { propertyName: propertyFilter }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };

      const [statsData, bookingsData] = await Promise.all([
        dashboardAPI.getStats(filters),
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <Select
              label="Propiedad"
              value={propertyFilter}
              onChange={e => setPropertyFilter(e.target.value)}
            >
              <option value="">Todas las Propiedades</option>
              <option value="Caiño">Caiño</option>
              <option value="Loureira">Loureira</option>
              <option value="Treixadura">Treixadura</option>
            </Select>

            <Input
              label="Fecha Desde"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />

            <Input
              label="Fecha Hasta"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={handleResetFilters}
              className="px-3 py-2.5"
              title="Resetear Filtros"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Reservas Totales</p>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalBookings}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Reservas Activas</p>
          <p className="text-3xl font-bold text-gray-900">
            {stats.activeBookings}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Valor Promedio de Reserva</p>
          <p className="text-3xl font-bold text-gray-900">
            €{stats.totalBookings > 0 ? Math.round(stats.totalRevenue / stats.totalBookings) : 0}
          </p>
        </div>
      </div>

      {/* Property Metrics */}
      <PropertyMetrics metrics={stats.propertyMetrics} />

      {/* Separator */}
      <div className="border-t-2 border-gray-300 my-8"></div>

      {/* Occupancy Rate - Full Width */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tasa de Ocupación
        </h3>
        <div className="flex items-end space-x-2 mb-4">
          <span className="text-4xl font-bold text-blue-600">
            {stats.occupancyRate}%
          </span>
          <span className="text-gray-600 mb-2">este mes</span>
        </div>
        <div className="bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${stats.occupancyRate}%` }}
          />
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
