import { useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Edit2, Trash2, User, Calendar, MoreVertical, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../hooks/useAuth';
import AnnouncementForm from './AnnouncementForm';

const AnnouncementCard = ({ announcement, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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
      <div className="card p-6 shadow-soft-lg">
        <AnnouncementForm
          editMode={true}
          initialData={announcement}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(announcement.created_at), { 
    addSuffix: true, 
    locale: fr 
  });

  return (
    <>
      <div className="card-hover p-6 group relative transition-all duration-300 hover:scale-[1.01]">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500 to-primary-600 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-neutral-900 mb-1 line-clamp-2">
                  {announcement.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timeAgo}</span>
                </div>
              </div>
            </div>
            
            <div className="pl-13">
              <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {announcement.content}
              </p>
            </div>
          </div>

          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all"
                title="Plus d'options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowMenu(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-soft-lg border border-neutral-100 py-2 z-20 animate-slide-in-right">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="font-medium">Modifier</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error-600 hover:bg-error-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="font-medium">Supprimer</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 text-sm text-neutral-500 border-t border-neutral-100 pt-4 mt-5 pl-13">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-neutral-700">{announcement.user?.name || 'Anonyme'}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <Calendar className="w-4 h-4" />
            <span>
              {format(new Date(announcement.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
            </span>
          </div>
        </div>
      </div>

      {showDeleteConfirm && createPortal(
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div 
            className="fixed inset-0" 
            onClick={() => setShowDeleteConfirm(false)}
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
            
            <p className="text-neutral-600 mb-8 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
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