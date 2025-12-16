import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { usersAPI } from '../services/api';
import { UserForm } from '../components/UserForm';
import { formatDate } from '../utils/translations';
import { Manager } from '../types';

export const Users = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    setLoading(true);
    try {
      const data = await usersAPI.getAll();
      setManagers(data.data);
    } catch (error) {
      console.error('Error loading managers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManager = () => {
    setEditingManager(null);
    setModalOpen(true);
  };

  const handleEditManager = (manager: Manager) => {
    setEditingManager(manager);
    setModalOpen(true);
  };

  const handleDeleteManager = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este gestor?')) {
      try {
        await usersAPI.delete(id);
        loadManagers();
      } catch (error) {
        console.error('Error deleting manager:', error);
      }
    }
  };

  const handleSaveManager = async () => {
    setModalOpen(false);
    loadManagers();
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
          <h1 className="text-2xl font-bold text-gray-900">Gestores</h1>
          <p className="text-gray-600 mt-1">Gestiona los usuarios gestores del sistema</p>
        </div>
        <Button onClick={handleCreateManager}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Gestor
        </Button>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Mostrando {managers.length} gestor{managers.length !== 1 ? 'es' : ''}
      </div>

      {/* Managers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correo Electrónico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Creación
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {managers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron gestores
                  </td>
                </tr>
              ) : (
                managers.map(manager => (
                  <tr key={manager.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {manager.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {manager.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {manager.createdAt ? formatDate(manager.createdAt, 'MMM dd, yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditManager(manager)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteManager(manager.id)}
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
        title={editingManager ? 'Editar Gestor' : 'Nuevo Gestor'}
        size="md"
      >
        <UserForm
          manager={editingManager}
          onSave={handleSaveManager}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
