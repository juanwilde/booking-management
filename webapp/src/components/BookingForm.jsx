import { useState, useEffect } from 'react';
import { Button } from './common/Button';
import { Input, Select, Textarea } from './common/Input';
import { bookingsAPI } from '../services/api';
import { format } from 'date-fns';

export const BookingForm = ({ booking, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    totalPrice: 0,
    paidAmount: 0,
    paymentStatus: 'pending',
    paymentMethod: 'credit_card',
    status: 'confirmed',
    propertyName: 'Casa do Barqueiro',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (booking) {
      setFormData(booking);
    }
  }, [booking]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.guestName.trim()) newErrors.guestName = 'El nombre del huésped es obligatorio';
    if (!formData.guestEmail.trim()) newErrors.guestEmail = 'El correo electrónico es obligatorio';
    if (!formData.checkIn) newErrors.checkIn = 'La fecha de entrada es obligatoria';
    if (!formData.checkOut) newErrors.checkOut = 'La fecha de salida es obligatoria';
    if (formData.guests < 1) newErrors.guests = 'Se requiere al menos 1 huésped';
    if (formData.totalPrice < 0) newErrors.totalPrice = 'El precio total debe ser positivo';

    if (formData.checkIn && formData.checkOut) {
      if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
        newErrors.checkOut = 'La salida debe ser después de la entrada';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      if (booking) {
        await bookingsAPI.update(booking.id, formData);
      } else {
        await bookingsAPI.create(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Error saving booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre del Huésped *"
          name="guestName"
          value={formData.guestName}
          onChange={handleChange}
          error={errors.guestName}
          placeholder="Juan Pérez"
        />

        <Input
          label="Correo Electrónico del Huésped *"
          name="guestEmail"
          type="email"
          value={formData.guestEmail}
          onChange={handleChange}
          error={errors.guestEmail}
          placeholder="juan@ejemplo.com"
        />

        <Input
          label="Teléfono del Huésped"
          name="guestPhone"
          type="tel"
          value={formData.guestPhone}
          onChange={handleChange}
          placeholder="+34 123-456-789"
        />

        <Input
          label="Número de Huéspedes *"
          name="guests"
          type="number"
          min="1"
          value={formData.guests}
          onChange={handleChange}
          error={errors.guests}
        />

        <Input
          label="Fecha de Entrada *"
          name="checkIn"
          type="date"
          value={formData.checkIn}
          onChange={handleChange}
          error={errors.checkIn}
        />

        <Input
          label="Fecha de Salida *"
          name="checkOut"
          type="date"
          value={formData.checkOut}
          onChange={handleChange}
          error={errors.checkOut}
        />

        <Input
          label="Precio Total (€) *"
          name="totalPrice"
          type="number"
          min="0"
          step="0.01"
          value={formData.totalPrice}
          onChange={handleChange}
          error={errors.totalPrice}
        />

        <Input
          label="Monto Pagado (€)"
          name="paidAmount"
          type="number"
          min="0"
          step="0.01"
          value={formData.paidAmount}
          onChange={handleChange}
        />

        <Select
          label="Estado de Pago"
          name="paymentStatus"
          value={formData.paymentStatus}
          onChange={handleChange}
        >
          <option value="pending">Pendiente</option>
          <option value="partial">Parcial</option>
          <option value="paid">Pagado</option>
        </Select>

        <Select
          label="Método de Pago"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="credit_card">Tarjeta de Crédito</option>
          <option value="bank_transfer">Transferencia Bancaria</option>
          <option value="cash">Efectivo</option>
        </Select>

        <Select
          label="Estado de Reserva"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="confirmed">Confirmada</option>
          <option value="checked_in">Registrado</option>
          <option value="completed">Completada</option>
          <option value="cancelled">Cancelada</option>
        </Select>

        <Input
          label="Nombre de Propiedad"
          name="propertyName"
          value={formData.propertyName}
          onChange={handleChange}
        />
      </div>

      <Textarea
        label="Notas"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        rows="3"
        placeholder="Cualquier solicitud especial o notas..."
      />

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : booking ? 'Actualizar Reserva' : 'Crear Reserva'}
        </Button>
      </div>
    </form>
  );
};
