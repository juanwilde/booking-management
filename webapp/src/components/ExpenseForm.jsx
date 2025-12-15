import { useState, useEffect } from 'react';
import { Button } from './common/Button';
import { Input, Select, Textarea } from './common/Input';
import { expensesAPI } from '../services/api';

export const ExpenseForm = ({ expense, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Maintenance',
    description: '',
    amount: 0,
    paymentMethod: 'cash',
    vendor: '',
    status: 'pending',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expense) {
      setFormData(expense);
    }
  }, [expense]);

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

    if (!formData.date) newErrors.date = 'La fecha es obligatoria';
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
    if (!formData.vendor.trim()) newErrors.vendor = 'El proveedor es obligatorio';
    if (formData.amount <= 0) newErrors.amount = 'El monto debe ser mayor que 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      if (expense) {
        await expensesAPI.update(expense.id, formData);
      } else {
        await expensesAPI.create(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error saving expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Fecha *"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
        />

        <Select
          label="Categoría *"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="Maintenance">Mantenimiento</option>
          <option value="Utilities">Servicios Públicos</option>
          <option value="Cleaning">Limpieza</option>
          <option value="Supplies">Suministros</option>
          <option value="Other">Otro</option>
        </Select>

        <Input
          label="Proveedor *"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          error={errors.vendor}
          placeholder="Nombre del proveedor"
        />

        <Input
          label="Monto (€) *"
          name="amount"
          type="number"
          min="0"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount}
        />

        <Select
          label="Método de Pago *"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="cash">Efectivo</option>
          <option value="credit_card">Tarjeta de Crédito</option>
          <option value="bank_transfer">Transferencia Bancaria</option>
        </Select>

        <Select
          label="Estado *"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="pending">Pendiente</option>
          <option value="paid">Pagado</option>
        </Select>
      </div>

      <Textarea
        label="Descripción *"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        rows="3"
        placeholder="Describe el gasto..."
      />

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : expense ? 'Actualizar Gasto' : 'Crear Gasto'}
        </Button>
      </div>
    </form>
  );
};
