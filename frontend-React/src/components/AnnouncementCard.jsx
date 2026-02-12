import { useState } from 'react';
import PropTypes from 'prop-types';
import { Edit2, Trash2, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../hooks/useAuth';
import AnnouncementForm from './AnnouncementForm';

const AnnouncementCard = ({ announcement, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = user?.id === announcement.user_id;

  const handleUpdate = async (data) => {
    await onUpdate(announcement.id, data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await onDelete(announcement.id);
    setShowDeleteConfirm(false);
  };

  if (isEditing) {
    return (
      <div className="card p-6">
        <AnnouncementForm
          editMode={true}
          initialData={announcement}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="card-hover p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-neutral-900 mb-3">
            {announcement.title}
          </h3>
          <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
            {announcement.content}
          </p>
        </div>

        {isOwner && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              title="Modifier"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2.5 text-error-600 hover:bg-error-50 rounded-lg transition-all"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 text-sm text-neutral-500 border-t border-neutral-200 pt-4 mt-4">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
            <User className="w-3.5 h-3.5 text-primary-600" />
          </div>
          <span className="font-medium">{announcement.user?.name || 'Anonyme'}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-neutral-400" />
          <span>
            {format(new Date(announcement.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
          </span>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-neutral-900 mb-3">Confirmer la suppression</h3>
            <p className="text-neutral-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AnnouncementCard.propTypes = {
  announcement: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user_id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AnnouncementCard;