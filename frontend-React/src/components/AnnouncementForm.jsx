import { useState } from 'react';
import PropTypes from 'prop-types';
import { Send, FileText, MessageSquare } from 'lucide-react';

const AnnouncementForm = ({ onSubmit, editMode = false, initialData = null, onCancel = null }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({ title, content });
      if (!editMode) {
        setTitle('');
        setContent('');
      }
    } catch (error) {
      console.error('Error submitting announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 mb-6">
      <h3 className="text-lg font-bold text-neutral-900 mb-5 flex items-center">
        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
          <MessageSquare className="w-4 h-4 text-primary-600" />
        </div>
        {editMode ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
      </h3>

      <div className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
            Titre
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-modern pl-11"
              placeholder="Titre de l'annonce"
            />
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-neutral-700 mb-2">
            Contenu
          </label>
          <textarea
            id="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            className="input-modern resize-none"
            placeholder="Rédigez votre annonce ici..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {editMode ? 'Mettre à jour' : 'Publier'}
              </>
            )}
          </button>

          {editMode && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Annuler
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

AnnouncementForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  initialData: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }),
  onCancel: PropTypes.func,
};

export default AnnouncementForm;