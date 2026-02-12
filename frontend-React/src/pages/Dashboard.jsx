import { useState, useEffect } from 'react';
import AnnouncementForm from '../components/AnnouncementForm';
import AnnouncementCard from '../components/AnnouncementCard';
import announcementService from '../services/announcementService';
import { RefreshCw, MessageSquare, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAll();
      setAnnouncements(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des annonces');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (data) => {
    try {
      await announcementService.create(data);
      await fetchAnnouncements(); 
    } catch (err) {
      setError('Erreur lors de la création de l\'annonce');
      console.error(err);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await announcementService.update(id, data);
      await fetchAnnouncements();
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'annonce');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await announcementService.delete(id);
      await fetchAnnouncements();
    } catch (err) {
      setError('Erreur lors de la suppression de l\'annonce');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-1">Tableau des annonces</h1>
          <p className="text-neutral-500">Partagez des informations avec votre équipe</p>
        </div>
        <button
          onClick={fetchAnnouncements}
          className="flex items-center px-4 py-2.5 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-error-50 border border-error-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error-700">{error}</p>
        </div>
      )}

      <AnnouncementForm onSubmit={handleCreate} />

      {loading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          <p className="mt-4 text-neutral-600 font-medium">Chargement des annonces...</p>
        </div>
      )}
      
      {!loading && announcements.length === 0 && (
        <div className="text-center py-16 card">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
            <MessageSquare className="w-8 h-8 text-primary-600" />
          </div>
          <p className="text-neutral-700 text-lg font-medium">Aucune annonce pour le moment</p>
          <p className="text-neutral-500 text-sm mt-2">Soyez le premier à publier une annonce !</p>
        </div>
      )}
      
      {!loading && announcements.length > 0 && (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;