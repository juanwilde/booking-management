import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { expensesAPI } from '../services/api';
import { ExpenseForm } from '../components/ExpenseForm';
import { translateExpenseCategory, translateExpenseStatus, translatePaymentMethod, formatDate } from '../utils/translations';
import { Expense } from '../types';

export const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, categoryFilter, statusFilter]);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await expensesAPI.getAll();
      setExpenses(data.data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterExpenses = () => {
    let filtered = [...expenses];

    if (categoryFilter) {
      filtered = filtered.filter(e => e.category === categoryFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(e => e.status === statusFilter);
    }

    setFilteredExpenses(filtered);
  };

  const handleCreateExpense = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      try {
        await expensesAPI.delete(id);
        loadExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const handleSaveExpense = async () => {
    setModalOpen(false);
    loadExpenses();
  };

  const calculateTotals = () => {
    const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const paid = filteredExpenses
      .filter(e => e.status === 'paid')
      .reduce((sum, e) => sum + e.amount, 0);
    const pending = filteredExpenses
      .filter(e => e.status === 'pending')
      .reduce((sum, e) => sum + e.amount, 0);

    return { total, paid, pending };
  };

  const totals = calculateTotals();

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
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
          <h1 className="text-2xl font-bold text-gray-900">Gastos</h1>
          <p className="text-gray-600 mt-1">Rastrea y gestiona los gastos de propiedades</p>
        </div>
        <Button onClick={handleCreateExpense}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Gasto
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600">Gastos Totales</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            €{totals.total.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600">Pagado</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            €{totals.paid.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600">Pendiente</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            €{totals.pending.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas las Categorías</option>
            <option value="Cleaning">Limpieza</option>
            <option value="Maintenance">Mantenimiento</option>
            <option value="Fees">Comisiones</option>
            <option value="Supplies">Suministros</option>
            <option value="BedSheets">Ropa de Cama</option>
            <option value="Others">Otros</option>
          </Select>
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Todos los Estados</option>
            <option value="paid">Pagado</option>
            <option value="pending">Pendiente</option>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Mostrando {filteredExpenses.length} de {expenses.length} gastos
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método de Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron gastos
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(expense => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(expense.date, 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {translateExpenseCategory(expense.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.vendor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {translatePaymentMethod(expense.paymentMethod)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          expense.status
                        )}`}
                      >
                        {translateExpenseStatus(expense.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      €{expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditExpense(expense)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
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
        title={editingExpense ? 'Editar Gasto' : 'Nuevo Gasto'}
        size="md"
      >
        <ExpenseForm
          expense={editingExpense}
          onSave={handleSaveExpense}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
