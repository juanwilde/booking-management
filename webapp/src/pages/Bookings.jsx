import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { bookingsAPI } from '../services/api';
import { BookingForm } from '../components/BookingForm';

export const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [viewingBooking, setViewingBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, paymentFilter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingsAPI.getAll();
      setBookings(data.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        b =>
          b.guestName.toLowerCase().includes(search) ||
          b.guestEmail.toLowerCase().includes(search)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    if (paymentFilter) {
      filtered = filtered.filter(b => b.paymentStatus === paymentFilter);
    }

    setFilteredBookings(filtered);
  };

  const handleCreateBooking = () => {
    setEditingBooking(null);
    setModalOpen(true);
  };

  const handleEditBooking = booking => {
    setEditingBooking(booking);
    setModalOpen(true);
  };

  const handleViewBooking = booking => {
    setViewingBooking(booking);
    setViewModalOpen(true);
  };

  const handleDeleteBooking = async id => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      try {
        await bookingsAPI.delete(id);
        loadBookings();
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const handleSaveBooking = async () => {
    setModalOpen(false);
    loadBookings();
  };

  const getStatusBadge = status => {
    const badges = {
      confirmed: 'bg-blue-100 text-blue-800',
      checked_in: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentBadge = status => {
    const badges = {
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
          <p className="text-gray-600 mt-1">
            Gestiona todas las reservas de propiedades
          </p>
        </div>
        <Button onClick={handleCreateBooking}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Reserva
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Buscar por nombre o correo del huésped..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Todos los Estados</option>
            <option value="confirmed">Confirmada</option>
            <option value="checked_in">Registrado</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </Select>
          <Select
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value)}
          >
            <option value="">Todos los Pagos</option>
            <option value="paid">Pagado</option>
            <option value="partial">Parcial</option>
            <option value="pending">Pendiente</option>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Mostrando {filteredBookings.length} de {bookings.length} reservas
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Huésped
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entrada / Salida
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Huéspedes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No se encontraron reservas
                  </td>
                </tr>
              ) : (
                filteredBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.guestName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.guestEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(booking.checkIn), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.guests}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          booking.status
                        )}`}
                      >
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentBadge(
                          booking.paymentStatus
                        )}`}
                      >
                        {booking.paymentStatus}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        €{booking.paidAmount} / €{booking.totalPrice}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      €{booking.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditBooking(booking)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBooking ? 'Editar Reserva' : 'Nueva Reserva'}
        size="lg"
      >
        <BookingForm
          booking={editingBooking}
          onSave={handleSaveBooking}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* View Modal */}
      {viewingBooking && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title="Detalles de Reserva"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nombre del Huésped</label>
                <p className="mt-1 text-sm text-gray-900">{viewingBooking.guestName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                <p className="mt-1 text-sm text-gray-900">{viewingBooking.guestEmail}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Teléfono</label>
                <p className="mt-1 text-sm text-gray-900">{viewingBooking.guestPhone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Huéspedes</label>
                <p className="mt-1 text-sm text-gray-900">{viewingBooking.guests}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Entrada</label>
                <p className="mt-1 text-sm text-gray-900">
                  {format(new Date(viewingBooking.checkIn), 'MMMM dd, yyyy')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Salida</label>
                <p className="mt-1 text-sm text-gray-900">
                  {format(new Date(viewingBooking.checkOut), 'MMMM dd, yyyy')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <p className="mt-1">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                      viewingBooking.status
                    )}`}
                  >
                    {viewingBooking.status.replace('_', ' ')}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Estado de Pago</label>
                <p className="mt-1">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentBadge(
                      viewingBooking.paymentStatus
                    )}`}
                  >
                    {viewingBooking.paymentStatus}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Precio Total</label>
                <p className="mt-1 text-sm text-gray-900">€{viewingBooking.totalPrice}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Monto Pagado</label>
                <p className="mt-1 text-sm text-gray-900">€{viewingBooking.paidAmount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Método de Pago</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                  {viewingBooking.paymentMethod.replace('_', ' ')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Propiedad</label>
                <p className="mt-1 text-sm text-gray-900">{viewingBooking.propertyName}</p>
              </div>
            </div>
            {viewingBooking.notes && (
              <div>
                <label className="text-sm font-medium text-gray-700">Notas</label>
                <p className="mt-1 text-sm text-gray-900">{viewingBooking.notes}</p>
              </div>
            )}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="secondary" onClick={() => setViewModalOpen(false)}>
                Cerrar
              </Button>
              <Button
                onClick={() => {
                  setViewModalOpen(false);
                  handleEditBooking(viewingBooking);
                }}
              >
                Editar Reserva
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
