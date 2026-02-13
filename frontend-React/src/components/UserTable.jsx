import { useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Trash2, Shield, User as UserIcon, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../hooks/useAuth';

const UserTable = ({ users, onDelete }) => {
  const { user: currentUser, isAdmin } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteClick = (userId, userName) => {
    setUserToDelete({ id: userId, name: userName });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await onDelete(userToDelete.id);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  return (
    <>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Date d'ajout
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {users.map((user, index) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-neutral-50 transition-all group animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                        <UserIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-neutral-900">
                          {user.name}
                        </div>
                        {user.id === currentUser?.id && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary-100 text-xs font-medium text-primary-700 mt-1">
                            Vous
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-700 font-medium">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.is_admin ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-success-500 to-success-600 text-white text-xs font-semibold shadow-sm">
                        <Shield className="w-3.5 h-3.5 mr-1.5" />
                        Administrateur
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-semibold">
                        <UserIcon className="w-3.5 h-3.5 mr-1.5" />
                        Employé
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-neutral-600">
                      <Calendar className="w-4 h-4 mr-2 text-neutral-400" />
                      {format(new Date(user.created_at), 'dd MMM yyyy', { locale: fr })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.id === currentUser?.id ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-xs font-semibold">
                        Compte actuel
                      </span>
                    ) : isAdmin() ? (
                      <button
                        onClick={() => handleDeleteClick(user.id, user.name)}
                        className="inline-flex items-center px-4 py-2 text-error-600 hover:text-white hover:bg-error-600 rounded-lg transition-all shadow-sm hover:shadow-md"
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
        </div>

        {users.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 rounded-2xl mb-4">
              <UserIcon className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-500 font-medium text-lg">Aucun utilisateur trouvé</p>
            <p className="text-neutral-400 text-sm mt-1">Les utilisateurs apparaîtront ici une fois ajoutés</p>
          </div>
        )}
      </div>

      {showDeleteConfirm && userToDelete && createPortal(
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div 
            className="fixed inset-0" 
            onClick={handleCancelDelete}
          />
          <div className="card p-8 max-w-md w-full mx-4 animate-slide-in-right shadow-2xl relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-error-100 rounded-2xl flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-error-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-900">Confirmer la suppression</h3>
              </div>
            </div>
            
            <p className="text-neutral-600 mb-2 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer l'utilisateur
            </p>
            <p className="text-neutral-900 font-semibold mb-6">
              "{userToDelete.name}" ?
            </p>
            <p className="text-sm text-neutral-500 mb-8">
              Cette action est irréversible et supprimera définitivement toutes les données associées à cet utilisateur.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="btn-secondary flex-1"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn-danger flex-1 shadow-lg shadow-error-500/30"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
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