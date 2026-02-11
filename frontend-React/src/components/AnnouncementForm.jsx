import { useState } from 'react';
import PropTypes from 'prop-types';
import { Send } from 'lucide-react';

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

  const getButtonText = () => {
    if (loading) return 'Envoi...';
    if (editMode) return 'Mettre à jour';
    return 'Publier';
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {editMode ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
      </h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Titre de l'annonce"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Contenu
          </label>
          <textarea
            id="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Contenu de l'annonce"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4 mr-2" />
            {getButtonText()}
          </button>

          {editMode && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
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