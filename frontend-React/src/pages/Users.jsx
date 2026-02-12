import { useState, useEffect } from 'react';
import UserTable from '../components/UserTable';
import AddUserModal from '../components/AddUserModal';
import userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { UserPlus, RefreshCw, Users as UsersIcon, AlertCircle, Shield, TrendingUp } from 'lucide-react';

const Users = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const data = await userService.getAll();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const adminCount = users.filter(u => u.is_admin).length;
  const employeeCount = users.filter(u => !u.is_admin).length;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">Gestion des employés</h1>
                <p className="text-neutral-500 text-sm mt-0.5">
                  Gérez votre équipe et leurs accès
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => fetchUsers(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all border border-neutral-200 hover:border-primary-200 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="font-medium">Actualiser</span>
            </button>
            {isAdmin() && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Ajouter un employé
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 hover:shadow-soft-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Employés</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">{users.length}</p>
            </div>
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center">
              <UsersIcon className="w-7 h-7 text-primary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-success-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="font-medium">Actifs</span>
          </div>
        </div>

        <div className="card p-6 hover:shadow-soft-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Administrateurs</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">{adminCount}</p>
            </div>
            <div className="w-14 h-14 bg-success-100 rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-success-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-neutral-500">
            <span>Accès complet</span>
          </div>
        </div>

        <div className="card p-6 hover:shadow-soft-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Employés</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">{employeeCount}</p>
            </div>
            <div className="w-14 h-14 bg-warning-100 rounded-2xl flex items-center justify-center">
              <UsersIcon className="w-7 h-7 text-warning-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-neutral-500">
            <span>Accès standard</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-error-50 border border-error-200 rounded-2xl animate-slide-in-right">
          <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-error-700">{error}</p>
          </div>
          <button 
            onClick={() => setError('')}
            className="text-error-600 hover:text-error-700"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-neutral-600 font-medium text-lg">Chargement des utilisateurs...</p>
          <p className="mt-2 text-neutral-400 text-sm">Veuillez patienter</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && users.length === 0 && (
        <div className="text-center py-20 card">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl mb-6 shadow-lg shadow-primary-500/10">
            <UsersIcon className="w-10 h-10 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">Aucun utilisateur</h3>
          <p className="text-neutral-500 max-w-md mx-auto mb-6">
            Commencez par ajouter des membres à votre équipe pour collaborer ensemble.
          </p>
          {isAdmin() && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary inline-flex shadow-lg shadow-primary-500/30"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Ajouter un employé
            </button>
          )}
        </div>
      )}

      {/* Users Table */}
      {!loading && users.length > 0 && (
        <UserTable users={users} onDelete={handleDelete} />
      )}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default Users;