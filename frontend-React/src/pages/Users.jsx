import { useState, useEffect } from 'react';
import UserTable from '../components/UserTable';
import AddUserModal from '../components/AddUserModal';
import userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { UserPlus, RefreshCw, Users as UsersIcon, AlertCircle } from 'lucide-react';

const Users = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (userData) => {
    await userService.create(userData);
    await fetchUsers();
  };

  const handleDelete = async (userId) => {
    try {
      await userService.delete(userId);
      await fetchUsers();
    } catch (err) {
      setError('Erreur lors de la suppression de l\'utilisateur');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Gestion des employés</h1>
          <div className="flex items-center text-neutral-600">
            <UsersIcon className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              {users.length} employé{users.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchUsers}
            className="flex items-center px-4 py-2.5 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </button>
          {isAdmin() && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Ajouter un employé
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-error-50 border border-error-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          <p className="mt-4 text-neutral-600 font-medium">Chargement des utilisateurs...</p>
        </div>
      ) : (
        <UserTable users={users} onDelete={handleDelete} />
      )}

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default Users;