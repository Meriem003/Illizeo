import PropTypes from 'prop-types';
import { Trash2, Shield, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../hooks/useAuth';

const UserTable = ({ users, onDelete }) => {
  const { user: currentUser, isAdmin } = useAuth();

  const handleDelete = (userId, userName) => {
    if (globalThis.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?`)) {
      onDelete(userId);
    }
  };

  return (
    <div className="card overflow-hidden">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              Utilisateur
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              Rôle
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              Date d'ajout
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm">
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-neutral-900">
                      {user.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-neutral-700">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.is_admin ? (
                  <span className="badge-success inline-flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </span>
                ) : (
                  <span className="badge-neutral inline-flex items-center">
                    Employé
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: fr })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {user.id === currentUser?.id ? (
                  <span className="text-neutral-400 text-xs font-medium">(Vous)</span>
                ) : isAdmin() ? (
                  <button
                    onClick={() => handleDelete(user.id, user.name)}
                    className="text-error-600 hover:text-error-700 hover:bg-error-50 px-3 py-1.5 rounded-lg inline-flex items-center transition-all"
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Supprimer
                  </button>
                ) : (
                  <span className="text-neutral-400 text-xs">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-500 font-medium">Aucun utilisateur trouvé</p>
        </div>
      )}
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      is_admin: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
      created_at: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserTable;