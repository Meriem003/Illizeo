import { useState } from 'react';
import PropTypes from 'prop-types';
import { Send, FileText, MessageSquare, Sparkles } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="card p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
          {editMode ? (
            <FileText className="w-6 h-6 text-white" />
          ) : (
            <Sparkles className="w-6 h-6 text-white" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold text-neutral-900">
            {editMode ? 'Modifier l\'annonce' : 'Créer une nouvelle annonce'}
          </h3>
          <p className="text-sm text-neutral-500">
            {editMode ? 'Mettez à jour les informations' : 'Partagez des informations avec votre équipe'}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-neutral-700 mb-2">
            Titre de l'annonce
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
              <FileText className="h-5 w-5 text-neutral-400 group-focus-within:text-primary-500" />
            </div>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-modern pl-12 hover:border-neutral-300 focus:shadow-lg focus:shadow-primary-500/10"
              placeholder="Ex: Nouvelle politique de télétravail"
            />
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-neutral-700 mb-2">
            Contenu de l'annonce
          </label>
          <div className="relative group">
            <textarea
              id="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="5"
              className="input-modern resize-none hover:border-neutral-300 focus:shadow-lg focus:shadow-primary-500/10"
              placeholder="Rédigez votre annonce en détail..."
            />
            <div className="absolute bottom-3 right-3 text-xs text-neutral-400">
              {content.length} caractères
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-neutral-100">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 sm:flex-none shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                {editMode ? 'Mettre à jour' : 'Publier l\'annonce'}
              </>
            )}
          </button>

          {editMode && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary px-8"
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